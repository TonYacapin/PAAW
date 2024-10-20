// models/RegulatoryService.js
const mongoose = require('mongoose');

const regulatoryServiceSchema = new mongoose.Schema({
    clientInfo: {
        name: { type: String, required: true },
        address: { type: String, required: true },
        barangay: { type: String, required: true },
        municipality: { type: String, required: true },
        province: { type: String, required: true },
        birthday: { type: Date, required: true },
        gender: { type: String, required: true },
        contact: { type: String, required: true },
    },
    regulatoryService: {
        animalsToBeShipped: { type: String, required: true },
        noOfHeads: { type: Number, required: true },
        purpose: { type: String, required: true },
        ownerFarmName: { type: String, required: true },
        transportCarrierName: { type: String, required: true },
        vehiclePlateNumber: { type: String, required: true },
        origin: { type: String, required: true },
        destination: { type: String, required: true },
        loadingDate: { type: Date, required: true },
        otherServices: [{ type: String }], // Array of strings for other services
    },

    status: { // New status field
        type: String,
        enum: ['Pending', 'Ongoing', 'Finished', 'Cancelled'], // You can add more statuses as needed
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
}, { timestamps: true }); // Adds createdAt and updatedAt timestamps

const RegulatoryService = mongoose.model('RegulatoryService', regulatoryServiceSchema);

module.exports = RegulatoryService;
