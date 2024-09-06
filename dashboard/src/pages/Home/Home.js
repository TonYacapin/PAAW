import React, { useState, useEffect } from "react";
import Navbar from "../../component/Navbar";
import { useNavigate } from "react-router-dom";
import ChartComponent from "../../component/ChartComponent";
import AnimalHealthChartComponent from "../../component/AnimalHealthChartComponent";
import LivestockChartComponent from "../../component/LivestockChartComponent";
import RegulatoryChartComponent from "../../component/RegulatoryChartComponent";
import Modal from "../../component/Modal";
import RabiesVaccinationReport from "../RABIES/RabiesVaccinationReport";

function Home() {
  const [userRole, setUserRole] = useState("");
  const [selectedDivision, setSelectedDivision] = useState(null);
  const navigate = useNavigate();

  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);


  useEffect(() => {
    const role = localStorage.getItem("userRole");
    console.log("userRole:", role);
    setUserRole(role);
  }, []);

  useEffect(() => {
    if (userRole) {
      setSelectedDivision(userRole);
    }
  }, [userRole]);

  const handleDivisionChange = (division) => {
    setSelectedDivision(division);
  };

  const renderCharts = () => {
    const chartClasses = "bg-white shadow-md rounded-lg p-6 flex items-center justify-center text-center";
    const chartTextClasses = "text-gray-700 font-semibold text-lg";

    if (selectedDivision) {
      switch (selectedDivision) {
        case "admin":
          return <ChartComponent />;
        case "animalhealth":
          return <AnimalHealthChartComponent />;
        case "regulatory":
          return <RegulatoryChartComponent />;
        case "livestock":
          return <LivestockChartComponent />;
        default:
          return (
            <div className={chartClasses}>
              <p className={chartTextClasses}>No charts available for this division.</p>
            </div>
          );
      }
    }

    return null;
  };

  const renderForms = () => {
    const buttonClasses =
      "w-full bg-green-700 text-white py-2 px-4 rounded-md shadow-sm hover:bg-green-800 transition-colors";

    switch (selectedDivision) {
      case "user":
        return (
          <>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Browse Forms from Client Forms
            </h3>
            <div className="space-y-2">
              <button className={buttonClasses}>Manage Requisition Form</button>
              <button className={buttonClasses}>Animal Production Services Request Form</button>
              <button className={buttonClasses}>Veterinary Information Services Request Form</button>
              <button className={buttonClasses}>Animal Health Care Services Request Form</button>
              <button className={buttonClasses}>Regulatory Care Services Request Form</button>
            </div>
          </>
        );
      case "admin":
        return (
          <>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Admin Actions</h3>
            <div className="space-y-2">
              <button className={buttonClasses} onClick={() => setSelectedDivision("user")}>
                Manage Users
              </button>
            </div>
          </>
        );
      case "animalhealth":
        return (
          <>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Browse Forms from Animal Health
            </h3>
            <div className="space-y-2">
              <button className={buttonClasses}>Manage Requisition Form</button>
              <button onClick={openModal} className={buttonClasses}>Manage Rabies Vaccination</button>
              <Modal isOpen={isModalOpen} onClose={closeModal}>
               <RabiesVaccinationReport></RabiesVaccinationReport>
              </Modal>
              <button className={buttonClasses}>Manage Vaccination Report</button>
              
              <button className={buttonClasses}>Generate Accomplishment Report</button>
              <button className={buttonClasses}>Routine Service Monitoring Reports</button>
              <button className={buttonClasses}>Disease Investigation Form</button>
              <button className={buttonClasses}>Disease Surveillance and Incident Report</button>
              <button className={buttonClasses}>Manage Rabies History</button>
            </div>
          </>
        );
      case "livestock":
        return (
          <>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Browse Forms from Livestock
            </h3>
            <div className="space-y-2">
              <button className={buttonClasses}>Manage Requisition Form</button>
              <button className={buttonClasses}>Manage Artificial Insemination</button>
              <button className={buttonClasses}>Manage Offspring Monitoring</button>
              <button className={buttonClasses}>Manage Estrus Synchronization</button>
              <button className={buttonClasses}>Generate Monthly Accomplishment Reports</button>
              <button className={buttonClasses}>Manage Vitamin ADE Supplement</button>
              <button className={buttonClasses}>Manage Pregnancy Diagnostics</button>
            </div>
          </>
        );
      case "regulatory":
        return (
          <>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Browse Forms from Regulatory
            </h3>
            <div className="space-y-2">
              <button className={buttonClasses}>Manage Requisition Form</button>
              <button className={buttonClasses}>Manage Veterinary Shipment</button>
              <button className={buttonClasses}>Manage Slaughter Shipment</button>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <>
       
      <div className="container mx-auto p-4 md:p-8 bg-gray-50 min-h-screen">

        <div className="flex flex-col lg:flex-row lg:space-x-8">
        <Navbar onDivisionChange={handleDivisionChange} />
          {/* Left Side - Charts */}
          <div className="flex-1 space-y-6">
            {renderCharts()}
          </div>

          {/* Right Side - Buttons and Forms */}
          <div className="mt-8 lg:mt-0 lg:w-1/3 space-y-6">
            {userRole === "admin" && (
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Browse Divisions</h2>
            )}

            <div className="space-y-4">
              {userRole === "admin" && (
                <>
                  <button
                    className="w-full bg-green-700 text-white py-2 px-4 rounded-md shadow-sm hover:bg-green-800 transition-colors"
                    onClick={() => setSelectedDivision("admin")}
                  >
                    Admin
                  </button>
                  <button
                    className="w-full bg-green-700 text-white py-2 px-4 rounded-md shadow-sm hover:bg-green-800 transition-colors"
                    onClick={() => setSelectedDivision("user")}
                  >
                    Clients
                  </button>
                  <button
                    className="w-full bg-green-700 text-white py-2 px-4 rounded-md shadow-sm hover:bg-green-800 transition-colors"
                    onClick={() => setSelectedDivision("animalhealth")}
                  >
                    Animal Health
                  </button>
                  <button
                    className="w-full bg-green-700 text-white py-2 px-4 rounded-md shadow-sm hover:bg-green-800 transition-colors"
                    onClick={() => setSelectedDivision("livestock")}
                  >
                    Livestock
                  </button>
                  <button
                    className="w-full bg-green-700 text-white py-2 px-4 rounded-md shadow-sm hover:bg-green-800 transition-colors"
                    onClick={() => setSelectedDivision("regulatory")}
                  >
                    Regulatory
                  </button>
                </>
              )}

              {/* Separator */}
              <hr className="border-t-2 border-gray-300 my-4" />

              {/* Render forms based on the selected division */}
              {renderForms()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
