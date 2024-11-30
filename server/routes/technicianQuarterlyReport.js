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


// Route to get filtered technician quarterly reports
router.get('/', async (req, res) => {
  try {
    const { formStatus, municipality, startDate, endDate, species } = req.query;

    // Create a filter object for the query
    const filter = {};

    // Add formStatus to the filter if provided
    if (formStatus) {
      filter.formStatus = formStatus;
    }

    // Filter by municipality if provided
    if (municipality) {
      filter.municipality = municipality;
    }

    // Filter by species if provided
    if (species) {
      filter.species = species;
    }

    // Filter by date range (startDate and/or endDate)
    if (startDate || endDate) {
      filter.dateSubmitted = {}; // Initialize the dateSubmitted filter

      if (startDate) {
        filter.dateSubmitted.$gte = new Date(startDate); // Greater than or equal to startDate
      }

      if (endDate) {
        filter.dateSubmitted.$lte = new Date(endDate); // Less than or equal to endDate
      }
    }

    // Find reports based on the filter
    const reports = await TechnicianQuarterlyReport.find(filter);
    res.status(200).json(reports);
  } catch (error) {
    console.error('Error retrieving technician quarterly reports:', error);
    res.status(500).json({ message: 'Failed to retrieve reports' });
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
