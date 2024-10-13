import React, { useState } from 'react';

function IncomingReportList() {
  // Dummy data for incoming reports
  const [data, setData] = useState([
    {
      item: 'Carabao',
      year: '2024',
      monthlyShipments: [10, 12, 15, 9, 8, 14, 10, 12, 18, 20, 17, 15],
    },
    {
      item: 'Cattle',
      year: '2023',
      monthlyShipments: [20, 18, 22, 25, 21, 19, 24, 22, 20, 17, 23, 26],
    },
    {
      item: 'Swine',
      year: '2024',
      monthlyShipments: [30, 25, 28, 22, 27, 31, 29, 30, 32, 35, 36, 40],
    },
    {
      item: 'Broiler',
      year: '2023',
      monthlyShipments: [15, 14, 16, 20, 18, 22, 24, 20, 21, 23, 19, 17],
    },
    {
      item: 'Table',
      year: '2022',
      monthlyShipments: [50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105],
    },
    {
      item: 'Doc',
      year: '2024',
      monthlyShipments: [5, 10, 15, 5, 8, 12, 10, 11, 13, 10, 9, 8],
    },
    {
      item: 'Culled',
      year: '2022',
      monthlyShipments: [2, 4, 3, 5, 2, 3, 6, 5, 7, 4, 3, 2],
    },
    {
      item: 'Poultry',
      year: '2024',
      monthlyShipments: [40, 35, 30, 45, 50, 55, 52, 58, 60, 62, 65, 70],
    },
    {
      item: 'Pork',
      year: '2023',
      monthlyShipments: [22, 20, 18, 25, 24, 26, 28, 30, 32, 31, 29, 27],
    },
    {
      item: 'Beef',
      year: '2024',
      monthlyShipments: [18, 20, 15, 22, 25, 28, 30, 32, 35, 34, 38, 40],
    },
    {
      item: 'Chicken Dung',
      year: '2024',
      monthlyShipments: [70, 80, 75, 90, 85, 100, 95, 92, 98, 110, 120, 115],
    },
    {
      item: 'Goat',
      year: '2023',
      monthlyShipments: [5, 6, 8, 7, 9, 10, 11, 9, 8, 7, 6, 5],
    },
    {
      item: 'Pullet',
      year: '2022',
      monthlyShipments: [12, 14, 10, 16, 18, 20, 22, 24, 26, 28, 30, 32],
    },
    {
      item: 'Sheep',
      year: '2024',
      monthlyShipments: [3, 5, 7, 4, 6, 8, 5, 4, 3, 5, 6, 7],
    },
    {
      item: 'No. of Shipment',
      year: '2024',
      monthlyShipments: [200, 220, 250, 230, 240, 260, 270, 280, 290, 300, 310, 320],
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

export default IncomingReportList;
