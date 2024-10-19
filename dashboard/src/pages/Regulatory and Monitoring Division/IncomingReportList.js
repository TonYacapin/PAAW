import React, { useState, useEffect } from 'react';
import axiosInstance from '../../component/axiosInstance';

function IncomingReportList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Date filter state
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(`/api/vetshipform`);
        setData(response.data);
      } catch (err) {
        console.error('Error fetching data:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter data by date range
  const filterDataByDate = (shipments, start, end) => {
    const startFilterDate = new Date(start);
    const endFilterDate = new Date(end);

    return shipments.filter((shipment) => {
      const shipmentDate = new Date(shipment.date);
      return shipmentDate >= startFilterDate && shipmentDate <= endFilterDate;
    });
  };

  // Process shipment data: sum up all incoming shipments per month
  const getFilteredIncomingShipmentsByMonth = () => {
    const filteredShipments = startDate && endDate ? filterDataByDate(data, startDate, endDate) : data;

    // Array to hold data for each month
    const incomingShipmentsByMonth = Array(12).fill(null).map(() => ({
      Carabao: 0,
      Cattle: 0,
      Swine: 0,
      Horse: 0,
      Chicken: 0,
      Duck: 0,
      Other: 0,
    }));

    filteredShipments.forEach((shipment) => {
      if (shipment.shipmentType === 'Incoming') {
        const shipmentDate = new Date(shipment.date);
        const monthIndex = shipmentDate.getMonth();
        const liveAnimals = shipment.liveAnimals || {};

        // Accumulate counts for each animal type in the appropriate month
        incomingShipmentsByMonth[monthIndex].Carabao += liveAnimals.Carabao || 0;
        incomingShipmentsByMonth[monthIndex].Cattle += liveAnimals.Cattle || 0;
        incomingShipmentsByMonth[monthIndex].Swine += liveAnimals.Swine || 0;
        incomingShipmentsByMonth[monthIndex].Horse += liveAnimals.Horse || 0;
        incomingShipmentsByMonth[monthIndex].Chicken += liveAnimals.Chicken || 0;
        incomingShipmentsByMonth[monthIndex].Duck += liveAnimals.Duck || 0;
        incomingShipmentsByMonth[monthIndex].Other += liveAnimals.Other || 0;
      }
    });

    return incomingShipmentsByMonth;
  };

  // Function to calculate the total for each month
  const calculateTotal = (monthlyShipments) => {
    return Object.values(monthlyShipments).reduce((total, count) => total + count, 0);
  };

  // Print function
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    const incomingShipmentsByMonth = getFilteredIncomingShipmentsByMonth();
    const tableRows = incomingShipmentsByMonth.map((monthlyShipments, index) => {
      const total = Object.values(monthlyShipments).reduce((acc, count) => acc + count, 0);
      return `
        <tr>
          <td>${new Date(0, index).toLocaleString('default', { month: 'long' })}</td>
          <td>${monthlyShipments.Carabao}</td>
          <td>${monthlyShipments.Cattle}</td>
          <td>${monthlyShipments.Swine}</td>
          <td>${monthlyShipments.Horse}</td>
          <td>${monthlyShipments.Chicken}</td>
          <td>${monthlyShipments.Duck}</td>
          <td>${monthlyShipments.Other}</td>
          <td>${total}</td>
        </tr>`;
    }).join('');

    const printContent = `
      <html>
        <head>
          <title>Incoming Shipments Report</title>
          <style>
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
            th { background-color: #1b5b40; color: white; }
          </style>
        </head>
        <body>
          <h2>Incoming Shipments Report</h2>
          <table>
            <thead>
              <tr>
                <th>Month</th>
                <th>Carabao</th>
                <th>Cattle</th>
                <th>Swine</th>
                <th>Horse</th>
                <th>Chicken</th>
                <th>Duck</th>
                <th>Other</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
        </body>
      </html>`;

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // Get the filtered incoming shipments by month
  const incomingShipmentsByMonth = getFilteredIncomingShipmentsByMonth();

  return (
    <div className="p-4 bg-white rounded shadow-md">
      <div className="mb-4">
        <label className="mr-2">Start Date:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="p-2 border rounded"
        />

        <label className="ml-4 mr-2">End Date:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="p-2 border rounded"
        />
      </div>

      <button onClick={handlePrint} className="mb-4 p-2 bg-darkgreen text-white rounded">
        Print Report
      </button>

      {incomingShipmentsByMonth.every(month => Object.values(month).every(count => count === 0)) ? (
        <div>No shipments found for the selected date range.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-darkgreen text-white">
                <th className="border border-gray-300 p-2">Month</th>
                <th className="border border-gray-300 p-2">Carabao</th>
                <th className="border border-gray-300 p-2">Cattle</th>
                <th className="border border-gray-300 p-2">Swine</th>
                <th className="border border-gray-300 p-2">Horse</th>
                <th className="border border-gray-300 p-2">Chicken</th>
                <th className="border border-gray-300 p-2">Duck</th>
                <th className="border border-gray-300 p-2">Other</th>
                <th className="border border-gray-300 p-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {incomingShipmentsByMonth.map((monthlyShipments, index) => {
                const total = Object.values(monthlyShipments).reduce((acc, count) => acc + count, 0);
                return (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="border border-gray-300 p-2">{new Date(0, index).toLocaleString('default', { month: 'long' })}</td>
                    <td className="border border-gray-300 p-2">{monthlyShipments.Carabao}</td>
                    <td className="border border-gray-300 p-2">{monthlyShipments.Cattle}</td>
                    <td className="border border-gray-300 p-2">{monthlyShipments.Swine}</td>
                    <td className="border border-gray-300 p-2">{monthlyShipments.Horse}</td>
                    <td className="border border-gray-300 p-2">{monthlyShipments.Chicken}</td>
                    <td className="border border-gray-300 p-2">{monthlyShipments.Duck}</td>
                    <td className="border border-gray-300 p-2">{monthlyShipments.Other}</td>
                    <td className="border border-gray-300 p-2">{total}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default IncomingReportList;
