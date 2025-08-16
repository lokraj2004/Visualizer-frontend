// src/pages/AuthPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginPage from "../LoginPage";

export default function AuthPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3001/node/authenticate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ auth: true }),
      });
      const data = await response.json();

      setLoading(false);

      if (data.authenticated) {
        navigate("/login"); // ✅ Redirect on success
      } else {
         navigate("/client-id");
        alert(data.message || "Authentication failed");
      }
    } catch (error) {
      setLoading(false);
      alert("Error: " + error.message);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>IoT Device Authentication</h1>
      {loading ? (
        <div style={styles.loader}></div>
      ) : (
        <button style={styles.button} onClick={handleStart}>
          Start
        </button>
      )}
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f4f6f8",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "sans-serif",
  },
  title: {
    fontSize: "1.8rem",
    marginBottom: "20px",
    color: "#333",
  },
  button: {
    padding: "12px 25px",
    fontSize: "16px",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "#1976d2",
    color: "#fff",
    cursor: "pointer",
  },
  loader: {
    width: "35px",
    height: "35px",
    border: "4px solid #ccc",
    borderTop: "4px solid #1976d2",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
};

// Add keyframes for loader in global CSS
