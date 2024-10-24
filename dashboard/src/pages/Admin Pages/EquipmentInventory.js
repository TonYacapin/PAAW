import React, { useState, useEffect } from 'react';
import axiosInstance from '../../component/axiosInstance';
import ConfirmationModal from '../../component/ConfirmationModal';

function EquipmentInventory() {
  const [inventories, setInventories] = useState([]);
  const [newInventory, setNewInventory] = useState({
    type: '',
    supplies: '',
    unit: '',
    quantity: 0, // Default quantity to 0
    out: 0,
    total: 0, // Ensure total starts as a number
    category: 'equipment',
  });
  const [originalTotal, setOriginalTotal] = useState(0); // Store original total
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [inventoryToDelete, setInventoryToDelete] = useState(null);

  useEffect(() => {
    fetchInventories();
  }, []);

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

    // Special handling for the total input
    if (name === 'total') {
      const newValue = Math.max(value, originalTotal); // Prevent decrease below original
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

    const updatedInventory = {
      ...newInventory,
      quantity: parseInt(newInventory.total) + parseInt(newInventory.out),
    };

    try {
      if (isEditing) {
        await axiosInstance.put(`/api/inventory/${newInventory._id}`, updatedInventory);
        setIsEditing(false);
      } else {
        await axiosInstance.post(`/api/inventory`, updatedInventory);
      }
      fetchInventories(); // Refresh inventory list
      closeModal(); // Close the modal after submitting
    } catch (error) {
      console.error(isEditing ? 'Error updating inventory:' : 'Error adding inventory:', error);
    }
  };

  const openModal = (inventory = null) => {
    setNewInventory({
      type: inventory?.type || '',
      supplies: inventory?.supplies || '',
      unit: inventory?.unit || '',
      quantity: inventory?.quantity || 0,
      out: inventory?.out || 0,
      total: inventory?.total || 0,
      category: 'equipment',
    });
    setOriginalTotal(inventory?.total || 0); // Set original total for editing
    setIsEditing(!!inventory);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setOriginalTotal(0); // Reset original total on close
  };

  const openConfirmDeleteModal = (id) => {
    setInventoryToDelete(id);
    setIsConfirmDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (inventoryToDelete) {
      try {
        await axiosInstance.delete(`/api/inventory/${inventoryToDelete}`);
        fetchInventories(); // Refresh inventory list
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

  return (
    <div className="p-4 bg-white text-black lg:max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-darkgreen mb-4">Equipment Inventory</h1>

      <button
        onClick={() => openModal()} // Open modal for adding equipment
        className="px-4 py-2 bg-darkgreen text-white rounded-md mb-4"
      >
        Add Equipment
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">{isEditing ? 'Edit Equipment' : 'Add Equipment'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
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

      <ConfirmationModal
        isOpen={isConfirmDeleteOpen}
        onConfirm={handleDeleteConfirm}
        onCancel={closeConfirmDeleteModal}
        message="Are you sure you want to delete this item?"
      />

      <table className="min-w-full border border-gray-300 mt-6">
        <thead>
          <tr className="bg-darkgreen text-white">
            <th className="border border-gray-300 p-2">Equipment Type</th>
            <th className="border border-gray-300 p-2">Supplies</th>
            <th className="border border-gray-300 p-2">Unit</th>
            <th className="border border-gray-300 p-2">Quantity</th>
            <th className="border border-gray-300 p-2">Out</th>
            <th className="border border-gray-300 p-2">Total</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {inventories.map((inventory) => (
            <tr key={inventory._id} className="border-b hover:bg-gray-50">
              <td className="border border-gray-300 p-2">{inventory.type}</td>
              <td className="border border-gray-300 p-2">{inventory.supplies}</td>
              <td className="border border-gray-300 p-2">{inventory.unit}</td>
              <td className="border border-gray-300 p-2">{inventory.quantity}</td>
              <td className="border border-gray-300 p-2">{inventory.out}</td>
              <td className="border border-gray-300 p-2">{inventory.total}</td>
              <td className="border border-gray-300 p-2">
                <button
                  onClick={() => openModal(inventory)} // Open modal for editing
                  className="text-blue-500"
                >
                  Edit
                </button>
                <button
                  onClick={() => openConfirmDeleteModal(inventory._id)} // Open confirm delete modal
                  className="text-red-500 ml-2"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EquipmentInventory;
