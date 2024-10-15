import React from "react";
import { Bar, Pie, Line, Doughnut } from "react-chartjs-2";

const ChartComponent = ({ title, data, options, chartType }) => {
  const renderChart = () => {
    switch (chartType) {
      case "bar":
        return <Bar data={data} options={options} />;
      case "pie":
        return <Pie data={data} options={options} />;
      case "line":
        return <Line data={data} options={options} />;
      case "doughnut":
        return <Doughnut data={data} options={options} />;
      default:
        return null;
    }
  };

  return (
    <div className="col-span-2">
      <h4 className="text-lg font-bold">{title}</h4>
      {renderChart()}
    </div>
  );
};

export default ChartComponent;
