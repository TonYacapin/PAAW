const mongoose = require('mongoose');

const clientInfoSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  gender: String,
  birthday: Date,
  contactNo: String
});

const animalInfoSchema = new mongoose.Schema({
  species: String,
  breed: String,
  sex: String,
  age: String,
  color: String,
  estrus: String
});

const entrySchema = new mongoose.Schema({
  no: Number,
  date: Date,
  barangay: String,
  clientInfo: clientInfoSchema,
  animalInfo: animalInfoSchema,
  sireCodeNum: String,
  activity: {
    type: String,
    enum: ['EstrusSynchro', 'ArtificialInsemination', 'PregnancyDiagnosis', 'VitaminADE']
  },
  remarks: String
});

const upgradingServicesSchema = new mongoose.Schema({
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

const UpgradingServices = mongoose.model('UpgradingServices', upgradingServicesSchema);

module.exports = UpgradingServices;