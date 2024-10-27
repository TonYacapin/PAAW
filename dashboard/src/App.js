import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import LoginPage from "./pages/LoginPage";
import Home from "./pages/Home/Home";
import SignupForm from "./pages/SignupPage";
import ProtectedRoute from "./component/ProtectedRoute";
import WifiIcon from '@mui/icons-material/Wifi';
import WifiOffIcon from '@mui/icons-material/WifiOff';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [showIndicator, setShowIndicator] = useState(false);

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      // Briefly show the indicator when connection status changes
      setShowIndicator(true);
      setTimeout(() => setShowIndicator(false), 3000);
    };

    const handleOffline = () => {
      setIsOffline(true);
      setShowIndicator(true);
      // setTimeout(() => setShowIndicator(false), 3000);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Rest of your authentication check code remains the same
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          const currentTime = Date.now() / 1000;
          if (decodedToken.exp > currentTime) {
            if (isOffline) {
              const userEmail = decodedToken.email;
              const storedCreds = localStorage.getItem(`credentials_${userEmail}`);
              if (storedCreds) {
                setIsAuthenticated(true);
              } else {
                handleLogout();
              }
            } else {
              setIsAuthenticated(true);
            }
          } else {
            handleLogout();
          }
        } catch (error) {
          console.error('Token verification failed:', error);
          handleLogout();
        }
      } else {
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [isOffline]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    if (!isOffline) {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (!key.startsWith('credentials_')) {
          localStorage.removeItem(key);
        }
      });
    }
    setIsAuthenticated(false);
  };

  // Subtle connection status indicator
  const ConnectionIndicator = () => (
    <div 
      className={`fixed bottom-8 right-8 transition-all ${
        showIndicator ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      }`}
      style={{ zIndex: 1000 }} // Make sure it's on top of other elements
    >
      <div className={`flex items-center gap-2 px-4 py-3 rounded-full shadow-lg ${
        isOffline ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'
      }`}>
        {isOffline ? (
          <WifiOffIcon style={{ fontSize: 24 }} />
        ) : (
          <WifiIcon style={{ fontSize: 24 }} />
        )}
        <span className="text-md font-semibold">
          {isOffline ? 'You are Offline, Some function may not work' : 'You are back online'}
        </span>
      </div>
    </div>
  );
  

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-darkgreen"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <ConnectionIndicator />
        <Routes>
          <Route 
            path="/login" 
            element={
              isAuthenticated ? (
                <Navigate to="/home" replace />
              ) : (
                <LoginPage 
                  setIsAuthenticated={setIsAuthenticated} 
                  isOffline={isOffline}
                />
              )
            } 
          />
          <Route 
            path="/signup" 
            element={
              isAuthenticated ? (
                <Navigate to="/home" replace />
              ) : (
                isOffline ? (
                  <Navigate to="/login" replace />
                ) : (
                  <SignupForm />
                )
              )
            } 
          />
          
          <Route 
            path="/home" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Home 
                  handleLogout={handleLogout} 
                  setIsAuthenticated={setIsAuthenticated}
                  isOffline={isOffline}
                />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/" 
            element={<Navigate to={isAuthenticated ? "/home" : "/login"} replace />} 
          />
          
          <Route 
            path="*" 
            element={<Navigate to={isAuthenticated ? "/home" : "/login"} replace />} 
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
