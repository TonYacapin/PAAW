import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import ConfirmationModal from './ConfirmationModal';
 
const Modal = ({ isOpen, onClose, children }) => {
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null); // To track pending action (exit or outside click)
 
  if (!isOpen && !isConfirmationModalOpen) return null; // Don't render if modal is closed and confirmation modal is also closed
 
  const handleOutsideClose = (e) => {
    if (e.target === e.currentTarget) {
      setPendingAction('outsideClick');
      setIsConfirmationModalOpen(true); // Trigger confirmation modal on outside click
    }
  };
 
  const handleExitButtonClick = () => {
    setPendingAction('exitButton');
    setIsConfirmationModalOpen(true); // Trigger confirmation modal on exit button click
  };
 
  const handleConfirmExit = () => {
    setIsConfirmationModalOpen(false); // Close the confirmation modal
    onClose(); // Close the main modal after confirmation
    setPendingAction(null); // Reset the pending action
  };
 
  const handleCancelClose = () => {
    setIsConfirmationModalOpen(false); // Just close the confirmation modal without closing the main modal
    setPendingAction(null); // Reset the pending action
  };
 
  return ReactDOM.createPortal(
    <>
      {/* Main Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={handleOutsideClose} // Trigger confirmation modal when clicking outside
        >
          <div
            className="bg-white p-4 lg:p-6 rounded-lg shadow-lg mx-auto relative w-full z-50 overflow-auto max-h-[90vh]
                       sm:max-w-md md:w-full lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl"
          >
            {/* sm:max-w-md md:w-full lg:max-w-3xl xl:max-w-5xl 2xl:max-w-6xl */}
            <button
              onClick={handleExitButtonClick} // Open confirmation modal when close button is clicked
              className="absolute top-2 right-4 text-gray-500 hover:text-gray-700 text-2xl"
            >
              &times;
            </button>
            <div className="overflow-y-auto h-full">{children}</div> {/* Ensure children content can scroll */}
          </div>
        </div>
      )}
 
      {/* Confirmation Modal */}
      {isConfirmationModalOpen && (
        <ConfirmationModal
          isOpen={isConfirmationModalOpen}
          onConfirm={handleConfirmExit} // Close the modal after confirming
          onCancel={handleCancelClose} // Close only the confirmation modal and keep the main modal open
          message="Are you sure you want to exit this form?"
        /> 
      )}
    </>,
    document.body
  );
};
 
export default Modal;