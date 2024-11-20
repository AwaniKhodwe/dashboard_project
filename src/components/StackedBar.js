import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const StackedBarChart = ({ category, values, data }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!category || values.length === 0 || data.length === 0) return;

    const ctx = chartRef.current.getContext("2d");
    const chart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: [...new Set(data.map((row) => row[category]))],
        datasets: values.map((value, index) => ({
          label: value,
          data: data.map((row) => row[value]),
          backgroundColor: `rgba(${index * 50}, ${index * 100}, 200, 0.5)`,
        })),
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: "top" },
        },
        scales: {
          x: {
            stacked: true,
            title: { display: true, text: category },
          },
          y: {
            stacked: true,
            title: { display: true, text: "Value" },
          },
        },
      },
    });

    return () => chart.destroy();
  }, [category, values, data]);

  return <canvas ref={chartRef} />;
};

export default StackedBarChart;
