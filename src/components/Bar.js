import React from "react";
import { Bar } from "react-chartjs-2";

const BarChart = ({ x, y, data }) => {
  // Ensure all necessary props are provided
  if (!x || !y || !data) return <p>Please select valid columns for X and Y axes.</p>;

  // Aggregate data by furnishing status
  const aggregatedData = data.reduce((acc, row) => {
    const key = row[x];
    if (!acc[key]) {
      acc[key] = {
        count: 1,
        total: row[y]
      };
    } else {
      acc[key].count += 1;
      acc[key].total += row[y];
    }
    return acc;
  }, {});

  // Calculate averages and prepare final data
  const labels = Object.keys(aggregatedData);
  const values = labels.map(label => 
    aggregatedData[label].total / aggregatedData[label].count
  );

  // Prepare data for the bar chart
  const chartData = {
    labels: labels,
    datasets: [
      {
        label: `Average ${y} vs ${x}`,
        data: values,
        backgroundColor: "#4CAF50",
        borderColor: "#388E3C",
        borderWidth: 1,
      },
    ],
  };

  // Bar chart options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: (context) => `Average ${y}: ${context.raw.toLocaleString()}`,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: x,
        },
        ticks: {
          autoSkip: true,
          maxRotation: 45,
        },
      },
      y: {
        title: {
          display: true,
          text: `Average ${y}`,
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="w-full h-full">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default BarChart;