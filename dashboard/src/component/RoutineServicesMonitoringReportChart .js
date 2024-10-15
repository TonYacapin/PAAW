import React, { useState, useEffect } from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import axios from 'axios';
import { Chart as ChartJS } from 'chart.js/auto';
import ChartGroup from './ChartGroup';

const RoutineServicesMonitoringReportChart = () => {
  const [data, setData] = useState({
    barChartMunicipality: { labels: [], datasets: [{ data: [] }] },
    pieChartSpecies: { labels: [], datasets: [{ data: [] }] },
    barChartActivities: { labels: [], datasets: [{ data: [] }] },
    lineChartNoOfHeads: { labels: [], datasets: [{ data: [] }] }
  });

  const [loading, setLoading] = useState(true);
  const [selectedChart, setSelectedChart] = useState(null); // State for selected chart

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/RSM`);
        const reports = response.data;

        // Process the data for each chart as before...

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
            backgroundColor: 'rgba(75, 192, 192, 0.6)'
          }]
        };

        // 2. Pie Chart: Number of Animals by Species
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
        const processedPieChartSpecies = {
          labels: Object.keys(speciesCounts),
          datasets: [{
            data: Object.values(speciesCounts),
            backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(255, 206, 86, 0.6)']
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
            backgroundColor: 'rgba(153, 102, 255, 0.6)'
          }]
        };

        // 4. Line Chart: Number of Heads per Animal over Time
        const headsOverTime = {};
        reports.forEach(report => {
          report.entries.forEach(entry => {
            const date = new Date(entry.date).toLocaleDateString();
            if (headsOverTime[date]) {
              headsOverTime[date] += entry.animalInfo.noOfHeads;
            } else {
              headsOverTime[date] = entry.animalInfo.noOfHeads;
            }
          });
        });
        const processedLineChartNoOfHeads = {
          labels: Object.keys(headsOverTime),
          datasets: [{
            label: 'Number of Heads per Animal',
            data: Object.values(headsOverTime),
            borderColor: 'rgba(54, 162, 235, 1)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',

          }]
        };

        // Set the processed data to the component state
        setData({
          barChartMunicipality: processedBarChartMunicipality,
          pieChartSpecies: processedPieChartSpecies,
          barChartActivities: processedBarChartActivities,
          lineChartNoOfHeads: processedLineChartNoOfHeads
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
        <Bar data={data.barChartMunicipality} />
      ) : (
        <div>No data available</div>
      ),
    },
    {
      style: "col-span-2",
      label: "Number of Animals by Species",
      content: data.pieChartSpecies.labels.length > 0 ? (
        <Pie data={data.pieChartSpecies} />
      ) : (
        <div>No data available</div>
      ),
    },
    {
      style: "col-span-2",
      label: "Activities Conducted",
      content: data.barChartActivities.labels.length > 0 ? (
        <Bar data={data.barChartActivities} />
      ) : (
        <div>No data available</div>
      ),
    },
    {
      style: "col-span-2",
      label: "Number of Heads per Animal over Time",
      content: data.lineChartNoOfHeads.labels.length > 0 ? (
        <Line data={data.lineChartNoOfHeads} />
      ) : (
        <div>No data available</div>
      ),
    },
  ];

  return (

    <div className="container mx-auto px-4 py-6">
      <div className="bg-white shadow-md rounded-lg p-6">
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
