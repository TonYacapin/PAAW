import React, { useEffect, useState } from "react";
import { Bar, Pie, Line } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  TimeScale,
} from "chart.js";
import ChartGroup from "./ChartGroup";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  TimeScale,
  Title,
  Tooltip,
  Legend
);

const OffSpringMonitoringChart = () => {
  const [chartData, setChartData] = useState({
    municipalityData: { labels: [], datasets: [] },
    speciesData: { labels: [], datasets: [] },
    timeData: { labels: [], datasets: [] },
  });

  const [selectedChart, setSelectedChart] = useState(null); // State for tracking selected chart

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/offspring-monitoring`
        );
        const data = response.data;

        // Process data for all charts
        const municipalityData = processDataByMunicipality(data);
        const speciesData = processDataBySpecies(data);
        const timeData = processDataByTime(data);

        setChartData({
          municipalityData,
          speciesData,
          timeData,
        });
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

  const processDataByMunicipality = (data) => {
    const municipalityData = data.reduce((acc, curr) => {
      const { municipality, entries } = curr;
      if (!acc[municipality]) {
        acc[municipality] = 0;
      }
      acc[municipality] += entries.length;
      return acc;
    }, {});

    return {
      labels: Object.keys(municipalityData),
      datasets: [
        {
          label: "Offspring Monitored by Municipality",
          data: Object.values(municipalityData),
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    };
  };

  const processDataBySpecies = (data) => {
    const speciesData = data.reduce((acc, curr) => {
      curr.entries.forEach((entry) => {
        const { species } = entry;
        if (!acc[species]) {
          acc[species] = 0;
        }
        acc[species] += 1;
      });
      return acc;
    }, {});
  
    return {
      labels: Object.keys(speciesData),
      datasets: [
        {
          label: "Offspring Distribution by Species",
          data: Object.values(speciesData),
          backgroundColor: [
            "#ffe459", // pastelyellow
            "#e5cd50", // darkerpastelyellow
            "#1b5b40", // darkgreen
            "#123c29", // darkergreen
            "#252525", // black
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)", // Keeping the borders for visibility
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  const processDataByTime = (data) => {
    const timeData = data.reduce((acc, curr) => {
      const { dateReported, entries } = curr;
      const date = new Date(dateReported).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date] += entries.length;
      return acc;
    }, {});

    return {
      labels: Object.keys(timeData),
      datasets: [
        {
          label: "Offspring Monitored Over Time",
          data: Object.values(timeData),
          fill: false,
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderWidth: 1,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
      },
    },
  };

  const charts = [
    {
      label: "Offspring Monitored by Municipality",
      content: (
        <Bar data={chartData.municipalityData} options={chartOptions} />
      ),
      style: "col-span-2",
    },
    {
      label: "Offspring Distribution by Species",
      content: <Pie data={chartData.speciesData} options={chartOptions} />,
      style: "col-span-2",
    },
    {
      label: "Offspring Monitoring Over Time",
      content: <Line data={chartData.timeData} options={chartOptions} />,
      style: "col-span-2",
    },
  ];

  return (
    <ChartGroup
      charts={charts}
      title="Offspring Monitoring Report"
      selectedChart={selectedChart}
      setSelectedChart={setSelectedChart}
    />
  );
};

export default OffSpringMonitoringChart;
