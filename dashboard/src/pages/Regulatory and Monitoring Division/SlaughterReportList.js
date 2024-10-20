import React, { useState, useEffect } from 'react';
import axiosInstance from '../../component/axiosInstance';
import Modal from '../../component/Modal';
import SlaughterReportForm from './SlaughterReportForm';

function SlaughterReportList() {
    const municipalities = [
        'Bagabag', 'Bayombong', 'Solano', 'Villaverde', 'Aritao', 'Bambang', 'Dupax del Norte',
    ];

    const animals = ['Cattle', 'Carabao', 'Goat', 'Sheep', 'Hog', 'Chicken'];

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filterVisible, setFilterVisible] = useState(true);
    const [filter, setFilter] = useState({
        animal: '',
        municipality: '',
        month: '',
        year: '',
    });
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const fetchSlaughterReports = async () => {
        try {
            const response = await axiosInstance.get(`/api/slaughterform`);
            const fetchedReports = response.data;
    
            // Flatten the API data to match the table structure
            const processedReports = fetchedReports.flatMap(report =>
                report.slaughterAnimals.map(animal => ({
                    id: report._id,
                    municipality: report.municipality,
                    month: report.month.toString(), // Ensure month is a string for matching
                    year: report.year.toString(),  // Ensure year is a string for matching
                    animal: animal.name,
                    number: animal.number,
                    weight: parseInt(animal.weight, 10),  // Convert weight to integer
                }))
            );
    
            setReports(processedReports);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching slaughter reports:", error);
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchSlaughterReports();
    }, []);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilter({ ...filter, [name]: value });
    };

    const filteredReports = reports.filter((report) => {
        const matchesAnimal = filter.animal ? report.animal === filter.animal : true;
        const matchesMunicipality = filter.municipality ? report.municipality === filter.municipality : true;
        const matchesMonth = filter.month ? report.month === filter.month : true;
        const matchesYear = filter.year ? report.year === filter.year : true;
        return matchesAnimal && matchesMunicipality && matchesMonth && matchesYear;
    });

    const toggleFilterVisibility = () => setFilterVisible(!filterVisible);

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-darkgreen text-center mb-8">Slaughter Report List</h1>

            {/* Collapsible Filter Section */}
            <div className="mb-4">
                <button
                    onClick={toggleFilterVisibility}
                    className="bg-darkgreen text-white py-2 px-4 rounded-lg shadow-md focus:outline-none"
                >
                    {filterVisible ? 'Hide Filters' : 'Show Filters'}
                </button>
                {filterVisible && (
                    <div className="mt-4 p-4 bg-white rounded-lg shadow-lg grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Animal</label>
                            <select
                                name="animal"
                                value={filter.animal}
                                onChange={handleFilterChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            >
                                <option value="">All Animals</option>
                                {animals.map((animal) => (
                                    <option key={animal} value={animal}>
                                        {animal}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Municipality</label>
                            <select
                                name="municipality"
                                value={filter.municipality}
                                onChange={handleFilterChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            >
                                <option value="">All Municipalities</option>
                                {municipalities.map((municipality) => (
                                    <option key={municipality} value={municipality}>
                                        {municipality}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
                            <input
                                type="number"
                                name="month"
                                value={filter.month}
                                onChange={handleFilterChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                placeholder="Month"
                                min="1"
                                max="12"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                            <input
                                type="number"
                                name="year"
                                value={filter.year}
                                onChange={handleFilterChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                placeholder="Year"
                                min="1900"
                                max="2100"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Analysis Section */}
            <div className="mb-6 p-4 bg-white rounded-lg shadow-md">
                <h2 className="text-lg font-medium text-darkgreen">Analysis</h2>
                <p>Total Reports: {filteredReports.length}</p>
                <p>Total Animals: {filteredReports.reduce((sum, report) => sum + report.number, 0)}</p>
                <p>Total Weight: {filteredReports.reduce((sum, report) => sum + report.weight, 0)} kg</p>
            </div>

            {/* Slaughter Reports Table */}
            <h2 className="text-lg font-medium text-darkgreen mb-2">Filtered Reports</h2>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="mb-6 overflow-x-auto">
                    {filteredReports.length > 0 ? (
                        <table className="min-w-full bg-white rounded-lg shadow-md">
                            <thead className="bg-darkgreen text-white">
                                <tr>
                                    <th className="py-2 px-4">Animal</th>
                                    <th className="py-2 px-4">Municipality</th>
                                    <th className="py-2 px-4">Month</th>
                                    <th className="py-2 px-4">Year</th>
                                    <th className="py-2 px-4">Number</th>
                                    <th className="py-2 px-4">Weight (kg)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredReports.map((report) => (
                                    <tr key={report.id} className="border-b">
                                        <td className="py-2 px-4">{report.animal}</td>
                                        <td className="py-2 px-4">{report.municipality}</td>
                                        <td className="py-2 px-4">{report.month}</td>
                                        <td className="py-2 px-4">{report.year}</td>
                                        <td className="py-2 px-4">{report.number}</td>
                                        <td className="py-2 px-4">{report.weight}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-gray-500">No reports found for the selected filters.</p>
                    )}
                </div>
            )}

            {/* Button to Open Slaughter Report Form Modal */}
            <div className="text-center">
                <button
                    onClick={openModal}
                    className="bg-darkgreen text-white py-3 px-6 rounded-lg shadow-lg hover:bg-darkergreen transition duration-200"
                >
                    Open Slaughter Report Form
                </button>
            </div>

            {/* Modal for Slaughter Report Form */}
            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <SlaughterReportForm />
            </Modal>
        </div>
    );
}

export default SlaughterReportList;
