import React, { useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, BarElement, Tooltip, Legend, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(LineElement, PointElement, BarElement, Tooltip, Legend, CategoryScale, LinearScale);

const AnimalHealthChartComponent = () => {
  useEffect(() => {
    
  }, []);

  const healthLineData = {
    labels: ['January', 'February', 'March', 'April', 'May'],
    datasets: [
      {
        label: 'Health Check-ups',
        data: [15, 20, 30, 25, 35],
        borderColor: 'rgba(27, 91, 64, 1)', 
        backgroundColor: 'rgba(27, 91, 64, 0.2)', 
        fill: true,
      },
    ],
  };

  const healthBarData = {
    labels: ['Dogs', 'Cats', 'Birds', 'Reptiles', 'Others'],
    datasets: [
      {
        label: 'Cases Reported',
        data: [50, 40, 30, 10, 5],
        backgroundColor: 'rgba(255, 227, 86, 0.2)', // Secondary color with transparency
        borderColor: 'rgba(255, 227, 86, 1)', // Secondary color
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="bg-[#FFFAFA] p-6 rounded-lg shadow-lg">
      <h2 className="text-[#1b5b40] text-2xl font-semibold mb-4">Animal Health Line Chart</h2>
      <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
        <Line data={healthLineData} />
      </div>

      <h2 className="text-[#1b5b40] text-2xl font-semibold mb-4">Animal Health Bar Chart</h2>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <Bar data={healthBarData} />
      </div>
    </div>
  );
};

export default AnimalHealthChartComponent;
