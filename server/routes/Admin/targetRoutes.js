// routes/targets.js
const express = require('express');
const router = express.Router();
const Target = require('../../models/Admin/TargetValue');


// GET all targets
router.get('/', async (req, res) => {
  try {
    const targets = await Target.find();
    res.json(targets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route to get targets for a specific year
router.get('/accomplishment', async (req, res) => {
  try {
    const { year } = req.query;
    let query = {};
    
    if (year) {
      query.targetYear = parseInt(year);
    }
    
    const targets = await Target.find(query);
    res.json(targets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// GET a specific target by type
router.get('/:type', async (req, res) => {
  try {
    const target = await Target.findOne({ Type: req.params.type });
    if (!target) return res.status(404).json({ message: 'Target not found' });
    res.json(target);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new target
router.post('/', async (req, res) => {
  const target = new Target({
    Type: req.body.Type,
    target: req.body.target,
    semiAnnualTarget: req.body.semiAnnualTarget,
    targetYear: req.body.targetYear
  });

  try {
    const newTarget = await target.save();
    res.status(201).json(newTarget);
  } catch (err) {
    // Check if the error is a duplicate key error (E11000)
    if (err.code === 11000) {
      const duplicatedField = Object.keys(err.keyValue)[0];
      res.status(400).json({
        message: `Duplicate entry: A target for '${req.body.Type}' already exists for the year ${req.body.targetYear}.`
      });
    } else {
      // Handle other errors (e.g., validation errors)
      res.status(400).json({ message: err.message });
    }
  }
});


// PATCH (update) a target by type
router.patch('/:type', async (req, res) => {
  try {
    const target = await Target.findOne({ Type: req.params.type });
    if (!target) return res.status(404).json({ message: 'Target not found' });

    if (req.body.target != null) {
      target.target = req.body.target;
    }
    if (req.body.semiAnnualTarget != null) {
      target.semiAnnualTarget = req.body.semiAnnualTarget;
    }

    const updatedTarget = await target.save();
    res.json(updatedTarget);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a target by type
router.delete('/:type', async (req, res) => {
  try {
    const target = await Target.findOne({ Type: req.params.type });
    if (!target) return res.status(404).json({ message: 'Target not found' });

    await target.remove();
    res.json({ message: 'Target deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
