import React, { useEffect, useState } from "react";
import axiosInstance from "../component/axiosInstance";
import Modal from "../component/Modal";
import SuccessModal from "./SuccessModal";


function FormListComponent({ endpoint, title, FormComponent }) {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [municipalities, setMunicipalities] = useState([]);
  const [statusOptions] = useState(["Pending", "Accepted", "Deleted"]);
  const [filters, setFilters] = useState({
    search: "",
    municipality: "",
    status: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedForm, setSelectedForm] = useState(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [viewEntriesModalOpen, setViewEntriesModalOpen] = useState(false);
  const [selectedEntries, setSelectedEntries] = useState([]);

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false); // State for success modal
  const [successMessage, setSuccessMessage] = useState(""); // State for success message

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const formsPerPage = 10;

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const response = await axiosInstance.get(endpoint);
        setForms(response.data);

        const uniqueMunicipalities = [
          ...new Set(
            response.data.map((form) => form.municipality).filter(Boolean)
          ),
        ];
        setMunicipalities(uniqueMunicipalities);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching forms:", err);
        setError("Failed to fetch forms");
        setLoading(false);
      }
    };

    fetchForms();
  }, [endpoint]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const isDate = (value) => {
    return !isNaN(Date.parse(value));
  };

  const handleEditStatus = async (formId, newStatus) => {
    try {
      await axiosInstance.put(`${endpoint}/${formId}`, {
        formStatus: newStatus,
      });
      setForms(
        forms.map((form) =>
          form._id === formId ? { ...form, formStatus: newStatus } : form
        )
      );
      setIsModalOpen(false);
      setSelectedForm(null);

      // Show success modal with a message
      setSuccessMessage(`${title.replace("List", "Form")} status updated successfully!`);
      setIsSuccessModalOpen(true);
    } catch (err) {
      console.error("Error updating form status:", err);
      setError("Failed to update status");
    }
  };

  const handleViewEntries = (entries) => {
    setSelectedEntries(entries);
    setViewEntriesModalOpen(true);
  };

  const formatHeader = (key) => {
    const parts = key.split(".");
    const formattedKey = parts.length > 1 ? parts.slice(1).join(" ") : parts[0];
    return formattedKey.charAt(0).toUpperCase() + formattedKey.slice(1);
  };

  const flattenObject = (obj, parentKey = "", result = {}) => {
    for (let key in obj) {
      if (obj.hasOwnProperty(key) && key !== "_id") {
        const newKey = parentKey ? `${parentKey}.${key}` : key;
        if (typeof obj[key] === "object" && obj[key] !== null && !Array.isArray(obj[key])) {
          flattenObject(obj[key], newKey, result);
        } else {
          result[newKey] = obj[key];
        }
      }
    }
    return result;
  };

  const filteredForms = forms.filter((form) => {
    const searchTerm = filters.search.toLowerCase();
    const matchesSearch = form.entries?.some((entry) => {
      const firstName = entry.clientInfo?.firstName || entry.firstName;
      const lastName = entry.clientInfo?.lastName || entry.lastName;
      return (
        `${firstName} ${lastName}`.toLowerCase().includes(searchTerm) ||
        entry.activity.toLowerCase().includes(searchTerm)
      );
    });

    const matchesMunicipality =
      !filters.municipality || form.municipality === filters.municipality;
    const matchesStatus = !filters.status || form.formStatus === filters.status;

    return matchesSearch && matchesMunicipality && matchesStatus;
  });

  // Sort forms from newest to oldest by dateReported
  const sortedForms = filteredForms.sort(
    (a, b) => new Date(b.dateReported) - new Date(a.dateReported)
  );

  // Pagination logic
  const totalPages = Math.ceil(sortedForms.length / formsPerPage);
  const paginatedForms = sortedForms.slice(
    (currentPage - 1) * formsPerPage,
    currentPage * formsPerPage
  );

  if (loading) return (
    <div className="flex items-center justify-center p-8 ">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  );
  if (error) return <div className="text-red-500 p-8">{error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>

      {/* Filters Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by client name or activity..."
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
          className="p-2 shadow-md bg-[#1b5b40] text-white hover:bg-darkergreen rounded w-full"
        >
          Clear Filters
        </button>
      </div>

      {/* Button to open Form modal */}
      <div className="lg:w-auto w-full mb-4">
        <button
          onClick={() => setIsFormModalOpen(true)}
          className="lg:w-auto w-full px-4 py-2 bg-[#1b5b40] text-white rounded hover:bg-darkergreen"
        >
          Open {title.replace("List", "Form")}
        </button>
      </div>

      {/* Table with filtered forms */}
      {filteredForms.length === 0 ? (
        <p className="text-center py-4">No forms found matching the filters.</p>
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
              {paginatedForms.map((form, index) => (
                <tr key={form._id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 p-4">
                    {form.no || (currentPage - 1) * formsPerPage + index + 1}
                  </td>
                  <td className="border border-gray-300 p-4">
                    {form.municipality}
                  </td>
                  <td className="border border-gray-300 p-4">
                    {formatDate(form.dateReported)}
                  </td>
                  <td className="border border-gray-300 p-4">
                    {form.formStatus}
                  </td>
                  <td className="border border-gray-300 p-4 items-center justify-center">
                    <div className="flex items-center justify-center flex-col lg:flex-row w-full gap-2">
                    <button
                      onClick={() => {
                        setSelectedForm(form);
                        setIsModalOpen(true);
                      }}
                      className="lg:w-auto w-full px-2 py-1 bg-[#1b5b40] text-white rounded hover:bg-darkergreen"
                    >
                      Edit Status
                    </button>
                    <button
                      onClick={() => handleViewEntries(form.entries)}
                      className="lg:w-auto w-full px-2 py-1 bg-pastelyellow text-black rounded hover:bg-darkerpastelyellow"
                    >
                      View Entries
                    </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-lg text-white bg-darkgreen hover:bg-darkergreen disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-lg text-white bg-darkgreen hover:bg-darkergreen disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

      {/* Edit Status Modal */}
      {selectedForm && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <h3 className="text-xl font-bold mb-4">
            Edit Status for {selectedForm.municipality}{" "}
            {formatDate(selectedForm.dateReported)}
          </h3>
          <div className="mb-4">
            <label htmlFor="status" className="block text-sm font-medium mb-2">
              Status:
            </label>
            <select
              id="status"
              value={selectedForm.formStatus}
              onChange={(e) =>
                setSelectedForm((prev) => ({
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
          <div className="flex justify-end space-x-2">
            <button
              onClick={() =>
                handleEditStatus(selectedForm._id, selectedForm.formStatus)
              }
              className="px-4 py-2 bg-darkgreen text-white rounded"
            >
              Save
            </button>
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-red-500 text-white rounded"
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
          <div className="overflow-auto max-h-80 rounded-lg">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-darkgreen text-white">
                  {Object.keys(flattenObject(selectedEntries[0] || {})).map(
                    (key) =>
                      key !== "_id" && (
                        <th key={key} className="border border-gray-300 p-4">
                          {formatHeader(key)}
                        </th>
                      )
                  )}
                </tr>
              </thead>
              <tbody>
                {selectedEntries.map((entry, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    {Object.entries(flattenObject(entry)).map(
                      ([key, value], idx) =>
                        key !== "_id" && (
                          <td key={idx} className="border border-gray-300 p-4">
                            {typeof value === "string" &&
                            isDate(value) &&
                            value.length >= 24
                              ? formatDate(value)
                              : value}
                          </td>
                        )
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Modal>
      )}

      {/* Success Modal */}
      {isSuccessModalOpen && (
        <SuccessModal
          isOpen={isSuccessModalOpen}
          onClose={() => setIsSuccessModalOpen(false)}
          message={successMessage}
        />
      )}

      {isFormModalOpen && (
        <Modal
          isOpen={isFormModalOpen}
          onClose={() => setIsFormModalOpen(false)}
        >
          <FormComponent />
        </Modal>
      )}
    </div>
  );
}

export default FormListComponent;
