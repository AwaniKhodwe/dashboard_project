import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';

// Register necessary components
Chart.register(ArcElement, Tooltip, Legend);


const PieChartComponent = ({ category, data }) => {
  if (!category || !data) return null;

  const aggregatedData = data.reduce((acc, row) => {
    acc[row[category]] = (acc[row[category]] || 0) + 1;
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(aggregatedData),
    datasets: [
      {
        label: `Distribution of ${category}`,
        data: Object.values(aggregatedData),
        backgroundColor: ["#2563eb", "#f97316", "#34d399", "#e11d48", "#6366f1"],
      },
    ],
  };

  return <Pie data={chartData} />;
};

export default PieChartComponent;
