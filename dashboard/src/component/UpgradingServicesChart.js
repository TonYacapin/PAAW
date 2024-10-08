import React, { useEffect, useState } from 'react';
import { Bar, Pie, Doughnut } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const UpgradingServicesChart = () => {
  const [chartData, setChartData] = useState({
    municipalityData: { labels: [], datasets: [] },
    activityData: { labels: [], datasets: [] },
    speciesData: { labels: [], datasets: [] },
    genderData: { labels: [], datasets: [] },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/upgrading-services`);
        const data = response.data;

        setChartData({
          municipalityData: processDataByMunicipality(data),
          activityData: processDataByActivity(data),
          speciesData: processDataBySpecies(data),
          genderData: processDataByGender(data),
        });
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };

    fetchData();
  }, []);

  const processDataByMunicipality = (data) => {
    const municipalityData = data.reduce((acc, curr) => {
      const { municipality, entries } = curr;
      if (!acc[municipality]) {
        acc[municipality] = 0;
      }
      acc[municipality] += entries.length;
      return acc;
    }, {});

    return {
      labels: Object.keys(municipalityData),
      datasets: [{
        label: 'Number of Entries by Municipality',
        data: Object.values(municipalityData),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      }]
    };
  };

  const processDataByActivity = (data) => {
    const activityData = data.flatMap(item => item.entries).reduce((acc, entry) => {
      const { activity } = entry;
      if (!acc[activity]) {
        acc[activity] = 0;
      }
      acc[activity] += 1;
      return acc;
    }, {});

    return {
      labels: Object.keys(activityData),
      datasets: [{
        label: 'Distribution of Activities',
        data: Object.values(activityData),
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
      }]
    };
  };

  const processDataBySpecies = (data) => {
    const speciesData = data.flatMap(item => item.entries).reduce((acc, entry) => {
      const { species } = entry.animalInfo;
      if (!acc[species]) {
        acc[species] = 0;
      }
      acc[species] += 1;
      return acc;
    }, {});

    return {
      labels: Object.keys(speciesData),
      datasets: [{
        label: 'Distribution of Species',
        data: Object.values(speciesData),
        backgroundColor: [
          'rgba(255, 159, 64, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
        ],
        borderColor: [
          'rgba(255, 159, 64, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
        ],
        borderWidth: 1,
      }]
    };
  };

  const processDataByGender = (data) => {
    const genderData = data.flatMap(item => item.entries).reduce((acc, entry) => {
      const { gender } = entry.clientInfo;
      if (!acc[gender]) {
        acc[gender] = 0;
      }
      acc[gender] += 1;
      return acc;
    }, {});

    return {
      labels: Object.keys(genderData),
      datasets: [{
        label: 'Gender Distribution of Clients',
        data: Object.values(genderData),
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
        ],
        borderWidth: 1,
      }]
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Upgrading Services Analysis',
      },
    },
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-center text-2xl mb-4">Upgrading Services Dashboard</h1>

      {/* Bar Chart - Municipality Data */}
      <div className="mb-10">
        <h2 className="text-lg font-bold mb-2">Number of Entries by Municipality</h2>
        {chartData.municipalityData.datasets.length > 0 && (
          <Bar data={chartData.municipalityData} options={chartOptions} />
        )}
      </div>

      {/* Pie Chart - Activity Data */}
      <div className="mb-10">
        <h2 className="text-lg font-bold mb-2">Distribution of Activities</h2>
        {chartData.activityData.datasets.length > 0 && (
          <Pie data={chartData.activityData} options={chartOptions} />
        )}
      </div>

      {/* Doughnut Chart - Species Data */}
      <div className="mb-10">
        <h2 className="text-lg font-bold mb-2">Distribution of Species</h2>
        {chartData.speciesData.datasets.length > 0 && (
          <Doughnut data={chartData.speciesData} options={chartOptions} />
        )}
      </div>

      {/* Pie Chart - Gender Data */}
      <div>
        <h2 className="text-lg font-bold mb-2">Gender Distribution of Clients</h2>
        {chartData.genderData.datasets.length > 0 && (
          <Pie data={chartData.genderData} options={chartOptions} />
        )}
      </div>
    </div>
  );
};

export default UpgradingServicesChart;