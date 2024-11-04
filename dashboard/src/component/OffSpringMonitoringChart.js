import React, { useEffect, useState, useContext } from "react";
import axiosInstance from '../component/axiosInstance';
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  TimeScale,
} from "chart.js";
import ChartGroup from "./ChartGroup";
import { FilterContext } from "../pages/Home/Home";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  TimeScale,
  Title,
  Tooltip,
  Legend
);

const OffspringMonitoringChart = ({ filterValues }) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const filterOptions = useContext(FilterContext);
  const [selectedChart, setSelectedChart] = useState(null);
  const [analysis, setAnalysis] = useState(""); // State for storing analysis

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('/api/offspring-monitoring', {
          params: {
            formStatus: 'Accepted',
            municipality: filterValues.municipality || undefined,
            startDate: filterValues.startDate || undefined,
            endDate: filterValues.endDate || undefined,
          },
        }

);
        let reports = response.data;

        // Apply filters
        if (!filterOptions.showAll) {
          if (filterOptions.filters.dateRange[0] && filterOptions.filters.dateRange[1]) {
            reports = reports.filter((report) => {
              const reportDate = new Date(report.dateReported).getTime();
              return (
                reportDate >= new Date(filterOptions.filters.dateRange[0]).getTime() &&
                reportDate <= new Date(filterOptions.filters.dateRange[1]).getTime()
              );
            });
          }

          if (filterOptions.filters.municipality) {
            reports = reports.filter(
              (report) => report.municipality === filterOptions.filters.municipality
            );
          }
        }

        // Initialize count objects
        const municipalityCounts = {};
        const speciesCounts = {};
        const dateCounts = {};
        const sexCounts = {};

        reports.forEach((report) => {
          const { municipality, entries, dateReported } = report;

          if (!municipalityCounts[municipality]) municipalityCounts[municipality] = 0;

          const reportDate = new Date(dateReported).toLocaleDateString();
          if (!dateCounts[reportDate]) dateCounts[reportDate] = 0;
          dateCounts[reportDate] += entries.length;

          entries.forEach((entry) => {
            const { species, sex } = entry;

            municipalityCounts[municipality] += 1;

            if (!speciesCounts[species]) speciesCounts[species] = 0;
            speciesCounts[species] += 1;

            if (!sexCounts[sex]) sexCounts[sex] = 0;
            sexCounts[sex] += 1;
          });
        });

        const chartOptions = {
          plugins: {
            legend: {
              display: selectedChart !== null,
            },
          },
        };

        // Update chart data in the component state
        setData({
          municipalityChart: {
            labels: Object.keys(municipalityCounts),
            datasets: [{
              label: "Offspring Monitored by Municipality",
              data: Object.values(municipalityCounts),
              backgroundColor: "#1b5b40",
            }],
            options: chartOptions,
          },
          speciesChart: {
            labels: Object.keys(speciesCounts),
            datasets: [{
              label: "Offspring Distribution by Species",
              data: Object.values(speciesCounts),
              backgroundColor: ["#1b5b40", "#ffe459", "#123c29", "#e5cd50"],
            }],
            options: chartOptions,
          },
          dateReportedChart: {
            labels: Object.keys(dateCounts),
            datasets: [{
              label: "Offspring Monitored Over Time",
              data: Object.values(dateCounts),
              borderColor: "#1b5b40",
              backgroundColor: "rgba(27, 91, 64, 0.2)",
              fill: true,
            }],
            options: chartOptions,
          },
          sexChart: {
            labels: Object.keys(sexCounts),
            datasets: [{
              label: "Number of Calves by Sex",
              data: Object.values(sexCounts),
              backgroundColor: ["#ff6384", "#36a2eb"],
            }],
            options: chartOptions,
          },
        });

        // Analysis Section
        const totalOffspring = Object.values(speciesCounts).reduce((acc, curr) => acc + curr, 0);
        const mostMonitoredMunicipality = Object.keys(municipalityCounts).reduce(
          (a, b) => (municipalityCounts[a] > municipalityCounts[b] ? a : b),
          ""
        );
        const mostMonitoredSpecies = Object.keys(speciesCounts).reduce(
          (a, b) => (speciesCounts[a] > speciesCounts[b] ? a : b),
          ""
        );

        setAnalysis(
          <>
            <p>
              <strong>Total Offspring Monitored:</strong> {totalOffspring}.
            </p>
            <p>
              <strong>Most Monitored Municipality:</strong> {mostMonitoredMunicipality} ({municipalityCounts[mostMonitoredMunicipality]} offspring).
            </p>
            <p>
              <strong>Most Monitored Species:</strong> {mostMonitoredSpecies}.
            </p>
          </>
        );

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data: ", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [filterOptions.filters, filterOptions.showAll, selectedChart]);

  if (loading) return (
    <div className="flex items-center justify-center ">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  );

  const charts = [
    {
      label: "Offspring Monitored by Municipality",
      content: <Bar data={data.municipalityChart} options={data.municipalityChart.options} />,
      style: "col-span-2",
    },
    {
      label: "Offspring Distribution by Species",
      content: <Pie data={data.speciesChart} options={data.speciesChart.options} />,
      style: "col-span-2",
    },
    {
      label: "Offspring Monitoring Over Time",
      content: <Line data={data.dateReportedChart} options={data.dateReportedChart.options} />,
      style: "col-span-2",
    },
    {
      label: "Number of Calves by Sex",
      content: <Bar data={data.sexChart} options={data.sexChart.options} />,
      style: "col-span-2",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-darkgreen mb-4 text-center">
          Offspring Monitoring Report
        </h2>
        {/* Analysis Section */}
        <div className="mt-8 p-6 bg-white border border-gray-200 shadow-md rounded-lg">
          <h3 className="text-2xl font-bold text-darkgreen border-b-2 border-darkgreen pb-2">
            Analysis
          </h3>
          <p className="text-gray-800 mt-4 text-lg leading-relaxed">
            {analysis}
          </p>
        </div>

        <ChartGroup
          charts={charts}
          title="Offspring Monitoring Report"
          selectedChart={selectedChart}
          setSelectedChart={setSelectedChart}
        />

      </div>

    </div>
  );
};

export default OffspringMonitoringChart;
