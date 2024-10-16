import React, { useState, useEffect, useContext } from 'react';
import { Bar, Pie, Line, Doughnut } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  Tooltip,
  Legend,
  Title,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
} from 'chart.js';
import ChartGroup from './ChartGroup';
import { FilterContext } from '../pages/Home/Home';

// Register the necessary components
ChartJS.register(Tooltip, Legend, Title, BarElement, CategoryScale, LinearScale, ArcElement);

function VaccinationReportChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedChart, setSelectedChart] = useState(null);
  const { filters, showAll } = useContext(FilterContext);
  const [analysis, setAnalysis] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/reports`);
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
      generateAnalysis(filterData(data));
    }
  }, [data, filters, showAll]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const filterData = (data) => {
    if (showAll) return data;
    return data.filter(item => {
      return (
        (!filters.dateFrom || new Date(item.dateReported) >= new Date(filters.dateFrom)) &&
        (!filters.dateTo || new Date(item.dateReported) <= new Date(filters.dateTo))
      );
    });
  };

  const generateAnalysis = (filteredData) => {
    const totalVaccinations = filteredData.length;
    const mostCommonVaccine = Object.entries(vaccineCounts).reduce((a, b) => a[1] > b[1] ? a : b)[0];
    const mostCommonSpecies = Object.entries(animalSpeciesCounts).reduce((a, b) => a[1] > b[1] ? a : b)[0];
    const topMunicipality = Object.entries(municipalityCounts).reduce((a, b) => a[1] > b[1] ? a : b)[0];

    const analysisText = (
      <>
        <p>
          <strong>Total vaccinations:</strong> {totalVaccinations}.
        </p>
        <p>
          <strong>Most used vaccine:</strong> {mostCommonVaccine}.
        </p>
        <p>
          <strong>Most vaccinated species:</strong> {mostCommonSpecies}.
        </p>
        <p>
          <strong>Most Vaccinated Municipality:</strong> {topMunicipality} ({municipalityCounts[topMunicipality]} vaccinations.).
        </p>
      </>
    );


    setAnalysis(analysisText);
  };

  const filteredData = filterData(data);

  const vaccineCounts = filteredData.reduce((acc, item) => {
    acc[item.vaccine] = (acc[item.vaccine] || 0) + 1;
    return acc;
  }, {});

  const vaccineTypeCounts = filteredData.reduce((acc, item) => {
    acc[item.vaccineType] = (acc[item.vaccineType] || 0) + 1;
    return acc;
  }, {});

  const monthlyVaccinations = filteredData.reduce((acc, item) => {
    const month = new Date(item.dateReported).toLocaleString('default', { month: 'long' });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {});

  const municipalityCounts = filteredData.reduce((acc, item) => {
    acc[item.municipality] = (acc[item.municipality] || 0) + 1;
    return acc;
  }, {});

  const animalSpeciesCounts = filteredData.reduce((acc, item) => {
    item.entries.forEach(entry => {
      acc[entry.animalInfo.species] = (acc[entry.animalInfo.species] || 0) + 1;
    });
    return acc;
  }, {});

  const animalSexCounts = filteredData.reduce((acc, item) => {
    item.entries.forEach(entry => {
      acc[entry.animalInfo.sex] = (acc[entry.animalInfo.sex] || 0) + 1;
    });
    return acc;
  }, {});

  const speciesPerAge = filteredData.reduce((acc, item) => {
    item.entries.forEach(entry => {
      const species = entry.animalInfo.species;
      const age = parseInt(entry.animalInfo.age);
      const ageGroup = age <= 1 ? '0-1' : age <= 5 ? '2-5' : '6+';

      if (!acc[species]) {
        acc[species] = { '0-1': 0, '2-5': 0, '6+': 0 };
      }
      acc[species][ageGroup] += 1;
    });
    return acc;
  }, {});

  const animalAgeGroups = filteredData.reduce((acc, item) => {
    item.entries.forEach(entry => {
      const age = parseInt(entry.animalInfo.age);
      if (age <= 1) acc['0-1'] = (acc['0-1'] || 0) + 1;
      else if (age <= 5) acc['2-5'] = (acc['2-5'] || 0) + 1;
      else acc['6+'] = (acc['6+'] || 0) + 1;
    });
    return acc;
  }, {});

  const reasonCounts = filteredData.reduce((acc, item) => {
    item.entries.forEach(entry => {
      acc[entry.reason] = (acc[entry.reason] || 0) + 1;
    });
    return acc;
  }, {});

  const barangayCounts = filteredData.reduce((acc, item) => {
    item.entries.forEach(entry => {
      acc[entry.barangay] = (acc[entry.barangay] || 0) + 1;
    });
    return acc;
  }, {});

  const vaccineSourceCounts = filteredData.reduce((acc, item) => {
    acc[item.vaccineSource] = (acc[item.vaccineSource] || 0) + 1;
    return acc;
  }, {});

  const getChartOptions = (title) => ({
    plugins: {
      legend: {
        display: selectedChart !== null,
      },

    }
  });





  const charts = [
    {
      label: 'Vaccinated Species per Age',
      content: (
        <Bar
          data={{
            labels: Object.keys(speciesPerAge),
            datasets: [
              {
                label: '0-1 years',
                data: Object.values(speciesPerAge).map(s => s['0-1']),
                backgroundColor: '#FFCE56',
              },
              {
                label: '2-5 years',
                data: Object.values(speciesPerAge).map(s => s['2-5']),
                backgroundColor: '#1b5b40',
              },
              {
                label: '6+ years',
                data: Object.values(speciesPerAge).map(s => s['6+']),
                backgroundColor: '#123c29',
              },
            ],
          }}
          options={getChartOptions('Vaccinated Species by Age')}
        />
      ),
      style: 'col-span-4',
    },

    {
      label: 'Vaccine Distribution',
      content: (
        <Pie
          data={{
            labels: Object.keys(vaccineCounts),
            datasets: [{
              data: Object.values(vaccineCounts),
              backgroundColor: [
                "#ffe459", // pastelyellow
                "#e5cd50", // darkerpastelyellow
                "#1b5b40", // darkgreen
                "#123c29", // darkergreen
                "#252525", // black
              ],
            }],
          }}
          options={getChartOptions('Distribution of Vaccines')}
        />
      ),
      style: 'col-span-2',
    },
    {
      label: 'Vaccine Type Distribution',
      content: (
        <Doughnut
          data={{
            labels: Object.keys(vaccineTypeCounts),
            datasets: [{
              data: Object.values(vaccineTypeCounts),
              backgroundColor: [
                "#ffe459", // pastelyellow
                "#e5cd50", // darkerpastelyellow
                "#1b5b40", // darkgreen
                "#123c29", // darkergreen
                "#252525", // black
              ],
            }],
          }}
          options={getChartOptions('Distribution of Vaccine Types')}
        />
      ),
      style: 'col-span-2',
    },
    {
      label: 'Monthly Vaccinations',
      content: (
        <Line
          data={{
            labels: Object.keys(monthlyVaccinations),
            datasets: [{
              label: 'Number of Vaccinations',
              data: Object.values(monthlyVaccinations),
              borderColor: '#FFCE56',
              fill: false,
            }],
          }}
          options={getChartOptions('Trend of Monthly Vaccinations')}
        />
      ),
      style: 'col-span-4',
    },
    {
      label: 'Municipality Distribution',
      content: (
        <Bar
          data={{
            labels: Object.keys(municipalityCounts),
            datasets: [{
              label: 'Number of Vaccinations',
              data: Object.values(municipalityCounts),
              backgroundColor: '#1b5b40',
            }],
          }}
          options={getChartOptions('Distribution of Vaccinations by Municipality')}
        />
      ),
      style: 'col-span-4',
    },
    {
      label: 'Animal Species Distribution',
      content: (
        <Pie
          data={{
            labels: Object.keys(animalSpeciesCounts),
            datasets: [{
              data: Object.values(animalSpeciesCounts),
              backgroundColor: [
                "#ffe459", // pastelyellow
                "#e5cd50", // darkerpastelyellow
                "#1b5b40", // darkgreen
                "#123c29", // darkergreen
                "#252525", // black
              ],
            }],
          }}
          options={getChartOptions('Distribution of Vaccinated Animal Species')}
        />
      ),
      style: 'col-span-2',
    },
    {
      label: 'Animal Sex Distribution',
      content: (
        <Doughnut
          data={{
            labels: Object.keys(animalSexCounts),
            datasets: [{
              data: Object.values(animalSexCounts),
              backgroundColor: [
                "#ffe459", // pastelyellow
                "#e5cd50", // darkerpastelyellow
                "#1b5b40", // darkgreen
                "#123c29", // darkergreen
                "#252525", // black
              ],
            }],
          }}
          options={getChartOptions('Distribution of Vaccinated Animals by Sex')}
        />
      ),
      style: 'col-span-2',
    },
    {
      label: 'Animal Age Distribution',
      content: (
        <Bar
          data={{
            labels: Object.keys(animalAgeGroups),
            datasets: [{
              label: 'Number of Animals',
              data: Object.values(animalAgeGroups),
              backgroundColor: '#FFCE56',
            }],
          }}
          options={getChartOptions('Distribution of Vaccinated Animals by Age Group')}
        />
      ),
      style: 'col-span-2',
    },
    {
      label: 'Vaccination Reasons',
      content: (
        <Pie
          data={{
            labels: Object.keys(reasonCounts),
            datasets: [{
              data: Object.values(reasonCounts),
              backgroundColor: [
                "#ffe459", // pastelyellow
                "#e5cd50", // darkerpastelyellow
                "#1b5b40", // darkgreen
                "#123c29", // darkergreen
                "#252525", // black
              ],
            }],
          }}
          options={getChartOptions('Distribution of Vaccination Reasons')}
        />
      ),
      style: 'col-span-2',
    },
    {
      label: 'Barangay Distribution',
      content: (
        <Bar
          data={{
            labels: Object.keys(barangayCounts),
            datasets: [{
              label: 'Number of Vaccinations',
              data: Object.values(barangayCounts),
              backgroundColor: '#1b5b40',
            }],
          }}
          options={getChartOptions('Distribution of Vaccinations by Barangay')}
        />
      ),
      style: 'col-span-4',
    },
    {
      label: 'Vaccine Source Distribution',
      content: (
        <Doughnut
          data={{
            labels: Object.keys(vaccineSourceCounts),
            datasets: [{
              data: Object.values(vaccineSourceCounts),
              backgroundColor: [
                "#ffe459", // pastelyellow
                "#e5cd50", // darkerpastelyellow
                "#1b5b40", // darkgreen
                "#123c29", // darkergreen
                "#252525", // black
              ],
            }],
          }}
          options={getChartOptions('Distribution of Vaccine Sources')}
        />
      ),
      style: 'col-span-2',
    },
  ];

  return (
    <>
      {/* Analysis Section */}
      <div className="mt-8 p-6 bg-white border border-gray-200 shadow-md rounded-lg">
        <h3 className="text-2xl font-bold text-darkgreen border-b-2 border-darkgreen pb-2">
          Analysis
        </h3>
        <p className="text-gray-800 mt-4 text-lg leading-relaxed">
          {analysis}
        </p>
      </div>

      <ChartGroup
        charts={charts}
        title="Vaccination Report Analytics Dashboard"
        selectedChart={selectedChart}
        setSelectedChart={setSelectedChart}
      />

    </>
  );
}

export default VaccinationReportChart;
