import React, { useEffect, useState } from 'react';
import axiosInstance from './axiosInstance';
import Modal from './Modal';
import StepperComponent from "../component/StepperComponent"; // Import StepperComponent

const AuditLogsInventory = () => {
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const fetchAuditLogs = async () => {
    try {
      const response = await axiosInstance.get('/api/audit-logs-inventory');
      const sortedLogs = response.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setAuditLogs(sortedLogs);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      setLoading(false);
    }
  };

  const renderChangesModal = () => {
    if (!selectedLog) return null;

    const renderChangesContent = () => {
      const { action, changes } = selectedLog;

      const renderChangeSection = (label, data) => {
        if (!data || Object.keys(data).length === 0) return null;

        const formatDate = (date) => {
          return date ? new Date(date).toLocaleString() : 'N/A';
        };

        const renderExpirationField = (expiration) => {
          if (!expiration || !Array.isArray(expiration)) return JSON.stringify(expiration);

          return (
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr>
                  <th className="border py-2 px-4">Quantity (in)</th>
                  <th className="border py-2 px-4">Expiration Date</th>
                </tr>
              </thead>
              <tbody>
                {expiration.map((item, index) => (
                  <tr key={index}>
                    <td className="border py-2 px-4 text-center">{item.in}</td>
                    <td className="border py-2 px-4 text-center">
                      {item.date ? formatDate(item.date) : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          );
        };

        return (
          <div className="mb-4">
            <h3 className="text-darkgreen font-semibold mb-2">{label}</h3>
            <div className="border rounded-md p-4">
              {Object.entries(data).map(([key, value]) => (
                <div key={key} className="flex border-b last:border-b-0 py-2">
                  <span className="font-medium w-1/3">{key}</span>
                  <span className="w-2/3">
                    {key === 'expiration'
                      ? renderExpirationField(value)
                      : key === 'createdAt' || key === 'updatedAt'
                        ? formatDate(value)
                        : JSON.stringify(value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      };

      switch (action) {
        case 'CREATE':
          return renderChangeSection('New Item Details', changes.newItem);
        case 'UPDATE':
          return (
            <>
              {renderChangeSection('Before Changes', changes.before)}
              {renderChangeSection('After Changes', changes.after)}
            </>
          );
        case 'DELETE':
          return renderChangeSection('Deleted Item Details', changes.deletedItem);
        case 'IN':
        case 'OUT':
        case 'REMOVE_EXPIRED':
          return (
            <>
              {renderChangeSection('Before Changes', changes.before)}
              {renderChangeSection('After Changes', changes.after)}
            </>
          );
        default:
          return <p className="text-gray-500">No detailed changes available.</p>;
      }
    };

    return (
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Audit Log Details</h2>
        <div className="mb-4">
          <p><strong>Action:</strong> {selectedLog.action}</p>
          <p><strong>User:</strong> {selectedLog.user}</p>
          <p><strong>Timestamp:</strong> {new Date(selectedLog.timestamp).toLocaleString()}</p>
        </div>
        {renderChangesContent()}
      </div>
    );
  };

  // Create a function to group the logs into pages of 10
  const chunkLogs = (logs, size) => {
    const result = [];
    for (let i = 0; i < logs.length; i += size) {
      result.push(logs.slice(i, i + size));
    }
    return result;
  };

  const logsPerPage = 10;
  const logChunks = chunkLogs(auditLogs, logsPerPage);

  const stepperPages = logChunks.map((chunk, index) => ({
    title: `Page ${index + 1}`,
    content: (
      <>
        {chunk.map((log) => (
          <div key={log.timestamp} className="mb-4">
            <p><strong>Action:</strong> {log.action}</p>
            <p><strong>User:</strong> {log.user}</p>
            <p><strong>Timestamp:</strong> {new Date(log.timestamp).toLocaleString()}</p>
            <button
              onClick={() => {
                setSelectedLog(log);
                setIsModalOpen(true);
              }}
              className="bg-darkgreen text-white py-2 px-4 rounded-md hover:bg-darkergreen transition-colors"
            >
              View Details
            </button>
          </div>
        ))}
      </>
    ),
  }));

  if (loading) {
    return <div className="text-center text-xl text-darkgreen p-4">Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-4 p-4 bg-white text-black lg:max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-black mb-6">Audit Logs</h1>

      <StepperComponent
        pages={stepperPages}
        renderStepContent={(stepIndex) => stepperPages[stepIndex].content}
        onStepChange={(newStepIndex) => console.log('Step changed to:', newStepIndex)}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedLog(null);
        }}
      >
        {renderChangesModal()}
      </Modal>
    </div>
  );
};

export default AuditLogsInventory;
