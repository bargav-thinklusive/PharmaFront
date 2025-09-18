// import { NavLink, useNavigate } from 'react-router-dom';
// import MainLogo from '../assets/MainLogo.png';
// import { useState, useRef, useEffect } from 'react';

// const navStyle: React.CSSProperties = {
//   display: 'flex',
//   alignItems: 'center',
//   justifyContent: 'space-between',
//   background: '#36b669',
//   color: 'white',
//   padding: '0.5rem 2rem',
//   width: '100%',
//   boxSizing: 'border-box',
//   height: '64px',
//   position: 'fixed',
//   top: 0,
//   left: 0,
//   zIndex: 50,
// };

// const tabsStyle: React.CSSProperties = {
//   display: 'flex',
//   gap: '2rem',
//   alignItems: 'center',
// };

// const linkStyle: React.CSSProperties = {
//   color: 'white',
//   textDecoration: 'none',
//   fontWeight: 500,
//   fontSize: '1.1rem',
//   padding: '0.25rem 0.5rem',
//   borderRadius: '4px',
// };

// const activeLinkStyle: React.CSSProperties = {
//   background: '#2230b3ff',
// };

// const userProfileStyle: React.CSSProperties = {
//   position: 'relative',
//   cursor: 'pointer',
//   display: 'flex',
//   alignItems: 'center',
//   gap: '0.5rem',
// };

// const dropdownStyle: React.CSSProperties = {
//   position: 'absolute',
//   top: '100%',
//   right: 0,
//   background: 'white',
//   color: 'black',
//   border: '1px solid #ccc',
//   borderRadius: '6px',
//   padding: '0.5rem 0',
//   marginTop: '0.5rem',
//   minWidth: '140px',
//   boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
//   zIndex: 100,
// };

// interface HeaderProps {
//   isLoginPage: boolean;
// }

// const Header: React.FC<HeaderProps> = ({ isLoginPage }) => {
//   const navigate = useNavigate();
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const dropdownRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
//         setDropdownOpen(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   const handleLogout = () => {
//     setDropdownOpen(false);
//     navigate('/login');
//   };

//   return (
//     <header style={navStyle}>
//       <NavLink
//         to="/"
//         style={{ display: 'flex', alignItems: 'center', gap: '1rem', textDecoration: 'none' }}
//       >
//         <img
//           src={MainLogo}
//           alt="Main Logo"
//           style={{ height: 40, width: 40, objectFit: 'contain', cursor: 'pointer' }}
//         />
//         <span style={{ fontWeight: 700, fontSize: '1.5rem', letterSpacing: 1, color: 'white', cursor: 'pointer' }}>
//           ChemBank
//         </span>
//       </NavLink>

//       <nav style={tabsStyle}>
//         <NavLink
//           to="/about"
//           style={({ isActive }) => (isActive ? { ...linkStyle, ...activeLinkStyle } : linkStyle)}
//         >
//           About
//         </NavLink>

//         {/* {!isLoginPage && (
//           <NavLink
//             to="/submit"
//             style={({ isActive }) => (isActive ? { ...linkStyle, ...activeLinkStyle } : linkStyle)}
//           >
//             Submit
//           </NavLink>
//         )} */}

//         {!isLoginPage && (
//           <NavLink
//             to="/docs"
//             style={({ isActive }) => (isActive ? { ...linkStyle, ...activeLinkStyle } : linkStyle)}
//           >
//             Docs
//           </NavLink>
//         )}

//         <NavLink
//           to="/contacts"
//           style={({ isActive }) => (isActive ? { ...linkStyle, ...activeLinkStyle } : linkStyle)}
//         >
//           Contacts
//         </NavLink>

//         {!isLoginPage && (
//           <div style={userProfileStyle} ref={dropdownRef} onClick={() => setDropdownOpen((prev) => !prev)}>
//             <span>👤 User</span>
//             {dropdownOpen && (
//               <div style={dropdownStyle}>
//                 <button
//                   style={{
//                     backgroundColor: '#3678f4ff',
//                     border: '1px solid #3678f4ff',
//                     borderRadius: '4px',
//                     width: '100%',
//                     padding: '0.5rem 1rem',
//                     marginBottom: '0.25rem',
//                     cursor: 'pointer',
//                     textAlign: 'left',
//                     color: "#ffffff"
//                   }}
//                 >
//                   <NavLink to="/profile" style={{ textDecoration: 'none', width: '100%', display: 'block' }}>
//                     Profile
//                   </NavLink>
//                 </button>
//                 <button
//                   onClick={handleLogout}
//                   style={{
//                     backgroundColor: '#3678f4ff',
//                     border: '1px solid #3678f4ff',
//                     borderRadius: '4px',
//                     width: '100%',
//                     padding: '0.5rem 1rem',
//                     cursor: 'pointer',
//                     textAlign: 'left',
//                     color: "#ffffff"
//                   }}
//                 >
//                   Logout
//                 </button>
//               </div>
//             )}
//           </div>
//         )}
//       </nav>
//     </header>
//   );
// };

