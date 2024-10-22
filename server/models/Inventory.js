const mongoose = require('mongoose');

const InventorySchema = new mongoose.Schema({
  type: String,
  supplies: String,
  unit: String,
  quantity: Number,
  out: Number,
  total: Number,
  category: { type: String, default: 'equipment' },
}, { timestamps: true });

module.exports = mongoose.model('Inventory', InventorySchema);
