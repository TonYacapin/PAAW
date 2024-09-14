// routes/routineServicesMonitoringReport.js
const express = require('express');
const router = express.Router();
const RoutineServicesMonitoringReport = require('../models/RoutineServicesMonitoringReport');

// Create a new report
router.post('/RSM', async (req, res) => {
  try {
    console.log(req.body)
    const report = new RoutineServicesMonitoringReport(req.body);
    await report.save();
    res.status(201).json(report);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all reports
router.get('/RSM', async (req, res) => {
  try {
    const reports = await RoutineServicesMonitoringReport.find();
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific report by ID
router.get('/RSM/:id', async (req, res) => {
  try {
    const report = await RoutineServicesMonitoringReport.findById(req.params.id);
    if (report) {
      res.status(200).json(report);
    } else {
      res.status(404).json({ message: 'Report not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a report
router.put('/RSM/:id', async (req, res) => {
  try {
    const report = await RoutineServicesMonitoringReport.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (report) {
      res.status(200).json(report);
    } else {
      res.status(404).json({ message: 'Report not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a report
router.delete('/RSM/:id', async (req, res) => {
  try {
    const report = await RoutineServicesMonitoringReport.findByIdAndDelete(req.params.id);
    if (report) {
      res.status(200).json({ message: 'Report deleted successfully' });
    } else {
      res.status(404).json({ message: 'Report not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
