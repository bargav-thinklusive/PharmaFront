import { useState, useRef } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { FiUser, FiMail, FiLock, FiArrowRight, FiCheckCircle } from "react-icons/fi";
import usePost from "../../../hooks/usePost";
import LoginService from "../../../services/LoginService";
import { useNavigate } from "react-router";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CompanyLogo from "../../../assets/CMCINTELLOGO.png";

const login = new LoginService();

const Register: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { postData, loading } = usePost();
  const navigate = useNavigate();

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return minLength && hasUpper && hasLower && hasNumber && hasSpecial;
  };

  // Password strength indicator
  const getStrength = (pw: string) => {
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[a-z]/.test(pw)) score++;
    if (/\d/.test(pw)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(pw)) score++;
    return score;
  };
  const strength = getStrength(password);
  const strengthLabel = ["", "Weak", "Weak", "Fair", "Good", "Strong"][strength];
  const strengthColor = ["", "bg-red-400", "bg-orange-400", "bg-yellow-400", "bg-blue-400", "bg-primary"][strength];

  const handleSubmit = async (e?: React.FormEvent | React.KeyboardEvent) => {
    if (e) e.preventDefault();
    if (loading) return;
    const nameVal = nameRef.current?.value || username;
    const emailVal = emailRef.current?.value || email;
    const passwordVal = passwordRef.current?.value || password;
    try {
      if (!nameVal && !emailVal && !passwordVal)
        return setError("Please fill in all fields");
      if (!nameVal) return setError("Please enter your name");
      if (!emailVal) return setError("Please enter email");
      if (!validateEmail(emailVal)) return setError("Please enter a valid email");
      if (!passwordVal) return setError("Please enter a password");
      if (!validatePassword(passwordVal))
        return setError("Password must be 8+ chars with uppercase, lowercase, number, and special character");

      setError("");
      const payload = { name: nameVal, email: emailVal, password: passwordVal };
      await postData(login.createRegister(), payload);
      toast.success("🎉 Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err: any) {
      if (err.response?.data?.detail === "Email already registered") {
        setError("Email already registered. Please use a different email.");
        toast.error("Email already registered.");
      } else {
        setError("Registration failed. Please try again.");
        toast.error("Registration failed. Please try again.");
      }
      console.error("Registration error:", err);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      handleSubmit(e);
    }
  };

  const inputClass =
    "w-full pl-11 pr-4 py-3.5 border border-border-main rounded-xl text-sm text-main focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white placeholder-[#94A3B8] transition-shadow";

  const passwordInputClass =
    "w-full pl-11 pr-11 py-3.5 border border-border-main rounded-xl text-sm text-main focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white placeholder-[#94A3B8] transition-shadow";

  return (
    <>
      <ToastContainer
        position="bottom-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ zIndex: 99999 }}
        toastClassName="!bg-[#0F172A] !text-white text-center rounded-xl shadow-xl"
      />

      <div className="fixed inset-0 flex min-h-screen w-screen font-sans overflow-hidden">

        {/* ── Left branding panel ── */}
        <div
          className="hidden lg:flex lg:w-[55%] relative flex-col justify-between p-12 overflow-hidden"
          style={{ background: "linear-gradient(135deg, #0f1c3f 0%, #0d3a52 40%, #0a5c6e 70%, #0d7a72 100%)" }}
        >
          {/* Decorative blobs */}
          <div className="absolute top-[-15%] right-[-10%] w-[60%] h-[60%] rounded-full bg-teal-400/20 blur-3xl pointer-events-none" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-400/15 blur-3xl pointer-events-none" />

          {/* Dot-grid overlay */}
          <div
            className="absolute inset-0 opacity-5 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
              backgroundSize: "32px 32px",
            }}
          />

          {/* Logo — same as header: original colors */}
          <div className="relative z-10">
            <img
              src={CompanyLogo}
              alt="CMC Intel Logo"
              className="h-10 sm:h-12 w-auto"
              style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.45)) drop-shadow(0 0 20px rgba(255,255,255,0.15))" }}
            />
          </div>

          {/* Center content */}
          <div className="relative z-10 flex flex-col gap-8">
            <div className="inline-flex items-center gap-2 text-primary font-bold text-xs tracking-widest uppercase bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-full w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Join the Platform
            </div>

            <div>
              <h1 className="text-4xl xl:text-5xl font-extrabold text-white font-display leading-tight mb-4">
                Your Gateway to<br />
                <span className="text-primary">Regulatory</span> Intelligence
              </h1>
              <p className="text-white/60 text-base leading-relaxed max-w-sm">
                Get instant access to trusted pharmaceutical data, CMC intelligence, and global regulatory insights.
              </p>
            </div>

            {/* Benefits list */}
            <div className="flex flex-col gap-4">
              {[
                "Access trusted CMC & regulatory data",
                "Manage and track drug compounds",
                "Accelerate global filing strategies",
              ].map((benefit) => (
                <div key={benefit} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <FiCheckCircle className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-white/70 text-sm">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom tagline */}
          <p className="relative z-10 text-white/30 text-xs">
            © {new Date().getFullYear()} CMCIntel. All rights reserved.
          </p>
        </div>

        {/* ── Right form panel ── */}
        <div className="w-full lg:w-[45%] flex items-center justify-center bg-page px-6 py-10 overflow-y-auto">
          <div className="w-full max-w-md">

            {/* Mobile logo — same as header */}
            <div className="flex justify-center mb-8 lg:hidden">
              <img src={CompanyLogo} alt="CMC Intel Logo" className="h-10 sm:h-12 w-auto" />
            </div>

            {/* Form card */}
            <div className="bg-white rounded-3xl shadow-sm border border-border-main p-8 sm:p-10">

              {/* Heading */}
              <div className="mb-8">
                <h2 className="text-2xl font-extrabold text-main font-display mb-1">
                  Create your account
                </h2>
                <p className="text-body text-sm">
                  Join CMCIntel and get access to pharmaceutical intelligence.
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4"
              >

                {/* Name field */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#94A3B8]">
                    <FiUser className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    ref={nameRef}
                    placeholder="Full name"
                    value={username}
                    onChange={(e) => { setUsername(e.target.value); if (error) setError(""); }}
                    className={inputClass}
                    autoComplete="name"
                    onKeyDown={handleKeyDown}
                  />
                </div>

                {/* Email field */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#94A3B8]">
                    <FiMail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    ref={emailRef}
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); if (error) setError(""); }}
                    className={inputClass}
                    autoComplete="email"
                    onKeyDown={handleKeyDown}
                  />
                </div>

                {/* Password field */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#94A3B8]">
                    <FiLock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    ref={passwordRef}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); if (error) setError(""); }}
                    className={passwordInputClass}
                    autoComplete="new-password"
                    onKeyDown={handleKeyDown}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-primary transition-colors cursor-pointer"
                  >
                    {showPassword ? <AiFillEyeInvisible className="w-4 h-4" /> : <AiFillEye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password strength bar */}
                {password.length > 0 && (
                  <div className="flex flex-col gap-1.5 -mt-1">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className={`flex-1 h-1 rounded-full transition-all duration-300 ${i <= strength ? strengthColor : "bg-border-main"}`}
                        />
                      ))}
                    </div>
                    {strengthLabel && (
                      <p className={`text-xs font-medium ${strength <= 2 ? "text-red-500" : strength === 3 ? "text-yellow-600" : strength === 4 ? "text-blue-500" : "text-primary"}`}>
                        Password strength: {strengthLabel}
                      </p>
                    )}
                  </div>
                )}

                {/* Error */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
                    <p className="text-red-600 text-xs font-medium">{error}</p>
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-navy text-white py-3.5 rounded-xl font-bold font-display text-sm hover:bg-slate transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 cursor-pointer mt-1"
                >
                  {loading ? (
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Create Account
                      <FiArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Login link */}
                <p className="text-center text-sm text-body mt-1">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="text-primary font-semibold hover:text-primary-hover transition-colors cursor-pointer"
                  >
                    Sign In
                  </button>
                </p>
              </form>
            </div>
          </div>
        </div>

      </div>
    </>
  );
};

export default Register;