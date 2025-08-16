import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ClaimSlotPage from "./ClaimSlotPage";

export default function ClientIdValidation() {
  const [clientId, setClientId] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3001/node/validate-client-id", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId, username }),
      });

      const data = await response.json();
      setLoading(false);

      if (data.success) {
        setMessage(`✅ ${data.message}`);
        // ✅ Navigate to slot claiming page
        navigate("/claimslot", { state: { username, clientID: clientId } });
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (err) {
      setLoading(false);
      setMessage("❌ Failed to connect to server.");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Client ID Verification</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Enter Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
        />

        <input
          type="text"
          placeholder="Enter Client ID"
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
          style={styles.input}
        />

        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Validating..." : "Validate"}
        </button>
      </form>

      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    marginTop: "50px",
    fontFamily: "sans-serif",
  },
  title: {
    fontSize: "20px",
    marginBottom: "20px",
  },
  form: {
    display: "inline-block",
    textAlign: "left",
  },
  input: {
    display: "block",
    width: "250px",
    padding: "8px",
    marginBottom: "10px",
    fontSize: "14px",
  },
  button: {
    width: "250px",
    padding: "10px",
    fontSize: "14px",
    backgroundColor: "#1976d2",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
  message: {
    marginTop: "15px",
    fontWeight: "bold",
  },
};
