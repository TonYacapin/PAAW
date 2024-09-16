import React, { useEffect, useState } from "react";
import axios from "axios";
import { format, isSameMonth } from "date-fns";

function AccomplishmentReport() {
  const [speciesCount, setSpeciesCount] = useState([]);
  const [totals, setTotals] = useState({
    previousMonths: 0,
    thisMonth: 0,
    total: 0,
  });
  const [target, setTarget] = useState('');
  const [percentage, setPercentage] = useState(null);
  const [selectedVaccine, setSelectedVaccine] = useState('All');

  const vaccineGroups = {
    "Hemorrhagic Septicemia": ["Carabao", "Cattle", "Goat/Sheep"],
    "Hog Cholera": ["Swine"],
    "Newcastle Disease": ["Poultry"],
  };

  const vaccineTypes = Object.keys(vaccineGroups);

  useEffect(() => {
    // Fetch the data from the API
    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/api/reports`)
      .then((response) => {
        const data = response.data;
        const currentDate = new Date();
        const thisMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const speciesReport = {};

        // Helper function to add count by species
        function addSpeciesCount(species, isThisMonth) {
          if (!speciesReport[species]) {
            speciesReport[species] = {
              previousMonths: 0,
              thisMonth: 0,
              total: 0,
            };
          }
          if (isThisMonth) {
            speciesReport[species].thisMonth++;
          } else {
            speciesReport[species].previousMonths++;
          }
          speciesReport[species].total++;
        }

        // Traverse through all entries and count species
        data.forEach((report) => {
          report.entries.forEach((entry) => {
            const species = entry.animalInfo.species;
            const entryDate = new Date(entry.date);
            const isThisMonth = entryDate >= thisMonthStart && isSameMonth(entryDate, currentDate);
            addSpeciesCount(species, isThisMonth);
          });
        });

        // Convert the species report to an array format with vaccine groups
        const speciesArray = Object.keys(speciesReport).map((species) => {
          const vaccineType = Object.keys(vaccineGroups).find((vaccine) =>
            vaccineGroups[vaccine].includes(species)
          ) || "Other";
          return {
            species,
            vaccineType,
            previousMonths: speciesReport[species].previousMonths,
            thisMonth: speciesReport[species].thisMonth,
            total: speciesReport[species].total,
          };
        });

        // Sort the array by vaccine type and then by species
        speciesArray.sort((a, b) => {
          if (a.vaccineType !== b.vaccineType) {
            return a.vaccineType.localeCompare(b.vaccineType);
          }
          return a.species.localeCompare(b.species);
        });

        setSpeciesCount(speciesArray);
        // Calculate initial totals
        updateTotals(speciesArray);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  // Update totals based on filtered data
  const updateTotals = (data) => {
    const totalPreviousMonths = data.reduce((sum, species) => sum + species.previousMonths, 0);
    const totalThisMonth = data.reduce((sum, species) => sum + species.thisMonth, 0);
    const totalOverall = data.reduce((sum, species) => sum + species.total, 0);

    setTotals({
      previousMonths: totalPreviousMonths,
      thisMonth: totalThisMonth,
      total: totalOverall,
    });
  };

  // Compute percentage based on target
  const handleTargetChange = (e) => {
    const targetValue = e.target.value;
    setTarget(targetValue);
  
    // Convert target value to number
    const targetNumber = Number(targetValue);
  
    if (targetNumber > 0 && totals.total > 0) {
      setPercentage(((totals.total / targetNumber) * 100).toFixed(2));
    } else {
      setPercentage(null);
    }
  };
  
  // Handle vaccine type selection
  const handleVaccineChange = (e) => {
    const selectedVaccineType = e.target.value;
    setSelectedVaccine(selectedVaccineType);

    // Filter data based on selected vaccine type
    const filteredSpeciesCount = selectedVaccineType === 'All'
      ? speciesCount
      : speciesCount.filter((data) => data.vaccineType === selectedVaccineType);

    // Update totals based on filtered data
    updateTotals(filteredSpeciesCount);
  };

  // Filter data based on the selected vaccine type
  const filteredSpeciesCount = selectedVaccine === 'All'
    ? speciesCount
    : speciesCount.filter((data) => data.vaccineType === selectedVaccine);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Accomplishment Report</h1>
      <div className="mb-4">
        <label className="block text-lg font-semibold mb-2">Target Second Quarter Value:</label>
        <input
          type="number"
          value={target}
          onChange={handleTargetChange}
          className="border border-gray-300 rounded-md p-2 w-full"
          placeholder="Enter target value"
        />
        {percentage !== null && (
          <p className="mt-2 text-lg font-semibold">
            Percentage: {percentage}%
          </p>
        )}
      </div>
      <div className="mb-4">
        <label className="block text-lg font-semibold mb-2">Select Vaccine Type:</label>
        <select
          value={selectedVaccine}
          onChange={handleVaccineChange}
          className="border border-gray-300 rounded-md p-2 w-full"
        >
          <option value="All">All</option>
          {vaccineTypes.map((vaccine) => (
            <option key={vaccine} value={vaccine}>
              {vaccine}
            </option>
          ))}
        </select>
      </div>
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
        <thead>
          <tr className="bg-gray-100 text-left border-b border-gray-200">
            <th className="py-2 px-4">Vaccine Type</th>
            <th className="py-2 px-4">Species</th>
            <th className="py-2 px-4">Previous Months' Count</th>
            <th className="py-2 px-4">This Month's Count</th>
            <th className="py-2 px-4">Total</th>
          </tr>
        </thead>
        <tbody>
          {filteredSpeciesCount.length > 0 ? (
            filteredSpeciesCount.map((speciesData) => (
              <tr key={speciesData.species} className="border-b border-gray-200">
                <td className="py-2 px-4">{speciesData.vaccineType}</td>
                <td className="py-2 px-4">{speciesData.species + "(hds)"}</td>
                <td className="py-2 px-4">{speciesData.previousMonths}</td>
                <td className="py-2 px-4">{speciesData.thisMonth}</td>
                <td className="py-2 px-4">{speciesData.total}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="py-2 px-4 text-center">No data available</td>
            </tr>
          )}
          <tr className="bg-gray-100 font-bold">
            <td colSpan="2" className="py-2 px-4">Total</td>
            <td className="py-2 px-4">{totals.previousMonths}</td>
            <td className="py-2 px-4">{totals.thisMonth}</td>
            <td className="py-2 px-4">{totals.total}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default AccomplishmentReport;
