const express = require('express');
const router = express.Router();
const AnimalProductionServices = require('../../models/Client/AnimalProductionServicesModel'); // Adjust the path as necessary


// Create a new Animal Production Services record
router.post('/', async (req, res) => {
    console.log("this is AnimalProductionServices " + JSON.stringify(req.body, null, 2))
  try {
   
    const newService = new AnimalProductionServices(req.body);
    const savedService = await newService.save();
    res.status(201).json(savedService);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all Animal Production Services records
router.get('/', async (req, res) => {
  try {
    const services = await AnimalProductionServices.find();
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific Animal Production Services record by ID
router.get('/:id', async (req, res) => {
  try {
    const service = await AnimalProductionServices.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update an Animal Production Services record by ID
router.put('/:id', async (req, res) => {
  try {
    const service = await AnimalProductionServices.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.status(200).json(service);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete an Animal Production Services record by ID
router.delete('/:id', async (req, res) => {
  try {
    const service = await AnimalProductionServices.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.status(204).send(); // No content to send back
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
