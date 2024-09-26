import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line, Bar, Pie, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Tooltip,
  Legend,
  Title,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
} from "chart.js";
import ChartGroup from "./ChartGroup";

ChartJS.register(
  Tooltip,
  Legend,
  Title,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement
);

const RabiesReportChart = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    dateRange: [null, null],
    municipality: "",
  });
  const [showAll, setShowAll] = useState(false); // State to toggle between all data and filtered data

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/entries`
        );
        let reports = response.data;

        // If "Show All" is selected, skip applying filters
        if (!showAll) {
          // Apply filters
          if (filters.dateRange[0] && filters.dateRange[1]) {
            reports = reports.filter((report) => {
              const reportDate = new Date(report.dateReported).getTime();
              return (
                reportDate >= new Date(filters.dateRange[0]).getTime() &&
                reportDate <= new Date(filters.dateRange[1]).getTime()
              );
            });
          }

          if (filters.municipality) {
            reports = reports.filter(
              (report) => report.municipality === filters.municipality
            );
          }
        }

        // Data structures for charts
        const municipalityCounts = {};
        const vaccineCounts = {};
        const dateCounts = {};
        const sexCounts = {};

        // Process each filtered report
        reports.forEach((report) => {
          const { municipality, vaccineUsed, entries } = report;

          // Municipality and vaccine data
          if (!municipalityCounts[municipality])
            municipalityCounts[municipality] = 0;
          if (!vaccineCounts[vaccineUsed]) vaccineCounts[vaccineUsed] = 0;

          entries.forEach((entry) => {
            const date = new Date(entry.date).toLocaleDateString();
            const sex = entry.clientInfo.gender;

            // Municipality data
            municipalityCounts[municipality] += 1;

            // Vaccine type data
            vaccineCounts[vaccineUsed] += 1;

            // Date-based data
            if (!dateCounts[date]) dateCounts[date] = 0;
            dateCounts[date] += 1;

            // Sex-based data
            if (!sexCounts[sex]) sexCounts[sex] = 0;
            sexCounts[sex] += 1;
          });
        });

        // Prepare chart data
        setData({
          lineChart: {
            labels: Object.keys(municipalityCounts),
            datasets: [
              {
                label: "Vaccinations per Municipality",
                data: Object.values(municipalityCounts),
                borderColor: "rgba(75, 192, 192, 1)",
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderWidth: 1,
              },
            ],
          },
          barChart: {
            labels: Object.keys(vaccineCounts),
            datasets: [
              {
                label: "Vaccinations per Vaccine Type",
                data: Object.values(vaccineCounts),
                backgroundColor: "rgba(153, 102, 255, 0.6)",
                borderWidth: 1,
              },
            ],
          },
          pieChart: {
            labels: Object.keys(sexCounts),
            datasets: [
              {
                label: "Vaccinations by Animal Sex",
                data: Object.values(sexCounts),
                backgroundColor: [
                  "rgba(255, 99, 132, 0.6)",
                  "rgba(54, 162, 235, 0.6)",
                ],
                borderWidth: 1,
              },
            ],
          },
          doughnutChart: {
            labels: Object.keys(vaccineCounts),
            datasets: [
              {
                label: "Vaccine Distribution",
                data: Object.values(vaccineCounts),
                backgroundColor: [
                  "rgba(255, 99, 132, 0.6)",
                  "rgba(54, 162, 235, 0.6)",
                  "rgba(255, 206, 86, 0.6)",
                ],
                borderWidth: 1,
              },
            ],
          },
        });

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data: ", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [filters, showAll]); // Reload data if filters or showAll changes

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      dateRange:
        name === "startDate"
          ? [value, prev.dateRange[1]]
          : [prev.dateRange[0], value],
    }));
  };

  const handleMunicipalityChange = (e) => {
    setFilters((prev) => ({ ...prev, municipality: e.target.value }));
  };

  const toggleShowAll = () => {
    setShowAll((prevShowAll) => !prevShowAll); // Toggle between all data and filtered data
  };

  if (loading) {
    return <div>Loading chart data...</div>;
  }

  const charts = [
    {
      label: "Vaccinations per Municipality",
      content: <Line data={data.lineChart} />,
    },
    {
      label: "Vaccinations per Vaccine Type",
      content: <Bar data={data.barChart} />,
    },
    {
      label: "Vaccinations by Animal Sex",
      content: <Pie data={data.pieChart} />,
    },
    {
      label: "Vaccine Distribution",
      content: <Doughnut data={data.doughnutChart} />,
    },
  ];

  return (
    <>
      <div>
        <div className="grow flex flex-row lg:flex-row md:flex-col sm:flex-col xs:flex-col 2xs:flex-col 3xs:flex-col gap-x-3">
          <label className="mb-2 text-lg font-bold">
            Start Date:
            <input
              className="border"
              type="date"
              name="startDate"
              onChange={handleDateChange}
              disabled={showAll}
            />
          </label>
          <label className="mb-2 text-lg font-bold">
            End Date:
            <input
              className="border"
              type="date"
              name="endDate"
              onChange={handleDateChange}
              disabled={showAll}
            />
          </label>
          <label className="mb-2 text-lg font-bold">
            Municipality:
            <input
              className="border"
              type="text"
              value={filters.municipality}
              onChange={handleMunicipalityChange}
              disabled={showAll}
            />
          </label>
          <button
            className="bg-darkgreen text-white py-2 px-4 rounded hover:bg-darkergreen"
            onClick={toggleShowAll}
          >
            {showAll ? "Apply Filters" : "Show All Data"}
          </button>
        </div>
      </div>
      <ChartGroup charts={charts} title="Rabies Vaccination Report" />
    </>
  );
};

export default RabiesReportChart;
