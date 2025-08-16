import React, { useEffect, useState } from "react";
import "./CustomFill.css";

const CustomFill = () => {
  const [sensorIds, setSensorIds] = useState("1,2");
  const [usageData, setUsageData] = useState(null);

  useEffect(() => {
    fetchFillData();
  }, [sensorIds]);

  const fetchFillData = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/custom-fill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sensorIds }),
      });
      const data = await response.json();
      if (data.success) {
        setUsageData(data.data);
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error("Error fetching custom fill data:", error);
    }
  };

  const getFillHeight = () => {
    if (!usageData) return 0;
    const percent = (usageData.totalUsage / usageData.threshold) * 100;
    return Math.min(percent, 100);
  };

  return (
    <div className="custom-fill-container">
      <div className="header">
        <h3>Custom Fill</h3>
        <input
          type="text"
          className="sensor-input"
          placeholder="Sensor IDs (e.g. 1,2)"
          value={sensorIds}
          onChange={(e) => setSensorIds(e.target.value)}
        />
      </div>

    <div className="circle-jar">
  <div
    className="water-fill"
    style={{ height: `${getFillHeight()}%` }}
    title={`Usage: ${usageData?.totalUsage || 0} / ${usageData?.threshold || 0}`}
  >
    <div className="shimmer" />
  </div>
</div>

      {usageData && (
        <div className="status">
          <p>
            Status:{" "}
            <strong
              style={{
                color: usageData.status === "Overload" ? "#d9534f" : "#5cb85c",
              }}
            >
              {usageData.status}
            </strong>
          </p>
          <p>
            Usage: {usageData.totalUsage} / {usageData.threshold}
          </p>
        </div>
      )}
    </div>
  );
};

export default CustomFill;
