// routes/inventory.js
const express = require('express');
const router = express.Router();
const Inventory = require('../models/Inventory'); // Import the Inventory model

// Create a new inventory item
router.post('/', async (req, res) => {

  try {
    const newInventory = new Inventory(req.body);
    await newInventory.save();
    res.status(201).json(newInventory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
// Get all inventory items with optional quantity filtering
router.get('/', async (req, res) => {
  try {
    const { quantity } = req.query; // Destructure quantity from query

    // Initialize filter object
    const filter = {};

    // Apply quantity filter if provided
    if (quantity) {
      filter.quantity = { $gte: Number(quantity) }; // Filter by quantity (greater than or equal to)
    }

    const inventories = await Inventory.find(filter); // Apply the filter
    res.status(200).json(inventories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Update an inventory item by ID
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedInventory = await Inventory.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedInventory) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }
    res.status(200).json(updatedInventory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete an inventory item by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedInventory = await Inventory.findByIdAndDelete(id);
    if (!deletedInventory) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }
    res.status(204).json(); // No content
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
