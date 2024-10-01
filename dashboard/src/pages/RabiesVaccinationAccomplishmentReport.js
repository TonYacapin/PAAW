import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";

function RabiesVaccinationAccomplishmentReport() {
  const [immunizationData, setImmunizationData] = useState({
    previousMonthCount: 0,
    thisMonthCount: 0,
    totalCount: 0,
  });
  const [targets, setTargets] = useState({
    quarterly: 0,
    semiAnnual: 0
  });
  const [quarterlyPercentage, setQuarterlyPercentage] = useState(null);
  const [semiAnnualPercentage, setSemiAnnualPercentage] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // 1-12

  useEffect(() => {
    fetchData();
  }, [selectedYear, selectedMonth]);

  const fetchData = async () => {
    try {
      const [immunizationResponse, targetsResponse] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/rabies-report/entry-count?year=${selectedYear}&month=${selectedMonth}`),
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/targets/accomplishment?year=${selectedYear}&reportType=RabiesVaccination`)
      ]);

      setImmunizationData(immunizationResponse.data);
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

    const rabiesTarget = targetsData.targets.find(target => target.Type === "No. of dogs immunized against rabies and registered");
    if (rabiesTarget) {
      setTargets({
        quarterly: rabiesTarget.target,
        semiAnnual: rabiesTarget.semiAnnualTarget
      });
    }
  };

  useEffect(() => {
    calculatePercentages();
  }, [immunizationData, targets]);

  const calculatePercentages = () => {
    const combined = immunizationData.previousMonthCount + immunizationData.thisMonthCount;
    if (targets.quarterly > 0) {
      setQuarterlyPercentage(((combined / targets.quarterly) * 100).toFixed(2));
    } else {
      setQuarterlyPercentage(null);
    }

    if (targets.semiAnnual > 0) {
      setSemiAnnualPercentage(((immunizationData.totalCount / targets.semiAnnual) * 100).toFixed(2));
    } else {
      setSemiAnnualPercentage(null);
    }
  };

  const handleYearChange = (e) => {
    setSelectedYear(Number(e.target.value));
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(Number(e.target.value));
  };

  return (
    <div className="p-6 bg-[#FFFAFA] h-[55vh] ">
      <h1 className="text-3xl font-extrabold mb-6 text-[#1b5b40]">
        Rabies Vaccination Accomplishment Report
      </h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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

        <div className="bg-white p-4 border border-[#1b5b40] rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-[#1b5b40] mb-2">Select Month</h2>
          <select
            value={selectedMonth}
            onChange={handleMonthChange}
            className="border border-[#1b5b40] rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-[#ffe356] text-[#252525]"
          >
            {[...Array(12)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {format(new Date(2000, i, 1), 'MMMM')}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-white p-4 border border-[#1b5b40] rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-[#1b5b40] mb-2">
            Quarterly Target
          </h2>
          <input
            type="number"
            value={targets.quarterly}
            disabled
            className="border border-[#1b5b40] rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-[#ffe356] text-[#252525] bg-gray-100"
          />
          {quarterlyPercentage !== null && (
            <p className="mt-2 text-lg font-semibold text-[#1b5b40]">
              Percentage: {quarterlyPercentage}%
            </p>
          )}
        </div>

        <div className="bg-white p-4 border border-[#1b5b40] rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-[#1b5b40] mb-2">
            Semi-annual Target
          </h2>
          <input
            type="number"
            value={targets.semiAnnual}
            disabled
            className="border border-[#1b5b40] rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-[#ffe356] text-[#252525] bg-gray-100"
          />
          {semiAnnualPercentage !== null && (
            <p className="mt-2 text-lg font-semibold text-[#1b5b40]">
              Percentage: {semiAnnualPercentage}%
            </p>
          )}
        </div>
      </div>

      <div className="mt-8">
        <table className="min-w-full bg-white border border-[#1b5b40] rounded-lg overflow-hidden shadow-lg">
          <thead>
            <tr className="bg-[#1b5b40] text-white">
              <th className="py-2 px-4 text-left">Activity</th>
              <th className="py-2 px-4 text-left">Previous Month</th>
              <th className="py-2 px-4 text-left">This Month</th>
              <th className="py-2 px-4 text-left">Combined</th>
              <th className="py-2 px-4 text-left">Total Accomplishment</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[#1b5b40] hover:bg-[#f9f9f9]">
              <td className="py-2 px-4 text-[#252525]">No. of Dogs immunized against Rabies and Registered</td>
              <td className="py-2 px-4 text-[#252525]">{immunizationData.previousMonthCount}</td>
              <td className="py-2 px-4 text-[#252525]">{immunizationData.thisMonthCount}</td>
              <td className="py-2 px-4 text-[#252525]">{immunizationData.previousMonthCount + immunizationData.thisMonthCount}</td>
              <td className="py-2 px-4 text-[#252525]">{immunizationData.totalCount}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RabiesVaccinationAccomplishmentReport;