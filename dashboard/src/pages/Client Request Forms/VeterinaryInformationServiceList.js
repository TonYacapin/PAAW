import React, { useEffect, useState } from 'react';
import axiosInstance from '../../component/axiosInstance';
import Modal from '../../component/Modal';
import VeterinaryInformationService from './VeterinaryInformationServices';
import SuccessModal from '../../component/SuccessModal';

function VeterinaryInformationServiceList() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        search: '',
        municipality: '',
        status: ''
    });
    const [statusOptions] = useState(['Pending', 'Ongoing', 'Finished', 'Cancelled']);
    const [selectedService, setSelectedService] = useState(null);
    const [newStatus, setNewStatus] = useState(''); // Keep newStatus to track current status
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false); // State for SuccessModal

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await axiosInstance.get('/api/veterinary-information-service');
                setServices(response.data);
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
        const date = new Date(dateString);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
    };

    const filteredServices = services.filter(service => {
        const searchTerm = filters.search.toLowerCase();
        const matchesSearch = (service.clientInfo.name || '').toLowerCase().includes(searchTerm) ||
            (service.clientInfo.municipality || '').toLowerCase().includes(searchTerm);

        const matchesMunicipality = !filters.municipality ||
            service.clientInfo.municipality === filters.municipality;

        const matchesStatus = !filters.status || service.status === filters.status;

        return matchesSearch && matchesMunicipality && matchesStatus;
    });

    const openForm = (service = null) => {
        setSelectedService(service);
        setIsFormOpen(true);
    };

    const closeForm = () => {
        setSelectedService(null);
        setIsFormOpen(false);
    };

    const openStatusModal = (service) => {
        setSelectedService(service);
        setNewStatus(service.status); // Set current status to the state
        setIsStatusModalOpen(true);
    };

    const closeStatusModal = () => {
        setSelectedService(null);
        setIsStatusModalOpen(false);
    };

    const handleEditStatus = async () => {
        try {
            const updatedService = { ...selectedService, status: newStatus };
            await axiosInstance.put(`/api/veterinary-information-service/${selectedService._id}`, updatedService);
            setServices(services.map(service =>
                service._id === selectedService._id ? updatedService : service
            ));
            closeStatusModal();
            setIsSuccessModalOpen(true); // Open SuccessModal on successful update
        } catch (err) {
            console.error("Error updating status:", err);
            setError("Failed to update status");
        }
    };

    if (loading) return <div className="flex justify-center p-8">Loading...</div>;
    if (error) return <div className="text-red-500 p-8">{error}</div>;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Veterinary Information Services List</h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Search by name or municipality..."
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
                    {Array.from(new Set(services.map(service => service.clientInfo.municipality)))
                        .filter(Boolean)
                        .map(municipality => (
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

            <button
                onClick={() => openForm()}
                className="mb-6 px-4 py-2 bg-darkgreen text-white rounded hover:bg-darkergreen"
            >
                Open Veterinary Information Service Form
            </button>

            {filteredServices.length === 0 ? (
                <p className="text-center py-4">No services found matching the filters.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-[#1b5b40] text-white">
                                <th className="border border-gray-300 p-4">No.</th>
                                <th className="border border-gray-300 p-4">Client Info</th>
                                <th className="border border-gray-300 p-4">Location</th>
                                <th className="border border-gray-300 p-4">Service Details</th>
                                <th className="border border-gray-300 p-4">Request Date</th>
                                <th className="border border-gray-300 p-4">Status</th>
                                <th className="border border-gray-300 p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredServices.map((service, index) => (
                                <tr key={service._id} className="hover:bg-gray-50">
                                    <td className="border border-gray-300 p-4">{index + 1}</td>
                                    <td className="border border-gray-300 p-4">
                                        <div className="font-medium">{service.clientInfo.name}</div>
                                        <div className="text-sm text-gray-600">Contact: {service.clientInfo.contact}</div>
                                        <div className="text-sm text-gray-600">Gender: {service.clientInfo.gender}</div>
                                        {service.clientInfo.birthday && (
                                            <div className="text-sm text-gray-600">Birthday: {formatDate(service.clientInfo.birthday)}</div>
                                        )}
                                    </td>
                                    <td className="border border-gray-300 p-4">
                                        <div>{service.clientInfo.barangay}</div>
                                        <div>{service.clientInfo.municipality}</div>
                                        <div>{service.clientInfo.province}</div>
                                    </td>
                                    <td className="border border-gray-300 p-4">
                                        {service.clientInfo.service && (
                                            <>
                                                <strong>Service:</strong> {service.clientInfo.service} <br />
                                            </>
                                        )}
                                        {service.clientInfo.others && (
                                            <>
                                                <strong>Others:</strong> {service.clientInfo.others}
                                            </>
                                        )}
                                    </td>
                                    <td className="border border-gray-300 p-4">{formatDate(service.createdAt)}</td>
                                    <td className="border border-gray-300 p-4">{service.status}</td>
                                    <td className="border border-gray-300 p-4">
                                        <button
                                            onClick={() => openStatusModal(service)}
                                            className="px-4 py-2 bg-darkgreen text-white rounded"
                                        >
                                            Edit Status
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Form Modal */}
            {isFormOpen && (
                <Modal isOpen={isFormOpen} onClose={closeForm}>
                    <VeterinaryInformationService
                        service={selectedService}
                        onClose={closeForm}
                    />
                </Modal>
            )}

            {/* Status Modal */}
            {isStatusModalOpen && (
                <Modal isOpen={isStatusModalOpen} onClose={closeStatusModal}>
                    <div className="p-4">
                        <h3 className="text-lg font-semibold mb-4">Update Status</h3>
                        <select
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                            className="border p-2 rounded w-full"
                        >
                            {statusOptions.map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                        <div className="mt-4 flex justify-end space-x-2">
                            <button
                                onClick={handleEditStatus}
                                className="px-4 py-2 bg-darkgreen text-white rounded"
                            >
                                Save
                            </button>
                            <button
                                onClick={closeStatusModal}
                                className="px-4 py-2 bg-red-500 text-white rounded"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </Modal>
            )}

            {/* Success Modal */}
            {isSuccessModalOpen && (
                <SuccessModal
                    isOpen={isSuccessModalOpen}
                    onClose={() => setIsSuccessModalOpen(false)}
                    message="Status updated successfully!"
                />
            )}
        </div>
    );
}

export default VeterinaryInformationServiceList;
