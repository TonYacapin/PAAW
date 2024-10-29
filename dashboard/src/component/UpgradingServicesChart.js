
import React, { useState, useEffect, useContext } from "react";
import axiosInstance from '../component/axiosInstance';
import { Bar, Line, Pie, Doughnut } from "react-chartjs-2";
import ChartGroup from "./ChartGroup"; // Ensure this component is set up properly
import { FilterContext } from "../pages/Home/Home"; // Ensure this context is correct

const UpgradingServicesChart = ({ filterValues }) => {
  const [data, setData] = useState({
    municipalityChart: {},
    dateReportedChart: {},
    activityChart: {},
    speciesChart: {},
    estrusChart: {},
  });
  const [loading, setLoading] = useState(true);
  const filterOptions = useContext(FilterContext);
  const [selectedChart, setSelectedChart] = useState(null);
  const [analysis, setAnalysis] = useState(""); // State for storing analysis

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('/api/upgrading-services', {
          params: {
            formStatus: 'Accepted',
            municipality: filterValues.municipality || undefined,
            startDate: filterValues.startDate || undefined,
            endDate: filterValues.endDate || undefined,
          },
        }
);

      

        let services = response.data;

        // Initialize count objects
        const municipalityCounts = {};
        const dateCounts = {};
        const activityCounts = {};
        const speciesCounts = {};
        const estrusCounts = {};

        services.forEach((service) => {
          const { municipality, dateReported, entries } = service;

          // Count entries by municipality
          if (!municipalityCounts[municipality]) municipalityCounts[municipality] = 0;
          municipalityCounts[municipality] += entries.length;

          // Count entries by date
          const reportDate = new Date(dateReported).toLocaleDateString();
          if (!dateCounts[reportDate]) dateCounts[reportDate] = 0;
          dateCounts[reportDate] += entries.length;

          entries.forEach((entry) => {
            const { activityType, animalInfo } = entry;

            // Count activities
            if (!activityCounts[activityType]) activityCounts[activityType] = 0;
            activityCounts[activityType] += 1;

            // Count estrus occurrences
            if (animalInfo.isEstrus) {
              if (!estrusCounts[activityType]) estrusCounts[activityType] = 0;
              estrusCounts[activityType] += 1;
            }

            // Count species
            if (!speciesCounts[animalInfo.species]) speciesCounts[animalInfo.species] = 0;
            speciesCounts[animalInfo.species] += 1;
          });
        });

        // Set the chart data
        setData({
          municipalityChart: {
            labels: Object.keys(municipalityCounts),
            datasets: [{
              label: "Number of Entries Per Municipality",
              data: Object.values(municipalityCounts),
              backgroundColor: "#1b5b40",
            }],
          },
          dateReportedChart: {
            labels: Object.keys(dateCounts),
            datasets: [{
              label: "Number of Entries Per Dates Reported",
              data: Object.values(dateCounts),
            
              backgroundColor: "#ffe459",
              fill: true,
            }],
          },
          activityChart: {
            labels: Object.keys(activityCounts),
            datasets: [{
              label: "Number of Activities",
              data: Object.values(activityCounts),
              backgroundColor: "#ffe459",
            }],
          },
          speciesChart: {
            labels: Object.keys(speciesCounts),
            datasets: [{
              label: "Number of Activities Per Species",
              data: Object.values(speciesCounts),
              backgroundColor: ["#1b5b40", "#ffe459", "#123c29", "#e5cd50"],
            }],
          },
          estrusChart: {
            labels: Object.keys(estrusCounts),
            datasets: [{
              label: "Number of Estrus Per Activity",
              data: Object.values(estrusCounts),
              backgroundColor: "#f44336",
            }],
          },
        });

           // Analysis Section
           const totalActivities = Object.values(activityCounts).reduce((acc, curr) => acc + curr, 0);
           const mostReportedSpecies = Object.keys(speciesCounts).reduce(
             (a, b) => (speciesCounts[a] > speciesCounts[b] ? a : b),
             ""
           );
           const busiestMunicipality = Object.keys(municipalityCounts).reduce(
             (a, b) => (municipalityCounts[a] > municipalityCounts[b] ? a : b),
             ""
           );
   
           setAnalysis(
             <>
               <p>
                 <strong>Total Activities:</strong> {totalActivities}.
               </p>
               <p>
                 <strong>Most Reported Species:</strong> {mostReportedSpecies} ({speciesCounts[mostReportedSpecies]} times).
               </p>
               <p>
                 <strong>Busiest Municipality:</strong> {busiestMunicipality} ({municipalityCounts[busiestMunicipality]} entries).
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
  }, [filterOptions.filters, filterOptions.showAll]);

  if (loading) {
    return <div className="text-center text-lg py-10">Loading chart data...</div>;
  }

  // Prepare charts for ChartGroup
  const charts = [
    {
      label: "Municipality Chart",
      content: <Bar data={data.municipalityChart} />,
      style: "col-span-2",
    },
    {
      label: "Date Reported Chart",
      content: <Line data={data.dateReportedChart} />,
      style: "col-span-2",
    },
    {
      label: "Activity Chart",
      content: <Bar data={data.activityChart} />,
      style: "col-span-2",
    },
    {
      label: "Species Chart",
      content: <Pie data={data.speciesChart} />,
      style: "col-span-2",
    },
    {
      label: "Estrus Chart",
      content: <Doughnut data={data.estrusChart} />,
      style: "col-span-2",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-6">
    <h2 className="text-2xl font-bold text-darkgreen mb-4 text-center">Upgrading Services Report</h2>

    {/* Analysis Section */}
    <div className="mt-8 p-6 bg-white border border-gray-200 shadow-md rounded-lg">
      <h3 className="text-2xl font-bold text-darkgreen border-b-2 border-darkgreen pb-2">Analysis</h3>
      <p className="text-gray-800 mt-4 text-lg leading-relaxed">
        {analysis}
      </p>
    </div>

    <ChartGroup
      charts={charts}
      title="Chart Overview"
      selectedChart={selectedChart}
      setSelectedChart={setSelectedChart}
    />
  </div>
  );
};

export default UpgradingServicesChart;
