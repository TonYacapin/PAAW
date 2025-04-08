import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../component/axiosInstance";
import placeholder1 from "./assets/NVLOGO.png";
import placeholder2 from "./assets/PAAW.png";
import ErrorModal from "../component/ErrorModal";
import CryptoJS from "crypto-js";
// Import icons (you'll need to install react-icons)
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineMail, AiOutlineLock, AiOutlineWifi, AiOutlineDisconnect } from "react-icons/ai";

const LoginPage = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isPageDisabled, setIsPageDisabled] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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

  // Function to hash password using crypto-js
  const hashPassword = (password) => {
    return CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
  };

  const storeCredentials = async (email, password, token, userRole) => {
    const hashedPassword = hashPassword(password);
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
    const hashedPassword = hashPassword(password);

    if (credentials.hashedPassword === hashedPassword) {
      return credentials;
    }
    return null;
  };

  const isMobile = () => {
    return window.matchMedia("(max-width: 1024px)").matches;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loginAttempts >= 5) {
      setError("Too many failed login attempts. Please try again later.");
      setIsErrorModalOpen(true);
      return;
    }

    setIsLoading(true);
    
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
      let errorMessage = "Login failed. Please try again.";
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }

      console.error("Login error:", error);
      setError(errorMessage);
      setIsErrorModalOpen(true);

      setLoginAttempts((prevAttempts) => {
        const newAttempts = prevAttempts + 1;
        if (newAttempts >= 5) {
          setIsPageDisabled(true);
        }
        return newAttempts;
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-emerald-50 to-teal-100 relative overflow-hidden">
      {/* Offline indicator */}
      {isOffline && (
        <div className="fixed top-0 left-0 right-0 bg-amber-100 text-amber-800 py-2 px-4 flex items-center justify-center shadow-md z-50">
          <AiOutlineDisconnect className="mr-2 text-lg" />
          <span>You are offline. Login is available for previously logged-in users.</span>
        </div>
      )}

      {/* Left side - decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center bg-gradient-to-br from-[#1b5b40] to-[#0f3b29] p-12">
        <div className="max-w-md">
          <div className="flex items-center justify-center mb-6">
            <img src={placeholder1} alt="NV Logo" className="w-24 h-24 mr-4" />
            <img src={placeholder2} alt="PAAW Logo" className="w-24 h-24" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-6">Portable Assistant for Animal Welfare</h1>
          <p className="text-emerald-100 text-lg leading-relaxed">
            Empowering veterinarians and animal welfare officers with digital tools 
            to improve animal health monitoring and regulatory compliance.
          </p>
  
        </div>
        
        {/* Abstract shapes */}
        <div className="absolute top-10 right-10 w-40 h-40 bg-emerald-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-60 h-60 bg-teal-300/10 rounded-full blur-3xl"></div>
      </div>

      {/* Right side - form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex justify-center space-x-4 mb-8">
            <img src={placeholder1} alt="NV Logo" className="w-16 h-16" />
            <img src={placeholder2} alt="PAAW Logo" className="w-16 h-16" />
          </div>
          
          <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center lg:text-left">
            Welcome Back
          </h2>
          <p className="text-gray-600 mb-8 text-center lg:text-left">
            Sign in to access the PAAW dashboard
          </p>
          
          <div className={`bg-white p-8 rounded-xl shadow-lg transition-all duration-300 ${isPageDisabled && "opacity-50 pointer-events-none"}`}>
            <form className="space-y-6" onSubmit={handleLogin}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <AiOutlineMail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1b5b40] focus:border-transparent transition-colors"
                      placeholder="you@example.com"
                      disabled={isPageDisabled}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <a href="#" className="text-sm text-[#1b5b40] hover:text-[#154f3a] transition-colors">
                      Forgot password?
                    </a>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <AiOutlineLock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="appearance-none block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1b5b40] focus:border-transparent transition-colors"
                      placeholder="•••••••••••"
                      disabled={isPageDisabled}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-400 hover:text-gray-500 focus:outline-none"
                      >
                        {showPassword ? (
                          <AiOutlineEyeInvisible className="h-5 w-5" />
                        ) : (
                          <AiOutlineEye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <button
                  type="submit"
                  disabled={isPageDisabled || isLoading}
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-[#1b5b40] hover:bg-[#154f3a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1b5b40] transition-all duration-200 relative overflow-hidden"
                >
                  {isLoading ? (
                    <>
                      <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                      Signing in...
                    </>
                  ) : (
                    "Sign in"
                  )}
                </button>
              </div>
              
              <div className="flex items-center justify-center">
                {isOffline ? (
                  <div className="flex items-center text-amber-600">
                    <AiOutlineDisconnect className="mr-1" />
                    <span className="text-sm">Offline mode</span>
                  </div>
                ) : (
                  <div className="flex items-center text-green-600">
                    <AiOutlineWifi className="mr-1" />
                    <span className="text-sm">Connected</span>
                  </div>
                )}
              </div>
            </form>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <a 
                href="/signup" 
                className="font-medium text-[#1b5b40] hover:text-[#154f3a] transition-colors"
              >
                Create an account
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Error Modal */}
      <ErrorModal
        isOpen={isErrorModalOpen || isPageDisabled}
        onClose={() => setIsErrorModalOpen(false)}
        message={
          isPageDisabled
            ? "Too many failed login attempts. Please try again later."
            : error
        }
      />
    </div>
  );
};

export default LoginPage;