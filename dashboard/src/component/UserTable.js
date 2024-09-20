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
    <div>
      <table className="min-w-full table-auto">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Active</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.firstname}</td>
              <td>{user.lastname}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.isActive ? 'Yes' : 'No'}</td>
              <td>
                <button
                  onClick={() => handleEdit(user._id)}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
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
