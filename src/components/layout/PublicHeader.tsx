import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import CompanyLogo from "../../assets/CMCINTELLOGO.png";
import { FaRegUser } from "react-icons/fa";

const PublicHeader = () => {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const navLinkClass = ({ isActive }: { isActive: boolean }) => 
        `font-medium text-sm no-underline transition-colors pb-1 border-b-2 font-display ${
            isActive 
                ? 'border-primary text-primary' 
                : 'text-[#334155] border-transparent hover:text-primary-hover'
        }`;

    const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) => 
        `font-medium no-underline transition-colors pb-1 border-b-2 inline-block font-display ${
            isActive 
                ? 'border-primary text-primary' 
                : 'text-[#334155] border-transparent hover:text-primary-hover'
        }`;

    return (
        <header className="bg-white/95 backdrop-blur-md border-b border-border-main text-[#334155] px-4 sm:px-6 py-3 fixed top-0 left-0 w-full z-[1000] shadow-sm">
            <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
                {/* Logo */}
                <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
                    <img
                        src={CompanyLogo}
                        alt="Logo"
                        className="h-10 sm:h-12 w-auto"
                    />
                </div>

                {/* Desktop Nav */}
                <nav className="hidden md:flex gap-8 items-center flex-shrink-0">
                    <NavLink to="/what-we-do" className={navLinkClass}>What we do</NavLink>
                    <NavLink to="/areas-served" className={navLinkClass}>Areas Served</NavLink>
                    <NavLink to="/about" state={{ headerType: 'header1' }} className={navLinkClass}>About us</NavLink>
                    <NavLink to="/contacts" state={{ headerType: 'header1' }} className={navLinkClass}>Contact us</NavLink>
                    <NavLink to="/login" className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg hover:bg-primary-hover transition-colors font-medium border-0 font-display">
                        <FaRegUser className="text-sm" />
                        Login
                    </NavLink>
                </nav>

                {/* Hamburger Button */}
                <button
                    className="md:hidden flex flex-col gap-1.5 p-2 focus:outline-none"
                    onClick={() => setMenuOpen((o) => !o)}
                    aria-label="Toggle menu"
                >
                    <span className={`block w-6 h-0.5 bg-[#334155] transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                    <span className={`block w-6 h-0.5 bg-[#334155] transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
                    <span className={`block w-6 h-0.5 bg-[#334155] transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                </button>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <nav className="md:hidden flex flex-col items-start gap-4 mt-4 pb-4 border-t border-border-main pt-4 bg-white px-4 rounded-b-xl shadow-lg absolute left-0 right-0 top-full">
                    <NavLink to="/what-we-do" className={mobileNavLinkClass} onClick={() => setMenuOpen(false)}>What we do</NavLink>
                    <NavLink to="/areas-served" className={mobileNavLinkClass} onClick={() => setMenuOpen(false)}>Areas Served</NavLink>
                    <NavLink to="/about" state={{ headerType: 'header1' }} className={mobileNavLinkClass} onClick={() => setMenuOpen(false)}>About us</NavLink>
                    <NavLink to="/contacts" state={{ headerType: 'header1' }} className={mobileNavLinkClass} onClick={() => setMenuOpen(false)}>Contact us</NavLink>
                    <NavLink to="/login" className="flex items-center justify-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg hover:bg-primary-hover transition-colors font-medium border-0 w-full font-display" onClick={() => setMenuOpen(false)}>
                        <FaRegUser className="text-sm" />
                        Login
                    </NavLink>
                </nav>
            )}
        </header>
    );
};

export default PublicHeader;
