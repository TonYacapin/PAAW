import React from 'react';

const PrintableMunicipalityAccomplishmentReportVaccination = ({ 
  reportData, 
  selectedYear, 
  selectedMonth, 
  selectedSpecies, 
  semiAnnualTargets,
  submittedBy
}) => {
  // Function to calculate the grand total for Previous Month, Present Month, and Total
  const calculateGrandTotal = (type) => {
    return reportData.reduce((acc, item) => acc + (item[type] || 0), 0);
  };

  // Function to get the table title based on selected species
  const getTableTitle = () => {
    switch (selectedSpecies) {
      case 'Carabao':
        return 'HEMOSEP - CARABAO';
      case 'Cattle':
        return 'HEMOSEP - CATTLE';
      case 'Goat/Sheep':
        return 'HEMOSEP - GOAT/SHEEP';
      case 'Poultry':
        return 'NCD - POULTRY';
      case 'Swine':
        return 'HOG CHOLERA';
      default:
        return 'Vaccination Report';
    }
  };

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
            .no-print {
              display: none;
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

      <div className="text-center mb-4">
        <h1 className="text-xl font-bold mb-2">Municipality Vaccination Accomplishment Report</h1>
        <div className="mb-2">
          <p><strong>Year:</strong> {selectedYear}</p>
          <p><strong>Month:</strong> {new Date(selectedYear, selectedMonth - 1).toLocaleString('default', { month: 'long' })}</p>
          <p><strong>Species:</strong> {selectedSpecies}</p>
        </div>
        <h2 className="text-lg font-semibold mb-2">{getTableTitle()}</h2>
      </div>

      <table className="w-full border-collapse border border-gray-300 mb-6">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-2 py-1" style={{ width: '25%' }}>Municipality</th>
            <th className="border border-gray-300 px-2 py-1" style={{ width: '20%' }}>Semi Annual Target</th>
            <th className="border border-gray-300 px-2 py-1" style={{ width: '15%' }}>Previous Month</th>
            <th className="border border-gray-300 px-2 py-1" style={{ width: '15%' }}>Present Month</th>
            <th className="border border-gray-300 px-2 py-1" style={{ width: '15%' }}>Total</th>
            <th className="border border-gray-300 px-2 py-1" style={{ width: '10%' }}>%</th>
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
        <tfoot>
          <tr className="font-semibold bg-gray-100">
            <td className="border border-gray-300 px-2 py-1">Grand Total</td>
            <td className="border border-gray-300 px-2 py-1"></td>
            <td className="border border-gray-300 px-2 py-1">{calculateGrandTotal('previousMonth')}</td>
            <td className="border border-gray-300 px-2 py-1">{calculateGrandTotal('presentMonth')}</td>
            <td className="border border-gray-300 px-2 py-1">{calculateGrandTotal('total')}</td>
            <td className="border border-gray-300 px-2 py-1"></td>
          </tr>
        </tfoot>
      </table>

      <div className="mt-4">
        <p><strong>Submitted by:</strong> {submittedBy || '______________________'}</p>
      </div>
    </div>
  );
};

export default PrintableMunicipalityAccomplishmentReportVaccination;
