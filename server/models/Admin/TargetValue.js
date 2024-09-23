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
  targetYear: { // Store only the year as a number
    type: Number,
    required: true // Ensures the user must provide a year
  }
});

// Create a compound unique index for Type and targetYear to prevent duplicates
targetSchema.index({ Type: 1, targetYear: 1 }, { unique: true });

module.exports = mongoose.model('Target', targetSchema);
