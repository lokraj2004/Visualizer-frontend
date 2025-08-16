// components/ColumnWidget.jsx
import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { motion, AnimatePresence } from "framer-motion";
import "./ColumnWidget.css";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler
);

export default function ColumnWidget({ defaultSensorIds = "1", defaultView = "monthly" }) {
  const [sensorIds, setSensorIds] = useState(defaultSensorIds);
  const [viewType, setViewType] = useState(defaultView);
  const [data, setData] = useState([]);
  const [showOptions, setShowOptions] = useState(false);
  const [inputIds, setInputIds] = useState("");
  const [error, setError] = useState("");

  const fetchUsage = () => {
    fetch(`http://localhost:5000/api/usage_stats/${viewType}?sensors=${sensorIds}`)
      .then(res => res.json())
      .then(json => {
        if (json.error) throw new Error(json.error);
        setData(json);
        setError("");
      })
      .catch(err => {
        setError(err.message);
        setData([]);
      });
  };

  useEffect(() => {
    fetchUsage();
  }, [sensorIds, viewType]);

  const handleSensorSubmit = () => {
    if (inputIds.trim()) {
      fetch(`http://localhost:5000/api/usage_stats/${viewType}?sensors=${inputIds}`)
        .then(res => {
          if (!res.ok) throw new Error("Invalid sensor ID(s)");
          return res.json();
        })
        .then(json => {
          setSensorIds(inputIds);
          setData(json);
          setShowOptions(false);
          setError("");
        })
        .catch(err => setError(err.message));
    }
  };

  // Prepare Chart.js data structure
  const chartData = {
    labels: data.map(d => d.period),
    datasets: [
      {
        label: "Total Usage",
        data: data.map(d => d.total),
        backgroundColor: function(context) {
          const chart = context.chart;
          const {ctx, chartArea} = chart;
          if (!chartArea) return null;

          // Create gradient like Recharts linearGradient
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, "rgba(78, 115, 223, 0.9)"); // #4e73df with 0.9 opacity
          gradient.addColorStop(1, "rgba(34, 74, 190, 0.7)");  // #224abe with 0.7 opacity
          return gradient;
        },
        borderRadius: 4,
        borderSkipped: false,
      }
    ]
  };

  // Chart.js options replicating your recharts config
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          color: "#555"
        },
        grid: {
          display: false
        }
      },
      y: {
        ticks: {
          color: "#555"
        },
        grid: {
          color: "#e0e0e0",
          borderDash: [3, 3]
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: "#fff",
        borderColor: "#ddd",
        borderWidth: 1,
        cornerRadius: 8,
        titleColor: "#333",
        bodyColor: "#333"
      }
    }
  };

  return (
    <motion.div 
      className="column-widget"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{ height: 300, width: 550 }}
    >
      <div className="widget-header">
        <h3>📊 Usage Chart</h3>
        <div className="options-container">
          <button className="options-btn" onClick={() => setShowOptions(!showOptions)}>⚙</button>
          <AnimatePresence>
            {showOptions && (
              <motion.div
                className="dropdown"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <div className="dropdown-item">
                  <label>View:</label>
                  <select value={viewType} onChange={e => setViewType(e.target.value)}>
                    <option value="daywise">Daywise</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
                <div className="dropdown-item">
                  <label>Sensors:</label>
                  <input
                    type="text"
                    value={inputIds}
                    onChange={e => setInputIds(e.target.value)}
                    placeholder="e.g., 1,4,5"
                  />
                  <button onClick={handleSensorSubmit}>Apply</button>
                </div>
                {error && <div className="error">{error}</div>}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div style={{ width: "100%", height: "100%" }}>
        <Bar data={chartData} options={options} />
      </div>
    </motion.div>
  );
}
