import React, { useState, useEffect } from "react";
import axiosInstance from "../../component/axiosInstance";
import Modal from "../../component/Modal";
import RabiesHistoryForm from "./RabiesHistoryForm";
import SuccessModal from "../../component/SuccessModal";

function RabiesHistoryFormLists() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editStatusModalOpen, setEditStatusModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false); // Details modal state
  const [rabiesHistories, setRabiesHistories] = useState([]);
  const [selectedInvestigation, setSelectedInvestigation] = useState(null);
  const [viewDetailsData, setViewDetailsData] = useState(null); // Data for the details modal
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
        setSuccessModalOpen(true);
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

  // Open the details modal and set the selected data
  const openDetailsModal = (history) => {
    setViewDetailsData(history);
    setDetailsModalOpen(true);
  };

  // Close the details modal
  const closeDetailsModal = () => {
    setDetailsModalOpen(false);
    setViewDetailsData(null);
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
          onClick={() => setFilters({ search: "", status: "" })}
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
                <th className="border border-gray-300 p-4">Form Status</th>
                <th className="border border-gray-300 p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedHistories.map((history) => (
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
                    {history.formStatus}
                  </td>
                  <td className="border border-gray-300 p-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openEditStatusModal(history)}
                        className="px-4 py-1 text-white bg-darkgreen rounded"
                      >
                        Edit Status
                      </button>
                      <button
                        onClick={() => openDetailsModal(history)}
                        className="px-4 py-1 text-white bg-blue-500 rounded"
                      >
                        View Details
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className="p-2 bg-gray-300 rounded disabled:opacity-50"
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          className="p-2 bg-gray-300 rounded disabled:opacity-50"
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {/* Details Modal */}
      <Modal isOpen={detailsModalOpen} onClose={closeDetailsModal}>
  {viewDetailsData && (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-darkgreen">Entry Details</h2>

      {/* Victim Profile Table */}
      <h3 className="font-semibold mt-4 text-darkgreen">Victim Profile</h3>
      <table className="w-full mb-4 border border-gray-300 rounded text-sm sm:text-base">
        <tbody>
          <tr className="border-t border-gray-300">
            <td className="font-bold text-darkergreen p-2">Name</td>
            <td className="p-2">{viewDetailsData.victimProfile?.name}</td>
          </tr>
          <tr className="border-t border-gray-300">
            <td className="font-bold text-darkergreen p-2">Age</td>
            <td className="p-2">{viewDetailsData.victimProfile?.age}</td>
          </tr>
          <tr className="border-t border-gray-300">
            <td className="font-bold text-darkergreen p-2">Sex</td>
            <td className="p-2">{viewDetailsData.victimProfile?.sex}</td>
          </tr>
          <tr className="border-t border-gray-300">
            <td className="font-bold text-darkergreen p-2">Address</td>
            <td className="p-2">{viewDetailsData.victimProfile?.address}</td>
          </tr>
          <tr className="border-t border-gray-300">
            <td className="font-bold text-darkergreen p-2">Date of Bite</td>
            <td className="p-2">{viewDetailsData.victimProfile?.dateOfBite}</td>
          </tr>
          <tr className="border-t border-gray-300">
            <td className="font-bold text-darkergreen p-2">Time of Bite</td>
            <td className="p-2">{viewDetailsData.victimProfile?.timeOfBite}</td>
          </tr>
          {/* Additional Victim Profile fields */}
        </tbody>
      </table>

      {/* Animal Profile Table */}
      <h3 className="font-semibold mt-4 text-darkgreen">Animal Profile</h3>
      <table className="w-full mb-4 border border-gray-300 rounded text-sm sm:text-base">
        <tbody>
          <tr className="border-t border-gray-300">
            <td className="font-bold text-darkergreen p-2">Residence</td>
            <td className="p-2">{viewDetailsData.animalProfile?.residence}</td>
          </tr>
          <tr className="border-t border-gray-300">
            <td className="font-bold text-darkergreen p-2">Species</td>
            <td className="p-2">{viewDetailsData.animalProfile?.species}</td>
          </tr>
          <tr className="border-t border-gray-300">
            <td className="font-bold text-darkergreen p-2">Breed</td>
            <td className="p-2">{viewDetailsData.animalProfile?.breed}</td>
          </tr>
          <tr className="border-t border-gray-300">
            <td className="font-bold text-darkergreen p-2">Sex</td>
            <td className="p-2">{viewDetailsData.animalProfile?.sex}</td>
          </tr>
          <tr className="border-t border-gray-300">
            <td className="font-bold text-darkergreen p-2">Age</td>
            <td className="p-2">{viewDetailsData.animalProfile?.age}</td>
          </tr>
          {/* Additional Animal Profile fields */}
        </tbody>
      </table>

      {/* Vaccination and Contact Table */}
      <h3 className="font-semibold mt-4 text-darkgreen">Vaccination and Contact</h3>
      <table className="w-full mb-4 border border-gray-300 rounded text-sm sm:text-base">
        <tbody>
          <tr className="border-t border-gray-300">
            <td className="font-bold text-darkergreen p-2">Vaccination History</td>
            <td className="p-2">{viewDetailsData.vaccinationHistory}</td>
          </tr>
          <tr className="border-t border-gray-300">
            <td className="font-bold text-darkergreen p-2">Type of Vaccine</td>
            <td className="p-2">{viewDetailsData.typeOfVaccine}</td>
          </tr>
          <tr className="border-t border-gray-300">
            <td className="font-bold text-darkergreen p-2">Date of Last Vaccination</td>
            <td className="p-2">{viewDetailsData.dateOfLastVaccination}</td>
          </tr>
          <tr className="border-t border-gray-300">
            <td className="font-bold text-darkergreen p-2">Contact with Other Animals</td>
            <td className="p-2">{viewDetailsData.contactWithAnimals}</td>
          </tr>
          {/* Additional Vaccination and Contact fields */}
        </tbody>
      </table>

      {/* Behavioral Changes Table */}
      <h3 className="font-semibold mt-4 text-darkgreen">Behavioral Changes</h3>
      <table className="w-full mb-4 border border-gray-300 rounded text-sm sm:text-base">
        <tbody>
          <tr className="border-t border-gray-300">
            <td className="font-bold text-darkergreen p-2">Restlessness</td>
            <td className="p-2">{viewDetailsData.behavioralChanges?.restlessness ? "Yes" : "No"}</td>
          </tr>
          <tr className="border-t border-gray-300">
            <td className="font-bold text-darkergreen p-2">Hyperactivity</td>
            <td className="p-2">{viewDetailsData.behavioralChanges?.hyperactivity ? "Yes" : "No"}</td>
          </tr>
          <tr className="border-t border-gray-300">
            <td className="font-bold text-darkergreen p-2">Others</td>
            <td className="p-2">{viewDetailsData.behavioralChanges?.others ? "Yes" : "No"}</td>
          </tr>
          {/* Additional Behavioral Changes fields */}
        </tbody>
      </table>

      {/* Form Status Table */}
      <h3 className="font-semibold mt-4 text-darkgreen">Form Status</h3>
      <table className="w-full mb-4 border border-gray-300 rounded text-sm sm:text-base">
        <tbody>
          <tr className="border-t border-gray-300">
            <td className="font-bold text-darkergreen p-2">Form Status</td>
            <td className="p-2">{viewDetailsData.formStatus}</td>
          </tr>
        </tbody>
      </table>

      <button
        onClick={closeDetailsModal}
        className="mt-4 px-4 py-2 bg-darkgreen text-white rounded hover:bg-darkergreen"
      >
        Close
      </button>
    </div>
  )}
</Modal>


      <SuccessModal
        isOpen={successModalOpen}
        message="Form status updated successfully!"
        onClose={() => setSuccessModalOpen(false)}
      />
    </div>
  );
}

export default RabiesHistoryFormLists;
