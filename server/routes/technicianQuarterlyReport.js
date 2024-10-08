const express = require('express');
const router = express.Router();
const TechnicianQuarterlyReport = require('../models/TechnicianQuarterlyReport');

// Create a new technician quarterly report
router.post('/', async (req, res) => {
  try {
    const newReport = new TechnicianQuarterlyReport(req.body);
    const savedReport = await newReport.save();
    res.status(201).json(savedReport);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all technician quarterly reports
router.get('/', async (req, res) => {
  try {
    const reports = await TechnicianQuarterlyReport.find();
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific technician quarterly report by ID
router.get('/:id', async (req, res) => {
  try {
    const report = await TechnicianQuarterlyReport.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a specific technician quarterly report by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedReport = await TechnicianQuarterlyReport.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedReport) {
      return res.status(404).json({ message: 'Report not found' });
    }
    res.status(200).json(updatedReport);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a specific technician quarterly report by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedReport = await TechnicianQuarterlyReport.findByIdAndDelete(req.params.id);
    if (!deletedReport) {
      return res.status(404).json({ message: 'Report not found' });
    }
    res.status(200).json({ message: 'Report deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
