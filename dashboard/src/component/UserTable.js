import React, { useEffect, useState } from 'react';
import axiosInstance from '../component/axiosInstance';
import EditUserModal from '../pages/Admin Pages/EditUserModal ';

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [filterRole, setFilterRole] = useState('');
  const [filterActive, setFilterActive] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch users from API or server
  const fetchUsers = async () => {
    try {
        // Retrieve the token from local storage
        const token = localStorage.getItem('token');

        // Make the GET request with the Authorization header
        const response = await axiosInstance.get(`/api/users`);

        // Set the users state with the response data
        setUsers(response.data);
        setFilteredUsers(response.data); // Initially show all users
    } catch (error) {
        console.error('Error fetching users:', error);
    }
};


  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter and search users whenever filters or search query change
  useEffect(() => {
    let filtered = users;

    // Filter by role
    if (filterRole) {
      filtered = filtered.filter(user => user.role === filterRole);
    }

    // Filter by active status
    if (filterActive) {
      filtered = filtered.filter(user => 
        filterActive === 'active' ? user.isActive : !user.isActive
      );
    }

    // Filter by search query (search in first name, last name, or email)
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(user => 
        user.firstname.toLowerCase().includes(lowerCaseQuery) ||
        user.lastname.toLowerCase().includes(lowerCaseQuery) ||
        user.email.toLowerCase().includes(lowerCaseQuery)
      );
    }

    setFilteredUsers(filtered);
  }, [filterRole, filterActive, searchQuery, users]);

  const handleEdit = (userId) => {
    setCurrentUserId(userId);
    setEditModalOpen(true);
  };

  const handleUserUpdated = () => {
    setEditModalOpen(false);
    fetchUsers();
  };

  return (
    <div className="overflow-x-auto">
      <div className="flex mb-4">
        <select
          className="mr-4 p-2 border rounded"
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
          <option value="regulatory">Regulatory</option>
          <option value="livestock">Livestock</option>
          <option value="animalhealth">Animal Health</option>
        </select>
        <select
          className="mr-4 p-2 border rounded"
          value={filterActive}
          onChange={(e) => setFilterActive(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <input
          type="text"
          placeholder="Search by name or email"
          className="p-2 border rounded w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className=" overflow-auto border rounded-lg border-gray-400 shadow-md">
      <table className="min-w-full table-auto">
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
          {filteredUsers.map((user) => (
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
      </div>
  
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