// export default Header;

// import { NavLink, useNavigate, useLocation } from 'react-router-dom';
// import MainLogo from '../assets/MainLogo.png';
// import { useState, useRef, useEffect } from 'react';

// const navStyle: React.CSSProperties = {
//   display: 'flex',
//   alignItems: 'center',
//   justifyContent: 'space-between',
//   background: '#36b669',
//   color: 'white',
//   padding: '0.5rem 2rem',
//   width: '100%',
//   boxSizing: 'border-box',
//   height: '64px',
//   position: 'fixed',
//   top: 0,
//   left: 0,
//   zIndex: 50,
// };

// const tabsStyle: React.CSSProperties = {
//   display: 'flex',
//   gap: '2rem',
//   alignItems: 'center',
// };

// const linkStyle: React.CSSProperties = {
//   color: 'white',
//   textDecoration: 'none',
//   fontWeight: 500,
//   fontSize: '1.1rem',
//   padding: '0.25rem 0.5rem',
//   borderRadius: '4px',
// };

// const activeLinkStyle: React.CSSProperties = {
//   background: '#2230b3ff',
// };

// const userProfileStyle: React.CSSProperties = {
//   position: 'relative',
//   cursor: 'pointer',
//   display: 'flex',
//   alignItems: 'center',
//   gap: '0.5rem',
// };

// const dropdownStyle: React.CSSProperties = {
//   position: 'absolute',
//   top: '100%',
//   right: 0,
//   background: 'white',
//   color: 'black',
//   border: '1px solid #ccc',
//   borderRadius: '6px',
//   padding: '0.5rem 0',
//   marginTop: '0.5rem',
//   minWidth: '140px',
//   boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
//   zIndex: 100,
// };

// interface HeaderProps {
//   isLoginPage: boolean; // passed from AppWrapper
// }

// const Header: React.FC<HeaderProps> = ({ isLoginPage }) => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const dropdownRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
//         setDropdownOpen(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   const handleLogout = () => {
//     setDropdownOpen(false);
//     navigate('/login');
//   };

//   // read location.state safely
//   const locState = (location.state as { fromLogin?: boolean } | undefined);
//   const fromLogin = Boolean(locState?.fromLogin);

//   // public mode when on /login OR when navigated from login (via link state)
//   const isPublicMode = Boolean(isLoginPage || fromLogin);

//   // if we're in login page, when clicking About/Contacts we add state so the next page knows it came from login
//   const navStateFromLogin = isLoginPage ? { fromLogin: true } : undefined;

//   return (
//     <header style={navStyle}>
//       {/* Logo + title */}
//       {isPublicMode ? (
//         // non-clickable logo+title when public-mode
//         <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'default' }}>
//           <img src={MainLogo} alt="Main Logo" style={{ height: 40, width: 40, objectFit: 'contain' }} />
//           <span style={{ fontWeight: 700, fontSize: '1.5rem', letterSpacing: 1, color: 'white' }}>
//             ChemBank
//           </span>
//         </div>
//       ) : (
//         // clickable logo+title in private mode
//         <NavLink to="/" style={{ display: 'flex', alignItems: 'center', gap: '1rem', textDecoration: 'none' }}>
//           <img src={MainLogo} alt="Main Logo" style={{ height: 40, width: 40, objectFit: 'contain', cursor: 'pointer' }} />
//           <span style={{ fontWeight: 700, fontSize: '1.5rem', letterSpacing: 1, color: 'white', cursor: 'pointer' }}>
//             ChemBank
//           </span>
//         </NavLink>
//       )}

//       {/* Navigation */}
//       <nav style={tabsStyle}>
//         {isPublicMode ? (
//           // Only About & Contacts visible in public-mode.
//           // When we are on the login page, clicking these links attaches state {fromLogin: true}
//           <>
//             <NavLink to="/about" state={navStateFromLogin}
//               style={({ isActive }) => (isActive ? { ...linkStyle, ...activeLinkStyle } : linkStyle)}>
//               About
//             </NavLink>
//             <NavLink to="/contacts" state={navStateFromLogin}
//               style={({ isActive }) => (isActive ? { ...linkStyle, ...activeLinkStyle } : linkStyle)}>
//               Contacts
//             </NavLink>
//           </>
//         ) : (
//           // Private mode: show all tabs and profile dropdown as usual
//           <>
//             <NavLink to="/about" style={({ isActive }) => (isActive ? { ...linkStyle, ...activeLinkStyle } : linkStyle)}>
//               About
//             </NavLink>
//             <NavLink to="/docs" style={({ isActive }) => (isActive ? { ...linkStyle, ...activeLinkStyle } : linkStyle)}>
//               Docs
//             </NavLink>
//             <NavLink to="/contacts" style={({ isActive }) => (isActive ? { ...linkStyle, ...activeLinkStyle } : linkStyle)}>
//               Contacts
//             </NavLink>

