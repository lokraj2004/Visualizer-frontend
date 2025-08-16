import React, { useEffect, useState } from "react";
import axios from "axios";
import "./FullDial.css";

const FullDial = () => {
  const [sensorId, setSensorId] = useState(2);
  const [usage, setUsage] = useState(0);
  const [threshold, setThreshold] = useState(1000);
  const [showOptions, setShowOptions] = useState(false);
  const [inputId, setInputId] = useState("");

  const fetchData = async (id) => {
    try {
      const res = await axios.post("http://localhost:5000/api/full-dial", {
        sensorId: id,
      });
      setUsage(res.data.totalUsage);
      setThreshold(res.data.threshold);
    } catch (error) {
      console.error("Error fetching full dial data:", error);
    }
  };

  useEffect(() => {
    fetchData(sensorId);
  }, [sensorId]);

  const handleSensorChange = () => {
    const id = inputId.trim();
    if (id && !isNaN(id)) {
      setSensorId(parseInt(id));
      setInputId("");
      setShowOptions(false);
    }
  };

  const fillPercent = Math.min((usage / threshold) * 100, 100).toFixed(1);
  const isOverload = usage > threshold;

  return (
    <div className="full-dial-container">
      <div className="full-dial-header">
        <h2>Full Dial</h2>

        <div className="options-wrapper">
          <button
            className="options-toggle"
            onClick={() => setShowOptions((prev) => !prev)}
            aria-label="Toggle options"
          >
            ⚙️
          </button>

          {showOptions && (
            <div className="options-menu">
              <label htmlFor="sensorInput" className="options-label">
                Sensor ID
              </label>
              <div className="options-input-group">
                <input
                  id="sensorInput"
                  type="text"
                  value={inputId}
                  onChange={(e) => setInputId(e.target.value)}
                  placeholder="Enter Sensor ID"
                  className="sensor-input"
                />
                <button className="submit-btn" onClick={handleSensorChange}>
                  Submit
                </button>
              </div>
              <button className="rename-disabled" disabled>
                Rename (coming soon)
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="dial-wrapper">
        <div className={`dial-outer ${isOverload ? "overload" : "normal"}`}>
          <div
            className="dial-fill"
            style={{ clipPath: `inset(${100 - fillPercent}% 0 0 0)` }}
          />
          <div className="dial-center">
            <p className="fill-percent">{fillPercent}%</p>
            <p className="fill-label">Used</p>
          </div>
        </div>
        {isOverload && <p className="overload-warning">⚠️ Overload</p>}
      </div>
    </div>
  );
};


export default FullDial;
