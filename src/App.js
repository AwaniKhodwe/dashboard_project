import React, { useState } from "react";
import axios from "axios";
import ScatterPlot from "./components/Scatter";
import LineChart from "./components/Line";
import BarChart from "./components/Bar";
import PieChart from "./components/Pie";
import Histogram from "./components/Histogram";
import StackedBarChart from "./components/StackedBar"
import BubbleChart from "./components/Bubble";
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
  const [Size, setSize] = useState("");
  const [chartSuggestions, setChartSuggestions] = useState({});
  const [chartType, setChartType] = useState(null);

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

      // console.log(types)
  
      const numCols = Object.keys(types).filter((col) => types[col] === "numerical");
      const catCols = Object.keys(types).filter((col) => types[col] === "categorical");
  
      setNumericalCols(numCols);
      setCategoricalCols(catCols);

      // console.log(numericalCols)
      // console.log(categoricalCols)
  
      let cleanedSuggestions = chart_suggestions.replace(/```json|```/g, '').trim();
      console.log(cleanedSuggestions)
      let parsedSuggestions = JSON.parse(cleanedSuggestions);
      setChartSuggestions(parsedSuggestions.charts);
    } catch (err) {
      console.error("Error uploading file:", err);
    }
  };

//   console.log(chartSuggestions);
  if (!chartSuggestions || typeof chartSuggestions !== 'object') {
    console.error('Invalid data:', chartSuggestions);
    return <div>Error: Data is not available</div>;
}

const chartOptions = {
  "numerical-numerical": ["Line", "Scatter", "Bubble"],
  "categorical-numerical": ["Bar", "StackedBar", "Pie"],
};

const getAvailableCharts = () => {
  if (!xAxis && !yAxis) return [];
  if (!yAxis && columnTypes[xAxis]==='numerical') return ['Histogram']
  if (!yAxis) return []
  const xType = columnTypes[xAxis];
  const yType = columnTypes[yAxis];
  const combination = `${xType}-${yType}`;
  return chartOptions[combination] || [];
};

