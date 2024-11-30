import React, { useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, BarElement, Tooltip, Legend, CategoryScale, LinearScale } from 'chart.js';
import ChartComponent from './ChartComponent';

ChartJS.register(LineElement, PointElement, BarElement, Tooltip, Legend, CategoryScale, LinearScale);

const RegulatoryChartComponent = () => {
  useEffect(() => {
    // This effect runs once when the component mounts
  }, []);

  // Incoming Shipments Data
  const incomingShipmentData = {
    labels: ['January', 'February', 'March', 'April', 'May'],
    datasets: [
      {
        label: 'Incoming Shipments',
        data: [30, 40, 50, 60, 70],
        borderColor: 'rgba(27, 91, 64, 1)', // Primary color
        backgroundColor: 'rgba(27, 91, 64, 0.2)', // Primary color with transparency
        fill: true,
      },
    ],
  };

  // Outgoing Shipments Data
  const outgoingShipmentData = {
    labels: ['January', 'February', 'March', 'April', 'May'],
    datasets: [
      {
        label: 'Outgoing Shipments',
        data: [20, 35, 55, 45, 80],
        borderColor: 'rgba(54, 162, 235, 1)', // Example color for outgoing shipments
        backgroundColor: 'rgba(54, 162, 235, 0.2)', // Transparency
        fill: true,
      },
    ],
  };

  // Slaughter Per Kilogram Data
  const slaughterKgData = {
    labels: ['January', 'February', 'March', 'April', 'May'],
    datasets: [
      {
        label: 'Slaughter (Kg)',
        data: [100, 200, 150, 250, 300],
        borderColor: 'rgba(255, 227, 86, 1)', // Example color for slaughter (Kg)
        backgroundColor: 'rgba(255, 227, 86, 0.2)', // Transparency
        fill: true,
      },
    ],
  };

  // Animals Slaughtered Data
  const animalsSlaughteredData = {
    labels: ['January', 'February', 'March', 'April', 'May'],
    datasets: [
      {
        label: 'Animals Slaughtered',
        data: [10, 15, 5, 12, 8],
        backgroundColor: 'rgba(75, 192, 192, 0.2)', // Example color for animals slaughtered
        borderColor: 'rgba(75, 192, 192, 1)', // Transparency
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="bg-[#FFFAFA] p-6 rounded-lg shadow-lg">
      <h2 className="text-[#1b5b40] text-2xl font-semibold mb-4">Number of Incoming Shipments Per Month</h2>
      <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
        <ChartComponent chartType="line" data={incomingShipmentData} />
      </div>

      <h2 className="text-[#1b5b40] text-2xl font-semibold mb-4">Number of Outgoing Shipments Per Month</h2>
      <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
        <ChartComponent chartType="line" data={outgoingShipmentData} />
      </div>

      <h2 className="text-[#1b5b40] text-2xl font-semibold mb-4">Number of Slaughter Per Kilogram</h2>
      <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
        <ChartComponent chartType="line" data={slaughterKgData} />
      </div>

      <h2 className="text-[#1b5b40] text-2xl font-semibold mb-4">Number of Animals Slaughtered</h2>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <ChartComponent chartType="bar" data={animalsSlaughteredData} />
      </div>
    </div>
  );
};

export default RegulatoryChartComponent;
