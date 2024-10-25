import React, { useState, useEffect } from 'react';
import axiosInstance from '../component/axiosInstance';

const MonthlyAccomplishmentReportUpgradingServices = () => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState({
        municipality: '',
        activity: '',
        clientName: '',
        month: '',
        year: ''
    });

    // Fetch data from the API
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axiosInstance.get('/api/upgrading-services', {
                    params: { formStatus: 'Accepted' } // Add query parameter for filtering
                  });
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
            const matchesActivity = item.entries.some(entry => entry.activity.toLowerCase().includes(filter.activity.toLowerCase()));
            const matchesClientName = item.entries.some(entry => 
                `${entry.clientInfo.firstName} ${entry.clientInfo.lastName}`.toLowerCase().includes(filter.clientName.toLowerCase())
            );

            // Check if month and year match
            const matchesMonth = filter.month ? new Date(item.dateReported).getMonth() + 1 === parseInt(filter.month) : true;
            const matchesYear = filter.year ? new Date(item.dateReported).getFullYear() === parseInt(filter.year) : true;

            return matchesMunicipality && matchesActivity && matchesClientName && matchesMonth && matchesYear;
        });

        setFilteredData(filtered);
    }, [filter, data]);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Accomplishment Report Upgrading Services</h1>

            {/* Loading Indicator */}
            {loading ? (
                <p className="text-center text-black-500">Loading data...</p>
            ) : (
                <>
                    {/* Filter Section */}
                    <div className="grid grid-cols-3 gap-4 mb-8">
                        <label className="flex flex-col">
                            <span className="text-sm font-semibold mb-1">Municipality:</span>
                            <input 
                                type="text" 
                                name="municipality" 
                                value={filter.municipality}
                                onChange={handleFilterChange}
                                className="p-2 border border-black rounded-md shadow-sm"
                                placeholder="Filter by municipality" 
                            />
                        </label>
                        <label className="flex flex-col">
                            <span className="text-sm font-semibold mb-1">Activity:</span>
                            <input 
                                type="text" 
                                name="activity" 
                                value={filter.activity}
                                onChange={handleFilterChange}
                                className="p-2 border border-black rounded-md shadow-sm"
                                placeholder="Filter by activity" 
                            />
                        </label>
                        <label className="flex flex-col">
                            <span className="text-sm font-semibold mb-1">Client Name:</span>
                            <input 
                                type="text" 
                                name="clientName" 
                                value={filter.clientName}
                                onChange={handleFilterChange}
                                className="p-2 border border-black rounded-md shadow-sm"
                                placeholder="Filter by client name" 
                            />
                        </label>
                        <label className="flex flex-col">
                            <span className="text-sm font-semibold mb-1">Month:</span>
                            <select 
                                name="month" 
                                value={filter.month}
                                onChange={handleFilterChange}
                                className="p-2 border border-black rounded-md shadow-sm"
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
                                className="p-2 border border-black rounded-md shadow-sm"
                                placeholder="Filter by year" 
                            />
                        </label>
                    </div>

                    {/* Data Summary */}
                    <div className="bg-white p-4 mb-6 shadow-md rounded-md">
                        <p className="font-semibold text-black">Total Entries: {filteredData.reduce((acc, item) => acc + item.entries.length, 0)}</p>
                        <p className="font-semibold text-black">Total Municipalities: {filteredData.length}</p>
                    </div>

                    {/* Table Data */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white rounded-md shadow-md">
                            <thead>
                                <tr className=" bg-darkgreen text-white text-sm leading-normal">
                                    <th className="py-3 px-6 text-left">No.</th>
                                    <th className="py-3 px-6 text-left">Municipality</th>
                                    <th className="py-3 px-6 text-left">Date Reported</th>
                                    <th className="py-3 px-6 text-left">Barangay</th>
                                    <th className="py-3 px-6 text-left">Activity</th>
                                    <th className="py-3 px-6 text-left">Species</th>
                                    <th className="py-3 px-6 text-left">Sex</th>
                                    <th className="py-3 px-6 text-left">Age</th>
                                    <th className="py-3 px-6 text-left">Client Name</th>
                                    <th className="py-3 px-6 text-left">Gender</th>
                                    <th className="py-3 px-6 text-left">Date</th>
                                    <th className="py-3 px-6 text-left">Sire Code</th>
                                    <th className="py-3 px-6 text-left">Remarks</th>
                                </tr>
                            </thead>
                            <tbody className="text-black text-sm">
                                {filteredData.map((item, index) => (
                                    item.entries && Array.isArray(item.entries) && item.entries.map((entry, entryIndex) => (
                                        <tr key={`${item._id}-${entryIndex}`} className="border-b border-black-200 hover:bg-black-100">
                                            <td className="py-3 px-6">{index + 1}</td>
                                            <td className="py-3 px-6">{item.municipality}</td>
                                            <td className="py-3 px-6">{new Date(item.dateReported).toLocaleDateString()}</td>
                                            <td className="py-3 px-6">{entry.barangay}</td>
                                            <td className="py-3 px-6">{entry.activity}</td>
                                            <td className="py-3 px-6">{entry.animalInfo?.species}</td>
                                            <td className="py-3 px-6">{entry.animalInfo?.sex}</td>
                                            <td className="py-3 px-6">{entry.animalInfo?.age}</td>
                                            <td className="py-3 px-6">{`${entry.clientInfo?.firstName} ${entry.clientInfo?.lastName}`}</td>
                                            <td className="py-3 px-6">{entry.clientInfo?.gender}</td>
                                            <td className="py-3 px-6">{new Date(entry.date).toLocaleDateString()}</td>
                                            <td className="py-3 px-6">{entry.sireCodeNum}</td>
                                            <td className="py-3 px-6">{entry.remarks}</td>
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

export default MonthlyAccomplishmentReportUpgradingServices;
