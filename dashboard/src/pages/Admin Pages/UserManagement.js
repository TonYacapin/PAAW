// UserManagement.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UserTable from '../../component/UserTable';

const UserManagement = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/users`);
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users', error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="container mx-auto p-6 bg-[#fffafa] rounded-lg shadow-md">
  <h1 className="text-3xl font-bold mb-6 text-[#1b5b40]">Manage Users</h1>
  <UserTable users={users} />
</div>

  );
};

export default UserManagement;
