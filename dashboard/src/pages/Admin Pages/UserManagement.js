  // UserManagement.js
  import React, { useEffect, useState } from 'react';
  import axiosInstance from '../../component/axiosInstance';
  import UserTable from '../../component/UserTable';

  const UserManagement = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
      const fetchUsers = async () => {
        try {
            // Retrieve the token from local storage
         
    
            // Make the GET request with the Authorization header
            const response = await axiosInstance.get(`/api/users`);
    
            // Set the users state with the response data
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users', error);
        }
    };
    

      fetchUsers();
    }, []);

    return (
      <div className="container mx-auto p-6 bg-[#fffafa] rounded-lg shadow-md">
    <h1 className="text-3xl font-bold mb-6 text-black">Manage Users</h1>
    <UserTable users={users} />
  </div>

    );
  };

  export default UserManagement;
