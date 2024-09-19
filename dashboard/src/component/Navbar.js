import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../pages/assets/PAAW.png";
import {
  People,
  Pets,
  Agriculture,
  Gavel,
  Logout,
  Menu,
  Close,
} from "@mui/icons-material"; // MUI icons

function Navbar({ onDivisionChange }) {
  const role = localStorage.getItem("userRole");
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const baseClasses =
    "px-6 py-3 text-xl rounded-md text-white flex items-center space-x-3 cursor-pointer bg-darkgreen hover:bg-darkergreen transition-colors";

  const renderButtons = () => {
    switch (role) {
      case "admin":
        return (
          <>
            <div
              className={baseClasses}
              onClick={() => onDivisionChange("admin")}
            >
              <People /> <span>Admin</span>
            </div>
            <div
              className={baseClasses}
              onClick={() => onDivisionChange("user")}
            >
              <People /> <span>Clients</span>
            </div>
            <div
              className={baseClasses}
              onClick={() => onDivisionChange("animalhealth")}
            >
              <Pets /> <span>Animal Health</span>
            </div>
            <div
              className={baseClasses}
              onClick={() => onDivisionChange("livestock")}
            >
              <Agriculture /> <span>Livestock</span>
            </div>
            <div
              className={baseClasses}
              onClick={() => onDivisionChange("regulatory")}
            >
              <Gavel /> <span>Regulatory</span>
            </div>
          </>
        );
      case "regulatory":
        return (
          <>
            <div
              className={baseClasses}
              onClick={() => onDivisionChange("user")}
            >
              <People /> <span>Clients</span>
            </div>
            <div
              className={baseClasses}
              onClick={() => onDivisionChange("regulatory")}
            >
              <Gavel /> <span>Regulatory</span>
            </div>
          </>
        );
      case "animalhealth":
        return (
          <>
            <div
              className={baseClasses}
              onClick={() => onDivisionChange("user")}
            >
              <People /> <span>Clients</span>
            </div>
            <div
              className={baseClasses}
              onClick={() => onDivisionChange("animalhealth")}
            >
              <Pets /> <span>Animal Health</span>
            </div>
          </>
        );
      case "livestock":
        return (
          <>
            <div
              className={baseClasses}
              onClick={() => onDivisionChange("user")}
            >
              <People /> <span>Clients</span>
            </div>
            <div
              className={baseClasses}
              onClick={() => onDivisionChange("livestock")}
            >
              <Agriculture /> <span>Livestock</span>
            </div>
          </>
        );
      case "user":
      default:
        return (
          <>
            <div
              className={baseClasses}
              onClick={() => onDivisionChange("user")}
            >
              <People /> <span>Clients</span>
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

  return (
    <>
      <div className="flex h-full">
        <div className="flex items-center w-full">
          {/* Side Navbar */}
          <div
            ref={menuRef}
            className={`lg:sticky md:fixed sm:fixed xs:fixed top-0 left-0 h-screen w-64 bg-[#1b5b40] flex flex-col items-center justify-center shadow-lg p-6 transition-transform duration-300 ${
              isMenuOpen ? "translate-x-0" : "-translate-x-full"
            } md:translate-x-0 z-20`}
          >
            {/* Logo */}
            <img
              src={Logo}
              alt="Logo"
              className="h-auto w-40 drop-shadow-lg"
            />
            {/* Buttons */}
            <div className="space-y-4 w-full flex-grow justify-center flex flex-col lg:gap-2 md:gap-2 sm:gap-1">
              {renderButtons()}
            </div>
            {/* Logout button at the bottom */}
            <div className="mt-auto w-full">
              <div className={`${baseClasses}`} onClick={handleLogout}>
                <Logout />
                <span>Logout</span>
              </div>
            </div>
          </div>

          {/* Main Content */}
        </div>
        {/* Mobile Menu Button */}
        <div className="lg:hidden w-full fixed top-0 right-0 z-30">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white text-4xl"
          >
            {isMenuOpen ? (
              <Close sx={{ color: "#FFFAFA", fontSize: 40 }} />
            ) : (
              <Menu sx={{ color: "#1b5b40", fontSize: 40 }} />
            )}
          </button>
        </div>
      </div>
    </>
  );
}

export default Navbar;
