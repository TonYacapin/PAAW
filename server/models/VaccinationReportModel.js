const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Client Info Schema
const clientInfoSchema = new Schema({
  firstName: String,
  lastName: String,
  gender: { type: String, enum: ['Male', 'Female'] },
  birthday: Date,
  contactNo: String
});

// Define the Animal Info Schema
const animalInfoSchema = new Schema({
  species: String,
  sex: { type: String, enum: ['Male', 'Female'] },
  age: String,
  registered: String,
  remarks: String
});

// Define the Entry Schema
const entrySchema = new Schema({
  no: Number,
  date: Date,
  barangay: String,
  reason: { type: String, enum: ['Mass', 'Routine', 'Outbreak'] },
  clientInfo: clientInfoSchema,
  animalInfo: animalInfoSchema
});

// Define the Vaccination Report Schema
const vaccinationReportSchema = new Schema({
  vaccine: String,
  municipality: String,
  province: { type: String, default: 'Nueva Vizcaya' },
  dateReported: Date,
  vaccineType: { type: String, enum: ['Live', 'Killed', 'Attenuated'] },
  batchLotNo: String,
  vaccineSource: { type: String, enum: ['MLGU', 'PLGU', 'RFU'] },
  agriculturalExtensionWorker: String,
  entries: [entrySchema] // Array of entries
});

// Create the Vaccination Report Model
const VaccinationReport = mongoose.model('VaccinationReport', vaccinationReportSchema);

module.exports = VaccinationReport;
