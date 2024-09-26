// MunicipalityAccomplishmentReportRoutineServices.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MunicipalityAccomplishmentReportRoutineServices = () => {
    const [reportData, setReportData] = useState([]);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedSpecies, setSelectedSpecies] = useState('Swine'); // Default to 'Swine'
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const municipalitiesList = [
        "Aritao", "Alfonso Castañeda", "Ambaguio", "Bagabag", "Bambang", 
        "Bayombong", "Diadi", "Dupax del Norte", "Dupax del Sur", "Kayapa", 
        "Kasibu", "Quezon", "Santa Fe", "Solano", "Villaverde"
    ];

    const fetchData = async (year, month, species) => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/routine-services/species-count`, {
                params: { year, month, species }
            });
            console.log(response.data);

            const { currentMonth, previousMonth, total } = response.data[0];

            const aggregatedData = municipalitiesList.reduce((acc, municipality) => {
                acc[municipality] = { municipality, previousMonth: 0, presentMonth: 0, total: 0 };
                return acc;
            }, {});

            const aggregateCounts = (dataArray, monthType) => {
                dataArray.forEach(item => {
                    const { municipality, count } = item;
                    if (aggregatedData[municipality] && count) {
                        aggregatedData[municipality][monthType] += count;
                    }
                });
            };

            aggregateCounts(currentMonth, 'presentMonth');
            aggregateCounts(previousMonth, 'previousMonth');
            aggregateCounts(total, 'total');

            console.log("Aggregated Report Data:", Object.values(aggregatedData));

            setReportData(Object.values(aggregatedData));
        } catch (error) {
            setError('Failed to fetch data. Please try again later.');
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchData(selectedYear, selectedMonth, selectedSpecies);
    }, [selectedYear, selectedMonth, selectedSpecies]);

    const getTableTitle = () => {
        switch (selectedSpecies) {
            case 'Swine': return 'Routine Services - SWINE';
            case 'Poultry': return 'Routine Services - Poultry';
            case 'Others': return 'Routine Services - Others';
            case 'Dog': return 'Routine Services - DOG';
            default: return 'Routine Services Report';
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <form className="mb-6 bg-gray-100 p-6 rounded-md shadow-sm">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div>
                        <label htmlFor="year" className="block text-sm font-medium text-gray-700">Year</label>
                        <input
                            type="number"
                            id="year"
                            value={selectedYear}
                            min="2000" // Assuming a reasonable minimum year
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
                                <option key={i + 1} value={i + 1}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>
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
                            <option value="Swine">Swine</option>
                    
                            <option value="Poultry">Poultry</option>
                            <option value="Dog">Dog</option>
                            <option value="Others">Others</option>
                        </select>
                    </div>
                </div>
            </form>

            {loading ? (
                <div className="flex justify-center items-center h-32">
                    <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div>
                    <span className="ml-2 text-gray-700">Loading...</span>
                </div>
            ) : error ? (
                <div className="text-red-500 text-center">{error}</div>
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
                                {reportData.map((item, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.municipality}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"></td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.previousMonth}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.presentMonth}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.total}</td>
                                        <td className="border border-gray-300 px-2 py-1"></td> {/* Percentage (blank for now) */}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MunicipalityAccomplishmentReportRoutineServices;
