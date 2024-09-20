import React from 'react';
import AccomplishmentReport from './AccomplishmentReport';
import RSMAccomplishmentReport from './RSMAccomplishmentReport';
import RabiesVaccinationAccomplishmentReport from './RabiesVaccinationAccomplishmentReport';

function MonthlyAccomplishmentReport() {
  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      <div className="p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Accomplishment Report</h2>
        <AccomplishmentReport />
      </div>

      <div className="p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">RSM Accomplishment Report</h2>
        <RSMAccomplishmentReport />
      </div>

      <div className="p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Rabies Vaccination Accomplishment Report</h2>
        <RabiesVaccinationAccomplishmentReport />
      </div>
    </div>
  );
}

export default MonthlyAccomplishmentReport;
