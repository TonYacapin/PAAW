const mongoose = require("mongoose");

const VeterinaryInformationServiceSchema = new mongoose.Schema({
    clientInfo: {
        name: { type: String, required: true },
        barangay: { type: String, required: true },
        municipality: { type: String, required: true },
        province: { type: String, required: true },
        birthday: { type: Date, required: true },
        gender: { type: String, enum: ["Male", "Female"], required: true },
        contact: { type: String, required: true },
        service: {
            type: String,
          
            required: true,
        },
        others: { type: String }, // 'others' is now optional
    },

    status: {
        type: String,
        enum: ['Pending', 'Ongoing', 'Finished', 'Cancelled'],
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

module.exports = mongoose.model("VeterinaryInformationService", VeterinaryInformationServiceSchema);
