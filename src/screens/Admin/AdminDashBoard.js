import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, MenuItem, IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import "./AdminDashBoard.css";
import MultiValueCard from "../../components/widgets/Historical/MultiValueCard";
import ColumnWidget from "../../components/widgets/Historical/ColumnWidget";
import CustomFill from "../../components/widgets/Historical/CustomFill";
import DonutChart from "../../components/widgets/Historical/DonutChart";
import LineGraph from "../../components/widgets/Historical/LineGraph";
import FullDial from "../../components/widgets/Historical/FullDial";
import SemiDialWidget from "../../components/widgets/Historical/SemiDialWidget";

function AdminDashBoard() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavigation = (path) => {
    navigate(path);
    handleMenuClose();
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>My Dashboard</h1>
        <IconButton
          aria-controls={open ? 'dashboard-menu' : undefined}
          aria-haspopup="true"
          onClick={handleMenuClick}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="dashboard-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => handleNavigation('/readings')}>Realtime Readings</MenuItem>
          <MenuItem onClick={() => handleNavigation('/adminpanel')}>Admin Panel</MenuItem>
          <MenuItem onClick={() => handleNavigation('/clients-profile')}>Clients Profile</MenuItem>
          <MenuItem onClick={() => handleNavigation(-1)}>Back</MenuItem>
        </Menu>
      </header>

      {/* Main content area with three columns */}
      <div className="dashboard-columns">
        {/* Left column */}
        <div className="dashboard-column dashboard-left">
          <DonutChart />
        </div>

        {/* Middle column */}
        <div className="dashboard-column dashboard-middle">
          <h3>Sensor readings</h3>
          <div className="scrollable-multi-cards">
            <MultiValueCard defaultSensorId={2} />
            <MultiValueCard defaultSensorId={3} />
            <MultiValueCard defaultSensorId={4} />
            <MultiValueCard defaultSensorId={5} />
            <MultiValueCard defaultSensorId={6} />
            <MultiValueCard defaultSensorId={7} />
          </div>
        </div>

        {/* Right column */}
        <div className="dashboard-column dashboard-right">
          <h3>Sensor Health</h3>
          <div className="top-widgets">
            <FullDial />
            <CustomFill />
          </div>
          <div className="bottom-widget">
            <SemiDialWidget />
          </div>
        </div>
      </div>

      {/* Divider */}
      <hr className="dashboard-divider" />

      {/* Lower row */}
      <div className="dashboard-lower-row">
        <div className="lower-row-cell lower-left">
          <ColumnWidget defaultSensorIds="2,3" defaultView="monthly" />
        </div>
        <div className="lower-row-cell lower-right">
          <LineGraph />
        </div>
      </div>
    </div>
  );
}

export default AdminDashBoard;
