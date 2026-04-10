import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CompanyLogo from "../../assets/CMCINTELLOGO.png";

const PublicHeader = () => {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className="bg-[#8ce1ae] text-white px-4 sm:px-6 py-3 fixed top-0 left-0 w-full z-[1000]">
            <div className="flex items-center justify-between w-full">
                {/* Logo */}
                <div className="flex-shrink-0">
                    <img
                        src={CompanyLogo}
                        alt="Logo"
                        className="h-10 sm:h-12 w-auto cursor-pointer"
                        onClick={() => navigate("/")}
                    />
                </div>

                {/* Desktop Nav */}
                <nav className="hidden md:flex gap-4 items-center flex-shrink-0">
                    <Link to="/what-we-do" className="text-white no-underline hover:underline">What we do</Link>
                    <Link to="/areas-served" className="text-white no-underline hover:underline">Areas Served</Link>
                    <Link to="/about" state={{ headerType: 'header1' }} className="text-white no-underline hover:underline">About us</Link>
                    <Link to="/contacts" state={{ headerType: 'header1' }} className="text-white no-underline hover:underline">Contact us</Link>
                    <Link to="/login" className="bg-white text-[#36b669] px-4 py-2 rounded-md hover:bg-gray-100 transition-colors font-semibold">Login</Link>
                </nav>

                {/* Hamburger Button */}
                <button
                    className="md:hidden flex flex-col gap-1.5 p-2 focus:outline-none"
                    onClick={() => setMenuOpen((o) => !o)}
                    aria-label="Toggle menu"
                >
                    <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                    <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
                    <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                </button>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <nav className="md:hidden flex flex-col gap-3 mt-3 pb-3 border-t border-white/30 pt-3">
                    <Link to="/what-we-do" className="text-white no-underline" onClick={() => setMenuOpen(false)}>What we do</Link>
                    <Link to="/areas-served" className="text-white no-underline" onClick={() => setMenuOpen(false)}>Areas Served</Link>
                    <Link to="/about" state={{ headerType: 'header1' }} className="text-white no-underline" onClick={() => setMenuOpen(false)}>About us</Link>
                    <Link to="/contacts" state={{ headerType: 'header1' }} className="text-white no-underline" onClick={() => setMenuOpen(false)}>Contact us</Link>
                    <Link to="/login" className="bg-white text-[#36b669] px-4 py-2 rounded-md text-center font-semibold" onClick={() => setMenuOpen(false)}>Login</Link>
                </nav>
            )}
        </header>
    );
};

export default PublicHeader;
