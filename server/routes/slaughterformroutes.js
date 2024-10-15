const express = require('express');
const router = express.Router();
const SlaughterReport = require('../models/SlaughterFormModel'); // Assuming the model is stored in 'models/SlaughterReport.js'

// GET all slaughter reports
router.get('/', async (req, res) => {
  try {
    const reports = await SlaughterReport.find();
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a single slaughter report by ID
router.get('/:id', getSlaughterReport, (req, res) => {
  res.json(res.slaughterReport);
});

// POST (Create) a new slaughter report
router.post('/', async (req, res) => {
  const slaughterReport = new SlaughterReport({
    municipality: req.body.municipality,
    month: req.body.month,
    year: req.body.year,
    slaughterAnimals: req.body.slaughterAnimals
  });

  try {
    const newReport = await slaughterReport.save();
    res.status(201).json(newReport);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PATCH (Update) a slaughter report by ID
router.patch('/:id', getSlaughterReport, async (req, res) => {
  if (req.body.municipality != null) {
    res.slaughterReport.municipality = req.body.municipality;
  }
  if (req.body.month != null) {
    res.slaughterReport.month = req.body.month;
  }
  if (req.body.year != null) {
    res.slaughterReport.year = req.body.year;
  }
  if (req.body.slaughterAnimals != null) {
    res.slaughterReport.slaughterAnimals = req.body.slaughterAnimals;
  }

  try {
    const updatedReport = await res.slaughterReport.save();
    res.json(updatedReport);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a slaughter report by ID
router.delete('/:id', getSlaughterReport, async (req, res) => {
  try {
    await res.slaughterReport.remove();
    res.json({ message: 'Slaughter report deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware to get a slaughter report by ID
async function getSlaughterReport(req, res, next) {
  let slaughterReport;
  try {
    slaughterReport = await SlaughterReport.findById(req.params.id);
    if (slaughterReport == null) {
      return res.status(404).json({ message: 'Cannot find slaughter report' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.slaughterReport = slaughterReport;
  next();
}

module.exports = router;
