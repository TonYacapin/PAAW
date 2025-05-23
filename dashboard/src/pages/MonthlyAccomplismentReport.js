import React, { useState, useEffect } from "react";
import AccomplishmentReport from "./AccomplishmentReport";
import RSMAccomplishmentReport from "./RSMAccomplishmentReport";
import RabiesVaccinationAccomplishmentReport from "./RabiesVaccinationAccomplishmentReport";
import StepperComponent from "../component/StepperComponent";
import Modal from "../component/Modal";
import TargetList from "./Admin Pages/TargetList";
import MunicipalityTargetList from "./Admin Pages/MunicipalityTargetList";
import MunicipalityAccomplishmentReportVaccination from "./MunicipalityAccomplishmentReportVaccination";
import MunicipalityAccomplishmentReportRabies from "./MunicipalityAccomplishmentReportRabies";
import MunicipalityAccomplishmentReportRoutineServices from "./MunicipalityAccomplishmentReportRoutineServices";
import CardBox from "../component/CardBox";
import { jwtDecode } from "jwt-decode";

function MonthlyAccomplishmentReport() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [userRole, setUserRole] = useState("");

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

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      {/* This will display the content for screens larger than medium (md) */}
      <div className="hidden lg:block">
        <div className="p-6 space-y-8 bg- min-h-0">
          {/* Button to open the modal */}

          <div className="flex flex-row mb-4 justify-between">
            <h2 className="text-3xl font-extrabold mb-6 text-darkgreen">
              Monthly Accomplishment Report
            </h2>
            {userRole === "admin" && (
              <button
                className="px-4 py-2 bg-darkgreen hover:bg-darkergreen text-white rounded"
                onClick={handleOpenModal}
              >
                {currentStep >= 3
                  ? "Open Target Form Per Municipality"
                  : "Open Provicial Target Form"}
              </button>
            )}
          </div>
          {/* Render the StepperComponent */}
          <CardBox>
            <StepperComponent
              pages={pages}
              renderStepContent={renderStepContent}
              onStepChange={setCurrentStep}
            />
          </CardBox>
          {/* Modal for TargetForm */}
          <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
            {currentStep >= 3 ? <MunicipalityTargetList /> : <TargetList />}
          </Modal>
        </div>
      </div>
      {/* This will display the message for screens smaller than medium (md) */}
      <div className="block lg:hidden">
        <div className="p-6 bg-green-100 text-green-800 text-center rounded-lg">
          <h2 className="text-xl font-semibold">
            Mobile does not support this feature
          </h2>
          <p>
            Please visit our desktop site to access this feature. Thank you!
          </p>
        </div>
      </div>
    </>
  );
}

export default MonthlyAccomplishmentReport;
