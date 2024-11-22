import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const BubbleChart = ({ x, y, size, data }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!x || !y || !size || data.length === 0) return;

    const ctx = chartRef.current.getContext("2d");
    const chart = new Chart(ctx, {
      type: "bubble",
      data: {
        datasets: [
          {
            label: "Bubble Chart",
            data: data.map((row) => ({
              x: row[x],
              y: row[y],
              r: row[size]*5, // Scale the bubble size
            })),
            backgroundColor: "rgba(14, 116, 144, 0.5)",
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: {
            title: { display: true, text: x },
          },
          y: {
            title: { display: true, text: y },
          },
        },
      },
    });

    return () => chart.destroy();
  }, [x, y, size, data]);

  return <canvas ref={chartRef} />;
};

export default BubbleChart;
