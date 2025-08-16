import React from "react";
import "./RealtimeReading.css";
import RealtimeLineGraph from "../../components/widgets/realtime/RealtimeLineGraph";
import CardWidget from "../../components/widgets/realtime/CardWidget";

function RealtimeReading() {
  return (
    <div className="realtime-container">
      <h1>This is Realtime Reading</h1>

      <div className="cards-grid">
        <CardWidget initialSensorId={1} />
        <CardWidget initialSensorId={2} />
        <CardWidget initialSensorId={1} />
        <CardWidget initialSensorId={2} />
      </div>

      <hr className="divider" />

      <div className="linegraph-container">
        <RealtimeLineGraph />
      </div>
    </div>
  );
}

export default RealtimeReading;
