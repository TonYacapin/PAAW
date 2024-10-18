// models/AuditLog.model.js
const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  action: { type: String, required: true }, // e.g., login
  collectionName: { type: String, required: true }, // e.g., User
  documentId: { type: mongoose.Schema.Types.ObjectId, required: true }, // User ID
  timestamp: { type: Date, default: Date.now }, // When the action occurred
  user: { type: String, required: true }, // User's email or identifier
  status: { type: String, required: true }, // Success or failure
  message: { type: String }, // Optional message, e.g., error message
});

module.exports = mongoose.model('AuditLog', auditLogSchema);
