import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import CompanyLogo from "../assets/cmc.png"

interface HeaderProps {
  isLoginPage?: boolean; // optional prop to indicate if on login page
}


const Header: React.FC<HeaderProps> = ({ isLoginPage }) => {
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
          <img src={CompanyLogo} alt="Logo" style={{ height: "40px" }} />
          <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>CMCINTEL</span>
        </div>
      ) : (
        <Link
          to="/home"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            color: "white",
            textDecoration: "none",
          }}
        >
          <img src={CompanyLogo} alt="Logo" style={{ height: "40px" }} />
          <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>CMCINTEL</span>
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
            <Link to="/home" style={{ color: "white", textDecoration: "none" }}>
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


