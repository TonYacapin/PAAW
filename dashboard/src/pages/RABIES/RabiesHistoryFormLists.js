import React, { useState, useEffect } from "react";
import axiosInstance from "../../component/axiosInstance";
import Modal from "../../component/Modal";
import RabiesHistoryForm from "./RabiesHistoryForm";
import SuccessModal from "../../component/SuccessModal";
import StepperComponent from "../../component/StepperComponent";

function RabiesHistoryFormLists() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editStatusModalOpen, setEditStatusModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [rabiesHistories, setRabiesHistories] = useState([]);
  const [selectedInvestigation, setSelectedInvestigation] = useState(null);
  const [viewDetailsData, setViewDetailsData] = useState(null);
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

  const openDetailsModal = (history) => {
    setViewDetailsData(history);
    setDetailsModalOpen(true);
  };

  const closeDetailsModal = () => {
    setDetailsModalOpen(false);
    setViewDetailsData(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedInvestigation(null);
  };

  const pages = ["Victim Profile", "Animal Profile", "Vaccination and Contact"];

  const renderStepContent = (step) => {
    if (!viewDetailsData) {
      return <div>No details available.</div>;
    }
  
    const renderTable = (data, fields) => (
      <table className="min-w-full border-collapse border border-gray-300">
        <tbody>
          {fields.map(([label, key]) => (
            <tr key={key}>
              <td className="border border-gray-300 p-2">{label}</td>
              <td className="border border-gray-300 p-2">
                {data[key] !== undefined
                  ? Array.isArray(data[key])
                    ? data[key].join(', ')
                    : data[key].toString()
                  : "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  
    switch (step) {
      case 0: // Victim Profile
        return renderTable(viewDetailsData.victimProfile, [
          ["Name", "name"],
          ["Age", "age"],
          ["Sex", "sex"],
          ["Address", "address"],
          ["Date of Bite", "dateOfBite"],
          ["Time of Bite", "timeOfBite"],
          ["Site of Bite", "siteOfBite"],
          ["Site of Bite (Specify)", "siteOfBiteSpecify"],
          ["Nature of Bite", "natureOfBite"],
          ["Bite Provoked", "biteProvoked"],
          ["Bite Provoked (Specify)", "biteProvokedSpecify"],
          ["Location of Bite", "locationOfBite"],
          ["Location of Bite (Specify)", "locationOfBiteSpecify"],
          ["Other Victims", "otherVictims"],
        ]);
  
      case 1: // Animal Profile
        return renderTable(viewDetailsData.animalProfile, [
          ["Residence", "residence"],
          ["Species", "species"],
          ["Breed", "breed"],
          ["Sex", "sex"],
          ["Age", "age"],
          ["Vaccination History", "vaccinationHistory"],
          ["Type of Vaccine", "typeOfVaccine"],
          ["Date of Last Vaccination", "dateOfLastVaccination"],
        ]);
  
      case 2: 
        return renderTable(viewDetailsData, [
          ["Form Status", "formStatus"],
          ["Ownership Type", "ownershipType"],
          ["Cause of Death", "causeOfDeath"],
          ["Date of Death", "dateOfDeath"],
          ["Time of Death", "timeOfDeath"],
          ["Treatment Received", "treatmentReceived"],
          ["Treatment Received Other", "treatmentReceivedOther"],
          ["Date of Treatment Received", "dateOfTreatmentReceived"],
          ["Pet Management", "petManagement"],
          ["Pet Management (Other)", "petManagementOther"],
          ["Other Remarks", "otherRemarks"],
        ]);
  
      default:
        return <div>No content available for this step.</div>;
    }
  };
  
  

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-black">
        Rabies History List
      </h2>
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
                <option value="Completed">Completed</option>
                <option value="Deleted">Deleted</option>
              </select>
            </div>
            <div className="flex justify-end space-x-2">
             
              <button
                onClick={handleEditStatus}
                className="px-4 py-2 bg-[#1b5b40] text-white rounded hover:bg-darkergreen"
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
      
      <Modal isOpen={detailsModalOpen} onClose={closeDetailsModal}>
        <h2 className="text-2xl font-bold mb-4">Rabies Details</h2>
        <StepperComponent pages={pages} renderStepContent={renderStepContent} />
      </Modal>
     
      <SuccessModal
        isOpen={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        message="Status updated successfully!"
      />
      {/* List of Rabies Histories */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">Name of Victim</th>
              <th className="px-4 py-2 border">Time of Bite</th>
              <th className="px-4 py-2 border">Species</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border text-center">Actions</th>

            </tr>
          </thead>
          <tbody>
            {rabiesHistories
              .filter((history) => {
                const matchesSearch =
                  history.victimProfile.name
                    .toLowerCase()
                    .includes(filters.search.toLowerCase()) ||
                    history.victimProfile.name
                    .toLowerCase()
                    .includes(filters.search.toLowerCase()) ||
                  history.victimProfile.timeOfBite
                    .toLowerCase()
                    .includes(filters.search.toLowerCase());
                const matchesStatus =
                  !filters.status || history.formStatus === filters.status;
                return matchesSearch && matchesStatus;
              })
              .slice(
                (currentPage - 1) * formsPerPage,
                currentPage * formsPerPage
              )
              .map((history) => (
                <tr key={history._id}>
                  <td className="border px-4 py-2">
                    {history.victimProfile.name}
                  </td>
                  <td className="border px-4 py-2">
                    {history.victimProfile.timeOfBite}
                  </td>
                  <td className="border px-4 py-2">
                    {history.animalProfile.species}
                  </td>
                  <td className="border px-4 py-2">{history.formStatus}</td>
                  <td className="border px-4 py-2 text-center space-x-2">
                    
                    <button
                      onClick={() => openEditStatusModal(history)}
                      className="px-4 py-2 bg-darkgreen text-white rounded"
                    >
                      Edit Status
                    </button>
                    <button
                      onClick={() => openDetailsModal(history)}
                      className="px-4 py-2 bg-pastelyellow text-black rounded"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {/* Pagination can be added here */}
    </div>
  );
}

export default RabiesHistoryFormLists;
