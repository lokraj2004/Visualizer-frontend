import React, { useState } from "react";
import "./PicklistWidget.css";
import { FaList } from "react-icons/fa";

const PicklistWidget = () => {
  const [selected, setSelected] = useState("");

  const handleChange = async (e) => {
    const newValue = e.target.value;
    setSelected(newValue);

    try {
      const res = await fetch("http://localhost:5000/api/picklist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selected: newValue }),
      });
      const data = await res.json();
      console.log(data.message);
    } catch (err) {
      console.error("Error sending picklist value:", err);
    }
  };

  return (
    <div className="picklist-widget-container">
      <div className="picklist-header">
        <FaList className="picklist-icon" />
        <div>
          <h3 className="picklist-title">Picklist Widget</h3>
          <p className="picklist-subtitle">Choose an option</p>
        </div>
      </div>

      <select value={selected} onChange={handleChange} className="picklist-dropdown">
        <option value="">-- Select Option --</option>
        <option value="leds on">leds on</option>
        
        <option value="relay on">relay on</option>
        <option value="leds off">leds off</option>
        
        <option value="relay off">relay off</option>
      </select>
    </div>
  );
};

export default PicklistWidget;
