import React from "react";
import CardBox from "./CardBox";

export default function ChartGroup({ charts, title, selectedChart, setSelectedChart }) {
  // Handle when a chart is clicked
  function handleOpenChart(index) {
    setSelectedChart(index);
  }

  // Reset selection to show all charts
  function hideUnselected(e) {
    e.stopPropagation(); // Prevents chart click event from firing
    setSelectedChart(null); // Resets the selection to show all charts again
  }

  // Function to clone and modify chart options
  function modifyChartOptions(chart, isZoomed) {
    const newChart = { ...chart };
    if (newChart.content && newChart.content.props && newChart.content.props.options) {
      newChart.content = React.cloneElement(newChart.content, {
        options: {
          ...newChart.content.props.options,
          plugins: {
            ...newChart.content.props.options.plugins,
            legend: {
              display: isZoomed
            }
          }
        }
      });
    }
    return newChart;
  }

  return (
    <CardBox>
      <>
        <h1 className="md:text-2xl font-bold mb-6">{title}</h1>
        <div className="">
          <div
            className={`grid ${
              selectedChart === null ? "grid-cols-4 gap-4" : "grid-cols-1"
            } pb-10 transition-all duration-[2000ms] ease-in-out`}
          >
            {charts.map((chart, index) => {
              const modifiedChart = modifyChartOptions(chart, selectedChart === index);
              return (
                <div
                  key={index}
                  className={`border p-4 rounded-lg m-1 shadow-md bg-white pb-10 transition-all duration-[2000ms] ease-in-out transform ${
                    selectedChart === null || selectedChart === index
                      ? "block opacity-100 scale-100"
                      : "hidden opacity-0 scale-95"
                  } ${selectedChart === index ? "col-span-4" : modifiedChart.style}`}
                  onClick={() => handleOpenChart(index)}
                >
                  <div className="flex flex-row">
                    <h3 className="md:text-lg font-bold mb-6">
                      {modifiedChart.label}
                    </h3>
                    {selectedChart === index && (
                      <button
                        className="absolute top-2 right-4 text-gray-500 hover:text-gray-700 text-2xl"
                        onClick={(e) => hideUnselected(e)}
                      >
                        &times;
                      </button>
                    )}
                    <div className="grow" />
                  </div>
                  {modifiedChart.content}
                </div>
              );
            })}
          </div>
        </div>
      </>
    </CardBox>
  );
}