const express = require('express');
const router = express.Router();
const VaccinationReport = require('../models/VaccinationReportModel'); // Update the path

// Route to create a new vaccination report
router.post('/api/reports', async (req, res) => {
  try {
    console.log(req.body)
    const vaccinationReportData = req.body;
    const vaccinationReport = new VaccinationReport(vaccinationReportData);
    await vaccinationReport.save();
    res.status(201).json({ message: 'Report created successfully', report: vaccinationReport });
  } catch (error) {
    console.error('Error creating report:', error);
    res.status(500).json({ message: 'Failed to create report' });
  }
});

// Route to get all vaccination reports
router.get('/api/reports', async (req, res) => {
  try {
    const reports = await VaccinationReport.find();
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

module.exports = router;
