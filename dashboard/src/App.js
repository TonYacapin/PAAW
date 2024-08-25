import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DiseaseIncidenceReport from './pages/Livestock and Poultry DRRM/DiseaseIncidenceReport';
import RabiesVaccinationReport from './pages/RABIES/RabiesVaccinationReport';
import DiseaseInvestigationForm from './pages/Livestock and Poultry DRRM/DiseaseInvestigationForm';
import SignupForm from './pages/SignupPage';
import RoutineServicesMonitoringReport from './pages/Livestock and Poultry DRRM/RoutineServicesMonitoringReport';

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dif" element={<DiseaseIncidenceReport />} />
          <Route path="/Rabies" element={<RabiesVaccinationReport />} />
          <Route path="/diform" element={<DiseaseInvestigationForm />} />
          <Route path="/Signup" element={<SignupForm/>} />
          <Route path="/rsmr" element={<RoutineServicesMonitoringReport/>} />
          {/* Add more routes here if needed */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
