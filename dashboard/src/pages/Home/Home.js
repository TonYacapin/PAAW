import React, { useState, useEffect } from "react";
import Navbar from "../../component/Navbar";
import { useNavigate } from "react-router-dom";
import ChartComponent from "../../component/ChartComponent";
import AnimalHealthChartComponent from "../../component/AnimalHealthChartComponent";
import LivestockChartComponent from "../../component/LivestockChartComponent";
import RegulatoryChartComponent from "../../component/RegulatoryChartComponent";
import Modal from "../../component/Modal";
import Select from "react-select";

import RabiesVaccinationReport from "../RABIES/RabiesVaccinationReport";
import VaccinationReport from "../Animal Disease Prevention Control and Eradication/VaccinationReport";
import RoutineServicesMonitoringReport from "../Livestock and Poultry DRRM/RoutineServicesMonitoringReport";
import DiseaseInvestigationForm from "../Livestock and Poultry DRRM/DiseaseInvestigationForm";
import RabiesHistoryForm from "../RABIES/RabiesHistoryForm";
import AccomplishmentReport from "../AccomplishmentReport";
import RSMAccomplishmentReport from "../RSMAccomplishmentReport";
//Charts

import RabiesReportChart from "../../component/RabiesReportChart ";
import DiseaseInvestigationChart from "../../component/DiseaseInvestigationChart";
import VaccinationReportChart from "../../component/VaccinationReportChart";
import RoutineServicesMonitoringReportChart from "../../component/RoutineServicesMonitoringReportChart ";
import RabiesHistoryCharts from "../../component/RabiesHistoryCharts";


import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import VaccinesIcon from "@mui/icons-material/Vaccines";
import ReportIcon from "@mui/icons-material/Report";
import HealingIcon from "@mui/icons-material/Healing";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PetsIcon from "@mui/icons-material/Pets";
import AssignmentIcon from "@mui/icons-material/Assignment";

import RequisitionIssueSlip from "../RequisitionIssueSlip ";
import { Inventory, Outbox } from "@mui/icons-material";

