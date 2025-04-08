import React, { useState, useEffect } from 'react';
import { Warning, Cancel, CheckCircle } from '@mui/icons-material';

function ConfirmationModal({ isOpen, onConfirm, onCancel, message }) {
  const [animationClass, setAnimationClass] = useState('opacity-0 scale-95');
  
  useEffect(() => {
    if (isOpen) {
      // Small delay to ensure animation works properly
      setTimeout(() => {
        setAnimationClass('opacity-100 scale-100');
      }, 10);
    } else {
      setAnimationClass('opacity-0 scale-95');
    }
  }, [isOpen]);
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
      <div 
        className={`bg-white rounded-xl shadow-2xl w-full lg:max-w-md max-w-xs transform transition-all duration-300 ease-in-out ${animationClass}`}
      >
        <div className="bg-gradient-to-r from-darkgreen to-emerald-600 text-white p-5 rounded-t-xl flex items-center">
          <div className="bg-white/20 rounded-full p-2 mr-3">
            <Warning fontSize="medium" />
          </div>
          <h3 className="text-xl font-medium">Confirm Action</h3>
        </div>
        
        <div className="p-6">
          <p className="text-gray-700 text-base mb-6">{message}</p>
          
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex items-center px-4 py-2.5 border border-gray-300 text-gray-700 bg-white rounded-lg hover:bg-gray-50 transition-colors duration-200 shadow-sm"
            >
              <Cancel fontSize="small" className="mr-2 text-gray-500" />
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="flex items-center px-4 py-2.5 bg-gradient-to-r from-darkgreen to-emerald-600 text-white rounded-lg hover:shadow-lg hover:from-darkgreen hover:to-emerald-700 transition-all duration-200 shadow-sm"
            >
              <CheckCircle fontSize="small" className="mr-2" />
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModal;