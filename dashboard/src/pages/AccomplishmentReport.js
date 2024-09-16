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
    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/api/reports`)
      .then((response) => {
        const data = response.data;
        const currentDate = new Date();
        const thisMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const speciesReport = {};

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

        data.forEach((report) => {
          report.entries.forEach((entry) => {
            const species = entry.animalInfo.species;
            const entryDate = new Date(entry.date);
            const isThisMonth = entryDate >= thisMonthStart && isSameMonth(entryDate, currentDate);
            addSpeciesCount(species, isThisMonth);
          });
        });

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

        speciesArray.sort((a, b) => {
          if (a.vaccineType !== b.vaccineType) {
            return a.vaccineType.localeCompare(b.vaccineType);
          }
          return a.species.localeCompare(b.species);
        });

        setSpeciesCount(speciesArray);
        updateTotals(speciesArray);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

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

  const handleTargetChange = (e) => {
    const targetValue = e.target.value;
    setTarget(targetValue);
  
    const targetNumber = Number(targetValue);
  
    if (targetNumber > 0 && totals.total > 0) {
      setPercentage(((totals.total / targetNumber) * 100).toFixed(2));
    } else {
      setPercentage(null);
    }
  };
  
  const handleVaccineChange = (e) => {
    const selectedVaccineType = e.target.value;
    setSelectedVaccine(selectedVaccineType);

    const filteredSpeciesCount = selectedVaccineType === 'All'
      ? speciesCount
      : speciesCount.filter((data) => data.vaccineType === selectedVaccineType);

    updateTotals(filteredSpeciesCount);
  };

  const filteredSpeciesCount = selectedVaccine === 'All'
    ? speciesCount
    : speciesCount.filter((data) => data.vaccineType === selectedVaccine);

  return (
    <div className="p-6 bg-[#FFFAFA] min-h-screen">
      <h1 className="text-3xl font-extrabold mb-6 text-[#1b5b40]">Accomplishment Report</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white p-4 border border-[#1b5b40] rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-[#1b5b40] mb-2">Target Second Quarter Value</h2>
          <input
            type="number"
            value={target}
            onChange={handleTargetChange}
            className="border border-[#1b5b40] rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-[#ffe356] text-[#252525]"
            placeholder="Enter target value"
          />
          {percentage !== null && (
            <p className="mt-2 text-lg font-semibold text-[#1b5b40]">
              Percentage: {percentage}%
            </p>
          )}
        </div>
        <div className="bg-white p-4 border border-[#1b5b40] rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-[#1b5b40] mb-2">Select Vaccine</h2>
          <select
            value={selectedVaccine}
            onChange={handleVaccineChange}
            className="border border-[#1b5b40] rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-[#ffe356] text-[#252525]"
          >
            <option value="All">All</option>
            {vaccineTypes.map((vaccine) => (
              <option key={vaccine} value={vaccine}>
                {vaccine}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="overflow-x-auto mt-6">
        <table className="min-w-full bg-white border border-[#1b5b40] rounded-lg shadow-lg">
          <thead className="bg-[#ffe356] text-[#1b5b40]">
            <tr>
              <th className="py-3 px-4 text-left">Vaccine Type</th>
              <th className="py-3 px-4 text-left">Species</th>
              <th className="py-3 px-4 text-left">Previous Months' Count</th>
              <th className="py-3 px-4 text-left">This Month's Count</th>
              <th className="py-3 px-4 text-left">Total</th>
            </tr>
          </thead>
          <tbody>
            {filteredSpeciesCount.length > 0 ? (
              filteredSpeciesCount.map((speciesData) => (
                <tr key={speciesData.species} className="border-b border-[#1b5b40] hover:bg-[#f9f9f9]">
                  <td className="py-2 px-4 text-[#252525]">{speciesData.vaccineType}</td>
                  <td className="py-2 px-4 text-[#252525]">{speciesData.species + "(hds)"}</td>
                  <td className="py-2 px-4 text-[#252525]">{speciesData.previousMonths}</td>
                  <td className="py-2 px-4 text-[#252525]">{speciesData.thisMonth}</td>
                  <td className="py-2 px-4 text-[#252525]">{speciesData.total}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-2 px-4 text-center text-[#252525]">No data available</td>
              </tr>
            )}
            <tr className="bg-[#ffe356] font-bold text-[#1b5b40]">
              <td colSpan="2" className="py-3 px-4">Total</td>
              <td className="py-3 px-4">{totals.previousMonths}</td>
              <td className="py-3 px-4">{totals.thisMonth}</td>
              <td className="py-3 px-4">{totals.total}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AccomplishmentReport;
