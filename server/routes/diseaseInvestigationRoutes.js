const express = require('express');
const router = express.Router();
const DiseaseInvestigation = require('../models/DiseaseInvestigation.model');

// Create a new Disease Investigation
router.post('/disease-investigation', async (req, res) => {
  try {
    const data = req.body;

    console.log(data)

    // Example schema
    const diseaseInvestigation = new DiseaseInvestigation({
      status: data.status,
      noOfVisit: data.noOfVisit,
      dateReported: data.dateReported,
      dateOfVisit: data.dateOfVisit,
      investigator: data.investigator,
      placeAffected: data.placeAffected,
      latitude: data.latitude,
      longitude: data.longitude,
      farmerName: data.farmerName,
      farmType: data.farmType,
      propablesourceofinfection: data.propablesourceofinfection,
      controlmeasures: data.controlmeasures,
      remarks: data.remarks,
      tentativediagnosis: data.tentativediagnosis,
      finaldiagnosis: data.finaldiagnosis,
      natureofdiagnosis: data.natureofdiagnosis,
      movement: Array.isArray(data.movementRows) ? data.movementRows : [], // Ensure this field is processed as an array of objects
      details: Array.isArray(data.detailsRows) ? data.detailsRows : [],   // Ensure this field is processed as an array of objects
      clinicalSigns: Array.isArray(data.clinicalSignsRows) ? data.clinicalSignsRows : [] // Ensure this field is processed as an array of objects
    });

    const savedData = await diseaseInvestigation.save();

    res.status(201).json(savedData);
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({ message: 'Failed to save data' });
  }
});




// Get all Disease Investigations
router.get('/disease-investigation', async (req, res) => {
  try {
    const investigations = await DiseaseInvestigation.find();
    res.json(investigations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single Disease Investigation by ID
router.get('/disease-investigation/:id', async (req, res) => {
  try {
    const investigation = await DiseaseInvestigation.findById(req.params.id);
    if (!investigation) {
      return res.status(404).json({ error: 'Investigation not found' });
    }
    res.json(investigation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a Disease Investigation by ID
router.put('/disease-investigation/:id', async (req, res) => {
  try {
    const investigation = await DiseaseInvestigation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!investigation) {
      return res.status(404).json({ error: 'Investigation not found' });
    }
    res.json(investigation);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a Disease Investigation by ID
router.delete('/disease-investigation/:id', async (req, res) => {
  try {
    const investigation = await DiseaseInvestigation.findByIdAndDelete(req.params.id);
    if (!investigation) {
      return res.status(404).json({ error: 'Investigation not found' });
    }
    res.json({ message: 'Investigation deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
