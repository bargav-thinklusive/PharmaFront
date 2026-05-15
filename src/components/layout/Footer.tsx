import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => (
    <footer className="bg-[#8ce1ae] text-white w-full mt-auto">
        {/* Nav Links Row */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 mb-4">
                <Link to="/"             className="text-white hover:text-green-900 no-underline text-sm font-medium transition-colors">Home</Link>
                <Link to="/what-we-do"   className="text-white hover:text-green-900 no-underline text-sm font-medium transition-colors">What We Do</Link>
                <Link to="/areas-served" className="text-white hover:text-green-900 no-underline text-sm font-medium transition-colors">Areas Served</Link>
                <Link to="/about"        className="text-white hover:text-green-900 no-underline text-sm font-medium transition-colors">About Us</Link>
                <Link to="/contacts"     className="text-white hover:text-green-900 no-underline text-sm font-medium transition-colors">Contact Us</Link>
            </div>
            {/* Divider */}
            <div className="border-t border-white/30 pt-4 text-center">
                <p className="m-0 text-sm">&copy; 2025 CMCINTEL. All rights reserved.</p>
            </div>
        </div>
    </footer>
);

export default Footer;
