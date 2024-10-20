import React, { useEffect, useState } from 'react';
import axiosInstance from '../../component/axiosInstance';
import Modal from '../../component/Modal';

function AnimalHealthCareServicesList() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [municipalities, setMunicipalities] = useState(null);
  const [statusOptions] = useState(['Pending', 'Ongoing', 'Finished', 'Cancelled']); // Status options for filtering
  const [filters, setFilters] = useState({
    search: '',
    municipality: '',
    status: '' // Added status filter
  });

  const [selectedService, setSelectedService] = useState(null); // State to hold selected service for editing
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal open/close state

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axiosInstance.get('/api/animal-health-care-services');
        setServices(response.data);
        
        // Extract unique municipalities
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

 
  const getServiceDetails = (service) => {
    const details = [];

    // Add rabies vaccinations
    if (service.rabiesVaccinations?.length > 0) {
      service.rabiesVaccinations.forEach(vac => {
        if (vac.petName) {
          details.push({
            type: 'Rabies Vaccination',
            pet: vac.petName,
            species: vac.species,
            sex: vac.sex,
            age: vac.age,
            color: vac.color
          });
        }
      });
    }

    // Add routine services
    if (service.routineServices?.length > 0) {
      service.routineServices.forEach(rs => {
        if (rs.serviceType) {
          details.push({
            type: rs.serviceType,
            species: rs.species,
            noOfHeads: rs.noOfHeads,
            sex: rs.sex,
            age: rs.age
          });
        }
      });
    }

    // Add vaccinations
    if (service.vaccinations?.length > 0) {
      service.vaccinations.forEach(vac => {
        if (vac.type) {
          details.push({
            type: vac.type,
            species: vac.walkInSpecies,
            noOfHeads: vac.noOfHeads,
            sex: vac.sex,
            age: vac.age
          });
        }
      });
    }

    return details;
  };
  const handleEditStatus = async (serviceId, newStatus) => {
    try {
      await axiosInstance.put(`/api/animal-health-care-services/${serviceId}`, { status: newStatus });
      setServices(services.map(service => 
        service._id === serviceId ? { ...service, status: newStatus } : service
      ));
      setIsModalOpen(false);
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
      service.status === filters.status; // Status filter logic

    return matchesSearch && matchesMunicipality && matchesStatus; // Include status filter in return
  });

  if (loading) return <div className="flex justify-center p-8">Loading...</div>;
  if (error) return <div className="text-red-500 p-8">{error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Animal Health Care Services List</h2>
      
      {/* Filters Section */}
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
          className="p-2 bg-gray-100 hover:bg-gray-200 rounded w-full"
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
              <tr className="bg-gray-50">
                <th className="border border-gray-300 p-4">No.</th>
                <th className="border border-gray-300 p-4">Client Info</th>
                <th className="border border-gray-300 p-4">Address</th>
                <th className="border border-gray-300 p-4">Service Details</th>
                <th className="border border-gray-300 p-4">Date</th>
                <th className="border border-gray-300 p-4">Status</th>
                <th className="border border-gray-300 p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredServices.map((service, index) => {
                const serviceDetails = getServiceDetails(service);
                return (
                  <tr key={service._id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 p-4">{index + 1}</td>
                    <td className="border border-gray-300 p-4">
                      <div className="font-medium">{service.clientInfo.name}</div>
                      <div className="text-sm text-gray-600">Birthday: {formatDate(service.clientInfo.birthday)}</div>
                      <div className="text-sm text-gray-600">Contact: {service.clientInfo.contact}</div>
                    </td>
                    <td className="border border-gray-300 p-4">
                      <div>{service.clientInfo.barangay}</div>
                      <div>{service.clientInfo.municipality}</div>
                      <div>{service.clientInfo.province}</div>
                    </td>
                    <td className="border border-gray-300 p-4">
                      {serviceDetails.map((detail, idx) => (
                        <div key={idx} className="mb-2">
                          <div className="font-medium">{detail.type || 'Service Type N/A'}</div>
                          {detail.pet && <div>Pet Name: {detail.pet}</div>}
                          {detail.species && <div>Species: {detail.species}</div>}
                          {detail.noOfHeads && <div>No. of Heads: {detail.noOfHeads}</div>}
                          {detail.sex && <div>Sex: {detail.sex}</div>}
                          {detail.age && <div>Age: {detail.age}</div>}
                          {detail.color && <div>Color: {detail.color}</div>}
                        </div>
                      ))}
                    </td>
                    <td className="border border-gray-300 p-4">
                      {formatDate(service.createdAt)}
                    </td>
                    <td className="border border-gray-300 p-4">
                      <span className={`px-2 py-1 rounded ${
                        service.status.toLowerCase() === 'completed' ? 'bg-green-100 text-green-800' :
                        service.status.toLowerCase() === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {service.status}
                      </span>
                    </td>
                    <td className="border border-gray-300 p-4">
                      <button 
                        onClick={() => {
                          setSelectedService(service);
                          setIsModalOpen(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 block w-full mb-2"
                      >
                        Edit Status
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for Editing Status */}
      {isModalOpen && selectedService && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <h3 className="text-lg font-bold mb-4">Edit Status for {selectedService.clientInfo.name}</h3>
          <select
            defaultValue={selectedService.status}
            onChange={(e) => handleEditStatus(selectedService._id, e.target.value)}
            className="p-2 border rounded mb-4"
          >
            {statusOptions.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          <button
            onClick={() => handleEditStatus(selectedService._id, selectedService.status)} 
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Update Status
          </button>
        </Modal>
      )}
    </div>
  );
}

export default AnimalHealthCareServicesList;
