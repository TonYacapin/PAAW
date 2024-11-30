const express = require('express');
const router = express.Router();
const DiseaseInvestigation = require('../models/DiseaseInvestigation.model');
const { body, validationResult } = require('express-validator');

// Create a new Disease Investigation
router.post(
  '/disease-investigation',
  [
    body('status')
      .notEmpty().withMessage('Status is required.')
      .isIn(['new', 'on-going']).withMessage('Status must be either "new" or "on-going".'),
    body('noOfVisit').isNumeric().withMessage('Number of visits must be a number.'),
    body('dateReported').isISO8601().withMessage('Date reported must be a valid date.'),
    body('dateOfVisit').isISO8601().withMessage('Date of visit must be a valid date.'),
    body('investigator').notEmpty().withMessage('Investigator name is required.'),
    body('placeAffected').notEmpty().withMessage('Place affected is required.'),
    body('latitude').notEmpty().withMessage('Latitude is required.'),
    body('longitude').notEmpty().withMessage('Longitude is required.'),
    body('farmerName').notEmpty().withMessage('Farmer name is required.'),
    body('farmType').isArray().withMessage('Farm type must be an array.').notEmpty().withMessage('Farm type cannot be empty.'),
    body('propablesourceofinfection').notEmpty().withMessage('Probable source of infection is required.'),
    body('controlmeasures').notEmpty().withMessage('Control measures are required.'),
    body('remarks').notEmpty().withMessage('Remarks are required.'),
    body('tentativediagnosis').notEmpty().withMessage('Tentative diagnosis is required.'),
    body('finaldiagnosis').notEmpty().withMessage('Final diagnosis is required.'),
    body('natureofdiagnosis').notEmpty().withMessage('Nature of diagnosis is required.'),

    // Validate details array

    body('details.*.species').optional().notEmpty().withMessage('Species is required if provided.'),
    body('details.*.sex').optional().isIn(['Male', 'Female']).withMessage('Sex must be either "Male" or "Female".'),
    body('details.*.age').optional().notEmpty().withMessage('Age is required if provided.'),
    body('details.*.population').optional().notEmpty().withMessage('Population is required if provided.'),
    body('details.*.cases').optional().isNumeric().withMessage('Cases must be a number if provided.'),
    body('details.*.deaths').optional().isNumeric().withMessage('Deaths must be a number if provided.'),
    body('details.*.destroyed').optional().isNumeric().withMessage('Destroyed must be a number if provided.'),
    body('details.*.slaughtered').optional().isNumeric().withMessage('Slaughtered must be a number if provided.'),
    body('details.*.vaccineHistory').optional().notEmpty().withMessage('Vaccine history is required if provided.'),
    body('details.*.remarks').optional().notEmpty().withMessage('Remarks are required if provided.'),

    // Validate clinicalSigns array

    body('clinicalSigns.*.description').optional().notEmpty().withMessage('Description is required if provided.'),

    // Validate movement array

    body('movement.*.date').optional().isISO8601().withMessage('Date must be a valid date if provided.'),
    body('movement.*.mode').optional().notEmpty().withMessage('Mode of movement is required if provided.'),
    body('movement.*.type').optional().notEmpty().withMessage('Type of movement is required if provided.'),
    body('movement.*.barangay').optional().notEmpty().withMessage('Barangay is required if provided.'),
    body('movement.*.municipality').optional().notEmpty().withMessage('Municipality is required if provided.'),
    body('movement.*.province').optional().notEmpty().withMessage('Province is required if provided.'),
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {


      // Create new disease investigation
      const diseaseInvestigation = new DiseaseInvestigation({
        status: req.body.status,
        noOfVisit: req.body.noOfVisit,
        dateReported: req.body.dateReported,
        dateOfVisit: req.body.dateOfVisit,
        investigator: req.body.investigator,
        placeAffected: req.body.placeAffected,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        farmerName: req.body.farmerName,
        farmType: req.body.farmType,
        propablesourceofinfection: req.body.propablesourceofinfection,
        controlmeasures: req.body.controlmeasures,
        remarks: req.body.remarks,
        tentativediagnosis: req.body.tentativediagnosis,
        finaldiagnosis: req.body.finaldiagnosis,
        natureofdiagnosis: req.body.natureofdiagnosis,
        movement: Array.isArray(req.body.movementRows) ? req.body.movementRows : [],
        details: Array.isArray(req.body.detailsRows) ? req.body.detailsRows : [],
        clinicalSigns: Array.isArray(req.body.clinicalSignsRows) ? req.body.clinicalSignsRows : [],
      });

      const savedData = await diseaseInvestigation.save();
      res.status(201).json(savedData);
    } catch (error) {
      console.error('Error saving data:', error);
      res.status(500).json({ message: 'Failed to save data' });
    }
  }
);




/// Get all Disease Investigations with filters
router.get('/disease-investigation', async (req, res) => {
  const { municipality, startDate, endDate, formStatus, finalDiagnosis } = req.query; // Include finalDiagnosis

  try {
    // Create the query object dynamically based on the filters
    let query = {};

    // Apply municipality filter if provided
    if (municipality) {
      query.municipality = municipality;
    }

    // Apply date range filter if provided
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate); // Greater than or equal to startDate
      }
      if (endDate) {
        query.createdAt.$lte = new Date(endDate); // Less than or equal to endDate
      }
    }

    // Add form status filter if provided
    if (formStatus) {
      query.formStatus = formStatus;
    }

    // Add final diagnosis filter if provided
    if (finalDiagnosis) {
      query.finaldiagnosis = finalDiagnosis; // Add finalDiagnosis to query
    }

    // Fetch the filtered investigations
    const investigations = await DiseaseInvestigation.find(query);
    res.json(investigations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get('/final-diagnoses', async (req, res) => {
  try {
    // Fetch distinct final diagnoses where formStatus is 'Accepted'
    const finalDiagnoses = await DiseaseInvestigation.distinct('finaldiagnosis', { formStatus: 'Accepted' });
    res.json(finalDiagnoses);
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
