import React from 'react';
import placeholder1 from '../../pages/assets/NVLOGO.png'; // Left Logo
import placeholder2 from '../../pages/assets/ReportLogo2.png'; // Right Logo

const PrintableMunicipalityAccomplishmentReportRabies = ({ reportData, year, month, semiAnnualTargets, userFullName }) => {
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const calculateGrandTotals = () => {
    return reportData.reduce((totals, item) => {
      totals.currentMonth += item.currentMonth;
      totals.previousMonth += item.previousMonth;
      totals.total += item.total;
      return totals;
    }, { currentMonth: 0, previousMonth: 0, total: 0 });
  };

  const grandTotals = calculateGrandTotals();

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
            font-size: 12px; /* Increased font size for titles */
            font-weight: bold;
            margin: 3px 0;
          }
          .header .subtitle {
            font-size: 10px; /* Increased font size for subtitles */
            font-weight: normal; /* Normal weight for better readability */
            margin: 2px 0;
          }
          .header .text {
            font-size: 8px; /* Consistent font size for body text */
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
          .signature {
            margin-top: 15px; /* Reduce margin */
            border-top: 1px solid black;
            width: 150px; /* Reduced signature width */
            margin: 0 auto;
            text-align: center;
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
          <h1 className="title">Municipality Rabies Vaccination Accomplishment Report</h1>
          <div className="mb-4 text-center">
            <p className="text"><strong>Year:</strong> {year}</p>
            <p className="text"><strong>Month:</strong> {monthNames[month - 1]}</p>
          </div>
        </div>
      </div>



      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-2 py-1">Municipality</th>
            <th className="border border-gray-300 px-2 py-1">Semi Annual Target</th>
            <th className="border border-gray-300 px-2 py-1">Previous Month</th>
            <th className="border border-gray-300 px-2 py-1">Current Month</th>
            <th className="border border-gray-300 px-2 py-1">Total</th>
            <th className="border border-gray-300 px-2 py-1">%</th>
          </tr>
        </thead>
        <tbody>
          {reportData.map((item, index) => {
            const semiAnnualTarget = semiAnnualTargets[item.municipality] || 0;
            const percentage = semiAnnualTarget > 0 ? ((item.total / semiAnnualTarget) * 100).toFixed(2) : 'N/A';

            return (
              <tr key={index} className="odd:bg-white even:bg-gray-50">
                <td className="border border-gray-300 px-2 py-1">{item.municipality}</td>
                <td className="border border-gray-300 px-2 py-1">{semiAnnualTarget}</td>
                <td className="border border-gray-300 px-2 py-1">{item.previousMonth}</td>
                <td className="border border-gray-300 px-2 py-1">{item.currentMonth}</td>
                <td className="border border-gray-300 px-2 py-1">{item.total}</td>
                <td className="border border-gray-300 px-2 py-1">{percentage}</td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="font-semibold bg-gray-100">
            <td className="border border-gray-300 px-2 py-1">Grand Total</td>
            <td className="border border-gray-300 px-2 py-1"></td>
            <td className="border border-gray-300 px-2 py-1">{grandTotals.previousMonth}</td>
            <td className="border border-gray-300 px-2 py-1">{grandTotals.currentMonth}</td>
            <td className="border border-gray-300 px-2 py-1">{grandTotals.total}</td>
            <td className="border border-gray-300 px-2 py-1"></td>
          </tr>
        </tfoot>
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

    </div>
  );
};

export default PrintableMunicipalityAccomplishmentReportRabies;
