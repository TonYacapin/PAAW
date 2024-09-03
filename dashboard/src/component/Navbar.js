import React from "react";
import { useNavigate } from "react-router-dom";
import Logo from '../pages/assets/PAAW.png';

function Navbar() {
  const role = localStorage.getItem('userRole');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const renderButtons = () => {
    switch (role) {
      case 'admin':
        return (
          <>
            <button className="text-white">Clients</button>
            <button className="text-white">Admin</button>
            <button className="text-white">Animal Health</button>
            <button className="text-white">Livestock</button>
            <button className="text-white">Regulatory</button>
            <button className="text-white" onClick={handleLogout}>Logout</button>
          </>
        );
      case 'regulatory':
        return (
          <>
            <button className="text-white">Regulatory</button>
            <button className="text-white" onClick={handleLogout}>Logout</button>
          </>
        );
      case 'animalhealth':
        return (
          <>
            <button className="text-white">Animal Health</button>
            <button className="text-white" onClick={handleLogout}>Logout</button>
          </>
        );
      case 'livestock':
        return (
          <>
            <button className="text-white">Livestock</button>
            <button className="text-white" onClick={handleLogout}>Logout</button>
          </>
        );
      case 'user':
      default:
        return (
          <>
            <button className="text-white">Clients</button>
            <button className="text-white" onClick={handleLogout}>Logout</button>
          </>
        );
    }
  };

  return (
    <div className="h-16 w-full bg-darkgreen flex items-center justify-between px-4">
      <img src={Logo} alt="Home" className="h-12" />
      <div className="flex-1 flex justify-center">
        <div className="flex space-x-4 bg-gray-800 p-2 rounded-md border border-gray-700">
          {renderButtons()}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
