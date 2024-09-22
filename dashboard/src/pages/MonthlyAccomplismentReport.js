import React, { useState } from "react";
import AccomplishmentReport from "./AccomplishmentReport";
import RSMAccomplishmentReport from "./RSMAccomplishmentReport";
import RabiesVaccinationAccomplishmentReport from "./RabiesVaccinationAccomplishmentReport";
import StepperComponent from "../component/StepperComponent";

import Modal from "../component/Modal";
import TargetList from "./Admin Pages/TargetList";

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
    <div className="p-6 space-y-8 bg-gray-50 min-h-0">
      {/* Button to open the modal */}

      <div className="p-6 bg-white shadow-md rounded-lg">
        <div className="flex flex-row justify-between">
          <h2 className="text-xl font-semibold text-gray-700">
            Monthly Accomplishment Report
          </h2>
          <button
            className="px-4 py-2 bg-darkgreen hover:bg-darkergreen text-white rounded hover:bg-blue-700"
            onClick={() => setModalOpen(true)}
          >
            Open Target Form
          </button>
        </div>

        {/* Render the StepperComponent */}
        <StepperComponent pages={pages} renderStepContent={renderStepContent} />
      </div>

      {/* Modal for TargetForm */}
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <TargetList />
      </Modal>
    </div>
  );
}

export default MonthlyAccomplishmentReport;
