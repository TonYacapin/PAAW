import React from "react";
import { format } from "date-fns";
import placeholder1 from '../../pages/assets/NVLOGO.png'; // Left Logo
import placeholder2 from '../../pages/assets/ReportLogo2.png'; // Right Logo

const PrintableRabiesVaccinationReport = ({
  selectedYear,
  selectedMonth,
  immunizationData,
  targets,
  quarterlyPercentage,
  semiAnnualPercentage,
  userFullName,
}) => {
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="print-container">
      <style>
        {`
        @media print {
          @page {
            size: legal landscape; /* Set page size to landscape */
            margin: 5mm; /* Further reduced margin for more space */
          }
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 5mm; /* Further reduce padding */
            background-color: #fff;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .header {
            text-align: center;
            margin-bottom: 5mm; /* Reduce margin */
          }
          .header img {
            width: 40px; /* Reduced image size */
            height: auto;
            margin: 0 5px;
          }
          .header .title {
            font-size: 12px; /* Main title font size */
            font-weight: bold;
            margin: 3px 0;
          }
          .header .subtitle {
            font-size: 10px; /* Subtitle font size */
            font-weight: normal; /* Normal weight for subtitles */
            margin: 2px 0;
          }
          .header .text {
            font-size: 8px; /* Uniform body text font size */
            margin: 2px 0;
          }
          table {
            border-collapse: collapse;
            width: 100%; /* Use full width */
            margin: 10px auto; /* Reduce margin */
            page-break-inside: avoid; /* Prevent page breaks inside table */
            overflow-x: auto; /* Allow horizontal scrolling */
          }
          th, td {
            border: 1px solid black;
            padding: 2px; /* Reduced padding */
            text-align: left;
            font-size: 8px; /* Uniform table text font size */
          }
          th {
            background-color: #f2f2f2 !important;
            font-weight: bold;
          }
          .footer {
            margin-top: 15px; /* Reduce margin */
            width: 100%;
          }
          .signature-line {
            border-top: 1px solid black;
            width: 20%;
            text-align: center;
            margin-top: 20px; /* Reduced margin */
          }
        }
      `}
      </style>

      <div className="header">
        <div className="logo-container">
          <img src={placeholder1} alt="Left Logo" />
          <img src={placeholder2} alt="Right Logo" />
        </div>
        <div className="text-center mt-2">
          <p className="text">Republic of the Philippines</p>
          <h1 className="title">PROVINCE OF NUEVA VIZCAYA</h1>
          <h2 className="subtitle">PROVINCIAL VETERINARY SERVICES OFFICE</h2>
          <p className="text">3rd floor Agriculture Bldg, Capitol Compound, District IV, Bayombong, Nueva Vizcaya</p>
        </div>
        <div className="text-center mb-4">
          <h1 className="title">Rabies Vaccination Report</h1>
          <div className="mb-4 text-center">
            <p className="text"><strong>Year:</strong> {selectedYear}</p>
            <p className="text"><strong>Month:</strong> {monthNames[selectedMonth - 1]}</p>
          </div>
        </div>
        <div className="mb-4">
          <p className="text"><strong>Quarterly Target:</strong> {targets.quarterly}</p>
          <p className="text"><strong>Quarterly Accomplishment:</strong> {quarterlyPercentage}%</p>
          <p className="text"><strong>Semi-annual Target:</strong> {targets.semiAnnual}</p>
          <p className="text"><strong>Semi-annual Accomplishment:</strong> {semiAnnualPercentage}%</p>
        </div>
      </div>

      <table className="w-full border-collapse mb-4 shadow-lg">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-2 py-1">Activity</th>
            <th className="border border-gray-300 px-2 py-1">Species</th>
            <th className="border border-gray-300 px-2 py-1">Previous Month</th>
            <th className="border border-gray-300 px-2 py-1">This Month</th>
            <th className="border border-gray-300 px-2 py-1">Combined</th>
            <th className="border border-gray-300 px-2 py-1">Total Accomplishment</th>
          </tr>
        </thead>
        <tbody>
          <tr className="font-semibold bg-gray-100">
            <td className="border border-gray-300 px-2 py-1">No. of Dogs immunized against Rabies and Registered</td>
            <td className="border border-gray-300 px-2 py-1">Dogs</td>
            <td className="border border-gray-300 px-2 py-1">{immunizationData.previousMonthCount}</td>
            <td className="border border-gray-300 px-2 py-1">{immunizationData.thisMonthCount}</td>
            <td className="border border-gray-300 px-2 py-1">{immunizationData.previousMonthCount + immunizationData.thisMonthCount}</td>
            <td className="border border-gray-300 px-2 py-1">{immunizationData.totalCount}</td>
          </tr>
        </tbody>
      </table>



      {/* Footer Section */}
      <div className="footer">
        <div className="signature-section">
          <div className="signature-line" style={{ fontSize: "10px", marginTop: "5px", textAlign: "left" }}>
            <span><strong>Prepared by:</strong></span>
            <br />
            <span>{userFullName}</span>
          </div>
        </div>
      </div>



    </div >


  );
};

export default PrintableRabiesVaccinationReport;
