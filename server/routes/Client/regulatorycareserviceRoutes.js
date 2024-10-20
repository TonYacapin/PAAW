const express = require('express');
const RegulatoryService = require('../../models/Client/RegulatoryCareServicesModel'); // Adjust the path as necessary

const router = express.Router();

// Create a new regulatory service entry
router.post('/', async (req, res) => {
    console.log('this is RegulatoryService: ' + JSON.stringify(req.body, null, 2)); // Pretty-print the user object
    try {
        const regulatoryService = new RegulatoryService(req.body);
        await regulatoryService.save();
        res.status(201).json(regulatoryService);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all regulatory service entries
router.get('/', async (req, res) => {
    try {
        const regulatoryServices = await RegulatoryService.find();
        res.status(200).json(regulatoryServices);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a specific regulatory service entry by ID
router.get('/:id', async (req, res) => {
    try {
        const regulatoryService = await RegulatoryService.findById(req.params.id);
        if (!regulatoryService) {
            return res.status(404).json({ error: 'Regulatory service not found' });
        }
        res.status(200).json(regulatoryService);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a regulatory service entry by ID
router.put('/:id', async (req, res) => {
    try {
        const regulatoryService = await RegulatoryService.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // Return the updated document
            runValidators: true // Validate data against the schema
        });

        if (!regulatoryService) {
            return res.status(404).json({ error: 'Regulatory service not found' });
        }
        
        res.status(200).json(regulatoryService);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete a regulatory service entry by ID
router.delete('/:id', async (req, res) => {
    try {
        const regulatoryService = await RegulatoryService.findByIdAndDelete(req.params.id);
        if (!regulatoryService) {
            return res.status(404).json({ error: 'Regulatory service not found' });
        }
        res.status(204).send(); // No content to send back
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
