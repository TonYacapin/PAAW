import React, { useState, useEffect, useContext } from "react";
import axiosInstance from '../component/axiosInstance';
import { Bar, Pie, Line } from "react-chartjs-2";
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
import { FilterContext } from "../pages/Home/Home";

ChartJS.register(
  Tooltip,
  Legend,
  Title,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement
);

const SlaughterReportChart = ({ filterValues }) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const filterOptions = useContext(FilterContext);
  const [selectedChart, setSelectedChart] = useState(null);
  const [analysis, setAnalysis] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(`/api/slaughterform`, {
          params: {
            municipality: filterValues.municipality || undefined,
            startDate: filterValues.startDate || undefined,
            endDate: filterValues.endDate || undefined,
          },
        });

        console.log("Fetched Data:", response.data); // Debugging log

        const reports = response.data;

        // Initialize count objects
        const municipalityCounts = {};
        const animalCounts = {};
        const weightCounts = {};

        reports.forEach((report) => {
          const { municipality, slaughterAnimals } = report;

          // Count municipality slaughters
          if (!municipalityCounts[municipality]) municipalityCounts[municipality] = 0;
          municipalityCounts[municipality] += 1;

          slaughterAnimals.forEach((animal) => {
            const { name, number, weight } = animal;

            // Count animals and weight
            if (!animalCounts[name]) animalCounts[name] = 0;
            animalCounts[name] += number;

            if (!weightCounts[name]) weightCounts[name] = 0;
            weightCounts[name] += parseFloat(weight);
          });
        });

        // Define chart options
        const chartOptions = {
          plugins: {
            legend: {
              display: true,
            },
          },
        };

        setData({
          municipalityChart: {
            labels: Object.keys(municipalityCounts),
            datasets: [{
              label: "Slaughters per Municipality",
              data: Object.values(municipalityCounts),
              backgroundColor: "#1b5b40",
            }],
            options: chartOptions,
          },
          animalChart: {
            labels: Object.keys(animalCounts),
            datasets: [{
              label: "Number of Animals Slaughtered",
              data: Object.values(animalCounts),
              backgroundColor: "#ffe459",
            }],
            options: chartOptions,
          },
          weightChart: {
            labels: Object.keys(weightCounts),
            datasets: [{
              label: "Total Weight of Slaughtered Animals",
              data: Object.values(weightCounts),
              backgroundColor: "#123c29",
            }],
            options: chartOptions,
          },
        });

        // Analysis Section
        const totalSlaughters = Object.values(animalCounts).reduce((acc, curr) => acc + curr, 0);
        const heaviestAnimal = Object.keys(weightCounts).reduce(
          (a, b) => (weightCounts[a] > weightCounts[b] ? a : b),
          ""
        );
        const mostSlaughteredMunicipality = Object.keys(municipalityCounts).reduce(
          (a, b) => (municipalityCounts[a] > municipalityCounts[b] ? a : b),
          ""
        );

        // Additional analysis for each chart
        setAnalysis({
          totalSlaughters,
          heaviestAnimal,
          heaviestAnimalWeight: weightCounts[heaviestAnimal],
          mostSlaughteredMunicipality,
          municipalityCounts,
          animalCounts,
          weightCounts,
        });

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data: ", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [filterOptions.filters, filterOptions.showAll, selectedChart]);

  if (loading) return (
    <div className="flex items-center justify-center py-10">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  );

  // Check if the data object contains the necessary chart data
  const charts = [
    {
      label: "Slaughters per Municipality",
      content: data.municipalityChart ? (
        <Bar data={data.municipalityChart} options={data.municipalityChart.options} />
      ) : <div>No data available for Slaughters per Municipality</div>,
      style: "col-span-2",
    },
    {
      label: "Number of Animals Slaughtered",
      content: data.animalChart ? (
        <Pie data={data.animalChart} options={data.animalChart.options} />
      ) : <div>No data available for Number of Animals Slaughtered</div>,
      style: "col-span-2",
    },
    {
      label: "Total Weight of Slaughtered Animals",
      content: data.weightChart ? (
        <Line data={data.weightChart} options={data.weightChart.options} />
      ) : <div>No data available for Total Weight of Slaughtered Animals</div>,
      style: "col-span-2",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-darkgreen mb-4 text-center">
          Slaughter Report
        </h2>
        
        {/* Analysis Section */}
        <div className="mt-8 p-6 bg-white border border-gray-200 shadow-md rounded-lg">
          <h3 className="text-2xl font-bold text-darkgreen border-b-2 border-darkgreen pb-2">
            Analysis
          </h3>
          <p className="text-gray-800 mt-4 text-lg leading-relaxed">
            <strong>Total Slaughters:</strong> {analysis.totalSlaughters} <br />
            <strong>Heaviest Slaughtered Animal:</strong> {analysis.heaviestAnimal} ({analysis.heaviestAnimalWeight} kg) <br />
            <strong>Most Slaughtered Municipality:</strong> {analysis.mostSlaughteredMunicipality} ({analysis.municipalityCounts[analysis.mostSlaughteredMunicipality]} times) <br />
            <strong>Total Municipalities:</strong> {Object.keys(analysis.municipalityCounts).length}. <br />
            <strong>Most Slaughtered Animal:</strong> {Object.keys(analysis.animalCounts).reduce((a, b) => (analysis.animalCounts[a] > analysis.animalCounts[b] ? a : b), "")} with {Math.max(...Object.values(analysis.animalCounts))} slaughters.
          </p>
        </div>

        <ChartGroup
          charts={charts}
          title="Slaughter Report"
          selectedChart={selectedChart}
          setSelectedChart={setSelectedChart}
        />
      </div>
    </div>
  );
};

export default SlaughterReportChart;
