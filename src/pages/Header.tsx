
import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import CompanyLogo from "../assets/cmcintel.png";
import SearchBar from "../components/SearchBar";
import AuthService from "../services/AuthService";
import { useUser } from "../context/UserContext";
import { HiMenu, HiX } from "react-icons/hi";

interface HeaderProps {
  isLoginPage?: boolean; // optional prop to indicate if on login page
}


const Header: React.FC<HeaderProps> = ({ isLoginPage }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const {user}=useUser()
console.log("Header User:", user);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  // close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

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
    <header className={`bg-[#36b669] text-white px-4 sm:px-6 py-3 fixed top-0 left-0 w-full z-[1000]`}>
      {/* Mobile Layout */}
      <div className="flex flex-col sm:hidden">
        {/* Top Row: Logo, Search Bar, Burger */}
        <div className="flex flex-row items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center flex-shrink-0">
            {showMinimalHeader ? (
              <img src={CompanyLogo} alt="Logo" className="h-8" />
            ) : (
              <Link to="/home" className="text-white no-underline">
                <img src={CompanyLogo} alt="Logo" className="h-8" />
              </Link>
            )}
          </div>

          {/* Search Bar in the middle */}
          {showSearchBar && (
            <div className="flex-1 mx-2">
              <SearchBar compact={true} />
            </div>
          )}

          {/* Navigation Section */}
          <nav className="flex items-center flex-shrink-0 text-sm">
            {showMinimalHeader ? (
              <>
                <Link
                  to="/about"
                  state={{ fromLogin: true }}
                  className="text-white no-underline px-2 py-1"
                >
                  About
                </Link>
                <Link
                  to="/contacts"
                  state={{ fromLogin: true }}
                  className="text-white no-underline px-2 py-1"
                >
                  Contacts
                </Link>
              </>
            ) : (
              <>
                {/* Mobile Menu Button */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="text-white p-2 hover:bg-[#2d5a4f] rounded transition-colors duration-200"
                >
                  {mobileMenuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
                </button>
              </>
            )}
          </nav>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden sm:flex flex-row items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center gap-2 flex-shrink-0">
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
        <nav className="flex gap-4 items-center flex-shrink-0 text-base">
        {showMinimalHeader ? (
          <>
            <Link
              to="/about"
              state={{ fromLogin: true }}
              className="text-white no-underline px-2 py-1"
            >
              About
            </Link>
            <Link
              to="/contacts"
              state={{ fromLogin: true }}
              className="text-white no-underline px-2 py-1"
            >
              Contacts
            </Link>
          </>
        ) : (
          <>
            {/* Desktop Navigation */}
            <div className="hidden sm:flex gap-4 items-center">
              <Link to="/home" className="text-white no-underline px-2 py-1">
                Home
              </Link>
              <Link to="/about" className="text-white no-underline px-2 py-1">
                About
              </Link>
              <Link to="/contacts" className="text-white no-underline px-2 py-1">
                Contacts
              </Link>

              {/* User Dropdown */}
              <div
                ref={dropdownRef}
                className="relative ml-2 sm:ml-8"
              >
                <span
                  className="cursor-pointer font-bold px-2 py-1"
                  onClick={() => setDropdownOpen((p) => !p)}
                >
                  👤 User
                </span>
                {dropdownOpen && (
                  <div className="absolute top-full right-0 bg-white border border-gray-300 rounded-md shadow-md mt-2 min-w-[100px] overflow-hidden z-[1001]">
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
            </div>

            {/* Mobile Menu Button */}
            <div className="sm:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-white p-2 hover:bg-[#2d5a4f] rounded transition-colors duration-200"
              >
                {mobileMenuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
              </button>
            </div>
          </>
        )}
        </nav>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && !showMinimalHeader && (
        <div className="sm:hidden absolute top-full left-0 w-full bg-[#36b669] text-white border-t border-[#2d5a4f] shadow-lg z-[999]">
          <div className="flex flex-col py-2">
            <Link
              to="/home"
              className="text-white no-underline px-6 py-3 hover:bg-[#2d5a4f] hover:text-white transition-colors duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/about"
              className="text-white no-underline px-6 py-3 hover:bg-[#2d5a4f] hover:text-white transition-colors duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/contacts"
              className="text-white no-underline px-6 py-3 hover:bg-[#2d5a4f] hover:text-white transition-colors duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contacts
            </Link>
            <div className="border-t border-[#2d5a4f] mt-2 pt-2">
              <Link
                to="/profile"
                className="block text-white no-underline px-6 py-3 hover:bg-[#2d5a4f] hover:text-white transition-colors duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                Profile
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left text-white px-6 py-3 hover:bg-[#2d5a4f] hover:text-white transition-colors duration-200 cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
