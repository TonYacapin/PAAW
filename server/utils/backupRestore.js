// Backend: backup-restore.js
const mongoose = require('mongoose');
const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
const zlib = require('zlib');
const util = require('util');

// Convert callback-based zlib methods to promises
const gunzipAsync = util.promisify(zlib.gunzip);

async function getAllCollections() {
  const collections = await mongoose.connection.db.collections();
  return collections.map(collection => collection.collectionName);
}

async function createBackup() {
  try {
    const backup = {};
    const collections = await getAllCollections();

    for (const collectionName of collections) {
      const documents = await mongoose.connection.db
        .collection(collectionName)
        .find({})
        .toArray();

      backup[collectionName] = documents;
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(__dirname, '../backups');
    const fileName = `backup-${timestamp}.json.gz`;
    const filePath = path.join(backupPath, fileName);

    // Ensure backups directory exists
    await fs.mkdir(backupPath, { recursive: true });

    // Write backup file and compress it
    const jsonString = JSON.stringify(backup);
    const compressed = zlib.gzipSync(jsonString); // Use sync version for simplicity
    await fs.writeFile(filePath, compressed);

    return fileName;
  } catch (error) {
    console.error('Backup creation failed:', error);
    throw error;
  }
}

async function restoreBackup(filePath) {
  try {
    // Read and decompress the file
    const compressedData = await fs.readFile(filePath);
    const decompressedData = await gunzipAsync(compressedData);
    const backup = JSON.parse(decompressedData.toString());

    // Verify backup data structure
    if (!backup || typeof backup !== 'object') {
      throw new Error('Invalid backup file format');
    }

    // Get current collections
    const collections = await getAllCollections();

    // Clear existing collections
    for (const collectionName of collections) {
      await mongoose.connection.db
        .collection(collectionName)
        .deleteMany({});
    }

    // Restore collections from backup
    for (const [collectionName, documents] of Object.entries(backup)) {
      if (!Array.isArray(documents)) {
        throw new Error(`Invalid data format for collection: ${collectionName}`);
      }

      if (documents.length > 0) {
        await mongoose.connection.db
          .collection(collectionName)
          .insertMany(documents);
      }
    }

    console.log("Restore completed successfully.");
  } catch (error) {
    console.error('Restore failed:', error);
    throw new Error(`Restore failed: ${error.message}`);
  }
}

module.exports = { createBackup, restoreBackup };