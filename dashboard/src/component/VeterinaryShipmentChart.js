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
  LineElement,
  TimeScale
} from "chart.js";
import 'chartjs-adapter-date-fns'; // For handling date in the line chart
import ChartGroup from "./ChartGroup";
import { FilterContext } from "../pages/Home/Home";

ChartJS.register(
  Tooltip,
  Legend,
  Title,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  LineElement,
  TimeScale
);

const VeterinaryShipmentChart = ({ filterValues }) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const filterOptions = useContext(FilterContext);
  const [selectedChart, setSelectedChart] = useState(null);
  const [analysis, setAnalysis] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(
          `/api/vetshipform`, {
          params: {
            startDate: filterValues.startDate || undefined,
            endDate: filterValues.endDate || undefined,
          },
        });
        const shipmentData = response.data;

        // Initialize count objects
        const shipmentCountsByType = {};
        const originCounts = {};
        const liveAnimalCounts = {};
        const animalByProductsCounts = {};
        const shipmentsByDate = {}; // For Line Chart
        const shipmentsByMonth = {}; // For Month Bar Chart

        shipmentData.forEach((shipment) => {
          const { shipmentType, pointOfOrigin, liveAnimals, animalByProducts, date } = shipment;

          // Count shipments by type
          if (!shipmentCountsByType[shipmentType]) shipmentCountsByType[shipmentType] = 0;
          shipmentCountsByType[shipmentType] += 1;

          // Count shipments by origin
          if (!originCounts[pointOfOrigin]) originCounts[pointOfOrigin] = 0;
          originCounts[pointOfOrigin] += 1;

          // Count live animals
          Object.keys(liveAnimals).forEach((animal) => {
            if (!liveAnimalCounts[animal]) liveAnimalCounts[animal] = 0;
            liveAnimalCounts[animal] += liveAnimals[animal];
          });

          // Count animal by-products
          Object.keys(animalByProducts).forEach((product) => {
            if (!animalByProductsCounts[product]) animalByProductsCounts[product] = 0;
            animalByProductsCounts[product] += animalByProducts[product];
          });

          // Count shipments over time (Line Chart)
          const shipmentDate = new Date(date).toLocaleDateString();
          if (!shipmentsByDate[shipmentDate]) shipmentsByDate[shipmentDate] = 0;
          shipmentsByDate[shipmentDate] += 1;

          // Count shipments by month (Bar Chart)
          const month = new Date(date).toLocaleString('default', { month: 'long', year: 'numeric' });
          if (!shipmentsByMonth[month]) shipmentsByMonth[month] = 0;
          shipmentsByMonth[month] += 1;
        });

        const chartOptions = {
          plugins: {
            legend: {
              display: selectedChart !== null,
            },
          },
        };

        // Update chart data in the component state
        setData({
          shipmentByTypeChart: {
            labels: Object.keys(shipmentCountsByType),
            datasets: [{
              label: "Shipments by Type",
              data: Object.values(shipmentCountsByType),
              backgroundColor: ["#ffe459", "#1b5b40", "#e5cd50"],
            }],
            options: chartOptions,
          },
          shipmentByOriginChart: {
            labels: Object.keys(originCounts),
            datasets: [{
              label: "Shipments by Origin",
              data: Object.values(originCounts),
              backgroundColor: ["#123c29", "#1b5b40", "#ffe459"],
            }],
            options: chartOptions,
          },
          liveAnimalChart: {
            labels: Object.keys(liveAnimalCounts),
            datasets: [{
              label: "Live Animals Count",
              data: Object.values(liveAnimalCounts),
              backgroundColor: "#1b5b40",
            }],
            options: chartOptions,
          },
          animalByProductChart: {
            labels: Object.keys(animalByProductsCounts),
            datasets: [{
              label: "Animal By-products Count",
              data: Object.values(animalByProductsCounts),
              backgroundColor: "#e5cd50",
            }],
            options: chartOptions,
          },
          totalShipmentsOverTime: {
            labels: Object.keys(shipmentsByDate),
            datasets: [{
              label: "Total Shipments Over Time",
              data: Object.values(shipmentsByDate),
              borderColor: "#1b5b40",
              fill: false,
              tension: 0.1
            }],
            options: {
              scales: {
                x: {
                  type: 'time',
                  time: {
                    unit: 'day'
                  }
                }
              }
            }
          },
          shipmentsByMonth: {
            labels: Object.keys(shipmentsByMonth),
            datasets: [{
              label: "Shipments by Month",
              data: Object.values(shipmentsByMonth),
              backgroundColor: "#e5cd50"
            }],
            options: chartOptions
          },
          liveAnimalPercentage: {
            labels: Object.keys(liveAnimalCounts),
            datasets: [{
              label: "Percentage of Shipments by Animal Type",
              data: Object.values(liveAnimalCounts),
              backgroundColor: ["#ffe459", "#1b5b40", "#e5cd50", "#123c29", "#252525", "#ff6347"],
            }],
            options: chartOptions
          },
        });

        // Analysis Section
        const totalShipments = shipmentData.length;
        const mostCommonShipmentType = Object.keys(shipmentCountsByType).reduce(
          (a, b) => (shipmentCountsByType[a] > shipmentCountsByType[b] ? a : b),
          ""
        );
        const mostFrequentOrigin = Object.keys(originCounts).reduce(
          (a, b) => (originCounts[a] > originCounts[b] ? a : b),
          ""
        );

        setAnalysis(
          <>
            <p>
              <strong>Total shipments:</strong> {totalShipments}.
            </p>
            <p>
              <strong>Most Common Shipment Type:</strong> {mostCommonShipmentType}.
            </p>
            <p>
              <strong>Most Frequent Origin:</strong> {mostFrequentOrigin}.
            </p>
          </>
        );

        setLoading(false);
      } catch (error) {
        console.error("Error fetching shipment data: ", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [filterOptions.filters, filterOptions.showAll, selectedChart]);

  if (loading) {
    return <div className="text-center text-lg py-10">Loading chart data...</div>;
  }

  const charts = [
    {
      label: "Shipments by Type",
      content: <Pie data={data.shipmentByTypeChart} options={data.shipmentByTypeChart.options} />,
      style: "col-span-2",
    },
    {
      label: "Shipments by Origin",
      content: <Doughnut data={data.shipmentByOriginChart} options={data.shipmentByOriginChart.options} />,
      style: "col-span-2",
    },
    {
      label: "Live Animals Count",
      content: <Bar data={data.liveAnimalChart} options={data.liveAnimalChart.options} />,
      style: "col-span-2",
    },
    {
      label: "Animal By-products Count",
      content: <Bar data={data.animalByProductChart} options={data.animalByProductChart.options} />,
      style: "col-span-2",
    },
    {
      label: "Total Shipments Over Time",
      content: <Line data={data.totalShipmentsOverTime} options={data.totalShipmentsOverTime.options} />,
      style: "col-span-2",
    },
    {
      label: "Percentage of Shipments by Animal Type",
      content: <Doughnut data={data.liveAnimalPercentage} options={data.liveAnimalPercentage.options} />,
      style: "col-span-2",
    },
    {
      label: "Shipments by Month",
      content: <Bar data={data.shipmentsByMonth} options={data.shipmentsByMonth.options} />,
      style: "col-span-2",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Veterinary Shipment Report
        </h2>
        {analysis && <div className="mb-4">{analysis}</div>}
        <ChartGroup charts={charts} selectedChart={selectedChart} setSelectedChart={setSelectedChart} />
      </div>
    </div>
  );
};

export default VeterinaryShipmentChart;
