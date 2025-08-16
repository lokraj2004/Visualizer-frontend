// components/DonutChartWidget.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import "./DonutChart.css";

ChartJS.register(ArcElement, Tooltip, Legend);

const COLORS = [
  "#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF4560",
  "#775DD0", "#3F51B5", "#FFA600", "#546E7A", "#26A69A"
];

export default function DonutChart() {
  const [sensorIds, setSensorIds] = useState("2,3");
  const [inputValue, setInputValue] = useState("");
  const [data, setData] = useState([]);
  const [showOptions, setShowOptions] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/donut-usage", {
        sensorIds,
      });
      setData(res.data.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || "Server error");
      setData([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, [sensorIds]);

  const handleSubmit = () => {
    if (inputValue.trim()) {
      setSensorIds(inputValue.trim());
      setInputValue("");
      setShowOptions(false);
    }
  };

  // Prepare data for react-chartjs-2 Doughnut
  const chartData = {
    labels: data.map(d => `Sensor ${d.sensorId}`),
    datasets: [
      {
        data: data.map(d => d.count),
        backgroundColor: data.map((_, i) => COLORS[i % COLORS.length]),
        hoverBackgroundColor: data.map((_, i) => COLORS[i % COLORS.length]),
        borderWidth: 1,
      }
    ]
  };

  // Chart options to mimic your recharts style + show % in tooltip
  const options = {
    cutout: '50%', // donut hole size
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: { size: 14 },
        },
      },
      tooltip: {
        callbacks: {
          label: context => {
            const label = context.label || "";
            const value = context.parsed || 0;
            const total = context.chart._metasets[context.datasetIndex].total || 1;
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    }
  };

  return (
    <motion.div
      className="donut-container"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="donut-header">
        <h2 className="donut-title">Sensor Usage Overview</h2>
        <button
          className="options-btn"
          onClick={() => setShowOptions(!showOptions)}
        >
          ⋮
        </button>
        <AnimatePresence>
          {showOptions && (
            <motion.div
              className="dropdown"
              initial={{ opacity: 0, scale: 0.9, y: -5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <div className="dropdown-item">
                <label>Sensors (comma-separated)</label>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="e.g., 1,2,3"
                />
                <button onClick={handleSubmit}>Submit</button>
              </div>
              <hr />
              <div className="dropdown-item disabled">
                <label>Rename (coming soon)</label>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {error ? (
        <p className="donut-error">{error}</p>
      ) : (
        <div className="chart-wrapper" style={{ width: 350, height: 300 }}>
          <Doughnut data={chartData} options={options} />
        </div>
      )}
    </motion.div>
  );
}
