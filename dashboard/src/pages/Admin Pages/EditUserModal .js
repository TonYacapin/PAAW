// EditUserModal.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Modal from '../../component/Modal';

const EditUserModal = ({ isOpen, onClose, userId, onUserUpdated }) => {
  const [userData, setUserData] = useState({
    firstname: '',
    lastname: '',
    middlename: '',
    email: '',
    password: '',  // Add password field here
    role: '',
    isActive: false,
  });

  useEffect(() => {
    if (userId && isOpen) {
      // Fetch user data when the modal opens
      axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/users/${userId}`)
        .then((response) => {
          setUserData({
            ...response.data,
            password: '', // Keep password empty initially
          });
        })
        .catch((error) => {
          console.error("Error fetching user data", error);
        });
    }
  }, [userId, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/users/${userId}`, userData)
      .then(() => {
        onUserUpdated();  // Refresh the user list after the update
        onClose();        // Close the modal after successful update
      })
      .catch((error) => {
        console.error("Error updating user", error);
      });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-xl font-bold mb-4">Edit User</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">First Name</label>
          <input
            type="text"
            name="firstname"
            value={userData.firstname}
            onChange={handleChange}
            className="mt-1 p-2 border border-gray-300 rounded w-full"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Last Name</label>
          <input
            type="text"
            name="lastname"
            value={userData.lastname}
            onChange={handleChange}
            className="mt-1 p-2 border border-gray-300 rounded w-full"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Middle Name</label>
          <input
            type="text"
            name="middlename"
            value={userData.middlename}
            onChange={handleChange}
            className="mt-1 p-2 border border-gray-300 rounded w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            className="mt-1 p-2 border border-gray-300 rounded w-full"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Password (Leave blank to keep unchanged)</label>
          <input
            type="password"
            name="password"
            value={userData.password} // Password field can be updated
            onChange={handleChange}
            className="mt-1 p-2 border border-gray-300 rounded w-full"
            placeholder="Enter new password"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Role</label>
          <select
            name="role"
            value={userData.role}
            onChange={handleChange}
            className="mt-1 p-2 border border-gray-300 rounded w-full"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="regulatory">Regulatory</option>
            <option value="livestock">Livestock</option>
            <option value="animalhealth">Animal Health</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              name="isActive"
              checked={userData.isActive}
              onChange={handleChange}
              className="form-checkbox"
            />
            <span className="ml-2 text-gray-700">Active</span>
          </label>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Save
          </button>
          <button
            type="button"
            onClick={onClose}
            className="ml-2 bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditUserModal;
