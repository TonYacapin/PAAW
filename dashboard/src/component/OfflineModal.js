import React from "react";

export default function OfflineModal() {
  return (
    <>
      {/* This will display the message when device is offline*/}
      <div className="block lg:hidden">
        <div className="p-6 bg-gray-100 text-gray-800 text-center rounded-lg">
          <h2 className="text-xl font-semibold">
            You are Offline
          </h2>
          <p>
            Please restore your Internet connection to access this feature. Thank you!
          </p>
        </div>
      </div>
    </>
  );
}
