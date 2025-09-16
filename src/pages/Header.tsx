import { NavLink, useNavigate } from 'react-router-dom';
import MainLogo from '../assets/MainLogo.png';
import { useState, useRef, useEffect } from 'react';

const navStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  background: '#36b669',
  color: 'white',
  padding: '0.5rem 2rem',
  width: '100%',
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
  alignItems: 'center',
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

const userProfileStyle: React.CSSProperties = {
  position: 'relative',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
};

const dropdownStyle: React.CSSProperties = {
  position: 'absolute',
  top: '100%',
  right: 0,
  background: 'white',
  color: 'black',
  border: '1px solid #ccc',
  borderRadius: '6px',
  padding: '0.5rem 0',
  marginTop: '0.5rem',
  minWidth: '140px',
  boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
  zIndex: 100,
};

interface HeaderProps {
  isLoginPage: boolean;
}

const Header: React.FC<HeaderProps> = ({ isLoginPage }) => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setDropdownOpen(false);
    navigate('/login');
  };

  return (
    <header style={navStyle}>
      <NavLink
        to="/"
        style={{ display: 'flex', alignItems: 'center', gap: '1rem', textDecoration: 'none' }}
      >
        <img
          src={MainLogo}
          alt="Main Logo"
          style={{ height: 40, width: 40, objectFit: 'contain', cursor: 'pointer' }}
        />
        <span style={{ fontWeight: 700, fontSize: '1.5rem', letterSpacing: 1, color: 'white', cursor: 'pointer' }}>
          ChemBank
        </span>
      </NavLink>

      <nav style={tabsStyle}>
        <NavLink
          to="/about"
          style={({ isActive }) => (isActive ? { ...linkStyle, ...activeLinkStyle } : linkStyle)}
        >
          About
        </NavLink>

        {!isLoginPage && (
          <NavLink
            to="/submit"
            style={({ isActive }) => (isActive ? { ...linkStyle, ...activeLinkStyle } : linkStyle)}
          >
            Submit
          </NavLink>
        )}

        {!isLoginPage && (
          <NavLink
            to="/docs"
            style={({ isActive }) => (isActive ? { ...linkStyle, ...activeLinkStyle } : linkStyle)}
          >
            Docs
          </NavLink>
        )}

        <NavLink
          to="/contacts"
          style={({ isActive }) => (isActive ? { ...linkStyle, ...activeLinkStyle } : linkStyle)}
        >
          Contacts
        </NavLink>

        {!isLoginPage && (
          <div style={userProfileStyle} ref={dropdownRef} onClick={() => setDropdownOpen((prev) => !prev)}>
            <span>👤 User</span>
            {dropdownOpen && (
              <div style={dropdownStyle}>
                <button
                  style={{
                    backgroundColor: '#3678f4ff',
                    border: '1px solid #3678f4ff',
                    borderRadius: '4px',
                    width: '100%',
                    padding: '0.5rem 1rem',
                    marginBottom: '0.25rem',
                    cursor: 'pointer',
                    textAlign: 'left',
                    color: "#ffffff"
                  }}
                >
                  <NavLink to="/profile" style={{ textDecoration: 'none', width: '100%', display: 'block' }}>
                    Profile
                  </NavLink>
                </button>
                <button
                  onClick={handleLogout}
                  style={{
                    backgroundColor: '#3678f4ff',
                    border: '1px solid #3678f4ff',
                    borderRadius: '4px',
                    width: '100%',
                    padding: '0.5rem 1rem',
                    cursor: 'pointer',
                    textAlign: 'left',
                    color: "#ffffff"
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
