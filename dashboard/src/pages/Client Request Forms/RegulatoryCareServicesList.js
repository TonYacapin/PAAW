import React, { useEffect, useState } from 'react';
import axiosInstance from '../../component/axiosInstance';
import Modal from '../../component/Modal';
import RegulatoryCareServices from './RegulatoryCareServices';

function RegulatoryCareServicesList() {
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
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axiosInstance.get('/api/regulatory-services');
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
    setNewStatus(service.status); // Set the current status
    setIsStatusModalOpen(true);
  };

  const closeStatusModal = () => {
    setSelectedService(null);
    setIsStatusModalOpen(false);
    setNewStatus(''); // Reset the status
  };

  const updateStatus = async () => {
    try {
      await axiosInstance.put(`/api/regulatory-services/${selectedService._id}`, {
        ...selectedService,
        status: newStatus // Update the status
      });
      // Update the local state
      setServices(services.map(service => 
        service._id === selectedService._id ? { ...service, status: newStatus } : service
      ));
      closeStatusModal(); // Close the modal after updating
    } catch (err) {
      console.error("Error updating status:", err);
      setError("Failed to update status");
    }
  };

  if (loading) return <div className="flex justify-center p-8">Loading...</div>;
  if (error) return <div className="text-red-500 p-8">{error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Regulatory Care Services List</h2>

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
          className="p-2 bg-gray-100 hover:bg-gray-200 rounded w-full"
        >
          Clear Filters
        </button>
      </div>

      <button
        onClick={() => openForm()} // Open form for adding a new service
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Open Regulatory Care Service Form
      </button>

      {filteredServices.length === 0 ? (
        <p className="text-center py-4">No services found matching the filters.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 p-4">No.</th>
                <th className="border border-gray-300 p-4">Client Info</th>
                <th className="border border-gray-300 p-4">Regulatory Service Details</th>
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
                    <div><strong>Purpose:</strong> {service.regulatoryService.purpose}</div>
                    <div><strong>Loading Date:</strong> {formatDate(service.regulatoryService.loadingDate)}</div>
                    <div><strong>Animals to be Shipped:</strong> {service.regulatoryService.animalsToBeShipped}</div>
                    <div><strong>Number of Heads:</strong> {service.regulatoryService.noOfHeads}</div>
                  </td>
                  <td className="border border-gray-300 p-4">{formatDate(service.createdAt)}</td>
                  <td className="border border-gray-300 p-4">{service.status}</td>
                  <td className="border border-gray-300 p-4">
                    <button
                      onClick={() => openStatusModal(service)} // Open form for editing the selected service
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

      {/* Form Modal */}
      {isFormOpen && (
        <Modal isOpen={isFormOpen} onClose={closeForm}>
          <RegulatoryCareServices
            service={selectedService}
            onClose={closeForm}
          />
        </Modal>
      )}

      {/* Status Update Modal */}
      {isStatusModalOpen && (
        <Modal isOpen={isStatusModalOpen} onClose={closeStatusModal}>
          <h2 className="text-lg font-bold mb-4">Update Status</h2>
          <select
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            className="p-2 border rounded w-full mb-4"
          >
            {statusOptions.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          <div className="flex justify-end">
            <button
              onClick={updateStatus}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
            >
              Update
            </button>
            <button
              onClick={closeStatusModal}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default RegulatoryCareServicesList;
