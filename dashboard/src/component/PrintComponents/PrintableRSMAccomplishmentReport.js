import React from 'react';
import { format } from 'date-fns';
import placeholder1 from '../../pages/assets/NVLOGO.png'; // Left Logo
import placeholder2 from '../../pages/assets/ReportLogo2.png'; // Right Logo

const PrintableRSMAccomplishmentReport = ({
  selectedYear,
  selectedMonth,
  selectedActivity,
  filteredActivityData,
  totals,
  targets,
  quarterlyPercentage,
  semiAnnualPercentage,
  userFullName,
}) => {
  return (
    <div className="print-container">
      <style>
        {`
        @media print {
          @page {
            size: legal landscape; /* Set to legal size with landscape orientation */
            margin: 5mm; /* Adjust margins as needed */
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
          .signature-section {
            margin-top: 30px;
            display: flex;
            justify-content: space-between;
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
          <h1 className="title">Routine Service Monitoring Accomplishment Report</h1>
          <h2 className="title">{format(new Date(selectedYear, selectedMonth - 1), 'MMMM yyyy')}</h2>
          <p className="text">Activity: {selectedActivity}</p>
        </div>
        <div className="mb-4">
          <p className="text"><strong>Quarterly Target:</strong> {selectedActivity === 'All' ? targets.totalTarget : targets[selectedActivity]?.quarterly}</p>
          <p className="text"><strong>Quarterly Accomplishment:</strong> {quarterlyPercentage}</p>
          <p className="text"><strong>Semi-annual Target:</strong> {selectedActivity === 'All' ? targets.totalSemiAnnualTarget : targets[selectedActivity]?.semiAnnual}</p>
          <p className="text"><strong>Semi-annual Accomplishment:</strong> {semiAnnualPercentage}</p>
        </div>

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
          {filteredActivityData.map((activityData) => (
            <React.Fragment key={activityData.activity}>
              <tr>
                <td colSpan="6" className="font-bold text-left border border-[#000]">{activityData.activity}</td>
              </tr>
              {activityData.speciesData.map((speciesData) => (
                <tr key={`${activityData.activity}-${speciesData.species}`}>
                  <td className="border border-[#000]"></td>
                  <td className="border border-[#000]">{speciesData.species}</td>
                  <td className="border border-[#000]">{speciesData.previousMonth}</td>
                  <td className="border border-[#000]">{speciesData.thisMonth}</td>
                  <td className="border border-[#000]">{speciesData.combined}</td>
                  <td className="border border-[#000]">{speciesData.total}</td>
                </tr>
              ))}
            </React.Fragment>
          ))}
          <tr className="font-bold bg-[#ffe356]">
            <td colSpan="2" className="border border-[#000]">Total</td>
            <td className="border border-[#000]">{totals.previousMonth}</td>
            <td className="border border-[#000]">{totals.thisMonth}</td>
            <td className="border border-[#000]">{totals.combined}</td>
            <td className="border border-[#000]">{totals.total}</td>
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




    </div>
  );
};

export default PrintableRSMAccomplishmentReport;
