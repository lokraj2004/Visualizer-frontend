// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// const LoginPage = () => {
//   const [role, setRole] = useState(null);
//   const [username, setUsername] = useState('');
//   const [clientId, setClientId] = useState('');
//   const [adminId, setAdminId] = useState('');
//   const navigate = useNavigate();

//   const handleRoleSelect = (selectedRole) => {
//     setRole(selectedRole);
//     setUsername('');
//     setClientId('');
//     setAdminId('');
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!username || !clientId || (role === 'admin' && !adminId)) {
//       alert('Please fill in all required fields');
//       return;
//     }

//     const payload = {
//       role,
//       username,
//       id: clientId,
//       ...(role === 'admin' && { adminId }),
//     };

//     try {
//       const response = await fetch('http://localhost:5000/api/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload),
//       });

//       const data = await response.json();
//       console.log('Server response:', data);

//       if (data.success) {
//          console.log('Entered navigation');
//         if (role === 'client') {
//           navigate('/monthlyusage');
//         } else if (role === 'admin') {
//           navigate('/adminboard');
//         }
//       } else {
//         alert(data.message || 'Login failed');
//       }

//     } catch (error) {
//       console.error('Error during login:', error);
//       alert('Login failed');
//     }
//   };

//   return (
//     <div style={styles.container}>
//       <div style={styles.loginCard}>
//         <div style={styles.header}>
//           <div style={styles.logo}>🏢</div>
//           <h2 style={styles.title}>Login Page</h2>
//           <p style={styles.subtitle}>Welcome to Enterprise Portal</p>
//         </div>
        
//         <div style={styles.buttonContainer}>
//           <button onClick={() => handleRoleSelect('client')} style={styles.button}>
//             <span style={styles.buttonIcon}>👤</span>
//             Login as Client
//           </button>
//           <button onClick={() => handleRoleSelect('admin')} style={styles.button}>
//             <span style={styles.buttonIcon}>🛡️</span>
//             Login as Admin
//           </button>
//         </div>

//         {role && (
//           <form onSubmit={handleSubmit} style={styles.form}>
//             <h3 style={styles.formTitle}>
//               {`Login as ${role.charAt(0).toUpperCase() + role.slice(1)}`}
//             </h3>

//             <div style={styles.inputGroup}>
//               <input
//                 type="text"
//                 placeholder="Username"
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//                 style={styles.input}
//               />
//             </div>

//             <div style={styles.inputGroup}>
//               <input
//                 type="text"
//                 placeholder="Client ID"
//                 value={clientId}
//                 onChange={(e) => setClientId(e.target.value)}
//                 style={styles.input}
//               />
//             </div>

//             {role === 'admin' && (
//               <div style={styles.inputGroup}>
//                 <input
//                   type="text"
//                   placeholder="Admin ID"
//                   value={adminId}
//                   onChange={(e) => setAdminId(e.target.value)}
//                   style={styles.input}
//                 />
//               </div>
//             )}

//             <button type="submit" style={styles.submit}>
//               Submit →
//             </button>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// };

// const styles = {
//   container: { 
//     minHeight: '100vh',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//     fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
//     padding: '20px'
//   },
  
//   loginCard: {
//     background: 'rgba(255, 255, 255, 0.95)',
//     backdropFilter: 'blur(20px)',
//     borderRadius: '20px',
//     padding: '40px',
//     boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.2)',
//     maxWidth: '450px',
//     width: '100%',
//     textAlign: 'center' as const,
//     position: 'relative' as const,
//     overflow: 'hidden' as const
//   },

//   header: {
//     marginBottom: '30px'
//   },

//   logo: {
//     fontSize: '48px',
//     marginBottom: '15px'
//   },

//   title: {
//     fontSize: '32px',
//     fontWeight: '700',
//     color: '#2d3748',
//     margin: '0 0 8px 0',
//     background: 'linear-gradient(135deg, #667eea, #764ba2)',
//     WebkitBackgroundClip: 'text',
//     WebkitTextFillColor: 'transparent',
//     backgroundClip: 'text'
//   },

//   subtitle: {
//     color: '#718096',
//     fontSize: '16px',
//     margin: '0',
//     fontWeight: '400'
//   },
  
//   buttonContainer: { 
//     margin: '30px 0',
//     display: 'flex',
//     flexDirection: 'column' as const,
//     gap: '15px'
//   },
  
//   button: { 
//     background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//     color: 'white',
//     border: 'none',
//     borderRadius: '12px',
//     padding: '16px 24px',
//     fontSize: '16px',
//     fontWeight: '600',
//     cursor: 'pointer',
//     transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
//     position: 'relative' as const,
//     overflow: 'hidden' as const,
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: '10px',
//     boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
//     transform: 'translateY(0)',
//   },

//   buttonIcon: {
//     fontSize: '20px'
//   },
  
//   form: { 
//     marginTop: '30px',
//     textAlign: 'left' as const,
//     animation: 'slideIn 0.5s ease-out'
//   },

//   formTitle: {
//     fontSize: '24px',
//     fontWeight: '600',
//     color: '#2d3748',
//     textAlign: 'center' as const,
//     marginBottom: '25px',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: '10px'
//   },

//   inputGroup: {
//     marginBottom: '20px'
//   },
  
//   input: { 
//     width: '100%',
//     padding: '14px 18px',
//     fontSize: '16px',
//     border: '2px solid #e2e8f0',
//     borderRadius: '10px',
//     outline: 'none',
//     transition: 'all 0.3s ease',
//     backgroundColor: '#ffffff',
//     boxSizing: 'border-box' as const,
//     fontFamily: 'inherit'
//   },
  
//   submit: { 
//     width: '100%',
//     background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
//     color: 'white',
//     border: 'none',
//     borderRadius: '12px',
//     padding: '16px 24px',
//     fontSize: '18px',
//     fontWeight: '600',
//     cursor: 'pointer',
//     transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
//     marginTop: '20px',
//     boxShadow: '0 4px 15px rgba(72, 187, 120, 0.4)',
//     transform: 'translateY(0)'
//   }
// };

// // Add CSS animations and hover effects
// const styleSheet = document.createElement("style");
// styleSheet.type = "text/css";
// styleSheet.innerText = `
//   @keyframes slideIn {
//     from {
//       opacity: 0;
//       transform: translateY(20px);
//     }
//     to {
//       opacity: 1;
//       transform: translateY(0);
//     }
//   }

//   button:hover {
//     transform: translateY(-2px) !important;
//     box-shadow: 0 8px 25px rgba(102, 126, 234, 0.6) !important;
//   }

//   button[type="submit"]:hover {
//     transform: translateY(-2px) !important;
//     box-shadow: 0 8px 25px rgba(72, 187, 120, 0.6) !important;
//   }

//   input:focus {
//     border-color: #667eea !important;
//     box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1) !important;
//     transform: translateY(-1px) !important;
//   }

//   input:hover {
//     border-color: #cbd5e0 !important;
//   }

//   button:active {
//     transform: translateY(0px) !important;
//   }

//   /* Glassmorphism effect enhancement */
//   .login-card::before {
//     content: '';
//     position: absolute;
//     top: 0;
//     left: 0;
//     right: 0;
//     bottom: 0;
//     background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0));
//     border-radius: 20px;
//     pointer-events: none;
//   }
// `;
// document.head.appendChild(styleSheet);

// export default LoginPage;