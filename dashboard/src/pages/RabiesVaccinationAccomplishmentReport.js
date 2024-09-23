import React, { useEffect, useState } from "react";
import axios from "axios";
import { format, isSameMonth, subMonths } from "date-fns";

function RabiesVaccinationAccomplishmentReport() {
  const [immunizationData, setImmunizationData] = useState([]);
  const [totals, setTotals] = useState({
    previousMonth: 0,
    thisMonth: 0,
    combined: 0,
    total: 0,
  });
  const [targets, setTargets] = useState({
    quarterly: 0,
    semiAnnual: 0
  });
  const [quarterlyPercentage, setQuarterlyPercentage] = useState(null);
  const [semiAnnualPercentage, setSemiAnnualPercentage] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchData();
  }, [selectedYear]);

  const fetchData = async () => {
    try {
      const [immunizationResponse, targetsResponse] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/entries?year=${selectedYear}`),
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/targets/accomplishment?year=${selectedYear}&reportType=RabiesVaccination`)
      ]);

      processImmunizationData(immunizationResponse.data);
      processTargets(targetsResponse.data);

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const processImmunizationData = (data) => {
    const currentDate = new Date();
    const thisMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const previousMonthStart = subMonths(thisMonthStart, 1);

    const immunizationReport = {
      previousMonth: 0,
      thisMonth: 0,
      combined: 0,
      total: 0,
    };

    data.forEach((report) => {
      report.entries.forEach((entry) => {
        const entryDate = new Date(entry.date);
        const count = entry.no || 0;

        if (entryDate >= thisMonthStart && isSameMonth(entryDate, currentDate)) {
          immunizationReport.thisMonth += count;
        } else if (entryDate >= previousMonthStart && entryDate < thisMonthStart) {
          immunizationReport.previousMonth += count;
        }

        immunizationReport.total += count;
      });
    });

    immunizationReport.combined = immunizationReport.previousMonth + immunizationReport.thisMonth;

    setImmunizationData([immunizationReport]);
    updateTotals(immunizationReport);
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

  const updateTotals = (data) => {
    setTotals({
      previousMonth: data.previousMonth,
      thisMonth: data.thisMonth,
      combined: data.combined,
      total: data.total,
    });
  };

  useEffect(() => {
    calculatePercentages();
  }, [totals, targets]);

  const calculatePercentages = () => {
    if (targets.quarterly > 0) {
      setQuarterlyPercentage(((totals.combined / targets.quarterly) * 100).toFixed(2));
    } else {
      setQuarterlyPercentage(null);
    }

    if (targets.semiAnnual > 0) {
      setSemiAnnualPercentage(((totals.total / targets.semiAnnual) * 100).toFixed(2));
    } else {
      setSemiAnnualPercentage(null);
    }
  };

  const handleYearChange = (e) => {
    setSelectedYear(Number(e.target.value));
  };

  return (
    <div className="p-6 bg-[#FFFAFA] min-h-0">
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
            {immunizationData.length > 0 ? (
              <tr className="border-b border-[#1b5b40] hover:bg-[#f9f9f9]">
                <td className="py-2 px-4 text-[#252525]">No. of Dogs immunized against Rabies and Registered</td>
                <td className="py-2 px-4 text-[#252525]">{totals.previousMonth}</td>
                <td className="py-2 px-4 text-[#252525]">{totals.thisMonth}</td>
                <td className="py-2 px-4 text-[#252525]">{totals.combined}</td>
                <td className="py-2 px-4 text-[#252525]">{totals.total}</td>
              </tr>
            ) : (
              <tr>
                <td colSpan="5" className="py-2 px-4 text-center text-[#252525]">No data available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RabiesVaccinationAccomplishmentReport;