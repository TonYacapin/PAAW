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
  const [targets, setTargets] = useState({});
  const [quarterlyPercentage, setQuarterlyPercentage] = useState(null);
  const [semiAnnualPercentage, setSemiAnnualPercentage] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState('All');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  const activityOptions = [
    "Deworming",
    "Wound Treatment",
    "Vitamin Supplementation",
    "Iron Supplementation",
    "Consultation",
    "Support",
  ];

  const monthOptions = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  const yearOptions = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);

  useEffect(() => {
    fetchData();
  }, [selectedYear, selectedMonth]);

  useEffect(() => {
    calculatePercentages();
  }, [totals, targets, selectedActivity]);

  const fetchData = async () => {
    try {
      const [activityResponse, targetsResponse] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/species-activity-count?year=${selectedYear}&month=${selectedMonth}`),
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/targets/accomplishment?year=${selectedYear}&reportType=RoutineServiceMonitoring`)
      ]);

      processActivityData(activityResponse.data);
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

  const processActivityData = (data) => {
    const processedData = {};
    let totalPreviousMonth = 0;
    let totalThisMonth = 0;
    let totalCombined = 0;
    let totalOverall = 0;

    data.forEach((item) => {
      if (!processedData[item.activity]) {
        processedData[item.activity] = {
          activity: item.activity,
          speciesData: [],
          previousMonth: 0,
          thisMonth: 0,
          combined: 0,
          total: 0,
        };
      }

      processedData[item.activity].speciesData.push({
        species: item.species,
        previousMonth: item.previousMonthCount,
        thisMonth: item.thisMonthCount,
        combined: item.previousMonthCount + item.thisMonthCount,
        total: item.totalCount,
      });

      processedData[item.activity].previousMonth += item.previousMonthCount;
      processedData[item.activity].thisMonth += item.thisMonthCount;
      processedData[item.activity].combined += item.previousMonthCount + item.thisMonthCount;
      processedData[item.activity].total += item.totalCount;

      totalPreviousMonth += item.previousMonthCount;
      totalThisMonth += item.thisMonthCount;
      totalCombined += item.previousMonthCount + item.thisMonthCount;
      totalOverall += item.totalCount;
    });

    setActivityData(Object.values(processedData));
    setTotals({
      previousMonth: totalPreviousMonth,
      thisMonth: totalThisMonth,
      combined: totalCombined,
      total: totalOverall,
    });
  };

  const calculatePercentages = () => {
    if (selectedActivity === 'All') {
      const totalQuarterly = targets.totalTarget || 0;
      const totalSemiAnnual = targets.totalSemiAnnualTarget || 0;

      setQuarterlyPercentage(totalQuarterly === 0 ? "No target set" : `${((totals.combined / totalQuarterly) * 100).toFixed(2)}%`);
      setSemiAnnualPercentage(totalSemiAnnual === 0 ? "No target set" : `${((totals.total / totalSemiAnnual) * 100).toFixed(2)}%`);
    } else {
      const target = targets[selectedActivity];
      if (!target) {
        setQuarterlyPercentage("No target set");
        setSemiAnnualPercentage("No target set");
        return;
      }

      const vaccineTotal = filteredActivityData.reduce((sum, species) => sum + species.combined, 0);

      setQuarterlyPercentage(target.quarterly > 0 ? `${((totals.combined / target.quarterly) * 100).toFixed(2)}%` : "No target set");
      setSemiAnnualPercentage(target.semiAnnual > 0 ? `${((totals.total / target.semiAnnual) * 100).toFixed(2)}%` : "No target set");
    }
  };

  const activityTotal = activityData.find(activity => activity.activity === selectedActivity)?.combined || 0;
  const handleActivityChange = (e) => {
    setSelectedActivity(e.target.value);
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(Number(e.target.value));
  };

  const handleYearChange = (e) => {
    setSelectedYear(Number(e.target.value));
  };

  const filteredActivityData =
    selectedActivity === "All"
      ? activityData
      : activityData.filter((data) => data.activity === selectedActivity);

  return (
    <div className="p-6 bg-[#FFFAFA] max-h-[55vh] overflow-y-auto">
      <h1 className="text-xl font-semibold mb-6 text-gray-700">
        Routine Service Monitoring Accomplishment
      </h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <div className="bg-white p-4 border border-[#1b5b40] rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-[#1b5b40] mb-2">
            Select Year
          </h2>
          <select
            value={selectedYear}
            onChange={handleYearChange}
            className="border border-[#1b5b40] rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-[#ffe356] text-[#252525]"
          >
            {yearOptions.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-white p-4 border border-[#1b5b40] rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-[#1b5b40] mb-2">
            Select Month
          </h2>
          <select
            value={selectedMonth}
            onChange={handleMonthChange}
            className="border border-[#1b5b40] rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-[#ffe356] text-[#252525]"
          >
            {monthOptions.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
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

        <div className="bg-white p-4 border border-[#1b5b40] rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-[#1b5b40] mb-2">Quarterly Target</h2>
          <input
            type="number"
            value={selectedActivity === 'All'
              ? targets.totalTarget || ''
              : targets[selectedActivity]?.quarterly || ''}
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
            value={selectedActivity === 'All'
              ? targets.totalSemiAnnualTarget || ''
              : targets[selectedActivity]?.semiAnnual || ''}
            disabled
            className="border border-[#1b5b40] rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-[#ffe356] text-[#252525] bg-gray-100"
          />
          <p className="mt-2 text-lg font-semibold text-[#1b5b40]">
            Percentage: {semiAnnualPercentage}
          </p>
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