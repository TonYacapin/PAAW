const express = require('express');
const router = express.Router();
const RabiesVaccinationReport = require('../models/rabiesVaccinationReport.model');

// Create a new report
router.post('/api/entries', async (req, res) => {
  try {
    const newReport = new RabiesVaccinationReport(req.body);
    await newReport.save();
    res.status(201).json(newReport);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Retrieve all reports
router.get('/api/entries', async (req, res) => {
  try {
    const reports = await RabiesVaccinationReport.find();
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a specific report
router.put('/api/entries/:id', async (req, res) => {
  try {
    const updatedReport = await RabiesVaccinationReport.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedReport) return res.status(404).json({ error: 'Report not found' });
    res.json(updatedReport);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a specific report
router.delete('/api/entries/:id', async (req, res) => {
  try {
    const deletedReport = await RabiesVaccinationReport.findByIdAndDelete(req.params.id);
    if (!deletedReport) return res.status(404).json({ error: 'Report not found' });
    res.json({ message: 'Report deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
