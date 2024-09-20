const mongoose = require('mongoose');

const targetSchema = new mongoose.Schema({
  Type: {
    type: String,
    required: true,
  },
  target: {
    type: Number,
    required: true,
  },
  semiAnnualTarget: {
    type: Number,
    required: true,
  },
  targetDate: { // Add a user-defined date field
    type: Date,
    required: true // This ensures the user must provide a date
  }
});

module.exports = mongoose.model('Target', targetSchema);
