import React from "react";
import { format } from "date-fns";

const PrintableRabiesVaccinationReport = ({
  selectedYear,
  selectedMonth,
  immunizationData,
  targets,
  quarterlyPercentage,
  semiAnnualPercentage,
}) => {
  return (
    <div className="print-container p-4">
      <style>
        {`
          @media print {
            @page {
              size: legal landscape; /* Set to legal size with landscape orientation */
              margin: 10mm; /* Adjust margins as needed */
            }
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .no-print {
              display: none;
            }
            th {
              background-color: #1b5b40 !important; /* Dark green for header */
              color: white !important; /* White text for header */
            }
            table {
              border: 1px solid #000 !important; /* Table border */
              width: 100%; /* Ensure table takes full width */
              max-width: 100%; /* Prevent overflow */
              page-break-inside: auto; /* Prevent page breaks inside the table */
              table-layout: fixed; /* Allow equal distribution of column widths */
            }
            td, th {
              border: 1px solid #000 !important; /* Cell border */
              padding: 5px; /* Adjusted padding for smaller size */
              overflow: hidden; /* Hide overflow text */
              text-overflow: ellipsis; /* Ellipsis for overflow text */
              white-space: nowrap; /* Prevent line breaks within cells */
            }
            h1, h2, h3, p {
              margin: 0;
              padding: 0;
            }
            .signature-section {
              margin-top: 30px;
              display: flex;
              justify-content: space-between;
            }
            .signature-line {
              border-top: 1px solid #000;
              width: 45%;
              text-align: center;
              margin-top: 20px; /* Reduced margin */
            }
          }
        `}
      </style>

      <div className="text-center mb-4">

        <h2 className="text-lg mb-1">{format(new Date(selectedYear, selectedMonth - 1), 'MMMM yyyy')}</h2>
      </div>

      <table className="min-w-full border-collapse mb-4 shadow-lg">
        <thead>
          <tr>
            <th className="py-2 px-2 text-left border border-[#000]">Activity</th>
            <th className="py-2 px-2 text-left border border-[#000]">Species</th>
            <th className="py-2 px-2 text-left border border-[#000]">Previous Month</th>
            <th className="py-2 px-2 text-left border border-[#000]">This Month</th>
            <th className="py-2 px-2 text-left border border-[#000]">Combined</th>
            <th className="py-2 px-2 text-left border border-[#000]">Total Accomplishment</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-[#000]">No. of Dogs immunized against Rabies and Registered</td>
            <td className="border border-[#000]">Dogs</td>
            <td className="border border-[#000]">{immunizationData.previousMonthCount}</td>
            <td className="border border-[#000]">{immunizationData.thisMonthCount}</td>
            <td className="border border-[#000]">{immunizationData.previousMonthCount + immunizationData.thisMonthCount}</td>
            <td className="border border-[#000]">{immunizationData.totalCount}</td>
          </tr>
        </tbody>
      </table>

      <div className="mb-4">
        <p><strong>Quarterly Target:</strong> {targets.quarterly}</p>
        <p><strong>Quarterly Accomplishment:</strong> {quarterlyPercentage}%</p>
        <p><strong>Semi-annual Target:</strong> {targets.semiAnnual}</p>
        <p><strong>Semi-annual Accomplishment:</strong> {semiAnnualPercentage}%</p>
      </div>

      <div className="signature-section">
        <div className="signature-line">Submitted by</div>
      </div>
    </div>
  );
};

export default PrintableRabiesVaccinationReport;
