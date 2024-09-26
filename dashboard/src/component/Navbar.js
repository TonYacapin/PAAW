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
import {
  AppBar,
  Button,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@mui/material";

function Navbar({ onDivisionChange, selectedDivision }) {
  const role = localStorage.getItem("userRole");
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  function onDivisionButtonClick(division) {
    setIsMenuOpen(false)
    onDivisionChange(division)
  }

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const baseClasses =
    "px-6 py-3 text-xl rounded-md text-white flex items-center space-x-3 cursor-pointer bg-darkgreen hover:bg-darkergreen transition-colors ";

  const renderButtons = () => {
    switch (role) {
      case "admin":
        return (
          <>
            <div
              className={baseClasses + (selectedDivision === "admin" && "bg-darkergreen")}
              onClick={() => onDivisionButtonClick("admin")}
            >
              <People /> <span>Admin</span>
            </div>
            <div
              className={baseClasses + (selectedDivision === "user" && "bg-darkergreen")}
              onClick={() => onDivisionButtonClick("user")}
            >
              <People /> <span>Clients</span>
            </div>
            <div
              className={baseClasses + (selectedDivision === "animalhealth" && "bg-darkergreen")}
              onClick={() => onDivisionButtonClick("animalhealth")}
            >
              <Pets /> <span>Animal Health</span>
            </div>
            <div
              className={baseClasses  + (selectedDivision === "livestock" && "bg-darkergreen")}
              onClick={() => onDivisionButtonClick("livestock")}
            >
              <Agriculture /> <span>Livestock</span>
            </div>
            <div
              className={baseClasses + (selectedDivision === "regulatory" && "bg-darkergreen")}
              onClick={() => onDivisionButtonClick("regulatory")}
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
              onClick={() => onDivisionButtonClick("user")}
            >
              <People /> <span>Clients</span>
            </div>
            <div
              className={baseClasses}
              onClick={() => onDivisionButtonClick("regulatory")}
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
              onClick={() => onDivisionButtonClick("user")}
            >
              <People /> <span>Clients</span>
            </div>
            <div
              className={baseClasses}
              onClick={() => onDivisionButtonClick("animalhealth")}
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
              onClick={() => onDivisionButtonClick("user")}
            >
              <People /> <span>Clients</span>
            </div>
            <div
              className={baseClasses}
              onClick={() => onDivisionButtonClick("livestock")}
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
              onClick={() => onDivisionButtonClick("user")}
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
            className={`lg:sticky 3xs:fixed 2xs:fixed 3md:fixed 2md:fixed md:fixed sm:fixed xs:fixed lg:translate-x-0 top-0 left-0 h-screen w-64 bg-[#1b5b40] flex flex-col items-center justify-center shadow-lg p-6 transition-transform duration-300 ${
              isMenuOpen ? "translate-x-0" : "-translate-x-full"
            } z-20`}
          >
            {/* Logo */}
            <img src={Logo} alt="Logo" className="h-auto w-40 drop-shadow-lg" />
            {/* Buttons */}
            <div className="space-y-4 w-full flex-grow justify-center flex flex-col lg:gap-0 md:gap-0 sm:gap-0">
              {renderButtons()}
            </div>
            {/* Logout button at the bottom */}
            <div className="mt-auto mb-10 w-full">
              <div className={`${baseClasses}`} onClick={handleLogout}>
                <Logout />
                <span>Logout</span>
              </div>
            </div>
          </div>

          {/* Main Content */}
        </div>
        {/* Mobile Menu Button */}
        {/* <div className="lg:hidden w-full fixed top-0 right-0 z-30">
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
        </div> */}
        {useMediaQuery("(min-width:913px)") ? (
          <></>
        ) : (
          <>
            <AppBar position="static" sx={{ background: "#1b5b40" }}>
              <Toolbar>
                <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  sx={{ mr: 2, color: "#fffafa" }}
                >
                  <Menu />
                </IconButton>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} />
                <Button sx={{ color: "#fffafa" }} variant="text" onClick={handleLogout}>
                  Logout
                </Button>
              </Toolbar>
            </AppBar>
            <Drawer
              open={isMenuOpen}
              onClose={() => setIsMenuOpen(false)}
              sx={{ zIndex: 3 }}
            >
              {Navbar}
            </Drawer>
          </>
        )}

        {/* {Button} */}
      </div>
    </>
  );
}

export default Navbar;
