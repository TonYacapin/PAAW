const mongoose = require('mongoose');

const requisitionIssuanceSchema = new mongoose.Schema({
  division: { type: String, required: true },
  office: { type: String, required: true },
  responsibilityCenter: { type: String, required: true },
  code: { type: String, required: true },
  risNo: { type: String, required: true },
  saiNo: { type: String, required: true },
  date: { type: Date, required: true },
  purpose: { type: String, required: true },
  designation: { type: String, required: true },
  requisitionRows: [{
    stockNo: { type: String, required: true },
    unit: { type: String, required: true },
    quantity: { type: Number, required: true },
    description: { type: String, required: true },
  }],
  issuanceRows: [{
    quantity: { type: Number,  },
    description: { type: String, required: true },
    remarks: { type: String, default: '' },
  }],

  formStatus: {
    type: String,
    enum: ["Pending", "Allotted", "Distributed", "Deleted"],
    default: "Pending",
  }, 

  sentby:{ type: String, required: true },

}, {
  timestamps: true,
});

const RequisitionIssuance = mongoose.model('RequisitionIssuance', requisitionIssuanceSchema);
module.exports = RequisitionIssuance;
