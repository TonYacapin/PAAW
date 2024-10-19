import React, { useState } from 'react';
import axiosInstance from '../component/axiosInstance';
import { useNavigate } from 'react-router-dom';
import placeholder1 from './assets/NVLOGO.png'; // Adjust path if needed
import placeholder2 from './assets/PAAW.png'; // Adjust path if needed

const SignupForm = () => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    middlename: '',
    email: '',
    password: ''
  });

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // New state for message type (success or error)
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post(`/api/users`, formData);
      setMessage(`User created successfully: ${response.data.firstname}`);
      setMessageType('success'); // Set message type to success
      setFormData({
        firstname: '',
        lastname: '',
        middlename: '',
        email: '',
        password: ''
      });
    } catch (error) {
      setMessage(`Error: ${error.response?.data?.message || error.message}`);
      setMessageType('error'); // Set message type to error
    }
  };

  const handleBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFAFA]">
      <div className="w-full max-w-xs sm:max-w-md sm:w-auto sm:bg-white sm:rounded-xl sm:shadow-lg p-4 sm:p-10">
        <div className="text-center">
          <div className="flex justify-center space-x-4 mb-6">
            <img 
              src={placeholder1} 
              alt="Placeholder 1" 
              className="w-24 h-24 object-cover border-gray-300"
            />
            <img 
              src={placeholder2} 
              alt="Placeholder 2" 
              className="w-24 h-24 object-cover border-gray-300"
            />
          </div>
          <h2 className="text-3xl font-bold text-[#1b5b40]">Portable Assistant for Animal Welfare</h2>
        </div>
        
        <form className="mt-8 space-y-6; flex flex-col gap-y-7" onSubmit={handleSubmit} >
          

          <div className="rounded-md shadow-sm -space-y-px flex flex-col gap-y-2 ">
            <div>
              <label htmlFor="firstname" className="sr-only">First Name</label>
              <input
                id="firstname"
                name="firstname"
                type="text"
                value={formData.firstname}
                onChange={handleChange}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-[#252525] rounded-t-md focus:outline-none focus:ring-[#1b5b40] focus:border-[#1b5b40] focus:z-10 sm:text-sm"
                placeholder="First Name"
                required
              />
            </div>
            <div >
              <label htmlFor="lastname" className="sr-only">Last Name</label>
              <input
                id="lastname"
                name="lastname"
                type="text"
                value={formData.lastname}
                onChange={handleChange}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-[#252525] focus:outline-none focus:ring-[#1b5b40] focus:border-[#1b5b40] focus:z-10 sm:text-sm"
                placeholder="Last Name"
                required
              />
            </div>
            <div>
              <label htmlFor="middlename" className="sr-only">Middle Name</label>
              <input
                id="middlename"
                name="middlename"
                type="text"
                value={formData.middlename}
                onChange={handleChange}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-[#252525] focus:outline-none focus:ring-[#1b5b40] focus:border-[#1b5b40] focus:z-10 sm:text-sm"
                placeholder="Middle Name"
              />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-[#252525] focus:outline-none focus:ring-[#1b5b40] focus:border-[#1b5b40] focus:z-10 sm:text-sm"
                placeholder="Email address"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-[#252525] rounded-b-md focus:outline-none focus:ring-[#1b5b40] focus:border-[#1b5b40] focus:z-10 sm:text-sm"
                placeholder="Password"
                required
              />
            </div>
         
          </div>
          
          {message && (
            <p className={`text-sm mt-2 ${messageType === 'error' ? 'text-red-500' : 'text-[#1b5b40]'}`}>
              {message}
            </p>
          )}
          <div className="flex flex-col gap-4">
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#1b5b40] hover:bg-[#154f3a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1b5b40]"
            >
              Sign Up
            </button>
            <button
              type="button"
              onClick={handleBack}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-[#1b5b40] bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1b5b40]"
            >
              Back
            </button>
          </div>
        </form>
        </div>
        
      </div>

  );
};

export default SignupForm;
