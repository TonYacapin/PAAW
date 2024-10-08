import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MunicipalityAccomplishmentReportRabies = () => {
    const [reportData, setReportData] = useState([]);
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [semiAnnualTargets, setSemiAnnualTargets] = useState([]);

    const municipalitiesList = [
        "Ambaguio", "Bagabag", "Bayombong", "Diadi", "Quezon", "Solano", 
        "Villaverde", "Alfonso Castañeda", "Aritao", "Bambang", 
        "Dupax del Norte", "Dupax del Sur", "Kayapa", "Kasibu", "Santa Fe"
    ];

    const monthNames = [
        "January", "February", "March", "April", "May", "June", 
        "July", "August", "September", "October", "November", "December"
    ];

    const fetchData = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/rabies-vaccination-summary?year=${year}&month=${month}`);
            const { currentMonth, previousMonth, total } = response.data;

            const aggregatedData = {};
            municipalitiesList.forEach(municipality => {
                aggregatedData[municipality] = {
                    municipality,
                    currentMonth: 0,
                    previousMonth: 0,
                    total: 0,
                };
            });

            const aggregateCounts = (dataArray, monthType) => {
                dataArray.forEach(item => {
                    const { municipality, count } = item;
                    if (aggregatedData[municipality]) {
                        aggregatedData[municipality][monthType] += count;
                    }
                });
            };

            aggregateCounts(currentMonth, 'currentMonth');
            aggregateCounts(previousMonth, 'previousMonth');
            aggregateCounts(total, 'total');

            setReportData(Object.values(aggregatedData));
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

     // Fetch the semi-annual targets
     const fetchSemiAnnualTargets = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/mtargets`, {
                params: { targetYear: year, type: "RABIES"}
            });
            const targets = response.data;
            const targetsMap = {};

            // Map the semi-annual target data by municipality
            targets.forEach(target => {
                targetsMap[target.municipality] = target.semiAnnualTarget;
            });

            setSemiAnnualTargets(targetsMap);
        } catch (error) {
            console.error('Error fetching semi-annual targets:', error);
        }
    };

    useEffect(() => {
        fetchData();
        fetchSemiAnnualTargets(); 
    }, [year, month]);

    const calculateGrandTotals = () => {
        return reportData.reduce((totals, item) => {
            totals.currentMonth += item.currentMonth;
            totals.previousMonth += item.previousMonth;
            totals.total += item.total;
            return totals;
        }, { currentMonth: 0, previousMonth: 0, total: 0 });
    };

    const grandTotals = calculateGrandTotals();

    return (
        <>
    <div className="max-h-[55vh] overflow-y-hidden">
        
    <h1 className="text-xl font-semibold text-gray-700">
        Municipality Rabies Vaccination Accomplishment Report
      </h1>
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

            <h2 className="text-lg font-semibold mb-4">Rabies</h2>

            <div className="overflow-x-auto max-h-64">
                <table className="min-w-full bg-white border border-[#1b5b40] rounded-lg shadow-lg">
                    <thead className="sticky top-0 bg-[#1b5b40] text-white">
                        <tr>
                            <th className="border border-gray-300 px-2 py-1">Municipality</th>
                            <th className="border border-gray-300 px-2 py-1">Semi Annual Target</th>
                            <th className="border border-gray-300 px-2 py-1">Previous Month</th>
                            <th className="border border-gray-300 px-2 py-1">Current Month</th>
                            <th className="border border-gray-300 px-2 py-1">Total</th>
                            <th className="border border-gray-300 px-2 py-1">%</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                                        {reportData.length > 0 ? (
                                            reportData.map((item, index) => {
                                                const semiAnnualTarget = semiAnnualTargets[item.municipality] || 0;
                                                const percentage = semiAnnualTarget > 0 ? ((item.total / semiAnnualTarget) * 100).toFixed(2) : 'N/A';

                                                return (
                                                    <tr key={index} className="hover:bg-gray-50">
                                                        <td className="border border-gray-300 px-2 py-1">{item.municipality}</td>
                                                        <td className="py-2 px-4 border-b">{semiAnnualTarget}</td>
                                                        <td className="border border-gray-300 px-2 py-1">{item.previousMonth}</td>
                                                        <td className="border border-gray-300 px-2 py-1">{item.currentMonth}</td>
                                                        <td className="border border-gray-300 px-2 py-1">{item.total}</td>
                                                        <td className="border border-gray-300 px-2 py-1">{percentage}</td> {/* Percentage */}
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="text-center py-4">No data available</td>
                                            </tr>
                                        )}
                                    </tbody>

                    <tfoot className="sticky bottom-0 bg-[#ffe356] font-bold text-[#1b5b40]">
                        <tr className="font-semibold">
                            <td className="border border-gray-300 px-2 py-1">Grand Total</td>
                            <td className="border border-gray-300 px-2 py-1"></td>
                            <td className="border border-gray-300 px-2 py-1">{grandTotals.previousMonth}</td>
                            <td className="border border-gray-300 px-2 py-1">{grandTotals.currentMonth}</td>
                            <td className="border border-gray-300 px-2 py-1">{grandTotals.total}</td>
                            <td className="border border-gray-300 px-2 py-1"></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    </div>

        </>
        
    );
};

export default MunicipalityAccomplishmentReportRabies;
