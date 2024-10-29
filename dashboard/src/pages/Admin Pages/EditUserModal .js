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
    password: "", // Add password field here
    role: "",
    isActive: false,
  });

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (userId && isOpen) {
      axios
        .get(`${process.env.REACT_APP_API_BASE_URL}/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Set the Authorization header
          },
        })
        .then((response) => {
          setUserData({
            ...response.data,
            password: "", // Keep password empty initially
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
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token"); // Adjust based on how you store the token

    axios
      .put(
        `${process.env.REACT_APP_API_BASE_URL}/api/users/${userId}`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Set the Authorization header
          },
        }
      )
      .then(() => {
        setSuccessMessage("User updated successfully!"); // Set the success message
        setIsSuccessModalOpen(true); // Open the success modal
        onUserUpdated(); // Refresh the user list after the update
        // Automatically close the modal after a brief delay
        setTimeout(() => {
          setIsSuccessModalOpen(false); // Close the success modal
          onClose(); // Close the edit modal
        }, 2000);
      })
      .catch((error) => {
        console.error("Error updating user", error);
      });
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <div className="p-6 bg-[#fffafa] rounded-lg">
          <h2 className="text-2xl font-bold mb-4 text-black">Edit User</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-2 ">
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
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="regulatory">Regulatory</option>
                  <option value="livestock">Livestock</option>
                  <option value="animalhealth">Animal Health</option>
                  <option value="extensionworker">Extension Worker</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={userData.isActive}
                    onChange={handleChange}
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

      {/* Success Modal */}
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        message={successMessage}
      />
    </>
  );
};

export default EditUserModal;
