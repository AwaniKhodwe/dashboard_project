import React from "react";
import { Scatter } from "react-chartjs-2";

const ScatterPlot = ({ x, y, data }) => {
  // Ensure all necessary props are provided
  if (!x || !y || !data) return <p>Please select valid columns for X and Y axes.</p>;

  // Prepare data for the scatter plot
  const chartData = {
    labels: data.map((row, index) => `Point ${index + 1}`), // Optional: labels for points
    datasets: [
      {
        label: `${y} vs ${x}`, // Chart label
        data: data.map((row) => ({
          x: row[x], // X-axis values
          y: row[y], // Y-axis values
        })),
        backgroundColor: "#0e7490", // Point color
        borderColor: "#1d4ed8", // Optional: border color
        borderWidth: 1,
        pointRadius: 5, // Size of points
      },
    ],
  };

  // Scatter plot options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: (context) => `(${context.raw.x}, ${context.raw.y})`, // Custom tooltip
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: x, // X-axis title
        },
      },
      y: {
        title: {
          display: true,
          text: y, // Y-axis title
        },
      },
    },
  };

  return (
    <div>
      <Scatter data={chartData} options={options} />
    </div>
  );
};

export default ScatterPlot;
