import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../component/axiosInstance";
import placeholder1 from "./assets/NVLOGO.png"; // Adjust path if needed
import placeholder2 from "./assets/PAAW.png"; // Adjust path if needed
import ErrorModal from "../component/ErrorModal"; // Import ErrorModal
import CryptoJS from "crypto-js"; // Import CryptoJS

const LoginPage = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isPageDisabled, setIsPageDisabled] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const navigate = useNavigate();

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Function to hash password (simplified version - in production use a proper crypto library)
  // Function to hash password using crypto-js
  const hashPassword = (password) => {
    return CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
  };

  const storeCredentials = async (email, password, token, userRole) => {
    const hashedPassword = hashPassword(password); // Updated
    const credentials = {
      email,
      hashedPassword,
      token,
      userRole,
      lastSync: new Date().toISOString(),
    };
    localStorage.setItem(`credentials_${email}`, JSON.stringify(credentials));
  };

  const verifyStoredCredentials = (email, password) => {
    const storedData = localStorage.getItem(`credentials_${email}`);
    if (!storedData) return null;

    const credentials = JSON.parse(storedData);
    const hashedPassword = hashPassword(password); // Updated

    if (credentials.hashedPassword === hashedPassword) {
      return credentials;
    }
    return null;
  };

  const isMobile = () => {
    return window.matchMedia("(max-width: 1024px)").matches; // Adjust max-width as needed
  };


  const handleLogin = async (e) => {
    e.preventDefault();
    if (loginAttempts >= 5) {
      setError("Too many failed login attempts. Please try again later.");
      setIsErrorModalOpen(true);
      return;
    }

    try {
      if (isOffline) {
        const credentials = await verifyStoredCredentials(email, password);
        if (credentials) {
          setIsAuthenticated(true);
          localStorage.setItem("token", credentials.token);
          navigate("/home");
        } else {
          throw new Error("Invalid credentials or no offline data available");
        }
      } else {
        const response = await axiosInstance.post(`/login`, { email, password });

        const { token, userRole } = response.data;
        if (isMobile() && userRole === "admin") {
          throw new Error("Admin login is not allowed on mobile devices");
        }

        await storeCredentials(email, password, token, userRole);
        localStorage.setItem("token", token);
        setIsAuthenticated(true);
        navigate("/home");
      }
    } catch (error) {
      // Display detailed error messages
      let errorMessage = "Login failed. Please try again.";
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message; // Use error message from backend
      }

      console.error("Login error:", error);
      setError(errorMessage);
      setIsErrorModalOpen(true);

      // Track login attempts and disable page if exceeded
      setLoginAttempts((prevAttempts) => {
        const newAttempts = prevAttempts + 1;
        if (newAttempts >= 5) {
          setIsPageDisabled(true);
        }
        return newAttempts;
      });
    }
  };


  const handleSignup = () => {
    navigate("/signup");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFAFA]">
      {/* Add offline indicator */}
      {isOffline && (
        <div className="fixed top-0 left-0 right-0 bg-red-200 text-red-800 text-center py-2">
          Offline login is available for previously logged-in users.
        </div>
      )}

      <div
        className={`w-full max-w-xs sm:max-w-md sm:w-auto sm:bg-white sm:rounded-xl sm:shadow-lg p-4 sm:p-10 ${isPageDisabled && "opacity-50 pointer-events-none"
          }`}
      >
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
          <h2 className="text-3xl font-bold text-[#1b5b40]">
            Portable Assistant for Animal Welfare
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="flex flex-col gap-y-2">
              <div>
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
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
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
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
          </div>
          <a
            href="/signup"
            className="flex"
          >
            <span>Don't have an account?</span>
            <span className="ml-1 lg:hover:text-darkgreen lg:text-black text-darkgreenb ">Sign Up</span>
          </a>
        </form>
        {/* <div className="mt-8 bg-gray-100 p-4 rounded-md">
          <h3 className="text-lg font-semibold text-gray-800">
            Users for Debugging:
          </h3>
          <ul className="mt-2 space-y-1 text-sm text-gray-600">
            <li>Email: user@gmail.com | Password: user</li>
            <li>Email: admin@gmail.com | Password: admin</li>
            <li>Email: regulatory@gmail.com | Password: regulatory</li>
            <li>Email: animalhealth@gmail.com | Password: animalhealth</li>
            <li>Email: livestock@gmail.com | Password: livestock</li>
          </ul>
        </div> */}
      </div>

      {/* Error Modal */}
      <ErrorModal
        isOpen={isErrorModalOpen || isPageDisabled}
        onClose={() => setIsErrorModalOpen(false)}
        message={
          isPageDisabled
            ? "Too many failed login attempts. Please try again later."
            : error // Display the specific error message
        }
      />

    </div>
  );
};

export default LoginPage;
