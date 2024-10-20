import React, { useEffect, useState } from 'react';
import axiosInstance from '../../component/axiosInstance';
import Modal from '../../component/Modal';
import AnimalProductionServices from './AnimalProductionServices'; // Adjust the import as necessary

function AnimalProductionServicesList() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [municipalities, setMunicipalities] = useState(null);
    const [statusOptions] = useState(['Pending', 'Ongoing', 'Finished', 'Cancelled']);
    const [filters, setFilters] = useState({
        search: '',
        municipality: '',
        status: ''
    });

    const [selectedService, setSelectedService] = useState(null);
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [isProductionModalOpen, setIsProductionModalOpen] = useState(false);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await axiosInstance.get('/api/animal-production-services');
                setServices(response.data);

                const uniqueMunicipalities = [...new Set(response.data.map(service =>
                    service?.clientInfo?.municipality
                ).filter(Boolean))];

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
            await axiosInstance.put(`/api/animal-production-services/${serviceId}`, { status: newStatus });
            setServices(services.map(service =>
                service._id === serviceId ? { ...service, status: newStatus } : service
            ));
            setIsStatusModalOpen(false);
            setSelectedService(null);
        } catch (err) {
            console.error("Error updating service status:", err);
            setError("Failed to update status");
        }
    };

    const filteredServices = services.filter(service => {
        const searchTerm = filters.search.toLowerCase();
        const matchesSearch =
            (service?.clientInfo?.name || '').toLowerCase().includes(searchTerm) ||
            (service?.clientInfo?.municipality || '').toLowerCase().includes(searchTerm);

        const matchesMunicipality =
            !filters.municipality ||
            service?.clientInfo?.municipality === filters.municipality;

        const matchesStatus =
            !filters.status ||
            service.status === filters.status;

        return matchesSearch && matchesMunicipality && matchesStatus;
    });

    if (loading) return <div className="flex justify-center p-8">Loading...</div>;
    if (error) return <div className="text-red-500 p-8">{error}</div>;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Animal Production Services List</h2>

            <button
                onClick={() => setIsProductionModalOpen(true)}
                className="mb-6 px-4 py-2 bg-darkgreen text-white rounded hover:bg-darkergreen"
            >
                Open Animal Production Services Form
            </button>

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
                    className="p-2 bg-darkgreen text-white hover:bg-darkergreen rounded w-full"
                >
                    Clear Filters
                </button>
            </div>

            {filteredServices.length === 0 ? (
                <p className="text-center py-4">No services found matching the filters.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-[#1b5b40] text-white">
                                <th className="border border-gray-300 p-4">No.</th>
                                <th className="border border-gray-300 p-4">Client Name</th>
                                <th className="border border-gray-300 p-4">Complete Address</th>
                                <th className="border border-gray-300 p-4">Request Information</th>
                                <th className="border border-gray-300 p-4">Request Date</th>
                                <th className="border border-gray-300 p-4">Status</th>
                                <th className="border border-gray-300 p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredServices.map((service, index) => (
                                <tr key={service._id} className="hover:bg-gray-50">
                                    <td className="border border-gray-300 p-4">{index + 1}</td>
                                    <td className="border border-gray-300 p-4">{service.clientInfo.name} <br></br>{service.clientInfo.contactNumber}</td>
                                    <td className="border border-gray-300 p-4">{service.clientInfo.completeAddress}</td>
                                    <td className="border border-gray-300 p-4">
                                        {service.animalInfo?.loanType && (
                                            <>
                                                <strong>A. SR/LR-GIP</strong> <br />
                                                <strong>A.1 Type of Loan:</strong> {service.animalInfo.loanType} <br />
                                                <strong>A.2 Animal:</strong> {service.animalInfo.animalType} <br />
                                            </>
                                        )}

                                        {service.serviceDetails?.aiAnimalType && (
                                            <>
                                                <br />
                                                <strong>B. Artificial Insemination:</strong> {service.serviceDetails.aiAnimalType} <br />
                                            </>
                                        )}

                                        {service.livelihoodInfo?.applicationType && (
                                            <>
                                                <br />
                                                <strong>C. Livelihood Enterprise Development</strong> <br />
                                                <strong>C.1 Type of Application:</strong> {service.livelihoodInfo.applicationType} <br />
                                                {service.livelihoodInfo.productionType && (
                                                    <>
                                                        <strong>C.2 Type of Production:</strong> {service.livelihoodInfo.productionType} <br />
                                                    </>
                                                )}
                                            </>
                                        )}

                                        {service.trainingInfo?.specificTopic && (
                                            <>
                                                <br />
                                                <strong>D. Animal Production Briefing/Training:</strong> {service.trainingInfo.specificTopic} <br />
                                                {service.trainingInfo.venue && (
                                                    <>
                                                        <strong>Venue:</strong> {service.trainingInfo.venue} <br />
                                                    </>
                                                )}
                                                {service.trainingInfo.date && (
                                                    <>
                                                        <strong>Date:</strong> {formatDate(service.trainingInfo.date)} <br />
                                                    </>
                                                )}
                                            </>
                                        )}

                                        {service.iecMaterial?.title && (
                                            <>
                                                <br />
                                                <strong>E. IEC Material:</strong> {service.iecMaterial.title} <br />
                                            </>
                                        )}

                                        {service.otherInfo?.others && (
                                            <>
                                                <br />
                                                <strong>F. Other Info:</strong> {service.otherInfo.others}
                                            </>
                                        )}
                                    </td>

                                    <td className="border border-gray-300 p-4">{formatDate(service.createdAt)}</td>
                                    <td className="border border-gray-300 p-4">{service.status}</td>
                                    <td className="border border-gray-300 p-4">
                                        <button
                                            onClick={() => {
                                                setSelectedService(service);
                                                setIsStatusModalOpen(true);
                                            }}
                                            className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 mr-2"
                                        >
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Status Edit Modal */}
            {isStatusModalOpen && (
                <Modal isOpen={isStatusModalOpen} onClose={() => setIsStatusModalOpen(false)}>
                    <div className="p-6">
                        <h3 className="text-xl font-bold mb-4">Edit Service Status</h3>
                        <p className="mb-4">Update status for <strong>{selectedService?.clientInfo?.name}</strong></p>
                        <select
                            value={selectedService?.status}
                            onChange={(e) => handleEditStatus(selectedService?._id, e.target.value)}
                            className="p-2 border rounded w-full"
                        >
                            {statusOptions.map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                        <button
                            onClick={() => setIsStatusModalOpen(false)}
                            className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                    </div>
                </Modal>
            )}

            {/* Production Services Modal */}
            {isProductionModalOpen && (
                <Modal isOpen={isProductionModalOpen} onClose={() => setIsProductionModalOpen(false)}>
                    <AnimalProductionServices onClose={() => setIsProductionModalOpen(false)} />
                </Modal>
            )}
        </div>
    );
}

export default AnimalProductionServicesList;
