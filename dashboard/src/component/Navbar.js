import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import Logo from "../pages/assets/PAAW.png";
import {
  People,
  Pets,
  Agriculture,
  Gavel,
  Logout,
  Menu,
  Person,
  ChevronRight,
  ArrowBack,
  Dashboard,
  Home,
  Close
} from "@mui/icons-material";
import {
  AppBar,
  Button,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
  useMediaQuery,
  Avatar,
  Tooltip
} from "@mui/material";

function Navbar({ onDivisionChange, selectedDivision, handleLogout }) {
  const [role, setRole] = useState(null);
  const [userName, setUserName] = useState("User");
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const menuRef = useRef(null);
  const isMobile = useMediaQuery("(max-width:912px)");

  // Decode the token to get the user role
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setRole(decodedToken.role);
        // Extract user name if available in token
        if (decodedToken.name) {
          setUserName(decodedToken.name);
        }
      } catch (error) {
        console.error("Invalid token", error);
        setRole(null);
      }
    }
  }, []);

  function onDivisionButtonClick(division) {
    setIsMenuOpen(false);
    onDivisionChange(division);
  }

  const baseClasses = `flex items-center space-x-3 cursor-pointer transition-all duration-200 rounded-xl px-4 py-3 my-1
    hover:bg-opacity-90 ${isCollapsed ? 'justify-center' : ''}`;

  const activeClasses = "bg-white text-[#1b5b40] font-medium shadow-md";
  const inactiveClasses = "text-white hover:bg-white/10";

  const mobileMenuClasses = isMobile ? "py-4" : ""; // Add extra padding for mobile menu items

  // Get the first letter of the userName for avatar
  const getInitial = () => {
    return userName.charAt(0).toUpperCase();
  };

  // Generate background color based on role
  const getRoleColor = () => {
    switch (role) {
      case "admin": return "bg-amber-400";
      case "regulatory": return "bg-blue-400";
      case "animalhealth": return "bg-green-400";
      case "livestock": return "bg-purple-400";
      case "extensionworker": return "bg-cyan-400";
      default: return "bg-gray-300";
    }
  };

  const renderButtons = () => {
    // Existing button rendering code remains the same
    switch (role) {
      case "admin":
        return (
          <>
            <div
              className={`${baseClasses} ${mobileMenuClasses} ${selectedDivision === "admin" ? activeClasses : inactiveClasses}`}
              onClick={() => onDivisionButtonClick("admin")}
            >
              <People sx={{ color: 'inherit' }} />
              {!isCollapsed && <span>Admin</span>}
            </div>
            <div
              className={`${baseClasses} ${mobileMenuClasses} ${selectedDivision === "user" ? activeClasses : inactiveClasses}`}
              onClick={() => onDivisionButtonClick("user")}
            >
              <Person sx={{ color: 'inherit' }} />
              {!isCollapsed && <span>Clients</span>}
            </div>
            <div
              className={`${baseClasses} ${mobileMenuClasses} ${selectedDivision === "animalhealth" ? activeClasses : inactiveClasses}`}
              onClick={() => onDivisionButtonClick("animalhealth")}
            >
              <Pets sx={{ color: 'inherit' }} />
              {!isCollapsed && <span>Animal Health</span>}
            </div>
            <div
              className={`${baseClasses} ${mobileMenuClasses} ${selectedDivision === "livestock" ? activeClasses : inactiveClasses}`}
              onClick={() => onDivisionButtonClick("livestock")}
            >
              <Agriculture sx={{ color: 'inherit' }} />
              {!isCollapsed && <span>Livestock</span>}
            </div>
            <div
              className={`${baseClasses} ${mobileMenuClasses} ${selectedDivision === "regulatory" ? activeClasses : inactiveClasses}`}
              onClick={() => onDivisionButtonClick("regulatory")}
            >
              <Gavel sx={{ color: 'inherit' }} />
              {!isCollapsed && <span>Regulatory</span>}
            </div>
          </>
        );
      // Other cases remain the same
      case "regulatory":
        return (
          <>
            <div
              className={`${baseClasses} ${mobileMenuClasses} ${selectedDivision === "user" ? activeClasses : inactiveClasses}`}
              onClick={() => onDivisionButtonClick("user")}
            >
              <Person sx={{ color: 'inherit' }} />
              {!isCollapsed && <span>Clients</span>}
            </div>
            <div
              className={`${baseClasses} ${mobileMenuClasses} ${selectedDivision === "regulatory" ? activeClasses : inactiveClasses}`}
              onClick={() => onDivisionButtonClick("regulatory")}
            >
              <Gavel sx={{ color: 'inherit' }} />
              {!isCollapsed && <span>Regulatory</span>}
            </div>
          </>
        );
      case "animalhealth":
        return (
          <>
            <div
              className={`${baseClasses} ${mobileMenuClasses} ${selectedDivision === "user" ? activeClasses : inactiveClasses}`}
              onClick={() => onDivisionButtonClick("user")}
            >
              <Person sx={{ color: 'inherit' }} />
              {!isCollapsed && <span>Clients</span>}
            </div>
            <div
              className={`${baseClasses} ${mobileMenuClasses} ${selectedDivision === "animalhealth" ? activeClasses : inactiveClasses}`}
              onClick={() => onDivisionButtonClick("animalhealth")}
            >
              <Pets sx={{ color: 'inherit' }} />
              {!isCollapsed && <span>Animal Health</span>}
            </div>
          </>
        );
      case "livestock":
        return (
          <>
            <div
              className={`${baseClasses} ${mobileMenuClasses} ${selectedDivision === "user" ? activeClasses : inactiveClasses}`}
              onClick={() => onDivisionButtonClick("user")}
            >
              <Person sx={{ color: 'inherit' }} />
              {!isCollapsed && <span>Clients</span>}
            </div>
            <div
              className={`${baseClasses} ${mobileMenuClasses} ${selectedDivision === "livestock" ? activeClasses : inactiveClasses}`}
              onClick={() => onDivisionButtonClick("livestock")}
            >
              <Agriculture sx={{ color: 'inherit' }} />
              {!isCollapsed && <span>Livestock</span>}
            </div>
          </>
        );
      case "extensionworker":
        return (
          <>
            <div
              className={`${baseClasses} ${mobileMenuClasses} ${selectedDivision === "user" ? activeClasses : inactiveClasses}`}
              onClick={() => onDivisionButtonClick("user")}
            >
              <Person sx={{ color: 'inherit' }} />
              {!isCollapsed && <span>Clients</span>}
            </div>
            <div
              className={`${baseClasses} ${mobileMenuClasses} ${selectedDivision === "animalhealth" ? activeClasses : inactiveClasses}`}
              onClick={() => onDivisionButtonClick("animalhealth")}
            >
              <Pets sx={{ color: 'inherit' }} />
              {!isCollapsed && <span>Animal Health</span>}
            </div>
            <div
              className={`${baseClasses} ${mobileMenuClasses} ${selectedDivision === "livestock" ? activeClasses : inactiveClasses}`}
              onClick={() => onDivisionButtonClick("livestock")}
            >
              <Agriculture sx={{ color: 'inherit' }} />
              {!isCollapsed && <span>Livestock</span>}
            </div>
          </>
        );
      case "user":
      default:
        return (
          <>
            <div
              className={`${baseClasses} ${mobileMenuClasses} ${selectedDivision === "user" ? activeClasses : inactiveClasses}`}
              onClick={() => onDivisionButtonClick("user")}
            >
              <Person sx={{ color: 'inherit' }} />
              {!isCollapsed && <span>Clients</span>}
            </div>
          </>
        );
    }
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogoutModal = () => {
    setLogoutModalOpen(true);
  };

  const confirmLogout = () => {
    handleLogout();
    navigate("/login", { replace: true });
    setLogoutModalOpen(false);
  };

  const toggleSidebarCollapse = () => {
    if (!isMobile) {
      setIsCollapsed(!isCollapsed);
    }
  };

  return (
    <>
      <div className="flex h-full">
        <div className="flex items-center w-full">
          {/* Mobile Drawer - This is a better approach for mobile */}
          {isMobile && (
            <Drawer
              anchor="left"
              open={isMenuOpen}
              onClose={() => setIsMenuOpen(false)}
              PaperProps={{
                sx: {
                  width: '85%',
                  maxWidth: '320px',
                  borderRadius: '0 16px 16px 0',
                  background: 'linear-gradient(to bottom, #1b5b40, #0f3b29)',
                  boxShadow: '4px 0 24px rgba(0,0,0,0.2)'
                }
              }}
            >
              <div className="flex flex-col h-full">
                {/* Drawer Header with close button */}
                <div className="flex items-center justify-between bg-white/10 backdrop-blur-sm border-b border-white/5 p-4">
                  <div className="flex items-center">
                    <img src={Logo} alt="PAAW Logo" className="h-10 w-auto" />
                    <div className="ml-3">
                      <h1 className="font-bold text-white text-lg">PAAW</h1>
                      <p className="text-xs text-emerald-200">Animal Welfare</p>
                    </div>
                  </div>
                  <IconButton 
                    onClick={() => setIsMenuOpen(false)}
                    size="medium"
                    sx={{ color: 'white' }}
                  >
                    <Close />
                  </IconButton>
                </div>
                
                {/* Mobile User Profile */}
                <div className="p-4">
                  <div className="flex items-center space-x-3 p-4 mb-4 bg-white/10 backdrop-blur-sm rounded-xl">
                    <Avatar className={getRoleColor()} sx={{ width: 40, height: 40 }}>
                      {getInitial()}
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-white font-medium">{userName}</span>
                      <span className="text-emerald-200 text-xs capitalize">{role}</span>
                    </div>
                  </div>
                </div>
                
                {/* Navigation for mobile */}
                <div className="p-4 flex-grow overflow-y-auto">
                  <div className="mb-2 text-emerald-200 text-xs uppercase font-medium tracking-wider px-2">
                    Navigation
                  </div>
                  

                  {renderButtons()}
                </div>

                {/* Logout button at the bottom for mobile */}
                <div className="p-4 mt-auto border-t border-white/5">
                  <div 
                    className={`${baseClasses} py-4 hover:bg-red-500/20 text-red-100`}
                    onClick={handleLogoutModal}
                  >
                    <Logout sx={{ color: 'inherit' }} />
                    <span>Logout</span>
                  </div>
                  <div className="text-xs text-center mt-4 text-emerald-200 opacity-50">
                    PAAW v1.0.0
                  </div>
                </div>
              </div>
            </Drawer>
          )}
          
          {/* Regular Sidebar for Desktop */}
          {!isMobile && (
            <div
              ref={menuRef}
              className={`lg:sticky top-0 left-0 h-screen
                ${isCollapsed ? 'w-20' : 'w-72'} bg-gradient-to-b from-[#1b5b40] to-[#0f3b29] flex flex-col 
                shadow-xl transition-all duration-300 ease-in-out z-20`}
            >
              {/* App Brand Banner - Redesigned Logo Area */}
              <div className="bg-white/10 backdrop-blur-sm border-b border-white/5">
                <div className="flex items-center justify-between p-4">
                  <div className={`flex items-center ${isCollapsed ? 'justify-center w-full' : ''}`}>
                    <img 
                      src={Logo} 
                      alt="PAAW Logo" 
                      className={`${isCollapsed ? 'w-10 h-10' : 'h-12 w-auto'} drop-shadow-lg`} 
                    />
                    {!isCollapsed && (
                      <div className="ml-3">
                        <h1 className="font-bold text-white text-lg">PAAW</h1>
                        <p className="text-xs text-emerald-200">Animal Welfare</p>
                      </div>
                    )}
                  </div>
                  {!isMobile && !isCollapsed && (
                    <Tooltip title="Collapse">
                      <IconButton 
                        onClick={toggleSidebarCollapse} 
                        className="text-white hover:bg-white/10"
                        size="small"
                      >
                        <ArrowBack fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </div>
              </div>

              {/* User Profile Section */}
              <div className="px-4 py-5">
                <div className={`flex ${isCollapsed ? 'justify-center' : 'items-center space-x-3'} p-3 bg-white/10 backdrop-blur-sm rounded-xl`}>
                  <Avatar className={`${getRoleColor()} ${isCollapsed ? 'mx-auto' : ''}`}>
                    {getInitial()}
                  </Avatar>
                  {!isCollapsed && (
                    <div className="flex flex-col">
                      <span className="text-white font-medium text-sm">{userName}</span>
                      <span className="text-emerald-200 text-xs capitalize">{role}</span>
                    </div>
                  )}
                </div>
                
                {/* Collapse button for collapsed state */}
                {!isMobile && isCollapsed && (
                  <div className="mt-4 flex justify-center">
                    <Tooltip title="Expand">
                      <IconButton 
                        onClick={toggleSidebarCollapse}
                        className="bg-white/10 text-white hover:bg-white/20"
                        size="small"
                      >
                        <ChevronRight fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </div>
                )}
              </div>

              {/* Navigation Section */}
              <div className="px-4 flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                <div className={`${!isCollapsed ? 'mb-2 text-emerald-200 text-xs uppercase font-medium tracking-wider px-4' : 'text-center mb-2'}`}>
                  {!isCollapsed ? 'Navigation' : '•••'}
                </div>
        
                {renderButtons()}
              </div>

              {/* Logout button at the bottom */}
              <div className="p-4 mt-auto">
                <div 
                  className={`${baseClasses} hover:bg-red-500/20 text-red-100`}
                  onClick={handleLogoutModal}
                >
                  <Logout sx={{ color: 'inherit' }} />
                  {!isCollapsed && <span>Logout</span>}
                </div>
                <div className={`text-xs text-center mt-4 text-emerald-200 opacity-50 ${isCollapsed ? 'hidden' : 'block'}`}>
                  PAAW v1.0.0
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Mobile Top Bar */}
        {isMobile && (
          <AppBar position="fixed" elevation={2} sx={{ 
            background: "linear-gradient(to right, #1b5b40, #0f3b29)",
            height: "64px"
          }}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <div className="flex items-center">
                <IconButton
                  edge="start"
                  aria-label="menu"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  sx={{ color: "#ffffff", mr: 2 }}
                >
                  <Menu />
                </IconButton>
                <div className="flex items-center">
                  <img src={Logo} alt="Logo" className="h-9 w-auto mr-3" />
                  <div>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                      PAAW
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8, display: 'block', lineHeight: 1 }}>
                      Animal Welfare
                    </Typography>
                  </div>
                </div>
              </div>
              <Avatar 
                className={`${getRoleColor()} border-2 border-white/30`}
                sx={{ width: 36, height: 36 }}
              >
                {getInitial()}
              </Avatar>
            </Toolbar>
          </AppBar>
        )}
        
        {/* Mobile content spacer */}
        {isMobile && <div className="h-16" />}
      </div>

      {/* Logout Confirmation Modal */}
      {logoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-2xl p-6 w-96 shadow-2xl transform transition-transform scale-100 animate-fade-in">
            <div className="flex items-center space-x-4 mb-6">
              <div className="p-3 bg-red-100 rounded-full">
                <Logout sx={{ color: '#dc2626' }} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Sign out</h2>
                <p className="text-gray-500 text-sm">Are you sure you want to sign out?</p>
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                onClick={() => setLogoutModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
                onClick={confirmLogout}
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;