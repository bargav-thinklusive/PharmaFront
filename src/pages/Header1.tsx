

import { Link } from "react-router-dom";
import CompanyLogo from "../assets/CMCINTELLOGO.png";

const Header1 = () => {

    return (
        <header className={`flex items-center bg-[#36b669] text-white px-6 py-3 fixed top-0 left-0 w-full z-[1000] `}>
            {/* Logo Section */}
            <div className="flex-shrink-0">

                <div className="flex items-center gap-2">
                    <img src={CompanyLogo} alt="Logo" className="h-10 w-15" />
                    {/* <span className="font-bold text-xl">CMCINTEL</span> */}
                </div>
            </div>



            {/* Navigation Section */}
            <nav className="flex gap-4 items-center flex-shrink-0">

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


            </nav>
        </header>
    );
};

export default Header1;
