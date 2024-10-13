import React from 'react';

const PrintableMunicipalityAccomplishmentReportRabies = ({ reportData, year, month, semiAnnualTargets }) => {
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
    <div className="p-4 bg-white rounded-lg shadow-lg print-container">
      <style>
        {`
          @media print {
            @page {
              size: landscape; /* Set page size to landscape */
              margin: 5mm; /* Reduced margin for more space */
            }
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            th {
              background-color: #e5e7eb !important; /* Light gray for header */
              color: black !important; /* Black text for header */
            }
            table {
              border: 1px solid #000 !important;
              width: 100%;
              max-width: 100%;
              table-layout: fixed; /* Fixed layout for equal column width */
              page-break-inside: auto;
            }
            td, th {
              border: 1px solid #000 !important;
              padding: 4px; /* Reduced padding */
              text-align: left;
              font-size: 10px; /* Smaller font size */
            }
            .signature-section {
              margin-top: 20px;
              display: flex;
              justify-content: space-between;
            }
            .signature-line {
              border-top: 1px solid #000;
              width: 45%;
              text-align: center;
              margin-top: 10px; /* Reduced margin */
            }
          }
        `}
      </style>

      <h1 className="text-2xl font-bold mb-4 text-center">Municipality Rabies Vaccination Accomplishment Report</h1>
      <div className="mb-4 text-center">
        <p><strong>Year:</strong> {year}</p>
        <p><strong>Month:</strong> {monthNames[month - 1]}</p>
      </div>
      <h2 className="text-xl font-semibold mb-2 text-center">Rabies</h2>
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

      <div className="mt-4 text-right">
        <p><strong>Submitted by:</strong> ________________________</p>
      </div>
    </div>
  );
};

export default PrintableMunicipalityAccomplishmentReportRabies;
