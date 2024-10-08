const express = require('express');
const router = express.Router();
const OffspringMonitoring = require('../models/OffspringMonitoring');


// Create a new offspring monitoring report
router.post('/', async (req, res) => {
  try {
    const newReport = new OffspringMonitoring(req.body);
    await newReport.save();
    res.status(201).json(newReport);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all offspring monitoring reports
router.get('/', async (req, res) => {
  try {
    const reports = await OffspringMonitoring.find();
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific offspring monitoring report by ID
router.get('/:id', async (req, res) => {
  try {
    const report = await OffspringMonitoring.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a specific offspring monitoring report by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedReport = await OffspringMonitoring.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedReport) {
      return res.status(404).json({ message: 'Report not found' });
    }
    res.status(200).json(updatedReport);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a specific offspring monitoring report by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedReport = await OffspringMonitoring.findByIdAndDelete(req.params.id);
    if (!deletedReport) {
      return res.status(404).json({ message: 'Report not found' });
    }
    res.status(200).json({ message: 'Report deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
