import React, { useState, useEffect } from "react";
import axiosInstance from "../../component/axiosInstance";
import Modal from "../../component/Modal";
import SuccessModal from "../../component/SuccessModal";
import StepperComponent from "../../component/StepperComponent";
import DiseaseInvestigationForm from "./DiseaseInvestigationForm";

const DiseaseInvestigationTable = () => {
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editStatusModalOpen, setEditStatusModalOpen] = useState(false);
  const [selectedInvestigation, setSelectedInvestigation] = useState(null);
  const [newStatus, setNewStatus] = useState("Pending");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const [investigations, setInvestigations] = useState([]);

  const pages =
    [
      "Basic Information",
      "Investigation Details",
      "Diagnosis & Measures",
      "Additional Details",
    ] || [];

  useEffect(() => {
    fetchData();
  }, [formModalOpen, editStatusModalOpen, showSuccessModal]);

  const fetchData = () => {
    axiosInstance
      .get("/disease-investigation")
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  const handleOpenModal = (investigation) => {
    setSelectedInvestigation(investigation);
    setIsModalOpen(true);
    setActiveStep(0); // Reset active step when opening modal
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

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedInvestigation(null);
  };

  const handleOpenEditStatusModal = (investigation) => {
    setSelectedInvestigation(investigation);
    setEditStatusModalOpen(true);
    setNewStatus(investigation.status); // Set the current status for editing
  };

  const handleCancelEditStatus = () => {
    setEditStatusModalOpen(false); // Close the modal
    setNewStatus(selectedInvestigation?.status); // Reset newStatus to current status if needed
  };

  const handleCloseEditStatusModal = () => {
    setEditStatusModalOpen(false);
    setSelectedInvestigation(null); // Clear selected investigation when closing
  };

  // Edit status function
  const handleEditStatus = async () => {
    if (!selectedInvestigation) return;

    try {
      await axiosInstance.put(
        `/disease-investigation/${selectedInvestigation._id}`,
        { status: newStatus }
      );
      fetchData(); // Fetch updated data
      handleCloseEditStatusModal();
      setSuccessMessage("Status updated successfully!");
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const renderStepContent = (pages) => {
    if (!selectedInvestigation) return null;

    switch (pages) {
      case 0:
        return (
          <div className="max-h-[70vh]">
            <h2 className="text-xl font-bold mb-4">Basic Information</h2>
            <table className="min-w-full border border-gray-300 rounded-lg">
              <tbody>
                <tr>
                  <td className="border p-2 font-semibold">Status</td>
                  <td className="border p-2">{selectedInvestigation.status}</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">No. of Visits</td>
                  <td className="border p-2">
                    {selectedInvestigation.noOfVisit}
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Date Reported</td>
                  <td className="border p-2">
                    {new Date(
                      selectedInvestigation.dateReported
                    ).toLocaleDateString()}
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Date of Visit</td>
                  <td className="border p-2">
                    {new Date(
                      selectedInvestigation.dateOfVisit
                    ).toLocaleDateString()}
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Farmer Name</td>
                  <td className="border p-2">
                    {selectedInvestigation.farmerName}
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Farm Type</td>
                  <td className="border p-2">
                    {selectedInvestigation.farmType.join(", ")}
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Remarks</td>
                  <td className="border p-2">
                    {selectedInvestigation.remarks}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        );
      case 1:
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">Investigation Details</h2>
            <table className="min-w-full border border-gray-300 rounded-lg">
              <tbody>
                <tr>
                  <td className="border p-2 font-semibold">Investigator</td>
                  <td className="border p-2">
                    {selectedInvestigation.investigator}
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Place Affected</td>
                  <td className="border p-2">
                    {selectedInvestigation.placeAffected}
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Latitude</td>
                  <td className="border p-2">
                    {selectedInvestigation.latitude}
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Longitude</td>
                  <td className="border p-2">
                    {selectedInvestigation.longitude}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        );
      case 2:
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">Diagnosis & Measures</h2>
            <table className="min-w-full border border-gray-300 rounded-lg">
              <tbody>
                <tr>
                  <td className="border p-2 font-semibold">
                    Probable Source of Infection
                  </td>
                  <td className="border p-2">
                    {selectedInvestigation.propablesourceofinfection}
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Control Measures</td>
                  <td className="border p-2">
                    {selectedInvestigation.controlmeasures}
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">
                    Tentative Diagnosis
                  </td>
                  <td className="border p-2">
                    {selectedInvestigation.tentativediagnosis}
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Final Diagnosis</td>
                  <td className="border p-2">
                    {selectedInvestigation.finaldiagnosis}
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">
                    Nature of Diagnosis
                  </td>
                  <td className="border p-2">
                    {selectedInvestigation.natureofdiagnosis}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        );
      case 3:
        return (
          <div className="p-6 bg-white rounded-lg shadow-md ">
            <h2 className="text-2xl font-bold mb-6 text-black">
              Details of Investigation
            </h2>

            {/* Details Table */}
            <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300 rounded-lg mb-6 overflow-x-auto">
              <thead>
                <tr className="bg-darkgreen text-white">
                  <th className="border p-2">Species</th>
                  <th className="border p-2">Sex</th>
                  <th className="border p-2">Age</th>
                  <th className="border p-2">Population</th>
                  <th className="border p-2">Cases</th>
                  <th className="border p-2">Deaths</th>
                  <th className="border p-2">Destroyed</th>
                  <th className="border p-2">Slaughtered</th>
                  <th className="border p-2">Vaccine History</th>
                  <th className="border p-2">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {selectedInvestigation.details.map((detail, idx) => (
                  <tr key={idx} className="hover:bg-gray-100">
                    <td className="border p-2">{detail.species}</td>
                    <td className="border p-2">{detail.sex}</td>
                    <td className="border p-2">{detail.age}</td>
                    <td className="border p-2">{detail.population}</td>
                    <td className="border p-2">{detail.cases}</td>
                    <td className="border p-2">{detail.deaths}</td>
                    <td className="border p-2">{detail.destroyed}</td>
                    <td className="border p-2">{detail.slaughtered}</td>
                    <td className="border p-2">{detail.vaccineHistory}</td>
                    <td className="border p-2">{detail.remarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>

            {/* Clinical Signs */}
            <h2 className="text-2xl font-bold mb-4 text-black">
              Clinical Signs
            </h2>
            <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300 rounded-lg mb-6 overflow-x-auto">
              <thead>
                <tr className="bg-darkgreen text-white">
                  <th className="border p-2">Description</th>
                </tr>
              </thead>
              <tbody>
                {selectedInvestigation.clinicalSigns.map((sign, idx) => (
                  <tr key={`clinicalSign-${idx}`} className="hover:bg-gray-100">
                    <td className="border p-2">{sign.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
            

            {/* Movement Table */}
            <h2 className="text-2xl font-bold mb-4 text-black">Movement</h2>
            <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300 rounded-lg overflow-x-auto">
              <thead>
                <tr className="bg-darkgreen text-white">
                  <th className="border p-2">Movement Date</th>
                  <th className="border p-2">Mode</th>
                  <th className="border p-2">Type</th>
                  <th className="border p-2">Barangay</th>
                  <th className="border p-2">Municipality</th>
                  <th className="border p-2">Province</th>
                </tr>
              </thead>
              <tbody>
                {selectedInvestigation.movement.map((move, idx) => (
                  <tr key={`movement-${idx}`} className="hover:bg-gray-100">
                    <td className="border p-2">
                      {new Date(move.date).toLocaleDateString()}
                    </td>
                    <td className="border p-2">{move.mode}</td>
                    <td className="border p-2">{move.type}</td>
                    <td className="border p-2">{move.barangay}</td>
                    <td className="border p-2">{move.municipality}</td>
                    <td className="border p-2">{move.province}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
            
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-2">
      <h1 className="text-2xl font-bold mb-6">Disease Investigation Reports</h1>

    <div className="md:w-full">
      <button
        onClick={() => setFormModalOpen(true)}
        className="lg:w-auto px-4 py-2 w-full bg-darkgreen text-white rounded"
      >
        Investigation Report Form
      </button>
      </div>

      <div className="overflow-x-auto mt-4">
        <table className="min-w-full border border-gray-300 rounded-lg">
          <thead>
            <tr className="bg-darkgreen text-white">
              <th className="border border-gray-300 p-2">Investigator</th>
              <th className="border border-gray-300 p-2">Farm Type</th>
              <th className="border border-gray-300 p-2">Date Reported</th>
              <th className="border border-gray-300 p-2">Status</th>
              <th className="border border-gray-300 p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((investigation) => (
              <tr key={investigation.id} className="hover:bg-gray-100">
                <td className="border border-gray-300 p-2">
                  {investigation.investigator}
                </td>
                <td className="border border-gray-300 p-2">
                  {investigation.farmType}
                </td>
                <td className="border border-gray-300 p-2">
                  {new Date(investigation.dateReported).toLocaleDateString()}
                </td>
                <td className="border border-gray-300 p-2">
                  {investigation.status}
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <div className="flex items-center justify-center flex-col lg:flex-row w-full gap-2">
                  <button
                    onClick={() => handleOpenEditStatusModal(investigation)}
                    className="lg:w-auto w-full px-4 py-2 bg-darkgreen text-white rounded"
                  >
                    Edit Status
                  </button>
                  <button
                    onClick={() => handleOpenModal(investigation)}
                    className="lg:w-auto w-full px-4 py-2 bg-pastelyellow text-black rounded"
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

      {/* Modal for Viewing Investigation Details */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <h2 className="text-2xl font-bold mb-4">Investigation Details</h2>
        <StepperComponent pages={pages} renderStepContent={renderStepContent} />
      </Modal>

      {/* Modal for New Investigation Form */}
      <Modal isOpen={formModalOpen} onClose={() => setFormModalOpen(false)}>
        <DiseaseInvestigationForm
          onClose={() => setFormModalOpen(false)}
          refreshData={fetchData}
        />
      </Modal>

      {/* Modal for Editing Status */}
      <Modal isOpen={editStatusModalOpen} onClose={handleCloseEditStatusModal}>
        <h2 className="text-xl font-bold mb-4">Edit Status</h2>
        <div>
          <label htmlFor="status" className="block mb-2">
            Select New Status:
          </label>
          <select
            id="status"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            className="border rounded px-2 py-1 w-full"
          >
            <option value="Pending">Pending</option>
            <option value="Accepted">Accepted</option>
            <option value="Completed">Completed</option>
            <option value="Deleted">Deleted</option>
          </select>
          <div className="flex justify-end mt-4 space-x-2">
            <button
              onClick={handleEditStatus}
              className="md:w-full px-4 py-2 bg-darkgreen text-white rounded"
            >
              Save Changes
            </button>
            <button
              onClick={handleCancelEditStatus} // Call the cancel function here
              className="md:w-full px-4 py-2 bg-red-500 text-white rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        message={successMessage}
        onClose={() => setShowSuccessModal(false)}
      />
    </div>
  );
};

export default DiseaseInvestigationTable;
