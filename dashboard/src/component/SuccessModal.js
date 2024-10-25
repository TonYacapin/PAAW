import React from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';


function SuccessModal({ isOpen, onClose, message }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300 ease-in-out">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md mx-4 transform transition-transform duration-300 ease-in-out scale-100">
        <div className="flex items-center mb-4">
          <CheckCircleIcon className="text-green-500 mr-2" fontSize="large" />
          <h3 className="text-lg font-semibold text-gray-800">Success</h3>
        </div>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-darkgreen text-white rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default SuccessModal;
