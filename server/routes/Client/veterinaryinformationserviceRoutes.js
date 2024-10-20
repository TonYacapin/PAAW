// routes/veterinaryInformationServiceRoutes.js
const express = require("express");
const router = express.Router();
const VeterinaryInformationService = require("../../models/Client/VeterinaryInformationServiceModel");


// Create a new Veterinary Information Service record
router.post("/", async (req, res) => {
    console.log('this is Veterinary Information Service: ' + JSON.stringify(req.body, null, 2));
    try {
        const veterinaryService = new VeterinaryInformationService(req.body);
        await veterinaryService.save();
        res.status(201).json({ message: "Veterinary Information Service submitted successfully!", data: veterinaryService });
    } catch (error) {
        res.status(400).json({ message: "Failed to submit Veterinary Information Service.", error: error.message });
    }
});

// Get all Veterinary Information Service records
router.get("/", async (req, res) => {
    try {
        const veterinaryServices = await VeterinaryInformationService.find();
        res.status(200).json(veterinaryServices);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch records.", error: error.message });
    }
});

// Get a single Veterinary Information Service record by ID
router.get("/:id", async (req, res) => {
    try {
        const veterinaryService = await VeterinaryInformationService.findById(req.params.id);
        if (!veterinaryService) {
            return res.status(404).json({ message: "Record not found." });
        }
        res.status(200).json(veterinaryService);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch the record.", error: error.message });
    }
});

// Update a Veterinary Information Service record by ID
router.put("/:id", async (req, res) => {
    try {
        const veterinaryService = await VeterinaryInformationService.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!veterinaryService) {
            return res.status(404).json({ message: "Record not found." });
        }
        res.status(200).json({ message: "Record updated successfully.", data: veterinaryService });
    } catch (error) {
        res.status(400).json({ message: "Failed to update the record.", error: error.message });
    }
});

// Delete a Veterinary Information Service record by ID
router.delete("/:id", async (req, res) => {
    try {
        const veterinaryService = await VeterinaryInformationService.findByIdAndDelete(req.params.id);
        if (!veterinaryService) {
            return res.status(404).json({ message: "Record not found." });
        }
        res.status(200).json({ message: "Record deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete the record.", error: error.message });
    }
});

module.exports = router;
