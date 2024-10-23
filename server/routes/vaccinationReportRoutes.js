const express = require('express');
const router = express.Router();
const VaccinationReport = require('../models/VaccinationReportModel'); // Update the path
const { check, validationResult } = require('express-validator');
// Route to create a new vaccination report
router.post(
  '/api/reports',
  [
    // Validate fields for the vaccination report
    check('vaccine').notEmpty().withMessage('Vaccine is required'),
    check('municipality').notEmpty().withMessage('Municipality is required'),
    check('dateReported').isISO8601().toDate().withMessage('Valid dateReported is required'),
    check('vaccineType')
      .isIn(['Live', 'Killed', 'Attenuated'])
      .withMessage('VaccineType must be one of Live, Killed, or Attenuated'),
    check('batchLotNo').notEmpty().withMessage('Batch lot number is required'),
    check('vaccineSource')
      .isIn(['MLGU', 'PLGU', 'RFU'])
      .withMessage('VaccineSource must be one of MLGU, PLGU, or RFU'),
    check('agriculturalExtensionWorker')
      .notEmpty()
      .withMessage('Agricultural extension worker name is required'),

    // Validate each entry in the 'entries' array
    check('entries').isArray({ min: 1 }).withMessage('At least one entry is required'),
    check('entries.*.no').isInt().withMessage('Entry number must be an integer'),
    check('entries.*.date').isISO8601().toDate().withMessage('Entry date must be a valid date'),
    check('entries.*.barangay').notEmpty().withMessage('Barangay is required'),
    check('entries.*.reason')
      .isIn(['Mass', 'Routine', 'Outbreak'])
      .withMessage('Reason must be one of Mass, Routine, or Outbreak'),

    // Validate clientInfo fields
    check('entries.*.clientInfo.firstName').notEmpty().withMessage('Client first name is required'),
    check('entries.*.clientInfo.lastName').notEmpty().withMessage('Client last name is required'),
    check('entries.*.clientInfo.gender')
      .isIn(['Male', 'Female'])
      .withMessage('Client gender must be Male or Female'),
    check('entries.*.clientInfo.birthday')
      .isISO8601()
      .toDate()
      .withMessage('Client birthday must be a valid date'),
    check('entries.*.clientInfo.contactNo').notEmpty().withMessage('Client contact number is required'),

    // Validate animalInfo fields
    check('entries.*.animalInfo.species').notEmpty().withMessage('Animal species is required'),
    check('entries.*.animalInfo.sex')
      .isIn(['Male', 'Female'])
      .withMessage('Animal sex must be Male or Female'),
    check('entries.*.animalInfo.age').notEmpty().withMessage('Animal age is required'),
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      // Create an object to check for duplicates, excluding the entries field
      const { vaccine, municipality, dateReported, vaccineType, batchLotNo, vaccineSource, agriculturalExtensionWorker } = req.body;
      
      // Find existing reports based on unique fields
      const existingReport = await VaccinationReport.findOne({ 
        vaccine,
        municipality,
        dateReported,
        vaccineType,
        batchLotNo,
        vaccineSource,
        agriculturalExtensionWorker,
      });

      // Check if a report already exists with the same unique fields
      if (existingReport) {
        return res.status(409).json({ message: 'Duplicate entry found. Report already exists with the same details.' });
      }

      console.log(req.body);
      const vaccinationReportData = req.body;
      const vaccinationReport = new VaccinationReport(vaccinationReportData);
      await vaccinationReport.save();
      res.status(201).json({ message: 'Report created successfully', report: vaccinationReport });
    } catch (error) {
      console.error('Error creating report:', error);
      res.status(500).json({ message: 'Failed to create report' });
    }
  
  }
);
// Route to get filtered vaccination reports
router.get('/api/reports', async (req, res) => {
  const { municipality, startDate, endDate, species } = req.query;

  try {
    // Build the query object dynamically based on the filters provided
    let query = {};

    // Filter by municipality if provided
    if (municipality) {
      query.municipality = municipality;
    }

    // Filter by species if provided
    if (species) {
      query.species = species;
    }

    // Filter by date range (startDate and/or endDate)
    if (startDate || endDate) {
      query.dateReported = {}; // Initialize dateReported field in the query

      if (startDate) {
        query.dateReported.$gte = new Date(startDate); // Greater than or equal to startDate
      }

      if (endDate) {
        query.dateReported.$lte = new Date(endDate); // Less than or equal to endDate
      }
    }

    // Fetch the filtered reports from the database
    const reports = await VaccinationReport.find(query);
    res.status(200).json(reports);
  } catch (error) {
    console.error('Error retrieving reports:', error);
    res.status(500).json({ message: 'Failed to retrieve reports' });
  }
});
router.get('/api/reports/accomplishment', async (req, res) => {
  try {
    const { year } = req.query;
    let query = {};
    1
    if (year) {
      const startDate = new Date(parseInt(year), 0, 1);
      const endDate = new Date(parseInt(year) + 1, 0, 1);
      query.dateReported = { $gte: startDate, $lt: endDate };
    }
    
    const reports = await VaccinationReport.find(query);
    res.status(200).json(reports);
  } catch (error) {
    console.error('Error retrieving reports:', error);
    res.status(500).json({ message: 'Failed to retrieve reports' });
  }
});



