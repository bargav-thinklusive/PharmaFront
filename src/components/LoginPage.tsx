import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const containerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: 'calc(100vh - 64px)', // account for header
  width: '100vw',
  margin: 0,
  padding: 0,
  background: 'linear-gradient(135deg, #0f8d41, #2196f3)',
};

const formStyle: React.CSSProperties = {
  background: 'white',
  padding: '3rem',
  borderRadius: '10px',
  boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
  width: '400px',
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
};

const inputStyle: React.CSSProperties = {
  padding: '0.75rem',
  borderRadius: '6px',
  border: '1px solid #ccc',
  fontSize: '1rem',
};

const buttonStyle: React.CSSProperties = {
  padding: '0.75rem',
  borderRadius: '6px',
  border: 'none',
  background: '#0f8d41',
  color: 'white',
  fontWeight: 600,
  cursor: 'pointer',
  fontSize: '1rem',
};

const errorStyle: React.CSSProperties = {
  color: 'red',
  fontSize: '0.9rem',
};

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleLogin = () => {
    if (!email) return setError('Please enter email');
    if (!validateEmail(email)) return setError('Please enter a valid email');
    if (!password) return setError('Please enter password');

    setError('');
    navigate('/'); // Redirect to Home
  };

  return (
    <div style={containerStyle}>
      <div style={formStyle}>
        <h2 style={{ textAlign: 'center', color: '#0f8d41' }}>Login</h2>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} />
        {error && <span style={errorStyle}>{error}</span>}
        <button onClick={handleLogin} style={buttonStyle}>Login</button>
      </div>
    </div>
  );
};

export default Login;
