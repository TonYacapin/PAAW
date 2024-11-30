import React, { useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, BarElement, Tooltip, Legend, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(LineElement, PointElement, BarElement, Tooltip, Legend, CategoryScale, LinearScale);

const LivestockChartComponent = () => {
  useEffect(() => {
    // This effect runs once when the component mounts
  }, []);

  const livestockLineData = {
    labels: ['January', 'February', 'March', 'April', 'May'],
    datasets: [
      {
        label: 'Livestock Growth',
        data: [100, 120, 150, 130, 160],
        borderColor: 'rgba(27, 91, 64, 1)', // Primary color
        backgroundColor: 'rgba(27, 91, 64, 0.2)', // Primary color with transparency
        fill: true,
      },
    ],
  };

  const livestockBarData = {
    labels: ['Cattle', 'Sheep', 'Goats', 'Pigs', 'Poultry'],
    datasets: [
      {
        label: 'Livestock Numbers',
        data: [200, 150, 100, 80, 300],
        backgroundColor: 'rgba(255, 227, 86, 0.2)', // Secondary color with transparency
        borderColor: 'rgba(255, 227, 86, 1)', // Secondary color
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="bg-[#FFFAFA] p-6 rounded-lg shadow-lg">
      <h2 className="text-[#1b5b40] text-2xl font-semibold mb-4">Livestock Growth Line Chart</h2>
      <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
        <Line data={livestockLineData} />
      </div>

      <h2 className="text-[#1b5b40] text-2xl font-semibold mb-4">Livestock Numbers Bar Chart</h2>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <Bar data={livestockBarData} />
      </div>
    </div>
  );
};

export default LivestockChartComponent;
