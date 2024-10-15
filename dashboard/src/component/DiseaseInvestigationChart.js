import React, { useState, useEffect, useContext } from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import axios from 'axios';
import { Chart as ChartJS } from 'chart.js/auto';
import ChartGroup from './ChartGroup';
import { FilterContext } from '../pages/Home/Home';

function DiseaseInvestigationChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedChart, setSelectedChart] = useState(null);
  const { filters, showAll } = useContext(FilterContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/disease-investigation`);
        setData(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
              backgroundColor: ['#FF6384', '#36A2EB']
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
              backgroundColor: ['#FFCE56', '#FF6384']
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
              backgroundColor: ['#FFCE56', '#FF6384', '#36A2EB']
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
              backgroundColor: '#FFCE56'
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
              backgroundColor: '#36A2EB'
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
              backgroundColor: '#36A2EB'
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
              backgroundColor: ['#FFCE56', '#FF6384', '#36A2EB']
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
    <ChartGroup
      charts={charts}
      title="Disease Investigation Analytics Dashboard"
      selectedChart={selectedChart}
      setSelectedChart={setSelectedChart}
    />
  );
}

export default DiseaseInvestigationChart;
