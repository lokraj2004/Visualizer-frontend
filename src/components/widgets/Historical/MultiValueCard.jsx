import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./MultiValueCard.css";

export default function MultiValueCard({ defaultSensorId }) {
  const [sensorId, setSensorId] = useState(defaultSensorId);
  const [data, setData] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [sensorInput, setSensorInput] = useState("");
  const [error, setError] = useState("");

  const fetchData = (id) => {
    fetch(`http://localhost:5000/api/sensor_stats/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Invalid sensor ID");
        return res.json();
      })
      .then((json) => {
        setData(json);
        setSensorId(id);
        setError("");
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  useEffect(() => {
    fetchData(sensorId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSensorSubmit = () => {
    const id = parseInt(sensorInput);
    if (!isNaN(id)) {
      fetchData(id);
    } else {
      setError("Please enter a valid numeric sensor ID.");
    }
  };

  if (!data) return <div className="card-loading">Loading...</div>;

  return (
    <motion.div
      className="multi-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Left Side */}
  <div className="left">
  <div className="logo">📟</div>
  <div className="title">{data.title}</div>

  <div className="stats-grid">
    <div className="stat">Avg: {data.average} {data.unit}</div>
    <div className="stat">Min: {data.minimum} {data.unit}</div>
    <div className="stat">Sum: {data.sum} {data.unit}</div>
    <div className="stat">Max: {data.maximum} {data.unit}</div>
  </div>
</div>


      <div className="divider" />

      {/* Right Side */}
      <div className="right">
        <div className="current">Current: {data.current} {data.unit}</div>
        <div className="timestamp">
          Time: {new Date(data.timestamp).toLocaleTimeString()}
        </div>

        <div className="options-container">
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
                  />
                  <button onClick={handleSensorSubmit}>Submit</button>
                </div>

                <div className="dropdown-item">
                  <strong>Rename (coming soon)</strong>
                </div>

                {error && <div className="error">{error}</div>}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
