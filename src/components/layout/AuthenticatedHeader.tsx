import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import CompanyLogo from "../../assets/CMCINTELLOGO.png";
import SearchBar from "../SearchBar";
import AuthService from "../../services/AuthService";
import { useUser } from "../../context/UserContext";
import { getAllDrafts } from "../../hooks/useDraft";

interface AuthenticatedHeaderProps {
  isLoginPage?: boolean;
}

const AuthenticatedHeader: React.FC<AuthenticatedHeaderProps> = ({ isLoginPage }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [draftsDropdownOpen, setDraftsDropdownOpen] = useState(false);
  const draftsDropdownRef = useRef<HTMLDivElement>(null);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close dropdowns if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
      if (draftsDropdownRef.current && !draftsDropdownRef.current.contains(event.target as Node)) {
        setDraftsDropdownOpen(false);
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
    setMobileMenuOpen(false);
    navigate("/login");
  };

  // ── Drafts data ───────────────────────────────────────────────────────────
  const drafts = getAllDrafts();

  return (
    <header className="bg-[#8ce1ae] text-white px-4 sm:px-6 py-3 fixed top-0 left-0 w-full z-[1000]">
      {/* Top bar */}
      <div className="flex items-center justify-between w-full">
        {/* Logo Section */}
        <div className="flex-shrink-0">
          {showMinimalHeader ? (
            <div className="flex items-center gap-2">
              <img src={CompanyLogo} alt="Logo" className="h-10 sm:h-12 w-auto" />
            </div>
          ) : (
            <Link to="/home" className="flex items-center gap-2 text-white no-underline">
              <img src={CompanyLogo} alt="Logo" className="h-10 sm:h-12 w-auto" />
            </Link>
          )}
        </div>

        {/* Center Search Bar — desktop only */}
        {showSearchBar && (
          <div className="hidden md:flex flex-1 max-w-2xl mx-6">
            <SearchBar compact={true} />
          </div>
        )}

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-4 items-center flex-shrink-0">
          {showMinimalHeader ? (
            <>
              <Link to="/about" state={{ fromLogin: true, headerType: 'header' }} className="text-white no-underline hover:underline">About us</Link>
              <Link to="/contacts" state={{ fromLogin: true, headerType: 'header' }} className="text-white no-underline hover:underline">Contact us</Link>
            </>
          ) : (
            <>
              <Link to="/home" className="text-white no-underline hover:underline">Home</Link>
              <Link to="/about" state={{ headerType: 'header' }} className="text-white no-underline hover:underline">About us</Link>
              <Link to="/contacts" state={{ headerType: 'header' }} className="text-white no-underline hover:underline">Contact us</Link>
              <Link to="/drugslist" className="text-white no-underline hover:underline">Drugs List</Link>

              {/* Drafts Dropdown */}
              {drafts && drafts.length > 0 && (
                <div ref={draftsDropdownRef} className="relative">
                  <button
                    onClick={() => setDraftsDropdownOpen((p) => !p)}
                    title="Click to view your drafts"
                    style={{
                      display: "flex", alignItems: "center", gap: "6px",
                      padding: "4px 12px", borderRadius: "999px",
                      backgroundColor: "#f59e0b", color: "#1c1917",
                      fontWeight: 600, fontSize: "13px", border: "none",
                      cursor: "pointer", whiteSpace: "nowrap",
                      boxShadow: "0 0 0 3px rgba(245,158,11,0.35)",
                    }}
                  >
                    <span style={{ fontSize: "15px" }}>💾</span>
                    My Drafts ({drafts.length}) ▾
                  </button>
                  {draftsDropdownOpen && (
                    <div className="absolute top-full right-0 bg-white border border-gray-300 rounded-md shadow-lg mt-2 min-w-[200px] overflow-hidden max-h-[300px] overflow-y-auto">
                      {drafts.sort((a, b) => b.lastModified - a.lastModified).map(draft => (
                        <div
                          key={draft.id}
                          onClick={() => { setDraftsDropdownOpen(false); navigate(`/drug-form?draftId=${draft.id}`); }}
                          className="w-full text-left px-4 py-3 text-black hover:bg-amber-50 hover:text-amber-900 transition-colors duration-200 cursor-pointer border-b border-gray-100 last:border-0"
                        >
                          <div className="font-semibold text-sm truncate">{draft.drugName || "Unnamed Draft"}</div>
                          <div className="text-xs text-gray-500 mt-1">{new Date(draft.lastModified).toLocaleString()}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* User Dropdown */}
              <div ref={dropdownRef} className="ml-4 relative">
                <span className="cursor-pointer font-bold" onClick={() => setDropdownOpen((p) => !p)}>
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

        {/* Hamburger button — mobile only */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2 focus:outline-none"
          onClick={() => setMobileMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile Search Bar */}
      {showSearchBar && (
        <div className="md:hidden mt-2">
          <SearchBar compact={true} />
        </div>
      )}

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <nav className="md:hidden flex flex-col gap-3 mt-3 pb-3 border-t border-white/30 pt-3">
          {showMinimalHeader ? (
            <>
              <Link to="/about" state={{ fromLogin: true, headerType: 'header' }} className="text-white no-underline" onClick={() => setMobileMenuOpen(false)}>About us</Link>
              <Link to="/contacts" state={{ fromLogin: true, headerType: 'header' }} className="text-white no-underline" onClick={() => setMobileMenuOpen(false)}>Contact us</Link>
            </>
          ) : (
            <>
              <Link to="/home" className="text-white no-underline" onClick={() => setMobileMenuOpen(false)}>Home</Link>
              <Link to="/about" state={{ headerType: 'header' }} className="text-white no-underline" onClick={() => setMobileMenuOpen(false)}>About us</Link>
              <Link to="/contacts" state={{ headerType: 'header' }} className="text-white no-underline" onClick={() => setMobileMenuOpen(false)}>Contact us</Link>
              <Link to="/drugslist" className="text-white no-underline" onClick={() => setMobileMenuOpen(false)}>Drugs List</Link>
              {drafts && drafts.length > 0 && (
                <span className="text-white font-semibold">
                  💾 My Drafts ({drafts.length})
                </span>
              )}
              <button onClick={handleLogout} className="text-left text-white font-semibold">
                👤 {user?.data?.name || "User"} — Logout
              </button>
            </>
          )}
        </nav>
      )}
    </header>
  );
};

export default AuthenticatedHeader;
