import React, { useEffect, useState } from 'react';
import axiosInstance from '../component/axiosInstance';
import Modal from '../component/Modal';
import UpgradingServices from './UpgradingServices';

function UpgradingServicesList() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [municipalities, setMunicipalities] = useState(null);
    const [statusOptions] = useState(['Pending', 'Accepted', 'Deleted']);
    const [filters, setFilters] = useState({
        search: '',
        municipality: '',
        status: ''
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    const [isUpgradingModalOpen, setIsUpgradingModalOpen] = useState(false);
    const [viewEntriesModalOpen, setViewEntriesModalOpen] = useState(false);
    const [selectedEntries, setSelectedEntries] = useState([]);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await axiosInstance.get('/api/upgrading-services');
                setServices(response.data);

                const uniqueMunicipalities = [...new Set(response.data.map(service => service.municipality).filter(Boolean))];
                setMunicipalities(uniqueMunicipalities);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching services:", err);
                setError("Failed to fetch services");
                setLoading(false);
            }
        };

        fetchServices();
    }, []);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    const handleEditStatus = async (serviceId, newStatus) => {
        try {
            await axiosInstance.put(`/api/upgrading-services/${serviceId}`, { formStatus: newStatus });
            setServices(services.map(service =>
                service._id === serviceId ? { ...service, formStatus: newStatus } : service
            ));
            setIsModalOpen(false);
            setSelectedService(null);
        } catch (err) {
            console.error("Error updating service status:", err);
            setError("Failed to update status");
        }
    };

    const handleViewEntries = (entries) => {
        setSelectedEntries(entries);
        setViewEntriesModalOpen(true);
    };

    const filteredServices = services.filter(service => {
        const searchTerm = filters.search.toLowerCase();
        const matchesSearch = service.entries.some(entry =>
            `${entry.clientInfo.firstName} ${entry.clientInfo.lastName}`.toLowerCase().includes(searchTerm) ||
            entry.activity.toLowerCase().includes(searchTerm)
        );

        const matchesMunicipality = !filters.municipality || service.municipality === filters.municipality;
        const matchesStatus = !filters.status || service.formStatus === filters.status;

        return matchesSearch && matchesMunicipality && matchesStatus;
    });

    if (loading) return <div className="flex justify-center p-8">Loading...</div>;
    if (error) return <div className="text-red-500 p-8">{error}</div>;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Upgrading Services List</h2>

            {/* Filters Section */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Search by client name or activity..."
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    className="p-2 border rounded w-full"
                />
                <select
                    value={filters.municipality}
                    onChange={(e) => setFilters(prev => ({ ...prev, municipality: e.target.value }))}
                    className="p-2 border rounded w-full"
                >
                    <option value="">All Municipalities</option>
                    {municipalities.map(municipality => (
                        <option key={municipality} value={municipality}>{municipality}</option>
                    ))}
                </select>
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
                <button
                    onClick={() => setFilters({ search: '', municipality: '', status: '' })}
                    className="p-2 bg-[#1b5b40] text-white hover:bg-darkergreen rounded w-full"
                >
                    Clear Filters
                </button>
            </div>

            {/* Button to open UpgradingServices modal */}
            <div className="mb-4">
                <button
                    onClick={() => setIsUpgradingModalOpen(true)}
                    className="px-4 py-2 bg-[#1b5b40] text-white rounded hover:bg-darkergreen"
                >
                    Open Upgrading Services Form
                </button>
            </div>

            {/* Table with filtered services */}
            {filteredServices.length === 0 ? (
                <p className="text-center py-4">No services found matching the filters.</p>
            ) : (
                <div className="overflow-auto border rounded-lg">
                    <table className="min-w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-[#1b5b40] text-white">
                                <th className="border border-gray-300 p-4">No.</th>
                                <th className="border border-gray-300 p-4">Municipality</th>
                                <th className="border border-gray-300 p-4">Date Reported</th>
                                <th className="border border-gray-300 p-4">Form Status</th>
                                <th className="border border-gray-300 p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredServices.map((service, index) => (
                                <tr key={service._id} className="hover:bg-gray-50">
                                    <td className="border border-gray-300 p-4">{index + 1}</td>
                                    <td className="border border-gray-300 p-4">{service.municipality}</td>
                                    <td className="border border-gray-300 p-4">{formatDate(service.dateReported)}</td>
                                    <td className="border border-gray-300 p-4">{service.formStatus}</td>
                                    <td className="border border-gray-300 p-4">
                                        <button
                                            onClick={() => {
                                                setSelectedService(service);
                                                setIsModalOpen(true);
                                            }}
                                            className="px-2 py-1 bg-[#1b5b40] text-white rounded hover:bg-darkergreen"
                                        >
                                            Edit Status
                                        </button>
                                        <button
                                            onClick={() => handleViewEntries(service.entries)}
                                            className="ml-2 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
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
            {selectedService && (
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                    <h3 className="text-xl font-bold mb-4">Edit Status for {selectedService.municipality}</h3>
                    <div className="mb-4">
                        <label htmlFor="status" className="block text-sm font-medium mb-2">Status:</label>
                        <select
                            id="status"
                            value={selectedService.formStatus}
                            onChange={(e) => setSelectedService(prev => ({ ...prev, formStatus: e.target.value }))}
                            className="p-2 border rounded w-full"
                        >
                            {statusOptions.map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex justify-end">
                        <button
                            onClick={() => handleEditStatus(selectedService._id, selectedService.formStatus)}
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

            {/* View Entries Modal */}
            {viewEntriesModalOpen && (
                <Modal isOpen={viewEntriesModalOpen} onClose={() => setViewEntriesModalOpen(false)}>
                    <h3 className="text-xl font-bold mb-4">Entries Details</h3>
                    <div className="overflow-auto max-h-80">
                        <table className="min-w-full border-collapse border border-gray-300">
                            <thead>
                                <tr className="bg-gray-800 text-white">
                                    <th className="border border-gray-300 p-4">No.</th>
                                    <th className="border border-gray-300 p-4">Date</th>
                                    <th className="border border-gray-300 p-4">Barangay</th>
                                    <th className="border border-gray-300 p-4">Client Name</th>
                                    <th className="border border-gray-300 p-4">Gender</th>
                                    <th className="border border-gray-300 p-4">Birthday</th>
                                    <th className="border border-gray-300 p-4">Contact No.</th>
                                    <th className="border border-gray-300 p-4">Species</th>
                                    <th className="border border-gray-300 p-4">Breed</th>
                                    <th className="border border-gray-300 p-4">Sex</th>
                                    <th className="border border-gray-300 p-4">Age</th>
                                    <th className="border border-gray-300 p-4">Color</th>
                                    <th className="border border-gray-300 p-4">Estrus</th>
                                    <th className="border border-gray-300 p-4">Sire Code No.</th>
                                    <th className="border border-gray-300 p-4">Activity</th>
                                    <th className="border border-gray-300 p-4">Remarks</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedEntries.map((entry, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="border border-gray-300 p-4">{entry.no}</td>
                                        <td className="border border-gray-300 p-4">{new Date(entry.date).toLocaleDateString()}</td>
                                        <td className="border border-gray-300 p-4">{entry.barangay}</td>
                                        <td className="border border-gray-300 p-4">{`${entry.clientInfo.firstName} ${entry.clientInfo.lastName}`}</td>
                                        <td className="border border-gray-300 p-4">{entry.clientInfo.gender}</td>
                                        <td className="border border-gray-300 p-4">{new Date(entry.clientInfo.birthday).toLocaleDateString()}</td>
                                        <td className="border border-gray-300 p-4">{entry.clientInfo.contactNo}</td>
                                        <td className="border border-gray-300 p-4">{entry.animalInfo.species}</td>
                                        <td className="border border-gray-300 p-4">{entry.animalInfo.breed}</td>
                                        <td className="border border-gray-300 p-4">{entry.animalInfo.sex}</td>
                                        <td className="border border-gray-300 p-4">{entry.animalInfo.age}</td>
                                        <td className="border border-gray-300 p-4">{entry.animalInfo.color}</td>
                                        <td className="border border-gray-300 p-4">{entry.animalInfo.estrus}</td>
                                        <td className="border border-gray-300 p-4">{entry.sireCodeNum}</td>
                                        <td className="border border-gray-300 p-4">{entry.activity}</td>
                                        <td className="border border-gray-300 p-4">{entry.remarks}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Modal>
            )}

            {isUpgradingModalOpen && (
                <Modal isOpen={isUpgradingModalOpen} onClose={() => setIsUpgradingModalOpen(false)}>
                    <UpgradingServices />
                </Modal>
            )}

        </div>
    );
}

export default UpgradingServicesList;
