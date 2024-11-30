const mongoose = require('mongoose');

const targetSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
    },
    municipality: {
        type: String,
        required: true,
    },
    semiAnnualTarget: {
        type: Number,
        required: true,
    },
    targetYear: { 
        type: Number,
        required: true // Store only the year as a number
    }
});

// Create a compound unique index for type, targetYear, and municipality to prevent duplicates
targetSchema.index({ type: 1, targetYear: 1, municipality: 1 }, { unique: true });

module.exports = mongoose.model('MunicipalityTargets', targetSchema);
