import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Bar, Line, Pie, Doughnut } from "react-chartjs-2";
import ChartGroup from "./ChartGroup"; // Ensure this component is set up properly
import { FilterContext } from "../pages/Home/Home"; // Ensure this context is correct

const UpgradingServicesChart = () => {
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/upgrading-services`
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
              borderColor: "#ff5722",
              backgroundColor: "rgba(255, 87, 34, 0.2)",
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
    },
    {
      label: "Date Reported Chart",
      content: <Line data={data.dateReportedChart} />,
    },
    {
      label: "Activity Chart",
      content: <Bar data={data.activityChart} />,
    },
    {
      label: "Species Chart",
      content: <Pie data={data.speciesChart} />,
    },
    {
      label: "Estrus Chart",
      content: <Doughnut data={data.estrusChart} />,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold text-darkgreen mb-4 text-center">Upgrading Services Report</h2>
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