function Home() {
  const [userRole, setUserRole] = useState("");
  const [selectedDivision, setSelectedDivision] = useState(null);
  const [selectedCharts, setSelectedCharts] = useState([]);
  const navigate = useNavigate();
  const [isModalOpen, setModalOpen] = useState(false);

  const [modalContent, setModalContent] = useState(null);

  const renderModalContent = () => {
    switch (modalContent) {
      case "RabiesVaccinationReport":
        return <RabiesVaccinationReport />;
      case "VaccinationReport":
        return <VaccinationReport />;
      case "RoutineServicesMonitoringReport":
        return <RoutineServicesMonitoringReport />;
      case "DiseaseInvestigationForm":
        return <DiseaseInvestigationForm />;
      case "RequisisionSlip":
        return <RequisitionIssueSlip />;
      case "RabiesHistoryForm":
        return <RabiesHistoryForm />;
      case "AccomplishmentReport":
        return <AccomplishmentReport />  ;

      default:
        return null;
    }
  };

  const openModalWithContent = (content) => {
    setModalContent(content);
    openModal();
  };

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  useEffect(() => {
    const role = localStorage.getItem("userRole");
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
    setSelectedCharts(selectedOptions.map((option) => option.value));
  };

  const allChartOptions = [
    { value: "admin", label: "Admin Chart" },
    { value: "animalhealth", label: "Animal Health Chart" },
    { value: "livestock", label: "Livestock Chart" },
    { value: "regulatory", label: "Regulatory Chart" },
    { value: "rabies", label: "Rabies Chart" },
    { value: "disease", label: "Disease Investigation Chart" },
    { value: "vaccination", label: "Vaccination Report Chart" },
    { value: "routine", label: "Routine Services Monitoring Report Chart" },
    { value: "rabiesHistory", label: "Rabies History Charts" },




  ];

  const getChartOptions = () => {
    switch (userRole) {
      case "admin":
        return allChartOptions;
      case "animalhealth":
        return allChartOptions.filter(
          (option) => option.value === "animalhealth"
        );
      case "livestock":
        return allChartOptions.filter((option) => option.value === "livestock");
      case "regulatory":
        return allChartOptions.filter(
          (option) => option.value === "regulatory"
        );
      default:
        return [];
    }
  };

  const renderCharts = () => {
    const chartClasses =
      "md:h-2/5 bg-white shadow-md rounded-lg p-6 flex items-center justify-center text-center";
    const chartTextClasses = "text-gray-700 font-semibold text-lg";

    if (selectedCharts.length > 0) {
      return (
        <div className="space-y-6">
          {selectedCharts.includes("admin") && <ChartComponent />}
          {selectedCharts.includes("animalhealth") && (
            <AnimalHealthChartComponent />
          )}
          {selectedCharts.includes("livestock") && <LivestockChartComponent />}
          {selectedCharts.includes("regulatory") && <RegulatoryChartComponent />}
          {selectedCharts.includes("rabies") && <RabiesReportChart />}
          {selectedCharts.includes("disease") && <DiseaseInvestigationChart />}
          {selectedCharts.includes("vaccination") && <VaccinationReportChart />}
          {selectedCharts.includes("routine") && <RoutineServicesMonitoringReportChart />}
          {selectedCharts.includes("rabiesHistory") && <RabiesHistoryCharts />}


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
      "w-full   flex items-center bg-darkgreen text-white py-2 px-4 rounded-md shadow-sm hover:bg-darkergreen transition-colors";
    // hendre: sm:w-3/6 sm:h-40 sm:flex-col sm:flex-wrap
    switch (selectedDivision) {
      case "user":
        return (
          <>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Browse Forms from Client Forms
            </h3>
            <div className="space-y-6">
              {/* <div>
                <h4 className="text-lg font-medium text-gray-700 mb-2">Requisition Forms</h4>
                <div className="space-y-2">
                  <button className={buttonClasses}>
                    <ManageAccountsIcon className="mr-2" />  Requisition Form


                  </button>
                </div>
              </div> */}
              <div>
                <h4 className="text-lg font-medium text-gray-700 mb-2">
                  Request Services Forms
                </h4>
                <div className="space-y-2">
                  <button className={buttonClasses}>
                    <VaccinesIcon className="mr-2" /> Animal Production Services
                    Request Form
                  </button>
                  <button className={buttonClasses}>
                    <ReportIcon className="mr-2" /> Veterinary Information
                    Services Request Form
                  </button>
                  <button className={buttonClasses}>
                    <HealingIcon className="mr-2" /> Animal Health Care Services
                    Request Form
                  </button>
                  <button className={buttonClasses}>
                    <LocalShippingIcon className="mr-2" /> Regulatory Care
                    Services Request Form
                  </button>
                </div>
              </div>
            </div>
          </>
        );
      case "admin":
        return (
          <>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Admin Actions
            </h3>
            <div className="space-y-2">
              <button
                className={buttonClasses}
                onClick={() => setSelectedDivision("user")}
              >
                <ManageAccountsIcon className="mr-2" /> Manage Users
              </button>
              <button
                className={buttonClasses}
                onClick={() => setSelectedDivision("user")}
              >
                <Outbox className="mr-2" /> Manage Requisition Forms
              </button>
              <button
                className={buttonClasses}
                onClick={() => setSelectedDivision("user")}
              >
                <Inventory className="mr-2" /> Manage Equipment Inventory
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
            <div className="space-y-6">
              <h4 className="text-lg font-medium text-gray-700 mb-2">
                Requisition Forms
              </h4>
              <div className="space-y-2">
                <button className={buttonClasses}>
                  <Outbox className="mr-2" /> Requisition Form
                </button>
              </div>
              <div>
                <h4 className="text-lg font-medium text-gray-700 mb-2">
                  Vaccination Forms
                </h4>
                <div className="space-y-2">
                  <button
                    onClick={() =>
                      openModalWithContent("RabiesVaccinationReport")
                    }
                    className={buttonClasses}
                  >
                    <ReportIcon className="mr-2" /> Rabies Vaccination
                  </button>
                  {/* <Modal isOpen={isModalOpen} onClose={closeModal}>
                    <RabiesVaccinationReport />
                  </Modal> */}
                  <button
                    onClick={() => openModalWithContent("VaccinationReport")}
                    className={buttonClasses}
                  >
                    <ReportIcon className="mr-2" /> Vaccination Report
                  </button>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-medium text-gray-700 mb-2">
                  Reports
                </h4>
                <div className="space-y-2">
                  <button 
                   onClick={() => openModalWithContent("AccomplishmentReport")}
                  className={buttonClasses}>
                    <AssignmentIcon className="mr-2" /> Generate Accomplishment
                    Report
                  </button>
                  <button
                    onClick={() =>
                      openModalWithContent("RoutineServicesMonitoringReport")
                    }
                    className={buttonClasses}
                  >
                    <AssignmentIcon className="mr-2" /> Routine Service
                    Monitoring Reports
                  </button>
                  <button
                    onClick={() =>
                      openModalWithContent("DiseaseInvestigationForm")
                    }
                    className={buttonClasses}
                  >
                    <ReportIcon className="mr-2" /> Disease Investigation Form
                  </button>
                  <button className={buttonClasses}>
                    <ReportIcon className="mr-2" /> Disease Surveillance and
                    Incident Report
                  </button>
                  <button
                    onClick={() => openModalWithContent("RabiesHistoryForm")}
                    className={buttonClasses}
                  >
                    <PetsIcon className="mr-2" /> Rabies History
                  </button>
                </div>
              </div>
            </div>
          </>
        );
      case "livestock":
        return (
          <>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Browse Forms from Livestock
            </h3>
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-medium text-gray-700 mb-2">
                  Requisition Forms
                </h4>
                <div className="space-y-2">
                  <button className={buttonClasses}>
                    <ManageAccountsIcon className="mr-2" /> Requisition Form
                  </button>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-medium text-gray-700 mb-2">
                  Livestock Management
                </h4>
                <div className="space-y-2">
                  <button className={buttonClasses}>
                    <PetsIcon className="mr-2" /> Artificial Insemination
                  </button>
                  <button className={buttonClasses}>
                    <PetsIcon className="mr-2" /> Offspring Monitoring
                  </button>
                  <button className={buttonClasses}>
                    <PetsIcon className="mr-2" /> Estrus Synchronization
                  </button>
                  <button className={buttonClasses}>
                    <AssignmentIcon className="mr-2" /> Generate Monthly
                    Accomplishment Reports
                  </button>
                  <button className={buttonClasses}>
                    <PetsIcon className="mr-2" /> Vitamin ADE Supplement
                  </button>
                  <button className={buttonClasses}>
                    <PetsIcon className="mr-2" /> Pregnancy Diagnostics
                  </button>
                </div>
              </div>
            </div>
          </>
        );
      case "regulatory":
        return (
          <>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Browse Forms from Regulatory
            </h3>
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-medium text-gray-700 mb-2">
                  Requisition Forms
                </h4>
                <div className="space-y-2">
                  <button className={buttonClasses}>
                    <ManageAccountsIcon className="mr-2" /> Requisition Form
                  </button>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-medium text-gray-700 mb-2">
                  Shipment
                </h4>
                <div className="space-y-2">
                  <button className={buttonClasses}>
                    <LocalShippingIcon className="mr-2" /> Veterinary Shipment
                  </button>
                  <button className={buttonClasses}>
                    <LocalShippingIcon className="mr-2" /> Slaughter Shipment
                  </button>
                </div>
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  const customSelectStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: "#FFFAFA",
      borderColor: "#1b5b40",
      borderRadius: "0.5rem",
      padding: "0.5rem",
      fontSize: "1rem",
      boxShadow: "none",
      zIndex: 1, // Ensure the select is behind the navbar
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
    <>
      <div className="container max-w-full flex lg:flex-row md:flex-col sm:flex-col xs:flex-col bg-white min-h-screen relative overflow-hidden">
        {/* Navbar */}
        <Navbar onDivisionChange={handleDivisionChange} />
        {/* Add relative positioning */}
        <div className="container flex flex-col lg:justify-center max-w-full lg:flex-row p-8 overflow-y-scroll max-h-[100vh]">
          {/* Main Content Wrapper */}
          <div className="flex flex-col lg:flex-row w-full">
            {/* Left Side - Charts */}
            <div className="flex-1 space-y-6 lg:space-y-8 p-4 lg:p-8">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-4 text-center lg:text-left">
                Select Charts to Display
              </h3>

              {/* Chart Selection Dropdown */}
              <div className="w-full z-10">
                {" "}
                {/* Increase z-index for dropdown */}
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
              <div className="w-full">{renderCharts()}</div>
            </div>

            {/* Right Side - Forms */}
            <div className="w-full lg:w-1/3 space-y-6 lg:space-y-8 lg:ml-8 mt-8 lg:mt-0">
              {renderForms()}
            </div>
          </div>
        </div>
      </div>
      {/* Modal Component */}
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          {renderModalContent()}
        </Modal>
      )}
    </>
  );
}

export default Home;
