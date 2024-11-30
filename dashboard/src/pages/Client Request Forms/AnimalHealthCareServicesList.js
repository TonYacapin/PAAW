import React, { useEffect, useState } from "react";
import axiosInstance from "../../component/axiosInstance";
import Modal from "../../component/Modal";
import AnimalHealthCareServices from "./AnimalHealthCareServices";
import SuccessModal from "../../component/SuccessModal"; // Import the SuccessModal
import RabbiesVaccinantionNumberOfVisits from "./RabbiesVaccinantionNumberOfVisits";

function AnimalHealthCareServicesList() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [municipalities, setMunicipalities] = useState(null);
  const [statusOptions] = useState([
    "Pending",
    "Ongoing",
    "Finished",
    "Cancelled",
  ]); // Status options for filtering
  const [filters, setFilters] = useState({
    search: "",
    municipality: "",
    status: "", // Added status filter
  });

  const [selectedService, setSelectedService] = useState(null); // State to hold selected service for editing
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal open/close state
  const [isHealthCareModalOpen, setIsHealthCareModalOpen] = useState(false); // State for Health Care Modal
  const [isRabbiesVaccinationOpen, setIsRabbiesVaccinationOpen] = useState(false); // State for Health Care Modal
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false); // State for success modal
  const [successMessage, setSuccessMessage] = useState(""); // State for success message

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axiosInstance.get(
          "/api/animal-health-care-services"
        );
        setServices(response.data);

        // Extract unique municipalities
        const uniqueMunicipalities = [
          ...new Set(
            response.data
              .map((service) => service?.clientInfo?.municipality)
              .filter(Boolean)
          ),
        ];

        setMunicipalities(uniqueMunicipalities);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching services:", err);
        setError("Failed to fetch services");
        setLoading(false);
      }
    };

    fetchServices();
  }, [services]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getServiceDetails = (service) => {
    const details = [];

    // Add rabies vaccinations
    if (service.rabiesVaccinations?.length > 0) {
      service.rabiesVaccinations.forEach((vac) => {
        if (vac.petName) {
          details.push({
            type: "Rabies Vaccination",
            pet: vac.petName,
            species: vac.species,
            sex: vac.sex,
            age: vac.age,
            color: vac.color,
          });
        }
      });
    }

    // Add routine services
    if (service.routineServices?.length > 0) {
      service.routineServices.forEach((rs) => {
        if (rs.serviceType) {
          details.push({
            type: rs.serviceType,
            species: rs.species,
            noOfHeads: rs.noOfHeads,
            sex: rs.sex,
            age: rs.age,
          });
        }
      });
    }

    // Add vaccinations
    if (service.vaccinations?.length > 0) {
      service.vaccinations.forEach((vac) => {
        if (vac.type) {
          details.push({
            type: vac.type,
            species: vac.walkInSpecies,
            noOfHeads: vac.noOfHeads,
            sex: vac.sex,
            age: vac.age,
          });
        }
      });
    }

    return details;
  };

  const handleEditStatus = async (serviceId, newStatus) => {
    try {
      await axiosInstance.put(`/api/animal-health-care-services/${serviceId}`, {
        status: newStatus,
      });
      setServices(
        services.map((service) =>
          service._id === serviceId
            ? { ...service, status: newStatus }
            : service
        )
      );
      setIsModalOpen(false);
      setSelectedService(null);

      // Show success modal with a message
      setSuccessMessage("Service status updated successfully!");
      setIsSuccessModalOpen(true);
    } catch (err) {
      console.error("Error updating service status:", err);
      setError("Failed to update status");
    }
  };

  const filteredServices = services.filter((service) => {
    const searchTerm = filters.search.toLowerCase();
    const matchesSearch =
      (service?.clientInfo?.name || "").toLowerCase().includes(searchTerm) ||
      (service?.clientInfo?.municipality || "")
        .toLowerCase()
        .includes(searchTerm);

    const matchesMunicipality =
      !filters.municipality ||
      service?.clientInfo?.municipality === filters.municipality;

    const matchesStatus = !filters.status || service.status === filters.status; // Status filter logic

    return matchesSearch && matchesMunicipality && matchesStatus; // Include status filter in return
  });

  if (loading)
    return (
      <div className="flex items-center justify-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  if (error) return <div className="text-red-500 p-8">{error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-black mb-6">
        Animal Health Care Services List
      </h2>

      {/* Button to open Animal Health Care Services Modal */}
      <button
        onClick={() => setIsHealthCareModalOpen(true)}
        className="mb-6 px-4 py-2 bg-darkgreen text-white rounded hover:bg-darkergreen"
      >
        Open Animal Health Care Services Form
      </button>

      <button
        onClick={() => setIsRabbiesVaccinationOpen(true)}
        className="mb-6 px-4 py-2 bg-darkgreen text-white rounded hover:bg-darkergreen"
      >
        Open Rabies Vaccination History
      </button>
      

      {/* Filters Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* Existing Filters */}
        <input
          type="text"
          placeholder="Search by name or municipality..."
          value={filters.search}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, search: e.target.value }))
          }
          className="p-2 border rounded w-full"
        />

        <select
          value={filters.municipality}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, municipality: e.target.value }))
          }
          className="p-2 border rounded w-full"
        >
          <option value="">All Municipalities</option>
          {municipalities.map((municipality) => (
            <option key={municipality} value={municipality}>
              {municipality}
            </option>
          ))}
        </select>

        <select
          value={filters.status}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, status: e.target.value }))
          }
          className="p-2 border rounded w-full"
        >
          <option value="">All Statuses</option>
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        <button
          onClick={() =>
            setFilters({ search: "", municipality: "", status: "" })
          }
          className="p-2 bg-[#1b5b40] text-white hover:bg-darkergreen rounded w-full"
        >
          Clear Filters
        </button>
      </div>

      {/* Table with filtered services */}
      {filteredServices.length === 0 ? (
        <p className="text-center py-4">
          No services found matching the filters.
        </p>
      ) : (
        <div className="overflow-auto border rounded-lg">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-[#1b5b40] text-white">
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
                return (
                  <tr key={service._id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 p-4">{index + 1}</td>
                    <td className="border border-gray-300 p-4">
                      <div className="font-medium">
                        {service.clientInfo.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {service.clientInfo.municipality}
                      </div>
                    </td>
                    <td className="border border-gray-300 p-4">
                      {`${service.clientInfo.barangay}, ${service.clientInfo.municipality}, ${service.clientInfo.province}`}
                    </td>

                    <td className="border border-gray-300 p-4">
                      {service.rabiesVaccinations.some(
                        (v) =>
                          v.petName ||
                          v.species ||
                          v.sex ||
                          v.age ||
                          v.color ||
                          v.remarks
                      ) && (
                        <div>
                          <h4 className="font-semibold">
                            Rabies Vaccinations:
                          </h4>
                          {service.rabiesVaccinations.map(
                            (vaccination, idx) => (
                              <div key={idx} className="mb-2">
                                {vaccination.petName && (
                                  <strong>Pet Name:</strong>
                                )}{" "}
                                {vaccination.petName}
                                {vaccination.species && (
                                  <strong>, Species:</strong>
                                )}{" "}
                                {vaccination.species}
                                {vaccination.sex && (
                                  <strong>, Sex:</strong>
                                )}{" "}
                                {vaccination.sex}
                                {vaccination.age && (
                                  <strong>, Age:</strong>
                                )}{" "}
                                {vaccination.age}
                                {vaccination.color && (
                                  <strong>, Color:</strong>
                                )}{" "}
                                {vaccination.color}
                                {vaccination.remarks && (
                                  <strong>, Remarks:</strong>
                                )}{" "}
                                {vaccination.remarks}
                              </div>
                            )
                          )}
                        </div>
                      )}

                      {service.vaccinations.some(
                        (v) => v.type || v.aewVaccine || v.aewQuantity !== null
                      ) && (
                        <div>
                          <h4 className="font-semibold">Vaccinations:</h4>
                          {service.vaccinations.map((vaccination, idx) => (
                            <div key={idx} className="mb-2">
                              {vaccination.type && <strong>Type:</strong>}{" "}
                              {vaccination.type}
                              {vaccination.walkInSpecies && (
                                <strong>, Species:</strong>
                              )}{" "}
                              {vaccination.walkInSpecies}
                              {vaccination.noOfHeads !== null && (
                                <strong>, Heads:</strong>
                              )}{" "}
                              {vaccination.noOfHeads}
                              {vaccination.sex && <strong>, Sex:</strong>}{" "}
                              {vaccination.sex}
                              {vaccination.age && <strong>, Age:</strong>}{" "}
                              {vaccination.age}
                              {vaccination.aewVaccine && (
                                <strong>, AEW Vaccine:</strong>
                              )}{" "}
                              {vaccination.aewVaccine}
                              {vaccination.aewQuantity !== null && (
                                <strong>, AEW Quantity:</strong>
                              )}{" "}
                              {vaccination.aewQuantity}
                            </div>
                          ))}
                        </div>
                      )}

                      {service.routineServices.some(
                        (rs) =>
                          rs.serviceType ||
                          rs.aewVaccine ||
                          rs.aewQuantity !== null
                      ) && (
                        <div>
                          <h4 className="font-semibold">Routine Services:</h4>
                          {service.routineServices.map(
                            (routineService, idx) => (
                              <div key={idx} className="mb-2">
                                {routineService.serviceType && (
                                  <strong>Service Type:</strong>
                                )}{" "}
                                {routineService.serviceType}
                                {routineService.species && (
                                  <strong>, Species:</strong>
                                )}{" "}
                                {routineService.species}
                                {routineService.noOfHeads !== null && (
                                  <strong>, Heads:</strong>
                                )}{" "}
                                {routineService.noOfHeads}
                                {routineService.sex && (
                                  <strong>, Sex:</strong>
                                )}{" "}
                                {routineService.sex}
                                {routineService.age && (
                                  <strong>, Age:</strong>
                                )}{" "}
                                {routineService.age}
                                {routineService.aewVaccine && (
                                  <strong>, AEW Vaccine:</strong>
                                )}{" "}
                                {routineService.aewVaccine}
                                {routineService.aewQuantity !== null && (
                                  <strong>, AEW Quantity:</strong>
                                )}{" "}
                                {routineService.aewQuantity}
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </td>
                    <td className="border border-gray-300 p-4">
                      {formatDate(service.createdAt)}
                    </td>
                    <td className="border border-gray-300 p-4">
                      {service.status}
                    </td>
                    <td className="border border-gray-300 p-4">
                      <button
                        onClick={() => {
                          setSelectedService(service);
                          setIsModalOpen(true);
                        }}
                        className="px-4 py-2 bg-darkgreen text-white rounded"
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

      {/* Status Edit Modal */}
      {isModalOpen && selectedService && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Edit Service Status"
        >
          <div className="justify-end">
            <h4 className="font-bold mb-4">
              Edit status for {selectedService.clientInfo.name}
            </h4>

            <select
              value={selectedService.status}
              onChange={(e) =>
                setSelectedService({
                  ...selectedService,
                  status: e.target.value,
                })
              }
              className="p-2 border rounded w-full mb-4"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>

            <button
              onClick={() =>
                handleEditStatus(selectedService._id, selectedService.status)
              }
              className="px-4 py-2 bg-darkgreen text-white rounded hover:bg-darkergreen"
            >
              Save Changes
            </button>
          </div>
        </Modal>
      )}

      {/* Success Modal */}
      {isSuccessModalOpen && (
        <SuccessModal
          isOpen={isSuccessModalOpen}
          onClose={() => setIsSuccessModalOpen(false)}
          message={successMessage}
        />
      )}

      {/* Health Care Modal */}
      {isHealthCareModalOpen && (
        <Modal
          isOpen={isHealthCareModalOpen}
          onClose={() => setIsHealthCareModalOpen(false)}
        >
          <AnimalHealthCareServices />
        </Modal>
      )}

         {/* Health Care Modal */}
         {isRabbiesVaccinationOpen && (
        <Modal
          isOpen={isRabbiesVaccinationOpen}
          onClose={() => setIsRabbiesVaccinationOpen(false)}
        >
          <RabbiesVaccinantionNumberOfVisits />
        </Modal>
      )}
    </div>

    
  );
}

export default AnimalHealthCareServicesList;
