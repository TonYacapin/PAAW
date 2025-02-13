import React, { useState, useEffect } from 'react';
import { Bar, Pie, Line, Doughnut } from 'react-chartjs-2';
import axiosInstance from '../component/axiosInstance';
import { Chart as ChartJS } from 'chart.js/auto';
import ChartGroup from './ChartGroup';

const RoutineServicesMonitoringReportChart = ({ filterValues }) => {
  const [data, setData] = useState({
    barChartMunicipality: { labels: [], datasets: [{ data: [] }] },
    barChartSpecies: { labels: [], datasets: [{ data: [] }] },
    barChartActivities: { labels: [], datasets: [{ data: [] }] },
    lineChartNoOfHeads: { labels: [], datasets: [{ data: [] }] },
    lineChartHeadsPerDate: { labels: [], datasets: [{ data: [] }] },
    barChartSpeciesActivity: { labels: [], datasets: [{ data: [] }] },
    doughnutChartRoutineServices: { labels: [], datasets: [{ data: [] }] }
  });

  const [loading, setLoading] = useState(true);
  const [selectedChart, setSelectedChart] = useState(null); // State for selected chart
  const [analysis, setAnalysis] = useState("");
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axiosInstance.get(`/RSM`, {
          params: {
            formStatus: 'Accepted',
            municipality: filterValues.municipality || undefined,
            startDate: filterValues.startDate || undefined,
            endDate: filterValues.endDate || undefined,
          },
        }
        );
        const reports = response.data;

        // Processing the data for each chart

        // 1. Bar Chart: Number of Entries by Municipality
        const municipalityCounts = {};
        reports.forEach(report => {
          if (municipalityCounts[report.municipality]) {
            municipalityCounts[report.municipality] += report.entries.length;
          } else {
            municipalityCounts[report.municipality] = report.entries.length;
          }
        });
        const processedBarChartMunicipality = {
          labels: Object.keys(municipalityCounts),
          datasets: [{
            label: 'Number of Entries by Municipality',
            data: Object.values(municipalityCounts),
            backgroundColor: ["#ffe459", "#e5cd50", "#1b5b40", "#123c29", "#252525"]
          }]
        };

        // 2. Bar Chart: Number of Animals by Species (fixing this to a bar chart)
        const speciesCounts = {};
        reports.forEach(report => {
          report.entries.forEach(entry => {
            const species = entry.animalInfo.species;
            if (speciesCounts[species]) {
              speciesCounts[species] += entry.animalInfo.noOfHeads;
            } else {
              speciesCounts[species] = entry.animalInfo.noOfHeads;
            }
          });
        });
        const processedBarChartSpecies = {
          labels: Object.keys(speciesCounts),
          datasets: [{
            label: 'Number of Animals by Species',
            data: Object.values(speciesCounts),
            backgroundColor: ["#ffe459", "#e5cd50", "#1b5b40", "#123c29", "#252525"]
          }]
        };

        // 3. Bar Chart: Activities Conducted
        const activityCounts = {};
        reports.forEach(report => {
          report.entries.forEach(entry => {
            const activity = entry.activity;
            if (activityCounts[activity]) {
              activityCounts[activity] += 1;
            } else {
              activityCounts[activity] = 1;
            }
          });
        });
        const processedBarChartActivities = {
          labels: Object.keys(activityCounts),
          datasets: [{
            label: 'Activities Conducted',
            data: Object.values(activityCounts),
            backgroundColor: ["#ffe459", "#e5cd50", "#1b5b40", "#123c29", "#252525"]
          }]
        };

        // 4. Line Chart: Number of Heads per Date
        const headsPerDate = {};
        reports.forEach(report => {
          report.entries.forEach(entry => {
            const date = new Date(entry.date).toLocaleDateString();
            if (headsPerDate[date]) {
              headsPerDate[date] += entry.animalInfo.noOfHeads;
            } else {
              headsPerDate[date] = entry.animalInfo.noOfHeads;
            }
          });
        });
        const processedLineChartHeadsPerDate = {
          labels: Object.keys(headsPerDate),
          datasets: [{
            label: 'Number of Heads per Date',
            data: Object.values(headsPerDate),
            borderColor: '#123c29',
            backgroundColor: ["#ffe459", "#e5cd50", "#1b5b40", "#123c29", "#252525"]
          }]
        };

        // 5. Bar Chart: Species per Activity
        const speciesPerActivity = {};
        reports.forEach(report => {
          report.entries.forEach(entry => {
            const activity = entry.activity;
            const species = entry.animalInfo.species;
            if (speciesPerActivity[activity]) {
              if (speciesPerActivity[activity][species]) {
                speciesPerActivity[activity][species] += entry.animalInfo.noOfHeads;
              } else {
                speciesPerActivity[activity][species] = entry.animalInfo.noOfHeads;
              }
            } else {
              speciesPerActivity[activity] = { [species]: entry.animalInfo.noOfHeads };
            }
          });
        });
        const processedBarChartSpeciesActivity = {
          labels: Object.keys(speciesPerActivity),
          datasets: Object.keys(speciesCounts).map(species => ({
            label: species,
            data: Object.values(speciesPerActivity).map(activityData => activityData[species] || 0),
            backgroundColor: "#ffe459"
          }))
        };

        // 6. Doughnut Chart: Percentage of Animals Registered that Received Routine Services
        const totalAnimals = reports.reduce((sum, report) => {
          return sum + report.entries.reduce((entrySum, entry) => entrySum + entry.animalInfo.noOfHeads, 0);
        }, 0);
        const registeredAnimals = reports.reduce((sum, report) => {
          return sum + report.entries.reduce((entrySum, entry) => {
            return entry.animalInfo.animalRegistered ? entrySum + entry.animalInfo.noOfHeads : entrySum;
          }, 0);
        }, 0);
        const processedDoughnutChartRoutineServices = {
          labels: ['Registered', 'Not Registered'],
          datasets: [{
            data: [registeredAnimals, totalAnimals - registeredAnimals],
            backgroundColor: ["#1b5b40", "#e5cd50"]
          }]
        };

     // Analysis Section
const totalEntries = reports.length;
const totalMunicipalities = Object.keys(municipalityCounts).length;

// Find the municipality with the highest number of entries
const topMunicipality = Object.entries(municipalityCounts).reduce((a, b) => (a[1] > b[1] ? a : b), ['', 0]);

// Find the species with the most animals
const topSpecies = Object.entries(speciesCounts).reduce((a, b) => (a[1] > b[1] ? a : b), ['', 0]);

// Find the most common activity
const topActivity = Object.entries(activityCounts).reduce((a, b) => (a[1] > b[1] ? a : b), ['', 0]);

// Calculate the percentage of registered animals
const registeredPercentage = ((registeredAnimals / totalAnimals) * 100).toFixed(2);

setAnalysis(
<>
  <p>
    <strong>Total number of reports:</strong> {totalEntries}.
  </p>
  <p>
    <strong>Number of municipalities involved:</strong> {totalMunicipalities}.
  </p>
  <p>
    <strong>Municipality with the highest number of reports:</strong> {topMunicipality[0]} ({topMunicipality[1]} reports).
  </p>
  <p>
    <strong>Most common species:</strong> {topSpecies[0]} ({topSpecies[1]} heads).
  </p>
  <p>
    <strong>Most frequently performed activity:</strong> {topActivity[0]} ({topActivity[1]} occurrences).
  </p>
  <p>
    <strong>Total number of animals recorded:</strong> {totalAnimals}.
  </p>
  <p>
    <strong>Percentage of animals registered:</strong> {registeredPercentage}%.
  </p>
</>

);


        // Set the processed data to the component state
        setData({
          barChartMunicipality: processedBarChartMunicipality,
          barChartSpecies: processedBarChartSpecies,
          barChartActivities: processedBarChartActivities,
          lineChartNoOfHeads: processedLineChartHeadsPerDate,
          lineChartHeadsPerDate: processedLineChartHeadsPerDate,
          barChartSpeciesActivity: processedBarChartSpeciesActivity,
          doughnutChartRoutineServices: processedDoughnutChartRoutineServices
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching reports:', error);
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) {
    return <div>Loading chart data...</div>;
  }

  const charts = [
    {
      style: "col-span-2",
      label: "Number of Entries by Municipality",
      content: data.barChartMunicipality.labels.length > 0 ? (
        <Bar data={data.barChartMunicipality} options={{ plugins: { legend: { display: false } } }} />
      ) : <div>No data available</div>
    },
    {
      style: "col-span-2",
      label: "Number of Animals by Species",
      content: data.barChartSpecies.labels.length > 0 ? (
        <Bar data={data.barChartSpecies} options={{ plugins: { legend: { display: false } } }} />
      ) : <div>No data available</div>
    },
    {
      style: "col-span-2",
      label: "Activities Conducted",
      content: data.barChartActivities.labels.length > 0 ? (
        <Bar data={data.barChartActivities} options={{ plugins: { legend: { display: false } } }} />
      ) : <div>No data available</div>
    },
    {
      style: "col-span-2",
      label: "Number of Heads per Date",
      content: data.lineChartHeadsPerDate.labels.length > 0 ? (
        <Line data={data.lineChartHeadsPerDate} options={{ plugins: { legend: { display: false } } }} />
      ) : <div>No data available</div>
    },
    {
      style: "col-span-2",
      label: "Species per Activity",
      content: data.barChartSpeciesActivity.labels.length > 0 ? (
        <Bar
          data={data.barChartSpeciesActivity}
          options={{ plugins: { legend: { display: true } } }} // Show legend to distinguish species
        />
      ) : (
        <div>No data available</div>
      )
    },
    {
      style: "col-span-2",
      label: "Percentage of Animals Registered that Received Routine Services",
      content: data.doughnutChartRoutineServices.labels.length > 0 ? (
        <Doughnut
          data={data.doughnutChartRoutineServices}
          options={{ plugins: { legend: { display: true } } }}
        />
      ) : (
        <div>No data available</div>
      )
    }
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Routine Services Monitoring Report</h2>
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
          title="Routine Services Monitoring Report"
          selectedChart={selectedChart}
          setSelectedChart={setSelectedChart}
        />
      </div>
    </div>
  );
};

export default RoutineServicesMonitoringReportChart;

