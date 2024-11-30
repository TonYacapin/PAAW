import React, { useEffect, useState } from "react";
import axiosInstance from "../component/axiosInstance";
import Modal from "../component/Modal";
import OffspringMonitoring from "./OffspringMonitoring"; // Adjust the path as necessary

function OffspringMonitoringList() {
  const [IsOffSpringMonitoringModalOpen, setIsOffSpringMonitoringModalOpen] =
    useState(false);
  const [monitoringRecords, setMonitoringRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [municipalities, setMunicipalities] = useState(null);
  const [statusOptions] = useState(["Pending", "Accepted", "Deleted"]);
  const [filters, setFilters] = useState({
    search: "",
    municipality: "",
    status: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [viewEntriesModalOpen, setViewEntriesModalOpen] = useState(false);
  const [selectedEntries, setSelectedEntries] = useState([]);

  useEffect(() => {
    const fetchMonitoringRecords = async () => {
      try {
        const response = await axiosInstance.get("/api/offspring-monitoring");
        setMonitoringRecords(response.data);

        const uniqueMunicipalities = [
          ...new Set(
            response.data.map((record) => record.municipality).filter(Boolean)
          ),
        ];
        setMunicipalities(uniqueMunicipalities);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching monitoring records:", err);
        setError("Failed to fetch monitoring records");
        setLoading(false);
      }
    };

    fetchMonitoringRecords();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleEditStatus = async (recordId, newStatus) => {
    try {
      await axiosInstance.put(`/api/offspring-monitoring/${recordId}`, {
        formStatus: newStatus,
      });
      setMonitoringRecords(
        monitoringRecords.map((record) =>
          record._id === recordId
            ? { ...record, formStatus: newStatus }
            : record
        )
      );
      setIsModalOpen(false);
      setSelectedRecord(null);
    } catch (err) {
      console.error("Error updating record status:", err);
      setError("Failed to update status");
    }
  };

  const handleViewEntries = (entries) => {
    setSelectedEntries(entries);
    setViewEntriesModalOpen(true);
  };

  const filteredRecords = monitoringRecords.filter((record) => {
    const searchTerm = filters.search.toLowerCase();
    const matchesSearch = record.entries.some(
      (entry) =>
        entry.name.toLowerCase().includes(searchTerm) ||
        entry.species.toLowerCase().includes(searchTerm)
    );

    const matchesMunicipality =
      !filters.municipality || record.municipality === filters.municipality;
    const matchesStatus =
      !filters.status || record.formStatus === filters.status;

    return matchesSearch && matchesMunicipality && matchesStatus;
  });

  if (loading)
    return (
      <div className="flex items-center justify-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  if (error) return <div className="text-red-500 p-8">{error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Offspring Monitoring List</h2>

      {/* Filters Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name or species..."
          value={filters.search}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, search: e.target.value }))
          }
          className="p-2 border rounded w-full"
        />
        <select
          value={filters.municipality}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, municipality: e.target.value }))
          }
          className="p-2 border rounded w-full"
        >
          <option value="">All Municipalities</option>
          {municipalities.map((municipality) => (
            <option key={municipality} value={municipality}>
              {municipality}
            </option>
          ))}
        </select>
        <select
          value={filters.status}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, status: e.target.value }))
          }
          className="p-2 border rounded w-full"
        >
          <option value="">All Statuses</option>
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        <button
          onClick={() =>
            setFilters({ search: "", municipality: "", status: "" })
          }
          className="p-2 bg-[#1b5b40] text-white hover:bg-darkergreen rounded w-full"
        >
          Clear Filters
        </button>
      </div>

      {/* Button to open UpgradingServices modal */}
      <div className="mb-4">
        <button
          onClick={() => setIsOffSpringMonitoringModalOpen(true)}
          className="px-4 py-2 bg-[#1b5b40] text-white rounded hover:bg-darkergreen"
        >
          Open OffSpringMonitoring Form
        </button>
      </div>

      {/* Table with filtered monitoring records */}
      {filteredRecords.length === 0 ? (
        <p className="text-center py-4">
          No records found matching the filters.
        </p>
      ) : (
        <div className="overflow-auto border rounded-lg">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-[#1b5b40] text-white">
                <th className="border border-gray-300 p-4">No.</th>
                <th className="border border-gray-300 p-4">Municipality</th>
                <th className="border border-gray-300 p-4">Date Reported</th>
                <th className="border border-gray-300 p-4">Form Status</th>
                <th className="border border-gray-300 p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record, index) => (
                <tr key={record._id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 p-4">{index + 1}</td>
                  <td className="border border-gray-300 p-4">
                    {record.municipality}
                  </td>
                  <td className="border border-gray-300 p-4">
                    {formatDate(record.dateReported)}
                  </td>
                  <td className="border border-gray-300 p-4">
                    {record.formStatus}
                  </td>
                  <td className="border border-gray-300 p-4">
                    <button
                      onClick={() => {
                        setSelectedRecord(record);
                        setIsModalOpen(true);
                      }}
                      className="px-2 py-1 bg-[#1b5b40] text-white rounded hover:bg-darkergreen"
                    >
                      Edit Status
                    </button>
                    <button
                      onClick={() => handleViewEntries(record.entries)}
                      className="ml-2 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      View Entries
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Status Modal */}
      {selectedRecord && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <h3 className="text-xl font-bold mb-4">
            Edit Status for {selectedRecord.municipality}{" "}
            {formatDate(selectedRecord.dateReported)}
          </h3>
          <div className="mb-4">
            <label htmlFor="status" className="block text-sm font-medium mb-2">
              Status:
            </label>
            <select
              id="status"
              value={selectedRecord.formStatus}
              onChange={(e) =>
                setSelectedRecord((prev) => ({
                  ...prev,
                  formStatus: e.target.value,
                }))
              }
              className="p-2 border rounded w-full"
            >
              {statusOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end">
            <button
              onClick={() =>
                handleEditStatus(selectedRecord._id, selectedRecord.formStatus)
              }
              className="mt-4 ml-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Save
            </button>
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-4 ml-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </Modal>
      )}

      {/* View Entries Modal */}
      {viewEntriesModalOpen && (
        <Modal
          isOpen={viewEntriesModalOpen}
          onClose={() => setViewEntriesModalOpen(false)}
        >
          <h3 className="text-xl font-bold mb-4">Entries Details</h3>
          <div className="overflow-auto max-h-80">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-800 text-white">
                  <th className="border border-gray-300 p-4">No.</th>
                  <th className="border border-gray-300 p-4">Name</th>
                  <th className="border border-gray-300 p-4">Date of AI</th>
                  <th className="border border-gray-300 p-4">
                    Date of Monitoring
                  </th>
                  <th className="border border-gray-300 p-4">Barangay</th>
                  <th className="border border-gray-300 p-4">Species</th>
                  <th className="border border-gray-300 p-4">AI Technician</th>
                  <th className="border border-gray-300 p-4">Calving Date</th>
                  <th className="border border-gray-300 p-4">Sex</th>
                  {/* Add more columns as necessary */}
                </tr>
              </thead>
              <tbody>
                {selectedEntries.map((entry, index) => (
                  <tr key={entry._id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 p-4">{entry.no}</td>
                    <td className="border border-gray-300 p-4">{entry.name}</td>
                    <td className="border border-gray-300 p-4">
                      {new Date(entry.dateOfAi).toLocaleDateString()}
                    </td>
                    <td className="border border-gray-300 p-4">
                      {new Date(entry.dateOfMonitoring).toLocaleDateString()}
                    </td>
                    <td className="border border-gray-300 p-4">
                      {entry.barangay}
                    </td>
                    <td className="border border-gray-300 p-4">
                      {entry.species}
                    </td>
                    <td className="border border-gray-300 p-4">
                      {entry.aiTech}
                    </td>
                    <td className="border border-gray-300 p-4">
                      {new Date(entry.calvingDate).toLocaleDateString()}
                    </td>
                    <td className="border border-gray-300 p-4">{entry.sex}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => setViewEntriesModalOpen(false)}
              className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </Modal>
      )}

      {IsOffSpringMonitoringModalOpen && (
        <Modal
          isOpen={IsOffSpringMonitoringModalOpen}
          onClose={() => setIsOffSpringMonitoringModalOpen(false)}
        >
          <OffspringMonitoring />
        </Modal>
      )}
    </div>
  );
}

export default OffspringMonitoringList;
