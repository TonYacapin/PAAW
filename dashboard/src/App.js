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
  const [isOffline, setIsOffline] = useState(false);
  const [showIndicator, setShowIndicator] = useState(false);

  // Service Worker Registration
  useEffect(() => {
    const registerServiceWorker = async () => {
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.register('/service-worker.js');
          console.log('Service Worker registration successful:', registration);
        } catch (error) {
          console.error('Service Worker registration failed:', error);
        }
      } else {
        console.log('Service Workers are not supported in this browser');
      }
    };

    registerServiceWorker();
  }, []);

  // Network Status Management
  useEffect(() => {
    let networkCheckTimeout;
    let periodicCheckInterval;

    const checkConnectionStatus = () => {
      const isOnline = navigator.onLine;

      if (!isOnline) {
        setIsOffline(true);
        setShowIndicator(true);
        return;
      }

      const timestamp = new Date().getTime();
      const testImage = new Image();

      networkCheckTimeout = setTimeout(() => {
        testImage.src = '';
        setIsOffline(true);
        setShowIndicator(true);
      }, 5000);

      testImage.onload = () => {
        clearTimeout(networkCheckTimeout);
        setIsOffline(false);
        setShowIndicator(true);
        setTimeout(() => setShowIndicator(false), 3000);
      };

      testImage.onerror = () => {
        clearTimeout(networkCheckTimeout);
        setIsOffline(true);
        setShowIndicator(true);
      };

      testImage.src = `https://www.google.com/favicon.ico?t=${timestamp}`;
    };

    const handleOnline = () => {
      checkConnectionStatus();
    };

    const handleOffline = () => {
      setIsOffline(true);
      setShowIndicator(true);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        checkConnectionStatus();
      }
    };

    checkConnectionStatus();

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    periodicCheckInterval = setInterval(checkConnectionStatus, 30000);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearInterval(periodicCheckInterval);
      clearTimeout(networkCheckTimeout);
    };
  }, []);

  // Authentication Check
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

  // Logout Handler
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

  // Connection Status Indicator Component
  const ConnectionIndicator = () => (
    <div
      className={`fixed bottom-4 right-4 sm:bottom-8 sm:right-8 transition-all duration-300 ease-in-out ${showIndicator ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}
      style={{ zIndex: 1000 }}
    >
      <div
        className={`flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-3 rounded-full shadow-lg transition-colors duration-300 ${isOffline ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'
          }`}
      >
        {isOffline ? (
          <WifiOffIcon style={{ fontSize: 20 }} /> // Smaller font size for mobile
        ) : (
          <WifiIcon style={{ fontSize: 20 }} />
        )}
        <span className="text-sm sm:text-md font-semibold whitespace-nowrap">
          {isOffline ? 'You are Offline, Some functions may not work' : 'Connected'}
        </span>
      </div>
    </div>
  );


  // PWA Install and Offline Handling
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      const promptElement = document.getElementById('pwa-install-prompt');
      const installButton = document.getElementById('install-button');

      if (promptElement && installButton) {
        promptElement.style.display = 'block';

        installButton.addEventListener('click', async () => {
          e.prompt();
          const { outcome } = await e.userChoice;
          if (outcome === 'accepted') {
            promptElement.style.display = 'none';
          }
        });
      }
    };

    const handleOnline = () => {
      const offlineMessage = document.getElementById('offline-message');
      if (offlineMessage) {
        offlineMessage.classList.remove('visible');
      }
    };

    const handleOffline = () => {
      const offlineMessage = document.getElementById('offline-message');
      if (offlineMessage) {
        offlineMessage.classList.add('visible');
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Loading Spinner
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
