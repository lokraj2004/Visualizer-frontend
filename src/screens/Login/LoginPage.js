import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './StyledLoginPage.css';
import MonthlyUsage from '../Client/MonthlyUsage';

const LoginPage = () => {
  const [role, setRole] = useState(null); // Removed type annotation
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
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo">🏢</div>
          <h2>Login Page</h2>
          <p className="subtitle">Welcome to Monitoring System</p>
        </div>

        <div className="button-container">
          <button onClick={() => handleRoleSelect('client')} className="role-button client-btn">
            <span className="btn-icon">👤</span>
            Login as Client
          </button>
          <button onClick={() => handleRoleSelect('admin')} className="role-button admin-btn">
            <span className="btn-icon">🛡️</span>
            Login as Admin
          </button>
        </div>

        {role && (
          <form onSubmit={handleSubmit} className="login-form">
            <h3 className="form-title">
              {`Login as ${role.charAt(0).toUpperCase() + role.slice(1)}`}
            </h3>

            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-input"
            />

            <input
              type="text"
              placeholder="Client ID"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="form-input"
            />

            {role === 'admin' && (
              <input
                type="text"
                placeholder="Admin ID"
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
                className="form-input admin-input"
              />
            )}

            <button type="submit" className="submit-button">
              Submit →
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
