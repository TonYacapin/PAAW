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
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" // Add padding to prevent content from touching edges
      onClick={handleClose}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-full sm:max-w-md mx-auto relative w-full">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
