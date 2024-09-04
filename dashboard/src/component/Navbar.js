import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Logo from '../pages/assets/PAAW.png';

function Navbar() {
  const role = localStorage.getItem('userRole');
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const renderButtons = () => {
    const baseClasses = "px-6 py-3 text-xl rounded-md text-white bg-[#154e34] hover:bg-[#123c29] transition-colors";

    switch (role) {
      case 'admin':
        return (
          <>
            <button className={baseClasses}>Clients</button>
            <button className={baseClasses}>Admin</button>
            <button className={baseClasses}>Animal Health</button>
            <button className={baseClasses}>Livestock</button>
            <button className={baseClasses}>Regulatory</button>
            <button className={`${baseClasses} bg-red-600`} onClick={handleLogout}>Logout</button>
          </>
        );
      case 'regulatory':
        return (
          <>
            <button className={baseClasses}>Clients</button>
            <button className={baseClasses}>Regulatory</button>
            <button className={`${baseClasses} bg-red-600`} onClick={handleLogout}>Logout</button>
          </>
        );
      case 'animalhealth':
        return (
          <>
            <button className={baseClasses}>Clients</button>
            <button className={baseClasses}>Animal Health</button>
            <button className={`${baseClasses} bg-red-600`} onClick={handleLogout}>Logout</button>
          </>
        );
      case 'livestock':
        return (
          <>
            <button className={baseClasses}>Clients</button>
            <button className={baseClasses}>Livestock</button>
            <button className={`${baseClasses} bg-red-600`} onClick={handleLogout}>Logout</button>
          </>
        );
      case 'user':
      default:
        return (
          <>
            <button className={baseClasses}>Clients</button>
            <button className={`${baseClasses} bg-red-600`} onClick={handleLogout}>Logout</button>
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
    <div className="h-20 w-full bg-[#1b5b40] flex items-center justify-between px-8 py-4 shadow-lg">
      {/* Logo */}
      <img src={Logo} alt="Logo" className="h-16" />

      {/* Desktop Menu */}
      <div className="hidden md:flex flex-1 justify-center">
        <div className="flex space-x-6 bg-[#14452f] p-3 rounded-md border border-[#123c29]">
          {renderButtons()}
        </div>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden flex items-center">
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)} 
          className="text-white text-3xl"
        >
          {isMenuOpen ? '✖️' : '☰'}
        </button>
      </div>

      {/* Mobile Menu */}
      <div ref={menuRef} className={`md:hidden fixed top-0 right-0 w-72 bg-[#1b5b40] h-full p-6 transition-transform duration-300 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col space-y-6">
          {renderButtons()}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
