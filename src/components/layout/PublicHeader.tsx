import { Link, useNavigate } from "react-router-dom";
import CompanyLogo from "../../assets/CMCINTELLOGO.png";

const PublicHeader = () => {
    const navigate = useNavigate();
    return (
        <header className="flex items-center justify-between bg-[#8ce1ae] text-white px-6 py-3 fixed top-0 left-0 w-full z-[1000]">
            {/* Logo Section */}
            <div className="flex-shrink-0">
                <div className="flex items-center gap-2">
                    <img src={CompanyLogo} alt="Logo" className="h-10 w-20 cursor-pointer" onClick={() => navigate("/")} />
                </div>
            </div>

            {/* Navigation Section */}
            <nav className="flex gap-4 items-center flex-shrink-0">
                <Link
                    to="/what-we-do"
                    className="text-white no-underline"
                >
                    What we do
                </Link>
                <Link
                    to="/areas-served"
                    className="text-white no-underline"
                >
                    Areas Served
                </Link>
                <Link
                    to="/about"
                    state={{ headerType: 'header1' }}
                    className="text-white no-underline"
                >
                    About us
                </Link>
                <Link
                    to="/contacts"
                    state={{ headerType: 'header1' }}
                    className="text-white no-underline"
                >
                    Contacts us
                </Link>

                <Link
                    to="/login"
                    className="bg-white text-[#36b669] px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
                >
                    Login
                </Link>
            </nav>
        </header>
    );
};

export default PublicHeader;
