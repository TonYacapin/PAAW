// routes/routineServicesMonitoringReport.js
const express = require('express');
const router = express.Router();
const RoutineServicesMonitoringReport = require('../models/RoutineServicesMonitoringReport');

// Create a new report
router.post('/RSM', async (req, res) => {
  try {
    console.log(req.body)
    const report = new RoutineServicesMonitoringReport(req.body);
    await report.save();
    res.status(201).json(report);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all reports
router.get('/RSM', async (req, res) => {
  try {
    const reports = await RoutineServicesMonitoringReport.find();
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific report by ID
router.get('/RSM/:id', async (req, res) => {
  try {
    const report = await RoutineServicesMonitoringReport.findById(req.params.id);
    if (report) {
      res.status(200).json(report);
    } else {
      res.status(404).json({ message: 'Report not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a report
router.put('/RSM/:id', async (req, res) => {
  try {
    const report = await RoutineServicesMonitoringReport.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (report) {
      res.status(200).json(report);
    } else {
      res.status(404).json({ message: 'Report not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a report
router.delete('/RSM/:id', async (req, res) => {
  try {
    const report = await RoutineServicesMonitoringReport.findByIdAndDelete(req.params.id);
    if (report) {
      res.status(200).json({ message: 'Report deleted successfully' });
    } else {
      res.status(404).json({ message: 'Report not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/species-activity-count', async (req, res) => {
  try {
    const { year, month } = req.query;

    // Parse the year and month from the request query or use the current date as default
    const selectedYear = parseInt(year) || new Date().getFullYear();
    const selectedMonth = parseInt(month) || new Date().getMonth() + 1;

    // Define date ranges for the selected month and previous month
    const startOfSelectedMonth = new Date(selectedYear, selectedMonth - 1, 1);
    const endOfSelectedMonth = new Date(selectedYear, selectedMonth, 0);
    const startOfPreviousMonth = new Date(selectedYear, selectedMonth - 2, 1);
    const endOfPreviousMonth = new Date(selectedYear, selectedMonth - 1, 0);

    // Aggregation pipeline to count noOfHeads per species and separate by activity
    const speciesActivityCount = await RoutineServicesMonitoringReport.aggregate([
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
        $group: {
          _id: {
            species: "$entries.animalInfo.species",
            activity: "$entries.activity",
            year: { $year: "$entries.date" },
            month: { $month: "$entries.date" }
          },
          totalHeads: { $sum: "$entries.animalInfo.noOfHeads" } // Sum the noOfHeads
        }
      },
      {
        $project: {
          species: "$_id.species",
          activity: "$_id.activity",
          year: "$_id.year",
          month: "$_id.month",
          totalHeads: 1,
          _id: 0
        }
      }
    ]);

    // Initialize counts
    let previousMonthCounts = {};
    let thisMonthCounts = {};
    let totalCounts = {};

    // Process the results
    speciesActivityCount.forEach(item => {
      const species = item.species;
      const activity = item.activity;
      const year = item.year;
      const month = item.month;

      // Key for species and activity
      const key = `${species}_${activity}`;

      // Check if the entry is from the previous month
      if (year === startOfPreviousMonth.getFullYear() && month === startOfPreviousMonth.getMonth() + 1) {
        previousMonthCounts[key] = (previousMonthCounts[key] || 0) + item.totalHeads;
      }

      // Check if the entry is from the selected month
      if (year === startOfSelectedMonth.getFullYear() && month === startOfSelectedMonth.getMonth() + 1) {
        thisMonthCounts[key] = (thisMonthCounts[key] || 0) + item.totalHeads;
      }

      // Count total for all months up to the selected month
      if (year === selectedYear && month <= selectedMonth) {
        totalCounts[key] = (totalCounts[key] || 0) + item.totalHeads;
      }
    });

    // Prepare the final result
    const result = Object.keys(totalCounts).map(key => {
      const [species, activity] = key.split('_');
      return {
        species,
        activity,
        previousMonthCount: previousMonthCounts[key] || 0,
        thisMonthCount: thisMonthCounts[key] || 0,
        totalCount: totalCounts[key] || 0
      };
    });

    // Send the result as the response
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
