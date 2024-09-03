import React, { useState, useEffect } from 'react';
import axios from 'axios';
import placeholder1 from './assets/NVLOGO.png'; // Adjust path if needed
import placeholder2 from './assets/PAAW.png'; // Adjust path if needed
import { useNavigate } from 'react-router-dom';
// SplashScreen Component
const SplashScreen = ({ onFinish }) => {
  const [currentScreen, setCurrentScreen] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timers = [
      setTimeout(() => setCurrentScreen(1), 1000), // Show second logo after 1 second
      setTimeout(() => setFadeOut(true), 2000), // Start fading out after 2 seconds
      setTimeout(() => onFinish(), 2500), // Finish splash screen after 2.5 seconds
    ];

    return () => timers.forEach(timer => clearTimeout(timer));
  }, [onFinish]);

  return (
    <div
      className={`min-h-screen flex items-center justify-center bg-[#FFFAFA] transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {currentScreen === 0 && (
        <img src={placeholder1} alt="Logo 1" className="w-24 h-24 object-cover" />
      )}
      {currentScreen === 1 && (
        <img src={placeholder2} alt="Logo 2" className="w-24 h-24 object-cover" />
      )}
    </div>
  );
};

// LoginPage Component
const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login', {
        email,
        password,
      });

      const { token } = response.data;
      localStorage.setItem('token', token);

      console.log('Logged in successfully:', response.data);
      navigate('/Home')
      // Redirect to another page after successful login
      // e.g., window.location.href = '/dashboard';
    } catch (error) {
      console.error('Error logging in:', error.response?.data?.message || error.message);
      setError('Invalid email or password');
    }
  };
  const handleSignup = () => {
    navigate('/signup');
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
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          <div className="flex gap-4">
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#1b5b40] hover:bg-[#154f3a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1b5b40]"
            >
              Login
            </button>
            <button
              type="button"
              onClick={handleSignup}
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

// App Component
const App = () => {
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // 768px is a common breakpoint for mobile
    };

    handleResize(); // Check on mount
    window.addEventListener('resize', handleResize);

    // Start splash screen only on mobile
    if (isMobile) {
      setLoading(true);
      setTimeout(() => setLoading(false), 2500); // 2.5 seconds for splash screen
    }

    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile]);

  return loading ? <SplashScreen onFinish={() => setLoading(false)} /> : <LoginPage />;
};

export default App;
