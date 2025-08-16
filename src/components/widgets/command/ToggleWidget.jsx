import React, { useState, useEffect } from "react";
import "./ToggleWidget.css";

const ToggleWidget = ({ title = "Toggle Control", subtitle = "Switch device state" }) => {
  const [isOn, setIsOn] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/api/toggle")
      .then(res => res.json())
      .then(data => setIsOn(data.state))
      .catch(err => console.error("Error fetching toggle state:", err));
  }, []);

  const handleToggle = () => {
    const newState = !isOn ? "on" : "off";

    fetch("http://localhost:5000/api/toggle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ state: newState })
    })
      .then(res => res.json())
      .then(data => setIsOn(data.state))
      .catch(err => console.error("Error updating toggle:", err));
  };

  return (
    <div className="toggle-container">
      <div className="toggle-header">
        <span className="toggle-icon">⚡</span>
        <div className="toggle-texts">
          <h3>{title}</h3>
          <p>{subtitle}</p>
        </div>
      </div>

      <button
        aria-pressed={isOn}
        className={`toggle-switch ${isOn ? "on" : "off"}`}
        onClick={handleToggle}
        role="switch"
      >
        <span className="toggle-slider" />
      </button>
    </div>
  );
};

export default ToggleWidget;
