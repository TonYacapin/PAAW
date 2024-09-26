import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MunicipalityAccomplishmentReportRabies = () => {
    const [reportData, setReportData] = useState([]);

    // Predefined list of municipalities
    const municipalitiesList = [
        "Ambaguio", "Bagabag", "Bayombong", "Diadi", "Quezon", "Solano", 
        "Villaverde", "Alfonso Castañeda", "Aritao", "Bambang", 
        "Dupax del Norte", "Dupax del Sur", "Kayapa", "Kasibu", "Santa Fe"
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/rabies-vaccination-summary?year=2024&month=10');
                const { currentMonth, previousMonth, total } = response.data;

                // Initialize aggregated data with zero counts for each municipality
                const aggregatedData = {};
                municipalitiesList.forEach(municipality => {
                    aggregatedData[municipality] = {
                        municipality,
                        currentMonth: 0,
                        previousMonth: 0,
                        total: 0,
                        speciesVaccines: {}, // To store species and vaccine information
                    };
                });

                // Helper function to aggregate counts
                const aggregateCounts = (dataArray, monthType) => {
                    dataArray.forEach(item => {
                        const { municipality, species, vaccine, count } = item;

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

                            // Store species and vaccine data for detailed info
                            if (!aggregatedData[municipality].speciesVaccines[species]) {
                                aggregatedData[municipality].speciesVaccines[species] = {};
                            }
                            aggregatedData[municipality].speciesVaccines[species][vaccine] = count;
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

        fetchData();
    }, []);

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-200">
                <thead>
                    <tr>
                        <th className="border border-gray-300 px-4 py-2">Municipality</th>
                        <th className="border border-gray-300 px-4 py-2">Species & Vaccines</th>
                        <th className="border border-gray-300 px-4 py-2">Previous Month</th>
                        <th className="border border-gray-300 px-4 py-2">Current Month</th>
                        <th className="border border-gray-300 px-4 py-2">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {reportData.map((item, index) => (
                        <tr key={index}>
                            <td className="border border-gray-300 px-4 py-2">{item.municipality}</td>
                            <td className="border border-gray-300 px-4 py-2">
                                {/* Render species and vaccines data */}
                                {Object.entries(item.speciesVaccines).map(([species, vaccines], idx) => (
                                    <div key={idx}>
                                        <strong>{species}:</strong>
                                        <ul>
                                            {Object.entries(vaccines).map(([vaccine, count], vIdx) => (
                                                <li key={vIdx}>{vaccine}: {count}</li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">{item.previousMonth}</td>
                            <td className="border border-gray-300 px-4 py-2">{item.currentMonth}</td>
                            <td className="border border-gray-300 px-4 py-2">{item.total}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MunicipalityAccomplishmentReportRabies;
