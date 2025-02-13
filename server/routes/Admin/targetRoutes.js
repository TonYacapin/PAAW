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
    const { year, reportType } = req.query;
    let query = {};
    let totalTarget = 0;
    let totalSemiAnnualTarget = 0;

    if (year) {
      query.targetYear = parseInt(year);
    }

    const targets = await Target.find(query);

    // Filtering and calculating totals based on report type
    if (reportType === 'VaccinationReport') {
      const vaccinationTypes = ['Hemorrhagic Septicemia', 'New Castle Disease', 'Hog Cholera'];
      const filteredTargets = targets.filter(target => vaccinationTypes.includes(target.Type));

      totalTarget = filteredTargets.reduce((acc, target) => acc + target.target, 0);
      totalSemiAnnualTarget = filteredTargets.reduce((acc, target) => acc + target.semiAnnualTarget, 0);

    } else if (reportType === 'RoutineServiceMonitoring') {
      const routineServices = [
        'Deworming', 'Wound Treatment', 'Vitamin Supplementation',
        'Iron Supplementation', 'Consultation', 'Support'
      ];
      const filteredTargets = targets.filter(target => routineServices.includes(target.Type));

      totalTarget = filteredTargets.reduce((acc, target) => acc + target.target, 0);
      totalSemiAnnualTarget = filteredTargets.reduce((acc, target) => acc + target.semiAnnualTarget, 0);

    } else if (reportType === 'RabiesVaccination') {
      const filteredTargets = targets.filter(target => target.Type === 'No. of dogs immunized against rabies and registered');

      totalTarget = filteredTargets.reduce((acc, target) => acc + target.target, 0);
      totalSemiAnnualTarget = filteredTargets.reduce((acc, target) => acc + target.semiAnnualTarget, 0);
    }

    res.json({ targets, totalTarget, totalSemiAnnualTarget });
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

router.put('/:id', async (req, res) => {
  const { Type, target, semiAnnualTarget, targetYear } = req.body;

  try {
      const updatedTarget = await Target.findByIdAndUpdate(req.params.id, {
          Type,
          target,
          semiAnnualTarget,
          targetYear,
      }, { new: true }); // Returns the updated document
      res.status(200).json(updatedTarget);
  } catch (err) {
      res.status(400).json({ message: err.message });
  }
});

module.exports = router;
