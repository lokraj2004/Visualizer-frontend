// src/pages/ClaimSlotPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import ClientIdValidation from "./ClientIDValidation";

export default function ClaimSlotPage() {
  const [loading, setLoading] = useState(true);
  const [slot, setSlot] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Data passed from previous page
  const { username, clientID } = location.state || {};

  useEffect(() => {
    if (!username || !clientID) {
      navigate("/"); // If no data from previous page, go home
      return;
    }

    const claimSlot = async () => {
      try {
        const res = await fetch("http://localhost:3001/node/claim-slot", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, clientID }),
        });

        const data = await res.json();
        setLoading(false);

        if (data.success) {
          setSlot(data.slot);
        } else {
          navigate("/clientid"); // Go to "no slot" page
        }
      } catch (err) {
        console.error("Error claiming slot:", err);
        navigate("/error"); // Optional error page
      }
    };

    claimSlot();
  }, [username, clientID, navigate]);

  const handleNext = () => {
    navigate("/");
  };

  return (
    <div style={styles.container}>
      {loading ? (
        <>
          <CircularProgress />
          <p>Claiming your slot...</p>
        </>
      ) : (
        slot && (
          <div>
            <h2>✅ You claimed: {slot}</h2>
            <button style={styles.button} onClick={handleNext}>
              Next
            </button>
          </div>
        )
      )}
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    fontFamily: "sans-serif",
  },
  button: {
    marginTop: "20px",
    padding: "10px 20px",
    backgroundColor: "#1976d2",
    color: "white",
    border: "none",
    cursor: "pointer",
  },
};
