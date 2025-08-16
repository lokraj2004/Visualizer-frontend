import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MonthlyUsage from './Client/MonthlyUsage';

const LoginPage1 = () => {
  const [role, setRole] = useState(null);
  const [username, setUsername] = useState('');
  const [clientId, setClientId] = useState('');
  const [adminId, setAdminId] = useState('');
  const navigate = useNavigate();

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setUsername('');
    setClientId('');
    setAdminId('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !clientId || (role === 'admin' && !adminId)) {
      alert('Please fill in all required fields');
      return;
    }

    const payload = {
      role,
      username,
      id: clientId,
      ...(role === 'admin' && { adminId }),
    };

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log('Server response:', data);

      if (data.success) {
         console.log('Entered navigation');
        if (role === 'client') {
          navigate('/monthlyusage');
        } else if (role === 'admin') {
          navigate('/adminboard');
        }
      } else {
        alert(data.message || 'Login failed');
      }

    } catch (error) {
      console.error('Error during login:', error);
      alert('Login failed');
    }
  };

  return (
    <div style={styles.container}>
      <h2>Login Page</h2>
      <div style={styles.buttonContainer}>
        <button onClick={() => handleRoleSelect('client')} style={styles.button}>Login as Client</button>
        <button onClick={() => handleRoleSelect('admin')} style={styles.button}>Login as Admin</button>
      </div>

      {role && (
        <form onSubmit={handleSubmit} style={styles.form}>
          <h3>{`Login as ${role.charAt(0).toUpperCase() + role.slice(1)}`}</h3>

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
          />

          <input
            type="text"
            placeholder="Client ID"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            style={styles.input}
          />

          {role === 'admin' && (
            <input
              type="text"
              placeholder="Admin ID"
              value={adminId}
              onChange={(e) => setAdminId(e.target.value)}
              style={styles.input}
            />
          )}

          <button type="submit" style={styles.submit}>Submit</button>
        </form>
      )}
    </div>
  );
};

const styles = {
  container: { textAlign: 'center', marginTop: '50px' },
  buttonContainer: { margin: '20px' },
  button: { margin: '10px', padding: '10px 20px', fontSize: '16px', cursor: 'pointer' },
  form: { marginTop: '20px', display: 'inline-block', textAlign: 'left' },
  input: { display: 'block', margin: '10px 0', padding: '8px', width: '250px', fontSize: '14px' },
  submit: { padding: '10px 20px', fontSize: '16px', cursor: 'pointer' },
};

export default LoginPage1;
