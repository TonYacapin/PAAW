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
import { FilterContext } from "../pages/Home/Home";

ChartJS.register(
  Tooltip,
  Legend,
  Title,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement
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

        shipmentData.forEach((shipment) => {
          const { shipmentType, pointOfOrigin, liveAnimals, animalByProducts } = shipment;

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
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-darkgreen mb-4 text-center">
          Veterinary Shipment Report
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
          title="Veterinary Shipment Report"
          selectedChart={selectedChart}
          setSelectedChart={setSelectedChart}
        />
      </div>
    </div>
  );
};

export default VeterinaryShipmentChart;
