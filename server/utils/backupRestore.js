const mongoose = require('mongoose');
const fs = require('fs').promises;
const path = require('path');

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
    const fileName = `backup-${timestamp}.json`;
    
    // Ensure backups directory exists
    await fs.mkdir(backupPath, { recursive: true });
    
    // Write backup file
    await fs.writeFile(
      path.join(backupPath, fileName),
      JSON.stringify(backup, null, 2)
    );
    
    return fileName;
  } catch (error) {
    console.error('Backup creation failed:', error);
    throw error;
  }
}

async function restoreBackup(backupData) {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    // Parse backup data if it's a string
    const backup = typeof backupData === 'string' ? JSON.parse(backupData) : backupData;
    
    // Get all existing collections
    const collections = await getAllCollections();
    
    // Drop existing collections
    for (const collectionName of collections) {
      await mongoose.connection.db.collection(collectionName).deleteMany({});
    }
    
    // Restore data from backup
    for (const [collectionName, documents] of Object.entries(backup)) {
      if (documents.length > 0) {
        await mongoose.connection.db
          .collection(collectionName)
          .insertMany(documents, { session });
      }
    }
    
    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}

module.exports = { createBackup, restoreBackup };