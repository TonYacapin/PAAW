const express = require('express');
const AnimalHealthCareServices = require('../../models/Client/AnimalHealthCareServicesModel');
const router = express.Router();

// Create a new Animal Health Care Service
router.post('/', async (req, res) => {
  try {
    // Step 1: Log the incoming request data
    console.log("Received request body:", JSON.stringify(req.body, null, 2));

    // Step 2: Check if the required 'clientInfo' field is present
    if (!req.body.clientInfo) {
      console.error("Error: Missing clientInfo in the request body.");
      return res.status(400).json({ message: "Missing required field: clientInfo" });
    }

    // Step 3: Log specific fields in the 'clientInfo' for validation
    console.log("Client Info received:", req.body.clientInfo);

    // Step 4: Validate required fields in 'clientInfo'
    const { name, barangay, municipality, province, birthday, gender, contact } = req.body.clientInfo;
    if (!name || !barangay || !municipality || !province || !birthday || !gender || !contact) {
      console.error("Error: Missing required fields in clientInfo.");
      return res.status(400).json({ message: "Missing required fields in clientInfo" });
    }

    // Step 5: Log additional fields for other optional arrays
    console.log("Rabies Vaccinations:", JSON.stringify(req.body.rabiesVaccinations, null, 2));
    console.log("Vaccinations:", JSON.stringify(req.body.vaccinations, null, 2));
    console.log("Routine Services:", JSON.stringify(req.body.routineServices, null, 2));

    // Step 6: Create the new Animal Health Care Service document
    const newService = new AnimalHealthCareServices(req.body);

    // Step 7: Attempt to save the new document and log the response
    const savedService = await newService.save();
    console.log("Successfully saved new service:", JSON.stringify(savedService, null, 2));

    // Step 8: Return the saved document as the response
    res.status(201).json(savedService);
  } catch (error) {
    // Step 9: Log detailed error information if the save fails
    console.error("Error saving Animal Health Care Service:", error.message);
    console.error("Full error details:", error);

    res.status(400).json({ message: error.message });
  }
});


// Get all Animal Health Care Services
router.get('/', async (req, res) => {
  try {
    const services = await AnimalHealthCareServices.find();
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific Animal Health Care Service by ID
router.get('/:id', async (req, res) => {
  try {
    const service = await AnimalHealthCareServices.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update an Animal Health Care Service by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedService = await AnimalHealthCareServices.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedService) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.status(200).json(updatedService);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete an Animal Health Care Service by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedService = await AnimalHealthCareServices.findByIdAndDelete(req.params.id);
    if (!deletedService) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.status(200).json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
