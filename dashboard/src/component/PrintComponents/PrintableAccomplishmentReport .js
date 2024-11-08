import React from 'react';
import { format } from 'date-fns';
import placeholder1 from '../../pages/assets/NVLOGO.png';
import placeholder2 from '../../pages/assets/ReportLogo2.png';

const PrintableAccomplishmentReport = ({
  selectedYear,
  selectedMonth,
  selectedVaccine,
  groupedByVaccine,
  totals,
  targets,
  quarterlyPercentage,
  semiAnnualPercentage
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
            width: 45%;
            text-align: center;
            margin-top: 20px; /* Reduced margin */
          }
        }
      `}
      </style>

      <div className="header">
        <div className="flex flex-row justify-center ">
          <img src={placeholder1} alt="Left Logo" className='w-[70px] h-[70px]' />
          <div className="text-center mt-2">
            <p className="text">Republic of the Philippines</p>
            <h1 className="title">PROVINCE OF NUEVA VIZCAYA</h1>
            <h2 className="subtitle">PROVINCIAL VETERINARY SERVICES OFFICE</h2>
            <p className="text">3rd floor Agriculture Bldg, Capitol Compound, District IV, Bayombong, Nueva Vizcaya</p>
          </div>
          <div className="text-center mb-4">
            <h1 className="title">VACCINATION ACCOMPLISHMENT REPORT</h1>
            <h2 className="subtitle">{format(new Date(selectedYear, selectedMonth - 1), 'MMMM yyyy')}</h2>
            <p className="text">Vaccine: {selectedVaccine}</p>

            <div>
              <p className="text"><strong>Quarterly Target:</strong> {selectedVaccine === 'All' ? targets.totalTarget : targets[selectedVaccine]?.quarterly}</p>
              <p className="text"><strong>Quarterly Accomplishment:</strong> {quarterlyPercentage}</p>
            </div>
            <div>
              <p className="text"><strong>Semi-annual Target:</strong> {selectedVaccine === 'All' ? targets.totalSemiAnnualTarget : targets[selectedVaccine]?.semiAnnual}</p>
              <p className="text"><strong>Semi-annual Accomplishment:</strong> {semiAnnualPercentage}</p>
            </div>

          </div>
          <img src={placeholder2} alt="Right Logo" className='w-[70px] h-[70px]'/>
        </div>
      </div>





      <table>
        <thead>
          <tr>
            <th>Vaccine Type</th>
            <th>Species</th>
            <th>Previous Month</th>
            <th>This Month</th>
            <th>Combined</th>
            <th>Total Accomplishment</th>
          </tr>
        </thead>
        <tbody>
          {groupedByVaccine.map(({ vaccineType, speciesUnderVaccine }) => (
            <React.Fragment key={vaccineType}>
              <tr>
                <td colSpan="6" className="font-bold">{vaccineType}</td>
              </tr>
              {speciesUnderVaccine.map((speciesData) => (
                <tr key={speciesData.species}>
                  <td></td>
                  <td>{speciesData.species} (hds)</td>
                  <td>{speciesData.previousMonth}</td>
                  <td>{speciesData.thisMonth}</td>
                  <td>{speciesData.combined}</td>
                  <td>{speciesData.total}</td>
                </tr>
              ))}
            </React.Fragment>
          ))}
          <tr className="font-bold bg-gray-100">
            <td colSpan="2">Total</td>
            <td>{totals.previousMonth}</td>
            <td>{totals.thisMonth}</td>
            <td>{totals.combined}</td>
            <td>{totals.total}</td>
          </tr>
        </tbody>
      </table>


    </div>
  );
};

export default PrintableAccomplishmentReport;
