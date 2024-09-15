const express = require('express');
const router = express.Router();
const RabiesHistory = require('../models/RabiesHistoryModel'); // Adjust the path as needed

// Create a new RabiesHistory entry
router.post('/RH', async (req, res) => {
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

  console.log(req.body);

  // Validate that required fields are present
  if (!ownershipType || !species || !victimName || !causeOfDeath || !dateOfDeath || !treatmentReceived) {
    return res.status(400).json({ message: 'All required fields must be filled.' });
  }

  try {
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
        age: parseInt(age, 10) // Convert to number
      },
      dateOfDeath: new Date(dateOfDeath),
      timeOfDeath,
      typeOfVaccine,
      dateOfLastVaccination: new Date(dateOfLastVaccination),
      durationOfIllness: {
        from: new Date(durationIllnessFrom),
        to: new Date(durationIllnessTo)
      },
      behavioralChanges: {
        ...behavioralChanges,
        specify: behavioralChanges.specify || ''
      },
      victimProfile: {
        name: victimName,
        age: parseInt(victimAge, 10), // Convert to number
        sex: victimSex,
        address: victimAddress,
        dateOfBite: new Date(dateOfBite),
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
      dateOfTreatmentReceived: new Date(dateOfTreatmentReceived)
    });

    await rabiesHistory.save();
    res.status(201).json(rabiesHistory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
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
