import React, { useState } from 'react';

function OutgoingReportList() {
  // Dummy data with "No. of Shipments" included
  const [data, setData] = useState([
    {
      item: 'Carabao',
      year: '2024',
      monthlyShipments: [5, 8, 12, 4, 7, 10, 6, 8, 14, 11, 9, 15],
    },
    {
      item: 'Cattle',
      year: '2023',
      monthlyShipments: [10, 14, 9, 7, 12, 15, 8, 5, 6, 9, 13, 11],
    },
    {
      item: 'Swine',
      year: '2024',
      monthlyShipments: [20, 25, 18, 22, 19, 16, 14, 20, 17, 24, 21, 30],
    },
    {
      item: 'Goat',
      year: '2023',
      monthlyShipments: [3, 4, 6, 8, 5, 9, 2, 7, 4, 6, 5, 8],
    },
    {
      item: 'Broiler',
      year: '2022',
      monthlyShipments: [15, 12, 18, 10, 14, 16, 19, 20, 13, 17, 22, 25],
    },
    {
      item: 'Table Eggs',
      year: '2024',
      monthlyShipments: [100, 120, 150, 110, 140, 130, 125, 135, 145, 160, 170, 180],
    },
    {
      item: 'Embryonated',
      year: '2023',
      monthlyShipments: [8, 12, 7, 9, 6, 10, 5, 8, 11, 7, 9, 10],
    },
    {
      item: 'Culled',
      year: '2022',
      monthlyShipments: [2, 3, 4, 3, 5, 6, 7, 8, 6, 4, 5, 3],
    },
    {
      item: 'Hatchery Eggs',
      year: '2024',
      monthlyShipments: [20, 25, 30, 28, 24, 26, 27, 23, 29, 31, 34, 32],
    },
    {
      item: 'No. of Shipments',
      year: '2024',
      monthlyShipments: [100, 150, 130, 140, 160, 170, 155, 145, 135, 125, 115, 105],
    },
  ]);

  const [year, setYear] = useState('2024');

  // Create a mapping of item names to their shipments for the selected year
  const shipmentsByYear = {};
  data.forEach((report) => {
    if (!shipmentsByYear[report.item]) {
      shipmentsByYear[report.item] = {
        monthlyShipments: Array(12).fill(0), // Initialize with 0 for each month
        year: report.year,
      };
    }
    // Only fill in the shipments for the selected year
    if (report.year === year) {
      shipmentsByYear[report.item].monthlyShipments = report.monthlyShipments;
    }
  });

  // Convert the shipmentsByYear object back into an array
  const filteredData = Object.keys(shipmentsByYear).map((key) => ({
    item: key,
    monthlyShipments: shipmentsByYear[key].monthlyShipments,
  }));

  // Function to calculate the total for each row
  const calculateTotal = (monthlyShipments) => {
    return monthlyShipments.reduce((total, num) => total + num, 0);
  };

  return (
    <div className="p-4 bg-white rounded shadow-md">
      {/* Year filter as number input */}
      <div className="mb-4">
        <label htmlFor="year" className="mr-2 text-darkgreen font-semibold">Filter by Year:</label>
        <input
          type="number"
          id="year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-darkgreen"
        />
      </div>

      {/* Empty State Message */}
      {filteredData.length === 0 ? (
        <div className="text-center text-gray-500">No data available for the selected year.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-darkgreen text-white">
                <th className="border border-gray-300 p-2" title="Name of the item being reported">Item</th>
                {Array.from({ length: 12 }, (_, i) => (
                  <th key={i} className="border border-gray-300 p-2" title={`Shipments for ${new Date(0, i).toLocaleString('default', { month: 'long' })}`}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</th>
                ))}
                <th className="border border-gray-300 p-2" title="Total shipments for the year">Total</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((report, index) => (
                <tr key={index} className="hover:bg-gray-100 transition">
                  <td className="border border-gray-300 p-2 font-medium">{report.item}</td>
                  {report.monthlyShipments.map((shipment, i) => (
                    <td key={i} className="border border-gray-300 p-2 text-center">{shipment}</td>
                  ))}
                  <td className="border border-gray-300 p-2 font-bold text-darkgreen">
                    {calculateTotal(report.monthlyShipments)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default OutgoingReportList;
