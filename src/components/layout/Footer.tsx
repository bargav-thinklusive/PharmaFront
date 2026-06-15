import React from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin, FiLinkedin, FiTwitter, FiArrowUpRight } from 'react-icons/fi';
import CompanyLogo from '../../assets/CMCINTELLOGO.png';

const navLinks = [
  { label: 'Home',          to: '/' },
  { label: 'About Us',      to: '/about' },
  { label: 'Contact Us',    to: '/contacts' },
];

const contactItems = [
  { icon: <FiMail className="w-4 h-4" />,    text: 'sgarapati@cmcintel.com', href: 'mailto:sgarapati@cmcintel.com' },
  { icon: <FiPhone className="w-4 h-4" />,   text: '+1 (555) 123-4567',       href: 'tel:+15551234567' },
  { icon: <FiMapPin className="w-4 h-4" />,  text: 'Boston, MA 02110, USA',   href: undefined },
];

const Footer: React.FC = () => (
  <footer className="bg-navy text-white w-full mt-auto font-sans">

    {/* ── Main footer body ── */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">

        {/* ── Brand column ── */}
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-2">
            <img src={CompanyLogo} alt="CMCIntel Logo" className="h-10 sm:h-12 w-auto brightness-0 invert" />
          </div>
          <p className="text-white/60 text-sm leading-relaxed max-w-xs">
            Equipping pharmaceutical teams with the clarity and confidence to
            successfully build portfolios and execute filings globally.
          </p>
          {/* Social icons */}
          <div className="flex items-center gap-3 mt-1">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-primary flex items-center justify-center transition-colors duration-200"
            >
              <FiLinkedin className="w-4 h-4" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter / X"
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-primary flex items-center justify-center transition-colors duration-200"
            >
              <FiTwitter className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* ── Quick links ── */}
        <div className="flex flex-col gap-4">
          <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 font-display">
            Quick Links
          </h4>
          <ul className="flex flex-col gap-3">
            {navLinks.map(({ label, to }) => (
              <li key={to}>
                <Link
                  to={to}
                  className="group flex items-center gap-1.5 text-sm text-white/70 hover:text-primary transition-colors duration-200 no-underline"
                >
                  <FiArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Contact ── */}
        <div className="flex flex-col gap-4">
          <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 font-display">
            Contact
          </h4>
          <ul className="flex flex-col gap-4">
            {contactItems.map(({ icon, text, href }) => (
              <li key={text} className="flex items-start gap-3">
                <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary flex-shrink-0 mt-0.5">
                  {icon}
                </span>
                {href ? (
                  <a href={href} className="text-sm text-white/70 hover:text-primary transition-colors duration-200 no-underline leading-relaxed">
                    {text}
                  </a>
                ) : (
                  <span className="text-sm text-white/70 leading-relaxed">{text}</span>
                )}
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>

    {/* ── Bottom bar ── */}
    <div className="border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-white/40 m-0">
          &copy; {new Date().getFullYear()} CMCINTEL. All rights reserved.
        </p>
        <div className="flex items-center gap-5">
          <span className="text-xs text-white/40 hover:text-white/70 cursor-pointer transition-colors">Privacy Policy</span>
          <span className="text-white/20">·</span>
          <span className="text-xs text-white/40 hover:text-white/70 cursor-pointer transition-colors">Terms of Use</span>
        </div>
      </div>
    </div>

  </footer>
);

export default Footer;
