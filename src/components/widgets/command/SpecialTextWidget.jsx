import React, { useState } from "react";
import "./SpecialTextWidget.css";

const SpecialTextWidget = ({ title, subtitle }) => {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    try {
      await fetch("http://localhost:5000/api/submit-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputValue }),
      });
      setInputValue(""); // Clear after submit
    } catch (error) {
      console.error("Error sending text:", error);
    }
  };

  return (
    <div className="text-submit-container">
      <div className="text-submit-header">
        <h3>{title}</h3>
        <p>{subtitle}</p>
      </div>
      <form className="text-submit-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputValue}
          placeholder="Enter text..."
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default SpecialTextWidget;
