import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MonthAccomplishmentReportCalfDrop = () => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState({
        municipality: '',
        technicianName: '',
        month: '',
        year: ''
    });

    // Fetch data from the API
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/technician-quarterly`);
                setData(response.data);
                setFilteredData(response.data); // Initialize filtered data
            } catch (error) {
                console.error('Error fetching data:', error);
            }
            setLoading(false);
        };

        fetchData();
    }, []);

    // Handle filtering logic
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilter({
            ...filter,
            [name]: value
        });
    };

    // Apply filters whenever the filter state changes
    useEffect(() => {
        const filtered = data.filter((item) => {
            const matchesMunicipality = item.municipality.toLowerCase().includes(filter.municipality.toLowerCase());
            const matchesTechnicianName = item.technicianName.toLowerCase().includes(filter.technicianName.toLowerCase());

            // Check if month and year match
            const matchesMonth = filter.month ? new Date(item.dateSubmitted).getMonth() + 1 === parseInt(filter.month) : true;
            const matchesYear = filter.year ? new Date(item.dateSubmitted).getFullYear() === parseInt(filter.year) : true;

            return matchesMunicipality && matchesTechnicianName && matchesMonth && matchesYear;
        });

        setFilteredData(filtered);
    }, [filter, data]);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-8">Technician Quarterly Report</h1>

            {/* Loading Indicator */}
            {loading ? (
                <p className="text-center text-black-500">Loading data...</p>
            ) : (
                <>
                    {/* Filter Section */}
                    <div className="flex flex-col md:flex-row gap-4 mb-8">
                        <label className="flex flex-col">
                            <span className="text-sm font-semibold mb-1">Municipality:</span>
                            <input 
                                type="text" 
                                name="municipality" 
                                value={filter.municipality}
                                onChange={handleFilterChange}
                                className="p-2 border border-black-300 rounded-md shadow-sm"
                                placeholder="Filter by municipality" 
                            />
                        </label>
                        <label className="flex flex-col">
                            <span className="text-sm font-semibold mb-1">Technician Name:</span>
                            <input 
                                type="text" 
                                name="technicianName" 
                                value={filter.technicianName}
                                onChange={handleFilterChange}
                                className="p-2 border border-black-300 rounded-md shadow-sm"
                                placeholder="Filter by technician name" 
                            />
                        </label>
                        <label className="flex flex-col">
                            <span className="text-sm font-semibold mb-1">Month:</span>
                            <select 
                                name="month" 
                                value={filter.month}
                                onChange={handleFilterChange}
                                className="p-2 border border-black-300 rounded-md shadow-sm"
                            >
                                <option value="">All Months</option>
                                {Array.from({ length: 12 }, (_, i) => (
                                    <option key={i + 1} value={i + 1}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>
                                ))}
                            </select>
                        </label>
                        <label className="flex flex-col">
                            <span className="text-sm font-semibold mb-1">Year:</span>
                            <input 
                                type="number" 
                                name="year" 
                                value={filter.year}
                                onChange={handleFilterChange}
                                className="p-2 border border-black-300 rounded-md shadow-sm"
                                placeholder="Filter by year" 
                            />
                        </label>
                    </div>

                    {/* Data Summary */}
                    <div className="bg-white p-4 mb-6 shadow-md rounded-md">
                        <p className="font-semibold text-black-700">Total Entries: {filteredData.reduce((acc, item) => acc + item.animalEntries.length, 0)}</p>
                        <p className="font-semibold text-black-700">Total Municipalities: {filteredData.length}</p>
                    </div>

                    {/* Table Data */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white rounded-md shadow-md">
                            <thead>
                                <tr className="bg-darkgreen text-white text-sm leading-normal">
                                    <th className="py-3 px-6 text-left">Technician Name</th>
                                    <th className="py-3 px-6 text-left">Municipality</th>
                                    <th className="py-3 px-6 text-left">Province</th>
                                    <th className="py-3 px-6 text-left">Date Submitted</th>
                                    <th className="py-3 px-6 text-left">Remarks</th>
                                    <th className="py-3 px-6 text-left">Farmer Name</th>
                                    <th className="py-3 px-6 text-left">Breed</th>
                                    <th className="py-3 px-6 text-left">Sex</th>
                                    <th className="py-3 px-6 text-left">Date of AI</th>
                                    <th className="py-3 px-6 text-left">Date Calved</th>
                                </tr>
                            </thead>
                            <tbody className="text-black-600 text-sm">
                                {filteredData.map((item, index) => (
                                    item.animalEntries && Array.isArray(item.animalEntries) && item.animalEntries.map((entry, entryIndex) => (
                                        <tr key={`${item._id}-${entryIndex}`} className="border-b border-black-200 hover:bg-black-100">
                                            <td className="py-3 px-6">{item.technicianName}</td>
                                            <td className="py-3 px-6">{item.municipality}</td>
                                            <td className="py-3 px-6">{item.province}</td>
                                            <td className="py-3 px-6">{new Date(item.dateSubmitted).toLocaleDateString()}</td>
                                            <td className="py-3 px-6">{item.remarks}</td>
                                            <td className="py-3 px-6">{entry.farmerName}</td>
                                            <td className="py-3 px-6">{entry.breed}</td>
                                            <td className="py-3 px-6">{entry.sex}</td>
                                            <td className="py-3 px-6">{new Date(entry.dateOfAI).toLocaleDateString()}</td>
                                            <td className="py-3 px-6">{new Date(entry.dateCalved).toLocaleDateString()}</td>
                                        </tr>
                                    ))
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
};

export default MonthAccomplishmentReportCalfDrop;
