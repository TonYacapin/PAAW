import React from 'react';
import AccomplishmentReport from './AccomplishmentReport';
import RSMAccomplishmentReport from './RSMAccomplishmentReport';
import RabiesVaccinationAccomplishmentReport from './RabiesVaccinationAccomplishmentReport';

function MonthlyAccomplishmentReport() {
  return (
    <div>
      <AccomplishmentReport />
      <RSMAccomplishmentReport />
      <RabiesVaccinationAccomplishmentReport />
    </div>
  );
}

export default MonthlyAccomplishmentReport;
