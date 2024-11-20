import React from "react";
import { Line } from "react-chartjs-2";

const LineChart = ({ x, y, data }) => {
  // Ensure all necessary props are provided
  if (!x || !y || !data) return <p>Please select valid columns for X and Y axes.</p>;

  // Sort data by x-axis values (area) in ascending order
  const sortedData = [...data].sort((a, b) => a[x] - b[x]);

  // Aggregate data to handle duplicate x values
  const aggregatedData = sortedData.reduce((acc, row) => {
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

  // Prepare final sorted data points
  const dataPoints = Object.entries(aggregatedData).map(([key, value]) => ({
    x: Number(key),
    y: value.total / value.count
  }));

  // Sort data points by both x and y in ascending order
  const sortedDataPoints = dataPoints.sort((a, b) => a.x - b.x);

  // Prepare data for the line chart
  const chartData = {
    labels: sortedDataPoints.map(point => point.x),
    datasets: [
      {
        label: `${y} vs ${x}`,
        data: sortedDataPoints.map(point => point.y),
        borderColor: "#00CED1",
        backgroundColor: "rgba(0, 206, 209, 0.1)",
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: "#00CED1",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
      },
    ],
  };

  // Line chart options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: (context) => 
            `${y}: ${context.raw.toLocaleString()}`,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: x,
        },
        grid: {
          display: true,
          drawBorder: true,
        },
        ticks: {
          autoSkip: true,
          maxRotation: 45,
        },
        type: 'linear',
        position: 'bottom',
      },
      y: {
        title: {
          display: true,
          text: y,
        },
        grid: {
          display: true,
          drawBorder: true,
        },
        ticks: {
          callback: (value) => value.toLocaleString(),
        },
        beginAtZero: false,
      },
    },
  };

  return (
    <div className="w-full h-full">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default LineChart;