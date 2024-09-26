import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MunicipalityAccomplishmentReportVaccination = () => {
    const [reportData, setReportData] = useState([]);
    const [selectedYear, setSelectedYear] = useState('2024'); // Default year
    const [selectedMonth, setSelectedMonth] = useState('9'); // Default month
    const [selectedSpecies, setSelectedSpecies] = useState('Carabao'); // Default species
    const [loading, setLoading] = useState(false); // Loading state

    // Predefined list of municipalities
    const municipalitiesList = [
        "Aritao", "Alfonso Castañeda", "Ambaguio", "Bagabag", "Bambang", 
        "Bayombong", "Diadi", "Dupax del Norte", "Dupax del Sur", "Kayapa", 
        "Kasibu", "Quezon", "Santa Fe", "Solano", "Villaverde"
    ];

    const fetchData = async (year, month, species) => {
        setLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/vaccination/species-count`, {
                params: { year, month, species }
            });
            const { currentMonth, previousMonth, total } = response.data[0]; // Access the first object of the returned array

            // Initialize aggregated data with zero counts for each municipality
            const aggregatedData = {};
            municipalitiesList.forEach(municipality => {
                aggregatedData[municipality] = {
                    municipality,
                    previousMonth: 0,
                    presentMonth: 0,
                    total: 0,
                };
            });

            // Helper function to aggregate counts
            const aggregateCounts = (dataArray, monthType) => {
                dataArray.forEach(item => {
                    const { municipality } = item;
                    if (aggregatedData[municipality]) {
                        if (item.count) {
                            if (monthType === 'currentMonth') {
                                aggregatedData[municipality].presentMonth += item.count;
                            } else if (monthType === 'previousMonth') {
                                aggregatedData[municipality].previousMonth += item.count;
                            } else if (monthType === 'total') {
                                aggregatedData[municipality].total += item.count;
                            }
                        }
                    }
                });
            };

            // Aggregate current month counts
            aggregateCounts(currentMonth, 'currentMonth');
            // Aggregate previous month counts
            aggregateCounts(previousMonth, 'previousMonth');
            // Aggregate total counts
            aggregateCounts(total, 'total');

            // Convert aggregated data into an array for rendering
            setReportData(Object.values(aggregatedData));
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Automatically fetch data whenever the year, month, or species changes
    useEffect(() => {
        fetchData(selectedYear, selectedMonth, selectedSpecies);
    }, [selectedYear, selectedMonth, selectedSpecies]);

    // Function to get the table title based on selected species
    const getTableTitle = () => {
        switch (selectedSpecies) {
            case 'Carabao':
                return 'HEMOSEP - CARABAO';
            case 'Cattle':
                return 'HEMOSEP - CATTLE';
            case 'Goat/Sheep':
                return 'HEMOSEP - GOAT/SHEEP';
            case 'Poultry':
                return 'NCD - POULTRY';
            case 'Swine':
                return 'HOG CHOLERA';
            default:
                return 'Vaccination Report';
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-md">
            {/* Form to select year, month, and species */}
            <form className="mb-6 bg-gray-100 p-6 rounded-md shadow-sm">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div>
                        <label htmlFor="year" className="block text-sm font-medium text-gray-700">Year</label>
                        <input
                            type="number"
                            id="year"
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="month" className="block text-sm font-medium text-gray-700">Month</label>
                        <select
                            id="month"
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                            {[...Array(12)].map((_, i) => (
                                <option key={i + 1} value={i + 1}>
                                    {new Date(0, i).toLocaleString('default', { month: 'long' })}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="species" className="block text-sm font-medium text-gray-700">Species</label>
                        <select
                            id="species"
                            value={selectedSpecies}
                            onChange={(e) => setSelectedSpecies(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="Carabao">Carabao</option>
                            <option value="Cattle">Cattle</option>
                            <option value="Goat/Sheep">Goat/Sheep</option>
                            <option value="Swine">Swine</option>
                            <option value="Poultry">Poultry</option>
                        </select>
                    </div>
                </div>
            </form>
    
            {/* Display loading spinner or table */}
            {loading ? (
                <div className="flex justify-center items-center h-32">
                    <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div>
                    <span className="ml-2 text-gray-700">Loading...</span>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <h2 className="text-lg font-semibold mb-4">{getTableTitle()}</h2>
                    <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
                        <table className="min-w-full table-auto bg-white border border-gray-200 rounded-lg shadow-md">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Municipality</th>
                                    <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Semi Annual Target</th>
                                    <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Previous Month</th>
                                    <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Present Month</th>
                                    <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                    <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">%</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {reportData.length > 0 ? (
                                    reportData.map((item, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.municipality}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"></td> {/* Semi Annual Target */}
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.previousMonth}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.presentMonth}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.total}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"></td> {/* Percentage */}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-4 text-center text-gray-500">No data available</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
    
};

export default MunicipalityAccomplishmentReportVaccination;
