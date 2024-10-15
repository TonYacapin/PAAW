import React, { useEffect, useState } from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import axios from 'axios';
import ChartGroup from './ChartGroup'; // Import ChartGroup
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement,
} from 'chart.js';

// Register the necessary Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement
);

const TechnicianQuarterlyCharts = () => {
  const [technicianActivityData, setTechnicianActivityData] = useState({
    labels: [],
    datasets: [],
  });
  const [sexDistributionData, setSexDistributionData] = useState({
    labels: [],
    datasets: [],
  });
  const [breedDiversityData, setBreedDiversityData] = useState({
    labels: [],
    datasets: [],
  });
  const [calvingDateData, setCalvingDateData] = useState({
    labels: [],
    datasets: [],
  });

  const [selectedChart, setSelectedChart] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/technician-quarterly`);
        const data = response.data;

        if (data && data.length > 0) {
          // Technician Activity by Municipality (Bar Chart)
          const municipalityCount = data.reduce((acc, curr) => {
            const municipality = curr.municipality;
            acc[municipality] = (acc[municipality] || 0) + curr.animalEntries.length;
            return acc;
          }, {});

          setTechnicianActivityData({
            labels: Object.keys(municipalityCount),
            datasets: [
              {
                label: 'AI Services by Municipality',
                data: Object.values(municipalityCount),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
              },
            ],
          });

          // Sex Distribution of Calves (Pie Chart)
          const sexCount = data.reduce(
            (acc, curr) => {
              curr.animalEntries.forEach((entry) => {
                if (entry.sex === 'Male') acc.male += 1;
                if (entry.sex === 'Female') acc.female += 1;
              });
              return acc;
            },
            { male: 0, female: 0 }
          );

          setSexDistributionData({
            labels: ['Male', 'Female'],
            datasets: [
              {
                data: [sexCount.male, sexCount.female],
                backgroundColor: ['rgba(54, 162, 235, 0.2)', 'rgba(255, 99, 132, 0.2)'],
                borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 99, 132, 1)'],
                borderWidth: 1,
              },
            ],
          });

          // Breed Diversity (Bar Chart)
          const breedCount = data.reduce((acc, curr) => {
            curr.animalEntries.forEach((entry) => {
              const breed = entry.breed;
              acc[breed] = (acc[breed] || 0) + 1;
            });
            return acc;
          }, {});

          setBreedDiversityData({
            labels: Object.keys(breedCount),
            datasets: [
              {
                label: 'Breed Count',
                data: Object.values(breedCount),
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1,
              },
            ],
          });

          // Calving Date Trends (Line Chart)
          const calvingCount = data.reduce((acc, curr) => {
            curr.animalEntries.forEach((entry) => {
              const date = new Date(entry.dateCalved).toISOString().split('T')[0];
              acc[date] = (acc[date] || 0) + 1;
            });
            return acc;
          }, {});

          setCalvingDateData({
            labels: Object.keys(calvingCount),
            datasets: [
              {
                label: 'Calving Events',
                data: Object.values(calvingCount),
                backgroundColor: 'rgba(255, 159, 64, 0.2)',
                borderColor: 'rgba(255, 159, 64, 1)',
                borderWidth: 1,
                fill: true,
              },
            ],
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Create an array of chart objects to be passed to ChartGroup
  const charts = [
    {
      label: 'Technician Activity by Municipality',
      content: <Bar data={technicianActivityData} options={{ responsive: true }} />,
      style: 'col-span-2',
    },
    {
      label: 'Sex Distribution of Calves',
      content: <Pie data={sexDistributionData} options={{ responsive: true }} />,
      style: 'col-span-2',
    },
    {
      label: 'Breed Diversity',
      content: <Bar data={breedDiversityData} options={{ responsive: true }} />,
      style: 'col-span-2',
    },
    {
      label: 'Calving Date Trends',
      content: <Line data={calvingDateData} options={{ responsive: true }} />,
      style: 'col-span-2',
    },
  ];

  return (
    <div>
  
      <ChartGroup
        charts={charts}
        title="Technician Quarterly Performance"
        selectedChart={selectedChart}
        setSelectedChart={setSelectedChart}
      />
    </div>
  );
};

export default TechnicianQuarterlyCharts;
