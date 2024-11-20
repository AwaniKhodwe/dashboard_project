import React, { useState } from "react";
import axios from "axios";
import ScatterPlot from "./components/Scatter";
import LineChart from "./components/Line";
import BarChart from "./components/Bar";
import PieChart from "./components/Pie";
import Histogram from "./components/Histogram";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  LineElement,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";

ChartJS.register(Title, Tooltip, LineElement, Legend, CategoryScale, LinearScale, PointElement);

function App() {
  const [columns, setColumns] = useState([]);
  const [columnTypes, setColumnTypes] = useState({});
  const [preview, setPreview] = useState([]);
  const [numericalCols, setNumericalCols] = useState([]);
  const [categoricalCols, setCategoricalCols] = useState([]);
  const [xAxis, setXAxis] = useState("");
  const [yAxis, setYAxis] = useState("");
  const [chartSuggestions, setChartSuggestions] = useState({});

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      const response = await axios.post("http://127.0.0.1:5000/upload", formData);
      const { columns: cols, types, preview: dataPreview, chart_suggestions } = response.data;
  
      setColumns(cols);
      setColumnTypes(types);
      setPreview(dataPreview);
  
      const numCols = Object.keys(types).filter((col) => types[col] === "numerical");
      const catCols = Object.keys(types).filter((col) => types[col] === "categorical");
  
      setNumericalCols(numCols);
      setCategoricalCols(catCols);
  
      let cleanedSuggestions = chart_suggestions.replace(/```json|```/g, '').trim();
      let parsedSuggestions = JSON.parse(cleanedSuggestions);
      setChartSuggestions(parsedSuggestions.charts);
    } catch (err) {
      console.error("Error uploading file:", err);
    }
  };

  console.log(chartSuggestions);

  // Helper function to render the appropriate chart component
  const renderChart = (chartType, axes) => {
    const props = {
      x: axes.x,
      y: axes.y,
      data: preview
    };

    console.log("render chart")
    console.log(chartType, axes);

    switch (chartType) {
      case "LineChart":
        return (
          <div className="w-full p-4 bg-white rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4">Line Chart</h3>
            <LineChart {...props} />
            <h1>hello1</h1>
          </div>
        );
      case "BarChart":
        return (
          <div className="w-full p-4 bg-white rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4">Bar Chart</h3>
            <BarChart {...props} />
          </div>
        );
      case "PieChart":
        return (
          <div className="w-full p-4 bg-white rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4">Pie Chart</h3>
            <PieChart category={axes.x} value={axes.y} data={preview} />
          </div>
        );
      case "ScatterPlot":
        return (
          <div className="w-full p-4 bg-white rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4">Scatter Plot</h3>
            <ScatterPlot {...props} />
          </div>
        );
      case "Histogram":
        return (
          <div className="w-full p-4 bg-white rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4">Histogram</h3>
            <Histogram column={axes.x} data={preview} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-6 text-blue-600">CSV Plot App</h1>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        className="border border-gray-300 rounded px-4 py-2 cursor-pointer"
      />
      {columns.length > 0 && (
        <>
          <div className="flex flex-col gap-4 mt-6 w-full max-w-md">
            <div>
              <label className="block text-sm font-medium mb-1">Select X-Axis:</label>
              <select
                value={xAxis}
                onChange={(e) => setXAxis(e.target.value)}
                className="w-full border border-gray-300 rounded px-4 py-2"
              >
                <option value="">Select Column</option>
                {numericalCols.map((col) => (
                  <option key={col} value={col}>
                    {col}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Select Y-Axis:</label>
              <select
                value={yAxis}
                onChange={(e) => setYAxis(e.target.value)}
                className="w-full border border-gray-300 rounded px-4 py-2"
              >
                <option value="">Select Column</option>
                {numericalCols.map((col) => (
                  <option key={col} value={col}>
                    {col}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <LineChart x={xAxis} y={yAxis} data={preview} />
            </div>
          </div>



          {/* AI Suggested Charts Section */}
                
        <div className="mt-8 w-full max-w-6xl">
          <h2 className="text-xl font-bold mb-6">Suggested Visualizations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(chartSuggestions).map(([chartType, axes]) => (
              <div key={chartType} className="w-full">
                {renderChart(chartType, axes)}
              </div>
            ))}
          </div>
        </div>
      

        </>
      )}
    </div>
  );
}

export default App;