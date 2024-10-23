import React, { useState, useEffect, useContext } from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import axiosInstance from '../component/axiosInstance';
import { Chart as ChartJS } from 'chart.js/auto';
import ChartGroup from './ChartGroup';
import { FilterContext } from '../pages/Home/Home';

function DiseaseInvestigationChart({ filterValues }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedChart, setSelectedChart] = useState(null);
  const { filters, showAll } = useContext(FilterContext);
  const [analysis, setAnalysis] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(`/disease-investigation`, {
          params: {
            formStatus: 'Accepted',
            municipality: filterValues.municipality || undefined,
            startDate: filterValues.startDate || undefined,
            endDate: filterValues.endDate || undefined,
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
  }, []);

  
  useEffect(() => {
    if (data.length > 0) {
      const filteredData = filterData(data);
      const speciesDetails = filteredData.flatMap(item =>
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

      // Calculate statistics for analysis
      const totalCases = speciesDetails.reduce((sum, item) => sum + item.cases, 0);
      const totalDeaths = speciesDetails.reduce((sum, item) => sum + item.deaths, 0);
      const mortalityRate = totalCases > 0 ? ((totalDeaths / totalCases) * 100).toFixed(2) : 0;
      
      const speciesCounts = speciesDetails.reduce((acc, item) => {
        acc[item.species] = (acc[item.species] || 0) + item.cases;
        return acc;
      }, {});
      
      const mostAffectedSpecies = Object.entries(speciesCounts)
        .sort(([,a], [,b]) => b - a)[0];

      const vaccinated = speciesDetails.filter(item => 
        item.vaccineHistory.toLowerCase().includes('vaccinated')).length;
      const vaccinationRate = ((vaccinated / speciesDetails.length) * 100).toFixed(2);

      // Set analysis content
      setAnalysis(
        <>
          <p>
            <strong>Total Cases:</strong> {totalCases} cases reported across all species.
          </p>
          <p>
            <strong>Mortality Rate:</strong> {mortalityRate}% ({totalDeaths} deaths out of {totalCases} cases).
          </p>
          {mostAffectedSpecies && (
            <p>
              <strong>Most Affected Species:</strong> {mostAffectedSpecies[0]} with {mostAffectedSpecies[1]} cases.
            </p>
          )}
          <p>
            <strong>Vaccination Status:</strong> {vaccinationRate}% of affected animals had vaccination history.
          </p>
          <p>
            <strong>Control Measures:</strong> Total of {
              speciesDetails.reduce((sum, item) => sum + item.destroyed + item.slaughtered, 0)
            } animals were either destroyed or slaughtered as control measures.
          </p>
        </>
      );
    }
  }, [data, filters, showAll]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const filterData = (data) => {
    if (showAll) return data;
    return data.filter(item => {
      return (
        (!filters.dateFrom || new Date(item.dateReported) >= new Date(filters.dateFrom)) &&
        (!filters.dateTo || new Date(item.dateReported) <= new Date(filters.dateTo)) &&
        (!filters.status || item.status === filters.status)
      );
    });
  };

  const filteredData = filterData(data);

  const speciesDetails = filteredData.flatMap(item =>
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

  const confirmedCases = filteredData.filter(item => item.finaldiagnosis).length;

  const natureOfDiagnosisCounts = filteredData.reduce((acc, item) => {
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
