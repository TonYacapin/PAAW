const mongoose = require('mongoose');

// Define a sub-schema for the slaughtered animals
const slaughterAnimalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ['Cattle', 'Carabao', 'Goat', 'Sheep', 'Hog', 'Chicken'] // List of animals
  },
  number: {
    type: Number,
    required: true,
    min: 0 // Number of animals slaughtered
  },
  weight: {
    type: String,
    required: true // Weight of animals
  }
});

// Define the main schema for the Slaughter Report
const slaughterReportSchema = new mongoose.Schema({
  municipality: {
    type: String,
    required: true,
    enum: [
      'Ambaguio', 'Bagabag', 'Bayombong', 'Diadi', 'Quezon', 'Solano', 'Villaverde',
      'Alfonso Castañeda', 'Aritao', 'Bambang', 'Dupax del Norte', 'Dupax del Sur', 
      'Kayapa', 'Kasibu', 'Santa Fe'
    ] // List of municipalities
  },
  month: {
    type: Number,
    required: true,
    min: 1,
    max: 12 // Month (1 to 12)
  },
  year: {
    type: Number,
    required: true,
    min: 1900,
    max: 2100 // Year between 1900 and 2100
  },
  slaughterAnimals: {
    type: [slaughterAnimalSchema],
    required: true // Array of slaughtered animals with number and weight
  }
}, {
  timestamps: true // Adds createdAt and updatedAt timestamps automatically
});

// Create the Mongoose model for SlaughterReport
const SlaughterReport = mongoose.model('SlaughterReport', slaughterReportSchema);

module.exports = SlaughterReport;
