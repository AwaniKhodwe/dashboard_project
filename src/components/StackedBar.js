import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const StackedBarChart = ({ category, numericalColumn, data }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!category || !numericalColumn || data.length === 0) return;

    const ctx = chartRef.current.getContext("2d");

    // Get unique categories and their corresponding values
    const uniqueCategories = [...new Set(data.map((row) => row[category]))];
    const categoryData = uniqueCategories.map((cat) => ({
      category: cat,
      value: data
        .filter((row) => row[category] === cat)
        .reduce((sum, row) => sum + (row[numericalColumn] || 0), 0),
    }));

    const chart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: uniqueCategories, // Unique categories as labels
        datasets: [
          {
            label: numericalColumn,
            data: categoryData.map((item) => item.value), // Stacked values
            backgroundColor: "rgba(75, 192, 192, 0.6)",
          },
        ],
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
            title: { display: true, text: numericalColumn },
          },
        },
      },
    });

    return () => chart.destroy();
  }, [category, numericalColumn, data]);

  return <canvas ref={chartRef} />;
};

export default StackedBarChart;
