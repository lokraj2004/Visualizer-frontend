// src/components/widgets/LineGraphWidget.jsx
import React, { useEffect, useState, useRef } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { MoreVertical } from "lucide-react";
import io from "socket.io-client";
import "./RealtimeLineGraph.css";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const socket = io("http://localhost:5000");

const RealtimeLineGraph = () => {
  const [sensorIds, setSensorIds] = useState(["1"]);
  const [graphData, setGraphData] = useState([]);
  const [input, setInput] = useState("");
  const [showInput, setShowInput] = useState(false);

  // Using useRef to avoid stale closure issues on socket event
  const sensorIdsRef = useRef(sensorIds);
  sensorIdsRef.current = sensorIds;

  useEffect(() => {
    const sensorIdsStr = sensorIds.join(",");
    socket.emit("line_graph_subscribe", { sensorIds: sensorIdsStr });

    const handleGraphData = (data) => {
      const grouped = {};
      data.forEach((d) => {
        const ts = d.timestamp;
        if (!grouped[ts]) grouped[ts] = { timestamp: ts };
        grouped[ts][`sensor_${d.sensorId}`] = d.value;
      });

      const sorted = Object.values(grouped).sort(
        (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
      );

      setGraphData(sorted);
    };

    socket.on("line_graph_data", handleGraphData);
    return () => {
      socket.off("line_graph_data", handleGraphData);
    };
  }, [sensorIds]);

  const handleSensorChange = () => {
    const ids = input
      .split(",")
      .map((id) => id.trim())
      .filter((id) => id && !isNaN(id));

    if (ids.length > 0) {
      setSensorIds(ids);
      setGraphData([]);
      setInput("");
      setShowInput(false);
    }
  };

  // Prepare labels (timestamps)
  const labels = graphData.map((d) => d.timestamp);

  // Prepare datasets for Chart.js based on sensorIds
  const datasets = sensorIds.map((id, idx) => ({
    label: `Sensor ${id}`,
    data: graphData.map((d) => d[`sensor_${id}`] ?? null),
    borderColor: `hsl(${(idx * 90) % 360}, 70%, 50%)`,
    backgroundColor: `hsl(${(idx * 90) % 360}, 70%, 50%)`,
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
    <div className="line-graph-widget" style={{ width: 900, height: 350, position: "relative" }}>
      <div className="header">
        <h3>Line Graph</h3>
        <div className="dropdown" >
         <MoreVertical
      onClick={() => setShowInput(!showInput)}
      className="options-icon"
    />
          {showInput && (
            <div className="dropdown-menu" style={{ position: "absolute", right:0, top: "24px", zIndex: 10 }}>
              <input
                type="text"
                placeholder="Sensor IDs (e.g. 1,2,3)"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                style={{ padding: "6px", marginBottom: "8px", width: "180px" }}
              />
              <button onClick={handleSensorChange} style={{ padding: "6px 12px", cursor: "pointer" }}>
                Submit
              </button>
            </div>
          )}
        </div>
      </div>

      <Line data={chartData} options={options} />
    </div>
  );
};

export default RealtimeLineGraph;
