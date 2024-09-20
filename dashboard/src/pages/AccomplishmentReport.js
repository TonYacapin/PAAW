import React, { useEffect, useState } from "react";
import axios from "axios";
import { format, isSameMonth, subMonths } from "date-fns";

function AccomplishmentReport() {
  const [speciesCount, setSpeciesCount] = useState([]);
  const [totals, setTotals] = useState({
    previousMonth: 0,
    thisMonth: 0,
    combined: 0,
    total: 0,
  });
  const [target, setTarget] = useState('');
  const [percentage, setPercentage] = useState(null);
  const [semiAnnualTarget, setSemiAnnualTarget] = useState(''); // New state for semi-annual target
  const [semiAnnualPercentage, setSemiAnnualPercentage] = useState(null); // New state for semi-annual percentage
  const [selectedVaccine, setSelectedVaccine] = useState('All');
  const [quarterlyPercentage, setQuarterlyPercentage] = useState(null);
  

  const vaccineGroups = {
    "Hemorrhagic Septicemia": ["Carabao", "Cattle", "Goat/Sheep"],
    "Hog Cholera": ["Swine"],
    "Newcastle Disease": ["Poultry"],
  };

  const vaccineTypes = Object.keys(vaccineGroups);

  useEffect(() => {
    Promise.all([
      axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/reports`),
      axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/targets`)
    ])
      .then(([reportsResponse, targetsResponse]) => {
        const reportsData = reportsResponse.data;
        const targetsData = targetsResponse.data;

        // Process targets data
        const targetsObj = targetsData.reduce((acc, target) => {
          acc[target.Type] = {
            quarterly: target.target,
            semiAnnual: target.semiAnnualTarget
          };
          return acc;
        }, {});
        setTargets(targetsObj);

        // Process reports data
        const currentDate = new Date();
        const thisMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const previousMonthStart = subMonths(thisMonthStart, 1);
        const speciesReport = {};

        function addSpeciesCount(species, isThisMonth, isPreviousMonth) {
          if (!speciesReport[species]) {
            speciesReport[species] = {
              previousMonth: 0,
              thisMonth: 0,
              combined: 0,
              total: 0,
            };
          }
          if (isThisMonth) {
            speciesReport[species].thisMonth++;
          } else if (isPreviousMonth) {
            speciesReport[species].previousMonth++;
          }
          speciesReport[species].combined = speciesReport[species].previousMonth + speciesReport[species].thisMonth;
          speciesReport[species].total++;
        }

        reportsData.forEach((report) => {
          report.entries.forEach((entry) => {
            const species = entry.animalInfo.species;
            const entryDate = new Date(entry.date);
            const isThisMonth = entryDate >= thisMonthStart && isSameMonth(entryDate, currentDate);
            const isPreviousMonth = entryDate >= previousMonthStart && entryDate < thisMonthStart;
            addSpeciesCount(species, isThisMonth, isPreviousMonth);
          });
        });

        const speciesArray = Object.keys(speciesReport).map((species) => {
          const vaccineType = Object.keys(vaccineGroups).find((vaccine) =>
            vaccineGroups[vaccine].includes(species)
          ) || "Other";
          return {
            species,
            vaccineType,
            previousMonth: speciesReport[species].previousMonth,
            thisMonth: speciesReport[species].thisMonth,
            combined: speciesReport[species].combined,
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

  useEffect(() => {
    calculatePercentages();
  }, [totals, targets, selectedVaccine]);

  const updateTotals = (data) => {
    const totalPreviousMonth = data.reduce((sum, species) => sum + species.previousMonth, 0);
    const totalThisMonth = data.reduce((sum, species) => sum + species.thisMonth, 0);
    const totalCombined = data.reduce((sum, species) => sum + species.combined, 0);
    const totalOverall = data.reduce((sum, species) => sum + species.total, 0);

    setTotals({
      previousMonth: totalPreviousMonth,
      thisMonth: totalThisMonth,
      combined: totalCombined,
      total: totalOverall,
    });
  };

  const calculatePercentages = () => {
    if (selectedVaccine === 'All') {
      const totalQuarterly = Object.values(targets).reduce((sum, target) => sum + (target.quarterly || 0), 0);
      const totalSemiAnnual = Object.values(targets).reduce((sum, target) => sum + (target.semiAnnual || 0), 0);
  
      if (totalQuarterly === 0) {
        setQuarterlyPercentage("Can't calculate percentage; no target value set.");
      } else {
        setQuarterlyPercentage(((totals.combined / totalQuarterly) * 100).toFixed(2));
      }
  
      if (totalSemiAnnual === 0) {
        setSemiAnnualPercentage("Can't calculate percentage; no target value set.");
      } else {
        setSemiAnnualPercentage(((totals.combined / totalSemiAnnual) * 100).toFixed(2));
      }
    } else {
      const target = targets[selectedVaccine];
      if (!target) {
        setQuarterlyPercentage("Can't calculate percentage; no target value set.");
        setSemiAnnualPercentage("Can't calculate percentage; no target value set.");
        return;
      }
  
      const vaccineTotal = speciesCount
        .filter((species) => species.vaccineType === selectedVaccine)
        .reduce((sum, species) => sum + species.combined, 0);
  
      setQuarterlyPercentage(target.quarterly > 0
        ? ((vaccineTotal / target.quarterly) * 100).toFixed(2)
        : "Can't calculate percentage; no target value set.");
  
      setSemiAnnualPercentage(target.semiAnnual > 0
        ? ((vaccineTotal / target.semiAnnual) * 100).toFixed(2)
        : "Can't calculate percentage; no target value set.");
    }
  };

  const handleVaccineChange = (e) => {
    const selectedVaccineType = e.target.value;
    setSelectedVaccine(selectedVaccineType);
<<<<<<< HEAD
  
    // Directly filter species based on the selected vaccine type
    const filteredSpeciesCount = selectedVaccineType === 'All'
      ? speciesCount
      : speciesCount.filter((data) => data.vaccineType === selectedVaccineType);
  
    // Update totals for the filtered species count
    updateTotals(filteredSpeciesCount);
=======
    calculatePercentages()
    if (selectedVaccineType === 'All') {
      updateTotals(speciesCount);
    } else {
      const filteredSpeciesCount = speciesCount.filter((data) => data.vaccineType === selectedVaccineType);
      updateTotals(filteredSpeciesCount);
    }
>>>>>>> 1c807a134516ac4f3c95ccfc44683fa3b8812235
  };
  
  const filteredSpeciesCount = selectedVaccine === 'All'
    ? speciesCount
    : speciesCount.filter((data) => data.vaccineType === selectedVaccine);
  
  const groupedByVaccine = selectedVaccine === 'All'
    ? vaccineTypes.map(vaccineType => {
        const speciesUnderVaccine = filteredSpeciesCount.filter(species => species.vaccineType === vaccineType);
        return { vaccineType, speciesUnderVaccine };
      })
    : [
        {
          vaccineType: selectedVaccine,
          speciesUnderVaccine: filteredSpeciesCount,
        }
      ];
  

  return (
    <>
    <div className="p-6 bg-[#FFFAFA] min-h-0">
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
          <h2 className="text-xl font-semibold text-[#1b5b40] mb-2">Semi-annual Target Value</h2>
          <input
            type="number"
            value={semiAnnualTarget}
            onChange={handleSemiAnnualTargetChange}
            className="border border-[#1b5b40] rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-[#ffe356] text-[#252525]"
            placeholder="Enter semi-annual target value"
          />
          {semiAnnualPercentage !== null && (
            <p className="mt-2 text-lg font-semibold text-[#1b5b40]">
              Semi-annual Percentage: {semiAnnualPercentage}%
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


    <div className="p-6 bg-[#FFFAFA] min-h-0">
      <h1 className="text-3xl font-extrabold mb-6 text-[#1b5b40]">Accomplishment Report</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white p-4 border border-[#1b5b40] rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-[#1b5b40] mb-2">Target Second Quarter Value</h2>
          <input
            type="number"
            value={selectedVaccine === 'All' ? Object.values(targets).reduce((sum, target) => sum + (target.quarterly || 0), 0) : targets[selectedVaccine]?.quarterly || ''}
            disabled
            className="border border-[#1b5b40] rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-[#ffe356] text-[#252525] bg-gray-100"
          />
          {quarterlyPercentage !== null && (
            <p className="mt-2 text-lg font-semibold text-[#1b5b40]">
              Second Quarter Percentage: {quarterlyPercentage}
            </p>
          )}
        </div>

        <div className="bg-white p-4 border border-[#1b5b40] rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-[#1b5b40] mb-2">Semi-annual Target Value</h2>
          <input
            type="number"
            value={selectedVaccine === 'All' ? Object.values(targets).reduce((sum, target) => sum + (target.semiAnnual || 0), 0) : targets[selectedVaccine]?.semiAnnual || ''}
            disabled
            className="border border-[#1b5b40] rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-[#ffe356] text-[#252525] bg-gray-100"
          />
          {semiAnnualPercentage !== null && (
            <p className="mt-2 text-lg font-semibold text-[#1b5b40]">
              Semi-annual Percentage: {semiAnnualPercentage}
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
              <th className="py-3 px-4 text-left">Previous Month's Count</th>
              <th className="py-3 px-4 text-left">This Month's Count</th>
              <th className="py-3 px-4 text-left">Combined</th>
              <th className="py-3 px-4 text-left">Total</th>
            </tr>
          </thead>
          <tbody>
            {groupedByVaccine.map(({ vaccineType, speciesUnderVaccine }) => (
              <>
                <tr key={vaccineType}>
                  <td className="py-2 px-4 font-bold" colSpan="6">{vaccineType}</td>
                </tr>
                {speciesUnderVaccine.map(speciesData => (
                  <tr key={speciesData.species} className="border-b border-[#1b5b40] hover:bg-[#f9f9f9]">
                    <td className="py-2 px-4"></td>
                    <td className="py-2 px-4 text-[#252525]">{speciesData.species + "(hds)"}</td>
                    <td className="py-2 px-4 text-[#252525]">{speciesData.previousMonth}</td>
                    <td className="py-2 px-4 text-[#252525]">{speciesData.thisMonth}</td>
                    <td className="py-2 px-4 text-[#252525]">{speciesData.combined}</td>
                    <td className="py-2 px-4 text-[#252525]">{speciesData.total}</td>
                  </tr>
                ))}
              </>
            ))}
            <tr className="bg-[#ffe356] font-bold text-[#1b5b40]">
              <td colSpan="2" className="py-3 px-4">Total</td>
              <td className="py-3 px-4">{totals.previousMonth}</td>
              <td className="py-3 px-4">{totals.thisMonth}</td>
              <td className="py-3 px-4">{totals.combined}</td>
              <td className="py-3 px-4">{totals.total}</td>
            </tr>
          </tbody>
        </table>
      </div>
      </div>
    </div>
    </>
  );
}

export default AccomplishmentReport;