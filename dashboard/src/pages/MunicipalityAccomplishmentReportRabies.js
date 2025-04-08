import React, { useEffect, useState } from "react";
import axiosInstance from "../component/axiosInstance";
import PrintableMunicipalityAccomplishmentReportRabies from "../component/PrintComponents/PrintableMunicipalityAccomplishmentReportRabies";
import { jwtDecode } from "jwt-decode";

const MunicipalityAccomplishmentReportRabies = () => {
  const [reportData, setReportData] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [semiAnnualTargets, setSemiAnnualTargets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userFullName, setUserFullName] = useState('');
  const municipalitiesList = [
    "Ambaguio",
    "Bagabag",
    "Bayombong",
    "Diadi",
    "Quezon",
    "Solano",
    "Villaverde",
    "Alfonso Castañeda",
    "Aritao",
    "Bambang",
    "Dupax del Norte",
    "Dupax del Sur",
    "Kayapa",
    "Kasibu",
    "Santa Fe",
  ];

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
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

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `/rabies-vaccination-summary?year=${year}&month=${month}`
      );
      const { currentMonth, previousMonth, total } = response.data;

      const aggregatedData = {};
      municipalitiesList.forEach((municipality) => {
        aggregatedData[municipality] = {
          municipality,
          currentMonth: 0,
          previousMonth: 0,
          total: 0,
        };
      });

      const aggregateCounts = (dataArray, monthType) => {
        dataArray.forEach((item) => {
          const { municipality, count } = item;
          if (aggregatedData[municipality]) {
            aggregatedData[municipality][monthType] += count;
          }
        });
      };

      aggregateCounts(currentMonth, "currentMonth");
      aggregateCounts(previousMonth, "previousMonth");
      aggregateCounts(total, "total");

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
        params: { targetYear: year, type: "RABIES" },
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

  useEffect(() => {
    fetchData();
    fetchSemiAnnualTargets();
  }, [year, month]);

  const calculateGrandTotals = () => {
    return reportData.reduce(
      (totals, item) => {
        totals.currentMonth += item.currentMonth;
        totals.previousMonth += item.previousMonth;
        totals.total += item.total;
        return totals;
      },
      { currentMonth: 0, previousMonth: 0, total: 0 }
    );
  };

  const grandTotals = calculateGrandTotals();

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(
      "<html><head><title>Rabies Vaccination Report</title>"
    );
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
        <div id="printable-content" style={{ display: "none" }}>
          <PrintableMunicipalityAccomplishmentReportRabies
            reportData={reportData}
            year={year}
            month={month}
            semiAnnualTargets={semiAnnualTargets}
            userFullName={userFullName} 

          />
        </div>
        <h1 className="text-xl font-semibold text-gray-700">
          Municipality Rabies Vaccination Accomplishment Report
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
                value={year}
                onChange={(e) => setYear(e.target.value)}
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
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="border border-[#1b5b40] rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-[#ffe356] text-[#252525] bg-gray-100"
              >
                {monthNames.map((name, index) => (
                  <option key={index + 1} value={index + 1}>
                    {name}
                  </option>
                ))}
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
              <h2 className="text-lg font-semibold mb-4">Rabies</h2>
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
                        Current Month
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
                              {item.currentMonth}
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
                        {grandTotals.previousMonth}
                      </td>
                      <td className="border border-gray-300 px-2 py-1">
                        {grandTotals.currentMonth}
                      </td>
                      <td className="border border-gray-300 px-2 py-1">
                        {grandTotals.total}
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

export default MunicipalityAccomplishmentReportRabies;
