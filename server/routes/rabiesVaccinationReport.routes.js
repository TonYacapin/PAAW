const express = require('express');
const router = express.Router();
const RabiesVaccinationReport = require('../models/rabiesVaccinationReport.model');

// Create a new report
router.post('/api/entries', async (req, res) => {
  try {
    const newReport = new RabiesVaccinationReport(req.body);
    await newReport.save();
    res.status(201).json(newReport);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Retrieve all reports
router.get('/api/entries', async (req, res) => {
  try {
    const reports = await RabiesVaccinationReport.find();
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a specific report
router.put('/api/entries/:id', async (req, res) => {
  try {
    const updatedReport = await RabiesVaccinationReport.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedReport) return res.status(404).json({ error: 'Report not found' });
    res.json(updatedReport);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a specific report
router.delete('/api/entries/:id', async (req, res) => {
  try {
    const deletedReport = await RabiesVaccinationReport.findByIdAndDelete(req.params.id);
    if (!deletedReport) return res.status(404).json({ error: 'Report not found' });
    res.json({ message: 'Report deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/rabies-report/entry-count', async (req, res) => {
  try {
    const { year, month } = req.query;

    // Validate input
    if (!year || !month) {
      return res.status(400).json({ error: "Year and month are required parameters." });
    }

    const parsedYear = parseInt(year);
    const parsedMonth = parseInt(month); 

    
    const startOfThisMonth = new Date(parsedYear, parsedMonth - 1, 1); 
    const endOfThisMonth = new Date(parsedYear, parsedMonth, 0); 
    const startOfPreviousMonth = new Date(parsedYear, parsedMonth - 2, 1); 
    const endOfPreviousMonth = new Date(parsedYear, parsedMonth - 1, 0); 


   
    const entryCount = await RabiesVaccinationReport.aggregate([
      { $unwind: "$entries" },
      {
        $group: {
          _id: null,
          previousMonthCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $gte: ["$entries.date", startOfPreviousMonth] },
                    { $lt: ["$entries.date", startOfThisMonth] }  // Changed this condition
                  ]
                },
                1, 0
              ]
            }
          },
          thisMonthCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $gte: ["$entries.date", startOfThisMonth] },
                    { $lte: ["$entries.date", endOfThisMonth] }
                  ]
                },
                1, 0
              ]
            }
          },
          totalCount: { 
            $sum: {
              $cond: [
                { $lte: ["$entries.date", endOfThisMonth] },
                1, 0
              ]
            }
          }
        }
      }
    ]);

    // If no entries exist, return zero counts
    const result = entryCount.length > 0 ? entryCount[0] : {
      previousMonthCount: 0,
      thisMonthCount: 0,
      totalCount: 0
    };

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


function getMonthRange(year, month) {
  const start = new Date(year, month - 1, 1); // Month is 0-indexed in JavaScript Date
  const end = new Date(year, month, 1); // First day of the next month
  return { start, end };
}

// Route to count rabies vaccinations by municipality, species, and vaccine
router.get('/rabies-vaccination-summary', async (req, res) => {
  try {
    const { year, month } = req.query;

    const selectedYear = parseInt(year, 10);
    const selectedMonth = parseInt(month, 10);

    if (!selectedYear || !selectedMonth) {
      return res.status(400).json({ error: 'Please provide valid year and month as query parameters' });
    }

    // Calculate date ranges for the current month, previous month, and all previous months up to current
    const currentMonthRange = getMonthRange(selectedYear, selectedMonth);
    const previousMonthRange = getMonthRange(selectedYear, selectedMonth - 1);
    const startOfYear = new Date(selectedYear, 0, 1);

    const aggregationPipeline = (start, end) => [
      // Unwind the entries array
      { $unwind: '$entries' },

      // Match within the provided date range
      {
        $match: {
          'entries.date': {
            $gte: start,
            $lt: end
          }
        }
      },

      // Group by municipality, species, and vaccine, and count the number of entries
      {
        $group: {
          _id: {
            municipality: '$municipality',
            species: '$entries.animalInfo.species',
            vaccine: '$vaccineUsed'
          },
          count: { $sum: 1 }
        }
      },

      // Project the results in a more readable format
      {
        $project: {
          _id: 0,
          municipality: '$_id.municipality',
          species: '$_id.species',
          vaccine: '$_id.vaccine',
          count: 1
        }
      }
    ];

    // Get counts for the current month
    const currentMonthCounts = await RabiesVaccinationReport.aggregate(
      aggregationPipeline(currentMonthRange.start, currentMonthRange.end)
    );

    // Get counts for the previous month
    const previousMonthCounts = await RabiesVaccinationReport.aggregate(
      aggregationPipeline(previousMonthRange.start, previousMonthRange.end)
    );

    // Get total counts from the start of the year up to the current month
    const totalCounts = await RabiesVaccinationReport.aggregate(
      aggregationPipeline(startOfYear, currentMonthRange.end)
    );

    // Respond with the formatted structure
    res.json({
      currentMonth: currentMonthCounts,
      previousMonth: previousMonthCounts,
      total: totalCounts
    });
  } catch (error) {
    console.error('Error fetching rabies vaccination counts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
module.exports = router;