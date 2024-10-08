// MunicipalityAccomplishmentReportRoutineServices.js
import React, { useEffect, useState } from "react";
import axios from "axios";

const MunicipalityAccomplishmentReportRoutineServices = () => {
  const [reportData, setReportData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedSpecies, setSelectedSpecies] = useState("Swine"); // Default to 'Swine'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [semiAnnualTargets, setSemiAnnualTargets] = useState([]); // State to store semi-annual targets

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

  const fetchData = async (year, month, species) => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/routine-services/species-count`,
        {
          params: { year, month, species },
        }
      );
      console.log(response.data);

      const { currentMonth, previousMonth, total } = response.data[0];

      const aggregatedData = municipalitiesList.reduce((acc, municipality) => {
        acc[municipality] = {
          municipality,
          previousMonth: 0,
          presentMonth: 0,
          total: 0,
        };
        return acc;
      }, {});

      const aggregateCounts = (dataArray, monthType) => {
        dataArray.forEach((item) => {
          const { municipality, count } = item;
          if (aggregatedData[municipality] && count) {
            aggregatedData[municipality][monthType] += count;
          }
        });
      };

      aggregateCounts(currentMonth, "presentMonth");
      aggregateCounts(previousMonth, "previousMonth");
      aggregateCounts(total, "total");



      setReportData(Object.values(aggregatedData));
    } catch (error) {
      setError("Failed to fetch data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
    // Fetch the semi-annual targets
    const fetchSemiAnnualTargets = async () => {
      try {
          const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/mtargets`, {
              params: { targetYear: selectedYear, type: getTypeBySpecies(selectedSpecies) }
          });
          const targets = response.data;
          const targetsMap = {};

          // Map the semi-annual target data by municipality
          targets.forEach(target => {
              targetsMap[target.municipality] = target.semiAnnualTarget;
          });

          setSemiAnnualTargets(targetsMap);
      } catch (error) {
          console.error('Error fetching semi-annual targets:', error);
      }
  };

  // Get species type for filtering targets (e.g., "HEMOSEP-CARABAO" for Carabao)
  const getTypeBySpecies = (species) => {
      switch (species) {
          case 'Swine':
              return 'SWINE';
          case 'Poultry':
              return 'POULTRY';
          case 'Dog':
              return 'DOG';
          case 'Others':
              return 'OTHERS';
          default:
              return '';
      }
  };


  useEffect(() => {
    fetchSemiAnnualTargets();
    fetchData(selectedYear, selectedMonth, selectedSpecies);
  }, [selectedYear, selectedMonth, selectedSpecies]);

  const getTableTitle = () => {
    switch (selectedSpecies) {
      case "Swine":
        return "Routine Services - SWINE";
      case "Poultry":
        return "Routine Services - Poultry";
      case "Others":
        return "Routine Services - Others";
      case "Dog":
        return "Routine Services - DOG";
      default:
        return "Routine Services Report";
    }
  };

  const calculateTotals = () => {
    return reportData.reduce(
      (totals, item) => {
        totals.previousMonth += item.previousMonth;
        totals.presentMonth += item.presentMonth;
        totals.total += item.total;
        return totals;
      },
      { previousMonth: 0, presentMonth: 0, total: 0 }
    );
  };

  const totals = calculateTotals();

  return (
    <>
    <div className="max-h-[55vh] overflow-y-auto">
    <h1 className="text-xl font-semibold text-gray-700">
        Municipality Routine Services Accomplishment Report
      </h1>

      <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <form className="mb-6 bg-gray-100 p-6 rounded-md shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label
                htmlFor="year"
                className="block text-sm font-medium text-gray-700"
              >
                Year
              </label>
              <input
                type="number"
                id="year"
                value={selectedYear}
                min="2000" // Assuming a reasonable minimum year
                onChange={(e) => setSelectedYear(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="month"
                className="block text-sm font-medium text-gray-700"
              >
                Month
              </label>
              <select
                id="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
            <div>
              <label
                htmlFor="species"
                className="block text-sm font-medium text-gray-700"
              >
                Species
              </label>
              <select
                id="species"
                value={selectedSpecies}
                onChange={(e) => setSelectedSpecies(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Swine">Swine</option>
                <option value="Poultry">Poultry</option>
                <option value="Dog">Dog</option>
                <option value="Others">Others</option>
              </select>
            </div>
          </div>
        </form>

        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div>
            <span className="ml-2 text-gray-700">Loading...</span>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <h2 className="text-lg font-semibold mb-4">{getTableTitle()}</h2>
            <div className="overflow-x-auto max-h-64">
              <table className="min-w-full bg-white border border-[#1b5b40] rounded-lg shadow-lg">
                <thead className="sticky top-0 bg-[#1b5b40] text-white">
                  <tr>
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
                                                const semiAnnualTarget = semiAnnualTargets[item.municipality] || 0;
                                                const percentage = semiAnnualTarget > 0 ? ((item.total / semiAnnualTarget) * 100).toFixed(2) : 'N/A';

                                                return (
                                                    <tr key={index} className="hover:bg-gray-50">
                                                        <td className="border border-gray-300 px-2 py-1">{item.municipality}</td>
                                                        <td className="py-2 px-4 border-b">{semiAnnualTarget}</td>
                                                        <td className="border border-gray-300 px-2 py-1">{item.previousMonth}</td>
                                                        <td className="border border-gray-300 px-2 py-1">{item.presentMonth}</td>
                                                        <td className="border border-gray-300 px-2 py-1">{item.total}</td>
                                                        <td className="border border-gray-300 px-2 py-1">{percentage}</td> {/* Percentage */}
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="text-center py-4">No data available</td>
                                            </tr>
                                        )}
                                    </tbody>

                <tfoot className="bg-[#ffe356] font-bold text-[#1b5b40] sticky bottom-0">
                  <tr>
                    <td className="border border-gray-300 px-2 py-1">
                      Grand Total
                    </td>
                    <td className="border border-gray-300 px-2 py-1"></td>
                    <td className="border border-gray-300 px-2 py-1">
                      {totals.previousMonth}
                    </td>
                    <td className="border border-gray-300 px-2 py-1">
                      {totals.presentMonth}
                    </td>
                    <td className="border border-gray-300 px-2 py-1">
                      {totals.total}
                    </td>
                    <td className="border border-gray-300 px-2 py-1"></td>{" "}
                    {/* Percentage (blank for now) */}
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>

    </>
  );
};

export default MunicipalityAccomplishmentReportRoutineServices;
