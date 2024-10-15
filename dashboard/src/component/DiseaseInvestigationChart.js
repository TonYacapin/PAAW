import React, { useState, useEffect, useContext } from 'react';
import { Bar, Pie, Line, Scatter } from 'react-chartjs-2';
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

  const placeAffectedCounts = filteredData.reduce((acc, item) => {
    acc[item.placeAffected] = (acc[item.placeAffected] || 0) + 1;
    return acc;
  }, {});

  const farmTypeCounts = filteredData.reduce((acc, item) => {
    item.farmType.forEach(type => {
      acc[type] = (acc[type] || 0) + 1;
    });
    return acc;
  }, {});

  const reportedDates = filteredData.reduce((acc, item) => {
    const date = new Date(item.dateReported).toLocaleDateString();
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const speciesDetails = filteredData.flatMap(item =>
    item.details.map(detail => ({
      species: detail.species,
      population: parseInt(detail.population) || 0,
      cases: parseInt(detail.cases) || 0,
      deaths: parseInt(detail.deaths) || 0,
      destroyed: parseInt(detail.destroyed) || 0,
      slaughtered: parseInt(detail.slaughtered) || 0
    }))
  );

  const speciesSummary = speciesDetails.reduce((acc, item) => {
    if (!acc[item.species]) {
      acc[item.species] = { population: 0, cases: 0, deaths: 0, destroyed: 0, slaughtered: 0 };
    }
    acc[item.species].population += item.population;
    acc[item.species].cases += item.cases;
    acc[item.species].deaths += item.deaths;
    acc[item.species].destroyed += item.destroyed;
    acc[item.species].slaughtered += item.slaughtered;
    return acc;
  }, {});

  const charts = [
    {
      label: 'Place Affected',
      content: (
        <Pie
          data={{
            labels: Object.keys(placeAffectedCounts),
            datasets: [{
              data: Object.values(placeAffectedCounts),
              backgroundColor: [
                "#ffe459", // pastelyellow
                "#e5cd50", // darkerpastelyellow
                "#1b5b40", // darkgreen
                "#123c29", // darkergreen
                "#252525", // black
              ],
            }]
          }}
          options={{
            plugins: {
              title: {
                display: true,
                text: 'Distribution of Places Affected'
              }
            }
          }}
        />
      ),
      style: 'col-span-2'
    },
    {
      label: 'Farm Type',
      content: (
        <Bar
          data={{
            labels: Object.keys(farmTypeCounts),
            datasets: [{
              label: 'Number of Farms',
              data: Object.values(farmTypeCounts),
              backgroundColor: '#1b5b40',
            }]
          }}
          options={{
            plugins: {
              title: {
                display: true,
                text: 'Distribution of Farm Types'
              }
            },
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }}
        />
      ),
      style: 'col-span-2'
    },
    {
      label: 'Date Reported',
      content: (
        <Line
          data={{
            labels: Object.keys(reportedDates),
            datasets: [{
              label: 'Reports',
              data: Object.values(reportedDates),
              borderColor: '#FFCE56',
              fill: false,
            }]
          }}
          options={{
            plugins: {
              title: {
                display: true,
                text: 'Date-wise Reported Cases'
              }
            },
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }}
        />
      ),
      style: 'col-span-4'
    },
    {
      label: 'Species Impact Analysis',
      content: (
        <Bar
          data={{
            labels: Object.keys(speciesSummary),
            datasets: [
              {
                label: 'Population',
                data: Object.values(speciesSummary).map(d => d.population),
                backgroundColor: '#ffe459',
              },
              {
                label: 'Cases',
                data: Object.values(speciesSummary).map(d => d.cases),
                backgroundColor: '#e5cd50',
              },
              {
                label: 'Deaths',
                data: Object.values(speciesSummary).map(d => d.deaths),
                backgroundColor: '#1b5b40',
              },
              {
                label: 'Destroyed',
                data: Object.values(speciesSummary).map(d => d.destroyed),
                backgroundColor: '#123c29',
              },
              {
                label: 'Slaughtered',
                data: Object.values(speciesSummary).map(d => d.slaughtered),
                backgroundColor: '#ffe459',
              }
            ]
          }}
          options={{
            plugins: {
              title: {
                display: true,
                text: 'Species Impact Analysis'
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                stacked: true
              }
            }
          }}
        />
      ),
      style: 'col-span-4'
    },
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
