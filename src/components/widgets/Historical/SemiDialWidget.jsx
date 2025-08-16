import React, { useEffect, useState } from "react";
import axios from "axios";
import "./SemiDialWidget.css";

const SemiDialWidget = () => {
  const [sensorIds, setSensorIds] = useState(["2","3"]);
  const [inputIds, setInputIds] = useState("");
  const [maintenanceScore, setMaintenanceScore] = useState(0);
  const [threshold, setThreshold] = useState(100);
  const [showOptions, setShowOptions] = useState(false);

  const fetchData = async (ids) => {
    try {
      const res = await axios.post("http://localhost:5000/api/semi-dial", {
        sensorIds: ids.map((id) => parseInt(id)),
      });
      setMaintenanceScore(res.data.maintenanceScore);
      setThreshold(res.data.threshold);
    } catch (error) {
      console.error("Error fetching semi dial data:", error);
    }
  };

  useEffect(() => {
    fetchData(sensorIds);
  }, [sensorIds]);

  const handleSensorChange = () => {
    const parsed = inputIds
      .split(",")
      .map((id) => id.trim())
      .filter((id) => id !== "" && !isNaN(id));
    if (parsed.length > 0) {
      setSensorIds(parsed);
      setInputIds("");
      setShowOptions(false);
    }
  };

  const percent = Math.min((maintenanceScore / threshold) * 100, 100);
  const rotateDeg = (percent / 100) * 180 - 90;
  const needsMaintenance = maintenanceScore >= threshold;

  return (
    <div className="semi-dial-container">
      <div className="semi-dial-header">
        <h2>Semi Dial</h2>
        <div className="options-wrapper">
          <button
            className="options-toggle"
            onClick={() => setShowOptions(!showOptions)}
          >
            ⚙️
          </button>
          {showOptions && (
            <div className="options-menu">
              <div className="options-group">
                <label>Sensors</label>
                <input
                  type="text"
                  value={inputIds}
                  onChange={(e) => setInputIds(e.target.value)}
                  placeholder="e.g., 1,2,3"
                />
                <button onClick={handleSensorChange}>Submit</button>
              </div>
              <button className="rename-disabled" disabled>
                Rename (coming soon)
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="semi-dial-wrapper">
        <div className="semi-dial">
          <div className="needle" style={{ transform: `rotate(${rotateDeg}deg)` }}></div>
          <div className="tick-label left">Less Maintenance</div>
          <div className="tick-label right">Needs Maintenance</div>
        </div>
        <p className={`maintenance-status ${needsMaintenance ? "alert" : "good"}`}>
          {needsMaintenance ? "⚠️ Needs Maintenance" : "✅ Maintenance OK"}
        </p>
      </div>
    </div>
  );
};

export default SemiDialWidget;
