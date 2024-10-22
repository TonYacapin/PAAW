import React from 'react';
import { Bar, Doughnut, Pie } from 'react-chartjs-2';

const ChartComponent = ({ title, data, options, chartType }) => {
  let Chart;
  switch (chartType) {
    case 'bar':
      Chart = Bar;
      break;
    case 'doughnut':
      Chart = Doughnut;
      break;
    case 'pie':
      Chart = Pie;
      break;
    default:
      Chart = Bar; 
  }

  return (
    <div className="chart-container">
      <h2>{title}</h2>
      <Chart data={data} options={options} />
    </div>
  );
};

export default ChartComponent;
