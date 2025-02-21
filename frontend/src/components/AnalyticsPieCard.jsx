import React, { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function AnalyticsPieCard({
  uniqueKey,
  parameterLabel,
  parameterValue,
  parameterDesc,
  labelsList,
  dataList,
}) {
  const [legendPosition, setLegendPosition] = useState(
    window.innerWidth < 900 ? "bottom" : "left"
  );

  useEffect(() => {
    const handleResize = () => {
      setLegendPosition(window.innerWidth < 768 ? "bottom" : "left");
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const data = {
    labels: labelsList,
    datasets: [
      {
        data: dataList,
        backgroundColor: ["#05203c", "#0f457a"],
        hoverBackgroundColor: ["#05203c", "#0f457a"],
      },
    ],
  };

  const options = {
    maintainAspectRatio: false, // Allows dynamic resizing
    responsive: true, // Ensures responsiveness
    plugins: {
      legend: {
        display: true,
        position: legendPosition,
        labels: {
          boxWidth: 12, // Reduce legend box size
          padding: 10, // Add spacing between items
        },
      },
      tooltip: {
        enabled: true,
      },
    },
    layout: {
      padding: 10, // Adds space around the chart
    },
  };

  return (
    <div className=" border bg-white rounded-md p-3 flex flex-col justify-evenly">
      <div className="font-semibold">{parameterLabel}</div>
      <div className="text-3xl font-bold">{parameterValue}</div>
      <div className="text-xs text-gray-500">{parameterDesc}</div>
      <div className="h-32 w-full">
        <Doughnut
          key={uniqueKey}
          className="h-full w-full"
          data={data}
          options={options}
        />
      </div>
    </div>
  );
}
