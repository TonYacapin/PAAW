const mongoose = require('mongoose');

const auditLogInventorySchema = new mongoose.Schema({
  action: {
    type: String,
    enum: ['CREATE', 'UPDATE', 'DELETE', 'IN', 'OUT'], // Allowed actions
    required: true,
  },
  inventoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Inventory',

  },
  user: {
    type: String, // You can replace this with `userId` if you have a user model
    required: true,
  },
  changes: {
    type: Object, // Store the fields that were changed and their old/new values
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('AuditLogInventory', auditLogInventorySchema);
