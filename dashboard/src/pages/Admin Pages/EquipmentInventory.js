import React, { useState, useEffect } from 'react';
import axiosInstance from '../../component/axiosInstance';
import ConfirmationModal from '../../component/ConfirmationModal';
import SuccessModal from '../../component/SuccessModal'; // Success Modal component
import InventoryReport from './InventoryReport';
import Modal from '../../component/Modal';
import CardBox from '../../component/CardBox';

function EquipmentInventory() {
  const [inventories, setInventories] = useState([]);
  const [newInventory, setNewInventory] = useState({
    type: '',
    supplies: '',
    unit: '',
    quantity: 0,
    out: 0,
    total: 0,
    category: 'equipment',
    source: '', // Add source field
  });
  const [originalTotal, setOriginalTotal] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [inventoryToDelete, setInventoryToDelete] = useState(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isInventoryReportModalOpen, setIsInventoryReportModalOpen] = useState(false); // New state for InventoryReport modal

  useEffect(() => {
    fetchInventories();
  }, []);

  const openInventoryReportModal = () => {
    setIsInventoryReportModalOpen(true);
  };

  const closeInventoryReportModal = () => {
    setIsInventoryReportModalOpen(false);
  };

  const fetchInventories = async () => {
    try {
      const response = await axiosInstance.get(`/api/inventory`);
      setInventories(response.data);
    } catch (error) {
      console.error('Error fetching inventories:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'total') {
      const newValue = Math.max(value, originalTotal);
      setNewInventory((prevInventory) => ({
        ...prevInventory,
        [name]: newValue,
        quantity: parseInt(newValue || 0) + parseInt(prevInventory.out || 0),
      }));
    } else {
      setNewInventory((prevInventory) => ({
        ...prevInventory,
        [name]: value,
        quantity: parseInt(prevInventory.total || 0) + parseInt(prevInventory.out || 0),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { _id, ...updatedInventory } = newInventory; // Exclude _id from the object

    updatedInventory.quantity = parseInt(updatedInventory.total) + parseInt(updatedInventory.out);

    try {
      if (isEditing) {
        await axiosInstance.put(`/api/inventory/${_id}`, updatedInventory);
        setIsEditing(false);
      } else {
        await axiosInstance.post(`/api/inventory`, updatedInventory); // No _id here
      }
      setIsSuccessModalOpen(true);
      setSuccessMessage(isEditing ? 'Equipment updated successfully!' : 'Equipment added successfully!');
      fetchInventories();
      closeModal();
    } catch (error) {
      console.error(isEditing ? 'Error updating inventory:' : 'Error adding inventory:', error);
    }
  };


  const openModal = (inventory = null) => {
    setNewInventory({
      _id: inventory?._id || '', // Include _id when editing
      type: inventory?.type || '',
      source: inventory?.source || '',
      supplies: inventory?.supplies || '',
      unit: inventory?.unit || '',
      quantity: inventory?.quantity || 0,
      out: inventory?.out || 0,
      total: inventory?.total || 0,
      category: 'equipment',
    });
    setOriginalTotal(inventory?.total || 0);
    setIsEditing(!!inventory);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setOriginalTotal(0);
  };

  const openConfirmDeleteModal = (id) => {
    setInventoryToDelete(id);
    setIsConfirmDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (inventoryToDelete) {
      try {
        await axiosInstance.delete(`/api/inventory/${inventoryToDelete}`);
        setSuccessMessage('Equipment deleted successfully!');
        setIsSuccessModalOpen(true);
        setTimeout(() => {
          setIsSuccessModalOpen(false);
        }, 2000);
        fetchInventories();
      } catch (error) {
        console.error('Error deleting inventory:', error);
      }
      setInventoryToDelete(null);
    }
    closeConfirmDeleteModal();
  };

  const closeConfirmDeleteModal = () => {
    setInventoryToDelete(null);
    setIsConfirmDeleteOpen(false);
  };

  const handleEdit = (inventory) => {
    openModal(inventory); // Open the modal and set the inventory to be edited
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-white text-black lg:max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-black mb-6">Equipment Inventory</h1>

      {/* Inventory Report Modal */}
      <Modal isOpen={isInventoryReportModalOpen} onClose={closeInventoryReportModal}>
        <InventoryReport />
      </Modal>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => openModal()} // Open modal for adding equipment
          className="flex items-center bg-darkgreen text-white py-2 px-4 rounded-md shadow-sm hover:bg-darkergreen transition-colors"
        >
          Add Equipment
        </button>

        <button
          onClick={openInventoryReportModal} // Open InventoryReport modal
          className="flex items-center bg-darkgreen text-white py-2 px-4 rounded-md shadow-sm hover:bg-darkergreen transition-colors"
        >
          Generate Inventory Report
        </button>
      </div>

      {/* Success Modal */}
      <SuccessModal onClose={() => setIsSuccessModalOpen(false)} isOpen={isSuccessModalOpen} message={successMessage} />

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">{isEditing ? 'Edit Equipment' : 'Add Equipment'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Form fields */}
              <div>
                <label htmlFor="source" className="block text-sm font-medium text-gray-700">Source</label>
                <input
                  type="text"
                  id="source"
                  name="source"
                  value={newInventory.source}
                  onChange={handleChange}
                  placeholder="Source"
                  className="border border-gray-300 p-2 rounded-md focus:outline-darkgreen"
                  required
                />
              </div>
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700">Equipment Type</label>
                  <input
                    type="text"
                    id="type"
                    name="type"
                    value={newInventory.type}
                    onChange={handleChange}
                    placeholder="Equipment Type"
                    className="border border-gray-300 p-2 rounded-md focus:outline-darkgreen"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="supplies" className="block text-sm font-medium text-gray-700">Supplies</label>
                  <input
                    type="text"
                    id="supplies"
                    name="supplies"
                    value={newInventory.supplies}
                    onChange={handleChange}
                    placeholder="Supplies"
                    className="border border-gray-300 p-2 rounded-md focus:outline-darkgreen"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="unit" className="block text-sm font-medium text-gray-700">Unit</label>
                  <input
                    type="text"
                    id="unit"
                    name="unit"
                    value={newInventory.unit}
                    onChange={handleChange}
                    placeholder="Unit (e.g., pieces)"
                    className="border border-gray-300 p-2 rounded-md focus:outline-darkgreen"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="out" className="block text-sm font-medium text-gray-700">Out</label>
                  <input
                    type="number"
                    id="out"
                    name="out"
                    value={newInventory.out}
                    placeholder="Out"
                    className="border border-gray-300 p-2 rounded-md focus:outline-darkgreen"
                    disabled
                  />
                </div>
                <div>
                  <label htmlFor="total" className="block text-sm font-medium text-gray-700">Total Inventory</label>
                  <input
                    type="number"
                    id="total"
                    name="total"
                    value={newInventory.total}
                    onChange={handleChange}
                    placeholder="Total Inventory"
                    className="border border-gray-300 p-2 rounded-md focus:outline-darkgreen"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity</label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    value={parseInt(newInventory.total) + parseInt(newInventory.out)} // Calculate quantity
                    placeholder="Quantity"
                    className="border border-gray-300 p-2 rounded-md focus:outline-darkgreen"
                    disabled
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-red-500 text-white rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-darkgreen text-white rounded-md"
                >
                  {isEditing ? 'Update' : 'Add'} Equipment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Deletion */}
      <ConfirmationModal
        isOpen={isConfirmDeleteOpen}
        onClose={closeConfirmDeleteModal}
        onConfirm={handleDeleteConfirm}
        message="Are you sure you want to delete this item?"
      />

      <div className="overflow-auto border rounded-lg border-gray-400 shadow-md">
        <table className="min-w-full overflow-auto border rounded-lg  shadow-md">
          <thead>
            <tr className="bg-[#1b5b40] text-white">
              <th className="py-2 px-4 border-b">No.</th>
              <th className="py-2 px-4 border-b">Source</th>
              <th className="py-2 px-4 border-b">Type</th>
              <th className="py-2 px-4 border-b">Supplies</th>
              <th className="py-2 px-4 border-b">Unit</th>
              <th className="py-2 px-4 border-b">Quantity</th>
              <th className="py-2 px-4 border-b">Out</th>
              <th className="py-2 px-4 border-b">Total</th>
              <th className="py-2 px-4 border-b">Actions</th>

            </tr>
          </thead>
          <tbody>
            {inventories.map((inventory, index) => (
              <tr key={inventory._id}>
                <td className="py-2 px-4 border-b">{index + 1}</td>
                <td className="py-2 px-4 border-b">{inventory.source}</td>
                <td className="py-2 px-4 border-b">{inventory.type}</td>
                <td className="py-2 px-4 border-b">{inventory.supplies}</td>
                <td className="py-2 px-4 border-b">{inventory.unit}</td>
                <td className="py-2 px-4 border-b">{inventory.quantity}</td>
                <td className="py-2 px-4 border-b">{inventory.out}</td>
                <td className="py-2 px-4 border-b">{inventory.total}</td>

                <td className="py-2 px-4 border-b flex justify-center">
                  <div className='flex flex-row gap-2'>
                    <button
                      onClick={() => handleEdit(inventory)} // Call handleEdit when clicked
                      className="flex items-center bg-darkgreen text-white py-2 px-4 rounded-md shadow-sm hover:bg-darkergreen transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => openConfirmDeleteModal(inventory._id)} // Open confirmation modal
                      className="flex items-center bg-red-500 text-white py-2 px-4 rounded-md shadow-sm hover:bg-red-800 transition-colors"

                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EquipmentInventory;
