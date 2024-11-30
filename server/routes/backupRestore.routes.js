const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // Import fs directly
const fsPromises = require('fs').promises; // For async operations
const { createBackup, restoreBackup } = require('../utils/backupRestore');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) { // Use fs.existsSync
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Keep original filename
    cb(null, file.originalname);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    // Log incoming file details
    console.log('Incoming file:', file);
    
    if (!file.originalname.endsWith('.gz')) {
      return cb(new Error('Only .gz files are allowed'));
    }
    cb(null, true);
  }
}).single('backup'); // 'backup' is the field name

// Backup endpoint
router.post('/backup', async (req, res) => {
  try {
    const fileName = await createBackup();
    const filePath = path.join(__dirname, '../backups', fileName);
    res.download(filePath, fileName);
  } catch (error) {
    console.error('Backup creation failed:', error);
    res.status(500).json({ message: error.message });
  }
});

// Restore endpoint
router.post('/restore', (req, res) => {
  upload(req, res, async function(err) {
    try {
      console.log('Headers:', req.headers);
      console.log('Files:', req.files);
      console.log('File:', req.file);

      if (err instanceof multer.MulterError) {
        console.error('Multer error:', err);
        return res.status(400).json({ message: `Upload error: ${err.message}` });
      } else if (err) {
        console.error('Unknown error:', err);
        return res.status(400).json({ message: err.message });
      }

      if (!req.file) {
        console.error('No file received');
        return res.status(400).json({ message: 'No backup file provided' });
      }

      console.log('File received:', req.file.path);
      
      await restoreBackup(req.file.path);
      
      await fsPromises.unlink(req.file.path); // Use fsPromises for async

      res.json({ message: 'Database restored successfully' });
    } catch (error) {
      console.error('Restore failed:', error);
      res.status(500).json({ message: error.message });
    }
  });
});

module.exports = router;
