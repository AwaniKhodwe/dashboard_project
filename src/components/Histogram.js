import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const Histogram = ({ column, data }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!column || data.length === 0) return;

    const ctx = chartRef.current.getContext("2d");
    const values = data.map((row) => row[column]);
    const chart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: values,
        datasets: [
          {
            label: `Histogram (${column})`,
            data: values,
            backgroundColor: "rgba(255, 99, 132, 0.5)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: {
            title: { display: true, text: column },
          },
          y: {
            title: { display: true, text: "Frequency" },
            ticks: { beginAtZero: true },
          },
        },
      },
    });

    return () => chart.destroy();
  }, [column, data]);

  return <canvas ref={chartRef} />;
};

export default Histogram;
