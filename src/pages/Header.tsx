
import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import CompanyLogo from "../assets/cmcintel.png";
import SearchBar from "../components/SearchBar";
import AuthService from "../services/AuthService";

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

  // show search bar condition (not on home page and not on login/minimal pages)
  const showSearchBar = !isLoginPage && location.pathname !== "/home" && !showMinimalHeader;

  const handleLogout = () => {
    AuthService.logout(); // This deletes token and localStorage user
    setDropdownOpen(false);
    navigate("/login");
  };

  return (
    <header className={`flex flex-col sm:flex-row items-center bg-[#36b669] text-white px-4 sm:px-6 py-3 fixed top-0 left-0 w-full z-[1000] ${showSearchBar ? 'justify-between' : 'justify-between'}`}>
      {/* Logo Section */}
      <div className="flex-shrink-0 mb-2 sm:mb-0">
        {showMinimalHeader ? (
          <div className="flex items-center gap-2">
            <img src={CompanyLogo} alt="Logo"  className="h-8 sm:h-10" />
            <span className="font-bold text-lg sm:text-xl">CMCINTEL</span>
          </div>
        ) : (
          <Link
            to="/home"
            className="flex items-center gap-2 text-white no-underline"
          >
            <img src={CompanyLogo} alt="Logo" className="h-8 sm:h-10" />
            <span className="font-bold text-lg sm:text-xl">CMCINTEL</span>
          </Link>
        )}
      </div>

      {/* Center Search Bar */}
      {showSearchBar && (
        <div className="flex-1 max-w-2xl mx-0 sm:mx-8 w-full sm:w-auto mb-2 sm:mb-0">
          <SearchBar compact={true} />
        </div>
      )}

      {/* Navigation Section */}
      <nav className="flex gap-2 sm:gap-4 items-center flex-shrink-0 flex-wrap justify-center sm:justify-end">
        {showMinimalHeader ? (
          <>
            <Link
              to="/about"
              state={{ fromLogin: true }}
              className="text-white no-underline text-sm sm:text-base"
            >
              About
            </Link>
            <Link
              to="/contacts"
              state={{ fromLogin: true }}
              className="text-white no-underline text-sm sm:text-base"
            >
              Contacts
            </Link>
          </>
        ) : (
          <>
            <Link to="/home" className="text-white no-underline text-sm sm:text-base">
              Home
            </Link>
            <Link to="/about" className="text-white no-underline text-sm sm:text-base">
              About
            </Link>
            <Link to="/contacts" className="text-white no-underline text-sm sm:text-base">
              Contacts
            </Link>

            {/* User Dropdown */}
            <div
              ref={dropdownRef}
              className="relative ml-2 sm:ml-8"
            >
              <span
                className="cursor-pointer font-bold text-sm sm:text-base"
                onClick={() => setDropdownOpen((p) => !p)}
              >
                👤 User
              </span>
              {dropdownOpen && (
                <div className="absolute top-full right-0 bg-white border border-gray-300 rounded-md shadow-md mt-2 min-w-[100px] overflow-hidden z-[1001]">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 border-b border-gray-300 text-black hover:bg-[#3678f4ff] hover:text-white transition-colors duration-200 text-sm sm:text-base"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Profile
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-black hover:bg-[#3678f4ff] hover:text-white transition-colors duration-200 cursor-pointer text-sm sm:text-base"
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
