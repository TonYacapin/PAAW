import React, { useState, useEffect } from "react";
import axiosInstance from "../../component/axiosInstance";
import Modal from "../../component/Modal";
import RabiesHistoryForm from "./RabiesHistoryForm";
import PetsIcon from "@mui/icons-material/Pets";
import SuccessModal from "../../component/SuccessModal"; // Import SuccessModal

function RabiesHistoryFormLists() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editStatusModalOpen, setEditStatusModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false); // Success modal state
  const [rabiesHistories, setRabiesHistories] = useState([]);
  const [selectedInvestigation, setSelectedInvestigation] = useState(null);
  const [newStatus, setNewStatus] = useState("Pending");

  // State variables for filters
  const [filters, setFilters] = useState({
    search: "",
    status: "",
  });

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const formsPerPage = 10;

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const fetchRabiesHistories = async () => {
    try {
      const response = await axiosInstance.get("/RH");
      console.log("Fetched rabies histories:", response.data);
      setRabiesHistories(response.data);
    } catch (error) {
      console.error("Error fetching rabies histories", error);
    }
  };

  useEffect(() => {
    fetchRabiesHistories();
  }, []);

  const openEditStatusModal = (history) => {
    setSelectedInvestigation(history);
    setNewStatus(history.formStatus || "Pending");
    setEditStatusModalOpen(true);
  };

  const handleCloseEditStatusModal = () => {
    setEditStatusModalOpen(false);
    setSelectedInvestigation(null);
  };

  const handleEditStatus = async () => {
    if (!selectedInvestigation) return;

    try {
      const response = await axiosInstance.put(
        `/RH/${selectedInvestigation._id}`,
        { formStatus: newStatus }
      );
      console.log("Response from update:", response.data);

      if (response.data) {
        setRabiesHistories((prevHistories) =>
          prevHistories.map((history) =>
            history._id === response.data._id
              ? { ...history, formStatus: response.data.formStatus }
              : history
          )
        );
        setSuccessModalOpen(true); // Open success modal on successful update
      } else {
        console.error("No updated data returned from the server.");
      }

      handleCloseEditStatusModal();
    } catch (error) {
      console.error("Error updating form status:", error);
    }
  };

  const handleCancelEditStatus = () => {
    setNewStatus(selectedInvestigation?.formStatus || "Pending");
    handleCloseEditStatusModal();
  };

  // Filtering logic
  const filteredHistories = rabiesHistories.filter((history) => {
    const searchTerm = filters.search.toLowerCase();
    const matchesSearch =
      history.victimProfile.name.toLowerCase().includes(searchTerm) ||
      history.animalProfile.species.toLowerCase().includes(searchTerm);
    const matchesStatus =
      !filters.status || history.formStatus === filters.status;

    return matchesSearch && matchesStatus;
  });

  // Sort forms from newest to oldest by dateReported
  const sortedHistories = filteredHistories.sort(
    (a, b) => new Date(b.dateReported) - new Date(a.dateReported)
  );

  // Pagination logic
  const totalPages = Math.ceil(sortedHistories.length / formsPerPage);
  const paginatedHistories = sortedHistories.slice(
    (currentPage - 1) * formsPerPage,
    currentPage * formsPerPage
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-black">Rabies History List</h2>

      {/* Filters Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name or species..."
          value={filters.search}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, search: e.target.value }))
          }
          className="p-2 border rounded w-full"
        />
        <select
          value={filters.status}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, status: e.target.value }))
          }
          className="p-2 border rounded w-full"
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Accepted">Accepted</option>
          <option value="Deleted">Deleted</option>
        </select>
        <button
          onClick={() =>
            setFilters({ search: "", status: "" })
          }
          className="p-2 shadow-md bg-[#1b5b40] text-white hover:bg-darkergreen rounded w-full"
        >
          Clear Filters
        </button>
      </div>

      {/* Button to open Form modal */}
      <div className="mb-4">
        <button
          onClick={openModal}
          className="px-4 py-2 bg-[#1b5b40] text-white rounded hover:bg-darkergreen flex items-center"
        >
          Open Rabies History Form
        </button>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <RabiesHistoryForm closeModal={closeModal} />
      </Modal>

      <Modal isOpen={editStatusModalOpen} onClose={handleCloseEditStatusModal}>
        {selectedInvestigation && (
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4">Edit Form Status</h2>
            <div className="mb-4">
              <label className="block mb-2 font-medium">New Form Status</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded"
              >
                <option value="Pending">Pending</option>
                <option value="Accepted">Accepted</option>
                <option value="Deleted">Deleted</option>
              </select>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleEditStatus}
                className="px-4 py-2 bg-darkgreen text-white rounded"
              >
                Save
              </button>
              <button
                onClick={handleCancelEditStatus}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </Modal>

      

      
      {/* Table with filtered forms */}
      {filteredHistories.length === 0 ? (
        <p className="text-center py-4">No forms found matching the filters.</p>
      ) : (
        <div className="overflow-auto border rounded-lg">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-[#1b5b40] text-white">
                <th className="border border-gray-300 p-4">Name of Victim</th>
                <th className="border border-gray-300 p-4">Age</th>
                <th className="border border-gray-300 p-4">Species</th>
                <th className="border border-gray-300 p-4">Date of Death</th>
                <th className="border border-gray-300 p-4">Cause of Death</th>
                <th className="border border-gray-300 p-4">Vaccination History</th>
                <th className="border border-gray-300 p-4">Form Status</th>
                <th className="border border-gray-300 p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedHistories.map((history, index) => (
                <tr key={history._id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 p-4">
                    {history.victimProfile.name}
                  </td>
                  <td className="border border-gray-300 p-4">
                    {history.victimProfile.age}
                  </td>
                  <td className="border border-gray-300 p-4">
                    {history.animalProfile.species}
                  </td>
                  <td className="border border-gray-300 p-4">
                    {history.dateOfDeath
                      ? new Date(history.dateOfDeath).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="border border-gray-300 p-4">
                    {history.causeOfDeath}
                  </td>
                  <td className="border border-gray-300 p-4">
                    {history.vaccinationHistory}
                  </td>
                  <td className="border border-gray-300 p-4">
                    {history.formStatus || "Pending"}
                  </td>
                  <td className="border border-gray-300 p-4">
                    <button
                      onClick={() => openEditStatusModal(history)}
                      className="px-2 py-1 bg-[#1b5b40] text-white rounded hover:bg-darkergreen"
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-lg text-white bg-darkgreen hover:bg-darkergreen disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-lg text-white bg-darkgreen hover:bg-darkergreen disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>

      )}
      {/* Success Modal */}
      <SuccessModal
        isOpen={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        message="Status updated successfully!"
      />
    </div>


  );
}

export default RabiesHistoryFormLists;
