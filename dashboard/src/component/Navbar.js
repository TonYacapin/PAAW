import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Logo from '../pages/assets/PAAW.png';
import { People, Pets, Agriculture, Gavel } from '@mui/icons-material'; // MUI icons

function Navbar({ onDivisionChange }) {
  const role = localStorage.getItem('userRole');
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  // Define baseClasses for consistency
  const baseClasses = "px-6 py-3 text-xl rounded-md text-white flex items-center space-x-3 cursor-pointer bg-[#154e34] hover:bg-[#123c29] transition-colors";

  const renderButtons = () => {
    switch (role) {
      case 'admin':
        return (
          <>
            <div className={baseClasses} onClick={() => onDivisionChange('user')}>
              <People /> <span>Clients</span>
            </div>
            <div className={baseClasses} onClick={() => onDivisionChange('admin')}>
              <People /> <span>Admin</span>
            </div>
            <div className={baseClasses} onClick={() => onDivisionChange('animalhealth')}>
              <Pets /> <span>Animal Health</span>
            </div>
            <div className={baseClasses} onClick={() => onDivisionChange('livestock')}>
              <Agriculture /> <span>Livestock</span>
            </div>
            <div className={baseClasses} onClick={() => onDivisionChange('regulatory')}>
              <Gavel /> <span>Regulatory</span>
            </div>
          </>
        );
      case 'regulatory':
        return (
          <>
            <div className={baseClasses} onClick={() => onDivisionChange('user')}>
              <People /> <span>Clients</span>
            </div>
            <div className={baseClasses} onClick={() => onDivisionChange('regulatory')}>
              <Gavel /> <span>Regulatory</span>
            </div>
          </>
        );
      case 'animalhealth':
        return (
          <>
            <div className={baseClasses} onClick={() => onDivisionChange('user')}>
              <People /> <span>Clients</span>
            </div>
            <div className={baseClasses} onClick={() => onDivisionChange('animalhealth')}>
              <Pets /> <span>Animal Health</span>
            </div>
          </>
        );
      case 'livestock':
        return (
          <>
            <div className={baseClasses} onClick={() => onDivisionChange('user')}>
              <People /> <span>Clients</span>
            </div>
            <div className={baseClasses} onClick={() => onDivisionChange('livestock')}>
              <Agriculture /> <span>Livestock</span>
            </div>
          </>
        );
      case 'user':
      default:
        return (
          <>
            <div className={baseClasses} onClick={() => onDivisionChange('user')}>
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
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex h-full">
      {/* Side Navbar */}
      <div ref={menuRef} className={`fixed top-0 left-0 h-full w-64 bg-[#1b5b40] flex flex-col items-center shadow-lg p-6 transition-transform duration-300 ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        {/* Logo */}
        <img src={Logo} alt="Logo" className="h-32 mb-10" /> {/* Bigger logo */}

        {/* Buttons */}
        <div className="space-y-4 w-full flex-grow">
          {renderButtons()}
        </div>

        {/* Logout button at the bottom */}
        <div className="mt-auto w-full">
          <div className={`${baseClasses} bg-red-600`} onClick={handleLogout}>
            <span>Logout</span>
          </div>
        </div>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)} 
          className="text-white text-3xl"
        >
          {isMenuOpen ? '✖️' : '☰'}
        </button>
      </div>

      {/* Main Content */}
   
    </div>
  );
}

export default Navbar;
