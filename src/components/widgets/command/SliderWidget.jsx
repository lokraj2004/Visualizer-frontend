import React, { useState } from "react";
import "./SliderWidget.css";

const SliderWidget = ({ title, subtitle }) => {
  const [value, setValue] = useState(50); // default value

  const handleChange = async (e) => {
    const newValue = e.target.value;
    setValue(newValue);

    try {
      await fetch("http://localhost:5000/api/slider-value", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: newValue }),
      });
    } catch (error) {
      console.error("Error sending slider value:", error);
    }
  };

  return (
    <div className="slider-widget-container">
      <div className="slider-header">
        <h3>{title}</h3>
        <p>{subtitle}</p>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        className="slider-widget"
        onChange={handleChange}
      />
      <div className="slider-value">{value}</div>
    </div>
  );
};

export default SliderWidget;
