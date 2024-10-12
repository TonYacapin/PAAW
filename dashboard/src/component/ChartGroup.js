import React, { useState } from "react";
import CardBox from "./CardBox";

export default function ChartGroup(props) {
  const [selectedChart, setSelectedChart] = useState(null); // Keeps track of selected chart

  // Handle when a chart is clicked
  function handleOpenChart(index) {
    setSelectedChart(index);
  }

  // Reset selection to show all charts
  function hideUnselected(e) {
    e.stopPropagation(); // Prevents chart click event from firing
    setSelectedChart(null); // Resets the selection to show all charts again
  }

  return (
    <>
      <CardBox
        content={
          <>
            <h1 className="md:text-2xl font-bold mb-6">{props.title}</h1>
            <div className="lg:max-h-[100vh] overflow-auto">
              {props.others}
              <div
                className={`grid ${
                  selectedChart === null ? "grid-cols-4 gap-4" : "grid-cols-1"
                } pb-10 transition-all duration-[2000ms] ease-in-out`}
              >
                {props.charts.map((chart, index) => (
                  <div
                    key={index}
                    className={`border p-4 rounded-lg m-1 shadow-md bg-white pb-10 transition-all duration-[2000ms] ease-in-out transform ${
                      selectedChart === null || selectedChart === index
                        ? "block opacity-100 scale-100"
                        : "hidden opacity-0 scale-95"
                    } ${selectedChart === index ? "col-span-4" : "col-span-2"}`}
                    onClick={() => handleOpenChart(index)}
                  >
                    <div className="flex flex-row ">
                      <h3 className="md:text-lg font-bold mb-6">
                        {chart.label}
                      </h3>
                      {/* Show "Go back" button when a chart is selected */}
                      {selectedChart === index && (
                        <button
                          className="absolute top-2 right-4 text-gray-500 hover:text-gray-700 text-2xl"
                          onClick={(e) => hideUnselected(e)} // Stops event propagation
                        >
                          &times;
                        </button>
                      )}
                      <div className="grow" />
                    </div>
                    {chart.content}
                  </div>
                ))}
              </div>
            </div>
          </>
        }
      />
    </>
  );
}