// Route to get a single vaccination report by ID
router.get('/api/reports/:id', async (req, res) => {
  try {
    const report = await VaccinationReport.findById(req.params.id);
    if (report) {
      res.status(200).json(report);
    } else {
      res.status(404).json({ message: 'Report not found' });
    }
  } catch (error) {
    console.error('Error retrieving report:', error);
    res.status(500).json({ message: 'Failed to retrieve report' });
  }
});

// Route to update a vaccination report by ID
router.put('/api/reports/:id', async (req, res) => {
  try {
    const updatedReport = await VaccinationReport.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (updatedReport) {
      res.status(200).json({ message: 'Report updated successfully', report: updatedReport });
    } else {
      res.status(404).json({ message: 'Report not found' });
    }
  } catch (error) {
    console.error('Error updating report:', error);
    res.status(500).json({ message: 'Failed to update report' });
  }
});

// Route to delete a vaccination report by ID
router.delete('/api/reports/:id', async (req, res) => {
  try {
    const deletedReport = await VaccinationReport.findByIdAndDelete(req.params.id);
    if (deletedReport) {
      res.status(200).json({ message: 'Report deleted successfully' });
    } else {
      res.status(404).json({ message: 'Report not found' });
    }
  } catch (error) {
    console.error('Error deleting report:', error);
    res.status(500).json({ message: 'Failed to delete report' });
  }
});

// Route to add an entry to a vaccination report by ID
router.post('/api/reports/:id/entries', async (req, res) => {
  try {
    const { entries } = req.body;
    const report = await VaccinationReport.findById(req.params.id);
    if (report) {
      report.entries.push(...entries);
      await report.save();
      res.status(200).json({ message: 'Entries added successfully', report });
    } else {
      res.status(404).json({ message: 'Report not found' });
    }
  } catch (error) {
    console.error('Error adding entries:', error);
    res.status(500).json({ message: 'Failed to add entries' });
  }
});

// Route to update an entry in a vaccination report by report ID and entry index
router.put('/api/reports/:reportId/entries/:entryIndex', async (req, res) => {
  try {
    const { reportId, entryIndex } = req.params;
    const updatedEntry = req.body;
    const report = await VaccinationReport.findById(reportId);
    if (report && report.entries[entryIndex]) {
      report.entries[entryIndex] = updatedEntry;
      await report.save();
      res.status(200).json({ message: 'Entry updated successfully', report });
    } else {
      res.status(404).json({ message: 'Report or entry not found' });
    }
  } catch (error) {
    console.error('Error updating entry:', error);
    res.status(500).json({ message: 'Failed to update entry' });
  }
});

