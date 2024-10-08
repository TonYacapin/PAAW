import React, { useState } from "react";

import StepperComponent from "../component/StepperComponent";
import Modal from "../component/Modal";
import MonthlyAccomplishmentReportUpgradingServices from "./MonthlyAccomplishmentReportUpgradingServices";
import MonthlyAccomplishmentReportOffspringMonitoring from "./MonthlyAccomplishmentReportOffspringMonitoring";
import MonthAccomplishmentReportCalfDrop from "./MonthAccomplishmentReportCalfDrop";
function MonthlyAccomplishmentReport() {
    const [isModalOpen, setModalOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);

    const pages = [
        {
            label: "Monthly Accomplishment Report Upgrading Services",
            content: <MonthlyAccomplishmentReportUpgradingServices />,
        },
        {
            label: "Monthly Accomplishment Report Offspring Monitoring",
            content: <MonthlyAccomplishmentReportOffspringMonitoring />,
        },
        {
            label: "Monthly Accomplishment Report Calf Drop",
            content: <MonthAccomplishmentReportCalfDrop />,
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
                <div className="p-6 space-y-8 bg-gray-50 min-h-0">
                    {/* Button to open the modal */}
                    <div className="p-6 bg-white shadow-md rounded-lg">
                        <div className="flex flex-row mb-4 justify-between">
                            <h2 className="text-xl font-semibold text-gray-700">
                                Monthly Accomplishment Report
                            </h2>
                          
                        </div>
                        {/* Render the StepperComponent */}
                        <StepperComponent
                            pages={pages}
                            renderStepContent={renderStepContent}
                            onStepChange={setCurrentStep}
                        />
                    </div>
                
                  
                </div>
            </div>
            {/* This will display the message for screens smaller than medium (md) */}
            <div className="block lg:hidden">
                <div className="p-6 bg-green-100 text-green-800 text-center rounded-lg">
                    <h2 className="text-xl font-semibold">Mobile does not support this feature</h2>
                    <p>Please visit our desktop site to access this feature. Thank you!</p>
                </div>
            </div>
        </>
    );
}

export default MonthlyAccomplishmentReport;