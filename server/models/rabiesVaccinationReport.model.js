const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the schema for the Rabies Vaccination Report
const rabiesVaccinationReportSchema = new Schema({
  municipality: {
    type: String,
    required: true
  },
  dateReported: {
    type: Date,
    required: true
  },
  vaccineUsed: {
    type: String,
    required: true
  },
  batchLotNo: {
    type: String,
    required: true
  },
  vaccineSource: {
    type: String,
    required: true
  },
  entries: [{
    no: {
      type: Number,
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    barangay: {
      type: String,
      required: true
    },
    clientInfo: {
      firstName: {
        type: String,
        required: true
      },
      lastName: {
        type: String,
        required: true
      },
      gender: {
        type: String,
        required: true
      },
      birthday: {
        type: String, // Adjust the type if you prefer a different format
        required: true
      },
      contactNo: {
        type: String,
        required: true
      }
    },
    animalInfo: {
      name: {
        type: String,
        required: true
      },
      species: {
        type: String,
        required: true
      },
      sex: {
        type: String,
        required: true
      },
      age: {
        type: String,
        required: true
      },
      color: {
        type: String,
        required: true
      },
      
    }
  }],
  formStatus: {
    type: String,
    enum: ["Pending", "Accepted", "Deleted"],
    default: "Pending",
  },
}, {timestamps: true});

// 

// Create the model from the schema
const RabiesVaccinationReport = mongoose.model('RabiesVaccinationReport', rabiesVaccinationReportSchema);

module.exports = RabiesVaccinationReport;
