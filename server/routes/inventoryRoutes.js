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
// Get all inventory items with optional filters
router.get('/', async (req, res) => {
  try {
    const { month, year, type, quantity } = req.query; // Extract all filters

    const filter = {};

    // Apply the type filter
    if (type) {
      filter.type = type;
    }

    // Apply the quantity filter
    if (quantity) {
      filter.quantity = { $gte: Number(quantity) };
    }

    // Filter by createdAt month and year if both are provided
    if (month && year) {
      const startDate = new Date(`${year}-${month}-01`);
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1);

      filter.createdAt = { $gte: startDate, $lt: endDate };
    }

    const inventories = await Inventory.find(filter); // Apply all filters
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

router.get('/options', async (req, res) => {
  try {
    // Get unique types directly from the 'type' field
    const types = await Inventory.distinct('type');
    
    // Get unique months and years from 'createdAt' timestamps
    const months = await Inventory.aggregate([
      {
        $group: {
          _id: { month: { $month: "$createdAt" } },
        },
      },
      {
        $project: {
          month: "$_id.month",
          _id: 0
        }
      },
      { $sort: { month: 1 } }
    ]).then(results => results.map(result => result.month));

    const years = await Inventory.aggregate([
      {
        $group: {
          _id: { year: { $year: "$createdAt" } },
        },
      },
      {
        $project: {
          year: "$_id.year",
          _id: 0
        }
      },
      { $sort: { year: 1 } }
    ]).then(results => results.map(result => result.year));

    res.json({ months, years, types });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching filter options', error: error.message });
  }
});

module.exports = router;
