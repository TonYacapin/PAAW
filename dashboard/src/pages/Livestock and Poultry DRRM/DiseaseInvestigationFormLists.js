import React, { useState, useEffect } from "react";
import axiosInstance from "../../component/axiosInstance";
import Modal from "../../component/Modal";
import SuccessModal from "../../component/SuccessModal";
import StepperComponent from "../../component/StepperComponent";
import DiseaseInvestigationForm from "./DiseaseInvestigationForm";
import CardBox from "../../component/CardBox";

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
    setNewStatus(investigation.formStatus); // Set the current status for editing
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
        { formStatus: newStatus }
      );
      fetchData(); // Fetch updated data
      handleCloseEditStatusModal();
      setSuccessMessage("Status updated successfully!");
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const tableheader = "border p-2 font-semibold bg-[#1b5b40] text-white";

  const renderStepContent = (pages) => {
    if (!selectedInvestigation) return null;

    switch (pages) {
      case 0:
        return (
          <div className="max-h-[70vh] flex-col flex gap-4">
            <h2 className="text-xl font-bold mb-4">Basic Information</h2>

            {/* <div>
              <strong>Status:</strong> {selectedInvestigation.status}
            </div> */}
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
          <h2 className="text-lg font-bold">
              Form Status:{" "}
              <div
                className={`inline p-1 rounded-sm ${
                  selectedInvestigation.formStatus.includes("Deleted")
                    ? "bg-red-100 text-red-800"
                    : selectedInvestigation.formStatus.includes("Pending")
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {selectedInvestigation.formStatus}
              </div>
            </h2>
            <h2 className="text-lg font-bold mb-6">
              Investigation Status:{" "}
              <div
                className={`inline p-1 rounded-sm ${
                  selectedInvestigation.status.includes("new")
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {selectedInvestigation.status}
              </div>
            </h2>
            <div>
              <strong>No. of Visits:</strong> {selectedInvestigation.noOfVisit}
            </div>

            <div>
              <strong>Date Reported:</strong>{" "}
              {new Date(
                selectedInvestigation.dateReported
              ).toLocaleDateString()}
            </div>

            <div>
              <strong>Date of Visit:</strong>{" "}
              {new Date(selectedInvestigation.dateOfVisit).toLocaleDateString()}
            </div>

            <div>
              <strong>Farmer Name:</strong> {selectedInvestigation.farmerName}
            </div>

            <div>
              <strong>Farm Type:</strong>{" "}
              {selectedInvestigation.farmType.join(", ")}
            </div>

            <div>
              <strong>Remarks:</strong> {selectedInvestigation.remarks}
            </div>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="max-h-[70vh] flex-col flex gap-4">
            <h2 className="text-xl font-bold mb-4">Investigation Details</h2>
            <div className="mb-2">
              <strong>Investigator:</strong>{" "}
              {selectedInvestigation.investigator}
            </div>
            <div className="mb-2">
              <strong>Place Affected:</strong>{" "}
              {selectedInvestigation.placeAffected}
            </div>
            <div className="mb-2">
              <strong>Latitude:</strong> {selectedInvestigation.latitude}
            </div>
            <div className="mb-2">
              <strong>Longitude:</strong> {selectedInvestigation.longitude}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="max-h-[70vh] flex-col flex gap-4">
            <h2 className="text-xl font-bold mb-4">Diagnosis & Measures</h2>
            <div className="mb-2">
              <strong>Probable Source of Infection:</strong>{" "}
              {selectedInvestigation.propablesourceofinfection}
            </div>
            <div className="mb-2">
              <strong>Control Measures:</strong>{" "}
              {selectedInvestigation.controlmeasures}
            </div>
            <div className="mb-2">
              <strong>Tentative Diagnosis:</strong>{" "}
              {selectedInvestigation.tentativediagnosis}
            </div>
            <div className="mb-2">
              <strong>Final Diagnosis:</strong>{" "}
              {selectedInvestigation.finaldiagnosis}
            </div>
            <div className="mb-2">
              <strong>Nature of Diagnosis:</strong>{" "}
              {selectedInvestigation.natureofdiagnosis}
            </div>
          </div>
        );
      case 3:
        return (
          <CardBox>
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
                    <tr
                      key={`clinicalSign-${idx}`}
                      className="hover:bg-gray-100"
                    >
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
          </CardBox>
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

      <div className="overflow-x-auto mt-4 border border-gray-300 rounded-lg">
        <table className="min-w-full ">
          <thead>
            <tr className="bg-darkgreen text-white">
              <th className="border border-gray-300 p-4">Investigator</th>
              <th className="border border-gray-300 p-4">Farm Type</th>
              <th className="border border-gray-300 p-4">Date Reported</th>
              <th className="border border-gray-300 p-4">Invest. Status</th>
              <th className="border border-gray-300 p-4">Form Status</th>
              <th className="border border-gray-300 p-4">Action</th>
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
                <td className="border border-gray-300 p-2">
                  {investigation.formStatus}
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <div className="flex items-center justify-center flex-col lg:flex-row w-full gap-2">
                    <button
                      onClick={() => handleOpenEditStatusModal(investigation)}
                      className="lg:w-auto w-full px-4 py-2 bg-darkgreen text-white rounded"
                    >
                      Edit Form Status
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
