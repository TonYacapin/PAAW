import React from "react";
import AccomplishmentReport from "./AccomplishmentReport";
import RSMAccomplishmentReport from "./RSMAccomplishmentReport";
import RabiesVaccinationAccomplishmentReport from "./RabiesVaccinationAccomplishmentReport";
import StepperComponent from "../component/StepperComponent";

function MonthlyAccomplishmentReport() {
  // Define pages (steps) for each report component
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

  // Function to render the step content based on the active step
  const renderStepContent = (step) => {
    // Ensure we don't go beyond the last step
    if (step >= pages.length) {
      return pages[pages.length - 1].content;
    }
    return pages[step]?.content || <div>No content available for this step.</div>;
  };

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      <div className="p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Monthly Accomplishment Report</h2>
        {/* Render the StepperComponent */}
        <StepperComponent pages={pages} renderStepContent={renderStepContent} />
      </div>
    </div>
  );
}

export default MonthlyAccomplishmentReport;
