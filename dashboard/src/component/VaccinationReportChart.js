import React, { useState, useEffect } from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import axios from 'axios';
import { Chart as ChartJS } from 'chart.js/auto';

const VaccinationReportChart = () => {
  const [data, setData] = useState({
    barChartMunicipality: { labels: [], datasets: [{ data: [] }] },
    pieChartVaccineType: { labels: [], datasets: [{ data: [] }] },
    barChartReason: { labels: [], datasets: [{ data: [] }] },
    lineChartVaccinationsOverTime: { labels: [], datasets: [{ data: [] }] },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVaccinationReports = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/reports');
        const reports = response.data;

        // Bar Chart: Number of Entries by Municipality
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

        // Pie Chart: Vaccine Type Distribution
        const vaccineTypeCounts = { Live: 0, Killed: 0, Attenuated: 0 };
        reports.forEach(report => {
          vaccineTypeCounts[report.vaccineType] += 1;
        });
        const processedPieChartVaccineType = {
          labels: Object.keys(vaccineTypeCounts),
          datasets: [{
            data: Object.values(vaccineTypeCounts),
            backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(255, 206, 86, 0.6)']
          }]
        };

        // Bar Chart: Reason for Vaccination
        const reasonCounts = { Mass: 0, Routine: 0, Outbreak: 0 };
        reports.forEach(report => {
          report.entries.forEach(entry => {
            reasonCounts[entry.reason] += 1;
          });
        });
        const processedBarChartReason = {
          labels: Object.keys(reasonCounts),
          datasets: [{
            label: 'Vaccination Reasons',
            data: Object.values(reasonCounts),
            backgroundColor: 'rgba(153, 102, 255, 0.6)'
          }]
        };

        // Line Chart: Vaccinations Over Time
        const vaccinationsOverTime = {};
        reports.forEach(report => {
          const date = new Date(report.dateReported).toLocaleDateString();
          if (vaccinationsOverTime[date]) {
            vaccinationsOverTime[date] += 1;
          } else {
            vaccinationsOverTime[date] = 1;
          }
        });
        const processedLineChartVaccinationsOverTime = {
          labels: Object.keys(vaccinationsOverTime),
          datasets: [{
            label: 'Vaccinations Over Time',
            data: Object.values(vaccinationsOverTime),
            borderColor: 'rgba(54, 162, 235, 1)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderWidth: 2
          }]
        };

        setData({
          barChartMunicipality: processedBarChartMunicipality,
          pieChartVaccineType: processedPieChartVaccineType,
          barChartReason: processedBarChartReason,
          lineChartVaccinationsOverTime: processedLineChartVaccinationsOverTime,
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching vaccination reports:', error);
        setLoading(false);
      }
    };

    fetchVaccinationReports();
  }, []);

  if (loading) {
    return <div>Loading chart data...</div>;
  }

  return (
    <div>
      <h2>Vaccination Report Dashboard</h2>

      {/* Bar Chart: Number of Entries by Municipality */}
      <div>
        <h3>Number of Entries by Municipality</h3>
        {data.barChartMunicipality.labels.length > 0 ? <Bar data={data.barChartMunicipality} /> : <div>No data available</div>}
      </div>

      {/* Pie Chart: Vaccine Type Distribution */}
      <div>
        <h3>Vaccine Type Distribution</h3>
        {data.pieChartVaccineType.labels.length > 0 ? <Pie data={data.pieChartVaccineType} /> : <div>No data available</div>}
      </div>

      {/* Bar Chart: Reason for Vaccination */}
      <div>
        <h3>Reason for Vaccination</h3>
        {data.barChartReason.labels.length > 0 ? <Bar data={data.barChartReason} /> : <div>No data available</div>}
      </div>

      {/* Line Chart: Vaccinations Over Time */}
      <div>
        <h3>Vaccinations Over Time</h3>
        {data.lineChartVaccinationsOverTime.labels.length > 0 ? <Line data={data.lineChartVaccinationsOverTime} /> : <div>No data available</div>}
      </div>
    </div>
  );
};

export default VaccinationReportChart;
