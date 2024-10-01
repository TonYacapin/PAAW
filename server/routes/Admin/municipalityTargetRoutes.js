const express = require('express');
const router = express.Router();
const MunicipalityTargets = require('../../models/Admin/MunicipalityTargetValue');

// GET all targets, with optional filtering by municipality and/or targetYear
router.get('/', async (req, res) => {
  try {
    const { municipality, targetYear } = req.query;
    const query = {};
    
    if (municipality) query.municipality = municipality;
    if (targetYear) query.targetYear = Number(targetYear);

    const targets = await MunicipalityTargets.find(query);
    res.json(targets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST a new target
router.post('/', async (req, res) => {
  const { type, municipality, semiAnnualTarget, targetYear } = req.body;
  
  const newTarget = new MunicipalityTargets({
    type,
    municipality,
    semiAnnualTarget,
    targetYear
  });

  try {
    const savedTarget = await newTarget.save();
    res.status(201).json(savedTarget);
  } catch (error) {
    // Handle duplicate key error (unique constraint)
    if (error.code === 11000) {
      res.status(400).json({ message: 'Duplicate entry: Target for this year and type already exists.' });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
});

// GET a single target by ID
router.get('/:id', async (req, res) => {
  try {
    const target = await MunicipalityTargets.findById(req.params.id);
    if (!target) {
      return res.status(404).json({ message: 'Target not found' });
    }
    res.json(target);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT to update an existing target by ID
router.put('/:id', async (req, res) => {
  try {
    const target = await MunicipalityTargets.findById(req.params.id);
    if (!target) {
      return res.status(404).json({ message: 'Target not found' });
    }

    const { type, municipality, semiAnnualTarget, targetYear } = req.body;

    // Update the fields
    target.type = type || target.type;
    target.municipality = municipality || target.municipality;
    target.semiAnnualTarget = semiAnnualTarget || target.semiAnnualTarget;
    target.targetYear = targetYear || target.targetYear;

    const updatedTarget = await target.save();
    res.json(updatedTarget);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE a target by ID
router.delete('/:id', async (req, res) => {
  try {
    const target = await MunicipalityTargets.findById(req.params.id);
    if (!target) {
      return res.status(404).json({ message: 'Target not found' });
    }

    await target.remove();
    res.json({ message: 'Target deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;