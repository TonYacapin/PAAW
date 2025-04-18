import React, { useEffect, useState, useRef } from "react";
import axiosInstance from "../component/axiosInstance";
import PrintableMunicipalityAccomplishmentReportVaccination from "../component/PrintComponents/PrintableMunicipalityAccomplishmentReportVaccination";
import { jwtDecode } from "jwt-decode";
const MunicipalityAccomplishmentReportVaccination = () => {
  const [reportData, setReportData] = useState([]);
  const [selectedYear, setSelectedYear] = useState("2024"); // Default year
  const [selectedMonth, setSelectedMonth] = useState("9"); // Default month
  const [selectedSpecies, setSelectedSpecies] = useState("Carabao"); // Default species
  const [loading, setLoading] = useState(false); // Loading state
  const [semiAnnualTargets, setSemiAnnualTargets] = useState([]); // State to store semi-annual targets
  const [userFullName, setUserFullName] = useState('');
  // Predefined list of municipalities
  const municipalitiesList = [
    "Aritao",
    "Alfonso Castañeda",
    "Ambaguio",
    "Bagabag",
    "Bambang",
    "Bayombong",
    "Diadi",
    "Dupax del Norte",
    "Dupax del Sur",
    "Kayapa",
    "Kasibu",
    "Quezon",
    "Santa Fe",
    "Solano",
    "Villaverde",
  ];

  
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        const decodedToken = jwtDecode(token); // Decodes the token
        const userId = decodedToken.userId; // Adjust based on your token structure

        const response = await axiosInstance.get('/api/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Find the user based on the decoded userId
        const userData = response.data.find(user => user._id === userId);
        if (userData) {
          const fullName = `${userData.firstname} ${userData.middlename ? userData.middlename + ' ' : ''
            }${userData.lastname}`;
          setUserFullName(fullName);


        }
     
      } catch (error) {
        console.error('Error fetching user information:', error);
      }
    };

    fetchUserInfo();
  }, []);


  const fetchData = async (year, month, species) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/vaccination/species-count`, {
        params: { year, month, species },
      });
      const { currentMonth, previousMonth, total } = response.data[0]; // Access the first object of the returned array

      // Initialize aggregated data with zero counts for each municipality
      const aggregatedData = {};
      municipalitiesList.forEach((municipality) => {
        aggregatedData[municipality] = {
          municipality,
          previousMonth: 0,
          presentMonth: 0,
          total: 0,
        };
      });

      // Helper function to aggregate counts
      const aggregateCounts = (dataArray, monthType) => {
        dataArray.forEach((item) => {
          const { municipality } = item;
          if (aggregatedData[municipality]) {
            if (item.count) {
              if (monthType === "currentMonth") {
                aggregatedData[municipality].presentMonth += item.count;
              } else if (monthType === "previousMonth") {
                aggregatedData[municipality].previousMonth += item.count;
              } else if (monthType === "total") {
                aggregatedData[municipality].total += item.count;
              }
            }
          }
        });
      };

      // Aggregate current month counts
      aggregateCounts(currentMonth, "currentMonth");
      // Aggregate previous month counts
      aggregateCounts(previousMonth, "previousMonth");
      // Aggregate total counts
      aggregateCounts(total, "total");

      // Convert aggregated data into an array for rendering
      setReportData(Object.values(aggregatedData));
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };
  // Fetch the semi-annual targets
  const fetchSemiAnnualTargets = async () => {
    try {
      const response = await axiosInstance.get(`/api/mtargets`, {
        params: {
          targetYear: selectedYear,
          type: getTypeBySpecies(selectedSpecies),
        },
      });
      const targets = response.data;
      const targetsMap = {};

      // Map the semi-annual target data by municipality
      targets.forEach((target) => {
        targetsMap[target.municipality] = target.semiAnnualTarget;
      });

      setSemiAnnualTargets(targetsMap);
    } catch (error) {
      console.error("Error fetching semi-annual targets:", error);
    }
  };

  // Get species type for filtering targets (e.g., "HEMOSEP-CARABAO" for Carabao)
  const getTypeBySpecies = (species) => {
    switch (species) {
      case "Carabao":
        return "HEMOSEP-CARABAO";
      case "Cattle":
        return "HEMOSEP-CATTLE";
      case "Goat/Sheep":
        return "HEMOSEP-GOAT/SHEEP";
      case "Swine":
        return "HOG-CHOLERA";
      case "Poultry":
        return "NCD-POULTRY";
      default:
        return "";
    }
  };

  // Automatically fetch data whenever the year, month, or species changes
  useEffect(() => {
    fetchData(selectedYear, selectedMonth, selectedSpecies);
    fetchSemiAnnualTargets(); // Fetch semi-annual targets
  }, [selectedYear, selectedMonth, selectedSpecies]);

  // Function to calculate the grand total for Previous Month, Present Month, and Total
  const calculateGrandTotal = (type) => {
    return reportData.reduce((acc, item) => acc + (item[type] || 0), 0);
  };

  // Function to get the table title based on selected species
  const getTableTitle = () => {
    switch (selectedSpecies) {
      case "Carabao":
        return "HEMOSEP - CARABAO";
      case "Cattle":
        return "HEMOSEP - CATTLE";
      case "Goat/Sheep":
        return "HEMOSEP - GOAT/SHEEP";
      case "Poultry":
        return "NCD - POULTRY";
      case "Swine":
        return "HOG CHOLERA";
      default:
        return "Vaccination Report";
    }
  };
  const printComponentRef = useRef();

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write("<html><head><title>Vaccination Report</title>");
    printWindow.document.write("<style>");
    printWindow.document.write(`
            body { font-family: Arial, sans-serif; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid black; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
        `);
    printWindow.document.write("</style></head><body>");
    printWindow.document.write(
      document.getElementById("printable-content").innerHTML
    );
    printWindow.document.write("</body></html>");
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <>
      <div className="">
        {/* Hidden printable content */}
        <div id="printable-content" style={{ display: "none" }}>
          <PrintableMunicipalityAccomplishmentReportVaccination
            reportData={reportData}
            selectedYear={selectedYear}
            selectedMonth={selectedMonth}
            selectedSpecies={selectedSpecies}
            semiAnnualTargets={semiAnnualTargets}
            userFullName={userFullName} 
          />
        </div>
        <h1 className="text-xl font-semibold text-gray-700">
          Municipality Vaccination Accomplishment Report
        </h1>
        <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-md">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 pb-6">
            <div className="flex flex-col">
              <label
                htmlFor="year"
                className="text-md font-semibold text-gray-700 mb-2"
              >
                Year
              </label>
              <input
                type="number"
                id="year"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="border border-[#1b5b40] rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-[#ffe356] text-[#252525] bg-gray-100"
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="month"
                className="text-md font-semibold text-gray-700 mb-2 "
              >
                Month
              </label>
              <select
                id="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="border border-[#1b5b40] rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-[#ffe356] text-[#252525] bg-gray-100"
              >
                {[...Array(12)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {new Date(0, i).toLocaleString("default", {
                      month: "long",
                    })}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="species"
                className="text-md font-semibold text-gray-700 mb-2"
              >
                Species
              </label>
              <select
                id="species"
                value={selectedSpecies}
                onChange={(e) => setSelectedSpecies(e.target.value)}
                className="border border-[#1b5b40] rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-[#ffe356] text-[#252525] bg-gray-100"
              >
                <option value="Carabao">Carabao</option>
                <option value="Cattle">Cattle</option>
                <option value="Goat/Sheep">Goat/Sheep</option>
                <option value="Swine">Swine</option>
                <option value="Poultry">Poultry</option>
              </select>
            </div>
          </div>

          {/* Display loading spinner or table */}
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <div className="">
              <h2 className="text-lg font-semibold mb-4">{getTableTitle()}</h2>
              <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
                <table className="min-w-full border-[#1b5b40] rounded-lg shadow-lg">
                  <thead className="bg-[#1b5b40] text-white sticky top-0">
                    <tr className="bg-[#1b5b40] text-white">
                      <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium uppercase tracking-wider">
                        Municipality
                      </th>
                      <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium uppercase tracking-wider">
                        Semi Annual Target
                      </th>
                      <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium uppercase tracking-wider">
                        Previous Month
                      </th>
                      <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium uppercase tracking-wider">
                        Present Month
                      </th>
                      <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium uppercase tracking-wider">
                        %
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reportData.length > 0 ? (
                      reportData.map((item, index) => {
                        const semiAnnualTarget =
                          semiAnnualTargets[item.municipality] || 0;
                        const percentage =
                          semiAnnualTarget > 0
                            ? ((item.total / semiAnnualTarget) * 100).toFixed(2)
                            : "N/A";

                        return (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-2 py-1">
                              {item.municipality}
                            </td>
                            <td className="py-2 px-4 border-b">
                              {semiAnnualTarget}
                            </td>
                            <td className="border border-gray-300 px-2 py-1">
                              {item.previousMonth}
                            </td>
                            <td className="border border-gray-300 px-2 py-1">
                              {item.presentMonth}
                            </td>
                            <td className="border border-gray-300 px-2 py-1">
                              {item.total}
                            </td>
                            <td className="border border-gray-300 px-2 py-1">
                              {percentage}
                            </td>{" "}
                            {/* Percentage */}
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center py-4">
                          No data available
                        </td>
                      </tr>
                    )}
                  </tbody>

                  <tfoot className="bg-[#ffe356] font-semibold text-[#1b5b40] sticky bottom-0">
                    <tr className="font-semibold">
                      <td className="border border-gray-300 px-2 py-1">
                        Grand Total
                      </td>
                      <td className="border border-gray-300 px-2 py-1"></td>
                      <td className="border border-gray-300 px-2 py-1">
                        {calculateGrandTotal("previousMonth")}
                      </td>
                      <td className="border border-gray-300 px-2 py-1">
                        {calculateGrandTotal("presentMonth")}
                      </td>
                      <td className="border border-gray-300 px-2 py-1">
                        {calculateGrandTotal("total")}
                      </td>
                      <td className="border border-gray-300 px-2 py-1"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={handlePrint}
          className="bg-[#1b5b40] text-white font-semibold py-2 px-4 rounded hover:bg-[#123c29] transition mt-5"
        >
          Print Report
        </button>
      </div>
    </>
  );
};

export default MunicipalityAccomplishmentReportVaccination;