//             <div style={userProfileStyle} ref={dropdownRef} onClick={() => setDropdownOpen((p) => !p)}>
//               <span>👤 User</span>
//               {dropdownOpen && (
//                 <div style={dropdownStyle}>
//                   <NavLink to="/profile" style={{
//                     backgroundColor: '#3678f4ff',
//                     border: '1px solid #3678f4ff',
//                     borderRadius: '4px',
//                     width: '100%',
//                     padding: '0.5rem 1rem',
//                     marginBottom: '0.25rem',
//                     display: 'block',
//                     textDecoration: 'none',
//                     color: 'white',
//                   }}>
//                     Profile
//                   </NavLink>
//                   <button onClick={handleLogout} style={{
//                     backgroundColor: '#3678f4ff',
//                     border: '1px solid #3678f4ff',
//                     borderRadius: '4px',
//                     width: '100%',
//                     padding: '0.5rem 1rem',
//                     cursor: 'pointer',
//                     textAlign: 'left',
//                     color: '#ffffff',
//                   }}>
//                     Logout
//                   </button>
//                 </div>
//               )}
//             </div>
//           </>
//         )}
//       </nav>
//     </header>
//   );
// };

// export default Header;

import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import MainLogo from "../assets/MainLogo.png";

interface HeaderProps {
  isLoginPage?: boolean; // optional prop to indicate if on login page
}


const Header: React.FC<HeaderProps> = ({isLoginPage}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // detect login page
  //const isLoginPage = location.pathname === "/login";

  // detect about/contacts pages
  const isAboutOrContacts =
    location.pathname === "/about" || location.pathname === "/contacts";

  // check if we came from login (router state flag)
  const fromLogin = location.state?.fromLogin === true;

  // minimal header condition
  const showMinimalHeader = isLoginPage || (isAboutOrContacts && fromLogin);

  const handleLogout = () => {
    localStorage.removeItem("user"); // adjust if you use auth context
    setDropdownOpen(false);
    navigate("/login");
  };

  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "#36b669",
        color: "white",
        padding: "0.75rem 1.5rem",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 1000,
      }}
    >
      {/* Logo (not clickable in minimal mode) */}
      {showMinimalHeader ? (
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <img src={MainLogo} alt="Logo" style={{ height: "40px" }} />
          <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>ChemBank</span>
        </div>
      ) : (
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            color: "white",
            textDecoration: "none",
          }}
        >
          <img src={MainLogo} alt="Logo" style={{ height: "40px" }} />
          <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>ChemBank</span>
        </Link>
      )}

      {/* Navigation */}
      <nav style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        {showMinimalHeader ? (
          <>
            <Link
              to="/about"
              state={{ fromLogin: true }}
              style={{ color: "white", textDecoration: "none" }}
            >
              About
            </Link>
            <Link
              to="/contacts"
              state={{ fromLogin: true }}
              style={{ color: "white", textDecoration: "none" }}
            >
              Contacts
            </Link>
          </>
        ) : (
          <>
            <Link to="/" style={{ color: "white", textDecoration: "none" }}>
              Home
            </Link>
            <Link to="/about" style={{ color: "white", textDecoration: "none" }}>
              About
            </Link>
            <Link to="/contacts" style={{ color: "white", textDecoration: "none" }}>
              Contacts
            </Link>

            {/* User Dropdown */}
            <div
              ref={dropdownRef}
              style={{ marginLeft: "2rem", position: "relative" }}
            >
              <span
                style={{ cursor: "pointer", fontWeight: "bold" }}
                onClick={() => setDropdownOpen((p) => !p)}
              >
                👤 User
              </span>
              {dropdownOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    right: 0,
                    background: "white",
                    border: "1px solid #ccc",
                    borderRadius: "6px",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                    marginTop: "0.5rem",
                    minWidth: "100px",
                    overflow: "hidden",
                  }}
                >
                  <Link
  to="/profile"
  className="block px-4 py-2 border-b border-gray-300 text-black hover:bg-[#3678f4ff] hover:text-white transition-colors duration-200"
  onClick={() => setDropdownOpen(false)}
>
  Profile
</Link>

<button
  onClick={handleLogout}
  className="w-full text-left px-4 py-2 text-black hover:bg-[#3678f4ff] hover:text-white transition-colors duration-200 cursor-pointer"
>
  Logout
</button>

                </div>
              )}
            </div>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;