const handleChartClick = (type) => {
  setChartType(type);
};


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
        return <LineChart {...props} />
      case "BarChart":
        return <BarChart {...props} />
      case "PieChart":
        return <PieChart category={axes.x} value={axes.y} data={preview} />
      case "ScatterPlot":
        return <ScatterPlot {...props} />
      case "Histogram":
        return <Histogram column={axes.x} data={preview} />
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-cyan-900/20 flex flex-col items-center p-6">
      <h1 className="text-5xl font-extrabold bg-clip-text text-cyan-900 tracking-tight p-5">Data Visualization</h1>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:text-sm file:font-semibold file:bg-blue-50 file:text-cyan-900 hover:file:bg-blue-100 border-blue-200 rounded-lg p-2 text-gray-600"
        />
      {columns.length > 0 && (
        <>
          <div className="w-full max-w-2xl">
            <div className="flex flex-col gap-4 mt-6 items-center">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <label className="whitespace-nowrap rounded-lg bg-cyan-900 text-white px-4 py-2.5 text-sm font-medium">Select X-Axis:</label>
                <select
                  value={xAxis}
                  onChange={(e) => setXAxis(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-gray-700 focus:outline-none focus:border-cyan-900 focus:ring-2 focus:ring-blue-200 transition-colors duration-200 bg-white shadow-sm hover:border-gray-300"
                >
                  <option value="" className="text-gray-500">Select Column</option>
                  {columns.map((col) => (
                    <option key={col} value={col} className="text-gray-700">
                      {col}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className="whitespace-nowrap rounded-lg bg-cyan-900 text-white px-4 py-2.5 text-sm font-medium">Select Y-Axis:</label>
                <select
                  value={yAxis}
                  onChange={(e) => setYAxis(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-gray-700 focus:outline-none focus:border-cyan-900 focus:ring-2 focus:ring-blue-200 transition-colors duration-200 bg-white shadow-sm hover:border-gray-300"
                >
                  <option value="" className="text-gray-500">Select Column</option>
                  {columns.map((col) => (
                    <option key={col} value={col} className="text-gray-700">
                      {col}
                    </option>
                  ))}
                </select>
              </div>
              </div>
            {xAxis && !yAxis && (
              <div className="flex items-center m-4">
              {/* <h3 className="text-lg font-medium m-4">Possible Charts:</h3> */}
              <div className="flex gap-2">
                {getAvailableCharts().map((chart) => (
                  <button
                    key={chart}
                    onClick={() => handleChartClick(chart)}
                    className="bg-cyan-900 text-white px-4 py-2 rounded hover:bg-cyan-700"
                  >
                    {chart} Chart
                  </button>
                ))}
              </div>
            </div>
            )}
            {xAxis && yAxis && (
              <div className="flex items-center m-4">
                {/* <h3 className="text-lg font-medium m-4">Possible Charts:</h3> */}
                <div className="flex gap-2">
                  {getAvailableCharts().map((chart) => (
                    <button
                      key={chart}
                      onClick={() => handleChartClick(chart)}
                      className="bg-cyan-900 text-white px-4 py-2 rounded hover:bg-cyan-700"
                    >
                      {chart} Chart
                    </button>
                  ))}
                </div>
              </div>
            )}
            {chartType === 'Bubble' &&
                <div className="flex items-center gap-2">
                <label className="whitespace-nowrap rounded-lg bg-cyan-900 text-white px-4 py-2.5 text-sm font-medium">Select Size:</label>
                <select
                  value={Size}
                  onChange={(e) => setSize(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-gray-700 focus:outline-none focus:border-cyan-900 focus:ring-2 focus:ring-blue-200 transition-colors duration-200 bg-white shadow-sm hover:border-gray-300"
                >
                  <option value="" className="text-gray-500">Select Column</option>
                  {numericalCols.map((col) => (
                    <option key={col} value={col} className="text-gray-700">
                      {col}
                    </option>
                  ))}
                </select>
              </div>
            }
            </div>
              {chartType && !(chartType==='Bubble' && !(Size)) && (
                <div className="mt-6 p-6 border-2 border-gray-200 rounded-xl bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                  {chartType === "Line" && <LineChart x={xAxis} y={yAxis} data={preview} />}
                  {chartType === "Scatter" && <ScatterPlot x={xAxis} y={yAxis} data={preview} />}
                  {chartType === "Bubble" && <BubbleChart x={xAxis} y={yAxis} size={Size} data={preview} />}
                  {chartType === "Bar" && <BarChart x={xAxis} y={yAxis} data={preview} />}
                  {chartType === "StackedBar" && <StackedBarChart category={xAxis} numericalColumn={yAxis} data={preview} />}
                  {chartType === "Pie" && <PieChart category={xAxis} data={preview} />}
                  {chartType === "Histogram" && <Histogram column={xAxis} data={preview} />}
                </div>
              )}
          </div>



          {/* AI Suggested Charts Section */}
                
        <div className="p-16 rounded-xl bg-cyan-900/70 shadow-2xl m-10  w-11/12">
          <h2 className="text-3xl font-bold mb-10 text-white text-center">Suggested Dashboard</h2>
          <div className="mt-8 w-full mx-auto">
            <div className={`grid ${Object.keys(chartSuggestions).length <= 4 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-3'} gap-5`}>
              {Object.entries(chartSuggestions).map(([chartType, axes]) => (
                <div key={chartType} className="bg-white p-3 rounded-lg border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
                  <h3 className="text-lg font-semibold mb-2 p-1 text-center bg-cyan-900/75 text-white">{chartType} Chart</h3>
                  {renderChart(chartType, axes)}
                </div>
              ))}
            </div>
          </div>
        </div>
      

        </>
      )}
    </div>
  );
}

export default App;