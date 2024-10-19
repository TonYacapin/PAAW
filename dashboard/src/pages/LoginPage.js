import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import placeholder1 from './assets/NVLOGO.png'; // Adjust path if needed
import placeholder2 from './assets/PAAW.png'; // Adjust path if needed
import ErrorModal from '../component/ErrorModal'; // Import ErrorModal

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // Error state for login errors
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false); // Control modal visibility
  const [loginAttempts, setLoginAttempts] = useState(0); // Track login attempts
  const [isPageDisabled, setIsPageDisabled] = useState(false); // Disable page after 5 attempts
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loginAttempts >= 5) {
      setError('Too many failed login attempts. Please try again later.');
      setIsErrorModalOpen(true);
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/login`, {
        email,
        password,
      });

      const { token} = response.data;
      localStorage.setItem('token', token);
    

      console.log('Logged in successfully:', response.data);
      navigate('/Home');
    } catch (error) {
      console.error('Error logging in:', error.response?.data?.message || error.message);
      setError(error.response?.data?.message || error.message);
      setIsErrorModalOpen(true);
      setLoginAttempts((prevAttempts) => {
        const newAttempts = prevAttempts + 1;
        if (newAttempts >= 5) {
          setIsPageDisabled(true); // Disable page after 5 attempts
        }
        return newAttempts;
      });
    }
  };

  const handleSignup = () => {
    navigate('/signup');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFAFA]">
      <div className={`w-full max-w-xs sm:max-w-md sm:w-auto sm:bg-white sm:rounded-xl sm:shadow-lg p-4 sm:p-10 ${isPageDisabled && 'opacity-50 pointer-events-none'}`}>
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
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="flex flex-col gap-y-2">
              <div>
                <label htmlFor="email" className="sr-only">Email address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-[#252525] rounded-t-md focus:outline-none focus:ring-[#1b5b40] focus:border-[#1b5b40] focus:z-10 sm:text-sm"
                  placeholder="Email address"
                  disabled={isPageDisabled} // Disable field on 5 attempts
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-[#252525] rounded-b-md focus:outline-none focus:ring-[#1b5b40] focus:border-[#1b5b40] focus:z-10 sm:text-sm"
                  placeholder="Password"
                  disabled={isPageDisabled} // Disable field on 5 attempts
                />
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#1b5b40] hover:bg-[#154f3a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1b5b40]"
              disabled={isPageDisabled} // Disable button on 5 attempts
            >
              Login
            </button>
            <button
              type="button"
              onClick={handleSignup}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#1b5b40] hover:bg-[#154f3a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1b5b40]"
              disabled={isPageDisabled} // Disable button on 5 attempts
            >
              Sign up
            </button>
          </div>
        </form>
        <div className="mt-8 bg-gray-100 p-4 rounded-md">
          <h3 className="text-lg font-semibold text-gray-800">Users for Debugging:</h3>
          <ul className="mt-2 space-y-1 text-sm text-gray-600">
            <li>Email: user@gmail.com | Password: user</li>
            <li>Email: admin@gmail.com | Password: admin</li>
            <li>Email: regulatory@gmail.com | Password: regulatory</li>
            <li>Email: animalhealth@gmail.com | Password: animalhealth</li>
            <li>Email: livestock@gmail.com | Password: livestock</li>
          </ul>
        </div>
      </div>

      {/* Error Modal */}
      <ErrorModal
        isOpen={isErrorModalOpen || isPageDisabled}
        onClose={() => setIsErrorModalOpen(false)}
        message={isPageDisabled ? 'Too many failed login attempts. Please try again later.' : `Login attempt failed. ${error}. Attempts: ${loginAttempts}`}
      />
    </div>
  );
};

export default LoginPage;