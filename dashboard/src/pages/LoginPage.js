import React, { useState } from 'react';
import placeholder1 from './assets/NVLOGO.png'; // Adjust path if needed
import placeholder2 from './assets/PAAW.png'; // Adjust path if needed

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Logging in with:', { email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFAFA]">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg">
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
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            {/* Additional content can be added here if needed */}
          </div>
          <div className="flex gap-4">
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#1b5b40] hover:bg-[#154f3a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1b5b40]"
            >
              Login
            </button>
            <button
              type="button" // Use type="button" to prevent form submission
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#1b5b40] hover:bg-[#154f3a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1b5b40]"
            >
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
