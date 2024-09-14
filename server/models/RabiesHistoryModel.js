const mongoose = require('mongoose');

const rabiesHistorySchema = new mongoose.Schema({
  animalProfile: {
    residence: { type: String, required: false },
    species: { type: String, required: false },
    breed: { type: String, required: false },
    sex: { type: String,  required: false },
    age: { type: Number, required: false },
  },
  ownershipType: { type: String,  required: false },
  petManagement: { type: String,  required: false },
  causeOfDeath: {
    type: String,

    required: false,
  },
  causeOfDeathOther: { type: String, required: false },
  dateOfDeath: { type: Date, required: false },
  timeOfDeath: { type: String, required: false },
  vaccinationHistory: {
    type: String,

    required: false,
  },
  vaccinationHistoryOther: { type: String, required: false },
  typeOfVaccine: { type: String, required: false },
  dateOfLastVaccination: { type: Date, required: false },
  bitchVaccinated: {
    type: String,
 
    required: false,
  },
  bitchVaccinatedSpecify: { type: String, required: false },
  contactWithAnimals: {
    type: String,

    required: false,
  },
  contactLocation: {
    type: String,

    required: false,
  },
  contactLocationSpecify: { type: String, required: false },
  durationOfIllness: {
    from: { type: Date, required: false },
    to: { type: Date, required: false },
  },
  behavioralChanges: {
    none: { type: Boolean, default: false },
    restlessness: { type: Boolean, default: false },
    apprehensiveWatchfulLook: { type: Boolean, default: false },
    runningAimlessly: { type: Boolean, default: false },
    bitingInanimateObjects: { type: Boolean, default: false },
    hyperactivity: { type: Boolean, default: false },
    others: { type: Boolean, default: false },
    behavioralChangesSpecify: { type: String, required: false },
  },
  victimProfile: {
    name: { type: String, required: false },
    age: { type: Number, required: false },
    sex: { type: String, required: false },
    address: { type: String, required: false },
    dateOfBite: { type: Date, required: false },
    timeOfBite: { type: String, required: false },
    siteOfBite: {
      type: String,

      required: false,
    },
    siteOfBiteSpecify: { type: String, required: false },
    natureOfBite: {
      type: String,
    
      required: false,
    },
    biteProvoked: {
      type: String,
 
      required: false,
    },
    biteProvokedSpecify: { type: String, required: false },
    locationOfBite: {
      type: String,
  
      required: false,
    },
    locationOfBiteSpecify: { type: String, required: false },
    otherVictims: { type: String, required: false },
  },
  treatmentReceived: {
    type: String,

    required: false,
  },
  treatmentReceivedOther: { type: String, required: false },
  dateOfTreatmentReceived: { type: Date, required: false },
});

module.exports = mongoose.model('RabiesHistory', rabiesHistorySchema);
