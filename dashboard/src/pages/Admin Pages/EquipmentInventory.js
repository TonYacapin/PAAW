import React, { useState, useEffect } from 'react';
import axiosInstance from '../../component/axiosInstance';

function EquipmentInventory() {
  const [inventories, setInventories] = useState([]);
  const [newInventory, setNewInventory] = useState({
    type: '',
    supplies: '',
    unit: '',
    quantity: '',
    out: 0,
    total: '',
    category: 'equipment',
    createdAt: '',
    updatedAt: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal open/close state

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
    setNewInventory({
      ...newInventory,
      [name]: value,
      total: name === 'quantity' || name === 'out'
        ? name === 'quantity'
          ? value - newInventory.out
          : newInventory.quantity - value
        : newInventory.total,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isEditing) {
      try {
        await axiosInstance.put(`/api/inventory/${newInventory._id}`, newInventory);
        setIsEditing(false);
      } catch (error) {
        console.error('Error updating inventory:', error);
      }
    } else {
      try {
        await axiosInstance.post(`/api/inventory`, newInventory);
      } catch (error) {
        console.error('Error adding inventory:', error);
      }
    }

    setIsModalOpen(false); // Close the modal after submitting
    fetchInventories(); // Refresh inventory list
  };

  const openModal = () => {
    setNewInventory({
      type: '',
      supplies: '',
      unit: '',
      quantity: '',
      out: 0,
      total: '',
      category: 'equipment',
      createdAt: '',
      updatedAt: '',
    });
    setIsEditing(false); // Reset editing state
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleEdit = (inventory) => {
    setNewInventory(inventory);
    setIsEditing(true);
    setIsModalOpen(true); // Open modal for editing
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await axiosInstance.delete(`/api/inventory/${id}`);
        fetchInventories(); // Refresh inventory list after deletion
      } catch (error) {
        console.error('Error deleting inventory:', error);
      }
    }
  };

  return (
    <div className="p-4 bg-white text-black lg:max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-darkgreen mb-4">Equipment Inventory</h1>

      {/* Button to trigger modal */}
      <button
        onClick={openModal}
        className="px-4 py-2 bg-darkgreen text-white rounded-md mb-4"
      >
        Add Equipment
      </button>

      {/* Modal for the form */}
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
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity</label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    value={newInventory.quantity}
                    onChange={handleChange}
                    placeholder="Quantity"
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
                    onChange={handleChange}
                    placeholder="Out"
                    className="border border-gray-300 p-2 rounded-md focus:outline-darkgreen"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="total" className="block text-sm font-medium text-gray-700">Total Inventory</label>
                  <input
                    type="number"
                    id="total"
                    name="total"
                    value={newInventory.total}
                    placeholder="Total Inventory"
                    className="border border-gray-300 p-2 rounded-md focus:outline-darkgreen"
                    readOnly
                  />
                </div>
              </div>

              {/* Form buttons */}
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

      {/* Table to display inventories */}
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
            <tr key={inventory._id}>
              <td className="border border-gray-300 p-2">{inventory.type}</td>
              <td className="border border-gray-300 p-2">{inventory.supplies}</td>
              <td className="border border-gray-300 p-2">{inventory.unit}</td>
              <td className="border border-gray-300 p-2">{inventory.quantity}</td>
              <td className="border border-gray-300 p-2">{inventory.out}</td>
              <td className="border border-gray-300 p-2">{inventory.total}</td>
              <td className="border border-gray-300 p-2">
                <button onClick={() => handleEdit(inventory)} className="text-blue-600">Edit</button>
                <button onClick={() => handleDelete(inventory._id)} className="text-red-600 ml-2">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EquipmentInventory;
