import React, { useState } from "react";
import "./NumericWidget.css";
import { FaHashtag } from "react-icons/fa"; // Example icon

const NumericWidget = ({ title = "Numeric Widget", subtitle = "Enter a number" }) => {
  const [number, setNumber] = useState("");

  const handleChange = async (e) => {
    const value = e.target.value;
    setNumber(value);

    try {
      const res = await fetch("http://localhost:5000/api/numeric", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value }),
      });
      const data = await res.json();
      console.log(data.message);
    } catch (err) {
      console.error("Error sending number:", err);
    }
  };

  return (
    <div className="numeric-container">
      <div className="numeric-header">
        <FaHashtag className="numeric-icon" />
        <div>
          <h3>{title}</h3>
          <p>{subtitle}</p>
        </div>
      </div>
      <input
        type="number"
        value={number}
        onChange={handleChange}
        className="numeric-input"
      />
    </div>
  );
};

export default NumericWidget;
