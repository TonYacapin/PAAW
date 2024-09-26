import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MunicipalityAccomplishmentReportRabies = () => {
    const [reportData, setReportData] = useState([]);
    const [year, setYear] = useState(new Date().getFullYear());  // Default to current year
    const [month, setMonth] = useState(new Date().getMonth() + 1);  // Default to current month (getMonth() returns 0-11)

    // Predefined list of municipalities
    const municipalitiesList = [
        "Ambaguio", "Bagabag", "Bayombong", "Diadi", "Quezon", "Solano", 
        "Villaverde", "Alfonso Castañeda", "Aritao", "Bambang", 
        "Dupax del Norte", "Dupax del Sur", "Kayapa", "Kasibu", "Santa Fe"
    ];

    // List of month names
    const monthNames = [
        "January", "February", "March", "April", "May", "June", 
        "July", "August", "September", "October", "November", "December"
    ];

    const fetchData = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/rabies-vaccination-summary?year=${year}&month=${month}`);
            const { currentMonth, previousMonth, total } = response.data;

            // Initialize aggregated data with zero counts for each municipality
            const aggregatedData = {};
            municipalitiesList.forEach(municipality => {
                aggregatedData[municipality] = {
                    municipality,
                    currentMonth: 0,
                    previousMonth: 0,
                    total: 0,
                };
            });

            // Helper function to aggregate counts
            const aggregateCounts = (dataArray, monthType) => {
                dataArray.forEach(item => {
                    const { municipality, count } = item;

                    // Check if municipality exists in the predefined list
                    if (aggregatedData[municipality]) {
                        // Aggregate counts by month type
                        if (monthType === 'currentMonth') {
                            aggregatedData[municipality].currentMonth += count;
                        } else if (monthType === 'previousMonth') {
                            aggregatedData[municipality].previousMonth += count;
                        } else if (monthType === 'total') {
                            aggregatedData[municipality].total += count;
                        }
                    }
                });
            };

            // Aggregate counts for current month, previous month, and total
            aggregateCounts(currentMonth, 'currentMonth');
            aggregateCounts(previousMonth, 'previousMonth');
            aggregateCounts(total, 'total');

            // Convert aggregated data into an array for rendering
            setReportData(Object.values(aggregatedData));
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // Fetch data whenever the year or month changes
    useEffect(() => {
        fetchData();
    }, [year, month]);

    return (
        <div className="p-4">
            <div className="mb-4">
                <label className="mr-2">Year:</label>
                <input 
                    type="number" 
                    value={year} 
                    onChange={(e) => setYear(e.target.value)} 
                    className="border rounded px-2 py-1 mr-4"
                />
                
                <label className="mr-2">Month:</label>
                <select 
                    value={month} 
                    onChange={(e) => setMonth(e.target.value)} 
                    className="border rounded px-2 py-1 mr-4"
                >
                    {monthNames.map((name, index) => (
                        <option key={index + 1} value={index + 1}>{name}</option>
                    ))}
                </select>
            </div>

            {/* Table Title */}
            <h2 className="text-lg font-semibold mb-4">Rabies</h2>

            {/* Scrollable Table */}
            <div className="overflow-x-auto max-h-64">
                <table className="min-w-full table-auto border-collapse border border-gray-200 text-sm">
                    <thead className="sticky top-0 bg-gray-100">
                        <tr>
                            <th className="border border-gray-300 px-2 py-1">Municipality</th>
                            <th className="border border-gray-300 px-2 py-1">Semi Annual Target</th>
                            <th className="border border-gray-300 px-2 py-1">Previous Month</th>
                            <th className="border border-gray-300 px-2 py-1">Current Month</th>
                            <th className="border border-gray-300 px-2 py-1">Total</th>
                            <th className="border border-gray-300 px-2 py-1">%</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reportData.map((item, index) => (
                            <tr key={index}>
                                <td className="border border-gray-300 px-2 py-1">{item.municipality}</td>
                                <td className="border border-gray-300 px-2 py-1"></td> {/* Semi Annual Target (blank for now) */}
                                <td className="border border-gray-300 px-2 py-1">{item.previousMonth}</td>
                                <td className="border border-gray-300 px-2 py-1">{item.currentMonth}</td>
                                <td className="border border-gray-300 px-2 py-1">{item.total}</td>
                                <td className="border border-gray-300 px-2 py-1"></td> {/* Percentage (blank for now) */}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MunicipalityAccomplishmentReportRabies;
