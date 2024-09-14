const express = require('express');
const router = express.Router();
const RabiesHistory = require('../models/RabiesHistoryModel'); // Adjust the path as needed

// Create a new RabiesHistory entry
router.post('/RH', async (req, res) => {
  try {
    const rabiesHistory = new RabiesHistory(req.body);
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
