import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Home from "./pages/Home/Home";
import SignupForm from "./pages/SignupPage";
import ProtectedRoute from "./component/ProtectedRoute";

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupForm />} />
          
          {/* Protected route for Home */}
          <Route path="/home" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />

          {/* Redirect root path to home */}
          <Route path="/" element={<Navigate to="/home" replace />} />
          
          {/* Catch all route for undefined paths */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;