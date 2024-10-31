const mongoose = require('mongoose');
const { Schema } = mongoose;

// Client Information Schema
const clientInfoSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  barangay: {
    type: String,
    required: true,
    trim: true
  },
  municipality: {
    type: String,
    required: true,
  },
  province: {
    type: String,
    required: true,
    trim: true
  },
  birthday: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female']
  },
  contact: {
    type: String,
    required: true,
    trim: true
  }
});

// Rabies Vaccination Schema
const rabiesVaccinationSchema = new Schema({
  petName: {
    type: String,
    trim: true
  },
  species: {
    type: String,
    trim: true
  },
  sex: {
    type: String,
  
  },
  age: {
    type: String,
    trim: true
  },
  color: {
    type: String,
    trim: true
  },
  remarks: {
    type: String,
    trim: true
  }
});

// Vaccination Schema
const vaccinationSchema = new Schema({
  type: {
    type: String,
  },
  walkInSpecies: {
    type: String,
    trim: true
  },
  noOfHeads: {
    type: Number,
    min: 1
  },
  sex: {
    type: String,
  },
  age: {
    type: String,
    trim: true
  },
  aewVaccine: {
    type: String,
    trim: true
  },
  aewQuantity: {
    type: Number,
    min: 1
  }
});

// Routine Service Schema
const routineServiceSchema = new Schema({
  serviceType: {
    type: String,
  },
  species: {
    type: String,
    trim: true
  },
  noOfHeads: {
    type: Number,
    min: 1
  },
  sex: {
    type: String,
  },
  age: {
    type: String,
    trim: true
  },
  aewVaccine: {
    type: String,
    trim: true
  },
  aewQuantity: {
    type: Number,
    min: 0
  }
});

// Main Animal Health Care Services Schema
const animalHealthCareServicesSchema = new Schema({
  clientInfo: {
    type: clientInfoSchema,
    required: true
  },
  rabiesVaccinations: {
    type: [rabiesVaccinationSchema],
    default: [] // Allow empty array by default
  },
  vaccinations: {
    type: [vaccinationSchema],
    default: [] // Allow empty array by default
  },
  routineServices: {
    type: [routineServiceSchema],
    default: [] // Allow empty array by default
  },
  status: { // New status field
    type: String,
    enum: ['Pending', 'Ongoing', 'Finished' ,'Cancelled'], // You can add more statuses as needed
    default: 'Pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create indexes for common queries
animalHealthCareServicesSchema.index({ 'clientInfo.name': 1 });
animalHealthCareServicesSchema.index({ 'clientInfo.municipality': 1 });
animalHealthCareServicesSchema.index({ createdAt: -1 });

const AnimalHealthCareServices = mongoose.model('AnimalHealthCareServices', animalHealthCareServicesSchema);

module.exports = AnimalHealthCareServices;
