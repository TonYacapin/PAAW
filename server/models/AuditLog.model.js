const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  action: { type: String, required: true }, // e.g., Viewed, Added, Updated, Removed
  resource: { type: String, required: true }, // e.g., User Information, Product Catalog
  resourceId: { type: mongoose.Schema.Types.ObjectId, required: false }, // Optional, e.g., User ID
  timestamp: { type: Date, default: Date.now }, // When the action occurred
  user: { type: String, required: true }, // User's email or identifier
  outcome: { type: String, required: true }, // e.g., Successful, Failed
  description: { type: String, default: '' }, // Optional description or additional info
  details: {
    ipAddress: { type: String, default: '' }, // IP address of the user
    deviceInfo: { type: String, default: '' }, // User agent (browser/device info)
    queryParameters: { type: Object, default: {} }, // Query parameters (if any)
    requestData: { type: Object, default: {} }, // Request body data
    responseData: { type: Object, default: {} }, // Response data
    duration: { type: String, default: '' }, // Execution time for the request
  },
});

module.exports = mongoose.model('AuditLog', auditLogSchema);
