const express = require('express');
const router = express.Router();
const VeterinaryShipment = require('../models/VetShipform'); // Adjust path if necessary

// GET all veterinary shipments
router.get('/', async (req, res) => {
  try {
    const shipments = await VeterinaryShipment.find();
    res.json(shipments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a specific veterinary shipment by ID
router.get('/:id', getVeterinaryShipment, (req, res) => {
  res.json(res.veterinaryShipment);
});

// POST (Create) a new veterinary shipment
router.post('/', async (req, res) => {
  const veterinaryShipment = new VeterinaryShipment({
    shipmentType: req.body.shipmentType,
    shipperName: req.body.shipperName,
    date: req.body.date,
    pointOfOrigin: req.body.pointOfOrigin,
    remarks: req.body.remarks,
    liveAnimals: req.body.liveAnimals,
    animalByProducts: req.body.animalByProducts,
  });

  try {
    const newShipment = await veterinaryShipment.save();
    res.status(201).json(newShipment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PATCH (Update) a veterinary shipment by ID
router.patch('/:id', getVeterinaryShipment, async (req, res) => {
  if (req.body.shipmentType != null) {
    res.veterinaryShipment.shipmentType = req.body.shipmentType;
  }
  if (req.body.shipperName != null) {
    res.veterinaryShipment.shipperName = req.body.shipperName;
  }
  if (req.body.date != null) {
    res.veterinaryShipment.date = req.body.date;
  }
  if (req.body.pointOfOrigin != null) {
    res.veterinaryShipment.pointOfOrigin = req.body.pointOfOrigin;
  }
  if (req.body.remarks != null) {
    res.veterinaryShipment.remarks = req.body.remarks;
  }
  if (req.body.liveAnimals != null) {
    res.veterinaryShipment.liveAnimals = req.body.liveAnimals;
  }
  if (req.body.animalByProducts != null) {
    res.veterinaryShipment.animalByProducts = req.body.animalByProducts;
  }

  try {
    const updatedShipment = await res.veterinaryShipment.save();
    res.json(updatedShipment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a veterinary shipment by ID
router.delete('/:id', getVeterinaryShipment, async (req, res) => {
  try {
    await res.veterinaryShipment.remove();
    res.json({ message: 'Veterinary shipment deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware to get a veterinary shipment by ID
async function getVeterinaryShipment(req, res, next) {
  let veterinaryShipment;
  try {
    veterinaryShipment = await VeterinaryShipment.findById(req.params.id);
    if (veterinaryShipment == null) {
      return res.status(404).json({ message: 'Cannot find veterinary shipment' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.veterinaryShipment = veterinaryShipment;
  next();
}

module.exports = router;
