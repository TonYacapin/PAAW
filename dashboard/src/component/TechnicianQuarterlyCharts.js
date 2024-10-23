import React, { useEffect, useState } from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
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
import axiosInstance from './axiosInstance';

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

const TechnicianQuarterlyCharts = ({ filterValues }) => {
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
  const [entriesPerMunicipalityData, setEntriesPerMunicipalityData] = useState({
    labels: [],
    datasets: [],
  });
  const [reportsPerMunicipalityData, setReportsPerMunicipalityData] = useState({
    labels: [],
    datasets: [],
  });

  const [selectedChart, setSelectedChart] = useState(null);
  const [analysis, setAnalysis] = useState(""); // State for storing analysis

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(`/api/technician-quarterly`, {
          params: {
            formStatus: 'Accepted',
            municipality: filterValues.municipality || undefined,
            startDate: filterValues.startDate || undefined,
            endDate: filterValues.endDate || undefined,
          },
        });
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

          // Number of Reports Per Municipality (Bar Chart)
          const reportCount = data.reduce((acc, curr) => {
            const municipality = curr.municipality;
            acc[municipality] = (acc[municipality] || 0) + 1; // Each entry is a report
            return acc;
          }, {});

          setReportsPerMunicipalityData({
            labels: Object.keys(reportCount),
            datasets: [
              {
                label: 'Reports per Municipality',
                data: Object.values(reportCount),
                backgroundColor: 'rgba(255, 206, 86, 0.2)',
                borderColor: 'rgba(255, 206, 86, 1)',
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

          // Number of Calves According to Sex (Bar Chart)
          setEntriesPerMunicipalityData({
            labels: ['Male', 'Female'],
            datasets: [
              {
                label: 'Calves Count',
                data: [sexCount.male, sexCount.female],
                backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(255, 99, 132, 0.2)'],
                borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
                borderWidth: 1,
              },
            ],
          });
        }

         // Analysis Section
         const totalEntries = data.length;
       

         setAnalysis(
           <>
             <p>
               <strong>Total number of reports:</strong> {totalEntries}.
             </p>
           
           </>
         );
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
      label: 'Number of Reports Per Municipality',
      content: <Bar data={reportsPerMunicipalityData} options={{ responsive: true }} />,
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
    {
      label: 'Number of Calves According to Sex',
      content: <Bar data={entriesPerMunicipalityData} options={{ responsive: true }} />,
      style: 'col-span-2',
    },
  ];

  return (
    <div>
      {/* Analysis Section */}
      <div className="mt-8 p-6 bg-white border border-gray-200 shadow-md rounded-lg">
        <h3 className="text-2xl font-bold text-darkgreen border-b-2 border-darkgreen pb-2">Analysis</h3>
        <p className="text-gray-800 mt-4 text-lg leading-relaxed">
          {analysis}
        </p>
      </div>

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
