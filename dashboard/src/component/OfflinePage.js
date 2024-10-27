import React from 'react';

const OfflinePage = () => {
  return (
    <div className="flex flex-col items-center justify-center overflow-hidden">
      <h1 className="text-2xl sm:text-4xl font-semibold text-red-600 mb-4">
        You Are Offline
      </h1>
      <p className="text-lg sm:text-xl text-gray-700 mb-6 text-center px-4">
        Please check your internet connection and try again.
      </p>
      <p className="text-gray-500 text-center px-4">
        If the problem persists, please contact support.
      </p>
    </div>
  );
};

export default OfflinePage;
