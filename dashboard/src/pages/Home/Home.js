// React and core libraries
import React, { useState, useEffect, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";

// Layout components
import Navbar from "../../component/Navbar";
import Modal from "../../component/Modal";
import Select from "react-select";
import { jwtDecode } from "jwt-decode";




// Chart components

import AnimalHealthChartComponent from "../../component/AnimalHealthChartComponent";
import LivestockChartComponent from "../../component/LivestockChartComponent";
import RegulatoryChartComponent from "../../component/RegulatoryChartComponent";
import OffSpringMonitoringChart from "../../component/OffSpringMonitoringChart";
import UpgradingServicesChart from "../../component/UpgradingServicesChart";
import TechnicianQuarterlyCharts from "../../component/TechnicianQuarterlyCharts";
import RabiesReportChart from "../../component/RabiesReportChart ";
import DiseaseInvestigationChart from "../../component/DiseaseInvestigationChart";
import VaccinationReportChart from "../../component/VaccinationReportChart";
import RoutineServicesMonitoringReportChart from "../../component/RoutineServicesMonitoringReportChart ";
import RabiesHistoryCharts from "../../component/RabiesHistoryCharts";

// Form components
import RabiesVaccinationReport from "../RABIES/RabiesVaccinationReport";
import VaccinationReport from "../Animal Disease Prevention Control and Eradication/VaccinationReport";
import RoutineServicesMonitoringReport from "../Livestock and Poultry DRRM/RoutineServicesMonitoringReport";
import DiseaseInvestigationForm from "../Livestock and Poultry DRRM/DiseaseInvestigationForm";
import RabiesHistoryForm from "../RABIES/RabiesHistoryForm";
import AccomplishmentReport from "../AccomplishmentReport";
import RSMAccomplishmentReport from "../RSMAccomplishmentReport";
import TechnicianQuarterlyReportForm from "../TechnicianQuarterlyReportForm";
import MonthlyAccomplishmentReportUpgradingServices from "../MonthlyAccomplishmentReportUpgradingServices";
import MonthlyAccomplishmentReportLivestock from "../MonthlyAccomplishmentReportLivestock";
import MonthlyAccomplishmentReport from "../MonthlyAccomplismentReport";
import RequisitionIssueSlip from "../RequisitionIssueSlip ";
import UserManagement from "../Admin Pages/UserManagement";
import UpgradingServices from "../UpgradingServices";
import OffspringMonitoring from "../OffspringMonitoring";
import { useMediaQuery } from "@mui/material";
import SlaughterReportList from "../Regulatory and Monitoring Division/SlaughterReportList";
import VeterinaryShipmentList from "../Regulatory and Monitoring Division/VeterinaryShipmentList";
import OutgoingReportList from "../Regulatory and Monitoring Division/OutgoingReportList";
import IncomingReportList from "../Regulatory and Monitoring Division/IncomingReportList";
import AuditLogList from "../Admin Pages/AuditLogList";

// Icon components (Material-UI)
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ReportIcon from "@mui/icons-material/Report";
import AssessmentIcon from "@mui/icons-material/Assessment";
import HealingIcon from "@mui/icons-material/Healing";
import SearchIcon from "@mui/icons-material/Search";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import VaccinesIcon from "@mui/icons-material/Vaccines";
import PetsIcon from "@mui/icons-material/Pets";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { Inventory, Outbox } from "@mui/icons-material";
import AnimalHealthCareServices from "../Client Request Forms/AnimalHealthCareServices";
import AnimalProductionServices from "../Client Request Forms/AnimalProductionServices";
import RegulatoryCareServices from "../Client Request Forms/RegulatoryCareServices";
import VeterinaryInformationServices from "../Client Request Forms/VeterinaryInformationServices";
import EquipmentInventory from "../Admin Pages/EquipmentInventory";

export const FilterContext = createContext(null);

function Home() {
  const [userRole, setUserRole] = useState("");
  const [selectedDivision, setSelectedDivision] = useState(null);
  const [selectedCharts, setSelectedCharts] = useState([]);
  const navigate = useNavigate();
  const [isModalOpen, setModalOpen] = useState(false);

  const [modalContent, setModalContent] = useState(null);
  const [openFilters, setOpenFilters] = useState(false);
  const [filters, setFilters] = useState({
    dateRange: [null, null],
    municipality: "",
  });
  const [showAll, setShowAll] = useState(true); // State to toggle between all data and filtered data

  // const [filterOptions, setFilterOptions] = useState({ filters, showAll });

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      dateRange:
        name === "startDate"
          ? [value, prev.dateRange[1]]
          : [prev.dateRange[0], value],
    }));
  };

  const handleMunicipalityChange = (e) => {
    setFilters((prev) => ({ ...prev, municipality: e.target.value }));
  };

  const toggleShowAll = () => {
    setShowAll((prevShowAll) => !prevShowAll); // Toggle between all data and filtered data
  };

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
      case "RequisitionSlip":
        return <RequisitionIssueSlip />;
      case "RabiesHistoryForm":
        return <RabiesHistoryForm />;
      case "AccomplishmentReport":
        return <MonthlyAccomplishmentReport />;
      case "UserManagement":
        return <UserManagement />;
      case "UpgradingServices":
        return <UpgradingServices />;
      case "OffSpringMonitoring":
        return <OffspringMonitoring />;
      case "CalfDrop":
        return <TechnicianQuarterlyReportForm />;
      case "AccomplishmentReportLivestock":
        return <MonthlyAccomplishmentReportLivestock />;
      case "SlaughterReportList":
        return <SlaughterReportList />;
      case "VeterinaryShipmentList":
        return <VeterinaryShipmentList />;
      case "OutgoingReportList":
        return <OutgoingReportList />;
      case "IncomingReportList":
        return <IncomingReportList />;
      case "AnimalHealthCareServices":
        return <AnimalHealthCareServices />;
      case "AnimalProductionServices":
        return <AnimalProductionServices />;
      case "RegulatoryCareServices":
        return <RegulatoryCareServices />;
      case "VeterinaryInformationServices":
        return <VeterinaryInformationServices />;
      case "AuditLogList":
        return <AuditLogList />;
        case "Inventory":
        return <EquipmentInventory />;

  

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

  const toggleFilter = () => setOpenFilters(!openFilters);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const role = decodedToken.role;
        console.log(role) // Adjust this key based on your token's structure
        setUserRole(role);
      } catch (error) {
        console.error("Invalid token", error);
      }
    }
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
    { value: "rabies", label: "Rabies Chart" },
    { value: "disease", label: "Disease Investigation Chart" },
    { value: "vaccination", label: "Vaccination Report Chart" },
    { value: "routine", label: "Routine Services Monitoring Report Chart" },
    { value: "rabiesHistory", label: "Rabies History Charts" },
    { value: "offSringMonitoring", label: "OffSring Monitoring Charts" },
    { value: "UpgradingServices", label: "Upgrading Services Charts" },
    {
      value: "TechnicianQuarterly",
      label: "Technician Quarterly Calf Drop Charts",
    },
    { value: "regulatory", label: "Regulatory Chart" },
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
      "md:h-2/5 bg-white shadow-md rounded-lg p-6 flex flex-wrap items-center justify-center text-center";

    const chartTextClasses = "text-gray-700 font-semibold text-lg";

    if (selectedCharts.length > 0) {
      return (
        <div className="space-y-6">

          {selectedCharts.includes("animalhealth") && (
            <AnimalHealthChartComponent />
          )}
          {selectedCharts.includes("livestock") && <LivestockChartComponent />}
          {selectedCharts.includes("regulatory") && (
            <RegulatoryChartComponent />
          )}
          {selectedCharts.includes("rabies") && <RabiesReportChart />}
          {selectedCharts.includes("disease") && <DiseaseInvestigationChart />}
          {selectedCharts.includes("vaccination") && <VaccinationReportChart />}
          {selectedCharts.includes("routine") && (
            <RoutineServicesMonitoringReportChart />
          )}
          {selectedCharts.includes("rabiesHistory") && <RabiesHistoryCharts />}
          {selectedCharts.includes("offSringMonitoring") && (
            <OffSpringMonitoringChart />
          )}
          {selectedCharts.includes("UpgradingServices") && (
            <UpgradingServicesChart />
          )}
          {selectedCharts.includes("TechnicianQuarterly") && (
            <TechnicianQuarterlyCharts />
          )}
          
        </div>
      );
    }

    return (
      <div className={chartClasses}>
        <p className={chartTextClasses}>Please select charts to display.</p>
      </div>
    );
  };

  function renderForms() {
    const buttonClasses =
      "w-full   flex items-center bg-darkgreen text-white py-2 px-4 rounded-md shadow-sm hover:bg-darkergreen transition-colors";
    // hendre: sm:w-3/6 sm:h-40 sm:flex-col sm:flex-wrap
    switch (selectedDivision) {
      case "user":
        return (
          <>
            <h3 className="text-2xl font-semibold text-darkgreen mb-4">
              Browse Forms from Client Forms
            </h3>
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-medium text-gray-700 mb-2">
                  Request Services Forms
                </h4>
                <div className="space-y-2">
                  {/* Show all buttons if userRole is "admin" or "client" */}
                  {(userRole === "admin" || userRole === "user") && (
                    <>
                      <button
                        onClick={() => openModalWithContent("AnimalHealthCareServices")}
                        className={buttonClasses + " lg:block hidden text-left"}
                      >
                        <HealingIcon className="mr-2" /> Animal Health Care Services
                      </button>

                      <button
                        onClick={() => openModalWithContent("AnimalProductionServices")}
                        className={buttonClasses + " lg:block hidden text-left"}
                      >
                        <VaccinesIcon className="mr-2" /> Animal Production Services
                      </button>

                      <button
                        onClick={() => openModalWithContent("VeterinaryInformationServices")}
                        className={buttonClasses + " lg:block hidden text-left"}
                      >
                        <ReportIcon className="mr-2" /> Veterinary Information Services
                      </button>

                      <button
                        onClick={() => openModalWithContent("RegulatoryCareServices")}
                        className={buttonClasses + " lg:block hidden text-left"}
                      >
                        <LocalShippingIcon className="mr-2" /> Regulatory Services
                      </button>
                    </>
                  )}

                  {/* Show only Regulatory Services if userRole is "regulatory" */}
                  {userRole === "regulatory" && (
                    <button
                      onClick={() => openModalWithContent("RegulatoryCareServices")}
                      className={buttonClasses + " lg:block hidden text-left"}
                    >
                      <LocalShippingIcon className="mr-2" /> Regulatory Services
                    </button>
                  )}

                  {/* Show only Animal Production Services if userRole is "livestock" */}
                  {userRole === "livestock" && (
                    <button
                      onClick={() => openModalWithContent("AnimalProductionServices")}
                      className={buttonClasses + " lg:block hidden text-left"}
                    >
                      <VaccinesIcon className="mr-2" /> Animal Production Services
                    </button>
                  )}

                  {/* Show only Veterinary Information Services if userRole is "animalhealth" */}
                  {userRole === "animalhealth" && (
                    <button
                      onClick={() => openModalWithContent("VeterinaryInformationServices")}
                      className={buttonClasses + " lg:block hidden text-left"}
                    >
                      <ReportIcon className="mr-2" /> Veterinary Information Services
                    </button>
                  )}
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
                onClick={() => openModalWithContent("UserManagement")}
              >
                <ManageAccountsIcon className="mr-2" /> Manage Users
              </button>
              <button
                className={buttonClasses}
                onClick={() => openModalWithContent("AuditLogList")}
              >
                <Outbox className="mr-2" />AuditLog
              </button>
              <button
                className={buttonClasses}
                onClick={() => openModalWithContent("RequisitionSlip")}
              >
                <Outbox className="mr-2" /> Manage Requisition Forms
              </button>
              <button
                className={buttonClasses}
                onClick={() => openModalWithContent("Inventory")}
              >
                <Inventory className="mr-2" /> Inventory Equipment
              </button>
            </div>
          </>
        );

      case "animalhealth":
        return (
          <>
            <h3 className="text-2xl font-semibold text-darkgreen mb-4">
              Browse Forms from Animal Health
            </h3>
            <div className="space-y-6">
              <h4 className="text-lg font-medium text-gray-700 mb-2">
                Requisition Forms
              </h4>
              <div className="space-y-2">
                <button className={buttonClasses} onClick={() => openModalWithContent("RequisitionSlip")}>
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
                    onClick={() =>
                      openModalWithContent("DiseaseInvestigationForm")
                    }
                    className={buttonClasses}
                  >
                    <ReportIcon className="mr-2" /> Disease Investigation Form
                  </button>
                  {/* <button className={buttonClasses}>
                    <ReportIcon className="mr-2" /> Disease Surveillance and
                    Incident Report
                  </button> */}
                  <button
                    onClick={() => openModalWithContent("RabiesHistoryForm")}
                    className={buttonClasses}
                  >
                    <PetsIcon className="mr-2" /> Rabies History
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
                    onClick={() => openModalWithContent("AccomplishmentReport")}
                    className={buttonClasses + " lg:block hidden text-left"}
                  >
                    <AssignmentIcon className="mr-2" /> Generate Accomplishment
                    Report
                  </button>
                </div>
              </div>
            </div>
          </>
        );
      case "livestock":
        return (
          <>
            <h3 className="text-2xl font-semibold text-darkgreen mb-4">
              Browse Forms from Livestock
            </h3>
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-medium text-gray-700 mb-2">
                  Requisition Forms
                </h4>
                <div className="space-y-2">
                  <button className={buttonClasses} onClick={() => openModalWithContent("RequisitionSlip")}>
                    <ManageAccountsIcon className="mr-2" /> Requisition Form
                  </button>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-medium text-gray-700 mb-2">
                  Livestock Management
                </h4>
                <div className="space-y-2">
                  <button
                    onClick={() => openModalWithContent("UpgradingServices")}
                    className={buttonClasses}
                  >
                    <PetsIcon className="mr-2" /> Upgrading Service
                  </button>
                  <button
                    onClick={() => openModalWithContent("OffSpringMonitoring")}
                    className={buttonClasses}
                  >
                    <PetsIcon className="mr-2" /> Offspring Monitoring
                  </button>

                  <button
                    onClick={() => openModalWithContent("CalfDrop")}
                    className={buttonClasses}
                  >
                    <PetsIcon className="mr-2" /> Technician's Quarterly Calf
                    Drop Report
                  </button>

                  <button
                    onClick={() =>
                      openModalWithContent("AccomplishmentReportLivestock")
                    }
                    className={buttonClasses + " lg:block hidden text-left"}
                  >
                    <AssignmentIcon className="mr-2" /> Generate Monthly
                    Accomplishment Reports
                  </button>
                </div>
              </div>
            </div>
          </>
        );
      case "regulatory":
        return (
          <>
            <h3 className="text-2xl font-semibold text-darkgreen mb-4">
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
                  FORMS
                </h4>
                <div className="space-y-2">
                  <button
                    onClick={() => openModalWithContent("IncomingReportList")}
                    className={buttonClasses}
                  >
                    <ReportIcon className="mr-2" /> Incoming Report
                  </button>
                  <button
                    onClick={() => openModalWithContent("OutgoingReportList")}
                    className={buttonClasses}
                  >
                    <ReportIcon className="mr-2" /> Outgoing Report
                  </button>
                  <button
                    onClick={() => openModalWithContent("SlaughterReportList")}
                    className={buttonClasses}
                  >
                    <AssessmentIcon className="mr-2" /> Slaughter Report
                    (consolidated)
                  </button>
                  <button
                    onClick={() =>
                      openModalWithContent("VeterinaryShipmentList")
                    }
                    className={buttonClasses}
                  >
                    <LocalShippingIcon className="mr-2" /> Veterinary Shipment
                    Report
                  </button>
                </div>
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  }

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
      <div className="container max-w-full flex lg:flex-row md:flex-col sm:flex-col xs:flex-col 2xs:flex-col 3xs:flex-col bg-white min-h-screen relative overflow-hidden">
        {/* Navbar */}
        <Navbar
          onDivisionChange={handleDivisionChange}
          selectedDivision={selectedDivision}
        />
        {/* Add relative positioning */}
        <div className="container flex flex-col lg:justify-center max-w-full lg:flex-row p-4 overflow-y-hide max-h-[100vh]">
          {/* Main Content Wrapper */}
          <div className="flex flex-col-reverse lg:flex-row w-full">
            {useMediaQuery("(min-width:1024px)") && !(userRole === "user") && (
              <>
                {" "}
                {/* Left Side - Charts */}
                <div className="flex-1 space-y-6 lg:space-y-8 p-4 lg:p-8">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-4 text-left">
                    Select Charts to Display
                  </h3>

                  {/* Chart Selection Dropdown */}
                  <div className="grid grid-cols-5 gap-5">
                    <div className="w-full col-span-4 z-10">
                      {" "}
                      {/* Increase z-index for dropdown */}
                      <Select
                        isMulti
                        options={getChartOptions()}
                        onChange={handleChartSelect}
                        styles={customSelectStyles}
                        placeholder="Select charts..."
                        className="text-sm sm:text-base z-0"
                      />
                    </div>
                    <button
                      className="w-full flex items-center col-span-1 text-center bg-darkgreen text-white py-2 px-4 rounded-md shadow-sm hover:bg-darkergreen transition-colors"
                      onClick={() => { toggleFilter(); toggleShowAll(); }}
                    >
                      Apply Filters
                    </button>
                    {openFilters && (
                      <div className="col-span-5 flex flex-row lg:flex-row md:flex-col sm:flex-col xs:flex-col 2xs:flex-col 3xs:flex-col gap-x-3">
                        <label className="mb-2 text-lg ">
                          <div className="font-bold">Start Date:</div>
                          <input
                            className="border"
                            type="date"
                            name="startDate"
                            onChange={handleDateChange}
                            disabled={showAll}
                          />
                        </label>
                        <label className="mb-2 text-lg">
                          <div className="font-bold">End Date:</div>

                          <input
                            className="border"
                            type="date"
                            name="endDate"
                            onChange={handleDateChange}
                            disabled={showAll}
                          />
                        </label>
                        <label className="mb-2 text-lg">
                          <div className="font-bold">Municipality:</div>
                          <input
                            className="border"
                            type="text"
                            value={filters.municipality}
                            onChange={handleMunicipalityChange}
                            disabled={showAll}
                          />
                        </label>
                      </div>
                    )}
                  </div>
                  <FilterContext.Provider value={{ filters, showAll }}>
                    {/* Conditional Rendering for Charts */}
                    <div className="w-full h-[70vh] overflow-auto">
                      {renderCharts()}
                    </div>
                  </FilterContext.Provider>
                </div>
              </>
            )}

            {/* Right Side - Forms */}
            <div className="w-full lg:w-1/3 space-y-6 lg:space-y-8 lg:ml-8 lg:mt-8 lg:mb-5 lg:h-screen">
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