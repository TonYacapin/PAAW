import React, { useState, useEffect } from "react";
import axiosInstance from "../../component/axiosInstance";

import placeholder1 from "../../pages/assets/NVLOGO.png";
import placeholder2 from "../../pages/assets/ReportLogo2.png";

function IncomingReportList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Year filter state
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Generate array of years for dropdown (e.g., last 10 years)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(`/api/vetshipform`);
        setData(response.data);
      } catch (err) {
        console.error("Error fetching data:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter data by year
  const filterDataByYear = (shipments, year) => {
    return shipments.filter((shipment) => {
      const shipmentDate = new Date(shipment.date);
      return shipmentDate.getFullYear() === parseInt(year);
    });
  };

  // Process shipment data: sum up all incoming shipments per month
  const getFilteredIncomingShipmentsByMonth = () => {
    const filteredShipments = filterDataByYear(data, selectedYear);

    // Array to hold data for each month
    const incomingShipmentsByMonth = Array(12)
      .fill(null)
      .map(() => ({
        Carabao: 0,
        Cattle: 0,
        Swine: 0,
        Horse: 0,
        Chicken: 0,
        Duck: 0,
        Other: 0,
      }));

    filteredShipments.forEach((shipment) => {
      if (shipment.shipmentType === "Incoming") {
        const shipmentDate = new Date(shipment.date);
        const monthIndex = shipmentDate.getMonth();
        const liveAnimals = shipment.liveAnimals || {};

        // Accumulate counts for each animal type in the appropriate month
        incomingShipmentsByMonth[monthIndex].Carabao +=
          liveAnimals.Carabao || 0;
        incomingShipmentsByMonth[monthIndex].Cattle += liveAnimals.Cattle || 0;
        incomingShipmentsByMonth[monthIndex].Swine += liveAnimals.Swine || 0;
        incomingShipmentsByMonth[monthIndex].Horse += liveAnimals.Horse || 0;
        incomingShipmentsByMonth[monthIndex].Chicken +=
          liveAnimals.Chicken || 0;
        incomingShipmentsByMonth[monthIndex].Duck += liveAnimals.Duck || 0;
        incomingShipmentsByMonth[monthIndex].Other += liveAnimals.Other || 0;
      }
    });

    return incomingShipmentsByMonth;
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");

    printWindow.document.write(`
        <html>
            <head>
                <title>Incoming Report</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 0;
                        padding: 20px;
                        background-color: #fff;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                    }
                    .header {
                        text-align: center;
                        margin-bottom: 20px;
                    }
                    .header img {
                        width: 50px;
                        height: auto;
                        margin: 0 5px;
                    }
                    .header .logo-container {
                        display: flex;
                        justify-content: space-between;
                        width: 100%;
                        max-width: 800px;
                    }
                    .title {
                        font-size: 16px;
                        font-weight: bold;
                        margin: 5px 0;
                    }
                    .subtitle {
                        font-size: 14px;
                        font-weight: bold;
                        margin: 5px 0;
                    }
                    table {
                        width: 90%;
                        border-collapse: collapse;
                        margin-top: 20px;
                    }
                    th, td {
                        border: 1px solid black;
                        padding: 6px;
                        text-align: center;
                        font-size: 12px;
                    }
                    th {
                        background-color: #f2f2f2;
                        font-weight: bold;
                    }
                    .footer {
                        margin-top: auto;
                        margin-bottom: 20px;
                        width: 100%;
                    }
                    .signature {
                        margin-top: 30px;
                        border-top: 1px solid black;
                        width: 180px;
                        margin: 0 auto;
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="logo-container">
                        <img src="${placeholder1}" alt="Left Logo" />
                        <img src="${placeholder2}" alt="Right Logo" />
                    </div>
                    <div style="text-align: center; margin-top: 10px;">
                        <p style="font-size: 12px; margin: 5px 0;">Republic of the Philippines</p>
                        <h1 class="title">PROVINCE OF NUEVA VIZCAYA</h1>
                        <h2 class="subtitle">PROVINCIAL VETERINARY SERVICES OFFICE</h2>
                        <p class="subtitle" style="font-size: 12px; margin: 5px 0;">3rd floor Agriculture Bldg, Capitol Compound, District IV, Bayombong, Nueva Vizcaya</p>
                    </div>
                </div>
                <h1 class="title">ANNUAL INCOMING REPORT ${selectedYear}</h1>
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
                        ${getFilteredIncomingShipmentsByMonth()
                          .map((monthlyShipments, index) => {
                            const total = Object.values(
                              monthlyShipments
                            ).reduce((acc, count) => acc + count, 0);
                            return `
                                <tr>
                                    <td>${new Date(0, index).toLocaleString(
                                      "default",
                                      { month: "long" }
                                    )}</td>
                                    <td>${monthlyShipments.Carabao}</td>
                                    <td>${monthlyShipments.Cattle}</td>
                                    <td>${monthlyShipments.Swine}</td>
                                    <td>${monthlyShipments.Horse}</td>
                                    <td>${monthlyShipments.Chicken}</td>
                                    <td>${monthlyShipments.Duck}</td>
                                    <td>${monthlyShipments.Other}</td>
                                    <td>${total}</td>
                                </tr>
                            `;
                          })
                          .join("")}
                    </tbody>
                </table>
            </body>
        </html>
    `);

    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.print();
      printWindow.close();
    };
  };

  if (loading)
    return (
      <div className="flex items-center justify-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  if (error) return <div>Error: {error}</div>;

  const incomingShipmentsByMonth = getFilteredIncomingShipmentsByMonth();

  return (
    <div className="p-4 bg-white rounded shadow-md">
      <h1 className="text-2xl font-bold text-black mb-8">
        Incoming Report List
      </h1>

      <div className="mb-4">
        <label className="mr-2">Select Year:</label>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          className="p-2 border rounded"
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handlePrint}
        className="mb-4 bg-darkgreen text-white p-2 rounded"
      >
        Print Report
      </button>

      {incomingShipmentsByMonth.every((month) =>
        Object.values(month).every((count) => count === 0)
      ) ? (
        <div>No shipments found for the selected year.</div>
      ) : (
        <div className="overflow-x-auto border rounded-lg">
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
                <th className="border border-gray-300 p-2 bg-darkerpastelyellow">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {incomingShipmentsByMonth.map((monthlyShipments, index) => {
                const total = Object.values(monthlyShipments).reduce(
                  (acc, count) => acc + count,
                  0
                );
                return (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="border border-gray-300 p-2">
                      {new Date(0, index).toLocaleString("default", {
                        month: "long",
                      })}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {monthlyShipments.Carabao}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {monthlyShipments.Cattle}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {monthlyShipments.Swine}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {monthlyShipments.Horse}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {monthlyShipments.Chicken}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {monthlyShipments.Duck}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {monthlyShipments.Other}
                    </td>
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
