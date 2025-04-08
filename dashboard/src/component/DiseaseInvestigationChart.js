import React, { useState, useEffect } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import axiosInstance from '../component/axiosInstance';
import { Chart as ChartJS } from 'chart.js/auto';
import ChartGroup from './ChartGroup';

function DiseaseInvestigationChart({ filterValues }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedChart, setSelectedChart] = useState(null);
  const [analysis, setAnalysis] = useState("");
  const [finalDiagnoses, setFinalDiagnoses] = useState([]);
  const [diagnose, setDiagnose] = useState([]);

  useEffect(() => {
    async function fetchFinalDiagnoses() {
      try {
        const response = await axiosInstance.get('/final-diagnoses'); // Replace with your API endpoint
        setFinalDiagnoses(response.data); // Use `response.data` directly
      } catch (error) {
        console.error('Error fetching final diagnoses:', error);
        setError('Error fetching final diagnoses');
      }
    }

    fetchFinalDiagnoses();
  }, []);

  const handleDiagnosisChange = (e) => {
    setDiagnose(e.target.value); // Update `diagnose` directly
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(`/disease-investigation`, {
          params: {
            formStatus: 'Accepted',
            municipality: filterValues.municipality || undefined,
            startDate: filterValues.startDate || undefined,
            endDate: filterValues.endDate || undefined,
            finalDiagnosis: diagnose || undefined, // Include the diagnose state
          },
        });
        setData(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching data');
        setLoading(false);
      }
    };

    fetchData();
  }, [filterValues, diagnose]); // Re-fetch when `diagnose` changes

  useEffect(() => {
    if (data.length > 0) {
      const speciesDetails = data.flatMap(item =>
        item.details.map(detail => ({
          species: detail.species,
          population: parseInt(detail.population) || 0,
          cases: parseInt(detail.cases) || 0,
          deaths: parseInt(detail.deaths) || 0,
          destroyed: parseInt(detail.destroyed) || 0,
          slaughtered: parseInt(detail.slaughtered) || 0,
          vaccineHistory: detail.vaccineHistory || 'Unknown'
        }))
      );

      // Recalculate analysis
      const totalCases = speciesDetails.reduce((sum, item) => sum + item.cases, 0);
      const totalDeaths = speciesDetails.reduce((sum, item) => sum + item.deaths, 0);
      const mortalityRate = totalCases > 0 ? ((totalDeaths / totalCases) * 100).toFixed(2) : 0;

      const speciesCounts = speciesDetails.reduce((acc, item) => {
        acc[item.species] = (acc[item.species] || 0) + item.cases;
        return acc;
      }, {});

      const mostAffectedSpecies = Object.entries(speciesCounts).length > 0
        ? Object.entries(speciesCounts).sort(([, a], [, b]) => b - a)[0]
        : null;

      const vaccinated = speciesDetails.filter(item =>
        item.vaccineHistory && item.vaccineHistory.toLowerCase() === 'yes').length;

      const vaccinationRate = speciesDetails.length > 0
        ? ((vaccinated / speciesDetails.length) * 100).toFixed(2)
        : 0;

      // Generate analysis only if data exists
      if (totalCases > 0) {
        setAnalysis(
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl mx-auto space-y-6">
            <h2 className="text-xl font-semibold text-darkgreen">Analysis Summary</h2>

            <div className="space-y-4 text-black">
              <p className="text-lg">
                <strong className="font-semibold text-darkgreen">Total Cases:</strong> {totalCases} cases reported across all species.
              </p>
              <p className="text-lg">
                <strong className="font-semibold text-darkgreen">Mortality Rate:</strong> {mortalityRate}% ({totalDeaths} deaths out of {totalCases} cases).
              </p>
              {mostAffectedSpecies && (
                <p className="text-lg">
                  <strong className="font-semibold text-darkgreen">Most Affected Species:</strong> {mostAffectedSpecies[0]} with {mostAffectedSpecies[1]} cases.
                </p>
              )}
              <p className="text-lg">
                <strong className="font-semibold text-darkgreen">Vaccination Status:</strong> {vaccinationRate}% of affected animals had vaccination history.
              </p>
              <p className="text-lg">
                <strong className="font-semibold text-darkgreen">Control Measures:</strong> Total of {speciesDetails.reduce((sum, item) => sum + item.destroyed + item.slaughtered, 0)} animals were either destroyed or slaughtered as control measures.
              </p>
            </div>

            {/* Prescriptive Analysis */}
            <div className="space-y-4 bg-pastelyellow p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-darkgreen">Prescriptive Recommendations</h3>
              <ul className="list-disc pl-6 text-black space-y-2">
                <li>Increase vaccination efforts, especially for the most affected species ({mostAffectedSpecies ? mostAffectedSpecies[0] : 'N/A'}), to reduce future case rates.</li>
                <li>Consider implementing stronger quarantine and monitoring protocols for species with high mortality rates.</li>
                <li>Explore alternatives to animal destruction and slaughter where feasible, focusing on sterilization or other humane control methods.</li>
                <li>Invest in public awareness campaigns for controlling disease outbreaks in wildlife populations.</li>
              </ul>
            </div>

            {/* Predictive Analysis */}
            <div className="space-y-4 bg-darkgreen p-4 rounded-lg text-white">
              <h3 className="text-lg font-semibold">Predictive Trends</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>If the vaccination rate continues to increase at the current pace, we might see a {vaccinationRate}% reduction in cases within the next year, provided that the coverage reaches 80%.</li>
                <li>Assuming the current mortality rate holds steady, we may expect a further {mortalityRate}% increase in fatalities unless control measures (such as vaccinations or population management) are strengthened.</li>
                <li>If the trend of most affected species remains unchanged, further interventions are required to manage outbreaks more effectively within the next 3-6 months.</li>
              </ul>
            </div>
          </div>
        );
      } else {
        // Clear analysis if no cases
        setAnalysis(
          <div className="text-center text-gray-600 p-6">
            No data available for the selected diagnosis.
          </div>
        );
      }
    } else {
      // Clear analysis if no data
      setAnalysis(
        <div className="text-center text-gray-600 p-6">
          No data available for the selected diagnosis.
        </div>
      );
    }
  }, [data]);


  if (loading) return (
    <div className="flex items-center justify-center ">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  );
  if (error) return <div>{error}</div>;

  const speciesDetails = data.flatMap(item =>
    item.details.map(detail => ({
      species: detail.species,
      population: parseInt(detail.population) || 0,
      cases: parseInt(detail.cases) || 0,
      deaths: parseInt(detail.deaths) || 0,
      destroyed: parseInt(detail.destroyed) || 0,
      slaughtered: parseInt(detail.slaughtered) || 0,
      vaccineHistory: detail.vaccineHistory || 'Unknown'
    }))
  );

  const casesVsDeaths = speciesDetails.reduce((acc, item) => {
    acc.cases += item.cases;
    acc.deaths += item.deaths;
    return acc;
  }, { cases: 0, deaths: 0 });

  const populationVsCases = speciesDetails.reduce((acc, item) => {
    acc.population += item.population;
    acc.cases += item.cases;
    return acc;
  }, { population: 0, cases: 0 });

  const vaccineHistoryCounts = speciesDetails.reduce((acc, item) => {
    acc[item.vaccineHistory] = (acc[item.vaccineHistory] || 0) + 1;
    return acc;
  }, {});

  const slaughteredPerSpecies = speciesDetails.reduce((acc, item) => {
    acc[item.species] = (acc[item.species] || 0) + item.slaughtered;
    return acc;
  }, {});

  const destroyedPerSpecies = speciesDetails.reduce((acc, item) => {
    acc[item.species] = (acc[item.species] || 0) + item.destroyed;
    return acc;
  }, {});

  const confirmedCases = data.filter(item => item.finaldiagnosis).length;

  const natureOfDiagnosisCounts = data.reduce((acc, item) => {
    if (item.finaldiagnosis) {
      acc[item.natureofdiagnosis] = (acc[item.natureofdiagnosis] || 0) + 1;
    }
    return acc;
  }, {});

  const charts = [
    {
      label: 'Cases vs Deaths',
      content: (
        <Bar
          data={{
            labels: ['Cases', 'Deaths'],
            datasets: [{
              label: 'Number',
              data: [casesVsDeaths.cases, casesVsDeaths.deaths],
              backgroundColor: [
                "#ffe459",  // pastelyellow
                "#e5cd50",  // darkerpastelyellow
                "#1b5b40",  // darkgreen
                "#123c29",  // darkergreen
                "#252525",  // black
              ],
            }]
          }}
          options={{
            plugins: {
              title: {
                display: true,
                text: 'Number of Cases vs Deaths'
              }
            }
          }}
        />
      ),
      style: 'col-span-2'
    },
    {
      label: 'Population vs Cases',
      content: (
        <Bar
          data={{
            labels: ['Population', 'Cases'],
            datasets: [{
              label: 'Number',
              data: [populationVsCases.population, populationVsCases.cases],
              backgroundColor: [
                "#ffe459",  // pastelyellow
                "#e5cd50",  // darkerpastelyellow
                "#1b5b40",  // darkgreen
                "#123c29",  // darkergreen
                "#252525",  // black
              ],
            }]
          }}
          options={{
            plugins: {
              title: {
                display: true,
                text: 'Population vs Cases'
              }
            }
          }}
        />
      ),
      style: 'col-span-2'
    },
    {
      label: 'Vaccine History per Case',
      content: (
        <Pie
          data={{
            labels: Object.keys(vaccineHistoryCounts),
            datasets: [{
              data: Object.values(vaccineHistoryCounts),
              backgroundColor: [
                "#ffe459",  // pastelyellow
                "#e5cd50",  // darkerpastelyellow
                "#1b5b40",  // darkgreen
                "#123c29",  // darkergreen
                "#252525",  // black
              ],
            }]
          }}
          options={{
            plugins: {
              title: {
                display: true,
                text: 'Vaccine History per Cases'
              }
            }
          }}
        />
      ),
      style: 'col-span-2'
    },
    {
      label: 'Slaughtered per Species',
      content: (
        <Bar
          data={{
            labels: Object.keys(slaughteredPerSpecies),
            datasets: [{
              label: 'Number Slaughtered',
              data: Object.values(slaughteredPerSpecies),
              backgroundColor: [
                "#ffe459",  // pastelyellow
                "#e5cd50",  // darkerpastelyellow
                "#1b5b40",  // darkgreen
                "#123c29",  // darkergreen
                "#252525",  // black
              ],
            }]
          }}
          options={{
            plugins: {
              title: {
                display: true,
                text: 'Number Slaughtered per Species'
              }
            },
            scales: {
              y: { beginAtZero: true }
            }
          }}
        />
      ),
      style: 'col-span-2'
    },
    {
      label: 'Destroyed per Species',
      content: (
        <Bar
          data={{
            labels: Object.keys(destroyedPerSpecies),
            datasets: [{
              label: 'Number Destroyed',
              data: Object.values(destroyedPerSpecies),
              backgroundColor: [
                "#ffe459",  // pastelyellow
                "#e5cd50",  // darkerpastelyellow
                "#1b5b40",  // darkgreen
                "#123c29",  // darkergreen
                "#252525",  // black
              ],
            }]
          }}
          options={{
            plugins: {
              title: {
                display: true,
                text: 'Number Destroyed per Species'
              }
            },
            scales: {
              y: { beginAtZero: true }
            }
          }}
        />
      ),
      style: 'col-span-2'
    },
    {
      label: 'Number of Confirmed Cases',
      content: (
        <Bar
          data={{
            labels: ['Confirmed Cases'],
            datasets: [{
              label: 'Number',
              data: [confirmedCases],
              backgroundColor: [
                "#ffe459",  // pastelyellow
                "#e5cd50",  // darkerpastelyellow
                "#1b5b40",  // darkgreen
                "#123c29",  // darkergreen
                "#252525",  // black
              ],
            }]
          }}
          options={{
            plugins: {
              title: {
                display: true,
                text: 'Number of Confirmed Cases'
              }
            },
            scales: {
              y: { beginAtZero: true }
            }
          }}
        />
      ),
      style: 'col-span-2'
    },
    {
      label: 'Nature of Diagnosis per Confirmed Case',
      content: (
        <Pie
          data={{
            labels: Object.keys(natureOfDiagnosisCounts),
            datasets: [{
              data: Object.values(natureOfDiagnosisCounts),
              backgroundColor: [
                "#ffe459",  // pastelyellow
                "#e5cd50",  // darkerpastelyellow
                "#1b5b40",  // darkgreen
                "#123c29",  // darkergreen
                "#252525",  // black
              ],
            }]
          }}
          options={{
            plugins: {
              title: {
                display: true,
                text: 'Nature of Diagnosis per Confirmed Cases'
              }
            }
          }}
        />
      ),
      style: 'col-span-2'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-darkgreen mb-4 text-center">
          Disease Investigation Report
        </h2>


        {/* Diagnosis Selector */}
        <div className="mb-6 max-w-xl mx-auto">
          <label htmlFor="finalDiagnosis" className="block text-sm font-medium text-darkgreen mb-2">
            Select Disease
          </label>
          <select
            id="finalDiagnosis"
            value={diagnose}
            onChange={handleDiagnosisChange} // Update the handler
            className="block w-full rounded-md border-2 border-gray-300 text-gray-900 bg-white py-2 px-4 focus:outline-none focus:ring-2 focus:ring-darkgreen focus:border-darkgreen sm:text-sm"
          >
            <option value="" className="text-gray-400">All Disease</option>
            {finalDiagnoses.map((diagnosis) => (
              <option key={diagnosis} value={diagnosis} className="text-darkgreen">
                {diagnosis}
              </option>
            ))}
          </select>
        </div>

        {/* Analysis Section */}
        <div className="mt-8 p-6 bg-white border border-gray-200 shadow-md rounded-lg">
          <h3 className="text-2xl font-bold text-darkgreen border-b-2 border-darkgreen pb-2">
            Analysis
          </h3>
          <div className="text-gray-800 mt-4 text-lg leading-relaxed">
            {analysis}
          </div>
        </div>

        <ChartGroup
          charts={charts}
          title="Disease Investigation Analytics Dashboard"
          selectedChart={selectedChart}
          setSelectedChart={setSelectedChart}
        />

      </div>
    </div>
  );
}

export default DiseaseInvestigationChart;