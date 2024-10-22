const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define the schema for the Disease Investigation
const DiseaseInvestigationSchema = new Schema({
  status: { type: String, enum: ["new", "on-going"], required: true },
  noOfVisit: { type: Number, required: true },
  dateReported: { type: Schema.Types.Date, required: true },
  dateOfVisit: { type: Schema.Types.Date, required: true },
  investigator: { type: String, required: true },
  placeAffected: { type: String, required: true },
  latitude: { type: String, required: true },
  longitude: { type: String, required: true },
  farmerName: { type: String, required: true },
  farmType: { type: [String], required: true },
  propablesourceofinfection: { type: String, required: true },
  controlmeasures: { type: String, required: true },
  remarks: { type: String, required: true },
  tentativediagnosis: { type: String, required: true },
  finaldiagnosis: { type: String, required: true },
  natureofdiagnosis: { type: String, required: true },
  details: [
    {
      species: { type: String, required: false },
      sex: { type: String, required: false },
      age: { type: String, required: false },
      population: { type: String, required: false },
      cases: { type: String, required: false },
      deaths: { type: String, required: false },
      destroyed: { type: String, required: false },
      slaughtered: { type: String, required: false },
      vaccineHistory: { type: String, required: false },
      remarks: { type: String, required: false },
    },
  ],
  clinicalSigns: [
    {
      description: { type: String, required: false },
    },
  ],
  movement: [
    {
      date: { type: Schema.Types.Date, required: false },
      mode: { type: String, required: false },
      type: { type: String, required: false },
      barangay: { type: String, required: false },
      municipality: { type: String, required: false },
      province: { type: String, required: false },
    },
  ],
  formStatus: {
    type: String,
    enum: ["Pending", "Accepted", "Deleted"],
    default: "Pending",
  }, 
},{timestamps: true});

module.exports = mongoose.model(
  "DiseaseInvestigation",
  DiseaseInvestigationSchema
);
