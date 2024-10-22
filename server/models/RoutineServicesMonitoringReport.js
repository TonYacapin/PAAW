// models/RoutineServicesMonitoringReport.js
const mongoose = require("mongoose");

const clientInfoSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  gender: { type: String, required: true },
  birthday: { type: Date, required: true },
  contactNo: { type: String, required: true },
});

const animalInfoSchema = new mongoose.Schema({
  species: { type: String, required: true },
  sex: { type: String, required: true },
  age: { type: String, required: true },
  animalRegistered: { type: String, required: true },
  noOfHeads: { type: Number, required: true },
});

const entrySchema = new mongoose.Schema({
  date: { type: Date, required: true },
  barangay: { type: String, required: true },
  clientInfo: clientInfoSchema,
  animalInfo: animalInfoSchema,
  activity: { type: String, required: true },
  remark: { type: String, required: true },
});

const routineServicesMonitoringReportSchema = new mongoose.Schema(
  {
    province: { type: String, required: true },
    municipality: { type: String, required: true },
    reportingPeriod: { type: String, required: true },
    livestockTechnician: { type: String, required: true },
    entries: [entrySchema],
    formStatus: {
      type: String,
      enum: ["Pending", "Accepted", "Deleted"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "RoutineServicesMonitoringReport",
  routineServicesMonitoringReportSchema
);
