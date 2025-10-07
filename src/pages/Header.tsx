
import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import CompanyLogo from "../assets/cmcintel.png";
import SearchBar from "../components/SearchBar";

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
    localStorage.removeItem("user"); // adjust if you use auth context
    setDropdownOpen(false);
    navigate("/login");
  };

  return (
    <header className={`flex items-center bg-[#36b669] text-white px-6 py-3 fixed top-0 left-0 w-full z-[1000] ${showSearchBar ? 'justify-between' : 'justify-between'}`}>
      {/* Logo Section */}
      <div className="flex-shrink-0">
        {showMinimalHeader ? (
          <div className="flex items-center gap-2">
            <img src={CompanyLogo} alt="Logo"  className="h-10" />
            <span className="font-bold text-xl">CMCINTEL</span>
          </div>
        ) : (
          <Link
            to="/home"
            className="flex items-center gap-2 text-white no-underline"
          >
            <img src={CompanyLogo} alt="Logo" className="h-10" />
            <span className="font-bold text-xl">CMCINTEL</span>
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
              state={{ fromLogin: true }}
              className="text-white no-underline"
            >
              About
            </Link>
            <Link
              to="/contacts"
              state={{ fromLogin: true }}
              className="text-white no-underline"
            >
              Contacts
            </Link>
          </>
        ) : (
          <>
            <Link to="/home" className="text-white no-underline">
              Home
            </Link>
            <Link to="/about" className="text-white no-underline">
              About
            </Link>
            <Link to="/contacts" className="text-white no-underline">
              Contacts
            </Link>

            {/* User Dropdown */}
            <div
              ref={dropdownRef}
              className="ml-8 relative"
            >
              <span
                className="cursor-pointer font-bold"
                onClick={() => setDropdownOpen((p) => !p)}
              >
                👤 User
              </span>
              {dropdownOpen && (
                <div className="absolute top-full right-0 bg-white border border-gray-300 rounded-md shadow-md mt-2 min-w-[100px] overflow-hidden">
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
