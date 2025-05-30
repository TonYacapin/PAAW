import React, { useState, useEffect, useContext } from "react";
import axiosInstance from '../component/axiosInstance';
import { Line, Bar, Pie, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Tooltip,
  Legend,
  Title,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
} from "chart.js";
import ChartGroup from "./ChartGroup";


ChartJS.register(
  Tooltip,
  Legend,
  Title,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement
);

const RabiesReportChart = ({ filterValues }) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedChart, setSelectedChart] = useState(null);
  const [analysis, setAnalysis] = useState(""); // State for storing analysis

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(
          `/api/entries`, {
          params: {
            formStatus: 'Accepted',
            municipality: filterValues.municipality || undefined,
            startDate: filterValues.startDate || undefined,
            endDate: filterValues.endDate || undefined,
          },
        }
        );
        let reports = response.data;

      

        // Initialize count objects
        const municipalityCounts = {};
        const vaccineCounts = {};
        const dateCounts = {};
        const sexCounts = {};
        const speciesCounts = {};
        const vaccineSourceCounts = {};
        const ageCounts = {};
        const barangayCounts = {};
        const clientGenderCounts = {};
        const vaccineSpeciesCounts = {};

        reports.forEach((report) => {
          const { municipality, vaccineUsed, vaccineSource, entries, dateReported } = report;

          if (!municipalityCounts[municipality]) municipalityCounts[municipality] = 0;
          if (!vaccineCounts[vaccineUsed]) vaccineCounts[vaccineUsed] = 0;
          if (!vaccineSourceCounts[vaccineSource]) vaccineSourceCounts[vaccineSource] = 0;

          const reportDate = new Date(dateReported).toLocaleDateString();
          if (!dateCounts[reportDate]) dateCounts[reportDate] = 0;
          dateCounts[reportDate] += entries.length;

          if (!vaccineSpeciesCounts[vaccineUsed]) {
            vaccineSpeciesCounts[vaccineUsed] = {};
          }

          entries.forEach((entry) => {
            const { clientInfo, animalInfo, barangay } = entry;

            municipalityCounts[municipality] += 1;
            vaccineCounts[vaccineUsed] += 1;
            vaccineSourceCounts[vaccineSource] += 1;

            if (!speciesCounts[animalInfo.species]) speciesCounts[animalInfo.species] = 0;
            speciesCounts[animalInfo.species] += 1;

            if (!ageCounts[animalInfo.age]) ageCounts[animalInfo.age] = 0;
            ageCounts[animalInfo.age] += 1;

            if (!barangayCounts[barangay]) barangayCounts[barangay] = 0;
            barangayCounts[barangay] += 1;

            if (!sexCounts[animalInfo.sex]) sexCounts[animalInfo.sex] = 0;
            sexCounts[animalInfo.sex] += 1;

            if (!clientGenderCounts[clientInfo.gender]) clientGenderCounts[clientInfo.gender] = 0;
            clientGenderCounts[clientInfo.gender] += 1;

            if (!vaccineSpeciesCounts[vaccineUsed][animalInfo.species]) {
              vaccineSpeciesCounts[vaccineUsed][animalInfo.species] = 0;
            }
            vaccineSpeciesCounts[vaccineUsed][animalInfo.species] += 1;
          });
        });

        // Transform data for the "Species per Vaccine" chart
        const vaccineSpeciesLabels = Object.keys(vaccineSpeciesCounts);
        const speciesLabels = Array.from(
          new Set(
            vaccineSpeciesLabels.flatMap((vaccine) =>
              Object.keys(vaccineSpeciesCounts[vaccine])
            )
          )
        );

        const speciesPerVaccineDatasets = speciesLabels.map((species) => ({
          label: species,
          data: vaccineSpeciesLabels.map(
            (vaccine) => vaccineSpeciesCounts[vaccine][species] || 0
          ),
          backgroundColor: "#1b5b40", // Customize color as needed
        }));

        const chartOptions = {
          plugins: {
            legend: {
              display: selectedChart !== null,
            },
          },
        };

        // Update chart data in the component state
        setData({
          municipalityChart: {
            labels: Object.keys(municipalityCounts),
            datasets: [{
              label: "Vaccinations per Municipality",
              data: Object.values(municipalityCounts),
              backgroundColor: "#1b5b40",
            }],
            options: chartOptions,
          },
          vaccineTypeChart: {
            labels: Object.keys(vaccineCounts),
            datasets: [{
              label: "Vaccinations per Vaccine Type",
              data: Object.values(vaccineCounts),
              backgroundColor: [
                "#ffe459", "#e5cd50", "#1b5b40", "#123c29", "#252525",
              ],
            }],
            options: chartOptions,
          },
          speciesChart: {
            labels: Object.keys(speciesCounts),
            datasets: [{
              label: "Vaccinations by Animal Species",
              data: Object.values(speciesCounts),
              backgroundColor: ["#1b5b40", "#ffe459", "#123c29", "#e5cd50"],
            }],
            options: chartOptions,
          },
          dateReportedChart: {
            labels: Object.keys(dateCounts),
            datasets: [{
              label: "Vaccinations by Date Reported",
              data: Object.values(dateCounts),
              borderColor: "#1b5b40",
              backgroundColor: "rgba(27, 91, 64, 0.2)",
              fill: true,
            }],
            options: chartOptions,
          },
          vaccineSourceChart: {
            labels: Object.keys(vaccineSourceCounts),
            datasets: [{
              label: "Vaccinations by Vaccine Source",
              data: Object.values(vaccineSourceCounts),
              backgroundColor: ["#1b5b40", "#ffe459", "#123c29"],
            }],
            options: chartOptions,
          },
          ageChart: {
            labels: Object.keys(ageCounts),
            datasets: [{
              label: "Vaccinations by Animal Age",
              data: Object.values(ageCounts),
              backgroundColor: "#123c29",
            }],
            options: chartOptions,
          },
          barangayChart: {
            labels: Object.keys(barangayCounts),
            datasets: [{
              label: "Vaccinations by Barangay",
              data: Object.values(barangayCounts),
              backgroundColor: "#e5cd50",
            }],
            options: chartOptions,
          },
          animalGenderChart: {
            labels: Object.keys(sexCounts),
            datasets: [{
              label: "Vaccinations by Animal Gender",
              data: Object.values(sexCounts),
              backgroundColor: ["#1b5b40", "#ffe459"],
            }],
            options: chartOptions,
          },
          clientGenderChart: {
            labels: Object.keys(clientGenderCounts),
            datasets: [{
              label: "Vaccinations by Client Gender",
              data: Object.values(clientGenderCounts),
              backgroundColor: ["#1b5b40", "#ffe459"],
            }],
            options: chartOptions,
          },
          speciesPerVaccineChart: {
            labels: vaccineSpeciesLabels,
            datasets: speciesPerVaccineDatasets,
            options: chartOptions,
          },
        });

        // Analysis Section
        const totalVaccinations = Object.values(vaccineCounts).reduce((acc, curr) => acc + curr, 0);
        const mostVaccinatedMunicipality = Object.keys(municipalityCounts).reduce(
          (a, b) => (municipalityCounts[a] > municipalityCounts[b] ? a : b),
          ""
        );
        const mostUsedVaccine = Object.keys(vaccineCounts).reduce(
          (a, b) => (vaccineCounts[a] > vaccineCounts[b] ? a : b),
          ""
        );
        const mostVaccinatedSpecies = Object.keys(speciesCounts).reduce(
          (a, b) => (speciesCounts[a] > speciesCounts[b] ? a : b),
          ""
        );
        const mostVaccinatedBarangay = Object.keys(barangayCounts).reduce(
          (a, b) => (barangayCounts[a] > barangayCounts[b] ? a : b),
          ""
        );

        setAnalysis(
          <>
            <p>
              <strong>Total vaccinations:</strong> {totalVaccinations}.
            </p>
            <p>
              <strong>Most Vaccinated Municipality:</strong> {mostVaccinatedMunicipality} ({municipalityCounts[mostVaccinatedMunicipality]} vaccinations).
            </p>
            <p>
              <strong>Most Used Vaccine:</strong> {mostUsedVaccine}.
            </p>
            <p>
              <strong>Most Vaccinated Barangay:</strong> {mostVaccinatedBarangay} ({barangayCounts[mostVaccinatedBarangay]} vaccinations).
            </p>
            <p>
              <strong>Most Vaccinated Species:</strong> {mostVaccinatedSpecies}.
            </p>
          </>
        );

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data: ", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center py-10">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  );

  const charts = [
    {
      label: "Species per Vaccine",
      content: <Bar data={data.speciesPerVaccineChart} options={data.speciesPerVaccineChart.options} />,
      style: "col-span-2",
    },
    {
      label: "Vaccinations per Municipality",
      content: <Bar data={data.municipalityChart} options={data.municipalityChart.options} />,
      style: "col-span-2",
    },
    {
      label: "Vaccinations per Vaccine Type",
      content: <Pie data={data.vaccineTypeChart} options={data.vaccineTypeChart.options} />,
      style: "col-span-2",
    },
    {
      label: "Vaccinations by Animal Species",
      content: <Doughnut data={data.speciesChart} options={data.speciesChart.options} />,
      style: "col-span-2",
    },
    {
      label: "Vaccinations by Date Reported",
      content: <Line data={data.dateReportedChart} options={data.dateReportedChart.options} />,
      style: "col-span-2",
    },
    {
      label: "Vaccinations by Vaccine Source",
      content: <Pie data={data.vaccineSourceChart} options={data.vaccineSourceChart.options} />,
      style: "col-span-2",
    },
    {
      label: "Vaccinations by Animal Age",
      content: <Bar data={data.ageChart} options={data.ageChart.options} />,
      style: "col-span-2",
    },
    {
      label: "Vaccinations by Barangay",
      content: <Bar data={data.barangayChart} options={data.barangayChart.options} />,
      style: "col-span-2",
    },
    {
      label: "Vaccinations by Animal Gender",
      content: <Bar data={data.animalGenderChart} options={data.animalGenderChart.options} />,
      style: "col-span-2",
    },
    {
      label: "Vaccinations by Client Gender",
      content: <Bar data={data.clientGenderChart} options={data.clientGenderChart.options} />,
      style: "col-span-2",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-darkgreen mb-4 text-center">
          Rabies Vaccination Report
        </h2>
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
          title="Rabies Vaccination Report"
          selectedChart={selectedChart}
          setSelectedChart={setSelectedChart}
        />

      </div>

    </div>
  );
};

export default RabiesReportChart;
