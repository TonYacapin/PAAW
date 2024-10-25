const mongoose = require('mongoose');
const { Schema } = mongoose;

// Client Information Schema
const clientInfoSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  completeAddress: {
    type: String,
    required: true,
    trim: true,
  },
  municipality: {
    type: String,
    required: true,
    trim: true,
  },
  province: {
    type: String,
    required: true,
    trim: true,
  },
  birthday: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female'],
  },
  contactNumber: {
    type: String,
    required: true,
    trim: true,
  },
});

// Animal Information Schema
const animalInfoSchema = new Schema({
  loanType: {
    type: String,

    trim: true,
  },
  animalType: {
    type: String,
 
    trim: true,
  },
});

// Service Details Schema
const serviceDetailsSchema = new Schema({
  aiAnimalType: {
    type: String,
   
    trim: true,
  },

});

// Livelihood Information Schema
const livelihoodInfoSchema = new Schema({
  applicationType: {
    type: String,
   
  },
  productionType: {
    type: String,
   
    trim: true,
  },
});

// Training Information Schema
const trainingInfoSchema = new Schema({
  specificTopic: {
    type: String,
  
    trim: true,
  },
  venue: {
    type: String,
  
    trim: true,
  },
  date: {
    type: Date,
   
  },
});

// IEC Material Schema
const iecMaterialSchema = new Schema({
  title: {
    type: String,
    trim: true,
  },
});

// Other Information Schema
const otherInfoSchema = new Schema({
  others: {
    type: String,
    trim: true,
  },
});

// Main Animal Production Services Schema
const animalProductionServicesSchema = new Schema({
  clientInfo: {
    type: clientInfoSchema,
    required: true,
  },
  animalInfo: {
    type: animalInfoSchema,

  },
  serviceDetails: {
    type: serviceDetailsSchema,
  
  },
  livelihoodInfo: {
    type: livelihoodInfoSchema,
 
  },
  trainingInfo: {
    type: trainingInfoSchema,

  },
  iecMaterial: {
    type: iecMaterialSchema,
  
  },
  otherInfo: {
    type: otherInfoSchema,
  },
  status: { // New status field
    type: String,
    enum: ['Pending', 'Ongoing', 'Finished' ,'Cancelled'], // You can add more statuses as needed
    default: 'Pending'
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Create the model
const AnimalProductionServices = mongoose.model('AnimalProductionServices', animalProductionServicesSchema);

module.exports = AnimalProductionServices;
