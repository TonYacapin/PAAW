import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DiseaseIncidenceReport from './pages/Livestock and Poultry DRRM/DiseaseIncidenceReport';
import RabiesVaccinationReport from './pages/RABIES/RabiesVaccinationReport';
import Home from "./pages/Home/Home";
import DiseaseInvestigationForm from './pages/Livestock and Poultry DRRM/DiseaseInvestigationForm';
import SignupForm from './pages/SignupPage';
import RoutineServicesMonitoringReport from './pages/Livestock and Poultry DRRM/RoutineServicesMonitoringReport';
import VeterinaryQuarantineInspectionReport from './pages/Regulatory and Monitoring Division/VeterinaryQuarantineInspectionReport';
import VaccinationReport from './pages/Animal Disease Prevention Control and Eradication/VaccinationReport';
import RabiesHistoryForm from './pages/RABIES/RabiesHistoryForm';

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dir" element={<DiseaseIncidenceReport />} />
          <Route path="/Rabies" element={<RabiesVaccinationReport />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/diform" element={<DiseaseInvestigationForm />} />
          <Route path="/Signup" element={<SignupForm/>} />
          <Route path="/rsmr" element={<RoutineServicesMonitoringReport/>} />
          <Route path="/vqir" element={<VeterinaryQuarantineInspectionReport/>} />
          <Route path="/Vr" element={<VaccinationReport/>} />
          <Route path="/rhf" element={<RabiesHistoryForm/>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
