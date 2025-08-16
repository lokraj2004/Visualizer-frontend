import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./AdminPanel.css";
import PicklistWidget from "../../components/widgets/command/PicklistWidget";
import ToggleWidget from "../../components/widgets/command/ToggleWidget";
import SliderWidget from "../../components/widgets/command/SliderWidget";
import NumericWidget from "../../components/widgets/command/NumericWidget";
import SpecialTextWidget from "../../components/widgets/command/SpecialTextWidget";

function AdminPanel() {
  return (
    <div className="admin-container">
      <div className="left-panel">
        <h1>This is Admin panel</h1>
      </div>
      <div className="widgets-grid">
        <ToggleWidget />
        <NumericWidget />
        <PicklistWidget />
        <SliderWidget />
        <SpecialTextWidget />
      </div>
    </div>
  );
}

export default AdminPanel;
