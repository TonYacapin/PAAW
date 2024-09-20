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
  const [target, setTarget] = useState('');
  const [percentage, setPercentage] = useState(null);
  const [semiAnnualTarget, setSemiAnnualTarget] = useState('');
  const [semiAnnualPercentage, setSemiAnnualPercentage] = useState(null);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/api/entries`)
      .then((response) => {
        const data = response.data;
        const currentDate = new Date();
        const thisMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const previousMonthStart = subMonths(thisMonthStart, 1);

        const immunizationReport = {
          previousMonth: 0,
          thisMonth: 0,
          combined: 0,
          total: 0, // Total for all months
        };

        function addImmunizationCount(entryDate, count) {
          // Determine whether the entry is from this month or the previous month
          const isThisMonth = entryDate >= thisMonthStart && isSameMonth(entryDate, currentDate);
          const isPreviousMonth = entryDate >= previousMonthStart && entryDate < thisMonthStart;

          if (isThisMonth) {
            immunizationReport.thisMonth += count;
          } else if (isPreviousMonth) {
            immunizationReport.previousMonth += count;
          }

          // Update combined count and total accomplishment count for all months
          immunizationReport.combined =
            immunizationReport.previousMonth + immunizationReport.thisMonth;
          immunizationReport.total += count;
        }

        data.forEach((report) => {
          report.entries.forEach((entry) => {
            const entryDate = new Date(entry.date);
            const count = entry.no || 0; // Use 'no' field as count
            addImmunizationCount(entryDate, count);
          });
        });

        setImmunizationData([immunizationReport]);
        updateTotals(immunizationReport);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const updateTotals = (data) => {
    setTotals({
      previousMonth: data.previousMonth,
      thisMonth: data.thisMonth,
      combined: data.combined,
      total: data.total, // Reflecting all months
    });
  };

  const handleTargetChange = (e) => {
    const targetValue = e.target.value;
    setTarget(targetValue);

    const targetNumber = Number(targetValue);
    if (targetNumber > 0 && totals.combined > 0) {
      setPercentage(((totals.combined / targetNumber) * 100).toFixed(2));
    } else {
      setPercentage(null);
    }
  };

  const handleSemiAnnualTargetChange = (e) => {
    const semiAnnualTargetValue = e.target.value;
    setSemiAnnualTarget(semiAnnualTargetValue);

    const targetNumber = Number(semiAnnualTargetValue);
    if (targetNumber > 0 && totals.total > 0) {
      setSemiAnnualPercentage(((totals.total / targetNumber) * 100).toFixed(2));
    } else {
      setSemiAnnualPercentage(null);
    }
  };

  return (
    <div className="p-6 bg-[#FFFAFA] min-h-screen">
      <h1 className="text-3xl font-extrabold mb-6 text-[#1b5b40]">
        Rabies Immunization Report
      </h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white p-4 border border-[#1b5b40] rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-[#1b5b40] mb-2">
            Target Second Quarter Value
          </h2>
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
          <h2 className="text-xl font-semibold text-[#1b5b40] mb-2">
            Semi-annual Target Value
          </h2>
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
                <td colSpan="4" className="py-2 px-4 text-center text-[#252525]">No data available.</td>
              </tr>
            )}
            <tr className="bg-[#ffe356] font-bold text-[#1b5b40]">
              <td colSpan="4" className="py-3 px-4">Total</td>
              <td className="py-3 px-4">{totals.total}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RabiesVaccinationAccomplishmentReport;
