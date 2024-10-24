const express = require('express');
const router = express.Router();
const { createBackup, restoreBackup } = require('../utils/backupRestore');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../backups'));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

// Create backup
router.post('/backup', async (req, res) => {
  try {
    const fileName = await createBackup();
    res.download(path.join(__dirname, '../backups', fileName));
  } catch (error) {
    res.status(500).json({ error: 'Failed to create backup' });
  }
});

// Restore backup
router.post('/restore', upload.single('backup'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No backup file provided' });
    }

    const backupData = await fs.readFile(req.file.path, 'utf8');
    await restoreBackup(backupData);
    
    res.json({ message: 'Backup restored successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to restore backup' });
  }
});

module.exports = router;