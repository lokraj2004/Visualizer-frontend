import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";
import "./CardWidget.css";

const socket = io("http://localhost:5000");

const iconMap = {
  temperature: "🌡️",
  humidity: "💧",
  motion: "🏃",
  default: "📟"
};

const CardWidget = ({ initialSensorId = 1 }) => {
  const [sensorId, setSensorId] = useState(initialSensorId.toString());
  const [sensorData, setSensorData] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [sensorInput, setSensorInput] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const eventName = `sensor_${sensorId}`;
    const handleData = (data) => setSensorData(data);

    socket.emit("start_sensor_stream", { sensorId });
    socket.on(eventName, handleData);

    return () => {
      socket.emit("stop_sensor_stream");
      socket.off(eventName, handleData);
    };
  }, [sensorId]);

  const handleSensorSubmit = () => {
    const id = sensorInput.trim();
    if (id && !isNaN(id)) {
      setSensorId(id);
      setSensorData(null);
      setShowOptions(false);
      setError("");
      socket.emit("update_sensor_id", { sensorId: id });
      socket.emit("start_sensor_stream", { sensorId: id });
      setSensorInput("");
    } else {
      setError("Please enter a valid numeric sensor ID.");
    }
  };

  const getIcon = (name) => {
    const lower = name?.toLowerCase() || "";
    if (lower.includes("temp")) return iconMap.temperature;
    if (lower.includes("humid")) return iconMap.humidity;
    if (lower.includes("motion")) return iconMap.motion;
    return iconMap.default;
  };

  if (!sensorData) {
    return (
      <div className="card-loading">Loading sensor data...</div>
    );
  }

  return (
    <motion.div
      className="card-widget"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="card-header">
        <div className="card-icon">{getIcon(sensorData?.name)}</div>
        <div className="card-title">{sensorData.name || "Unnamed Sensor"}</div>

        <div className="options-container">
          <button
            className="options-btn"
            onClick={() => setShowOptions(!showOptions)}
            aria-label="Options"
          >
            ⋮
          </button>

          <AnimatePresence>
            {showOptions && (
              <motion.div
                className="dropdown"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="dropdown-item">
                  <strong>Change Sensor</strong>
                  <input
                    type="number"
                    value={sensorInput}
                    onChange={(e) => setSensorInput(e.target.value)}
                    placeholder="Sensor ID"
                    min="1"
                  />
                  <button onClick={handleSensorSubmit}>Submit</button>
                </div>

                <div className="dropdown-item rename-placeholder">
                  <strong>Rename (coming soon)</strong>
                </div>

                {error && <div className="error">{error}</div>}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="card-body">
        <div className="sensor-value">
          {sensorData.value} {sensorData.unit || ""}
        </div>
        <div className="sensor-id">ID: {sensorData.sensor_id}</div>
        <div className="timestamp">
          {new Date(sensorData.timestamp).toLocaleString()}
        </div>
      </div>
    </motion.div>
  );
};

export default CardWidget;
