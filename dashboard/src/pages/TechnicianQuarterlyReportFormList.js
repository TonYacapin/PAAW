import React, { useEffect, useState } from 'react';
import axiosInstance from '../component/axiosInstance';
import Modal from '../component/Modal';
import TechnicianQuarterlyReportForm from './TechnicianQuarterlyReportForm';

function TechnicianQuarterlyReportFormList() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [statusOptions] = useState(['Pending', 'Accepted', 'Deleted']);
    const [filters, setFilters] = useState({
        search: '',
        status: ''
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedReport, setSelectedReport] = useState(null);
    const [isReportFormModalOpen, setIsReportFormModalOpen] = useState(false);

    // New states for entry modal
    const [viewEntriesModalOpen, setViewEntriesModalOpen] = useState(false);
    const [selectedEntries, setSelectedEntries] = useState([]); // Ensure this is initialized as an empty array

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await axiosInstance.get('/api/technician-quarterly');
                setReports(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching reports:", err);
                setError("Failed to fetch reports");
                setLoading(false);
            }
        };

        fetchReports();
    }, []);

    const handleEditStatus = async (reportId, newStatus) => {
        try {
            await axiosInstance.put(`/api/technician-quarterly/${reportId}`, { formStatus: newStatus });
            setReports(reports.map(report =>
                report._id === reportId ? { ...report, formStatus: newStatus } : report
            ));
            setIsModalOpen(false);
            setSelectedReport(null);
        } catch (err) {
            console.error("Error updating report status:", err);
            setError("Failed to update status");
        }
    };

    const handleViewEntries = (entries) => {
        setSelectedEntries(entries);
        setViewEntriesModalOpen(true);


    };

    const filteredReports = reports.filter(report => {
        const searchTerm = filters.search.toLowerCase();
        const matchesSearch = report.technicianName.toLowerCase().includes(searchTerm);

        const matchesStatus = !filters.status || report.formStatus === filters.status;

        return matchesSearch && matchesStatus;
    });

    if (loading) return <div className="flex justify-center p-8">Loading...</div>;
    if (error) return <div className="text-red-500 p-8">{error}</div>;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Technician Quarterly Report List</h2>

            {/* Filters Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Search by technician name..."
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    className="p-2 border rounded w-full"
                />
                <select
                    value={filters.status}
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                    className="p-2 border rounded w-full"
                >
                    <option value="">All Statuses</option>
                    {statusOptions.map(status => (
                        <option key={status} value={status}>{status}</option>
                    ))}
                </select>
            </div>

            {/* Button to open TechnicianQuarterlyReportForm modal */}
            <div className="mb-4">
                <button
                    onClick={() => setIsReportFormModalOpen(true)}
                    className="px-4 py-2 bg-[#1b5b40] text-white rounded hover:bg-darkergreen"
                >
                    Open Technician Quarterly Report Form
                </button>
            </div>

            {/* Table with filtered reports */}
            {filteredReports.length === 0 ? (
                <p className="text-center py-4">No reports found matching the filters.</p>
            ) : (
                <div className="overflow-auto border rounded-lg">
                    <table className="min-w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-[#1b5b40] text-white">
                                <th className="border border-gray-300 p-4">No.</th>
                                <th className="border border-gray-300 p-4">Technician Name</th>
                                <th className="border border-gray-300 p-4">Municipality</th>
                                <th className="border border-gray-300 p-4">Date Submitted</th>
                                <th className="border border-gray-300 p-4">Form Status</th>
                                <th className="border border-gray-300 p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredReports.map((report, index) => (
                                <tr key={report._id} className="hover:bg-gray-50">
                                    <td className="border border-gray-300 p-4">{index + 1}</td>
                                    <td className="border border-gray-300 p-4">{report.technicianName}</td>
                                    <td className="border border-gray-300 p-4">{report.municipality}</td>
                                    <td className="border border-gray-300 p-4">{new Date(report.dateSubmitted).toLocaleDateString()}</td>
                                    <td className="border border-gray-300 p-4">{report.formStatus}</td>
                                    <td className="border border-gray-300 p-4 flex space-x-2">
                                        <button
                                            onClick={() => {
                                                setSelectedReport(report);
                                                setIsModalOpen(true);
                                            }}
                                            className="px-2 py-1 bg-[#1b5b40] text-white rounded hover:bg-darkergreen"
                                        >
                                            Edit Status
                                        </button>
                                        {/* New Button for View Entries */}
                                        <button
                                            onClick={() => {
                                                console.log('Animal Entries:', report.animalEntries); // Log the animalEntries
                                                handleViewEntries(report.animalEntries || []); // Use an empty array if entries are undefined
                                            }}
                                            className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                        >
                                            View Entries
                                        </button>



                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Edit Status Modal */}
            {selectedReport && (
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                    <h3 className="text-xl font-bold mb-4">Edit Status for {selectedReport.technicianName}</h3>
                    <div className="mb-4">
                        <label htmlFor="status" className="block text-sm font-medium mb-2">Status:</label>
                        <select
                            id="status"
                            value={selectedReport.formStatus}
                            onChange={(e) => setSelectedReport(prev => ({ ...prev, formStatus: e.target.value }))}
                            className="p-2 border rounded w-full"
                        >
                            {statusOptions.map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex justify-end">
                        <button
                            onClick={() => handleEditStatus(selectedReport._id, selectedReport.formStatus)}
                            className="mt-4 ml-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                            Save
                        </button>
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="mt-4 ml-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                    </div>
                </Modal>
            )}

            {/* Technician Quarterly Report Form Modal */}
            {isReportFormModalOpen && (
                <Modal isOpen={isReportFormModalOpen} onClose={() => setIsReportFormModalOpen(false)}>
                    <TechnicianQuarterlyReportForm />
                </Modal>
            )}

            {/* View Entries Modal */}
            {viewEntriesModalOpen && (
    <Modal isOpen={viewEntriesModalOpen} onClose={() => setViewEntriesModalOpen(false)}>
        <h3 className="text-xl font-bold mb-4">Animal Entries Details</h3>
        <div className="overflow-auto max-h-80">
            <table className="min-w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-800 text-white">
                        <th className="border border-gray-300 p-4">Farmer Name</th>
                        <th className="border border-gray-300 p-4">Address</th>
                        <th className="border border-gray-300 p-4">Dam ID No.</th>
                        <th className="border border-gray-300 p-4">Breed</th>
                        <th className="border border-gray-300 p-4">Color</th>
                        <th className="border border-gray-300 p-4">Estrus</th>
                        <th className="border border-gray-300 p-4">Date of AI</th>
                        <th className="border border-gray-300 p-4">Sire ID</th>
                        <th className="border border-gray-300 p-4">AI Service No.</th>
                        <th className="border border-gray-300 p-4">Date Calved</th>
                        <th className="border border-gray-300 p-4">Classification</th>
                        <th className="border border-gray-300 p-4">Sex</th>
                        <th className="border border-gray-300 p-4">Calve Color</th>
                    </tr>
                </thead>
                <tbody>
                    {selectedEntries.map((entry, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                            <td className="border border-gray-300 p-4">{entry.farmerName}</td>
                            <td className="border border-gray-300 p-4">{entry.address}</td>
                            <td className="border border-gray-300 p-4">{entry.damIdNo}</td>
                            <td className="border border-gray-300 p-4">{entry.breed}</td>
                            <td className="border border-gray-300 p-4">{entry.color}</td>
                            <td className="border border-gray-300 p-4">{entry.estrus}</td>
                            <td className="border border-gray-300 p-4">{new Date(entry.dateOfAI).toLocaleDateString()}</td>
                            <td className="border border-gray-300 p-4">{entry.sireId}</td>
                            <td className="border border-gray-300 p-4">{entry.aiServiceNo}</td>
                            <td className="border border-gray-300 p-4">{new Date(entry.dateCalved).toLocaleDateString()}</td>
                            <td className="border border-gray-300 p-4">{entry.classification}</td>
                            <td className="border border-gray-300 p-4">{entry.sex}</td>
                            <td className="border border-gray-300 p-4">{entry.calveColor}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        <div className="flex justify-end">
            <button
                onClick={() => setViewEntriesModalOpen(false)}
                className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
                Close
            </button>
        </div>
    </Modal>
)}

        </div>
    );
}

export default TechnicianQuarterlyReportFormList;
