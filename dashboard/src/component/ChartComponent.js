import React, { useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, BarElement, Tooltip, Legend, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(LineElement, PointElement, BarElement, Tooltip, Legend, CategoryScale, LinearScale);

const ChartComponent = () => {
  useEffect(() => {
    // This effect runs once when the component mounts
  }, []);

  const lineData = {
    labels: ['January', 'February', 'March', 'April', 'May'],
    datasets: [
      {
        label: 'Monthly Actions',
        data: [30, 45, 75, 60, 90],
        borderColor: 'rgba(27, 91, 64, 1)',
        backgroundColor: 'rgba(27, 91, 64, 0.2)',
        fill: true,
      },
    ],
  };

  const barData = {
    labels: ['A', 'B', 'C', 'D', 'E'],
    datasets: [
      {
        label: 'Title',
        data: [12, 19, 3, 5, 2],
        backgroundColor: 'rgba(255, 227, 86, 0.2)',
        borderColor: 'rgba(255, 227, 86, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="bg-[#FFFAFA] p-6 rounded-lg shadow-lg">
      <h2 className="text-[#1b5b40] text-2xl font-semibold mb-4">Line Chart</h2>
      <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
        <Line data={lineData} />
      </div>

      <h2 className="text-[#1b5b40] text-2xl font-semibold mb-4">Bar Chart</h2>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <Bar data={barData} />
      </div>
    </div>
  );
};

export default ChartComponent;
