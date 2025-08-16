// LineGraph.jsx
import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import "./LineGraph.css";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const colors = [
  "#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#413ea0",
  "#ff69b4", "#00bcd4", "#4caf50", "#e91e63", "#9c27b0"
];

const LineGraph = () => {
  const [data, setData] = useState([]);
  const [sensorIds, setSensorIds] = useState("1,2");
  const [mode, setMode] = useState("daywise");
  const [showDropdown, setShowDropdown] = useState(false);
  const [inputSensor, setInputSensor] = useState("");

  const fetchData = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/linegraph?sensorIds=${sensorIds}&mode=${mode}`);

      if (!response.ok) {
        const htmlError = await response.text();
        console.error("Non-JSON response:", htmlError);
        alert("Server error or invalid response. Check console.");
        return;
      }

      const result = await response.json();

      if (result.error) {
        alert(result.error);
        return;
      }

      const formatted = Object.keys(result).map((timestamp) => {
        const row = { timestamp };
        for (const sid in result[timestamp]) {
          row[`Sensor ${sid}`] = result[timestamp][sid];
        }
        return row;
      });

      setData(formatted);
    } catch (err) {
      console.error("Fetch error:", err);
      alert("Could not fetch data. Is the Flask backend running?");
    }
  };

  useEffect(() => {
    fetchData();
  }, [sensorIds, mode]);

  // Prepare labels (timestamps)
  const labels = data.map(d => d.timestamp);

  // Get all sensor keys (exclude timestamp)
  const sensorKeys = data.length > 0 ? Object.keys(data[0]).filter(k => k !== "timestamp") : [];

  // Prepare datasets for Chart.js
  const datasets = sensorKeys.map((key, index) => ({
    label: key,
    data: data.map(d => d[key]),
    borderColor: colors[index % colors.length],
    backgroundColor: colors[index % colors.length],
    fill: false,
    tension: 0.3,
    pointRadius: 0,
    borderWidth: 2,
  }));

  const chartData = {
    labels,
    datasets,
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: { color: "#555" },
        grid: { display: false },
      },
      y: {
        ticks: { color: "#555" },
        grid: { color: "#e0e0e0", borderDash: [3, 3] },
      },
    },
    plugins: {
      legend: {
        position: "bottom",
        labels: { color: "#333" },
      },
      tooltip: {
        backgroundColor: "#fff",
        borderColor: "#ddd",
        borderWidth: 1,
        cornerRadius: 8,
        titleColor: "#333",
        bodyColor: "#333",
      },
    },
  };

  return (
    <div className="widget-container" style={{ height: 320 }}>
      <div className="widget-header">
        <h3>Sensor Usage - Line Graph</h3>
        <div
          className="options-button"
          onClick={() => setShowDropdown(!showDropdown)}
          style={{ cursor: "pointer" }}
        >
          ⋮
        </div>
        {showDropdown && (
          <div className="dropdown">
            <div className="dropdown-item">
              <label>View Mode</label>
              <select value={mode} onChange={(e) => setMode(e.target.value)}>
                <option value="daywise">Daywise</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            <div className="dropdown-item">
              <label>Sensors</label>
              <input
                value={inputSensor}
                onChange={(e) => setInputSensor(e.target.value)}
                placeholder="e.g., 1,2,3"
              />
              <button
                onClick={() => {
                  setSensorIds(inputSensor);
                  setShowDropdown(false);
                }}
              >
                Apply
              </button>
            </div>
          </div>
        )}
      </div>

      <Line data={chartData} options={options} />
    </div>
  );
};

export default LineGraph;
