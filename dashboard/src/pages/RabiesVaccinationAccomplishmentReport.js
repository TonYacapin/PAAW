import React, { useEffect, useState } from "react";

import { format } from "date-fns";
import PrintableRabiesVaccinationReport from "../component/PrintComponents/PrintableRabiesVaccinationReport";
import axiosInstance from "../component/axiosInstance";


import { jwtDecode } from "jwt-decode";

function RabiesVaccinationAccomplishmentReport() {
  const [immunizationData, setImmunizationData] = useState({
    previousMonthCount: 0,
    thisMonthCount: 0,
    totalCount: 0,
  });
  const [targets, setTargets] = useState({
    quarterly: 0,
    semiAnnual: 0,
  });
  const [quarterlyPercentage, setQuarterlyPercentage] = useState(null);
  const [semiAnnualPercentage, setSemiAnnualPercentage] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // 1-12
  const [userFullName, setUserFullName] = useState('');


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


  useEffect(() => {
    fetchData();
  }, [selectedYear, selectedMonth]);

  const fetchData = async () => {
    try {
      const [immunizationResponse, targetsResponse] = await Promise.all([
        axiosInstance.get(
          `/rabies-report/entry-count?year=${selectedYear}&month=${selectedMonth}`
        ),
        axiosInstance.get(
          `/api/targets/accomplishment?year=${selectedYear}&reportType=RabiesVaccination`
        ),
      ]);

      setImmunizationData(immunizationResponse.data);
      processTargets(targetsResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const processTargets = (targetsData) => {
    if (
      !targetsData ||
      !targetsData.targets ||
      !Array.isArray(targetsData.targets)
    ) {
      console.error("Invalid targets data format:", targetsData);
      return;
    }

    const rabiesTarget = targetsData.targets.find(
      (target) =>
        target.Type === "No. of dogs immunized against rabies and registered"
    );
    if (rabiesTarget) {
      setTargets({
        quarterly: rabiesTarget.target,
        semiAnnual: rabiesTarget.semiAnnualTarget,
      });
    }
  };

  useEffect(() => {
    calculatePercentages();
  }, [immunizationData, targets]);

  const calculatePercentages = () => {
    const combined =
      immunizationData.previousMonthCount + immunizationData.thisMonthCount;
    if (targets.quarterly > 0) {
      setQuarterlyPercentage(((combined / targets.quarterly) * 100).toFixed(2));
    } else {
      setQuarterlyPercentage(null);
    }

    if (targets.semiAnnual > 0) {
      setSemiAnnualPercentage(
        ((immunizationData.totalCount / targets.semiAnnual) * 100).toFixed(2)
      );
    } else {
      setSemiAnnualPercentage(null);
    }
  };

  const handleYearChange = (e) => {
    setSelectedYear(Number(e.target.value));
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(Number(e.target.value));
  };

  const handlePrint = () => {
    const printContent = document.getElementById("printable-content");
    const printWindow = window.open("", "_blank");

    printWindow.document.write(`
      <html>
        <head>
      
          <style>
            @media print {
              /* Add your print styles here if necessary */
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);

    printWindow.document.close(); // Close the document for writing

    // Wait for the content to load before calling print
    printWindow.onload = () => {
      printWindow.print();
      printWindow.close(); // Close the window after printing
    };
  };


  return (
    <div className="p-6 bg-[#FFFAFA]">
      {/* Button to trigger print */}
      {/* Hidden content for printing */}
      <div id="printable-content" style={{ display: "none" }}>
        <PrintableRabiesVaccinationReport
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          immunizationData={immunizationData}
          targets={targets}
          quarterlyPercentage={quarterlyPercentage}
          semiAnnualPercentage={semiAnnualPercentage}
          userFullName={userFullName}
        />
      </div>

      <h1 className="text-xl font-semibold text-gray-700 mb-5">
        Rabies Vaccination Accomplishment Report
      </h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="flex flex-col">
          <h2 className="text-md font-semibold text-gray-700 mb-2">
            Select Year
          </h2>
          <select
            value={selectedYear}
            onChange={handleYearChange}
            className="border border-[#1b5b40] rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-[#ffe356] text-[#252525]"
          >
            {[...Array(10)].map((_, i) => {
              const year = new Date().getFullYear() - i;
              return (
                <option key={year} value={year}>
                  {year}
                </option>
              );
            })}
          </select>
        </div>

        <div className="flex flex-col">
          <h2 className="text-md font-semibold text-gray-700 mb-2">
            Select Month
          </h2>
          <select
            value={selectedMonth}
            onChange={handleMonthChange}
            className="border border-[#1b5b40] rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-[#ffe356] text-[#252525]"
          >
            {[...Array(12)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {format(new Date(2000, i, 1), "MMMM")}
              </option>
            ))}
          </select>
        </div>

        {/* Targets and percentage display */}
        <div className="flex flex-col">
          <h2 className="text-md font-semibold text-gray-700 mb-2">
            Quarterly Target
          </h2>
          <input
            type="number"
            value={targets.quarterly}
            disabled
            className="border border-[#1b5b40] rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-[#ffe356] text-[#252525] bg-gray-100"
          />
        </div>

        <div className="flex flex-col">
          <h2 className="text-md font-semibold text-gray-700 mb-2">
            Semi-annual Target
          </h2>
          <input
            type="number"
            value={targets.semiAnnual}
            disabled
            className="border border-[#1b5b40] rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-[#ffe356] text-[#252525] bg-gray-100"
          />
        </div>

        <div className="flex flex-col">
          {semiAnnualPercentage !== null && (
            <p className="text-md font-semibold text-gray-700 mb-2">
              Semi Annual Percentage: {semiAnnualPercentage}%
            </p>
          )}
          {quarterlyPercentage !== null && (
            <p className="text-md font-semibold text-gray-700 mb-2">
              Percentage: {quarterlyPercentage}%
            </p>
          )}
        </div>
      </div>

      <div className="mt-8">
        {/* Table for displaying immunization data */}
        <table className="min-w-full bg-white border border-[#1b5b40] rounded-lg overflow-hidden shadow-lg">
          <thead>
            <tr className="bg-[#1b5b40] text-white">
              <th className="py-2 px-2 text-left border border-[#000]">
                Activity
              </th>
              <th className="py-2 px-2 text-left border border-[#000]">
                Previous Month
              </th>
              <th className="py-2 px-2 text-left border border-[#000]">
                This Month
              </th>
              <th className="py-2 px-2 text-left border border-[#000]">
                Combined
              </th>
              <th className="py-2 px-2 text-left border border-[#000]">
                Total Accomplishment
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-[#000]">
                No. of Dogs immunized against Rabies and Registered
              </td>
              <td className="border border-[#000]">
                {immunizationData.previousMonthCount}
              </td>
              <td className="border border-[#000]">
                {immunizationData.thisMonthCount}
              </td>
              <td className="border border-[#000]">
                {immunizationData.previousMonthCount +
                  immunizationData.thisMonthCount}
              </td>
              <td className="border border-[#000]">
                {immunizationData.totalCount}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-5">
        <button
          onClick={handlePrint}
          className="bg-[#1b5b40] text-white font-semibold py-2 px-4 rounded hover:bg-[#123c29] transition"
        >
          Print Report
        </button>
      </div>
    </div>
  );
}

export default RabiesVaccinationAccomplishmentReport;
