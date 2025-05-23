import React, { useEffect, useState } from "react";
import axiosInstance from "../component/axiosInstance";
import Modal from "../component/Modal";
import RequisitionDetails from "./RequisitionDetails";
import RequisitionIssueSlip from "./RequisitionIssueSlip ";
import { jwtDecode } from "jwt-decode";

function RequisitionIssueSlipList() {
  const [requisitions, setRequisitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequisition, setSelectedRequisition] = useState(null);
  const [isSlipModalOpen, setIsSlipModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [statusOptions] = useState(["Distributed"]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [user, setUser] = useState("");

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


  useEffect(() => {
    if (userRole && user) {
      fetchRequisitions();
    }
  }, [isEditModalOpen]); // Updates as soon as the modal is opened or closed

  useEffect(() => {
    if (userRole && user) {
      fetchRequisitions();
    }
  }, [isSlipModalOpen]);

  useEffect(() => {
    if (userRole && user) {
      fetchRequisitions();
    }
  }, [userRole, user]); // Fetch requisitions whenever userRole or user changes
  const fetchRequisitions = async () => {
    try {
      let endpoint = '/api/requisitions';

      // Log the user role and user email for debugging
      console.log("User Role:", userRole);
      console.log("User Email:", user);

      // If userRole is not admin, append the email as a query parameter
      if (userRole && userRole !== "admin") {
        console.log("Appending user email to endpoint"); // Log this action
        endpoint += `?userEmail=${(user)}`;
      }

      console.log("Final Endpoint:", endpoint); // Log the final endpoint

      const response = await axiosInstance.get(endpoint);
      setRequisitions(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching requisitions:", err);
      setError("Failed to fetch requisitions");
      setLoading(false);
    }
  };
  async function updateInventory(requisition, user) {
    try {
      // Fetch the inventory data
      const inventoryResponse = await axiosInstance.get('/api/inventory');
      const inventoryItems = inventoryResponse.data;
  
      // Store audit log actions
      const auditLogActions = [];
  
      // Loop through the issuance rows
      for (const issuance of requisition.issuanceRows) {
        const inventoryItem = inventoryItems.find(item =>
          (item.supplies === issuance.description || item.type === issuance.description) &&
          item.source === issuance.source
        );
  
        if (inventoryItem) {
          // Create a copy of the current inventory item for comparison
          const originalInventoryItem = { ...inventoryItem };
  
          // Use the FIFO (First In, First Out) method for reducing inventory
          let remainingQuantity = issuance.quantity;
          const updatedExpiration = [...(inventoryItem.expiration || [])];
  
          // Remove from oldest batches first
          while (remainingQuantity > 0 && updatedExpiration.length > 0) {
            if (updatedExpiration[0].in <= remainingQuantity) {
              remainingQuantity -= updatedExpiration[0].in;
              updatedExpiration.shift();
            } else {
              updatedExpiration[0].in -= remainingQuantity;
              remainingQuantity = 0;
            }
          }
  
          // Calculate the updated inventory quantities
          const updatedTotal = Math.max(inventoryItem.total - issuance.quantity, 0);
          const updatedOut = inventoryItem.out + issuance.quantity;
          const updatedQuantity = updatedTotal + updatedOut;
  
          // Prepare the updated inventory item
          const updatedInventory = {
            ...inventoryItem,
            total: updatedTotal,
            out: updatedOut,
            quantity: updatedQuantity,
            expiration: updatedExpiration
          };
  
          // Update the inventory item
          await axiosInstance.put(`/api/inventory/${inventoryItem._id}`, updatedInventory);
  
          // Prepare audit log for this inventory update
          auditLogActions.push({
            action: 'OUT',
            inventoryId: inventoryItem._id,
            user: user,
            changes: {
              before: originalInventoryItem,
              after: updatedInventory
            },
            timestamp: new Date()
          });
        } else {
          throw new Error(`Inventory item not found for source: ${issuance.source}`);
        }
      }
  
      // Batch create audit logs
      if (auditLogActions.length > 0) {
        await Promise.all(
          auditLogActions.map(logAction => 
            axiosInstance.post('/api/audit-logs-inventory', logAction)
          )
        );
      }
    } catch (err) {
      console.error("Error updating inventory:", err);
      throw new Error("Failed to update inventory");
    }
  }
  
  const handleStatusUpdate = async () => {
    try {
      if (!selectedStatus) {
        console.error("No status selected");
        return;
      }
  
      console.log("Updating status to:", selectedStatus);
  
      // Get the current user (assuming you have a way to retrieve the logged-in user)
      const token = localStorage.getItem("token");
      const user = token ? jwtDecode(token).email : 'unknown';
  
      if (selectedStatus === "Distributed") {
        await updateInventory(selectedRequisition, user);
      }
  
      // Prepare data for audit log of requisition status change
      const originalRequisition = { ...selectedRequisition };
      const updatedRequisition = { 
        ...selectedRequisition, 
        formStatus: selectedStatus 
      };
  
      // Update requisition status
      await axiosInstance.put(`/api/requisitions/${selectedRequisition._id}`, {
        formStatus: selectedStatus
      });
  
      // Update local state
      setRequisitions(prevRequisitions =>
        prevRequisitions.map(req =>
          req._id === selectedRequisition._id
            ? { ...req, formStatus: selectedStatus }
            : req
        )
      );
  
      // Reset modal and selection states
      setIsEditModalOpen(false);
      setSelectedRequisition(null);
      setSelectedStatus('');
  
      await fetchRequisitions();
    } catch (err) {
      console.error("Error updating status:", err);
      setError("Failed to update status");
    }
  };
  
  const handleEditStatus = (requisition) => {
    // Only allow status update for 'Allotted' requisitions
    if (requisition.formStatus !== "Allotted") {
      return;
    }
  
    setSelectedRequisition(requisition);
    setSelectedStatus("Distributed");
    setIsEditModalOpen(true);
  };

  const handleViewDetails = (requisition) => {
    setSelectedRequisition(requisition);
    setIsModalOpen(true);
  };

  const handleOpenSlipModal = () => {
    setIsSlipModalOpen(true);
  };



  if (loading)
    return (
      <div className="flex items-center justify-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  if (error) return <div className="text-red-500 p-8">{error}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Requisition Issue Slip List</h2>
      </div>

      <button
        onClick={handleOpenSlipModal}
        className="bg-[#1b5b40] mb-4 px-4 py-2 text-white rounded"
      >
        Open Requisition Issue Slip
      </button>

      {requisitions.length === 0 ? (
        <p className="text-center py-4">No requisitions found.</p>
      ) : (
        <div className="overflow-auto border rounded-lg">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-[#1b5b40] text-white">
                <th className="border border-gray-300 p-4">No.</th>
                <th className="border border-gray-300 p-4">Date</th>
                <th className="border border-gray-300 p-4">Requisition ID</th>
                <th className="border border-gray-300 p-4">Requested By</th>
                <th className="border border-gray-300 p-4">Status</th>
                <th className="border border-gray-300 p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requisitions.map((requisition, index) => (
                <tr key={requisition._id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 p-4">{index + 1}</td>
                  <td className="border border-gray-300 p-4">
                    {new Date(requisition.date).toLocaleDateString()}
                  </td>
                  <td className="border border-gray-300 p-4">
                    {requisition._id}
                  </td>
                  <td className="border border-gray-300 p-4">
                    {requisition.sentby}
                  </td>
                  <td className="border border-gray-300 p-4">
                    {requisition.formStatus}
                  </td>
                  <td className="border border-gray-300 p-4 space-x-2 text-center">
                    <button
                      onClick={() => handleViewDetails(requisition)}
                      className="px-2 py-1 bg-[#1b5b40] text-white rounded hover:bg-[#154632] text-center"
                    >
                      View Details
                    </button>
                    {requisition.formStatus === "Allotted" && (
                      <button
                        onClick={() => handleEditStatus(requisition)}
                        className="px-2 py-1 bg-[#1b5b40] text-white rounded hover:bg-[#154632]"
                      >
                        Edit Status
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && selectedRequisition && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <RequisitionDetails requisition={selectedRequisition} />
        </Modal>
      )}

      {isSlipModalOpen && (
        <Modal
          isOpen={isSlipModalOpen}
          onClose={() => setIsSlipModalOpen(false)}
        >
          <RequisitionIssueSlip />
        </Modal>
      )}

      {isEditModalOpen && selectedRequisition && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
        >
          <div className="p-4">
            <h3 className="text-xl font-bold mb-4">
              Edit Status for Requisition {selectedRequisition._id}
            </h3>
            <div className="mb-4">
              <label
                htmlFor="status"
                className="block text-sm font-medium mb-2"
              >
                Status:
              </label>
              <select
                id="status"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="p-2 border rounded w-full"
              >
                {statusOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleStatusUpdate}
                className="px-4 py-2 bg-[#1b5b40] text-white rounded hover:bg-[#154632]"
              >
                Accept
              </button>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default RequisitionIssueSlipList;
