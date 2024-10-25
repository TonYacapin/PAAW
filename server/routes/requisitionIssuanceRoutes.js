const express = require('express');
const RequisitionIssuance = require('../models/RequisitionIssueSlipModel');

const router = express.Router();

// Create a new requisition issuance
router.post('/', async (req, res) => {
    console.log("Sending data:", JSON.stringify(req.body, null, 2));
    try {
        const requisitionIssuance = new RequisitionIssuance(req.body);
        const savedRequisition = await requisitionIssuance.save();
        res.status(201).json(savedRequisition);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all requisition issuances with optional filtering
router.get('/', async (req, res) => {
    const { userEmail } = req.query; // Get the userEmail query parameter

    try {
        // If userEmail is provided, filter by it; otherwise, fetch all
        const requisitionIssuances = userEmail
            ? await RequisitionIssuance.find({ sentby: userEmail })
            : await RequisitionIssuance.find();
        
        res.status(200).json(requisitionIssuances);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a single requisition issuance by ID
router.get('/:id', async (req, res) => {
    try {
        const requisitionIssuance = await RequisitionIssuance.findById(req.params.id);
        if (!requisitionIssuance) {
            return res.status(404).json({ message: 'Requisition Issuance not found' });
        }
        res.status(200).json(requisitionIssuance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a requisition issuance by ID
router.put('/:id', async (req, res) => {
    try {
        const requisitionIssuance = await RequisitionIssuance.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!requisitionIssuance) {
            return res.status(404).json({ message: 'Requisition Issuance not found' });
        }
        res.status(200).json(requisitionIssuance);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a requisition issuance by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedRequisition = await RequisitionIssuance.findByIdAndDelete(req.params.id);
        if (!deletedRequisition) {
            return res.status(404).json({ message: 'Requisition Issuance not found' });
        }
        res.status(204).send(); // No content to return
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
