import React, { useEffect, useState } from "react";
import axios from "axios";
import { format, isSameMonth, subMonths } from "date-fns";

function RSMAccomplishmentReport() {
  const [activityData, setActivityData] = useState([]);
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
  const [selectedActivity, setSelectedActivity] = useState('All');

  const activityOptions = [
    "Deworming",
    "Wound Treatment",
    "Vitamin Supplementation",
    "Iron Supplementation",
    "Consultation",
    "Support",
  ];

  useEffect(() => {
    axios
      .get("http://192.168.1.197:5000/RSM")
      .then((response) => {
        const data = response.data;
        const currentDate = new Date();
        const thisMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const previousMonthStart = subMonths(thisMonthStart, 1);
        const activityReport = {};

        // Modify to calculate for all months
        function addActivityCount(activity, species, entryDate, noOfHeads) {
          if (!activityReport[activity]) {
            activityReport[activity] = {
              speciesCount: {},
              previousMonth: 0,
              thisMonth: 0,
              combined: 0,
              total: 0, // Total for all months
            };
          }

          if (!activityReport[activity].speciesCount[species]) {
            activityReport[activity].speciesCount[species] = {
              previousMonth: 0,
              thisMonth: 0,
              combined: 0,
              total: 0, // Total for all months for this species
            };
          }

          // Determine whether the entry is from this month or the previous month
          const isThisMonth = entryDate >= thisMonthStart && isSameMonth(entryDate, currentDate);
          const isPreviousMonth = entryDate >= previousMonthStart && entryDate < thisMonthStart;

          if (isThisMonth) {
            activityReport[activity].thisMonth += noOfHeads;
            activityReport[activity].speciesCount[species].thisMonth += noOfHeads;
          } else if (isPreviousMonth) {
            activityReport[activity].previousMonth += noOfHeads;
            activityReport[activity].speciesCount[species].previousMonth += noOfHeads;
          }

          // Update the combined count (previous + this month)
          activityReport[activity].combined =
            activityReport[activity].previousMonth + activityReport[activity].thisMonth;
          activityReport[activity].speciesCount[species].combined =
            activityReport[activity].speciesCount[species].previousMonth +
            activityReport[activity].speciesCount[species].thisMonth;

          // Increment total accomplishment count for all months
          activityReport[activity].total += noOfHeads;
          activityReport[activity].speciesCount[species].total += noOfHeads;
        }

        data.forEach((report) => {
          report.entries.forEach((entry) => {
            const activity = entry.activity;
            const species = entry.animalInfo.species;
            const noOfHeads = entry.animalInfo.noOfHeads || 0;
            const entryDate = new Date(entry.date);

            // Now add all the entries for total computation
            addActivityCount(activity, species, entryDate, noOfHeads);
          });
        });

        const activityArray = Object.keys(activityReport).map((activity) => {
          return {
            activity,
            speciesData: Object.keys(activityReport[activity].speciesCount).map((species) => ({
              species,
              previousMonth: activityReport[activity].speciesCount[species].previousMonth,
              thisMonth: activityReport[activity].speciesCount[species].thisMonth,
              combined: activityReport[activity].speciesCount[species].combined,
              total: activityReport[activity].speciesCount[species].total, // Total for all months
            })),
            previousMonth: activityReport[activity].previousMonth,
            thisMonth: activityReport[activity].thisMonth,
            combined: activityReport[activity].combined,
            total: activityReport[activity].total, // Total for all months
          };
        });

        setActivityData(activityArray);
        updateTotals(activityArray);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const updateTotals = (data) => {
    let totalPreviousMonth = 0;
    let totalThisMonth = 0;
    let totalCombined = 0;
    let totalOverall = 0;

    data.forEach((activity) => {
      activity.speciesData.forEach((species) => {
        totalPreviousMonth += species.previousMonth;
        totalThisMonth += species.thisMonth;
        totalCombined += species.combined;
        totalOverall += species.total; // Total for all months
      });
    });

    setTotals({
      previousMonth: totalPreviousMonth,
      thisMonth: totalThisMonth,
      combined: totalCombined,
      total: totalOverall, // Reflecting all months
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

  const handleActivityChange = (e) => {
    const selectedActivityType = e.target.value;
    setSelectedActivity(selectedActivityType);
  };

  const filteredActivityData =
    selectedActivity === "All"
      ? activityData
      : activityData.filter((data) => data.activity === selectedActivity);

  return (
    <div className="p-6 bg-[#FFFAFA] min-h-0">
      <h1 className="text-3xl font-extrabold mb-6 text-[#1b5b40]">
        Routine Service Monitoring Accomplisment
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

        <div className="bg-white p-4 border border-[#1b5b40] rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-[#1b5b40] mb-2">
            Select Activity
          </h2>
          <select
            value={selectedActivity}
            onChange={handleActivityChange}
            className="border border-[#1b5b40] rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-[#ffe356] text-[#252525]"
          >
            <option value="All">All</option>
            {activityOptions.map((activity) => (
              <option key={activity} value={activity}>
                {activity}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-8">
        <table className="min-w-full bg-white border border-[#1b5b40] rounded-lg overflow-hidden shadow-lg">
          <thead>
            <tr className="bg-[#1b5b40] text-white">
              <th className="py-2 px-4 text-left">Activity</th>
              <th className="py-2 px-4 text-left">Species</th>
              <th className="py-2 px-4 text-left">Previous Month</th>
              <th className="py-2 px-4 text-left">This Month</th>
              <th className="py-2 px-4 text-left">Combined</th>
              <th className="py-2 px-4 text-left">Total Accomplishment</th>
            </tr>
          </thead>
          <tbody>
            {filteredActivityData.length > 0 ? (
              filteredActivityData.map((activityData) => (
                <>
                  <tr key={activityData.activity}>
                    <td className="py-2 px-4 font-bold" colSpan="6">
                      {activityData.activity}
                    </td>
                  </tr>
                  {activityData.speciesData.map((speciesData) => (
                    <tr key={`${activityData.activity}-${speciesData.species}`} className="border-b border-[#1b5b40] hover:bg-[#f9f9f9]">
                      <td className="py-2 px-4"></td>
                      <td className="py-2 px-4 text-[#252525]">{speciesData.species}</td>
                      <td className="py-2 px-4 text-[#252525]">{speciesData.previousMonth}</td>
                      <td className="py-2 px-4 text-[#252525]">{speciesData.thisMonth}</td>
                      <td className="py-2 px-4 text-[#252525]">{speciesData.combined}</td>
                      <td className="py-2 px-4 text-[#252525]">{speciesData.total}</td>
                    </tr>
                  ))}
                </>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-2 px-4 text-center text-[#252525]">No data available for the selected activity.</td>
              </tr>
            )}
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

export default RSMAccomplishmentReport;