// Route to delete an entry from a vaccination report by report ID and entry index
router.delete('/api/reports/:reportId/entries/:entryIndex', async (req, res) => {
  try {
    const { reportId, entryIndex } = req.params;
    const report = await VaccinationReport.findById(reportId);
    if (report && report.entries[entryIndex]) {
      report.entries.splice(entryIndex, 1);
      await report.save();
      res.status(200).json({ message: 'Entry deleted successfully', report });
    } else {
      res.status(404).json({ message: 'Report or entry not found' });
    }
  } catch (error) {
    console.error('Error deleting entry:', error);
    res.status(500).json({ message: 'Failed to delete entry' });
  }
});
router.get('/species-count', async (req, res) => {
  try {
    // Get the parameters from the request query
    const { year, month, vaccine } = req.query;

    // Parse year and month from the query or use the current date as default
    const selectedYear = parseInt(year) || new Date().getFullYear();
    const selectedMonth = parseInt(month) || new Date().getMonth() + 1; // Months are 1-based for input

    // Define the date range for the selected month
    const startOfSelectedMonth = new Date(selectedYear, selectedMonth - 1, 1);
    const endOfSelectedMonth = new Date(selectedYear, selectedMonth, 0); // Last day of the selected month

    // Define the date ranges for the previous month
    const startOfPreviousMonth = new Date(selectedYear, selectedMonth - 2, 1);
    const endOfPreviousMonth = new Date(selectedYear, selectedMonth - 1, 0);

    // Aggregate query to count entries per species and vaccine for each month
    const speciesCount = await VaccinationReport.aggregate([
      { $unwind: "$entries" }, // Unwind the entries array
      {
        $addFields: {
          "entries.date": {
            $cond: {
              if: { $ne: [{ $type: "$entries.date" }, "date"] },
              then: { $toDate: "$entries.date" },
              else: "$entries.date"
            }
          }
        }
      },
      {
        $match: {
          "entries.date": { $lte: endOfSelectedMonth } // Only include entries up to the selected month
        }
      },
      {
        $group: {
          _id: {
            species: "$entries.animalInfo.species",
            vaccine: "$vaccine",
            year: { $year: "$entries.date" },
            month: { $month: "$entries.date" }
          },
          count: { $sum: 1 } // Count the number of entries
        }
      },
      {
        $project: {
          species: "$_id.species",
          vaccine: "$_id.vaccine",
          year: "$_id.year",
          month: "$_id.month",
          count: 1,
          _id: 0
        }
      }
    ]);

    // Initialize counters
    let result = {};

    // Process the results
    speciesCount.forEach(item => {
      const { species, vaccine: itemVaccine, year, month, count } = item;

      // Skip if a specific vaccine was requested and this item doesn't match
      if (vaccine && vaccine.toLowerCase() !== 'all' && itemVaccine !== vaccine) {
        return;
      }

      if (!result[itemVaccine]) {
        result[itemVaccine] = {};
      }

      if (!result[itemVaccine][species]) {
        result[itemVaccine][species] = {
          previousMonthCount: 0,
          thisMonthCount: 0,
          totalCount: 0
        };
      }

      // Check if the entry is from the previous month
      if (year === startOfPreviousMonth.getFullYear() && month === startOfPreviousMonth.getMonth() + 1) {
        result[itemVaccine][species].previousMonthCount += count;
      }

      // Check if the entry is from the selected month
      if (year === startOfSelectedMonth.getFullYear() && month === startOfSelectedMonth.getMonth() + 1) {
        result[itemVaccine][species].thisMonthCount += count;
      }

      // Count total for every month up to and including the desired month
      if (year < selectedYear || (year === selectedYear && month <= selectedMonth)) {
        result[itemVaccine][species].totalCount += count;
      }
    });

    // Format the result
    const formattedResult = Object.entries(result).map(([vaccine, speciesData]) => ({
      vaccine,
      species: Object.entries(speciesData).map(([species, counts]) => ({
        species,
        ...counts
      }))
    }));

    // Send the result as the response
    res.json(formattedResult);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/vaccination/species-count', async (req, res) => {
  try {
    const { year, month, species } = req.query;

    // Validate the input
    if (!year || !month) {
      return res.status(400).json({ error: 'Year and month are required parameters.' });
    }

    const parsedYear = parseInt(year);
    const parsedMonth = parseInt(month) - 1; // Adjust month for zero-based index

    // Define the date ranges
    const startOfThisMonth = new Date(parsedYear, parsedMonth, 1);
    const startOfPreviousMonth = new Date(parsedYear, parsedMonth - 1, 1);
    const endOfPreviousMonth = new Date(parsedYear, parsedMonth, 0); // Last day of the previous month

    // Build the species filter if provided
    const speciesFilter = species ? { "entries.animalInfo.species": species } : {};

    // Aggregation pipeline to count species per municipality
    const speciesCount = await VaccinationReport.aggregate([
      { $unwind: "$entries" }, // Unwind the entries array
      {
        $addFields: {
          "entries.date": {
            $cond: {
              // Convert to Date if the field type is not "date"
              if: { $ne: [{ $type: "$entries.date" }, "date"] },
              then: { $toDate: "$entries.date" },
              else: "$entries.date"
            }
          }
        }
      },
      {
        $facet: {
          // Current month counts
          currentMonth: [
            {
              $match: {
                $and: [
                  { "entries.date": { $gte: startOfThisMonth, $lt: new Date(parsedYear, parsedMonth + 1, 1) } },
                  speciesFilter // Add species filter
                ]
              }
            },
            {
              $group: {
                _id: {
                  municipality: "$municipality",
                  species: "$entries.animalInfo.species",
                  vaccine: "$vaccine"
                },
                count: { $sum: 1 }
              }
            },
            {
              $project: {
                municipality: "$_id.municipality",
                species: "$_id.species",
                vaccine: "$_id.vaccine",
                count: 1
              }
            }
          ],
          // Previous month counts
          previousMonth: [
            {
              $match: {
                $and: [
                  { "entries.date": { $gte: startOfPreviousMonth, $lt: startOfThisMonth } },
                  speciesFilter // Add species filter
                ]
              }
            },
            {
              $group: {
                _id: {
                  municipality: "$municipality",
                  species: "$entries.animalInfo.species",
                  vaccine: "$vaccine"
                },
                count: { $sum: 1 }
              }
            },
            {
              $project: {
                municipality: "$_id.municipality",
                species: "$_id.species",
                vaccine: "$_id.vaccine",
                count: 1
              }
            }
          ],
          // Total counts up to the current month
          total: [
            {
              $match: {
                $and: [
                  { "entries.date": { $lt: new Date(parsedYear, parsedMonth + 1, 1) } },
                  speciesFilter // Add species filter
                ]
              }
            },
            {
              $group: {
                _id: {
                  municipality: "$municipality",
                  species: "$entries.animalInfo.species",
                  vaccine: "$vaccine"
                },
                count: { $sum: 1 }
              }
            },
            {
              $project: {
                municipality: "$_id.municipality",
                species: "$_id.species",
                vaccine: "$_id.vaccine",
                count: 1
              }
            }
          ]
        }
      }
    ]);

    res.json(speciesCount);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
