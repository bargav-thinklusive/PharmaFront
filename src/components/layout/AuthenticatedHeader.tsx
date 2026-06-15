import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import CompanyLogo from "../../assets/CMCINTELLOGO.png";
import SearchBar from "../SearchBar";
import AuthService from "../../services/AuthService";
import { useUser } from "../../context/UserContext";
import useRoles from "../../hooks/useRoles";

interface AuthenticatedHeaderProps {
  isLoginPage?: boolean;
}

const AuthenticatedHeader: React.FC<AuthenticatedHeaderProps> = ({ isLoginPage }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();
  const { isAdmin, canEditDrugs, canManageUsers, roles } = useRoles();

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

            {/* Drugs List — editor and admin only */}
            {canEditDrugs && (
              <Link to="/drugsList" className="text-white no-underline">
                Drugs List
              </Link>
            )}

            {/* Add Drug — editor and admin only */}
            {canEditDrugs && (
              <Link
                to="/drug-form"
                className="bg-white text-[#36b669] font-semibold px-3 py-1 rounded-md no-underline hover:bg-green-50 transition-colors duration-200"
              >
                + Add Drug
              </Link>
            )}

            {/* Admin Panel — admin only */}
            {canManageUsers && (
              <Link
                to="/admin"
                className="text-yellow-300 no-underline font-semibold hover:text-yellow-100 transition-colors duration-200"
              >
                ⚙ Admin
              </Link>
            )}

            {/* User Dropdown */}
            <div ref={dropdownRef} className="ml-4 relative">
              <span
                className="cursor-pointer font-bold flex items-center gap-1"
                onClick={() => setDropdownOpen((p) => !p)}
              >
                👤 {user?.data?.name || "User"}
                {/* Role badge */}
                {roles.length > 0 && (
                  <span className="text-[10px] bg-white/20 text-white px-1.5 py-0.5 rounded-full capitalize font-normal">
                    {roles[0]}
                  </span>
                )}
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
