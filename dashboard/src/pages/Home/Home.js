// React and core libraries
import React, { useState, useEffect, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";

// Layout components
import Navbar from "../../component/Navbar";
import Modal from "../../component/Modal";
import Select from "react-select";
import { jwtDecode } from "jwt-decode";
import FilterComponent from "../../component/FilterComponent";

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
import VeterinaryShipmentChart from "../../component/VeterinaryShipmentChart";
import SlaughterReportChart from "../../component/SlaughterReportChart";
import InventoryChart from "../../component/InventoryChart";
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
import AnimalHealthCareServicesList from "../Client Request Forms/AnimalHealthCareServicesList";
import AnimalProductionServicesList from "../Client Request Forms/AnimalProductionServicesList";
import VeterinaryInformationServiceList from "../Client Request Forms/VeterinaryInformationServiceList";
import RegulatoryCareServicesList from "../Client Request Forms/RegulatoryCareServicesList";
import UpgradingServicesList from "../UpgradingServicesList";
import RequisitionIssueSlipList from "../RequisitionIssueSlipList";
import BackupRestore from "../../component/BackupRestore ";
import SlaughterReportForm from "../Regulatory and Monitoring Division/SlaughterReportForm";
import VeterinaryShipmentForm from "../Regulatory and Monitoring Division/VeterinaryShipmentForm";
import OfflinePage from "../../component/OfflinePage";

// Icon components (Material-UI)
import ChevronRight from "@mui/icons-material/ChevronRight";
import Agriculture from "@mui/icons-material/Agriculture";
import Person from "@mui/icons-material/Person";
import SaveIcon from "@mui/icons-material/Save";
import Pets from "@mui/icons-material/Pets";
import { Gavel } from "@mui/icons-material";
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
import FormListComponent from "../../component/FormListComponent";
import DiseaseInvestigationFormLists from "../Livestock and Poultry DRRM/DiseaseInvestigationFormLists";
import RabiesHistoryFormLists from "../RABIES/RabiesHistoryFormLists";
import TechnicianQuarterlyReportList from "../../component/TechnicianQuarterlyReportList";
import AboutUs from "../AboutUs";

import { FilterAltOutlined, FilterAltOff } from '@mui/icons-material';


export const FilterContext = createContext(null);

function Home({ handleLogout, setIsAuthenticated, isOffline }) {
  const [municipalities, setMunicipalities] = useState([
    "Ambaguio",
    "Bagabag",
    "Bayombong",
    "Diadi",
    "Quezon",
    "Solano",
    "Villaverde",
    "Alfonso Castañeda",
    "Aritao",
    "Bambang",
    "Dupax del Norte",
    "Dupax del Sur",
    "Kayapa",
    "Kasibu",
    "Santa Fe",
  ]);
  const [filterValues, setFilterValues] = useState({
    municipality: "",
    startDate: "",
    endDate: "",
  });
  const [appliedFilters, setAppliedFilters] = useState(filterValues);
  const [chartKey, setChartKey] = useState(0); // Add this state for forcing re-renders
  const handleFilter = (values) => {
    setAppliedFilters(values);
    setChartKey((prev) => prev + 1); // Increment the key to force re-render
    console.log(appliedFilters);
  };

  const [backupDir, setBackupDir] = useState("");
  const [showFilter, setShowFilter] = useState(false);
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

  function toggleFilterShow() {
    setShowFilter(!showFilter);
  }
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

  // function name(params) {

  // }
  const renderModalContent = () => {
    // switch (modalContent) {
    //   case "RabiesVaccinationReport":
    //     return (
    //       <>
    //         {userRole === "admin" ?
    //           <RabiesVaccinationReport/>
    //         :
    //           <FormListComponent
    //             endpoint="/api/entries"
    //             title="Rabies Vaccination Report List"
    //             FormComponent={RabiesVaccinationReport}
    //           />
    //         }
    //       </>
    //     );
    // Divide
    switch (modalContent) {



      case "OfflinePage":
        return <OfflinePage />;
      case "VeterinaryShipmentForm":
        return <VeterinaryShipmentForm />;
      case "SlaughterReportForm":
        return <SlaughterReportForm />;
      case "BackupRestore":
        return <BackupRestore />;
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
      case "AnimalHealthCareServicesList":
        return <AnimalHealthCareServicesList />;
      case "AnimalProductionServicesList":
        return <AnimalProductionServicesList />;
      case "VeterinaryInformationServiceList":
        return <VeterinaryInformationServiceList />;
      case "RegulatoryCareServicesList":
        return <RegulatoryCareServicesList />;
      case "RequisitionIssueSlipList":
        return <RequisitionIssueSlipList />;
      // case "UpgradingServicesList":
      //   return <UpgradingServicesList />;
      case "RabiesVaccinationReportList":
        return (
          <FormListComponent
            endpoint="/api/entries"
            title="Rabies Vaccination Report List"
            FormComponent={RabiesVaccinationReport}
          />
        );
      case "VaccinationReportList":
        return (
          <FormListComponent
            endpoint="/api/reports"
            title="Vaccination Report List"
            FormComponent={VaccinationReport}
          />
        );
      case "RoutineServicesReportList":
        return (
          <FormListComponent
            endpoint="/RSM"
            title="Routine Services List"
            FormComponent={RoutineServicesMonitoringReport}
          />
        );
      case "UpgradingServicesList":
        return (
          <FormListComponent
            endpoint="/api/upgrading-services"
            title="Upgrading Services List"
            FormComponent={UpgradingServices}
          />
        );
      case "OffSpringMonitoringList":
        return (
          <FormListComponent
            endpoint="/api/offspring-monitoring"
            title="Offspring Monitoring List"
            FormComponent={OffspringMonitoring}
          />
        );
      case "TechnicianQuarterlyList":
        return <TechnicianQuarterlyReportList />;
      case "DiseaseInvestigationFormLists":
        return <DiseaseInvestigationFormLists />;
      case "RabiesHistoryFormLists":
        return <RabiesHistoryFormLists />;

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
        console.log(role); // Adjust this key based on your token's structure
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
    { value: "rabies", label: "Rabies Vaccination Chart" },
    { value: "disease", label: "Disease Investigation Overview" },
    { value: "vaccination", label: "General Vaccination Report" },
    { value: "routine", label: "Routine Services Monitoring Report" },
    { value: "rabiesHistory", label: "Rabies History Overview" },
    { value: "offSpringMonitoring", label: "Offspring Monitoring Report" },
    { value: "upgradingServices", label: "Upgrading Services Overview" },
    { value: "technicianQuarterly", label: "Technician Quarterly Calf Drop Analysis" },
    { value: "slaughterReport", label: "Slaughter Report Overview" },
    { value: "veterinaryShipment", label: "Veterinary Shipment Overview" },
    { value: "inventory", label: "PVSO Inventory Chart" },
  ];

  // Function to get chart options based on user role
  const getChartOptions = () => {
    switch (userRole) {
      case "admin":
        return allChartOptions;
      case "animalhealth":
        return allChartOptions.filter(option =>
          ["rabies", "vaccination", "disease", "rabiesHistory", "routine"].includes(option.value)
        );
      case "livestock":
        return allChartOptions.filter(option =>
          ["upgradingServices", "offSpringMonitoring", "technicianQuarterly"].includes(option.value)
        );
      case "regulatory":
        return allChartOptions.filter(option =>
          ["slaughterReport", "veterinaryShipment"].includes(option.value)
        );
      default:
        return [];
    }
  };

  // Rendering the charts based on selected options
  const renderCharts = () => {
    if (isOffline) {
      return (
        <div className="md:h-2/5 bg-white shadow-md rounded-lg p-6 flex flex-wrap items-center justify-center text-center">
          <p className="text-red-500 font-semibold text-lg">
            You are offline. Charts cannot be displayed.
          </p>
        </div>
      );
    }

    if (selectedCharts.length > 0) {
      return (
        <div className="space-y-6">
          {selectedCharts.includes("slaughterReport") && (
            <SlaughterReportChart
              key={`slaughter-${chartKey}`}
              filterValues={appliedFilters}
            />
          )}
          {selectedCharts.includes("veterinaryShipment") && (
            <VeterinaryShipmentChart
              key={`shipment-${chartKey}`}
              filterValues={appliedFilters}
            />
          )}
          {selectedCharts.includes("rabies") && (
            <RabiesReportChart
              key={`rabies-${chartKey}`}
              filterValues={appliedFilters}
            />
          )}
          {selectedCharts.includes("disease") && (
            <DiseaseInvestigationChart
              key={`disease-${chartKey}`}
              filterValues={appliedFilters}
            />
          )}
          {selectedCharts.includes("vaccination") && (
            <VaccinationReportChart
              key={`vaccination-${chartKey}`}
              filterValues={appliedFilters}
            />
          )}
          {selectedCharts.includes("routine") && (
            <RoutineServicesMonitoringReportChart
              key={`routine-${chartKey}`}
              filterValues={appliedFilters}
            />
          )}
          {selectedCharts.includes("rabiesHistory") && (
            <RabiesHistoryCharts
              key={`history-${chartKey}`}
              filterValues={appliedFilters}
            />
          )}
          {selectedCharts.includes("offSpringMonitoring") && (
            <OffSpringMonitoringChart
              key={`offspring-${chartKey}`}
              filterValues={appliedFilters}
            />
          )}
          {selectedCharts.includes("upgradingServices") && (
            <UpgradingServicesChart
              key={`upgrading-${chartKey}`}
              filterValues={appliedFilters}
            />
          )}
          {selectedCharts.includes("technicianQuarterly") && (
            <TechnicianQuarterlyCharts
              key={`quarterly-${chartKey}`}
              filterValues={appliedFilters}
            />
          )}
          {selectedCharts.includes("inventory") && (
            <InventoryChart
              key={`inventory-${chartKey}`}
              filterValues={appliedFilters}
            />
          )}

        </div>
      );
    }

    return (
      <div className="md:h-2/5 bg-white shadow-md rounded-lg p-6 flex flex-wrap items-center justify-center text-center">
        <p className="text-gray-700 font-semibold text-lg">
          Please select charts to display.
        </p>
      </div>
    );
  };


  function renderForms() {
    const buttonBaseClasses = "group relative w-full flex items-center justify-between bg-gradient-to-r from-darkgreen to-emerald-700 text-white py-3 px-5 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 ease-in-out";
    const iconClasses = "flex items-center justify-center p-2 rounded-full bg-white/20 group-hover:bg-white/30 transition-all duration-200";
    const textClasses = "flex-grow font-medium text-left ml-3 group-hover:ml-4 transition-all duration-200";

    switch (selectedDivision) {
      case "user":
        return (
          <div className="bg-white rounded-xl shadow-sm p-6 backdrop-blur-sm">
            <h3 className="text-xl font-bold text-gray-800 mb-5 flex items-center">
              <span className="bg-darkgreen text-white p-1.5 rounded-md mr-3">
                <Person />
              </span>
              Client Forms
            </h3>

            <div className="space-y-6">
              <div>
                <h4 className="flex items-center text-lg font-semibold text-gray-700 mb-3 pb-2 border-b">
                  <span className="text-darkgreen mr-2">
                    <AssignmentIcon fontSize="small" />
                  </span>
                  Request Services
                </h4>

                <div className="grid gap-3">
                  {/* Show all buttons if userRole is "admin" or "client" */}
                  {(userRole === "admin" || userRole === "user" || userRole === "extensionworker") && (
                    <>
                      <button
                        onClick={() =>
                          openModalWithContent(
                            isOffline
                              ? "AnimalHealthCareServices"
                              : userRole === "admin"
                                ? "AnimalHealthCareServicesList"
                                : "AnimalHealthCareServices"
                          )
                        }
                        className={buttonBaseClasses}
                      >
                        <div className={iconClasses}>
                          <HealingIcon />
                        </div>
                        <span className={textClasses}>Animal Health Care Services</span>
                        <ChevronRight className="text-white/70 group-hover:text-white transition-colors" />
                      </button>

                      <button
                        onClick={() =>
                          openModalWithContent(
                            isOffline
                              ? "AnimalProductionServices"
                              : userRole === "admin"
                                ? "AnimalProductionServicesList"
                                : "AnimalProductionServices"
                          )
                        }
                        className={buttonBaseClasses}
                      >
                        <div className={iconClasses}>
                          <VaccinesIcon />
                        </div>
                        <span className={textClasses}>Animal Production Services</span>
                        <ChevronRight className="text-white/70 group-hover:text-white transition-colors" />
                      </button>

                      <button
                        onClick={() =>
                          openModalWithContent(
                            isOffline
                              ? "VeterinaryInformationServices"
                              : userRole === "admin"
                                ? "VeterinaryInformationServiceList"
                                : "VeterinaryInformationServices"
                          )
                        }
                        className={buttonBaseClasses}
                      >
                        <div className={iconClasses}>
                          <ReportIcon />
                        </div>
                        <span className={textClasses}>Veterinary Information Services</span>
                        <ChevronRight className="text-white/70 group-hover:text-white transition-colors" />
                      </button>

                      <button
                        onClick={() =>
                          openModalWithContent(
                            isOffline
                              ? "OfflinePage"
                              : userRole === "admin"
                                ? "RegulatoryCareServicesList"
                                : "RegulatoryCareServices"
                          )
                        }
                        className={buttonBaseClasses}
                      >
                        <div className={iconClasses}>
                          <LocalShippingIcon />
                        </div>
                        <span className={textClasses}>Regulatory Services</span>
                        <ChevronRight className="text-white/70 group-hover:text-white transition-colors" />
                      </button>
                    </>
                  )}

                  {/* Show only Regulatory Services if userRole is "regulatory" */}
                  {userRole === "regulatory" && (
                    <button
                      onClick={() =>
                        openModalWithContent(
                          isOffline ? "OfflinePage" : "RegulatoryCareServicesList"
                        )
                      }
                      className={buttonBaseClasses}
                    >
                      <div className={iconClasses}>
                        <LocalShippingIcon />
                      </div>
                      <span className={textClasses}>Regulatory Services</span>
                      <ChevronRight className="text-white/70 group-hover:text-white transition-colors" />
                    </button>
                  )}

                  {/* Show only Animal Production Services if userRole is "livestock" */}
                  {userRole === "livestock" && (
                    <button
                      onClick={() =>
                        openModalWithContent(
                          isOffline ? "AnimalProductionServices" : "AnimalProductionServicesList"
                        )
                      }
                      className={buttonBaseClasses}
                    >
                      <div className={iconClasses}>
                        <VaccinesIcon />
                      </div>
                      <span className={textClasses}>Animal Production Services</span>
                      <ChevronRight className="text-white/70 group-hover:text-white transition-colors" />
                    </button>
                  )}

                  {/* Show only Veterinary Information Services if userRole is "animalhealth" */}
                  {userRole === "animalhealth" && (
                    <button
                      onClick={() =>
                        openModalWithContent(
                          isOffline
                            ? "AnimalHealthCareServices"
                            : "AnimalHealthCareServicesList"
                        )
                      }
                      className={buttonBaseClasses}
                    >
                      <div className={iconClasses}>
                        <HealingIcon />
                      </div>
                      <span className={textClasses}>Animal Health Care Services</span>
                      <ChevronRight className="text-white/70 group-hover:text-white transition-colors" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case "admin":
        return (
          <div className="bg-white rounded-xl shadow-sm p-6 backdrop-blur-sm">
            <h3 className="text-xl font-bold text-gray-800 mb-5 flex items-center">
              <span className="bg-darkgreen text-white p-1.5 rounded-md mr-3">
                <ManageAccountsIcon />
              </span>
              Admin Actions
            </h3>

            <div className="grid gap-3">
              <button
                className={buttonBaseClasses}
                onClick={() =>
                  openModalWithContent(
                    isOffline ? "OfflinePage" : "BackupRestore"
                  )}
              >
                <div className={iconClasses}>
                  <SaveIcon />
                </div>
                <span className={textClasses}>Backup and Restore</span>
                <ChevronRight className="text-white/70 group-hover:text-white transition-colors" />
              </button>

              <button
                className={buttonBaseClasses}
                onClick={() =>
                  openModalWithContent(
                    isOffline ? "OfflinePage" : "UserManagement"
                  )}
              >
                <div className={iconClasses}>
                  <ManageAccountsIcon />
                </div>
                <span className={textClasses}>Manage Users</span>
                <ChevronRight className="text-white/70 group-hover:text-white transition-colors" />
              </button>

              <button
                className={buttonBaseClasses}
                onClick={() =>
                  openModalWithContent(
                    isOffline ? "OfflinePage" : "AuditLogList"
                  )}
              >
                <div className={iconClasses}>
                  <Outbox />
                </div>
                <span className={textClasses}>AuditLog</span>
                <ChevronRight className="text-white/70 group-hover:text-white transition-colors" />
              </button>

              <button
                className={buttonBaseClasses}
                onClick={() => openModalWithContent(
                  isOffline ? "OfflinePage" : "RequisitionIssueSlipList"
                )}
              >
                <div className={iconClasses}>
                  <Outbox />
                </div>
                <span className={textClasses}>Manage Requisition Forms</span>
                <ChevronRight className="text-white/70 group-hover:text-white transition-colors" />
              </button>

              <button
                className={buttonBaseClasses}
                onClick={() =>
                  openModalWithContent(
                    isOffline ? "OfflinePage" : "Inventory"
                  )}
              >
                <div className={iconClasses}>
                  <Inventory />
                </div>
                <span className={textClasses}>Inventory Equipment</span>
                <ChevronRight className="text-white/70 group-hover:text-white transition-colors" />
              </button>
            </div>
          </div>
        );

      case "animalhealth":
        return (
          <div className="bg-white rounded-xl shadow-sm p-6 backdrop-blur-sm">
            <h3 className="text-xl font-bold text-gray-800 mb-5 flex items-center">
              <span className="bg-darkgreen text-white p-1.5 rounded-md mr-3">
                <Pets />
              </span>
              Animal Health Forms
            </h3>

            <div className="space-y-6">
              {userRole !== "admin" && userRole !== "extensionworker" && (
                <div>
                  <h4 className="flex items-center text-lg font-semibold text-gray-700 mb-3 pb-2 border-b">
                    <span className="bg-darkgreen mr-2">
                      <Outbox fontSize="small" />
                    </span>
                    Requisition Forms
                  </h4>
                  <div className="grid gap-3">
                    <button
                      className={buttonBaseClasses}
                      onClick={() =>
                        openModalWithContent(
                          isOffline ? "OfflinePage" : "RequisitionIssueSlipList"
                        )
                      }
                    >
                      <div className={iconClasses}>
                        <Outbox />
                      </div>
                      <span className={textClasses}>Requisition Form</span>
                      <ChevronRight className="text-white/70 group-hover:text-white transition-colors" />
                    </button>
                  </div>
                </div>
              )}

              <div>
                <h4 className="flex items-center text-lg font-semibold text-gray-700 mb-3 pb-2 border-b">
                  <span className="text-darkgreen mr-2">
                    <VaccinesIcon fontSize="small" />
                  </span>
                  Vaccination Forms
                </h4>
                <div className="grid gap-3">
                  <button
                    onClick={() =>
                      openModalWithContent(
                        isOffline
                          ? "RabiesVaccinationReport"
                          : userRole === "extensionworker"
                            ? "RabiesVaccinationReport"
                            : "RabiesVaccinationReportList"
                      )
                    }
                    className={buttonBaseClasses}
                  >
                    <div className={iconClasses}>
                      <ReportIcon />
                    </div>
                    <span className={textClasses}>Rabies Vaccination</span>
                    <ChevronRight className="text-white/70 group-hover:text-white transition-colors" />
                  </button>

                  <button
                    onClick={() =>
                      openModalWithContent(
                        isOffline
                          ? "VaccinationReport"
                          : userRole === "extensionworker"
                            ? "VaccinationReport"
                            : "VaccinationReportList"
                      )
                    }
                    className={buttonBaseClasses}
                  >
                    <div className={iconClasses}>
                      <ReportIcon />
                    </div>
                    <span className={textClasses}>Vaccination Report</span>
                    <ChevronRight className="text-white/70 group-hover:text-white transition-colors" />
                  </button>
                </div>
              </div>

              <div>
                <h4 className="flex items-center text-lg font-semibold text-gray-700 mb-3 pb-2 border-b">
                  <span className="text-darkgreen mr-2">
                    <AssignmentIcon fontSize="small" />
                  </span>
                  Reports
                </h4>
                <div className="grid gap-3">
                  <button
                    onClick={() =>
                      openModalWithContent(
                        isOffline
                          ? "DiseaseInvestigationForm"
                          : userRole === "extensionworker"
                            ? "DiseaseInvestigationForm"
                            : "DiseaseInvestigationFormLists"
                      )
                    }
                    className={buttonBaseClasses}
                  >
                    <div className={iconClasses}>
                      <ReportIcon />
                    </div>
                    <span className={textClasses}>Disease Investigation Form</span>
                    <ChevronRight className="text-white/70 group-hover:text-white transition-colors" />
                  </button>

                  <button
                    onClick={() =>
                      openModalWithContent(
                        isOffline
                          ? "RabiesHistoryForm"
                          : userRole === "extensionworker"
                            ? "RabiesHistoryForm"
                            : "RabiesHistoryFormLists"
                      )
                    }
                    className={buttonBaseClasses}
                  >
                    <div className={iconClasses}>
                      <PetsIcon />
                    </div>
                    <span className={textClasses}>Rabies History</span>
                    <ChevronRight className="text-white/70 group-hover:text-white transition-colors" />
                  </button>

                  <button
                    onClick={() =>
                      openModalWithContent(
                        isOffline
                          ? "RoutineServicesMonitoringReport"
                          : userRole === "extensionworker"
                            ? "RoutineServicesMonitoringReport"
                            : "RoutineServicesReportList"
                      )
                    }
                    className={buttonBaseClasses}
                  >
                    <div className={iconClasses}>
                      <AssignmentIcon />
                    </div>
                    <span className={textClasses}>Routine Service Monitoring</span>
                    <ChevronRight className="text-white/70 group-hover:text-white transition-colors" />
                  </button>

                  {userRole !== "extensionworker" && (
                    <button
                      onClick={() =>
                        openModalWithContent(
                          isOffline ? "OfflinePage" : "AccomplishmentReport"
                        )
                      }
                      className={buttonBaseClasses + " lg:block hidden"}
                    >
                      <div className={iconClasses}>
                        <AssignmentIcon />
                      </div>
                      <span className={textClasses}>Generate Accomplishment Report</span>
                      <ChevronRight className="text-white/70 group-hover:text-white transition-colors" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case "livestock":
        return (
          <div className="bg-white rounded-xl shadow-sm p-6 backdrop-blur-sm">
            <h3 className="text-xl font-bold text-gray-800 mb-5 flex items-center">
              <span className="bg-darkgreen text-white p-1.5 rounded-md mr-3">
                <Agriculture />
              </span>
              Livestock Forms
            </h3>

            <div className="space-y-6">
              {userRole !== "admin" && userRole !== "extensionworker" && (
                <div>
                  <h4 className="flex items-center text-lg font-semibold text-gray-700 mb-3 pb-2 border-b">
                    <span className="text-gray-800 mr-2">
                      <ManageAccountsIcon fontSize="small" />
                    </span>
                    Requisition Forms
                  </h4>
                  <div className="grid gap-3">
                    <button
                      className={buttonBaseClasses}
                      onClick={() =>
                        openModalWithContent(
                          isOffline ? "OfflinePage" : "RequisitionIssueSlipList"
                        )
                      }
                    >
                      <div className={iconClasses}>
                        <ManageAccountsIcon />
                      </div>
                      <span className={textClasses}>Requisition Form</span>
                      <ChevronRight className="text-white/70 group-hover:text-white transition-colors" />
                    </button>
                  </div>
                </div>
              )}

              <div>
                <h4 className="flex items-center text-lg font-semibold text-gray-800 mb-3 pb-2 border-b">
                  <span className="text-darkgreen mr-2">
                    <PetsIcon fontSize="small" />
                  </span>
                  Livestock Management
                </h4>
                <div className="grid gap-3">
                  <button
                    onClick={() =>
                      openModalWithContent(
                        isOffline
                          ? "UpgradingServices"
                          : userRole === "extensionworker"
                            ? "UpgradingServices"
                            : "UpgradingServicesList"
                      )
                    }
                    className={buttonBaseClasses}
                  >
                    <div className={iconClasses}>
                      <PetsIcon />
                    </div>
                    <span className={textClasses}>Upgrading Service</span>
                    <ChevronRight className="text-white/70 group-hover:text-white transition-colors" />
                  </button>

                  <button
                    onClick={() =>
                      openModalWithContent(
                        isOffline
                          ? "OffSpringMonitoring"
                          : userRole === "extensionworker"
                            ? "OffSpringMonitoring"
                            : "OffSpringMonitoringList"
                      )
                    }
                    className={buttonBaseClasses}
                  >
                    <div className={iconClasses}>
                      <PetsIcon />
                    </div>
                    <span className={textClasses}>Offspring Monitoring</span>
                    <ChevronRight className="text-white/70 group-hover:text-white transition-colors" />
                  </button>

                  <button
                    onClick={() =>
                      openModalWithContent(
                        isOffline
                          ? "CalfDrop"
                          : userRole === "extensionworker"
                            ? "CalfDrop"
                            : "TechnicianQuarterlyList"
                      )
                    }
                    className={buttonBaseClasses}
                  >
                    <div className={iconClasses}>
                      <PetsIcon />
                    </div>
                    <span className={textClasses}>Quarterly Calf Drop Report</span>
                    <ChevronRight className="text-white/70 group-hover:text-white transition-colors" />
                  </button>

                  {/* Conditional rendering for the Accomplishment Report button */}
                  {userRole !== "extensionworker" && (
                    <button
                      onClick={() =>
                        openModalWithContent(
                          isOffline ? "OfflinePage" : "AccomplishmentReportLivestock"
                        )
                      }
                      className={buttonBaseClasses + " lg:block hidden"}
                    >
                      <div className={iconClasses}>
                        <AssignmentIcon />
                      </div>
                      <span className={textClasses}>Generate Monthly Accomplishment</span>
                      <ChevronRight className="text-white/70 group-hover:text-white transition-colors" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case "regulatory":
        return (
          <div className="bg-white rounded-xl shadow-sm p-6 backdrop-blur-sm">
            <h3 className="text-xl font-bold text-gray-800 mb-5 flex items-center">
              <span className="bg-darkgreen text-white p-1.5 rounded-md mr-3">
                <Gavel />
              </span>
              Regulatory Forms
            </h3>

            <div className="space-y-6">
              {userRole !== "admin" && (
                <div>
                  <h4 className="flex items-center text-lg font-semibold text-gray-700 mb-3 pb-2 border-b">
                    <span className="text-darkgreen mr-2">
                      <ManageAccountsIcon fontSize="small" />
                    </span>
                    Requisition Forms
                  </h4>
                  <div className="grid gap-3">
                    <button
                      className={buttonBaseClasses}
                      onClick={() => openModalWithContent(
                        isOffline ? "OfflinePage" : "RequisitionIssueSlipList"
                      )}
                    >
                      <div className={iconClasses}>
                        <ManageAccountsIcon />
                      </div>
                      <span className={textClasses}>Requisition Form</span>
                      <ChevronRight className="text-white/70 group-hover:text-white transition-colors" />
                    </button>
                  </div>
                </div>
              )}

              <div>
                <h4 className="flex items-center text-lg font-semibold text-gray-700 mb-3 pb-2 border-b">
                  <span className="text-darkgreen mr-2">
                    <AssignmentIcon fontSize="small" />
                  </span>
                  Annual Reports
                </h4>
                <div className="grid gap-3">
                  <button
                    onClick={() =>
                      openModalWithContent(
                        isOffline ? "OfflinePage" : "IncomingReportList"
                      )
                    }
                    className={buttonBaseClasses}
                  >
                    <div className={iconClasses}>
                      <ReportIcon />
                    </div>
                    <span className={textClasses}>Incoming Report</span>
                    <ChevronRight className="text-white/70 group-hover:text-white transition-colors" />
                  </button>

                  <button
                    onClick={() =>
                      openModalWithContent(
                        isOffline ? "OfflinePage" : "OutgoingReportList"
                      )
                    }
                    className={buttonBaseClasses}
                  >
                    <div className={iconClasses}>
                      <ReportIcon />
                    </div>
                    <span className={textClasses}>Outgoing Report</span>
                    <ChevronRight className="text-white/70 group-hover:text-white transition-colors" />
                  </button>
                </div>
              </div>

              <div>
                <h4 className="flex items-center text-lg font-semibold text-gray-700 mb-3 pb-2 border-b">
                  <span className="text-darkgreen mr-2">
                    <AssessmentIcon fontSize="small" />
                  </span>
                  List Reports
                </h4>
                <div className="grid gap-3">
                  <button
                    onClick={() =>
                      openModalWithContent(
                        isOffline ? "SlaughterReportForm" : "SlaughterReportList"
                      )
                    }
                    className={buttonBaseClasses}
                  >
                    <div className={iconClasses}>
                      <AssessmentIcon />
                    </div>
                    <span className={textClasses}>Slaughter Report (consolidated)</span>
                    <ChevronRight className="text-white/70 group-hover:text-white transition-colors" />
                  </button>

                  <button
                    onClick={() => openModalWithContent(
                      isOffline ? "VeterinaryShipmentForm" : "VeterinaryShipmentList"
                    )}
                    className={buttonBaseClasses}
                  >
                    <div className={iconClasses}>
                      <LocalShippingIcon />
                    </div>
                    <span className={textClasses}>Veterinary Shipment Report</span>
                    <ChevronRight className="text-white/70 group-hover:text-white transition-colors" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  }

  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: "#ffffff",
      borderColor: state.isFocused ? "#1b5b40" : "#e2e8f0",
      borderWidth: "1px",
      borderRadius: "0.75rem",
      padding: "0.35rem 0.5rem",
      boxShadow: state.isFocused
        ? "0 0 0 2px rgba(27, 91, 64, 0.2)"
        : "0 1px 3px rgba(0, 0, 0, 0.05)",
      fontSize: "0.925rem",
      transition: "all 0.2s ease",
      zIndex: 1,
      "&:hover": {
        borderColor: "#1b5b40",
      },
    }),

    multiValue: (provided) => ({
      ...provided,
      backgroundColor: "rgba(27, 91, 64, 0.08)",
      borderRadius: "0.5rem",
      margin: "0.15rem",
      overflow: "hidden",
      border: "1px solid rgba(27, 91, 64, 0.15)",
      boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
      transition: "all 0.15s ease",
    }),

    multiValueLabel: (provided) => ({
      ...provided,
      color: "#1b5b40",
      fontWeight: 500,
      fontSize: "0.875rem",
      padding: "0.15rem 0.2rem 0.15rem 0.5rem",
    }),

    multiValueRemove: (provided) => ({
      ...provided,
      color: "#1b5b40",
      borderRadius: "0 0.375rem 0.375rem 0",
      padding: "0 0.5rem",
      transition: "all 0.2s ease",
      "&:hover": {
        backgroundColor: "#f87171",
        color: "white",
      },
    }),

    placeholder: (provided) => ({
      ...provided,
      color: "#94a3b8",
      fontSize: "0.925rem",
    }),

    input: (provided) => ({
      ...provided,
      color: "#334155",
      fontSize: "0.925rem",
    }),

    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#1b5b40"
        : state.isFocused
          ? "rgba(27, 91, 64, 0.08)"
          : "#ffffff",
      color: state.isSelected ? "#ffffff" : "#334155",
      fontSize: "0.925rem",
      padding: "0.65rem 1rem",
      cursor: "pointer",
      transition: "background-color 0.15s ease",
      "&:active": {
        backgroundColor: "#1b5b40",
      },
    }),

    menu: (provided) => ({
      ...provided,
      backgroundColor: "#ffffff",
      borderRadius: "0.75rem",
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      overflow: "hidden",
      border: "none",
      padding: "0.5rem 0",
      marginTop: "0.5rem",
    }),

    menuList: (provided) => ({
      ...provided,
      padding: "0.25rem",
    }),

    indicatorSeparator: (provided) => ({
      ...provided,
      backgroundColor: "rgba(226, 232, 240, 0.8)",
    }),

    dropdownIndicator: (provided, state) => ({
      ...provided,
      color: state.isFocused ? "#1b5b40" : "#94a3b8",
      transition: "all 0.2s ease",
      transform: state.selectProps.menuIsOpen ? "rotate(180deg)" : null,
      "&:hover": {
        color: "#1b5b40",
      },
    }),

    clearIndicator: (provided) => ({
      ...provided,
      color: "#94a3b8",
      "&:hover": {
        color: "#ef4444",
      },
    }),

    valueContainer: (provided) => ({
      ...provided,
      padding: "0.15rem 0.5rem",
    }),
  };

  return (
    <>
      <div className="container max-w-full flex lg:flex-row md:flex-col sm:flex-col xs:flex-col 2xs:flex-col 3xs:flex-col bg-white lg:min-h-screen relative lg:overflow-hidden overflow-auto">
        {/* Navbar */}
        <Navbar
          onDivisionChange={handleDivisionChange}
          selectedDivision={selectedDivision}
          handleLogout={handleLogout}
        />
        {/* Add relative positioning */}
        <div className="container flex flex-col lg:justify-center max-w-full lg:flex-row p-4 overflow-y-hide max-h-[100vh]">
          {/* Main Content Wrapper */}
          <div className="flex flex-col-reverse lg:flex-row w-full">
            {useMediaQuery("(min-width:1024px)") && !(userRole === "user") && !(userRole === "extensionworker") && (
              <>
                {" "}
                {/* Left Side - Charts */}
                <div className="flex-1 space-y-6 lg:space-y-8 p-4 lg:p-8">
                  <h3 className="text-lg sm:text-xl font-semibold text-black mb-2 sm:mb-4 text-left">
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
                        isDisabled={isOffline} // Disable if offline
                      />

                    </div>
                    <div>
                      {!isOffline && (
                        <button
                          onClick={() => toggleFilterShow()}
                          className="bg-darkgreen hover:bg-emerald-700 text-white p-2.5 rounded-full shadow-sm transition-all duration-300 flex items-center justify-center"
                          aria-label={showAll ? "Show filters" : "Hide filters"}
                          title={showAll ? "Show filters" : "Hide filters"}
                        >
                          {showAll ? (
                            <FilterAltOutlined fontSize="small" />
                          ) : (
                            <FilterAltOff fontSize="small" />
                          )}
                        </button>
                      )}

                    </div>
                  </div>

                  <FilterContext.Provider value={{ filters, showAll }}>
                    {/* Conditional Rendering for Charts */}
                    {showFilter && (
                      <FilterComponent
                        municipalities={municipalities}
                        onFilter={handleFilter}
                      />
                    )}

                    <div className="w-full h-[90vh] overflow-auto">
                      {renderCharts()}
                    </div>
                  </FilterContext.Provider>
                </div>
              </>
            )}

            {(userRole === "user" || userRole === "extensionworker") && <AboutUs />}
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
