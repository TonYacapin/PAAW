import React, { useEffect, useState } from "react";
import axiosInstance from "../../component/axiosInstance";
import Modal from "../../component/Modal";
import DiseaseInvestigationForm from "./DiseaseInvestigationForm";
import SuccessModal from "../../component/SuccessModal"; // Import SuccessModal component

const DiseaseInvestigationTable = () => {
  const [investigations, setInvestigations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editStatusModalOpen, setEditStatusModalOpen] = useState(false);
  const [selectedInvestigation, setSelectedInvestigation] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false); // Success modal state
  const [successMessage, setSuccessMessage] = useState(""); // Message for success modal

  // State variables for filters
  const [filters, setFilters] = useState({
    search: "",
    status: "",
  });

  const handleViewDetails = (investigation) => {
    setSelectedInvestigation(investigation);
    setIsModalOpen(true);
  };

  // Add these state variables for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const formsPerPage = 10;

  useEffect(() => {
    const fetchInvestigations = async () => {
      try {
        const response = await axiosInstance.get("/disease-investigation");
        setInvestigations(response.data);
      } catch (error) {
        console.error("Error fetching investigations:", error);
      }
    };

    fetchInvestigations();
  }, []);

  const handleRowClick = (investigation) => {
    setSelectedInvestigation(investigation);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedInvestigation(null);
  };

  const handleOpenFormModal = () => {
    setFormModalOpen(true);
  };

  const handleCloseFormModal = () => {
    setFormModalOpen(false);
  };

  const handleOpenEditStatusModal = (investigation) => {
    setSelectedInvestigation(investigation);
    setNewStatus(investigation.formStatus); // Set initial value to current status
    setEditStatusModalOpen(true);
  };

  const handleCloseEditStatusModal = () => {
    setEditStatusModalOpen(false);
    setSelectedInvestigation(null);
  };

  const handleEditStatus = async () => {
    if (!selectedInvestigation) return;

    try {
      await axiosInstance.put(
        `/disease-investigation/${selectedInvestigation._id}`,
        { status: newStatus }
      );
      setInvestigations((prev) =>
        prev.map((investigation) =>
          investigation._id === selectedInvestigation._id
            ? { ...investigation, formStatus: newStatus }
            : investigation
        )
      );
      handleCloseEditStatusModal();
      setSuccessMessage("Status updated successfully!"); // Set success message
      setShowSuccessModal(true); // Show success modal
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const filteredInvestigations = investigations.filter((item) => {
    const searchTerm = filters.search.toLowerCase();
    const matchesSearch = item.farmerName.toLowerCase().includes(searchTerm);
    const matchesFormStatus =
      !filters.status ||
      item.formStatus.toLowerCase().includes(filters.status.toLowerCase());
    return matchesSearch && matchesFormStatus;
  });

  // Sort forms from newest to oldest by dateReported
  const sortedInvestigations = filteredInvestigations.sort(
    (a, b) => new Date(b.dateReported) - new Date(a.dateReported)
  );

  // Pagination logic
  const totalPages = Math.ceil(sortedInvestigations.length / formsPerPage);
  const paginatedInvestigations = sortedInvestigations.slice(
    (currentPage - 1) * formsPerPage,
    currentPage * formsPerPage
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Disease Investigation Reports</h1>

      {/* Filters Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <input
          type="text"
          placeholder="Filter by Farmer Name"
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

      <button
        onClick={handleOpenFormModal}
        className="mb-4 px-4 py-2 bg-darkgreen text-white rounded"
      >
        Open Disease Investigation Form
      </button>

      {/* <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-lg rounded-lg">
          <thead className='bg-pastelyellow text-sm'>
            <tr>
              <th className="py-3 px-6">Farmer Name</th>
              <th className="py-3 px-6">Farm Type</th>
              <th className="py-3 px-6">Control Measures</th>
              <th className="py-3 px-6">Tentative Diagnosis</th>
              <th className="py-3 px-6">Final Diagnosis</th>
              <th className="py-3 px-6">Nature of Diagnosis</th>
              <th className="py-3 px-6">Form Status</th>
              <th className="py-3 px-6">Actions</th> */}
      <div className="overflow-auto border rounded-lg">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-[#1b5b40] text-white">
              <th className="border border-gray-300 p-4">Farmer Name</th>
              <th className="border border-gray-300 p-4">Farm Type</th>
              <th className="border border-gray-300 p-4">Control Measures</th>
              <th className="border border-gray-300 p-4">
                Tentative Diagnosis
              </th>
              <th className="border border-gray-300 p-4">Final Diagnosis</th>
              <th className="border border-gray-300 p-4">
                Nature of Diagnosis
              </th>
              <th className="border border-gray-300 p-4">Form Status</th>
              <th className="border border-gray-300 p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedInvestigations.map((item, index) => (
              <tr key={item._id} className="hover:bg-gray-50">
                <td className="border border-gray-300 p-4">
                  {item.farmerName}
                </td>
                <td className="border border-gray-300 p-4">
                  {item.farmType.join(", ")}
                </td>
                <td className="border border-gray-300 p-4">
                  {item.controlmeasures}
                </td>
                <td className="border border-gray-300 p-4">
                  {item.tentativediagnosis}
                </td>
                <td className="border border-gray-300 p-4">
                  {item.finaldiagnosis}
                </td>
                <td className="border border-gray-300 p-4">
                  {item.natureofdiagnosis}
                </td>
                <td className="border border-gray-300 p-4">
                  {item.formStatus}
                </td>
                <td className="border border-gray-300 p-4 text-center flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering row click
                      handleOpenEditStatusModal(item);
                    }}
                    className="px-2 py-1 bg-[#1b5b40] text-white rounded hover:bg-darkergreen"
                  >
                    Edit Status
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering row click
                      handleViewDetails(item);
                    }}
                    className="px-2 py-1 bg-pastelyellow text-black rounded hover:bg-darkerpastelyellow"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-lg text-white bg-darkgreen hover:bg-darkergreen disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

      {/* Modal for displaying detailed information */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        {selectedInvestigation && (
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-darkgreen">
              Investigation Details
            </h2>
            <div className="space-y-2">
              <p>
                <strong>Status:</strong>{" "}
                <span className="text-gray-700">
                  {selectedInvestigation.status}
                </span>
              </p>
              <p>
                <strong>No. of Visits:</strong>{" "}
                <span className="text-gray-700">
                  {selectedInvestigation.noOfVisit}
                </span>
              </p>
              <p>
                <strong>Date Reported:</strong>{" "}
                <span className="text-gray-700">
                  {new Date(
                    selectedInvestigation.dateReported
                  ).toLocaleDateString()}
                </span>
              </p>
              <p>
                <strong>Date of Visit:</strong>{" "}
                <span className="text-gray-700">
                  {new Date(
                    selectedInvestigation.dateOfVisit
                  ).toLocaleDateString()}
                </span>
              </p>
              <p>
                <strong>Investigator:</strong>{" "}
                <span className="text-gray-700">
                  {selectedInvestigation.investigator}
                </span>
              </p>
              <p>
                <strong>Place Affected:</strong>{" "}
                <span className="text-gray-700">
                  {selectedInvestigation.placeAffected}
                </span>
              </p>
              <p>
                <strong>Farmer Name:</strong>{" "}
                <span className="text-gray-700">
                  {selectedInvestigation.farmerName}
                </span>
              </p>
              <p>
                <strong>Farm Type:</strong>{" "}
                <span className="text-gray-700">
                  {selectedInvestigation.farmType.join(", ")}
                </span>
              </p>
              <p>
                <strong>Probable Source of Infection:</strong>{" "}
                <span className="text-gray-700">
                  {selectedInvestigation.probablesourceofinfection}
                </span>
              </p>
              <p>
                <strong>Control Measures:</strong>{" "}
                <span className="text-gray-700">
                  {selectedInvestigation.controlmeasures}
                </span>
              </p>
              <p>
                <strong>Remarks:</strong>{" "}
                <span className="text-gray-700">
                  {selectedInvestigation.remarks}
                </span>
              </p>
              <p>
                <strong>Tentative Diagnosis:</strong>{" "}
                <span className="text-gray-700">
                  {selectedInvestigation.tentativediagnosis}
                </span>
              </p>
              <p>
                <strong>Final Diagnosis:</strong>{" "}
                <span className="text-gray-700">
                  {selectedInvestigation.finaldiagnosis}
                </span>
              </p>
              <p>
                <strong>Nature of Diagnosis:</strong>{" "}
                <span className="text-gray-700">
                  {selectedInvestigation.natureofdiagnosis}
                </span>
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span className="text-gray-700">
                  {selectedInvestigation.status}
                </span>
              </p>
              <p>
                <strong>No. of Visits:</strong>{" "}
                <span className="text-gray-700">
                  {selectedInvestigation.noOfVisit}
                </span>
              </p>
              <p>
                <strong>Date Reported:</strong>{" "}
                <span className="text-gray-700">
                  {new Date(
                    selectedInvestigation.dateReported
                  ).toLocaleDateString()}
                </span>
              </p>
              <p>
                <strong>Date of Visit:</strong>{" "}
                <span className="text-gray-700">
                  {new Date(
                    selectedInvestigation.dateOfVisit
                  ).toLocaleDateString()}
                </span>
              </p>
              <p>
                <strong>Investigator:</strong>{" "}
                <span className="text-gray-700">
                  {selectedInvestigation.investigator}
                </span>
              </p>
              <p>
                <strong>Place Affected:</strong>{" "}
                <span className="text-gray-700">
                  {selectedInvestigation.placeAffected}
                </span>
              </p>
              <p>
                <strong>Farmer Name:</strong>{" "}
                <span className="text-gray-700">
                  {selectedInvestigation.farmerName}
                </span>
              </p>
              <p>
                <strong>Farm Type:</strong>{" "}
                <span className="text-gray-700">
                  {selectedInvestigation.farmType.join(", ")}
                </span>
              </p>
              <p>
                <strong>Probable Source of Infection:</strong>{" "}
                <span className="text-gray-700">
                  {selectedInvestigation.probablesourceofinfection}
                </span>
              </p>
              <p>
                <strong>Control Measures:</strong>{" "}
                <span className="text-gray-700">
                  {selectedInvestigation.controlmeasures}
                </span>
              </p>
              <p>
                <strong>Remarks:</strong>{" "}
                <span className="text-gray-700">
                  {selectedInvestigation.remarks}
                </span>
              </p>
              <p>
                <strong>Tentative Diagnosis:</strong>{" "}
                <span className="text-gray-700">
                  {selectedInvestigation.tentativediagnosis}
                </span>
              </p>
              <p>
                <strong>Final Diagnosis:</strong>{" "}
                <span className="text-gray-700">
                  {selectedInvestigation.finaldiagnosis}
                </span>
              </p>
              <p>
                <strong>Nature of Diagnosis:</strong>{" "}
                <span className="text-gray-700">
                  {selectedInvestigation.natureofdiagnosis}
                </span>
              </p>
              <p>
                <strong>Form Status:</strong>{" "}
                <span className="text-gray-700">
                  {selectedInvestigation.formStatus}
                </span>
              </p>
            </div>

            {/* Map through details array */}
            <h3 className="font-bold mt-6 text-lg text-darkgreen">Details:</h3>
            <div className="space-y-2">
              {selectedInvestigation.details.map((detail, index) => (
                <div key={index} className="p-2 border border-gray-300 rounded">
                  <p>
                    <strong>No:</strong> {detail.no}
                  </p>
                  <p>
                    <strong>Species:</strong> {detail.species}
                  </p>
                  <p>
                    <strong>Sex:</strong> {detail.sex}
                  </p>
                  <p>
                    <strong>Age:</strong> {detail.age}
                  </p>
                  <p>
                    <strong>Pop'n:</strong> {detail.population}
                  </p>
                  <p>
                    <strong>Cases:</strong> {detail.cases}
                  </p>
                  <p>
                    <strong>Deaths:</strong> {detail.deaths}
                  </p>
                  <p>
                    <strong>Destroyed:</strong> {detail.destroyed}
                  </p>
                  <p>
                    <strong>Slaughtered:</strong> {detail.slaughtered}
                  </p>
                  <p>
                    <strong>Vaccine History:</strong> {detail.vaccineHistory}
                  </p>
                  <p>
                    <strong>Remarks:</strong> {detail.remarks}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>

      {/* Modal for adding/editing disease investigations */}
      <Modal isOpen={formModalOpen} onClose={handleCloseFormModal}>
        <DiseaseInvestigationForm />
      </Modal>

      {isModalOpen && selectedInvestigation && (
        <Modal onClose={handleCloseModal}>
          <h2 className="text-xl font-bold mb-4">Investigation Details</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 rounded-lg">
              <tbody>
                <tr className="bg-gray-100">
                  <td className="border border-gray-300 p-4 font-semibold">
                    Status
                  </td>
                  <td className="border border-gray-300 p-4">
                    {selectedInvestigation.status}
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-4 font-semibold">
                    No. of Visits
                  </td>
                  <td className="border border-gray-300 p-4">
                    {selectedInvestigation.noOfVisit}
                  </td>
                </tr>
                <tr className="bg-gray-100">
                  <td className="border border-gray-300 p-4 font-semibold">
                    Date Reported
                  </td>
                  <td className="border border-gray-300 p-4">
                    {new Date(
                      selectedInvestigation.dateReported
                    ).toLocaleDateString()}
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-4 font-semibold">
                    Date of Visit
                  </td>
                  <td className="border border-gray-300 p-4">
                    {new Date(
                      selectedInvestigation.dateOfVisit
                    ).toLocaleDateString()}
                  </td>
                </tr>
                <tr className="bg-gray-100">
                  <td className="border border-gray-300 p-4 font-semibold">
                    Investigator
                  </td>
                  <td className="border border-gray-300 p-4">
                    {selectedInvestigation.investigator}
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-4 font-semibold">
                    Place Affected
                  </td>
                  <td className="border border-gray-300 p-4">
                    {selectedInvestigation.placeAffected}
                  </td>
                </tr>
                <tr className="bg-gray-100">
                  <td className="border border-gray-300 p-4 font-semibold">
                    Latitude
                  </td>
                  <td className="border border-gray-300 p-4">
                    {selectedInvestigation.latitude}
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-4 font-semibold">
                    Longitude
                  </td>
                  <td className="border border-gray-300 p-4">
                    {selectedInvestigation.longitude}
                  </td>
                </tr>
                <tr className="bg-gray-100">
                  <td className="border border-gray-300 p-4 font-semibold">
                    Farmer Name
                  </td>
                  <td className="border border-gray-300 p-4">
                    {selectedInvestigation.farmerName}
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-4 font-semibold">
                    Farm Type
                  </td>
                  <td className="border border-gray-300 p-4">
                    {selectedInvestigation.farmType.join(", ")}
                  </td>
                </tr>
                <tr className="bg-gray-100">
                  <td className="border border-gray-300 p-4 font-semibold">
                    Probable Source of Infection
                  </td>
                  <td className="border border-gray-300 p-4">
                    {selectedInvestigation.propablesourceofinfection}
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-4 font-semibold">
                    Control Measures
                  </td>
                  <td className="border border-gray-300 p-4">
                    {selectedInvestigation.controlmeasures}
                  </td>
                </tr>
                <tr className="bg-gray-100">
                  <td className="border border-gray-300 p-4 font-semibold">
                    Tentative Diagnosis
                  </td>
                  <td className="border border-gray-300 p-4">
                    {selectedInvestigation.tentativediagnosis}
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-4 font-semibold">
                    Final Diagnosis
                  </td>
                  <td className="border border-gray-300 p-4">
                    {selectedInvestigation.finaldiagnosis}
                  </td>
                </tr>
                <tr className="bg-gray-100">
                  <td className="border border-gray-300 p-4 font-semibold">
                    Nature of Diagnosis
                  </td>
                  <td className="border border-gray-300 p-4">
                    {selectedInvestigation.natureofdiagnosis}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <button
            onClick={handleCloseModal}
            className="mt-4 px-4 py-2 bg-gray-500 text-white rounded"
          >
            Close
          </button>
        </Modal>
      )}

      {/* Modal for editing the status */}
      <Modal isOpen={editStatusModalOpen} onClose={handleCloseEditStatusModal}>
        {selectedInvestigation && (
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4">Edit Form Status</h2>
            <div className="mb-4">
              <label className="block mb-2 font-medium">New Status</label>
              <select
                value={newStatus} // Bind to newStatus state
                onChange={(e) => setNewStatus(e.target.value)} // Update newStatus state
                className="w-full px-4 py-2 border border-gray-300 rounded"
              >
                <option value="Pending">Pending</option>
                <option value="Accepted">Accepted</option>
                <option value="Deleted">Deleted</option>
              </select>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={handleEditStatus}
                className="px-4 py-2 bg-darkgreen text-white rounded"
              >
                Save
              </button>
              <button
                onClick={handleCloseEditStatusModal}
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
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message={successMessage}
      />
    </div>
  );
};

export default DiseaseInvestigationTable;
