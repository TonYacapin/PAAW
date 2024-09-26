import React, { useState } from "react";
import AccomplishmentReport from "./AccomplishmentReport";
import RSMAccomplishmentReport from "./RSMAccomplishmentReport";
import RabiesVaccinationAccomplishmentReport from "./RabiesVaccinationAccomplishmentReport";
import StepperComponent from "../component/StepperComponent";
import Modal from "../component/Modal";
import TargetList from "./Admin Pages/TargetList";
import MunicipalityAccomplishmentReportVaccination from "./MunicipalityAccomplishmentReportVaccination";
import MunicipalityAccomplishmentReportRabies from "./MunicipalityAccomplishmentReportRabies";

import MunicipalityAccomplishmentReportRoutineServices from "./MunicipalityAccomplishmentReportRoutineServices";

function MonthlyAccomplishmentReport() {
  const [isModalOpen, setModalOpen] = useState(false); // State for modal visibility

  const pages = [
    {
      label: "Accomplishment Report",
      content: <AccomplishmentReport />,
    },
    {
      label: "RSM Accomplishment Report",
      content: <RSMAccomplishmentReport />,
    },
    {
      label: "Rabies Vaccination Accomplishment Report",
      content: <RabiesVaccinationAccomplishmentReport />,
    },
    {
      label: "Municipality Accomplishment Report Vaccination",
      content: <MunicipalityAccomplishmentReportVaccination />,
    },
    {
      label: "Municipality Accomplishment Report Rabies",
      content: <MunicipalityAccomplishmentReportRabies />,
    },
    {
      label: "Municipality Accomplishment Report Routine Services",
      content: <MunicipalityAccomplishmentReportRoutineServices />,
    },




  ];

  const renderStepContent = (step) => {
    if (step >= pages.length) {
      return pages[pages.length - 1].content;
    }
    return (
      pages[step]?.content || <div>No content available for this step.</div>
    );
  };

  return (
    <>
      {/* This will display the content for screens larger than medium (md) */}
      <div className="hidden md:block">
        <div className="p-6 space-y-8 bg-gray-50 min-h-0">
          {/* Button to open the modal */}
          <div className="p-6 bg-white shadow-md rounded-lg">
            <div className="flex flex-row mb-4 justify-between">
              <h2 className="text-xl font-semibold text-gray-700">
                Monthly Accomplishment Report
              </h2>
              <button
                className="px-4 py-2 bg-darkgreen hover:bg-darkergreen text-white rounded"
                onClick={() => setModalOpen(true)}
              >
                Open Target Form
              </button>
            </div>

            {/* Render the StepperComponent */}
            <StepperComponent
              pages={pages}
              renderStepContent={renderStepContent}
            />
          </div>

          {/* Modal for TargetForm */}
          <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
            <TargetList />
          </Modal>
        </div>
      </div>

      {/* This will display the message for screens smaller than medium (md) */}
      <div className="block md:hidden">
        <div className="p-6 bg-green-100 text-green-800 text-center rounded-lg">
          <h2 className="text-xl font-semibold">Mobile does not support this feature</h2>
          <p>Please visit our desktop site to access this feature. Thank you!</p>
        </div>
      </div>
    </>
  );
}

export default MonthlyAccomplishmentReport;
