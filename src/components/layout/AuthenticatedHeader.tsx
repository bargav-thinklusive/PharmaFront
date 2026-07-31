import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import CompanyLogo from "../../assets/CMCINTELLOGO.png";
import AuthService from "../../services/AuthService";
import { useUser } from "../../context/UserContext";
import useRoles from "../../hooks/useRoles";
import useDraft from "../../hooks/useDraft";
import { FiChevronDown, FiLogOut, FiUser, FiFileText, FiTrash2, FiSave, FiX } from "react-icons/fi";
import { toast } from "react-toastify";

interface AuthenticatedHeaderProps {
  isLoginPage?: boolean;
}

const AuthenticatedHeader: React.FC<AuthenticatedHeaderProps> = ({ isLoginPage }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, drafts, selectedList, setSelectedList } = useUser();
  const { canEditDrugs, canManageUsers, roles } = useRoles();
  const { clearDraft } = useDraft();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [draftsDropdownOpen, setDraftsDropdownOpen] = useState(false);
  const draftsDropdownRef = useRef<HTMLDivElement>(null);

  const [drugsListDropdownOpen, setDrugsListDropdownOpen] = useState(false);
  const drugsListDropdownRef = useRef<HTMLDivElement>(null);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Local state to force re-render when a draft is removed
  const [draftTick, setDraftTick] = useState(0);

  const [pendingPath, setPendingPath] = useState<string | null>(null);
  const [showSaveDraftConfirm, setShowSaveDraftConfirm] = useState(false);

  useEffect(() => {
    (window as any).triggerSaveDraftNavigationBlocker = (path: string) => {
      setPendingPath(path);
      setShowSaveDraftConfirm(true);
    };
    return () => {
      delete (window as any).triggerSaveDraftNavigationBlocker;
    };
  }, []);

  const getInitials = (nameStr?: string) => {
    if (!nameStr) return "US";
    const parts = nameStr.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return nameStr.slice(0, 2).toUpperCase();
  };

  const userInitials = getInitials(user?.data?.name);

  const handleHeaderNavClick = (path: string, e: React.MouseEvent, closeMobile = false) => {
    if (closeMobile) {
      setMobileMenuOpen(false);
    }
    if (location.pathname === "/drug-form" && (window as any).triggerSaveDraftNavigationBlocker) {
      e.preventDefault();
      (window as any).triggerSaveDraftNavigationBlocker(path);
    }
  };

  const handleConfirmSaveDraft = () => {
    setShowSaveDraftConfirm(false);
    if ((window as any).executeSaveDraftGlobal) {
      try {
        (window as any).executeSaveDraftGlobal();
        toast.success("Draft saved successfully!", {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
      } catch (err) {
        console.error("Error saving draft during navigation:", err);
        toast.error("Failed to save draft. Please try again.", {
          position: "bottom-right",
          autoClose: 3000,
          theme: "light",
        });
      }
    }
    if (pendingPath) {
      navigate(pendingPath);
      setPendingPath(null);
    }
  };

  const handleCancelSaveDraft = () => {
    setShowSaveDraftConfirm(false);
    setPendingPath(null);
  };

  // Close dropdowns if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
      if (draftsDropdownRef.current && !draftsDropdownRef.current.contains(event.target as Node)) {
        setDraftsDropdownOpen(false);
      }
      if (drugsListDropdownRef.current && !drugsListDropdownRef.current.contains(event.target as Node)) {
        setDrugsListDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isAboutOrContacts =
    location.pathname === "/about" || location.pathname === "/contacts";
  const fromLogin = location.state?.fromLogin === true;
  const showMinimalHeader = isLoginPage || (isAboutOrContacts && fromLogin);

  const handleLogout = () => {
    AuthService.logout();
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    window.location.href = "/login";
  };

  const handleRemoveDraft = async (e: React.MouseEvent, draftId: string) => {
    e.stopPropagation(); // prevent navigating to the draft
    await clearDraft(draftId);
    setDraftTick((t) => t + 1); // force re-render
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `font-medium text-sm no-underline transition-colors pb-1 border-b-2 font-display ${isActive
      ? "border-primary text-primary"
      : "text-[#334155] border-transparent hover:text-primary-hover"
    }`;

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-border-main text-[#334155] px-4 sm:px-6 py-3 fixed top-0 left-0 w-full z-[1000] shadow-sm">
      {/* Top bar */}
      <div className="flex items-center justify-between w-full max-w-[1440px] mx-auto">

        {/* Logo */}
        <div className="flex-shrink-0">
          {showMinimalHeader ? (
            <div className="flex items-center gap-2">
              <img src={CompanyLogo} alt="Logo" className="h-10 sm:h-12 w-auto" />
            </div>
          ) : (
            <Link to="/home" className="flex items-center gap-2 no-underline" onClick={(e) => handleHeaderNavClick("/home", e)}>
              <img src={CompanyLogo} alt="Logo" className="h-10 sm:h-12 w-auto" />
            </Link>
          )}
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-6 items-center flex-shrink-0">
          {showMinimalHeader ? (
            <>
              <NavLink to="/about" state={{ fromLogin: true, headerType: "header" }} className={navLinkClass} onClick={(e) => handleHeaderNavClick("/about", e)}>About us</NavLink>
              <NavLink to="/contacts" state={{ fromLogin: true, headerType: "header" }} className={navLinkClass} onClick={(e) => handleHeaderNavClick("/contacts", e)}>Contact us</NavLink>
            </>
          ) : (
            <>
              <NavLink to="/home" end className={navLinkClass} onClick={(e) => handleHeaderNavClick("/home", e)}>Home</NavLink>
              <NavLink to="/about" state={{ headerType: "header" }} className={navLinkClass} onClick={(e) => handleHeaderNavClick("/about", e)}>About us</NavLink>
              <NavLink to="/contacts" state={{ headerType: "header" }} className={navLinkClass} onClick={(e) => handleHeaderNavClick("/contacts", e)}>Contact us</NavLink>

              {/* Drugs List Dropdown — editor and admin only */}
              {canEditDrugs && (
                <div ref={drugsListDropdownRef} className="relative flex items-center">
                  <NavLink
                    to="/drugsList"
                    onClick={(e) => {
                      handleHeaderNavClick("/drugsList", e);
                      setDrugsListDropdownOpen((p) => !p);
                    }}
                    className={({ isActive }) =>
                      `flex items-center gap-1.5 font-medium text-sm no-underline transition-colors pb-1 border-b-2 font-display cursor-pointer ${
                        isActive || location.pathname.toLowerCase().includes("drugslist") || drugsListDropdownOpen
                          ? "border-primary text-primary"
                          : "text-[#334155] border-transparent hover:text-primary-hover"
                      }`
                    }
                  >
                    Drugs List
                    <FiChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${drugsListDropdownOpen ? "rotate-180" : ""}`} />
                  </NavLink>

                  {drugsListDropdownOpen && (
                    <div className="absolute top-full left-0 bg-white border border-border-main rounded-md shadow-xl mt-2 min-w-[200px] overflow-hidden z-50 py-1.5 text-[13.5px] font-semibold text-gray-700">
                      <button
                        onClick={() => {
                          setSelectedList('fda');
                          setDrugsListDropdownOpen(false);
                          navigate('/drugsList');
                        }}
                        className={`w-full text-left px-4 py-2.5 hover:bg-gray-50 transition-colors flex items-center justify-between cursor-pointer ${
                          selectedList === 'fda' ? 'text-primary bg-primary-light/30' : ''
                        }`}
                      >
                        FDA Approved List
                      </button>
                      <button
                        onClick={() => {
                          setSelectedList('cmcintel');
                          setDrugsListDropdownOpen(false);
                          navigate('/drugsList');
                        }}
                        className={`w-full text-left px-4 py-2.5 hover:bg-gray-50 transition-colors border-t border-gray-100 flex items-center justify-between cursor-pointer ${
                          selectedList === 'cmcintel' ? 'text-primary bg-primary-light/30' : ''
                        }`}
                      >
                        cmcintel Library List
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Admin Panel — admin only */}
              {canManageUsers && (
                <NavLink
                  to="/admin"
                  className={navLinkClass}
                  onClick={(e) => handleHeaderNavClick("/admin", e)}
                >
                  Users List
                </NavLink>
              )}

              {/* Drafts Dropdown */}
              {drafts && drafts.length > 0 && (
                <div ref={draftsDropdownRef} className="relative" data-tick={draftTick}>
                  <button
                    onClick={() => setDraftsDropdownOpen((p) => !p)}
                    title="Click to view your drafts"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-light text-primary font-semibold text-xs border border-primary/20 hover:bg-primary hover:text-white transition-colors cursor-pointer whitespace-nowrap"
                    style={{ animation: "draftPulse 2s ease-in-out infinite" }}
                  >
                    <FiFileText className="w-3.5 h-3.5" />
                    My Drafts ({drafts.length})
                    <FiChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${draftsDropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  {draftsDropdownOpen && (
                    <div className="absolute top-full right-0 bg-white border border-border-main rounded-md shadow-xl mt-2 min-w-[260px] overflow-hidden max-h-[320px] overflow-y-auto z-50">
                      {/* Header row */}
                      <div className="px-4 py-2.5 border-b border-border-main bg-alt/50">
                        <span className="text-xs font-bold text-main uppercase tracking-wider">Saved Drafts</span>
                      </div>

                      {drafts.sort((a: any, b: any) => b.lastModified - a.lastModified).map((draft: any) => (
                        <div
                          key={draft.id}
                          className="flex items-center gap-2 px-4 py-3 border-b border-border-main last:border-0 hover:bg-primary-light group transition-colors duration-150"
                        >
                          {/* Draft info — clickable to open */}
                          <div
                            className="flex-1 min-w-0 cursor-pointer"
                            onClick={() => { setDraftsDropdownOpen(false); navigate(`/drug-form?draftId=${draft.id}`); }}
                          >
                            <div className="font-semibold text-sm text-main truncate group-hover:text-primary transition-colors">
                              {draft.drugName || "Unnamed Draft"}
                            </div>
                            <div className="text-xs text-body mt-0.5">
                              {new Date(draft.lastModified).toLocaleString()}
                            </div>
                          </div>

                          {/* Remove button */}
                          <button
                            onClick={(e) => handleRemoveDraft(e, draft.id)}
                            title="Remove draft"
                            className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-body hover:bg-red-100 hover:text-red-600 transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
                          >
                            <FiTrash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* User Dropdown */}
              <div ref={dropdownRef} className="relative ml-2">
                <button
                  onClick={() => setDropdownOpen((p) => !p)}
                  className="w-9 h-9 rounded-full bg-primary hover:bg-primary text-white font-bold text-xs cursor-pointer flex items-center justify-center shadow-sm select-none border-0"
                  title={user?.data?.name || "User Profile"}
                >
                  <span className="font-display tracking-wide">{userInitials}</span>
                </button>

                {dropdownOpen && (
                  <div className="absolute top-full right-0 bg-white border border-border-main rounded-md shadow-xl mt-2 min-w-[220px] overflow-hidden z-50 p-2 animate-scale-up">
                    {/* User Profile Header in Dropdown */}
                    <div className="px-3.5 py-3 bg-alt/60 rounded-sm mb-1 flex flex-col gap-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-sm text-text-main font-sans truncate">
                          {user?.data?.name || "User"}
                        </span>
                        {roles.length > 0 && (
                          <span className="text-[10px] bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-md font-bold capitalize font-sans shrink-0">
                            {roles[0]}
                          </span>
                        )}
                      </div>
                      {user?.data?.email && (
                        <span className="text-xs text-text-secondary truncate font-sans">
                          {user.data.email}
                        </span>
                      )}
                    </div>

                    <div className="border-t border-border-main my-1" />

                    {/* Logout Button */}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3.5 py-2.5 rounded-sm flex items-center gap-2.5 text-red-600 hover:bg-red-50 transition-colors duration-150 text-xs font-semibold cursor-pointer"
                    >
                      <FiLogOut className="w-4 h-4 text-red-500" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </nav>

        {/* Hamburger button — mobile only */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2 focus:outline-none"
          style={{ cursor: "pointer" }}
          onClick={() => setMobileMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-0.5 bg-[#334155] transition-all duration-300 ${mobileMenuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-6 h-0.5 bg-[#334155] transition-all duration-300 ${mobileMenuOpen ? "opacity-0" : ""}`} />
          <span className={`block w-6 h-0.5 bg-[#334155] transition-all duration-300 ${mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <nav className="md:hidden flex flex-col gap-3 mt-3 pb-4 border-t border-border-main pt-4 max-w-[1440px] mx-auto">
          {showMinimalHeader ? (
            <>
              <Link to="/about" state={{ fromLogin: true, headerType: "header" }} className="text-[#334155] no-underline font-medium" onClick={(e) => handleHeaderNavClick("/about", e, true)}>About us</Link>
              <Link to="/contacts" state={{ fromLogin: true, headerType: "header" }} className="text-[#334155] no-underline font-medium" onClick={(e) => handleHeaderNavClick("/contacts", e, true)}>Contact us</Link>
            </>
          ) : (
            <>
              <Link to="/home" className="text-[#334155] no-underline font-medium" onClick={(e) => handleHeaderNavClick("/home", e, true)}>Home</Link>
              <Link to="/about" state={{ headerType: "header" }} className="text-[#334155] no-underline font-medium" onClick={(e) => handleHeaderNavClick("/about", e, true)}>About us</Link>
              <Link to="/contacts" state={{ headerType: "header" }} className="text-[#334155] no-underline font-medium" onClick={(e) => handleHeaderNavClick("/contacts", e, true)}>Contact us</Link>

              {/* Mobile: Drugs List — editor and admin only */}
              {canEditDrugs && (
                <div className="flex flex-col gap-2">
                  <span className="text-[#334155] font-semibold text-xs uppercase tracking-wider">Drugs List</span>
                  <div className="flex flex-col gap-1.5 pl-3 border-l border-border-main">
                    <Link
                      to="/drugsList"
                      className={`text-sm no-underline font-medium ${selectedList === 'fda' ? 'text-primary font-bold' : 'text-body hover:text-primary-hover'}`}
                      onClick={(e) => {
                        setSelectedList('fda');
                        handleHeaderNavClick("/drugsList", e, true);
                      }}
                    >
                      FDA Approved List
                    </Link>
                    <Link
                      to="/drugsList"
                      className={`text-sm no-underline font-medium ${selectedList === 'cmcintel' ? 'text-primary font-bold' : 'text-body hover:text-primary-hover'}`}
                      onClick={(e) => {
                        setSelectedList('cmcintel');
                        handleHeaderNavClick("/drugsList", e, true);
                      }}
                    >
                      cmcintel Library List
                    </Link>
                  </div>
                </div>
              )}

              {/* Mobile: Admin Panel — admin only */}
              {canManageUsers && (
                <Link
                  to="/admin"
                  className="text-[#334155] no-underline font-medium"
                  onClick={(e) => handleHeaderNavClick("/admin", e, true)}
                >
                  Users List
                </Link>
              )}


              {/* Mobile Drafts list */}
              {drafts && drafts.length > 0 && (
                <div className="border border-border-main rounded-xl overflow-hidden">
                  <div className="px-3 py-2 bg-primary-light border-b border-border-main flex items-center gap-2">
                    <FiFileText className="w-3.5 h-3.5 text-primary" />
                    <span className="text-xs font-bold text-primary uppercase tracking-wider">My Drafts ({drafts.length})</span>
                  </div>
                  {drafts.sort((a: any, b: any) => b.lastModified - a.lastModified).map((draft: any) => (
                    <div key={draft.id} className="flex items-center gap-2 px-3 py-2.5 border-b border-border-main last:border-0">
                      <div
                        className="flex-1 min-w-0 cursor-pointer"
                        onClick={() => { setMobileMenuOpen(false); navigate(`/drug-form?draftId=${draft.id}`); }}
                      >
                        <div className="font-semibold text-sm text-main truncate">{draft.drugName || "Unnamed Draft"}</div>
                        <div className="text-xs text-body">{new Date(draft.lastModified).toLocaleString()}</div>
                      </div>
                      <button
                        onClick={(e) => handleRemoveDraft(e, draft.id)}
                        title="Remove draft"
                        className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-body hover:bg-red-100 hover:text-red-600 transition-colors cursor-pointer"
                      >
                        <FiTrash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-left text-red-600 font-semibold text-sm cursor-pointer mt-1"
              >
                <FiLogOut className="w-4 h-4" />
                <span className="flex items-center gap-1">
                  <FiUser className="w-3.5 h-3.5" />
                  {user?.data?.name || "User"}
                </span>
                — Logout
              </button>
            </>
          )}
        </nav>
      )}
      {/* ── Save Draft Confirmation Modal ── */}
      {showSaveDraftConfirm && ReactDOM.createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-sm animate-fade-in text-left">
          <div className="bg-white rounded-2xl shadow-2xl border border-border-main max-w-md w-full overflow-hidden animate-scale-up">
            {/* Modal header */}
            <div className="px-6 pt-6 pb-4 flex items-start gap-4 relative animate-scale-up">
              <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center flex-shrink-0 animate-pulse-slow">
                <FiSave className="w-6 h-6 text-amber-500" />
              </div>
              <div className="flex-1 min-w-0 pr-6">
                <h3 className="text-lg font-bold text-main font-display mb-1">
                  Save Draft
                </h3>
                <p className="text-sm text-body leading-relaxed">
                  Are you sure you want to save this draft? You can reload your draft anytime from the header menu.
                </p>
              </div>
              <button
                type="button"
                onClick={handleCancelSaveDraft}
                className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-body hover:text-main hover:bg-alt transition-colors cursor-pointer border-0"
                aria-label="Close"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>

            {/* Modal actions */}
            <div className="px-6 pb-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleCancelSaveDraft}
                className="px-5 py-2.5 rounded-xl border border-border-main bg-white text-main text-sm font-semibold hover:bg-alt transition-colors cursor-pointer shadow-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSaveDraft}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold transition-all duration-200 shadow-md hover:-translate-y-0.5 cursor-pointer"
              >
                Yes, Save
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </header>
  );
};

export default AuthenticatedHeader;
