import React, { useState, useEffect } from 'react';
import { Line, Pie, Doughnut, Bar, Bubble } from 'react-chartjs-2';
import axios from 'axios';
import { Chart as ChartJS } from 'chart.js/auto';

const DiseaseInvestigationChart = () => {
  const [data, setData] = useState({
    lineChart: { labels: [], datasets: [{ data: [], label: '' }] },
    pieChartStatus: { labels: [], datasets: [{ data: [], label: '' }] },
    pieChartFarmType: { labels: [], datasets: [{ data: [], label: '' }] },
    barChartSpeciesCasesDeaths: { labels: [], datasets: [{ data: [], label: '' }] },
    bubbleChartSpeciesPopulation: { labels: [], datasets: [{ data: [], label: '' }] },
    pieChartControlMeasures: { labels: [], datasets: [{ data: [], label: '' }] },
    pieChartProbableSource: { labels: [], datasets: [{ data: [], label: '' }] },
    barChartCFRBySpecies: { labels: [], datasets: [{ data: [], label: '' }] },
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/disease-investigation`);
        const reports = response.data;

        // Line Chart: Investigations over Time
        const investigationDates = {};
        reports.forEach(report => {
          const date = new Date(report.dateReported).toLocaleDateString();
          if (investigationDates[date]) {
            investigationDates[date] += 1;
          } else {
            investigationDates[date] = 1;
          }
        });
        const processedLineChartData = {
          labels: Object.keys(investigationDates),
          datasets: [{
            label: 'Investigations Over Time',
            data: Object.values(investigationDates),
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderWidth: 1,
          }]
        };

        // Pie Chart: Investigation Status
        const statusCounts = { new: 0, 'on-going': 0 };
        reports.forEach(report => { statusCounts[report.status] += 1; });
        const processedPieChartStatus = {
          labels: ['New', 'On-going'],
          datasets: [{ data: [statusCounts.new, statusCounts['on-going']], backgroundColor: ['rgba(54, 162, 235, 0.6)', 'rgba(255, 99, 132, 0.6)'] }]
        };

        // Pie Chart: Farm Type Distribution
        const farmTypeCounts = {};
        reports.forEach(report => {
          report.farmType.forEach(type => {
            if (farmTypeCounts[type]) {
              farmTypeCounts[type] += 1;
            } else {
              farmTypeCounts[type] = 1;
            }
          });
        });
        const processedPieChartFarmType = {
          labels: Object.keys(farmTypeCounts),
          datasets: [{ data: Object.values(farmTypeCounts), backgroundColor: ['rgba(255, 206, 86, 0.6)', 'rgba(75, 192, 192, 0.6)', 'rgba(153, 102, 255, 0.6)'] }]
        };

        // Bar Chart: Cases and Deaths by Species
        const speciesCasesDeaths = {};
        reports.forEach(report => {
          report.detailsRows.forEach(detail => {
            if (speciesCasesDeaths[detail.species]) {
              speciesCasesDeaths[detail.species].cases += parseInt(detail.cases) || 0;
              speciesCasesDeaths[detail.species].deaths += parseInt(detail.deaths) || 0;
            } else {
              speciesCasesDeaths[detail.species] = {
                cases: parseInt(detail.cases) || 0,
                deaths: parseInt(detail.deaths) || 0,
              };
            }
          });
        });
        const processedBarChartSpeciesCasesDeaths = {
          labels: Object.keys(speciesCasesDeaths),
          datasets: [
            { label: 'Cases', data: Object.values(speciesCasesDeaths).map(item => item.cases), backgroundColor: 'rgba(255, 159, 64, 0.6)' },
            { label: 'Deaths', data: Object.values(speciesCasesDeaths).map(item => item.deaths), backgroundColor: 'rgba(255, 99, 132, 0.6)' }
          ]
        };

        // Bubble Chart: Species vs Population Affected
        const bubbleData = reports.map(report => report.detailsRows.map(detail => ({
          x: parseInt(detail.population),
          y: parseInt(detail.cases),
          r: parseInt(detail.deaths) * 3, // Radius scaled by deaths
          species: detail.species
        }))).flat();
        const processedBubbleChartSpeciesPopulation = {
          labels: bubbleData.map(data => data.species),
          datasets: [{ label: 'Population vs Cases', data: bubbleData, backgroundColor: 'rgba(54, 162, 235, 0.6)' }]
        };

        // Pie Chart: Control Measures Used
        const controlMeasureCounts = {};
        reports.forEach(report => {
          if (controlMeasureCounts[report.controlmeasures]) {
            controlMeasureCounts[report.controlmeasures] += 1;
          } else {
            controlMeasureCounts[report.controlmeasures] = 1;
          }
        });
        const processedPieChartControlMeasures = {
          labels: Object.keys(controlMeasureCounts),
          datasets: [{ data: Object.values(controlMeasureCounts), backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(153, 102, 255, 0.6)', 'rgba(255, 159, 64, 0.6)'] }]
        };

        // Pie Chart: Probable Source of Infection
        const sourceOfInfectionCounts = {};
        reports.forEach(report => {
          if (sourceOfInfectionCounts[report.propablesourceofinfection]) {
            sourceOfInfectionCounts[report.propablesourceofinfection] += 1;
          } else {
            sourceOfInfectionCounts[report.propablesourceofinfection] = 1;
          }
        });
        const processedPieChartProbableSource = {
          labels: Object.keys(sourceOfInfectionCounts),
          datasets: [{ data: Object.values(sourceOfInfectionCounts), backgroundColor: ['rgba(54, 162, 235, 0.6)', 'rgba(255, 99, 132, 0.6)', 'rgba(75, 192, 192, 0.6)'] }]
        };

        // Bar Chart: Case Fatality Rate (CFR) by Species
        const caseFatalityRates = {};
        Object.keys(speciesCasesDeaths).forEach(species => {
          const cases = speciesCasesDeaths[species].cases;
          const deaths = speciesCasesDeaths[species].deaths;
          const cfr = (deaths / cases) * 100;
          caseFatalityRates[species] = cfr.toFixed(2); // Case Fatality Rate %
        });
        const processedBarChartCFRBySpecies = {
          labels: Object.keys(caseFatalityRates),
          datasets: [{ label: 'Case Fatality Rate (%)', data: Object.values(caseFatalityRates), backgroundColor: 'rgba(255, 99, 132, 0.6)' }]
        };

        setData({
          lineChart: processedLineChartData,
          pieChartStatus: processedPieChartStatus,
          pieChartFarmType: processedPieChartFarmType,
          barChartSpeciesCasesDeaths: processedBarChartSpeciesCasesDeaths,
          bubbleChartSpeciesPopulation: processedBubbleChartSpeciesPopulation,
          pieChartControlMeasures: processedPieChartControlMeasures,
          pieChartProbableSource: processedPieChartProbableSource,
          barChartCFRBySpecies: processedBarChartCFRBySpecies,
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading chart data...</div>;
  }

  return (
    <div>
      <h2>Disease Investigation Reports</h2>

      {/* Line Chart: Investigations Over Time */}
      <div>
        <h3>Investigations Over Time</h3>
        {data.lineChart.labels.length > 0 ? <Line data={data.lineChart} /> : <div>No data available</div>}
      </div>

      {/* Pie Chart: Investigation Status */}
      <div>
        <h3>Investigation Status</h3>
        {data.pieChartStatus.labels.length > 0 ? <Pie data={data.pieChartStatus} /> : <div>No data available</div>}
      </div>

      {/* Pie Chart: Farm Type Distribution */}
      <div>
        <h3>Farm Type Distribution</h3>
        {data.pieChartFarmType.labels.length > 0 ? <Doughnut data={data.pieChartFarmType} /> : <div>No data available</div>}
      </div>

      {/* Bar Chart: Cases and Deaths by Species */}
      <div>
        <h3>Cases and Deaths by Species</h3>
        {data.barChartSpeciesCasesDeaths.labels.length > 0 ? <Bar data={data.barChartSpeciesCasesDeaths} /> : <div>No data available</div>}
      </div>

      {/* Bubble Chart: Species vs Population Affected */}
      <div>
        <h3>Species vs Population Affected</h3>
        {data.bubbleChartSpeciesPopulation.labels.length > 0 ? <Bubble data={data.bubbleChartSpeciesPopulation} /> : <div>No data available</div>}
      </div>

      {/* Pie Chart: Control Measures */}
      <div>
        <h3>Control Measures Used</h3>
        {data.pieChartControlMeasures.labels.length > 0 ? <Pie data={data.pieChartControlMeasures} /> : <div>No data available</div>}
      </div>

      {/* Pie Chart: Probable Source of Infection */}
      <div>
        <h3>Probable Source of Infection</h3>
        {data.pieChartProbableSource.labels.length > 0 ? <Doughnut data={data.pieChartProbableSource} /> : <div>No data available</div>}
      </div>

      {/* Bar Chart: Case Fatality Rate by Species */}
      <div>
        <h3>Case Fatality Rate by Species</h3>
        {data.barChartCFRBySpecies.labels.length > 0 ? <Bar data={data.barChartCFRBySpecies} /> : <div>No data available</div>}
      </div>
    </div>
  );
};

export default DiseaseInvestigationChart;
