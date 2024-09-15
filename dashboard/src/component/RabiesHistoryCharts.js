import React, { useState, useEffect } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import axios from 'axios';
import { Chart as ChartJS } from 'chart.js/auto';

const RabiesHistoryCharts = () => {
  const [data, setData] = useState({
    speciesDistribution: { labels: [], datasets: [{ data: [] }] },
    sexDistribution: { labels: [], datasets: [{ data: [] }] },
    causeOfDeath: { labels: [], datasets: [{ data: [] }] },
    vaccinationHistory: { labels: [], datasets: [{ data: [] }] },
    behavioralChanges: { labels: [], datasets: [{ data: [] }] },
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRabiesHistory = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/RH`);
        const rabiesHistories = response.data;

        // 1. Pie Chart: Species Distribution
        const speciesCounts = {};
        rabiesHistories.forEach(history => {
          const species = history.animalProfile.species;
          if (speciesCounts[species]) {
            speciesCounts[species] += 1;
          } else {
            speciesCounts[species] = 1;
          }
        });
        const speciesDistribution = {
          labels: Object.keys(speciesCounts),
          datasets: [{
            data: Object.values(speciesCounts),
            backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)', 'rgba(255, 206, 86, 0.6)']
          }]
        };

        // 2. Bar Chart: Sex Distribution of Animals
        const sexCounts = { Male: 0, Female: 0 };
        rabiesHistories.forEach(history => {
          const sex = history.animalProfile.sex;
          if (sex === 'Male') {
            sexCounts.Male += 1;
          } else if (sex === 'Female') {
            sexCounts.Female += 1;
          }
        });
        const sexDistribution = {
          labels: ['Male', 'Female'],
          datasets: [{
            label: 'Sex Distribution of Animals',
            data: [sexCounts.Male, sexCounts.Female],
            backgroundColor: ['rgba(54, 162, 235, 0.6)', 'rgba(255, 99, 132, 0.6)']
          }]
        };

        // 3. Pie Chart: Cause of Death
        const causeOfDeathCounts = {};
        rabiesHistories.forEach(history => {
          const cause = history.causeOfDeath || 'Unknown';
          if (causeOfDeathCounts[cause]) {
            causeOfDeathCounts[cause] += 1;
          } else {
            causeOfDeathCounts[cause] = 1;
          }
        });
        const causeOfDeath = {
          labels: Object.keys(causeOfDeathCounts),
          datasets: [{
            data: Object.values(causeOfDeathCounts),
            backgroundColor: ['rgba(153, 102, 255, 0.6)', 'rgba(255, 159, 64, 0.6)', 'rgba(75, 192, 192, 0.6)']
          }]
        };

        // 4. Bar Chart: Vaccination History
        const vaccinationCounts = { Vaccinated: 0, 'Not Vaccinated': 0 };
        rabiesHistories.forEach(history => {
          const vaccinated = history.vaccinationHistory === 'Yes' ? 'Vaccinated' : 'Not Vaccinated';
          vaccinationCounts[vaccinated] += 1;
        });
        const vaccinationHistory = {
          labels: ['Vaccinated', 'Not Vaccinated'],
          datasets: [{
            label: 'Vaccination History',
            data: [vaccinationCounts.Vaccinated, vaccinationCounts['Not Vaccinated']],
            backgroundColor: ['rgba(54, 162, 235, 0.6)', 'rgba(255, 206, 86, 0.6)']
          }]
        };

        // 5. Bar Chart: Behavioral Changes in Animals
        const behavioralChangeCounts = {
          'None': 0,
          'Restlessness': 0,
          'Apprehensive/Watchful Look': 0,
          'Running Aimlessly': 0,
          'Biting Inanimate Objects': 0,
          'Hyperactivity': 0,
          'Others': 0
        };
        rabiesHistories.forEach(history => {
          const changes = history.behavioralChanges;
          if (changes.none) behavioralChangeCounts.None += 1;
          if (changes.restlessness) behavioralChangeCounts.Restlessness += 1;
          if (changes.apprehensiveWatchfulLook) behavioralChangeCounts['Apprehensive/Watchful Look'] += 1;
          if (changes.runningAimlessly) behavioralChangeCounts['Running Aimlessly'] += 1;
          if (changes.bitingInanimateObjects) behavioralChangeCounts['Biting Inanimate Objects'] += 1;
          if (changes.hyperactivity) behavioralChangeCounts.Hyperactivity += 1;
          if (changes.others) behavioralChangeCounts.Others += 1;
        });
        const behavioralChanges = {
          labels: Object.keys(behavioralChangeCounts),
          datasets: [{
            label: 'Behavioral Changes in Animals',
            data: Object.values(behavioralChangeCounts),
            backgroundColor: 'rgba(75, 192, 192, 0.6)'
          }]
        };

        // Set the processed data
        setData({
          speciesDistribution,
          sexDistribution,
          causeOfDeath,
          vaccinationHistory,
          behavioralChanges
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching rabies history:', error);
        setLoading(false);
      }
    };

    fetchRabiesHistory();
  }, []);

  if (loading) {
    return <div>Loading chart data...</div>;
  }

  return (
    <div>
      <h2>Rabies History Dashboard</h2>

      {/* Pie Chart: Species Distribution */}
      <div>
        <h3>Species Distribution</h3>
        <Pie data={data.speciesDistribution} />
      </div>

      {/* Bar Chart: Sex Distribution */}
      <div>
        <h3>Sex Distribution of Animals</h3>
        <Bar data={data.sexDistribution} />
      </div>

      {/* Pie Chart: Cause of Death */}
      <div>
        <h3>Cause of Death</h3>
        <Pie data={data.causeOfDeath} />
      </div>

      {/* Bar Chart: Vaccination History */}
      <div>
        <h3>Vaccination History</h3>
        <Bar data={data.vaccinationHistory} />
      </div>

      {/* Bar Chart: Behavioral Changes */}
      <div>
        <h3>Behavioral Changes in Animals</h3>
        <Bar data={data.behavioralChanges} />
      </div>
    </div>
  );
};

export default RabiesHistoryCharts;
