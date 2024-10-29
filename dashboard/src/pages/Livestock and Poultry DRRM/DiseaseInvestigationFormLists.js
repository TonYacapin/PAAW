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

  const renderStepContent = (step) => {
    if (!selectedInvestigation) return null;

    switch (step) {
      case 0:
        return (
          <div className="max-h-[70vh]">
            <h2 className="text-xl font-bold mb-4">Basic Information</h2>
            <table className="min-w-full border border-gray-300 rounded-lg">
              <tbody>
                <tr>
                  <td className="border p-4 font-semibold">Status</td>
                  <td className="border p-4">{selectedInvestigation.status}</td>
                </tr>
                <tr>
                  <td className="border p-4 font-semibold">No. of Visits</td>
                  <td className="border p-4">
                    {selectedInvestigation.noOfVisit}
                  </td>
                </tr>
                <tr>
                  <td className="border p-4 font-semibold">Date Reported</td>
                  <td className="border p-4">
                    {new Date(
                      selectedInvestigation.dateReported
                    ).toLocaleDateString()}
                  </td>
                </tr>
                <tr>
                  <td className="border p-4 font-semibold">Date of Visit</td>
                  <td className="border p-4">
                    {new Date(
                      selectedInvestigation.dateOfVisit
                    ).toLocaleDateString()}
                  </td>
                </tr>
                <tr>
                  <td className="border p-4 font-semibold">Farmer Name</td>
                  <td className="border p-4">
                    {selectedInvestigation.farmerName}
                  </td>
                </tr>
                <tr>
                  <td className="border p-4 font-semibold">Farm Type</td>
                  <td className="border p-4">
                    {selectedInvestigation.farmType.join(", ")}
                  </td>
                </tr>
                <tr>
                  <td className="border p-4 font-semibold">Remarks</td>
                  <td className="border p-4">
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
                  <td className="border p-4 font-semibold">Investigator</td>
                  <td className="border p-4">
                    {selectedInvestigation.investigator}
                  </td>
                </tr>
                <tr>
                  <td className="border p-4 font-semibold">Place Affected</td>
                  <td className="border p-4">
                    {selectedInvestigation.placeAffected}
                  </td>
                </tr>
                <tr>
                  <td className="border p-4 font-semibold">Latitude</td>
                  <td className="border p-4">
                    {selectedInvestigation.latitude}
                  </td>
                </tr>
                <tr>
                  <td className="border p-4 font-semibold">Longitude</td>
                  <td className="border p-4">
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
                  <td className="border p-4 font-semibold">
                    Probable Source of Infection
                  </td>
                  <td className="border p-4">
                    {selectedInvestigation.propablesourceofinfection}
                  </td>
                </tr>
                <tr>
                  <td className="border p-4 font-semibold">Control Measures</td>
                  <td className="border p-4">
                    {selectedInvestigation.controlmeasures}
                  </td>
                </tr>
                <tr>
                  <td className="border p-4 font-semibold">
                    Tentative Diagnosis
                  </td>
                  <td className="border p-4">
                    {selectedInvestigation.tentativediagnosis}
                  </td>
                </tr>
                <tr>
                  <td className="border p-4 font-semibold">Final Diagnosis</td>
                  <td className="border p-4">
                    {selectedInvestigation.finaldiagnosis}
                  </td>
                </tr>
                <tr>
                  <td className="border p-4 font-semibold">
                    Nature of Diagnosis
                  </td>
                  <td className="border p-4">
                    {selectedInvestigation.natureofdiagnosis}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        );
      case 3:
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">Additional Details</h2>
            <table className="min-w-full border border-gray-300 rounded-lg">
              <tbody>
                {selectedInvestigation.details.map((detail, idx) => (
                  <React.Fragment key={idx}>
                    <tr>
                      <td className="border p-4 font-semibold">Species</td>
                      <td className="border p-4">{detail.species}</td>
                    </tr>
                    <tr>
                      <td className="border p-4 font-semibold">Sex</td>
                      <td className="border p-4">{detail.sex}</td>
                    </tr>
                    <tr>
                      <td className="border p-4 font-semibold">Age</td>
                      <td className="border p-4">{detail.age}</td>
                    </tr>
                    <tr>
                      <td className="border p-4 font-semibold">Population</td>
                      <td className="border p-4">{detail.population}</td>
                    </tr>
                    <tr>
                      <td className="border p-4 font-semibold">Cases</td>
                      <td className="border p-4">{detail.cases}</td>
                    </tr>
                    <tr>
                      <td className="border p-4 font-semibold">Deaths</td>
                      <td className="border p-4">{detail.deaths}</td>
                    </tr>
                    <tr>
                      <td className="border p-4 font-semibold">Destroyed</td>
                      <td className="border p-4">{detail.destroyed}</td>
                    </tr>
                    <tr>
                      <td className="border p-4 font-semibold">Slaughtered</td>
                      <td className="border p-4">{detail.slaughtered}</td>
                    </tr>
                    <tr>
                      <td className="border p-4 font-semibold">
                        Vaccine History
                      </td>
                      <td className="border p-4">{detail.vaccineHistory}</td>
                    </tr>
                    <tr>
                      <td className="border p-4 font-semibold">Remarks</td>
                      <td className="border p-4">{detail.remarks}</td>
                    </tr>
                  </React.Fragment>
                ))}
                {selectedInvestigation.clinicalSigns.map((sign, idx) => (
                  <tr key={`clinicalSign-${idx}`}>
                    <td className="border p-4 font-semibold">Clinical Sign</td>
                    <td className="border p-4">{sign.description}</td>
                  </tr>
                ))}
                {selectedInvestigation.movement.map((move, idx) => (
                  <React.Fragment key={`movement-${idx}`}>
                    <tr>
                      <td className="border p-4 font-semibold">
                        Movement Date
                      </td>
                      <td className="border p-4">
                        {new Date(move.date).toLocaleDateString()}
                      </td>
                    </tr>
                    <tr>
                      <td className="border p-4 font-semibold">Mode</td>
                      <td className="border p-4">{move.mode}</td>
                    </tr>
                    <tr>
                      <td className="border p-4 font-semibold">Type</td>
                      <td className="border p-4">{move.type}</td>
                    </tr>
                    <tr>
                      <td className="border p-4 font-semibold">Barangay</td>
                      <td className="border p-4">{move.barangay}</td>
                    </tr>
                    <tr>
                      <td className="border p-4 font-semibold">Municipality</td>
                      <td className="border p-4">{move.municipality}</td>
                    </tr>
                    <tr>
                      <td className="border p-4 font-semibold">Province</td>
                      <td className="border p-4">{move.province}</td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-4">
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
              <th className="border border-gray-300 p-4">Investigator</th>
              <th className="border border-gray-300 p-4">Farm Type</th>
              <th className="border border-gray-300 p-4">Date Reported</th>
              <th className="border border-gray-300 p-4">Status</th>
              <th className="border border-gray-300 p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((investigation) => (
              <tr key={investigation.id} className="hover:bg-gray-100">
                <td className="border border-gray-300 p-4">
                  {investigation.investigator}
                </td>
                <td className="border border-gray-300 p-4">
                  {investigation.farmType}
                </td>
                <td className="border border-gray-300 p-4">
                  {new Date(investigation.dateReported).toLocaleDateString()}
                </td>
                <td className="border border-gray-300 p-4">
                  {investigation.status}
                </td>
                <td className="border border-gray-300 p-4 text-center">
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
