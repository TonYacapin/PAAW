import React, { useState, useEffect } from "react";
import axios from "axios";
import SuccessModal from "../../component/SuccessModal";
import Modal from "../../component/Modal";

const EditUserModal = ({ isOpen, onClose, userId, onUserUpdated }) => {
  const [userData, setUserData] = useState({
    firstname: "",
    lastname: "",
    middlename: "",
    email: "",
    password: "",
    role: "",
    isActive: false,
  });
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [isLastAdmin, setIsLastAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (userId && isOpen) {
      // Fetch current user data
      axios
        .get(`${process.env.REACT_APP_API_BASE_URL}/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setUserData({
            ...response.data,
            password: "",
          });
          
          // Check if this is the last admin user
          if (response.data.role === 'admin') {
            checkLastAdmin(token, userId);
          }
        })
        .catch((error) => {
          console.error("Error fetching user data", error);
          setError("Error fetching user data");
        });
    }
  }, [userId, isOpen]);

  const checkLastAdmin = async (token, currentUserId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/users`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // Count number of active admin users
      const adminCount = response.data.filter(
        user => user.role === 'admin' && user.isActive
      ).length;
      
      setIsLastAdmin(adminCount === 1);
    } catch (error) {
      console.error("Error checking admin count", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Prevent changing role if this is the last admin
    if (name === 'role' && isLastAdmin && userData.role === 'admin' && value !== 'admin') {
      setError("Cannot change role: This is the last active admin user. Please create another admin user first.");
      return;
    }
    
    setUserData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
    setError(""); // Clear any previous errors
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Double-check that we're not removing the last admin
    if (isLastAdmin && userData.role === 'admin' && 
        (userData.role !== 'admin' || !userData.isActive)) {
      setError("Cannot update: This is the last active admin user. Please create another admin user first.");
      return;
    }

    const token = localStorage.getItem("token");

    axios
      .put(
        `${process.env.REACT_APP_API_BASE_URL}/api/users/${userId}`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        setSuccessMessage("User updated successfully!");
        setIsSuccessModalOpen(true);
        onUserUpdated();
        setTimeout(() => {
          setIsSuccessModalOpen(false);
          onClose();
        }, 2000);
      })
      .catch((error) => {
        console.error("Error updating user", error);
        setError("Error updating user. Please try again.");
      });
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <div className="p-6 bg-[#fffafa] rounded-lg">
          <h2 className="text-2xl font-bold mb-4 text-black">Edit User</h2>
          {error && (
            <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-2">
              {/* Existing form fields remain the same */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-black">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstname"
                  value={userData.firstname}
                  onChange={handleChange}
                  className="mt-1 p-2 border border-gray-300 rounded w-full bg-[#fffafa] text-black"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-black">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastname"
                  value={userData.lastname}
                  onChange={handleChange}
                  className="mt-1 p-2 border border-gray-300 rounded w-full bg-[#fffafa] text-black"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-black">
                  Middle Name
                </label>
                <input
                  type="text"
                  name="middlename"
                  value={userData.middlename}
                  onChange={handleChange}
                  className="mt-1 p-2 border border-gray-300 rounded w-full bg-[#fffafa] text-black"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-black">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={userData.email}
                  onChange={handleChange}
                  className="mt-1 p-2 border border-gray-300 rounded w-full bg-[#fffafa] text-black"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-black">
                  Password (Leave blank to keep unchanged)
                </label>
                <input
                  type="password"
                  name="password"
                  value={userData.password}
                  onChange={handleChange}
                  className="mt-1 p-2 border border-gray-300 rounded w-full bg-[#fffafa] text-black"
                  placeholder="Enter new password"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-black">
                  Role
                </label>
                <select
                  name="role"
                  value={userData.role}
                  onChange={handleChange}
                  className="mt-1 p-2 border border-gray-300 rounded w-full bg-[#fffafa] text-black"
                  disabled={isLastAdmin && userData.role === 'admin'}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="regulatory">Regulatory</option>
                  <option value="livestock">Livestock</option>
                  <option value="animalhealth">Animal Health</option>
                </select>
                {isLastAdmin && userData.role === 'admin' && (
                  <p className="text-sm text-gray-500 mt-1">
                    Role cannot be changed as this is the last admin user.
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={userData.isActive}
                    onChange={handleChange}
                    disabled={isLastAdmin && userData.role === 'admin'}
                    className="form-checkbox text-[#1b5b40]"
                  />
                  <span className="ml-2 text-black">Active</span>
                </label>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-darkgreen text-white rounded"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-red-500 text-white rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      </Modal>

      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        message={successMessage}
      />
    </>
  );
};

export default EditUserModal;