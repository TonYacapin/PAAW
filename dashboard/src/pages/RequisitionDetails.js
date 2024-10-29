import React, { useState, useEffect } from "react";
import axiosInstance from "../component/axiosInstance";
import StepperComponent from "../component/StepperComponent";
import ErrorModal from "../component/ErrorModal";
import { jwtDecode } from "jwt-decode";
import SuccessModal from "../component/SuccessModal";

function RequisitionDetails({ requisition: initialRequisition }) {
  const [editableRows, setEditableRows] = useState({});
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(null);
  const [requisitionData, setRequisitionData] = useState(initialRequisition);
  const [currentStep, setCurrentStep] = useState(0);
  const [inventoryData, setInventoryData] = useState([]);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [userRole, setUserRole] = useState("");
  const [user, setUser] = useState("");

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false); // State for success modal
  const [successMessage, setSuccessMessage] = useState(""); // State for success message

  useEffect(() => {
    const fetchInventoryData = async () => {
      try {
        const response = await axiosInstance.get("/api/inventory");
        setInventoryData(response.data);
        console.log("Inventory Data:", response.data);
      } catch (error) {
        console.error("Error fetching inventory data:", error);
        setErrorMessage("Failed to fetch inventory data");
        setIsErrorModalOpen(true);
      }
    };

    fetchInventoryData();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const role = decodedToken.role;
        const email = decodedToken.email;
        console.log(role); // Adjust this key based on your token's structure
        console.log(email); // Adjust this key based on your token's structure
        setUserRole(role);
        setUser(email);
      } catch (error) {
        console.error("Invalid token", error);
      }
    }
  }, []);

  const handleEditToggle = (id) => {
    setEditableRows((prev) => {
      const newState = { ...prev };
      if (newState[id]) {
        delete newState[id];
      } else {
        newState[id] = true;
      }
      return newState;
    });
  };

  const handleInputChange = (id, field, value) => {
    setRequisitionData((prev) => ({
      ...prev,
      issuanceRows: prev.issuanceRows.map((row) =>
        row._id === id ? { ...row, [field]: value } : row
      ),
    }));
  };

  const checkInventoryAvailability = (rowToUpdate) => {
    // Find matching inventory item by type/supplies
    const inventoryItem = inventoryData.find(
      (item) =>
        item.supplies === rowToUpdate.description ||
        item.type === rowToUpdate.description
    );

    if (!inventoryItem) {
      throw new Error("Item not found in inventory");
    }

    const requestedQuantity = parseInt(rowToUpdate.quantity);
    const availableQuantity = inventoryItem.total;

    if (requestedQuantity > availableQuantity) {
      throw new Error(
        `Insufficient inventory. Available: ${availableQuantity}, Issued: ${requestedQuantity}`
      );
    }

    return true;
  };

  const saveChanges = async (rowId) => {
    try {
      const rowToUpdate = requisitionData.issuanceRows.find(
        (row) => row._id === rowId
      );
      if (!rowToUpdate) return;

      // Check inventory availability before saving
      checkInventoryAvailability(rowToUpdate);

      const updatedData = {
        ...requisitionData,
        issuanceRows: requisitionData.issuanceRows.map((row) => ({
          _id: row._id,
          quantity: row.quantity,
          description: row.description,
          remarks: row.remarks,
        })),
        formStatus: "Allotted",
      };

      const response = await axiosInstance.put(
        `/api/requisitions/${requisitionData._id}`,
        updatedData
      );

      setRequisitionData(response.data);
      handleEditToggle(rowId);
      setSaveError(null);
      //   setSaveSuccess("Changes saved successfully!");

      // Show success modal with a message
      setSuccessMessage(`Changes saved successfully!`);

      setIsSuccessModalOpen(true);

      //   setTimeout(() => {
      //     setSaveSuccess(null);
      //   }, 3000);
    } catch (error) {
      console.error(`Error saving changes for row ${rowId}:`, error);
      setErrorMessage(
        error.message || "Failed to save changes. Please try again."
      );
      setIsErrorModalOpen(true);
      setSaveError(error.message);
    }
  };

  const stepPages = [
    "Requisition Information",
    "Requisition Rows",
    "Issuance Rows",
  ];

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <>
            <h2 className="text-lg font-bold mb-6">
              Form Status:{" "}
              <div
                className={`inline p-1 rounded-sm ${
                  requisitionData.formStatus.includes("Pending")
                    ? "bg-red-100 text-red-800"
                    : requisitionData.formStatus.includes("Allotted")
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {requisitionData.formStatus}
              </div>
            </h2>
            <div className="w-full grid lg:grid-cols-3 grid-cols-1 gap-6">
              <p>
                <strong>Date:</strong>{" "}
                {new Date(requisitionData.date).toLocaleDateString()}
              </p>
              <p>
                <strong>Requisition ID:</strong> {requisitionData.risNo}
              </p>
              <p>
                <strong>Division:</strong> {requisitionData.division}
              </p>
              <p>
                <strong>Office:</strong> {requisitionData.office}
              </p>
              <p>
                <strong>Responsibility Center:</strong>{" "}
                {requisitionData.responsibilityCenter}
              </p>
              <p>
                <strong>Code:</strong> {requisitionData.code}
              </p>
              <p>
                <strong>SAI No.:</strong> {requisitionData.saiNo}
              </p>
              <p className="lg:col-span-2">
                <strong>Purpose:</strong> {requisitionData.purpose}
              </p>
              <p>
                <strong>Sent by:</strong> {requisitionData.sentby}
              </p>
              <p className="lg:col-span-2">
                <strong>Designation:</strong> {requisitionData.designation}
              </p>
              <p>
                <strong>Created At:</strong>{" "}
                {new Date(requisitionData.createdAt).toLocaleString()}
              </p>
              <p>
                <strong>Updated At:</strong>{" "}
                {new Date(requisitionData.updatedAt).toLocaleString()}
              </p>
            </div>
          </>
        );
      case 1:
        return (
          <>
            {" "}
            <h3 className="text-xl font-bold mb-4">Requisition</h3>
            <div className="overflow-auto border rounded-lg">
              <table className="min-w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-[#1b5b40] text-white">
                    <th className="border border-gray-300 p-2">Stock No</th>
                    <th className="border border-gray-300 p-2">Unit</th>
                    <th className="border border-gray-300 p-2">Quantity</th>
                    <th className="border border-gray-300 p-2">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {requisitionData.requisitionRows.map((row) => (
                    <tr key={row._id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 p-2">
                        {row.stockNo}
                      </td>
                      <td className="border border-gray-300 p-2">{row.unit}</td>
                      <td className="border border-gray-300 p-2">
                        {row.quantity}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {row.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        );
      case 2:
        return (
          <div>
            <h3 className="text-xl font-bold mb-4">Issuance</h3>

            <div className="overflow-auto border rounded-lg">
              <table className="min-w-full border-collapse border">
                <thead>
                  <tr className="bg-[#1b5b40] text-white">
                    <th className="border border-gray-300 p-2">Quantity</th>
                    <th className="border border-gray-300 p-2">Description</th>
                    <th className="border border-gray-300 p-2">Remarks</th>
                    {userRole === "admin" &&
                      requisitionData.formStatus !== "Distributed" && (
                        <th className="border border-gray-300 p-2">Actions</th>
                      )}
                  </tr>
                </thead>
                <tbody>
                  {requisitionData.issuanceRows.map((row) => (
                    <tr key={row._id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 p-2">
                        {editableRows[row._id] ? (
                          <input
                            type="number"
                            value={row.quantity || ""}
                            onChange={(e) =>
                              handleInputChange(
                                row._id,
                                "quantity",
                                e.target.value
                              )
                            }
                            className="w-full border border-gray-300 p-1 rounded"
                          />
                        ) : (
                          row.quantity ?? "0"
                        )}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {editableRows[row._id] ? (
                          <input
                            type="text"
                            value={row.description || ""}
                            onChange={(e) =>
                              handleInputChange(
                                row._id,
                                "description",
                                e.target.value
                              )
                            }
                            className="w-full border border-gray-300 p-1 rounded"
                          />
                        ) : (
                          row.description
                        )}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {editableRows[row._id] ? (
                          <input
                            type="text"
                            value={row.remarks || ""}
                            onChange={(e) =>
                              handleInputChange(
                                row._id,
                                "remarks",
                                e.target.value
                              )
                            }
                            className="w-full border border-gray-300 p-1 rounded"
                          />
                        ) : (
                          row.remarks || "N/A"
                        )}
                      </td>
                      {userRole === "admin" &&
                        requisitionData.formStatus !== "Distributed" && (
                          <td className="border border-gray-300 p-2 text-center">
                            {editableRows[row._id] ? (
                              <button
                                onClick={() => saveChanges(row._id)}
                                className="px-4 py-2 bg-darkgreen text-white rounded"
                              >
                                Save Issuance
                              </button>
                            ) : (
                              <button
                                onClick={() => handleEditToggle(row._id)}
                                className="px-4 py-2 bg-darkgreen text-white rounded"
                              >
                                Issue
                              </button>
                            )}
                          </td>
                        )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      default:
        return <div>Unknown step</div>;
    }
  };

  return (
    <div className="p-4">
      <h3 className="text-2xl font-bold mb-4">Requisition Details</h3>
      {saveError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
          {saveError}
        </div>
      )}
      {saveSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-4">
          {saveSuccess}
        </div>
      )}

      <StepperComponent
        pages={stepPages}
        renderStepContent={renderStepContent}
        onStepChange={setCurrentStep}
      />

      {/* Success Modal */}
      {isSuccessModalOpen && (
        <SuccessModal
          isOpen={isSuccessModalOpen}
          onClose={() => setIsSuccessModalOpen(false)}
          message={successMessage}
        />
      )}
    </div>
  );
}

export default RequisitionDetails;
