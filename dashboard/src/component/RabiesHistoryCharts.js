import React, { useState, useEffect } from "react";
import { Bar, Pie } from "react-chartjs-2";
import axiosInstance from '../component/axiosInstance';
import { Chart as ChartJS } from "chart.js/auto";
import ChartGroup from "./ChartGroup";

const RabiesHistoryCharts = ({ filterValues }) => {
  const [data, setData] = useState({
    speciesDistribution: { labels: [], datasets: [{ data: [] }] },
    sexDistribution: { labels: [], datasets: [{ data: [] }] },
    causeOfDeath: { labels: [], datasets: [{ data: [] }] },
    vaccinationHistory: { labels: [], datasets: [{ data: [] }] },
    behavioralChanges: { labels: [], datasets: [{ data: [] }] },
    numberOfBreeds: { labels: [], datasets: [{ data: [] }] },
    deathsPerDay: { labels: [], datasets: [{ data: [] }] },
    rabiesCasesWithVaccination: { labels: [], datasets: [{ data: [] }] },
    behavioralChangesPerSpecies: { labels: [], datasets: [{ data: [] }] },
  });

  const [analysis, setAnalysis] = useState("");


  const [loading, setLoading] = useState(true);
  const [selectedChart, setSelectedChart] = useState(null);
  

  useEffect(() => {
    const fetchRabiesHistory = async () => {
      try {
        const response = await axiosInstance.get(
          `/RH`, {
          params: {
            formStatus: 'Accepted',
            municipality: filterValues.municipality || undefined,
            startDate: filterValues.startDate || undefined,
            endDate: filterValues.endDate || undefined,
          },
        }
        );
        const rabiesHistories = response.data;


        // 1. Pie Chart: Species Distribution
        const speciesCounts = {};
        rabiesHistories.forEach((history) => {
          const species = history.animalProfile.species;
          if (speciesCounts[species]) {
            speciesCounts[species] += 1;
          } else {
            speciesCounts[species] = 1;
          }
        });
        const speciesDistribution = {
          labels: Object.keys(speciesCounts),
          datasets: [
            {
              data: Object.values(speciesCounts),
              backgroundColor: [
                "#ffe459",  // pastelyellow
                "#e5cd50",  // darkerpastelyellow
                "#1b5b40",  // darkgreen
                "#123c29",  // darkergreen
                "#252525",  // black
              ],
            },
          ],
        };

        // 2. Bar Chart: Sex Distribution of Animals
        const sexCounts = { Male: 0, Female: 0 };
        rabiesHistories.forEach((history) => {
          const sex = history.animalProfile.sex;
          if (sex === "Male") {
            sexCounts.Male += 1;
          } else if (sex === "Female") {
            sexCounts.Female += 1;
          }
        });
        const sexDistribution = {
          labels: ["Male", "Female"],
          datasets: [
            {
              label: "Sex Distribution of Animals",
              data: [sexCounts.Male, sexCounts.Female],
              backgroundColor: [
                "#1b5b40",  // darkgreen
                "#ffe459",  // pastelyellow
              ],
            },
          ],
        };

        // 3. Pie Chart: Cause of Death
        const causeOfDeathCounts = {};
        rabiesHistories.forEach((history) => {
          const cause = history.causeOfDeath || "Unknown";
          if (causeOfDeathCounts[cause]) {
            causeOfDeathCounts[cause] += 1;
          } else {
            causeOfDeathCounts[cause] = 1;
          }
        });
        const causeOfDeath = {
          labels: Object.keys(causeOfDeathCounts),
          datasets: [
            {
              data: Object.values(causeOfDeathCounts),
              backgroundColor: [
                "#1b5b40",  // darkgreen
                "#123c29",  // darkergreen
                "#252525",  // black
                "#ffe459",  // pastelyellow
                "#e5cd50",  // darkerpastelyellow
              ],
            },
          ],
        };

        // 4. Bar Chart: Vaccination History
        const vaccinationCounts = { Vaccinated: 0, "Not Vaccinated": 0 };
        rabiesHistories.forEach((history) => {
          const vaccinated =
            history.vaccinationHistory === "rabies"
              ? "Vaccinated"
              : "Not Vaccinated";
          vaccinationCounts[vaccinated] += 1;
        });
        const vaccinationHistory = {
          labels: ["Vaccinated", "Not Vaccinated"],
          datasets: [
            {
              label: "Vaccination History",
              data: [
                vaccinationCounts.Vaccinated,
                vaccinationCounts["Not Vaccinated"],
              ],
              backgroundColor: [
                "#1b5b40",  // darkgreen
                "#252525",  // black
              ],
            },
          ],
        };

        // 5. Bar Chart: Behavioral Changes in Animals
        const behavioralChangeCounts = {
          None: 0,
          Restlessness: 0,
          "Apprehensive/Watchful Look": 0,
          "Running Aimlessly": 0,
          "Biting Inanimate Objects": 0,
          Hyperactivity: 0,
          Others: 0,
        };
        rabiesHistories.forEach((history) => {
          const changes = history.behavioralChanges;
          if (changes.none) behavioralChangeCounts.None += 1;
          if (changes.restlessness) behavioralChangeCounts.Restlessness += 1;
          if (changes.apprehensiveWatchfulLook)
            behavioralChangeCounts["Apprehensive/Watchful Look"] += 1;
          if (changes.runningAimlessly)
            behavioralChangeCounts["Running Aimlessly"] += 1;
          if (changes.bitingInanimateObjects)
            behavioralChangeCounts["Biting Inanimate Objects"] += 1;
          if (changes.hyperactivity) behavioralChangeCounts.Hyperactivity += 1;
          if (changes.others) behavioralChangeCounts.Others += 1;
        });
        const behavioralChanges = {
          labels: Object.keys(behavioralChangeCounts),
          datasets: [
            {
              label: "Behavioral Changes in Animals",
              data: Object.values(behavioralChangeCounts),
              backgroundColor: [
                "#e5cd50",  // darkerpastelyellow
                "#1b5b40",  // darkgreen
                "#123c29",  // darkergreen
                "#252525",  // black
                "#ffe459",  // pastelyellow
              ],
            },
          ],
        };

        // 6. Number of Breeds
        const breedCounts = {};
        rabiesHistories.forEach((history) => {
          const breed = history.animalProfile.breed;
          if (breedCounts[breed]) {
            breedCounts[breed] += 1;
          } else {
            breedCounts[breed] = 1;
          }
        });
        const numberOfBreeds = {
          labels: Object.keys(breedCounts),
          datasets: [
            {
              data: Object.values(breedCounts),
              backgroundColor: ["#ffe459", "#1b5b40", "#123c29", "#252525"],
            },
          ],
        };

        // 7. Number of Animal Deaths per Day
        const deathCounts = {};
        rabiesHistories.forEach((history) => {
          const date = new Date(history.dateOfDeath).toLocaleDateString();
          if (deathCounts[date]) {
            deathCounts[date] += 1;
          } else {
            deathCounts[date] = 1;
          }
        });
        const deathsPerDay = {
          labels: Object.keys(deathCounts),
          datasets: [
            {
              data: Object.values(deathCounts),
              backgroundColor: ["#e5cd50", "#1b5b40", "#123c29", "#252525"],
            },
          ],
        };

        // 8. Number of Rabies Cases with Vaccination History
        const rabiesCasesWithVaccinationCounts = rabiesHistories.filter(
          (history) => history.vaccinationHistory === "rabies"
        ).length;
        const rabiesCasesWithVaccination = {
          labels: ["Rabies Vaccinated", "Not Vaccinated"],
          datasets: [
            {
              data: [rabiesCasesWithVaccinationCounts, rabiesHistories.length - rabiesCasesWithVaccinationCounts],
              backgroundColor: ["#1b5b40", "#252525"],
            },
          ],
        };

        // 9. Number of Behavioral Changes per Species
        const behavioralChangeCountsPerSpecies = {};
        rabiesHistories.forEach((history) => {
          const species = history.animalProfile.species;
          if (!behavioralChangeCountsPerSpecies[species]) {
            behavioralChangeCountsPerSpecies[species] = {
              Restlessness: 0,
              "Apprehensive/Watchful Look": 0,
              "Running Aimlessly": 0,
              "Biting Inanimate Objects": 0,
              Hyperactivity: 0,
              Others: 0,
              None: 0,
            };
          }
          const changes = history.behavioralChanges;
          if (changes.restlessness) behavioralChangeCountsPerSpecies[species].Restlessness += 1;
          if (changes.apprehensiveWatchfulLook) behavioralChangeCountsPerSpecies[species]["Apprehensive/Watchful Look"] += 1;
          if (changes.runningAimlessly) behavioralChangeCountsPerSpecies[species]["Running Aimlessly"] += 1;
          if (changes.bitingInanimateObjects) behavioralChangeCountsPerSpecies[species]["Biting Inanimate Objects"] += 1;
          if (changes.hyperactivity) behavioralChangeCountsPerSpecies[species].Hyperactivity += 1;
          if (changes.others) behavioralChangeCountsPerSpecies[species].Others += 1;
          if (changes.none) behavioralChangeCountsPerSpecies[species].None += 1;
        });
        const behavioralChangesPerSpecies = {
          labels: Object.keys(behavioralChangeCountsPerSpecies),
          datasets: [
            {
              label: "Behavioral Changes",
              data: Object.values(behavioralChangeCountsPerSpecies).map(counts => Object.values(counts).reduce((a, b) => a + b, 0)),
              backgroundColor: ["#e5cd50", "#1b5b40", "#123c29", "#252525"],
            },
          ],
        };

        // Perform data analysis
        const totalCases = rabiesHistories.length;
        const mostCommonSpecies = Object.keys(speciesCounts).reduce(
          (a, b) => (speciesCounts[a] > speciesCounts[b] ? a : b),
          ""
        );
        const vaccinationRate = vaccinationCounts.Vaccinated / totalCases * 100;

        // Set analysis content
        setAnalysis(
          <>
            <p><strong>Total Rabies Cases:</strong> {totalCases}</p>
            <p><strong>Most Common Species:</strong> {mostCommonSpecies}</p>
            <p><strong>Vaccination Rate:</strong> {vaccinationRate.toFixed(2)}%</p>
          </>
        );


        // Set the processed data
        setData({
          speciesDistribution,
          sexDistribution,
          causeOfDeath,
          vaccinationHistory,
          behavioralChanges,
          numberOfBreeds,
          deathsPerDay,
          rabiesCasesWithVaccination,
          behavioralChangesPerSpecies,
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching rabies history:", error);
        setLoading(false);
      }
    };

    fetchRabiesHistory();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center ">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  );

  const charts = [
    {
      label: "Species Distribution",
      content: <Pie data={data.speciesDistribution} options={{ plugins: { legend: { display: false } } }} />,
      style: "col-span-2",
    },
    {
      label: "Sex Distribution of Animals",
      content: <Bar data={data.sexDistribution} options={{ plugins: { legend: { display: false } } }} />,
      style: "col-span-2",
    },
    {
      label: "Cause of Death",
      content: <Pie data={data.causeOfDeath} options={{ plugins: { legend: { display: false } } }} />,
      style: "col-span-2",
    },
    {
      label: "Vaccination History",
      content: <Bar data={data.vaccinationHistory} options={{ plugins: { legend: { display: false } } }} />,
      style: "col-span-2",
    },
    {
      label: "Behavioral Changes in Animals",
      content: <Bar data={data.behavioralChanges} options={{ plugins: { legend: { display: false } } }} />,
      style: "col-span-2",
    },
    {
      label: "Number of Breeds",
      content: <Pie data={data.numberOfBreeds} options={{ plugins: { legend: { display: false } } }} />,
      style: "col-span-2",
    },
    {
      label: "Number of Animal Deaths per Day",
      content: <Bar data={data.deathsPerDay} options={{ plugins: { legend: { display: false } } }} />,
      style: "col-span-2",
    },
    {
      label: "Number of Rabies Cases with Vaccination History",
      content: <Pie data={data.rabiesCasesWithVaccination} options={{ plugins: { legend: { display: false } } }} />,
      style: "col-span-2",
    },
    {
      label: "Number of Behavioral Changes per Species",
      content: <Bar data={data.behavioralChangesPerSpecies} options={{ plugins: { legend: { display: false } } }} />,
      style: "col-span-2",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-darkgreen mb-4 text-center">
          Rabies History Report
        </h2>
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
          title="Rabies History Charts"
          selectedChart={selectedChart}
          setSelectedChart={setSelectedChart}
        />
      </div>
    </div>
  );
};

export default RabiesHistoryCharts;
