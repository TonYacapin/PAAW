const express = require('express');
const router = express.Router();
const RabiesHistory = require('../models/RabiesHistoryModel'); // Adjust the path as needed

const { check, validationResult } = require('express-validator');
// Validation rules for the input fields
const rabiesHistoryValidationRules = [
  check('ownershipType').notEmpty().withMessage('Ownership type is required.'),
  check('species').notEmpty().withMessage('Animal species is required.'),
  check('victimName').notEmpty().withMessage('Victim name is required.'),
  check('causeOfDeath').notEmpty().withMessage('Cause of death is required.'),
  check('dateOfDeath').notEmpty().withMessage('Date of death is required.').isISO8601().withMessage('Invalid date format for date of death.'),
  check('treatmentReceived').notEmpty().withMessage('Treatment received is required.'),
  check('victimAge').optional().isNumeric().withMessage('Victim age must be a number.'),
  check('dateOfLastVaccination').optional().isISO8601().withMessage('Invalid date format for the last vaccination date.'),
  check('durationIllnessFrom').optional().isISO8601().withMessage('Invalid date format for duration of illness (from).'),
  check('durationIllnessTo').optional().isISO8601().withMessage('Invalid date format for duration of illness (to).'),
  check('dateOfBite').optional().isISO8601().withMessage('Invalid date format for date of bite.'),
  check('dateOfTreatmentReceived').optional().isISO8601().withMessage('Invalid date format for date of treatment received.'),
];

// Route to create a new RabiesHistory entry
router.post(
  '/RH',
  rabiesHistoryValidationRules,
  async (req, res) => {
    // Validate the request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      ownershipType,
      petManagement,
      causeOfDeath,
      vaccinationHistory,
      bitchVaccinated,
      contactWithAnimals,
      contactLocation,
      siteOfBite,
      biteProvoked,
      locationOfBite,
      treatmentReceived,
      animalResidence,
      species,
      breed,
      sex,
      age,
      dateOfDeath,
      timeOfDeath,
      typeOfVaccine,
      dateOfLastVaccination,
      durationIllnessFrom,
      durationIllnessTo,
      behavioralChanges,
      victimName,
      victimAge,
      victimSex,
      victimAddress,
      dateOfBite,
      timeOfBite,
      siteOfBiteOther,
      natureOfBite,
      biteProvokedSpecify,
      locationOfBiteOther,
      otherVictims,
      treatmentReceivedOther,
      dateOfTreatmentReceived
    } = req.body;

    try {
      // Check for duplicates
      const existingRecord = await RabiesHistory.findOne({
        'victimProfile.name': victimName,
        'victimProfile.dateOfBite': new Date(dateOfBite),
        'animalProfile.species': species,
        dateOfDeath: new Date(dateOfDeath)
      });

      if (existingRecord) {
        return res.status(400).json({ message: 'Duplicate record detected. A similar entry already exists.' });
      }

      // Create a new RabiesHistory object, mapping fields to match the schema
      const rabiesHistory = new RabiesHistory({
        ownershipType,
        petManagement,
        causeOfDeath,
        vaccinationHistory,
        bitchVaccinated,
        contactWithAnimals,
        contactLocation,
        treatmentReceived,
        animalProfile: {
          residence: animalResidence,
          species,
          breed,
          sex,
          age: age ? parseInt(age, 10) : null // Convert to number, or leave blank
        },
        dateOfDeath: new Date(dateOfDeath),
        timeOfDeath,
        typeOfVaccine,
        dateOfLastVaccination: dateOfLastVaccination ? new Date(dateOfLastVaccination) : null,
        durationOfIllness: durationIllnessFrom && durationIllnessTo ? {
          from: new Date(durationIllnessFrom),
          to: new Date(durationIllnessTo)
        } : undefined, // Leave blank if not provided
        behavioralChanges: behavioralChanges ? {
          ...behavioralChanges,
          specify: behavioralChanges.specify || ''
        } : undefined, // Leave blank if not provided
        victimProfile: {
          name: victimName,
          age: victimAge ? parseInt(victimAge, 10) : null, // Convert to number, or leave blank
          sex: victimSex,
          address: victimAddress,
          dateOfBite: dateOfBite ? new Date(dateOfBite) : null,
          timeOfBite,
          siteOfBite,
          siteOfBiteOther,
          natureOfBite,
          biteProvoked,
          biteProvokedSpecify,
          locationOfBite,
          locationOfBiteOther,
          otherVictims
        },
        treatmentReceivedOther,
        dateOfTreatmentReceived: dateOfTreatmentReceived ? new Date(dateOfTreatmentReceived) : null
      });

      // Save the new record
      await rabiesHistory.save();
      res.status(201).json(rabiesHistory);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);
// Get all RabiesHistory entries
router.get('/RH', async (req, res) => {
  try {
    const rabiesHistories = await RabiesHistory.find();
    res.status(200).json(rabiesHistories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single RabiesHistory entry by ID
router.get('/:id', async (req, res) => {
  try {
    const rabiesHistory = await RabiesHistory.findById(req.params.id);
    if (!rabiesHistory) {
      return res.status(404).json({ message: 'RabiesHistory not found' });
    }
    res.status(200).json(rabiesHistory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a RabiesHistory entry by ID
router.put('/:id', async (req, res) => {
  try {
    const rabiesHistory = await RabiesHistory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!rabiesHistory) {
      return res.status(404).json({ message: 'RabiesHistory not found' });
    }
    res.status(200).json(rabiesHistory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a RabiesHistory entry by ID
router.delete('/:id', async (req, res) => {
  try {
    const rabiesHistory = await RabiesHistory.findByIdAndDelete(req.params.id);
    if (!rabiesHistory) {
      return res.status(404).json({ message: 'RabiesHistory not found' });
    }
    res.status(200).json({ message: 'RabiesHistory deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
