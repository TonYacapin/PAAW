import React from 'react';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

function ErrorModal({ isOpen, onClose, message }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300 ease-in-out">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md mx-4 transform transition-transform duration-300 ease-in-out scale-100">
        <div className="flex items-center mb-4">
          <ErrorOutlineIcon className="text-red-500 mr-2" fontSize="large" />
          <h3 className="text-lg font-semibold text-gray-800">Error</h3>
        </div>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default ErrorModal;
