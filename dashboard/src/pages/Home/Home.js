import React, { useState, useEffect } from "react";
import Navbar from "../../component/Navbar";

function Home() {
  const [userRole, setUserRole] = useState("");
  const [selectedDivision, setSelectedDivision] = useState(null); // New state for the selected division

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    console.log("userRole:", role); // Debugging line
    setUserRole(role);
  }, []);

  useEffect(() => {

    if (userRole) {
      setSelectedDivision(userRole);
    }

  }, [userRole]);

  const renderCharts = () => {
    switch (userRole) {
      case "admin":
        return (
          <>
            <div className="bg-gray-100 shadow-md rounded-md h-64 flex items-center justify-center">
              <p className="text-gray-700 font-semibold">Admin Chart 1</p>
            </div>
            <div className="bg-gray-100 shadow-md rounded-md h-64 flex items-center justify-center">
              <p className="text-gray-700 font-semibold">Admin Chart 2</p>
            </div>
          </>
        );
      case "user":
        return (
          <>
            {/* User-specific charts can be added here */}
          </>
        );
      case "regulatory":
        return (
          <>
            <div className="bg-gray-100 shadow-md rounded-md h-64 flex items-center justify-center">
              <p className="text-gray-700 font-semibold">Regulatory Chart 1</p>
            </div>
          </>
        );
      case "animalhealth":
        return (
          <>
            <div className="bg-gray-100 shadow-md rounded-md h-64 flex items-center justify-center">
              <p className="text-gray-700 font-semibold">Animal Health Chart 1</p>
            </div>
          </>
        );
      case "livestock":
        return (
          <>
            <div className="bg-gray-100 shadow-md rounded-md h-64 flex items-center justify-center">
              <p className="text-gray-700 font-semibold">Livestock Chart 1</p>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  const renderForms = () => {
    switch (selectedDivision) {
      case "user":
        return (
          <>
            <h3 className="text-xl font-semibold text-[#252525]">
              Browse Forms from Client Forms
            </h3>
            <button className="bg-[#1b5b40] text-white py-3 px-4 rounded-md shadow-md hover:bg-[#174932] transition-all">
              Manage Requisition Form
            </button>
            <button className="bg-[#1b5b40] text-white py-3 px-4 rounded-md shadow-md hover:bg-[#174932] transition-all">
              Animal Production Services Request Form
            </button>
            <button className="bg-[#1b5b40] text-white py-3 px-4 rounded-md shadow-md hover:bg-[#174932] transition-all">
              Veterinary Information Services Request Form
            </button>
            <button className="bg-[#1b5b40] text-white py-3 px-4 rounded-md shadow-md hover:bg-[#174932] transition-all">
              Animal Health Care Services Request Form
            </button>
            <button className="bg-[#1b5b40] text-white py-3 px-4 rounded-md shadow-md hover:bg-[#174932] transition-all">
              Regulatory Care Services Request Form
            </button>
          </>
        );
      case "admin":
        return (
          <>

            <button className="bg-[#1b5b40] text-white py-3 px-4 rounded-md shadow-md hover:bg-[#174932] transition-all">
              Clients
            </button>
            <button className="bg-[#1b5b40] text-white py-3 px-4 rounded-md shadow-md hover:bg-[#174932] transition-all">
              Admin
            </button>
            <button className="bg-[#1b5b40] text-white py-3 px-4 rounded-md shadow-md hover:bg-[#174932] transition-all">
              Animal Health
            </button>
            <button className="bg-[#1b5b40] text-white py-3 px-4 rounded-md shadow-md hover:bg-[#174932] transition-all">
              Livestock
            </button>
            <button className="bg-[#1b5b40] text-white py-3 px-4 rounded-md shadow-md hover:bg-[#174932] transition-all">
              Regulatory
            </button>
          </>
        );
      case "animalhealth":
        return (
          <>
            <h3 className="text-xl font-semibold text-[#252525]">
              Browse Forms from AnimalHealth Forms
            </h3>
            <button className="bg-[#1b5b40] text-white py-3 px-4 rounded-md shadow-md hover:bg-[#174932] transition-all">
              Manage Requisition Form
            </button>
            <button className="bg-[#1b5b40] text-white py-3 px-4 rounded-md shadow-md hover:bg-[#174932] transition-all">
              Manage Rabies Vaccination
            </button>
            <button className="bg-[#1b5b40] text-white py-3 px-4 rounded-md shadow-md hover:bg-[#174932] transition-all">
              Manage Vaccination Report
            </button>
            <button className="bg-[#1b5b40] text-white py-3 px-4 rounded-md shadow-md hover:bg-[#174932] transition-all">
              Generate Accomplishment Report
            </button>
            <button className="bg-[#1b5b40] text-white py-3 px-4 rounded-md shadow-md hover:bg-[#174932] transition-all">
              Routine Service Monitoring Reports
            </button>
            <button className="bg-[#1b5b40] text-white py-3 px-4 rounded-md shadow-md hover:bg-[#174932] transition-all">
              Disease Investigation Form
            </button>
            <button className="bg-[#1b5b40] text-white py-3 px-4 rounded-md shadow-md hover:bg-[#174932] transition-all">
              Disease Surveillance and Incident Report
            </button>
            <button className="bg-[#1b5b40] text-white py-3 px-4 rounded-md shadow-md hover:bg-[#174932] transition-all">
              Manage Rabies History
            </button>
          </>
        );
      case "livestock":
        return (
          <>
            <h3 className="text-xl font-semibold text-[#252525]">
              Browse Forms from Livestock Forms
            </h3>
            <button className="bg-[#1b5b40] text-white py-3 px-4 rounded-md shadow-md hover:bg-[#174932] transition-all">
              Manage Requisition Form
            </button>
            <button className="bg-[#1b5b40] text-white py-3 px-4 rounded-md shadow-md hover:bg-[#174932] transition-all">
              Manage Artificial Insemination
            </button>
            <button className="bg-[#1b5b40] text-white py-3 px-4 rounded-md shadow-md hover:bg-[#174932] transition-all">
              Manage Offspring Monitoring
            </button>
            <button className="bg-[#1b5b40] text-white py-3 px-4 rounded-md shadow-md hover:bg-[#174932] transition-all">
              Manage Estrus Synchronization
            </button>
            <button className="bg-[#1b5b40] text-white py-3 px-4 rounded-md shadow-md hover:bg-[#174932] transition-all">
              Generate Monthly Accomplishment Reports
            </button>
            <button className="bg-[#1b5b40] text-white py-3 px-4 rounded-md shadow-md hover:bg-[#174932] transition-all">
              Manage Vitamin ADE Supplement
            </button>
            <button className="bg-[#1b5b40] text-white py-3 px-4 rounded-md shadow-md hover:bg-[#174932] transition-all">
              Manage Pregnancy Diagnostics
            </button>
          </>
        );
      case "regulatory":
        return (
          <>
            <h3 className="text-xl font-semibold text-[#252525]">
              Browse Forms from Regulatory Forms
            </h3>
            <button className="bg-[#1b5b40] text-white py-3 px-4 rounded-md shadow-md hover:bg-[#174932] transition-all">
              Manage Requisition Form
            </button>
            <button className="bg-[#1b5b40] text-white py-3 px-4 rounded-md shadow-md hover:bg-[#174932] transition-all">
              Manage Veterinary Shipment
            </button>
            <button className="bg-[#1b5b40] text-white py-3 px-4 rounded-md shadow-md hover:bg-[#174932] transition-all">
              Manage Slaughter Shipment
            </button>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col md:flex-row justify-between p-4 md:p-8 bg-[#FFFAFA] min-h-screen">
        {/* Left Side - Charts */}
        <div className="flex flex-col md:w-2/3 space-y-6">
          {renderCharts()}
        </div>

        {/* Right Side - Buttons */}
        <div className="mt-8 md:mt-0 md:w-1/3 space-y-6">
          {/* Only show this for admin */}
          {userRole === "admin" && (
            <h2 className="text-3xl font-bold text-[#252525] mb-6">
              Browse Divisions
            </h2>
          )}

          <div className="flex flex-col space-y-4">
            {userRole === "admin" && (
              <>
                <button
                  className="bg-[#1b5b40] text-white py-3 px-4 rounded-md shadow-md hover:bg-[#174932] transition-all"
                  onClick={() => setSelectedDivision("user")}
                >
                  Clients
                </button>
                <button
                  className="bg-[#1b5b40] text-white py-3 px-4 rounded-md shadow-md hover:bg-[#174932] transition-all"
                  onClick={() => setSelectedDivision("admin")}
                >
                  Admin
                </button>
                <button
                  className="bg-[#1b5b40] text-white py-3 px-4 rounded-md shadow-md hover:bg-[#174932] transition-all"
                  onClick={() => setSelectedDivision("animalhealth")}
                >
                  Animal Health
                </button>
                <button
                  className="bg-[#1b5b40] text-white py-3 px-4 rounded-md shadow-md hover:bg-[#174932] transition-all"
                  onClick={() => setSelectedDivision("livestock")}
                >
                  Livestock
                </button>
                <button
                  className="bg-[#1b5b40] text-white py-3 px-4 rounded-md shadow-md hover:bg-[#174932] transition-all"
                  onClick={() => setSelectedDivision("regulatory")}
                >
                  Regulatory
                </button>
              </>
            )}

            {/* Separator */}
            <hr className="border-t-2 border-gray-300 my-4" />

            {/* Display Division Name */}
            {/* {selectedDivision && userRole === "admin" && (
              <h3 className="text-xl font-semibold text-[#252525]">
                Browse Forms from {selectedDivision.charAt(0).toUpperCase() + selectedDivision.slice(1)} Forms
              </h3>
            )} */}

            {/* Render forms based on the selected division */}
            {renderForms()}
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
