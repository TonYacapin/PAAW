import React, { useState, useEffect } from "react";
import Navbar from "../../component/Navbar";

function Home() {
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    setUserRole(role);
  }, []);

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
          <h2 className="text-3xl font-bold text-[#252525] mb-6">
            {userRole === "admin" ? "Browse Divisions" : "Browse Forms"}
          </h2>
          <div className="flex flex-col space-y-4">
            {userRole === "admin" && (
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
            )}
            {userRole === "user" && (
              <>
                <button className="bg-[#1b5b40] text-white py-3 px-4 rounded-md shadow-md hover:bg-[#174932] transition-all">
                  User Form 1
                </button>
                <button className="bg-[#1b5b40] text-white py-3 px-4 rounded-md shadow-md hover:bg-[#174932] transition-all">
                  User Form 2
                </button>
              </>
            )}
            {userRole === "regulatory" && (
              <>
                <button className="bg-[#1b5b40] text-white py-3 px-4 rounded-md shadow-md hover:bg-[#174932] transition-all">
                  Regulatory Form 1
                </button>
                <button className="bg-[#1b5b40] text-white py-3 px-4 rounded-md shadow-md hover:bg-[#174932] transition-all">
                  Regulatory Form 2
                </button>
              </>
            )}
            {userRole === "animalhealth" && (
              <>
                <button className="bg-[#1b5b40] text-white py-3 px-4 rounded-md shadow-md hover:bg-[#174932] transition-all">
                  Animal Health Form 1
                </button>
                <button className="bg-[#1b5b40] text-white py-3 px-4 rounded-md shadow-md hover:bg-[#174932] transition-all">
                  Animal Health Form 2
                </button>
              </>
            )}
            {userRole === "livestock" && (
              <>
                <button className="bg-[#1b5b40] text-white py-3 px-4 rounded-md shadow-md hover:bg-[#174932] transition-all">
                  Livestock Form 1
                </button>
                <button className="bg-[#1b5b40] text-white py-3 px-4 rounded-md shadow-md hover:bg-[#174932] transition-all">
                  Livestock Form 2
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
