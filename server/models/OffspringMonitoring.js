const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema({
  no: Number,
  name: String,
  dateOfAi: Date,
  dateOfMonitoring: Date,
  barangay: String,
  species: String,
  aiTech: String,
  calvingDate: Date,
  sex: {
    type: String,
    enum: ['Male', 'Female']
  }
});

const offspringMonitoringSchema = new mongoose.Schema({
  municipality: {
    type: String,
    required: true,
    enum: [
      'Ambaguio', 'Bagabag', 'Bayombong', 'Diadi', 'Quezon', 'Solano', 'Villaverde',
      'Alfonso Castañeda', 'Aritao', 'Bambang', 'Dupax del Norte', 'Dupax del Sur',
      'Kayapa', 'Kasibu', 'Santa Fe'
    ]
  },
  dateReported: {
    type: Date,
    required: true
  },
  entries: [entrySchema],

  formStatus: { // New status field
    type: String,
    enum: ['Pending', 'Accepted', 'Deleted'], // You can add more statuses as needed
    default: 'Pending'
  },
}, {
  timestamps: true
});

const OffspringMonitoring = mongoose.model('OffspringMonitoring', offspringMonitoringSchema);

module.exports = OffspringMonitoring;