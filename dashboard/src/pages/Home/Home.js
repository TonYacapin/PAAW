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
    const buttonClasses =
      "w-full   flex items-center bg-darkgreen text-white py-2 px-4 rounded-md shadow-sm hover:bg-darkergreen transition-colors";
    // hendre: sm:w-3/6 sm:h-40 sm:flex-col sm:flex-wrap
    switch (selectedDivision) {
      case "user":
        return (
          <>
            <h3 className="text-lg sm:text-xl font-semibold text-black mb-2 sm:mb-4 text-left">
              Browse Forms from Client Forms
            </h3>
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-medium text-gray-700 mb-2">
                  Request Services Forms
                </h4>
                <div className="space-y-2">
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
                        className={buttonClasses + " text-left"}
                      >
                        <HealingIcon className="mr-2" /> Animal Health Care
                        Services
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
                        className={buttonClasses + " text-left"}
                      >
                        <VaccinesIcon className="mr-2" /> Animal Production
                        Services
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
                        className={buttonClasses + " text-left"}
                      >
                        <ReportIcon className="mr-2" /> Veterinary Information
                        Services
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
                        className={buttonClasses + " text-left"}
                      >
                        <LocalShippingIcon className="mr-2" /> Regulatory
                        Services
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
                      className={buttonClasses + " text-left"}
                    >
                      <LocalShippingIcon className="mr-2" /> Regulatory Services
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
                      className={buttonClasses + " text-left"}
                    >
                      <VaccinesIcon className="mr-2" /> Animal Production
                      Services
                    </button>
                  )}

                  {/* Show only Veterinary Information Services if userRole is "animalhealth" */}
                  {userRole === "animalhealth" && (
                    <>
                      <button
                        onClick={() =>
                          openModalWithContent(
                            isOffline
                              ? "AnimalHealthCareServices"
                              : "AnimalHealthCareServicesList"
                          )
                        }
                        className={`${buttonClasses} text-left`}
                      >
                        <HealingIcon className="mr-2" /> Animal Health Care Services
                      </button>


                    </>
                  )}

                </div>
              </div>
            </div>
          </>
        );
      case "admin":
        return (
          <>
            <h3 className="text-lg sm:text-xl font-semibold text-black mb-2 sm:mb-4 text-left">
              Admin Actions
            </h3>

            <div className="space-y-2">
              <button
                className={buttonClasses}
                onClick={() =>
                  openModalWithContent(
                    isOffline ? "OfflinePage" : "BackupRestore"
                  )}
              >
                <ManageAccountsIcon className="mr-2" /> Backup and Restore
              </button>
              <button
                className={buttonClasses}
                onClick={() =>

                  openModalWithContent(
                    isOffline ? "OfflinePage" : "UserManagement"
                  )}
              >
                <ManageAccountsIcon className="mr-2" /> Manage Users
              </button>
              <button
                className={buttonClasses}
                onClick={() =>

                  openModalWithContent(
                    isOffline ? "OfflinePage" : "AuditLogList"
                  )}
              >
                <Outbox className="mr-2" />
                AuditLog
              </button>
              <button
                className={buttonClasses}
                onClick={() => openModalWithContent(
                  isOffline ? "OfflinePage" : "RequisitionIssueSlipList"
                )}
              >
                <Outbox className="mr-2" /> Manage Requisition Forms
              </button>
              <button
                className={buttonClasses}
                onClick={() =>

                  openModalWithContent(
                    isOffline ? "OfflinePage" : "Inventory"
                  )}
              >
                <Inventory className="mr-2" /> Inventory Equipment
              </button>
            </div>
          </>
        );

      case "animalhealth":
        return (
          <>
            <h3 className="text-lg sm:text-xl font-semibold text-black mb-2 sm:mb-4 text-left">
              Browse Forms from Animal Health
            </h3>
            <div className="space-y-6">
              {userRole !== "admin" && userRole !== "extensionworker" && (
                <div>
                  <h4 className="text-lg font-medium text-gray-700 mb-2">
                    Requisition Forms
                  </h4>
                  <div className="space-y-2">
                    <button
                      className={buttonClasses}
                      onClick={() =>
                        openModalWithContent(
                          isOffline ? "OfflinePage" : "RequisitionIssueSlipList"
                        )
                      }
                    >
                      <Outbox className="mr-2" /> Requisition Form
                    </button>
                  </div>
                </div>
              )}
              <div>
                <h4 className="text-lg font-medium text-gray-700 mb-2">
                  Vaccination Forms
                </h4>
                <div className="space-y-2">
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
                    className={buttonClasses}
                  >
                    <ReportIcon className="mr-2" /> Rabies Vaccination
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
                      openModalWithContent(
                        isOffline
                          ? "DiseaseInvestigationForm"
                          : userRole === "extensionworker"
                            ? "DiseaseInvestigationForm"
                            : "DiseaseInvestigationFormLists"
                      )
                    }
                    className={buttonClasses}
                  >
                    <ReportIcon className="mr-2" /> Disease Investigation Form
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
                    className={buttonClasses}
                  >
                    <PetsIcon className="mr-2" /> Rabies History
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
                    className={buttonClasses}
                  >
                    <AssignmentIcon className="mr-2" /> Routine Service
                    Monitoring Reports
                  </button>
                  {userRole !== "extensionworker" && (
                    <button
                      onClick={() =>
                        openModalWithContent(
                          isOffline ? "OfflinePage" : "AccomplishmentReport"
                        )
                      }
                      className={buttonClasses + " lg:block hidden text-left"}
                    >
                      <AssignmentIcon className="mr-2" /> Generate Accomplishment Report
                    </button>
                  )}

                </div>
              </div>
            </div>
          </>
        );


      case "livestock":
        return (
          <>
            <h3 className="text-lg sm:text-xl font-semibold text-black mb-2 sm:mb-4 text-left">
              Browse Forms from Livestock
            </h3>
            <div className="space-y-6">
              {userRole !== "admin" && userRole !== "extensionworker" && (
                <div>
                  <h4 className="text-lg font-medium text-gray-700 mb-2">
                    Requisition Forms
                  </h4>
                  <div className="space-y-2">
                    <button
                      className={buttonClasses}
                      onClick={() =>
                        openModalWithContent(
                          isOffline ? "OfflinePage" : "RequisitionIssueSlipList"
                        )
                      }
                    >
                      <ManageAccountsIcon className="mr-2" /> Requisition Form
                    </button>
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-lg font-medium text-gray-700 mb-2">
                  Livestock Management
                </h4>
                <div className="space-y-2">
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
                    className={buttonClasses}
                  >
                    <PetsIcon className="mr-2" /> Upgrading Service
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
                    className={buttonClasses}
                  >
                    <PetsIcon className="mr-2" /> Offspring Monitoring
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
                    className={buttonClasses}
                  >
                    <PetsIcon className="mr-2" /> Technician's Quarterly Calf Drop Report
                  </button>

                  {/* Conditional rendering for the Accomplishment Report button */}
                  {userRole !== "extensionworker" && (
                    <button
                      onClick={() =>
                        openModalWithContent(
                          isOffline ? "OfflinePage" : "AccomplishmentReportLivestock"
                        )
                      }
                      className={buttonClasses + " lg:block hidden text-left"}
                    >
                      <AssignmentIcon className="mr-2" /> Generate Monthly Accomplishment Reports
                    </button>
                  )}
                </div>
              </div>
            </div>
          </>
        );


      case "regulatory":
        return (
          <>
            <h3 className="text-lg sm:text-xl font-semibold text-black mb-2 sm:mb-4 text-left">
              Browse Forms from Regulatory
            </h3>
            <div className="space-y-6">
              {userRole !== "admin" && (
                <div>
                  <h4 className="text-lg font-medium text-gray-700 mb-2">
                    Requisition Forms
                  </h4>
                  <div className="space-y-2">
                    <button className={buttonClasses}
                      onClick={() => openModalWithContent(
                        isOffline ? "OfflinePage" : "RequisitionIssueSlipList"
                      )}>
                      <ManageAccountsIcon className="mr-2" /> Requisition Form
                    </button>
                  </div>
                </div>
              )}
              <div>
                <div className="space-y-4">
                  <div>
                    <h5 className="text-lg font-medium text-gray-700 mb-2">
                      Annual Reports
                    </h5>
                    <div className="space-y-2">
                      <button
                        onClick={() =>

                          openModalWithContent(
                            isOffline ? "OfflinePage" : "IncomingReportList"
                          )

                        }
                        className={buttonClasses}
                      >
                        <ReportIcon className="mr-2" /> Incoming Report
                      </button>
                      <button
                        onClick={() =>
                          openModalWithContent(
                            isOffline ? "OfflinePage" : "OutgoingReportList"
                          )}
                        className={buttonClasses}
                      >
                        <ReportIcon className="mr-2" /> Outgoing Report
                      </button>
                    </div>
                  </div>
                  <div>
                    <h5 className="text-lg font-medium text-gray-700 mb-2">
                      List Reports
                    </h5>
                    <div className="space-y-2">
                      <button
                        onClick={() =>
                          openModalWithContent(
                            isOffline ? "SlaughterReportForm" : "SlaughterReportList"
                          )}
                        className={buttonClasses}
                      >
                        <AssessmentIcon className="mr-2" /> Slaughter Report
                        (consolidated)
                      </button>
                      <button
                        onClick={() => openModalWithContent(
                          isOffline ? "VeterinaryShipmentForm" : "VeterinaryShipmentList"
                        )

                        }
                        className={buttonClasses}
                      >
                        <LocalShippingIcon className="mr-2" /> Veterinary
                        Shipment Report
                      </button>
                    </div>
                  </div>
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
                    <div className="flex items-center col-span-1 justify-center">
                      {!isOffline && (
                        <button
                          onClick={() => toggleFilterShow()}
                          className="bg-darkgreen text-white py-2 px-4 rounded-md shadow-sm hover:bg-darkergreen transition-colors"
                        >
                          {showAll ? "Show Filters" : "Hide Filters"}
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
