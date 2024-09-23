import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { format, isSameMonth, subMonths } from "date-fns";

function AccomplishmentReport() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [speciesCount, setSpeciesCount] = useState([]);
  const [totals, setTotals] = useState({});
  const [targets, setTargets] = useState({});
  const [quarterlyPercentage, setQuarterlyPercentage] = useState(null);
  const [semiAnnualPercentage, setSemiAnnualPercentage] = useState(null);
  const [selectedVaccine, setSelectedVaccine] = useState('All');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const vaccineGroups = {
    "Hemorrhagic Septicemia": ["Carabao", "Cattle", "Goat/Sheep",],
    "Hog Cholera": ["Swine"],
    "New Castle Disease": ["Poultry"],
  };

  const vaccineTypes = Object.keys(vaccineGroups);

  useEffect(() => {
    fetchData();
  }, [selectedYear, selectedMonth]);

  useEffect(() => {
    calculatePercentages();
  }, [totals, targets, selectedVaccine]);

  // Fetch data from the new species-count API
  const fetchData = async () => {
    try {
      const [speciesCountResponse, targetsResponse] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/species-count?year=${selectedYear}&month=${selectedMonth}&vaccine=all`),
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/targets/accomplishment?year=${selectedYear}&reportType=VaccinationReport`)
      ]);

      processSpeciesCount(speciesCountResponse.data);
      processTargets(targetsResponse.data);

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const processTargets = (targetsData) => {
    if (!targetsData || !targetsData.targets || !Array.isArray(targetsData.targets)) {
      console.error("Invalid targets data format:", targetsData);
      return;
    }

    const targetsObj = targetsData.targets.reduce((acc, target) => {
      acc[target.Type] = {
        quarterly: target.target,
        semiAnnual: target.semiAnnualTarget
      };
      return acc;
    }, {});

    setTargets({
      ...targetsObj,
      totalTarget: targetsData.totalTarget,
      totalSemiAnnualTarget: targetsData.totalSemiAnnualTarget
    });
  };


  const processSpeciesCount = (speciesData) => {
    const speciesReport = speciesData.map((vaccineData) => {
      return vaccineData.species.map((speciesItem) => ({
        species: speciesItem.species || "Unknown",
        vaccineType: vaccineData.vaccine,
        previousMonth: speciesItem.previousMonthCount,
        thisMonth: speciesItem.thisMonthCount,
        combined: speciesItem.previousMonthCount + speciesItem.thisMonthCount,
        total: speciesItem.totalCount
      }));
    }).flat();

    speciesReport.sort((a, b) => a.vaccineType.localeCompare(b.vaccineType));
    setSpeciesCount(speciesReport);
  };

  const filteredSpeciesCount = useMemo(() => (
    selectedVaccine === 'All'
      ? speciesCount
      : speciesCount.filter((data) => data.vaccineType === selectedVaccine)
  ), [speciesCount, selectedVaccine]);

  const groupedByVaccine = useMemo(() => vaccineTypes.map(vaccineType => {
    const speciesUnderVaccine = filteredSpeciesCount.filter(species => species.vaccineType === vaccineType);
    return { vaccineType, speciesUnderVaccine };
  }), [filteredSpeciesCount, vaccineTypes]);

  useEffect(() => {
    updateTotals(filteredSpeciesCount);
  }, [filteredSpeciesCount]);

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
      const totalQuarterly = targets.totalTarget || 0;
      const totalSemiAnnual = targets.totalSemiAnnualTarget || 0;

      setQuarterlyPercentage(totalQuarterly === 0 ? "No target set" : `${((totals.combined / totalQuarterly) * 100).toFixed(2)}%`);
      setSemiAnnualPercentage(totalSemiAnnual === 0 ? "No target set" : `${((totals.total / totalSemiAnnual) * 100).toFixed(2)}%`);
    } else {
      const target = targets[selectedVaccine];
      if (!target) {
        setQuarterlyPercentage("No target set");
        setSemiAnnualPercentage("No target set");
        return;
      }

      const vaccineTotal = filteredSpeciesCount.reduce((sum, species) => sum + species.combined, 0);

      setQuarterlyPercentage(target.quarterly > 0 ? `${((totals.combined / target.quarterly) * 100).toFixed(2)}%` : "No target set");
      setSemiAnnualPercentage(target.semiAnnual > 0 ? `${((totals.total / target.semiAnnual) * 100).toFixed(2)}%` : "No target set");
    }
  };
  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  const handleVaccineChange = (e) => {
    setSelectedVaccine(e.target.value);
  };

  return (
    <div className="p-6 bg-[#FFFAFA] min-h-0">
      <h1 className="text-3xl font-extrabold mb-6 text-[#1b5b40]">Accomplishment Report</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">

        {/* Year Selector */}
        <div className="bg-white p-4 border border-[#1b5b40] rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-[#1b5b40] mb-2">Select Year</h2>
          <select
            value={selectedYear}
            onChange={handleYearChange}
            className="border border-[#1b5b40] rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-[#ffe356] text-[#252525]"
          >
            {[...Array(10)].map((_, i) => {
              const year = new Date().getFullYear() - i;
              return (
                <option key={year} value={year}>
                  {year}
                </option>
              );
            })}
          </select>
        </div>

        {/* Month Selector */}
        <div className="bg-white p-4 border border-[#1b5b40] rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-[#1b5b40] mb-2">Select Month</h2>
          <select
            value={selectedMonth}
            onChange={handleMonthChange}
            className="border border-[#1b5b40] rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-[#ffe356] text-[#252525]"
          >
            {Array.from({ length: 12 }, (_, index) => (
              <option key={index} value={index + 1}>
                {format(new Date(0, index), "MMMM")}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-white p-4 border border-[#1b5b40] rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-[#1b5b40] mb-2">Quarterly Target</h2>
          <input
            type="number"
            value={selectedVaccine === 'All'
              ? targets.totalTarget || ''
              : targets[selectedVaccine]?.quarterly || ''}
            disabled
            className="border border-[#1b5b40] rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-[#ffe356] text-[#252525] bg-gray-100"
          />
          <p className="mt-2 text-lg font-semibold text-[#1b5b40]">
            Percentage: {quarterlyPercentage}
          </p>
        </div>

        <div className="bg-white p-4 border border-[#1b5b40] rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-[#1b5b40] mb-2">Semi-annual Target</h2>
          <input
            type="number"
            value={selectedVaccine === 'All'
              ? targets.totalSemiAnnualTarget || ''
              : targets[selectedVaccine]?.semiAnnual || ''}
            disabled
            className="border border-[#1b5b40] rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-[#ffe356] text-[#252525] bg-gray-100"
          />
          <p className="mt-2 text-lg font-semibold text-[#1b5b40]">
            Percentage: {semiAnnualPercentage}
          </p>
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
        <table className="min-w-full bg-white border border-[#1b5b40] rounded-lg overflow-hidden shadow-lg">
          <thead className="bg-darkgreen text-white">
            <tr>
              <th className="py-3 px-4 text-left">Vaccine Type</th>
              <th className="py-3 px-4 text-left">Species</th>
              <th className="py-3 px-4 text-left">Previous Month's Count</th>
              <th className="py-3 px-4 text-left">This Month's Count</th>
              <th className="py-3 px-4 text-left">Combined</th>
              <th className="py-3 px-4 text-left">Total Accomplishment</th>
            </tr>
          </thead>
          <tbody>
            {groupedByVaccine.map(({ vaccineType, speciesUnderVaccine }) => {
              if (speciesUnderVaccine.length > 0) {
                return (
                  <React.Fragment key={vaccineType}>
                    <tr>
                      <td className="py-2 px-4 font-bold" colSpan="6">{vaccineType}</td>
                    </tr>
                    {speciesUnderVaccine.map((speciesData) => (
                      <tr key={speciesData.species} className="border-b border-[#1b5b40] hover:bg-[#f9f9f9]">
                        <td className="py-2 px-4"></td>
                        <td className="py-2 px-4 text-[#252525]">{speciesData.species + "(hds)"}</td>
                        <td className="py-2 px-4 text-[#252525]">{speciesData.previousMonth}</td>
                        <td className="py-2 px-4 text-[#252525]">{speciesData.thisMonth}</td>
                        <td className="py-2 px-4 text-[#252525]">{speciesData.combined}</td>
                        <td className="py-2 px-4 text-[#252525]">{speciesData.total}</td>
                      </tr>
                    ))}
                  </React.Fragment>
                );
              } else {
                return null;
              }
            })}
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
  );
}

export default AccomplishmentReport;