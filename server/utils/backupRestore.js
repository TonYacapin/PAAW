const mongoose = require('mongoose');
const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
const zlib = require('zlib');

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
      const fileName = `backup-${timestamp}.json.gz`; // Compress file
      const filePath = path.join(backupPath, fileName);
  
      // Ensure backups directory exists
      try {
        await fs.mkdir(backupPath, { recursive: true });
      } catch (dirError) {
        console.error('Failed to create backups directory:', dirError);
        throw new Error(`Could not create backups directory: ${dirError.message}`);
      }
  
      // Write backup file and compress it
      const jsonString = JSON.stringify(backup, null, 2);
      const gzip = zlib.createGzip();
      const writeStream = fsSync.createWriteStream(filePath);
      const stream = require('stream');
      const bufferStream = new stream.PassThrough();
      bufferStream.end(Buffer.from(jsonString));
  
      // Pipe the JSON data through gzip to the write stream
      bufferStream.pipe(gzip).pipe(writeStream);
  
      // Wait until the file is fully written
      await new Promise((resolve, reject) => {
        writeStream.on('finish', resolve);
        writeStream.on('error', reject);
      });
  
      // Verify the file was created successfully
      try {
        await fs.access(filePath);
      } catch (error) {
        console.error('Backup file not found after creation:', error);
        throw new Error(`Failed to verify backup file creation: ${error.message}`);
      }
  
      return fileName;
    } catch (error) {
      console.error('Backup creation failed:', error);
      throw error;
    }
  }
  

async function restoreBackup(filePath) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const gunzip = zlib.createGunzip();
    const fileStream = fsSync.createReadStream(filePath).pipe(gunzip);

    // Parse JSON incrementally
    let jsonString = '';
    for await (const chunk of fileStream) {
      jsonString += chunk.toString();
    }

    const backup = JSON.parse(jsonString);
    const collections = await getAllCollections();

    for (const collectionName of collections) {
      await mongoose.connection.db.collection(collectionName).deleteMany({});
    }

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
