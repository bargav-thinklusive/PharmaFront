
import { NavLink } from 'react-router-dom';
import MainLogo from '../assets/MainLogo.png';

const navStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  background: '#0f8d41ff', // dark green
  color: 'white',
  padding: '0.5rem 2rem',
  width: '100vw',
  margin: 0,
  boxSizing: 'border-box',
  height: '64px',
  position: 'fixed',
  top: 0,
  left: 0,
  zIndex: 50,
};

const tabsStyle: React.CSSProperties = {
  display: 'flex',
  gap: '2rem',
};

const linkStyle: React.CSSProperties = {
  color: 'white',
  textDecoration: 'none',
  fontWeight: 500,
  fontSize: '1.1rem',
  padding: '0.25rem 0.5rem',
  borderRadius: '4px',
};

const activeLinkStyle: React.CSSProperties = {
  background: '#2230b3ff',
};

const Header: React.FC = () => (
  <header style={navStyle}>
    <NavLink to="/" style={{ display: 'flex', alignItems: 'center', gap: '1rem', textDecoration: 'none' }}>
      <img src={MainLogo} alt="Main Logo" style={{ height: 40, width: 40, objectFit: 'contain', cursor: 'pointer' }} />
      <span style={{ fontWeight: 700, fontSize: '1.5rem', letterSpacing: 1, color: 'white', cursor: 'pointer' }}>ChemBank</span>
    </NavLink>
    <nav style={tabsStyle}>
      <NavLink to="/about" style={({ isActive }) => isActive ? { ...linkStyle, ...activeLinkStyle } : linkStyle}>About</NavLink>
      <NavLink to="/submit" style={({ isActive }) => isActive ? { ...linkStyle, ...activeLinkStyle } : linkStyle}>Submit</NavLink>
      <NavLink to="/docs" style={({ isActive }) => isActive ? { ...linkStyle, ...activeLinkStyle } : linkStyle}>Docs</NavLink>
      <NavLink to="/contacts" style={({ isActive }) => isActive ? { ...linkStyle, ...activeLinkStyle } : linkStyle}>Contacts</NavLink>
    </nav>
  </header>
);

export default Header;
