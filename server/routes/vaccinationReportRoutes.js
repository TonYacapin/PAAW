const express = require('express');
const router = express.Router();
const VaccinationReport = require('../models/VaccinationReportModel'); // Update the path

// Route to create a new vaccination report
router.post('/api/reports', async (req, res) => {
  try {
    console.log(req.body)
    const vaccinationReportData = req.body;
    const vaccinationReport = new VaccinationReport(vaccinationReportData);
    await vaccinationReport.save();
    res.status(201).json({ message: 'Report created successfully', report: vaccinationReport });
  } catch (error) {
    console.error('Error creating report:', error);
    res.status(500).json({ message: 'Failed to create report' });
  }
});

// Route to get all vaccination reports
router.get('/api/reports', async (req, res) => {
  try {
    const reports = await VaccinationReport.find();
    res.status(200).json(reports);
  } catch (error) {
    console.error('Error retrieving reports:', error);
    res.status(500).json({ message: 'Failed to retrieve reports' });
  }
});

// Route to get a single vaccination report by ID
router.get('/api/reports/:id', async (req, res) => {
  try {
    const report = await VaccinationReport.findById(req.params.id);
    if (report) {
      res.status(200).json(report);
    } else {
      res.status(404).json({ message: 'Report not found' });
    }
  } catch (error) {
    console.error('Error retrieving report:', error);
    res.status(500).json({ message: 'Failed to retrieve report' });
  }
});

// Route to update a vaccination report by ID
router.put('/api/reports/:id', async (req, res) => {
  try {
    const updatedReport = await VaccinationReport.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (updatedReport) {
      res.status(200).json({ message: 'Report updated successfully', report: updatedReport });
    } else {
      res.status(404).json({ message: 'Report not found' });
    }
  } catch (error) {
    console.error('Error updating report:', error);
    res.status(500).json({ message: 'Failed to update report' });
  }
});

// Route to delete a vaccination report by ID
router.delete('/api/reports/:id', async (req, res) => {
  try {
    const deletedReport = await VaccinationReport.findByIdAndDelete(req.params.id);
    if (deletedReport) {
      res.status(200).json({ message: 'Report deleted successfully' });
    } else {
      res.status(404).json({ message: 'Report not found' });
    }
  } catch (error) {
    console.error('Error deleting report:', error);
    res.status(500).json({ message: 'Failed to delete report' });
  }
});

// Route to add an entry to a vaccination report by ID
router.post('/api/reports/:id/entries', async (req, res) => {
  try {
    const { entries } = req.body;
    const report = await VaccinationReport.findById(req.params.id);
    if (report) {
      report.entries.push(...entries);
      await report.save();
      res.status(200).json({ message: 'Entries added successfully', report });
    } else {
      res.status(404).json({ message: 'Report not found' });
    }
  } catch (error) {
    console.error('Error adding entries:', error);
    res.status(500).json({ message: 'Failed to add entries' });
  }
});

// Route to update an entry in a vaccination report by report ID and entry index
router.put('/api/reports/:reportId/entries/:entryIndex', async (req, res) => {
  try {
    const { reportId, entryIndex } = req.params;
    const updatedEntry = req.body;
    const report = await VaccinationReport.findById(reportId);
    if (report && report.entries[entryIndex]) {
      report.entries[entryIndex] = updatedEntry;
      await report.save();
      res.status(200).json({ message: 'Entry updated successfully', report });
    } else {
      res.status(404).json({ message: 'Report or entry not found' });
    }
  } catch (error) {
    console.error('Error updating entry:', error);
    res.status(500).json({ message: 'Failed to update entry' });
  }
});

// Route to delete an entry from a vaccination report by report ID and entry index
router.delete('/api/reports/:reportId/entries/:entryIndex', async (req, res) => {
  try {
    const { reportId, entryIndex } = req.params;
    const report = await VaccinationReport.findById(reportId);
    if (report && report.entries[entryIndex]) {
      report.entries.splice(entryIndex, 1);
      await report.save();
      res.status(200).json({ message: 'Entry deleted successfully', report });
    } else {
      res.status(404).json({ message: 'Report or entry not found' });
    }
  } catch (error) {
    console.error('Error deleting entry:', error);
    res.status(500).json({ message: 'Failed to delete entry' });
  }
});

module.exports = router;
