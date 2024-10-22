const express = require('express');
const router = express.Router();
const UpgradingServices = require('../models/UpgradingServicesModel');


// Create a new upgrading service report
router.post('/', async (req, res) => {
  try {
    const upgradingService = new UpgradingServices(req.body);
    await upgradingService.save();
    res.status(201).json(upgradingService);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all upgrading service reports
router.get('/', async (req, res) => {
  try {
    const { formStatus } = req.query; // Get the formStatus from query parameters

    // Create a filter object for the query
    const filter = {};
    if (formStatus) {
      filter.formStatus = formStatus; // Add formStatus to the filter if provided
    }

    // Find reports based on the filter
    const reports = await UpgradingServices.find(filter);
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Get a specific upgrading service report by ID
router.get('/:id', async (req, res) => {
  try {
    const report = await UpgradingServices.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a specific upgrading service report by ID
router.put('/:id', async (req, res) => {
  try {
    const report = await UpgradingServices.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    res.status(200).json(report);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a specific upgrading service report by ID
router.delete('/:id', async (req, res) => {
  try {
    const report = await UpgradingServices.findByIdAndDelete(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    res.status(200).json({ message: 'Report deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
