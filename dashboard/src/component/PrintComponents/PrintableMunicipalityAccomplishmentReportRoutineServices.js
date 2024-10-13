import React from 'react';

const PrintableMunicipalityAccomplishmentReportRoutineServices = ({ 
  reportData, 
  selectedYear, 
  selectedMonth, 
  selectedSpecies, 
  semiAnnualTargets 
}) => {
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

      <h1 className="text-2xl font-bold mb-4 text-center">
        Municipality Routine Services Accomplishment Report
      </h1>
      <div className="mb-4 text-center">
        <p><strong>Year:</strong> {selectedYear}</p>
        <p><strong>Month:</strong> {new Date(selectedYear, selectedMonth - 1).toLocaleString('default', { month: 'long' })}</p>
        <p><strong>Species:</strong> {selectedSpecies}</p>
      </div>
      <h2 className="text-xl font-semibold mb-2 text-center">{getTableTitle()}</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="border border-gray-300 px-2 py-1">Municipality</th>
            <th className="border border-gray-300 px-2 py-1">Semi Annual Target</th>
            <th className="border border-gray-300 px-2 py-1">Previous Month</th>
            <th className="border border-gray-300 px-2 py-1">Present Month</th>
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
                <td className="border border-gray-300 px-2 py-1">{item.presentMonth}</td>
                <td className="border border-gray-300 px-2 py-1">{item.total}</td>
                <td className="border border-gray-300 px-2 py-1">{percentage}</td>
              </tr>
            );
          })}
        </tbody>
        <tfoot className="font-bold">
          <tr>
            <td className="border border-gray-300 px-2 py-1">Grand Total</td>
            <td className="border border-gray-300 px-2 py-1"></td>
            <td className="border border-gray-300 px-2 py-1">{totals.previousMonth}</td>
            <td className="border border-gray-300 px-2 py-1">{totals.presentMonth}</td>
            <td className="border border-gray-300 px-2 py-1">{totals.total}</td>
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

export default PrintableMunicipalityAccomplishmentReportRoutineServices;
