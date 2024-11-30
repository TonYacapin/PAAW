import React, { useEffect, useState } from 'react';
import axiosInstance from './axiosInstance'; // Adjust path as needed
import StepperComponent from './StepperComponent'; // Path to your stepper component
import Modal from './Modal'; // Import your Modal component

const AuditLogsInventory = () => {
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState(null); // Track the log for which the modal is open
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchAuditLogs = async () => {
      try {
        const response = await axiosInstance.get('/api/audit-logs-inventory');
        const sortedLogs = response.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setAuditLogs(sortedLogs);
      } catch (error) {
        console.error('Error fetching audit logs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAuditLogs();
  }, []);

  if (loading) {
    return <p className="text-center text-xl text-darkgreen">Loading...</p>;
  }

  // Split the audit logs into chunks for the stepper
  const chunkSize = 5; // Customize the chunk size based on your requirement
  const auditLogsPages = [];
  for (let i = 0; i < auditLogs.length; i += chunkSize) {
    auditLogsPages.push(auditLogs.slice(i, i + chunkSize));
  }

  const renderChangesTable = (changes, action) => {
    const tableStyles = "w-full border border-darkgreen text-left shadow-sm";
    const headerStyles = "bg-darkgreen text-white py-2 px-4";
    const cellStyles = "border-t border-darkgreen py-2 px-4";
    const labelStyles = "font-bold text-darkgreen";

    const renderChanges = (label, data) => (
      <div className="my-4">
        <p className={`${labelStyles} mb-2`}>{label}</p>
        <table className={`${tableStyles} mb-4`}>
          <thead>
            <tr>
              <th className={headerStyles}>Field</th>
              <th className={headerStyles}>Value</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(data).map(([key, value]) => (
              <tr key={key}>
                <td className={cellStyles}>{key}</td>
                <td className={cellStyles}>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );

    switch (action) {
      case "IN":
      case "OUT":
        return (
          <div className="space-y-6">
            {renderChanges("Before:", changes.before)}
            {renderChanges("After:", changes.after)}
          </div>
        );

      case "UPDATE":
        return (
          <div className="space-y-6">
            {renderChanges("Before:", changes.before)}
            {renderChanges("After:", changes.after)}
          </div>
        );

      case "CREATE":
        return renderChanges("New Item:", changes.newItem);

      case "DELETE":
        return renderChanges("Deleted Item:", changes.deletedItem);

      default:
        return <p className="text-darkergreen">No changes available.</p>;
    }
  };

  // Function to render content for each step
  const renderStepContent = (activeStep) => {
    const logsToShow = auditLogsPages[activeStep];
    return (
      <table className="table-auto w-full text-left border-collapse border border-darkgreen shadow-lg">
        <thead>
          <tr className="bg-darkgreen text-white">
            <th className="py-2 px-4">Action</th>
            <th className="py-2 px-4">User</th>
            <th className="py-2 px-4">Changes</th>
            <th className="py-2 px-4">Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {logsToShow.map((log) => (
            <tr key={log._id} className="border-b border-darkgreen">
              <td className="py-2 px-4">{log.action}</td>
              <td className="py-2 px-4">{log.user}</td>
              <td className="py-2 px-4">
                <button
                  onClick={() => {
                    setSelectedLog(log); // Set the selected log
                    setIsModalOpen(true); // Open the modal
                  }}
                  className="text-darkgreen underline"
                >
                  Show Changes
                </button>
              </td>
              <td className="py-2 px-4">{new Date(log.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold text-darkgreen mb-6">Audit Logs Inventory</h2>
      <StepperComponent
        pages={auditLogsPages}
        renderStepContent={renderStepContent}
      />
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedLog(null);
        }}
      >
        {selectedLog && renderChangesTable(selectedLog.changes, selectedLog.action)}
      </Modal>
    </div>
  );
};

export default AuditLogsInventory;
