import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';

// Register necessary components
Chart.register(ArcElement, Tooltip, Legend);

const PieChartComponent = ({ category, data }) => {
  if (!category || !data) return null;
  console.log(category,data)


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
        backgroundColor: ["#155e75", "#0891b2", "#06b6d4", "#67e8f9", "#e0f2fe"],
      },
    ],
  };

  return (
    <div className="w-1/2 grid place-self-center">
        <Pie data={chartData} />
    </div>
  )
};

export default PieChartComponent;
