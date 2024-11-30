import React, { useEffect, useState } from "react";
import axiosInstance from "../../component/axiosInstance";
import Modal from "../../component/Modal";
import RegulatoryCareServices from "./RegulatoryCareServices";
import SuccessModal from "../../component/SuccessModal";

function RegulatoryCareServicesList() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    municipality: "",
    status: "",
  });
  const [statusOptions] = useState([
    "Pending",
    "Ongoing",
    "Finished",
    "Cancelled",
  ]);
  const [selectedService, setSelectedService] = useState(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axiosInstance.get("/api/regulatory-services");
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
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const filteredServices = services.filter((service) => {
    const searchTerm = filters.search.toLowerCase();
    const matchesSearch =
      (service.clientInfo.name || "").toLowerCase().includes(searchTerm) ||
      (service.clientInfo.municipality || "")
        .toLowerCase()
        .includes(searchTerm);

    const matchesMunicipality =
      !filters.municipality ||
      service.clientInfo.municipality === filters.municipality;

    const matchesStatus = !filters.status || service.status === filters.status;

    return matchesSearch && matchesMunicipality && matchesStatus;
  });

  const openForm = () => {
    setSelectedService(null); // Reset selected service when opening the form
    setIsFormOpen(true);
  };

  const closeForm = () => {
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
    setNewStatus(""); // Reset the status
  };

  const closeSuccessModal = () => {
    setIsSuccessModalOpen(false);
  };

  const updateStatus = async () => {
    try {
      await axiosInstance.put(
        `/api/regulatory-services/${selectedService._id}`,
        {
          ...selectedService,
          status: newStatus, // Update the status
        }
      );
      // Update the local state
      setServices(
        services.map((service) =>
          service._id === selectedService._id
            ? { ...service, status: newStatus }
            : service
        )
      );
      closeStatusModal(); // Close the modal after updating
      setIsSuccessModalOpen(true); // Open success modal
    } catch (err) {
      console.error("Error updating status:", err);
      setError("Failed to update status. Please try again.");
    }
  };

  if (loading)
    return <div className="flex justify-center p-8">Loading services...</div>;
  if (error) return <div className="text-red-500 p-8">{error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Regulatory Care Services List</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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
          {Array.from(
            new Set(services.map((service) => service.clientInfo.municipality))
          )
            .filter(Boolean)
            .map((municipality) => (
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

      <button
        onClick={openForm} // Corrected this line
        className="mb-6 px-4 py-2 bg-darkgreen text-white rounded hover:bg-darkergreen"
      >
        Open Regulatory Care Service Form
      </button>

      {filteredServices.length === 0 ? (
        <p className="text-center py-4">
          No services found matching the filters.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-[#1b5b40] text-white">
                <th className="border border-gray-300 p-4">No.</th>
                <th className="border border-gray-300 p-4">Client Info</th>
                <th className="border border-gray-300 p-4">
                  Regulatory Service Details
                </th>
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
                    <div className="text-sm text-gray-600">
                      Contact: {service.clientInfo.contact}
                    </div>
                    <div className="text-sm text-gray-600">
                      Gender: {service.clientInfo.gender}
                    </div>
                    {service.clientInfo.birthday && (
                      <div className="text-sm text-gray-600">
                        Birthday: {formatDate(service.clientInfo.birthday)}
                      </div>
                    )}
                  </td>
                  <td className="border border-gray-300 p-4">
                    <div>
                      <strong>Purpose:</strong>{" "}
                      {service.regulatoryService.purpose}
                    </div>
                    <div>
                      <strong>Loading Date:</strong>{" "}
                      {formatDate(service.regulatoryService.loadingDate)}
                    </div>
                    <div>
                      <strong>Animals to be Shipped:</strong>{" "}
                      {service.regulatoryService.animalsToBeShipped}
                    </div>
                    <div>
                      <strong>Number of Heads:</strong>{" "}
                      {service.regulatoryService.noOfHeads}
                    </div>
                  </td>
                  <td className="border border-gray-300 p-4">
                    {formatDate(service.createdAt)}
                  </td>
                  <td className="border border-gray-300 p-4 text-center">
                    {service.status}
                  </td>
                  <td className="border border-gray-300 p-4 text-center">
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

      {/* Modal for Updating Status */}
      <Modal isOpen={isStatusModalOpen} onClose={closeStatusModal}>
        <h2 className="text-lg font-bold mb-4">Update Service Status</h2>
        <div className="mb-4">
          <label htmlFor="status" className="block mb-2">
            Select New Status:
          </label>
          <select
            id="status"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            className="p-2 border rounded w-full"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={closeStatusModal}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Cancel
          </button>
          <button
            onClick={updateStatus}
            className="px-4 py-2 bg-darkgreen text-white rounded"
          >
            Update Status
          </button>
        </div>
      </Modal>

      {/* Modal for Regulatory Care Services Form */}
      <Modal isOpen={isFormOpen} onClose={closeForm}>
        <RegulatoryCareServices
          closeForm={closeForm}
          selectedService={selectedService}
          setServices={setServices}
          services={services}
        />
      </Modal>

      {/* Success Modal */}
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        message="Status updated successfully!"
      />
    </div>
  );
}

export default RegulatoryCareServicesList;
