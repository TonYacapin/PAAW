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
  const [nameFilter, setNameFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

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
    const matchesName =
      history.victimProfile.name.toLowerCase().includes(nameFilter.toLowerCase());
    const matchesStatus =
      statusFilter === "" || history.formStatus === statusFilter;

    return matchesName && matchesStatus;
  });

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4 text-darkgreen">
        Rabies History
      </h2>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Filter by Name of Victim"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2 mr-2"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2"
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Accepted">Accepted</option>
          <option value="Deleted">Deleted</option>
        </select>
      </div>

      <button
        onClick={openModal}
        className="bg-darkgreen text-white px-4 py-2 rounded-md hover:bg-darkergreen transition duration-300 mb-4 flex items-center"
      >
        <PetsIcon className="mr-2" /> Rabies History
      </button>

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

      {/* Success Modal */}
      <SuccessModal
        isOpen={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        message="Status updated successfully!"
      />

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-lg rounded-lg">
          <thead className="bg-pastelyellow">
            <tr className="text-left text-sm font-semibold text-black">
              <th className="py-3 px-6">Name of Victim</th>
              <th className="py-3 px-6">Age</th>
              <th className="py-3 px-6">Species</th>
              <th className="py-3 px-6">Date of Death</th>
              <th className="py-3 px-6">Cause of Death</th>
              <th className="py-3 px-6">Vaccination History</th>
              <th className="py-3 px-6">Form Status</th>
              <th className="py-3 px-6">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredHistories.map((history) => (
              <tr key={history._id} className="border-t border-gray-200">
                <td className="py-2 px-6">{history.victimProfile.name}</td>
                <td className="py-2 px-6">{history.victimProfile.age}</td>
                <td className="py-2 px-6">{history.animalProfile.species}</td>
                <td className="py-2 px-6">
                  {history.dateOfDeath
                    ? new Date(history.dateOfDeath).toLocaleDateString()
                    : "N/A"}
                </td>
                <td className="py-2 px-6">{history.causeOfDeath}</td>
                <td className="py-2 px-6">{history.vaccinationHistory}</td>
                <td className="py-2 px-6">{history.formStatus || "Pending"}</td>
                <td className="py-2 px-6">
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
    </div>
  );
}

export default RabiesHistoryFormLists;
