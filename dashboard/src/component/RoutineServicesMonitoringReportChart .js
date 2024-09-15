import React, { useState, useEffect } from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import axios from 'axios';
import { Chart as ChartJS } from 'chart.js/auto';

const RoutineServicesMonitoringReportChart = () => {
  const [data, setData] = useState({
    barChartMunicipality: { labels: [], datasets: [{ data: [] }] },
    pieChartSpecies: { labels: [], datasets: [{ data: [] }] },
    barChartActivities: { labels: [], datasets: [{ data: [] }] },
    lineChartNoOfHeads: { labels: [], datasets: [{ data: [] }] }
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {

        const response = await axios.get('http://localhost:5000/RSM');
        const reports = response.data;
        console.log(reports)
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
            borderWidth: 2
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

  return (
    <div>
      <h2>Routine Services Monitoring Report Dashboard</h2>

      {/* Bar Chart: Number of Entries by Municipality */}
      <div>
        <h3>Number of Entries by Municipality</h3>
        {data.barChartMunicipality.labels.length > 0 ? <Bar data={data.barChartMunicipality} /> : <div>No data available</div>}
      </div>

      {/* Pie Chart: Number of Animals by Species */}
      <div>
        <h3>Number of Animals by Species</h3>
        {data.pieChartSpecies.labels.length > 0 ? <Pie data={data.pieChartSpecies} /> : <div>No data available</div>}
      </div>

      {/* Bar Chart: Activities Conducted */}
      <div>
        <h3>Activities Conducted</h3>
        {data.barChartActivities.labels.length > 0 ? <Bar data={data.barChartActivities} /> : <div>No data available</div>}
      </div>

      {/* Line Chart: Number of Heads per Animal over Time */}
      <div>
        <h3>Number of Heads per Animal over Time</h3>
        {data.lineChartNoOfHeads.labels.length > 0 ? <Line data={data.lineChartNoOfHeads} /> : <div>No data available</div>}
      </div>
    </div>
  );
};

export default RoutineServicesMonitoringReportChart;
