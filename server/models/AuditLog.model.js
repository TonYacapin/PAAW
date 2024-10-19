const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  action: { type: String, required: true }, // e.g., POST, GET, DELETE
  collectionName: { type: String, required: true }, // e.g., /api/users
  documentId: { type: mongoose.Schema.Types.ObjectId, required: false }, // Optional, e.g., User ID
  timestamp: { type: Date, default: Date.now }, // When the action occurred
  user: { type: String, required: true }, // User's email or identifier
  status: { type: String, required: true }, // e.g., Success, Failure
  message: { type: String, default: '' }, // Optional message or description
  additionalInfo: {
    ipAddress: { type: String, default: '' }, // IP address of the user
    userAgent: { type: String, default: '' }, // User agent (browser/device info)
    queryParams: { type: Object, default: {} }, // Query parameters (if any)
    requestBody: { type: Object, default: {} }, // Request body data
    responseBody: { type: Object, default: {} }, // Response data
    executionTime: { type: String, default: '' }, // Execution time for the request
  },
});

module.exports = mongoose.model('AuditLog', auditLogSchema);
