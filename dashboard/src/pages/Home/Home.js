import React, { useState, useEffect } from "react";
import Navbar from "../../component/Navbar";
import { useNavigate } from "react-router-dom";
import ChartComponent from "../../component/ChartComponent";
import AnimalHealthChartComponent from "../../component/AnimalHealthChartComponent";
import LivestockChartComponent from "../../component/LivestockChartComponent";
import RegulatoryChartComponent from "../../component/RegulatoryChartComponent";
import Modal from "../../component/Modal";
import RabiesVaccinationReport from "../RABIES/RabiesVaccinationReport";
import Select from 'react-select';

function Home() {
  const [userRole, setUserRole] = useState("");
  const [selectedDivision, setSelectedDivision] = useState(null);
  const [selectedCharts, setSelectedCharts] = useState([]);
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

  const handleChartSelect = (selectedOptions) => {
    setSelectedCharts(selectedOptions.map(option => option.value));
  };

  // Define all possible chart options
  const allChartOptions = [
    { value: "admin", label: "Admin Chart" },
    { value: "animalhealth", label: "Animal Health Chart" },
    { value: "livestock", label: "Livestock Chart" },
    { value: "regulatory", label: "Regulatory Chart" },
  ];

  // Filter chart options based on userRole
  const getChartOptions = () => {
    switch (userRole) {
      case "admin":
        return allChartOptions; // Admin can see all charts
      case "animalhealth":
        return allChartOptions.filter(option => option.value === "animalhealth");
      case "livestock":
        return allChartOptions.filter(option => option.value === "livestock");
      case "regulatory":
        return allChartOptions.filter(option => option.value === "regulatory");
      default:
        return []; // If no role matches, return empty array
    }
  };

  const renderCharts = () => {
    const chartClasses = "bg-white shadow-md rounded-lg p-6 flex items-center justify-center text-center";
    const chartTextClasses = "text-gray-700 font-semibold text-lg";

    if (selectedCharts.length > 0) {
      return (
        <div className="space-y-6">
          {selectedCharts.includes("admin") && <ChartComponent />}
          {selectedCharts.includes("animalhealth") && <AnimalHealthChartComponent />}
          {selectedCharts.includes("livestock") && <LivestockChartComponent />}
          {selectedCharts.includes("regulatory") && <RegulatoryChartComponent />}
        </div>
      );
    }

    return (
      <div className={chartClasses}>
        <p className={chartTextClasses}>Please select charts to display.</p>
      </div>
    );
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

  // Custom styles for react-select component
  const customSelectStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: "#FFFAFA",
      borderColor: "#1b5b40",
      borderRadius: "0.5rem",
      padding: "0.5rem",
      fontSize: "1rem",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#1b5b40",
      },
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: "#1b5b40",
      color: "#FFFAFA",
      borderRadius: "0.25rem",
      padding: "0.25rem 0.5rem",
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: "#FFFAFA",
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: "#FFFAFA",
      "&:hover": {
        backgroundColor: "#ffe356",
        color: "#252525",
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#1b5b40" : "#FFFAFA",
      color: state.isSelected ? "#FFFAFA" : "#252525",
      "&:hover": {
        backgroundColor: "#1b5b40",
        color: "#FFFAFA",
      },
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#FFFAFA",
      border: "1px solid #1b5b40",
    }),
  };

  return (
    <div className="container mx-auto p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="flex flex-col lg:flex-row lg:space-x-8">
        {/* Navbar */}
        <Navbar onDivisionChange={handleDivisionChange} />
  
        {/* Left Side - Charts */}
        <div className="flex-1 space-y-6 lg:space-y-8 p-4 lg:p-8">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-4 text-center lg:text-left">
            Select Charts to Display
          </h3>
  
          {/* Chart Selection Dropdown */}
          <div className="w-full">
            <Select
              isMulti
              options={getChartOptions()}
              onChange={handleChartSelect}
              styles={customSelectStyles}
              placeholder="Select charts..."
              className="text-sm sm:text-base"
            />
          </div>
  
          {/* Conditional Rendering for Charts */}
          <div className="w-full">
            {selectedCharts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                {selectedCharts.includes("admin") && (
                  <div className="bg-white shadow-md rounded-lg p-6 lg:p-8 w-full h-72 sm:h-80 lg:h-[30rem] xl:h-[35rem]">
                    <ChartComponent />
                  </div>
                )}
                {selectedCharts.includes("animalhealth") && (
                  <div className="bg-white shadow-md rounded-lg p-6 lg:p-8 w-full h-72 sm:h-80 lg:h-[30rem] xl:h-[35rem]">
                    <AnimalHealthChartComponent />
                  </div>
                )}
                {selectedCharts.includes("livestock") && (
                  <div className="bg-white shadow-md rounded-lg p-6 lg:p-8 w-full h-72 sm:h-80 lg:h-[30rem] xl:h-[35rem]">
                    <LivestockChartComponent />
                  </div>
                )}
                {selectedCharts.includes("regulatory") && (
                  <div className="bg-white shadow-md rounded-lg p-6 lg:p-8 w-full h-72 sm:h-80 lg:h-[30rem] xl:h-[35rem]">
                    <RegulatoryChartComponent />
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white shadow-md rounded-lg p-6 flex items-center justify-center text-center">
                <p className="text-gray-700 font-semibold text-base">
                  Please select charts to display.
                </p>
              </div>
            )}
          </div>
  
        </div>
        {/* Right Side - Forms */}
        <div className="w-full lg:w-1/3 space-y-6 lg:space-y-8">
          {renderForms()}
        </div>
      </div>
    </div>
  );
}

export default Home;
