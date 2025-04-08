const mongoose = require('mongoose');

const InventorySchema = new mongoose.Schema({
  source: String,
  type: String,
  supplies: String,
  unit: String,
  quantity: Number,
  out: Number,
  total: Number,
  category: { type: String, default: 'equipment' },
  expiration: [
    {
      in: Number,  // Amount added in this batch
      date: {
        type: Date,  // Expiration date for this batch
        default: null  // Allow null to represent 'N/A'
      },
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model('Inventory', InventorySchema);