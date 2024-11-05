import React, { useState, useEffect } from "react";
import axiosInstance from "../../component/axiosInstance";
import Modal from "../../component/Modal";
import SlaughterReportForm from "./SlaughterReportForm";

function SlaughterReportList() {
  const municipalities = [
    "Bagabag",
    "Bayombong",
    "Solano",
    "Villaverde",
    "Aritao",
    "Bambang",
    "Dupax del Norte",
  ];

  const animals = ["Cattle", "Carabao", "Goat", "Sheep", "Hog", "Chicken"];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAnalysisOpen, setisAnalysisOpen] = useState(false);
  const [filter, setFilter] = useState({
    animal: "",
    municipality: "",
    month: "",
    year: "",
  });
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const formsPerPage = 10;

  const fetchSlaughterReports = async () => {
    try {
      const response = await axiosInstance.get(`/api/slaughterform`);
      const fetchedReports = response.data;

      // Flatten the API data to match the table structure
      const processedReports = fetchedReports.flatMap((report) =>
        report.slaughterAnimals.map((animal) => ({
          id: report._id,
          municipality: report.municipality,
          month: report.month.toString(), // Ensure month is a string for matching
          year: report.year.toString(), // Ensure year is a string for matching
          animal: animal.name,
          number: animal.number,
          weight: parseInt(animal.weight, 10), // Convert weight to integer
        }))
      );

      setReports(processedReports);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching slaughter reports:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlaughterReports();
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter({ ...filter, [name]: value });
  };

  const filteredReports = reports.filter((report) => {
    const matchesAnimal = filter.animal
      ? report.animal === filter.animal
      : true;
    const matchesMunicipality = filter.municipality
      ? report.municipality === filter.municipality
      : true;
    const matchesMonth = filter.month ? report.month === filter.month : true;
    const matchesYear = filter.year ? report.year === filter.year : true;
    return matchesAnimal && matchesMunicipality && matchesMonth && matchesYear;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredReports.length / formsPerPage);
  const paginatedReports = filteredReports.slice(
    (currentPage - 1) * formsPerPage,
    currentPage * formsPerPage
  );

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-2xl font-bold text-black mb-8">
        Slaughter Report List
      </h1>
      {/* Collapsible Filter Section */}
      <div className="mb-4">
        <div className="mt-4 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Animal
            </label>
            <select
              name="animal"
              value={filter.animal}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">All Animals</option>
              {animals.map((animal) => (
                <option key={animal} value={animal}>
                  {animal}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Municipality
            </label>
            <select
              name="municipality"
              value={filter.municipality}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">All Municipalities</option>
              {municipalities.map((municipality) => (
                <option key={municipality} value={municipality}>
                  {municipality}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Month
            </label>
            <select
              name="month"
              value={filter.month}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Select Month</option>
              <option value="January">January</option>
              <option value="February">February</option>
              <option value="March">March</option>
              <option value="April">April</option>
              <option value="May">May</option>
              <option value="June">June</option>
              <option value="July">July</option>
              <option value="August">August</option>
              <option value="September">September</option>
              <option value="October">October</option>
              <option value="November">November</option>
              <option value="December">December</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Year
            </label>
            <input
              type="number"
              name="year"
              value={filter.year}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Year"
              min="1900"
              max="2100"
            />
          </div>
        </div>
      </div>

      {/* Analysis Section */}
      {isAnalysisOpen && (
        <div className="mb-6 p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-lg font-medium text-darkgreen">Analysis</h2>
          <p>Total Reports: {filteredReports.length}</p>
          <p>
            Total Animals:{" "}
            {filteredReports.reduce((sum, report) => sum + report.number, 0)}
          </p>
          <p>
            Total Weight:{" "}
            {filteredReports.reduce((sum, report) => sum + report.weight, 0)} kg
          </p>
        </div>
      )}

      {/* Button to Open Slaughter Report Form Modal */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <button
          onClick={() => setisAnalysisOpen(!isAnalysisOpen)}
          className="bg-darkgreen text-white py-3 px-6 rounded-md shadow-lg hover:bg-darkergreen transition duration-200"
        >
          Open Analysis
        </button>
        <button
          onClick={openModal}
          className="bg-darkgreen text-white py-3 px-6 rounded-md shadow-lg hover:bg-darkergreen transition duration-200"
        >
          Open Slaughter Report Form
        </button>
      </div>

      {/* Slaughter Reports Table */}
      <h2 className="text-lg font-medium text-darkgreen mb-2">
        Filtered Reports
      </h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="mb-6 overflow-x-auto">
          {filteredReports.length > 0 ? (
            <div className="overflow-auto border rounded-lg">
              <table className="min-w-full border-collapse border border-gray-300">
                <thead className="bg-darkgreen text-white">
                  <tr>
                    <th className="border border-gray-300 p-4">Animal</th>
                    <th className="border border-gray-300 p-4">Municipality</th>
                    <th className="border border-gray-300 p-4">Month</th>
                    <th className="border border-gray-300 p-4">Year</th>
                    <th className="border border-gray-300 p-4">Number</th>
                    <th className="border border-gray-300 p-4">Weight (kg)</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedReports.map((report) => (
                    <tr key={report.id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 p-4">
                        {report.animal}
                      </td>
                      <td className="border border-gray-300 p-4">
                        {report.municipality}
                      </td>
                      <td className="border border-gray-300 p-4">
                        {report.month}
                      </td>
                      <td className="border border-gray-300 p-4">
                        {report.year}
                      </td>
                      <td className="border border-gray-300 p-4">
                        {report.number}
                      </td>
                      <td className="border border-gray-300 p-4">
                        {report.weight}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">
              No reports found for the selected filters.
            </p>
          )}
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
      {/* Modal for Slaughter Report Form */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <SlaughterReportForm />
      </Modal>
    </div>
  );
}

export default SlaughterReportList;
