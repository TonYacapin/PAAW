import React from "react";
import CardBox from "./CardBox";

export default function ChartGroup(props) {
  return (
    <div>
      <h1 className="md:text-2xl font-bold mb-6">{props.title}</h1>
      {props.others}
      <div className="pb-10">
        {props.charts.map((chart, index) => (
          <CardBox
            content={
              <div key={index}>
                <h3 className="md:text-lg font-bold mb-6">{chart.label}</h3>
                {chart.content}
              </div>
            }
          />
        ))}
      </div>
    </div>
  );
}
