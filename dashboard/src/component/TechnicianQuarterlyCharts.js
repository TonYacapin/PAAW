import React, { useEffect, useState } from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
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

  return (
    <div>
      <h2>Technician Quarterly Charts</h2>

      {/* Technician Activity by Municipality */}
      {technicianActivityData.datasets.length > 0 && (
        <div>
          <h3>Technician Activity by Municipality</h3>
          <Bar data={technicianActivityData} />
        </div>
      )}

      {/* Sex Distribution of Calves */}
      {sexDistributionData.datasets.length > 0 && (
        <div>
          <h3>Sex Distribution of Calves</h3>
          <Pie data={sexDistributionData} />
        </div>
      )}

      {/* Breed Diversity */}
      {breedDiversityData.datasets.length > 0 && (
        <div>
          <h3>Breed Diversity</h3>
          <Bar data={breedDiversityData} />
        </div>
      )}

      {/* Calving Date Trends */}
      {calvingDateData.datasets.length > 0 && (
        <div>
          <h3>Calving Date Trends</h3>
          <Line data={calvingDateData} />
        </div>
      )}
    </div>
  );
};

export default TechnicianQuarterlyCharts;
