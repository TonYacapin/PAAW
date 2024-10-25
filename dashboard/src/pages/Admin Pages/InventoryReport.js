import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from '../../component/axiosInstance';

import placeholder1 from '../../pages/assets/NVLOGO.png';
import placeholder2 from '../../pages/assets/ReportLogo2.png';

const InventoryReport = () => {
    const [inventories, setInventories] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const printRef = useRef(); // Create a ref for the printable section

    useEffect(() => {
        fetchInventories();
    }, []);

    const fetchInventories = async () => {
        try {
            const response = await axiosInstance.get('/api/inventory');
            setInventories(response.data);
        } catch (error) {
            console.error('Error fetching inventories:', error);
        }
    };

    const formattedDate = currentDate.toLocaleString('en-US', {
        month: 'long',
        year: 'numeric'
    });
    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Inventory Report</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif; 
                            margin: 0; 
                            padding: 20px; 
                            background-color: #fff; 
                            display: flex; 
                            flex-direction: column; 
                            align-items: center; 
                            position: relative; /* Enable positioning */
                        }
                        .header {
                            text-align: center; 
                            margin-bottom: 20px;
                            width: 100%;
                        }
                        .header img {
                            width: 50px; /* Adjusted size for logos */
                            height: auto;
                            margin: 0 5px; /* Margins for logos */
                        }
                        .header .logo-container {
                            display: flex; 
                            justify-content: space-between; 
                            width: 100%; 
                            max-width: 800px; /* Max width for logos */
                        }
                        .title {
                            font-size: 16px; /* Smaller font size for title */
                            font-weight: bold; 
                            margin: 5px 0; 
                        }
                        .subtitle {
                            font-size: 14px; /* Smaller font size for subtitles */
                            font-weight: bold; 
                            margin: 5px 0;
                        }
                        table {
                            width: 90%; /* Centering the table */
                            border-collapse: collapse; 
                            margin-top: 20px;
                        }
                        th, td {
                            border: 1px solid black; 
                            padding: 6px; /* Smaller padding */
                            text-align: center; 
                            font-size: 12px; /* Smaller font size for table content */
                        }
                        th {
                            background-color: #f2f2f2; 
                            font-weight: bold;
                        }
                        .footer {
                            position: relative; /* Change to relative to avoid page break */
                            display: flex; 
                            justify-content: space-around; 
                            margin-top: auto; /* Push the footer to the bottom */
                            margin-bottom: 20px; /* Space from the bottom of the page */
                            width: 100%;
                        }
                        .signature {
                            margin-top: 30px; /* Reduced margin */
                            border-top: 1px solid black; 
                            width: 180px; /* Adjusted width */
                            margin: 0 auto;
                        }
                    </style>
                </head>
                <body onload="window.print(); window.close();">
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
                    <h1 class="title">MONTHLY INVENTORY and UTILIZATION REPORT</h1>
                    <h2 class="subtitle">SUPPLIES</h2>
                    <p style="font-size: 12px;">As of ${formattedDate}</p>
                    <table>
                        <thead>
                            <tr>
                                <th>Supplies</th>
                                <th>UNIT</th>
                                <th>QTY</th>
                                <th>OUT</th>
                                <th>TOTAL</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${inventories.map(item => `
                                <tr>
                                    <td>${item.supplies}${item.description ? `<br><span style="font-size: 9px; color: gray;">${item.description}</span>` : ''}</td>
                                    <td>${item.unit}</td>
                                    <td>${item.quantity}</td>
                                    <td>${item.out}</td>
                                    <td>${item.total}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                  
                </body>
            </html>
        `);
        printWindow.document.close();
    };



    return (
        <div className="w-full max-w-4xl mx-auto p-8 bg-white">
            <div className="text-center mb-6" ref={printRef}>
                {/* Header Section */}
                <p className="text-sm">Republic of the Philippines</p>
                <div className="flex justify-center items-center gap-4 my-4">
                    <img src={placeholder1} alt="Left Logo" className="w-16 h-16" />
                    <div className="text-center">
                        <p className="font-bold">PROVINCE OF NUEVA VIZCAYA</p>
                        <p className="font-bold">PROVINCIAL VETERINARY SERVICES OFFICE</p>
                        <p className="text-sm italic">3rd floor Agriculture Bldg, Capitol Compound, District IV, Bayombong, Nueva Vizcaya</p>
                    </div>
                    <img src={placeholder2} alt="Right Logo" className="w-16 h-16" />
                </div>
                <div className="text-center mt-6 mb-4">
                    <p className="font-bold">MONTHLY INVENTORY and UTILIZATION REPORT</p>
                    <p className="font-bold">SUPPLIES</p>
                    <p>As of {formattedDate}</p>
                </div>

                {/* Table Section */}
                <table className="w-full border-collapse border border-black">
                    <thead>
                        <tr>
                            <th className="border border-black p-2 text-left bg-white font-bold">Supplies</th>
                            <th className="border border-black p-2 text-center bg-white font-bold w-24">UNIT</th>
                            <th className="border border-black p-2 text-center bg-white font-bold w-24">QTY</th>
                            <th className="border border-black p-2 text-center bg-white font-bold w-24">OUT</th>
                            <th className="border border-black p-2 text-center bg-white font-bold w-24">TOTAL</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inventories.map((item, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                                <td className="border border-black p-2 text-sm">
                                    {item.supplies}
                                    {item.description && (
                                        <span className="text-xs text-gray-600 italic ml-1">
                                            {item.description}
                                        </span>
                                    )}
                                </td>
                                <td className="border border-black p-2 text-center text-sm">{item.unit}</td>
                                <td className="border border-black p-2 text-center text-sm">{item.quantity}</td>
                                <td className="border border-black p-2 text-center text-sm">{item.out}</td>
                                <td className="border border-black p-2 text-center text-sm">{item.total}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>


            </div>

            {/* Print Button */}
            <div className="text-center mt-8">
                <button
                    onClick={handlePrint}
                    className="flex items-center bg-darkgreen text-white py-2 px-4 rounded-md shadow-sm hover:bg-darkergreen transition-colors"
                >
                    Print Report
                </button>
            </div>
        </div>
    );
};

export default InventoryReport;
