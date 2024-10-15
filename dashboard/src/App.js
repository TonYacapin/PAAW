import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DiseaseIncidenceReport from "./pages/Livestock and Poultry DRRM/DiseaseIncidenceReport";
import RabiesVaccinationReport from "./pages/RABIES/RabiesVaccinationReport";
import Home from "./pages/Home/Home";
import DiseaseInvestigationForm from "./pages/Livestock and Poultry DRRM/DiseaseInvestigationForm";
import SignupForm from "./pages/SignupPage";
import RoutineServicesMonitoringReport from "./pages/Livestock and Poultry DRRM/RoutineServicesMonitoringReport";
import VaccinationReport from "./pages/Animal Disease Prevention Control and Eradication/VaccinationReport";
import RabiesHistoryForm from "./pages/RABIES/RabiesHistoryForm";
import ChartComponent from "./component/ChartComponent";
import AccomplishmentReport from "./pages/AccomplishmentReport";
import RabiesVaccinationAccomplishmentReport from "./pages/RabiesVaccinationAccomplishmentReport";
import RequisitionIssueSlip from "./pages/RequisitionIssueSlip ";
import UpgradingService from "./pages/UpgradingServices";
import TechnicianQuarterlyReportForm from "./pages/TechnicianQuarterlyReportForm";

import RabiesReportChart from "./component/RabiesReportChart ";

import RSMAccomplishmentReport from "./pages/RSMAccomplishmentReport";

import MunicipalityTargetList from "./pages/Admin Pages/MunicipalityTargetList";

import OffspringMonitoring from "./pages/OffspringMonitoring";
import AnimalHealthCareServices from "./pages/Client Request Forms/AnimalHealthCareServices";
import AnimalProductionServices from "./pages/Client Request Forms/AnimalProductionServices";
import RegulatoryCareServices from "./pages/Client Request Forms/RegulatoryCareServices";
import VeterinaryInformationServices from "./pages/Client Request Forms/VeterinaryInformationServices";
const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
        <Route path="/TechnicianQuarterlyReportForm" element={<TechnicianQuarterlyReportForm />} />
        <Route path="/OffspringMonitoring" element={<OffspringMonitoring />} />
          <Route path="/MunicipalityTargetList" element={<MunicipalityTargetList />} />
          <Route path="/rabiesreportchart" element={<RabiesReportChart />} />
          <Route
            path="/RSMAccomplishmentReport"
            element={<RSMAccomplishmentReport />}
          />
          <Route
            path="/RabiesVaccinationAccomplishmentReport"
            element={<RabiesVaccinationAccomplishmentReport />}
          />

          <Route
            path="/AccomplishementReport"
            element={<AccomplishmentReport />}
          />
          <Route path="/requisionslip" element={<RequisitionIssueSlip />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/Signup" element={<SignupForm />} />
          {/* Manage Animal Health Division */}
          {/* Rabies Prevention, Control, and Eradication */}
          <Route path="/Rabies" element={<RabiesVaccinationReport />} />
          <Route path="/rhf" element={<RabiesHistoryForm />} />
          {/* Animal Disease, Prevention, Control, and Eradication */}
          <Route path="/Vr" element={<VaccinationReport />} />

          {/* Livestock and Poultry DRRM */}
          <Route path="/diform" element={<DiseaseInvestigationForm />} />
          <Route path="/dir" element={<DiseaseIncidenceReport />} />
          <Route path="/rsmr" element={<RoutineServicesMonitoringReport />} />

          {/* Livestock Division */}
          <Route path="/up" element={<UpgradingService />} />
          {/* Upgrading Services */}
          {/* (need dito yung lahat ng upgrading service na nakalagay sa usecase) */}

          {/* Regulatory Division */}
          {/* Veterinary Quarantine Operation */}
       
          {/* Meat Inspection Operation */}
          {/* (kulang to) */}

          {/* Client */}
          <Route path="/ahcs" element={<AnimalHealthCareServices />} />
          <Route path="/aps" element={<AnimalProductionServices />} />
          <Route path="/rcs" element={<RegulatoryCareServices />} />
          <Route path="/vis" element={<VeterinaryInformationServices />} />
          {/* Submitted Forms */}

          {/* Admin Division */}
          {/* Records (import/export data) */}
          {/* Supplies and Equipment */}
          {/* (need dito inventory management system plus yung mga manage requsition forms) */}
          {/* Knowledge */}
          {/* (mga charts, up to you kung need ng separate view/page) */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
