const express = require('express');
const router = express.Router();
const { createBackup, restoreBackup } = require('../utils/backupRestore');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const fsSync = require('fs');

// Configure multer for large file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, '../backups');
    if (!fsSync.existsSync(dir)) {
      fsSync.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, `restore-${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 200 // 200MB limit
  }
});

// Create backup
router.post('/backup', async (req, res) => {
  try {
    const fileName = await createBackup();
    const filePath = path.join(__dirname, '../backups', fileName);
    const stat = await fs.stat(filePath);

    res.writeHead(200, {
      'Content-Type': 'application/gzip',
      'Content-Length': stat.size,
      'Content-Disposition': `attachment; filename="${fileName}"`,
      'Transfer-Encoding': 'chunked'
    });

    const readStream = fsSync.createReadStream(filePath);
    readStream.pipe(res);

    readStream.on('end', async () => {
      console.log('Backup file streamed successfully');
    });

    readStream.on('error', (error) => {
      console.error('Error streaming backup file:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Failed to stream backup file' });
      }
    });
  } catch (error) {
    console.error('Error creating backup:', error);
    res.status(500).json({ error: 'Failed to create backup' });
  }
});

// Restore backup
router.post('/restore', upload.single('backup'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No backup file provided' 
      });
    }

    await restoreBackup(req.file.path);

    await fs.unlink(req.file.path);

    res.json({ 
      success: true, 
      message: 'Backup restored successfully' 
    });
  } catch (error) {
    console.error('Error restoring backup:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to restore backup' 
    });
  }
});

module.exports = router;
