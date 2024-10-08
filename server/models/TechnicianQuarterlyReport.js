const mongoose = require('mongoose');

const animalEntrySchema = new mongoose.Schema({
  farmerName: String,
  address: String,
  damIdNo: String,
  breed: String,
  color: String,
  estrus: String,
  dateOfAI: Date,
  sireId: String,
  aiServiceNo: String,
  dateCalved: Date,
  classification: String,
  sex: String,
  calveColor: String
});

const technicianQuarterlyReportSchema = new mongoose.Schema({
  technicianName: {
    type: String,
    required: true
  },
  municipality: {
    type: String,
    required: true
  },
  province: {
    type: String,
    required: true
  },
  remarks: String,
  dateSubmitted: {
    type: Date,
    default: Date.now
  },
  animalEntries: [animalEntrySchema]
});

const TechnicianQuarterlyReport = mongoose.model('TechnicianQuarterlyReport', technicianQuarterlyReportSchema);

module.exports = TechnicianQuarterlyReport;