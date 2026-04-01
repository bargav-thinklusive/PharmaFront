import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import CompanyLogo from "../../assets/CMCINTELLOGO.png";
import SearchBar from "../SearchBar";
import AuthService from "../../services/AuthService";
import { useUser } from "../../context/UserContext";
import { getDraftData } from "../../hooks/useDraft";

interface AuthenticatedHeaderProps {
  isLoginPage?: boolean;
}

const AuthenticatedHeader: React.FC<AuthenticatedHeaderProps> = ({ isLoginPage }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Detect about/contacts pages
  const isAboutOrContacts =
    location.pathname === "/about" || location.pathname === "/contacts";

  // Check if we came from login (router state flag)
  const fromLogin = location.state?.fromLogin === true;

  // Minimal header condition
  const showMinimalHeader = isLoginPage || (isAboutOrContacts && fromLogin);

  // Show search bar condition (not on home page and not on login/minimal pages)
  const showSearchBar = !isLoginPage && location.pathname !== "/home" && !showMinimalHeader;

  const handleLogout = () => {
    AuthService.logout();
    setDropdownOpen(false);
    navigate("/login");
  };

  // ── Draft badge data ──────────────────────────────────────────────────────
  const draft = getDraftData();
  const draftLabel = draft?.drugName ? `Resume: ${draft.drugName}` : "Resume Draft";

  return (
    <header className={`flex items-center bg-[#36b669] text-white px-6 py-3 fixed top-0 left-0 w-full z-[1000] ${showSearchBar ? 'justify-between' : 'justify-between'}`}>
      {/* Logo Section */}
      <div className="flex-shrink-0">
        {showMinimalHeader ? (
          <div className="flex items-center gap-2">
            <img src={CompanyLogo} alt="Logo" className="h-10 w-15" />
          </div>
        ) : (
          <Link
            to="/home"
            className="flex items-center gap-2 text-white no-underline"
          >
            <img src={CompanyLogo} alt="Logo" className="h-10 w-20" />
          </Link>
        )}
      </div>

      {/* Center Search Bar */}
      {showSearchBar && (
        <div className="flex-1 max-w-2xl mx-8">
          <SearchBar compact={true} />
        </div>
      )}

      {/* Navigation Section */}
      <nav className="flex gap-4 items-center flex-shrink-0">
        {showMinimalHeader ? (
          <>
            <Link
              to="/about"
              state={{ fromLogin: true, headerType: 'header' }}
              className="text-white no-underline"
            >
              About us
            </Link>
            <Link
              to="/contacts"
              state={{ fromLogin: true, headerType: 'header' }}
              className="text-white no-underline"
            >
              Contacts us
            </Link>
          </>
        ) : (
          <>
            <Link to="/home" className="text-white no-underline">
              Home
            </Link>
            <Link to="/about" state={{ headerType: 'header' }} className="text-white no-underline">
              About us
            </Link>
            <Link to="/contacts" state={{ headerType: 'header' }} className="text-white no-underline">
              Contacts us
            </Link>
            <Link to="/drugslist" className="text-white no-underline">
              Drugs List
            </Link>

            {/* ── Draft Resume Badge ── */}
            {draft && (
              <button
                onClick={() => navigate("/drug-form")}
                title="Click to continue editing your draft"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "4px 12px",
                  borderRadius: "999px",
                  backgroundColor: "#f59e0b",
                  color: "#1c1917",
                  fontWeight: 600,
                  fontSize: "13px",
                  border: "none",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  boxShadow: "0 0 0 3px rgba(245,158,11,0.35)",
                  animation: "draftPulse 2s ease-in-out infinite",
                }}
              >
                <span style={{ fontSize: "15px" }}>💾</span>
                {draftLabel}
              </button>
            )}

            {/* User Dropdown */}
            <div ref={dropdownRef} className="ml-8 relative">
              <span
                className="cursor-pointer font-bold"
                onClick={() => setDropdownOpen((p) => !p)}
              >
                👤 {user?.data?.name || "User"}
              </span>
              {dropdownOpen && (
                <div className="absolute top-full right-0 bg-white border border-gray-300 rounded-md shadow-md mt-2 min-w-[100px] overflow-hidden">
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

export default AuthenticatedHeader;
