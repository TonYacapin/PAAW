import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Assuming you're using Axios to fetch data
import EditUserModal from '../pages/Admin Pages/EditUserModal ';

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  // Fetch users from API or server
  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/users`); // Adjust API URL as needed
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers(); // Fetch users when the component loads
  }, []);

  const handleEdit = (userId) => {
    setCurrentUserId(userId);
    setEditModalOpen(true);
  };

  const handleUserUpdated = () => {
    setEditModalOpen(false);
    fetchUsers(); // Refetch users after a successful update
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto bg-[#fffafa] border border-[#1b5b40] rounded-lg shadow-md">
        <thead>
          <tr className="bg-[#1b5b40] text-white">
            <th className="py-2 px-4 border-b text-left">First Name</th>
            <th className="py-2 px-4 border-b text-left">Last Name</th>
            <th className="py-2 px-4 border-b text-left">Email</th>
            <th className="py-2 px-4 border-b text-left">Role</th>
            <th className="py-2 px-4 border-b text-left">Active</th>
            <th className="py-2 px-4 border-b text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="hover:bg-gray-100">
              <td className="py-2 px-4 border-b">{user.firstname}</td>
              <td className="py-2 px-4 border-b">{user.lastname}</td>
              <td className="py-2 px-4 border-b">{user.email}</td>
              <td className="py-2 px-4 border-b">{user.role}</td>
              <td className="py-2 px-4 border-b">{user.isActive ? 'Yes' : 'No'}</td>
              <td className="py-2 px-4 border-b">
                <button
                  onClick={() => handleEdit(user._id)}
                  className="bg-pastelyellow hover:bg-darkergreen hover:text-white text-black font-bold py-1 px-2 rounded"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
  
      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        userId={currentUserId}
        onUserUpdated={handleUserUpdated}
      />
    </div>
  );
  
};

export default UserTable;
