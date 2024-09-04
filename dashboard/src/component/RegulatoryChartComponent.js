import React, { useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, BarElement, Tooltip, Legend, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(LineElement, PointElement, BarElement, Tooltip, Legend, CategoryScale, LinearScale);

const RegulatoryChartComponent = () => {
  useEffect(() => {
    // This effect runs once when the component mounts
  }, []);

  const regulatoryLineData = {
    labels: ['January', 'February', 'March', 'April', 'May'],
    datasets: [
      {
        label: 'Compliance Checks',
        data: [50, 65, 80, 70, 90],
        borderColor: 'rgba(27, 91, 64, 1)', // Primary color
        backgroundColor: 'rgba(27, 91, 64, 0.2)', // Primary color with transparency
        fill: true,
      },
    ],
  };

  const regulatoryBarData = {
    labels: ['Regulation A', 'Regulation B', 'Regulation C', 'Regulation D', 'Regulation E'],
    datasets: [
      {
        label: 'Reports Filed',
        data: [25, 40, 15, 30, 10],
        backgroundColor: 'rgba(255, 227, 86, 0.2)', // Secondary color with transparency
        borderColor: 'rgba(255, 227, 86, 1)', // Secondary color
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="bg-[#FFFAFA] p-6 rounded-lg shadow-lg">
      <h2 className="text-[#1b5b40] text-2xl font-semibold mb-4">Regulatory Compliance Line Chart</h2>
      <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
        <Line data={regulatoryLineData} />
      </div>

      <h2 className="text-[#1b5b40] text-2xl font-semibold mb-4">Regulatory Reports Bar Chart</h2>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <Bar data={regulatoryBarData} />
      </div>
    </div>
  );
};

export default RegulatoryChartComponent;
