import React from "react";
import CardBox from "./CardBox";

export default function ChartGroup(props) {
  return (
    <>
      <CardBox
        content={
          <>
            <h1 className="md:text-2xl font-bold mb-6">{props.title}</h1>
            <div className="lg:max-h-[100vh] overflow-auto">
              {props.others}
              <div className="grid grid-cols-4 pb-10">
                {props.charts.map((chart, index) => (
                  <div
                    key={index}
                    className={
                      "border p-4 rounded-lg m-1 shadow-md bg-white pb-10 " +
                      chart.style
                    }
                  >
                    <h3 className="md:text-lg font-bold mb-6">{chart.label}</h3>
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
