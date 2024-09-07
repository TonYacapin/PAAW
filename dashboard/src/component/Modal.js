import React from 'react';
import ReactDOM from 'react-dom';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null; // Don't render the modal if not open

  const handleClose = (e) => {
    if (e.target === e.currentTarget) {
      onClose(); // Close the modal if clicking outside the content
    }
  };

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" // Set high z-index for modal overlay
      onClick={handleClose}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg mx-auto relative w-full z-50 overflow-auto max-h-[90vh] 
                   sm:max-w-md md:max-w-lg lg:max-w-3xl xl:max-w-5xl 2xl:max-w-6xl" // Make modal larger on desktop screens
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
        >
          &times;
        </button>
        <div className="overflow-y-auto h-full">{children}</div> {/* Make sure children content can scroll */}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
