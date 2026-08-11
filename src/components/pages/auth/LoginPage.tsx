import { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { FiMail, FiLock, FiArrowRight, FiShield } from "react-icons/fi";
import AuthService from "../../../services/AuthService";
import { toast } from "react-toastify";
import { useUser } from "../../../context/UserContext";
import CompanyLogo from "../../../assets/CMCINTELLOGO.png";

const authService = new AuthService();

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { checkTokenAndGetUser } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showRetypePassword, setShowRetypePassword] = useState(false);
  const [error, setError] = useState("");
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const newPasswordRef = useRef<HTMLInputElement>(null);
  const retypePasswordRef = useRef<HTMLInputElement>(null);

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    return minLength && hasUppercase && hasLowercase && hasNumber && hasSpecialChar;
  };

  const handleLogin = async () => {
    if (loading) return;
    const emailVal = emailRef.current?.value || email;
    const passwordVal = passwordRef.current?.value || password;

    if (!emailVal && !passwordVal) return setError("Please enter email and password");
    if (!emailVal) return setError("Please enter email");
    if (!validateEmail(emailVal)) return setError("Please enter a valid email");
    if (!passwordVal) return setError("Please enter password");
    setError("");

    setLoading(true);
    try {
      await authService.login(emailVal, passwordVal);
      await checkTokenAndGetUser();
      const targetUrl = (location.state as any)?.from || "/home";
      window.location.href = targetUrl;
    } catch (error: any) {
      const msg = error?.response?.data?.detail || "Login failed. Please check your credentials.";
      setError(msg);
      toast.error(msg);
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (loading) return;
    const emailVal = emailRef.current?.value || email;
    const newPasswordVal = newPasswordRef.current?.value || newPassword;
    const retypePasswordVal = retypePasswordRef.current?.value || retypePassword;

    setError("");
    if (!emailVal) return setError("Please enter your email");
    if (!validateEmail(emailVal)) return setError("Please enter a valid email");
    if (!newPasswordVal) return setError("Please enter a new password");
    if (!validatePassword(newPasswordVal)) {
      return setError("Password must contain: 8+ characters, 1 uppercase, 1 lowercase, 1 number, 1 special character");
    }
    if (!retypePasswordVal) return setError("Please retype your password");
    if (newPasswordVal !== retypePasswordVal) {
      return setError("Passwords do not match");
    }

    try {
      setLoading(true);
      await authService.forgotPassword(emailVal, newPasswordVal);
      toast.success("Password reset successfully!");
      setTimeout(() => {
        setIsForgotPassword(false);
        setEmail("");
        setNewPassword("");
        setRetypePassword("");
      }, 2000);
    } catch (error: any) {
      setError("Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };



  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      isForgotPassword ? handleResetPassword() : handleLogin();
    }
  };

  const clearErrors = () => { if (error) setError(""); };

  const inputClass =
    "w-full pl-11 pr-4 py-3.5 border border-border-main rounded-xl text-sm text-main focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white placeholder-[#94A3B8] transition-shadow";

  const passwordInputClass =
    "w-full pl-11 pr-11 py-3.5 border border-border-main rounded-xl text-sm text-main focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white placeholder-[#94A3B8] transition-shadow";

  return (
    <>

      <div className="fixed inset-0 flex min-h-screen w-screen font-sans overflow-hidden">

        {/* ── Left branding panel ── */}
        <div
          className="hidden lg:flex lg:w-[55%] relative flex-col justify-between p-12 overflow-hidden border-r border-border-main"
          style={{ background: "linear-gradient(135deg, #A7F3D0 0%, #7DD3FC 100%)" }}
        >
          {/* Decorative blobs */}
          <div className="absolute top-[-15%] left-[-10%] w-[70%] h-[70%] rounded-full bg-primary-light/80 blur-3xl pointer-events-none" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-primary-light/50 blur-3xl pointer-events-none" />

          {/* Molecule grid pattern overlay */}
          <div
            className="absolute inset-0 opacity-[0.06] pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, #0E8A67 1.5px, transparent 0)`,
              backgroundSize: "32px 32px",
            }}
          />

          {/* Logo — same as header: original colors */}
          <div className="relative z-10">
            <img
              src={CompanyLogo}
              alt="CMC Intel Logo"
              className="h-10 sm:h-12 w-auto"
            />
          </div>

          {/* Center content */}
          <div className="relative z-10 flex flex-col gap-8">
            <div className="inline-flex items-center gap-2 text-primary font-bold text-xs tracking-widest uppercase bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-full w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Pharmaceutical Intelligence Platform
            </div>

            <div>
              <h1 className="text-4xl xl:text-5xl font-extrabold text-main font-display leading-tight mb-4">
                Turning Complexity<br />
                Into <span className="text-primary">Clarity</span>
              </h1>
              <p className="text-body text-base leading-relaxed max-w-sm">
                Equipping pharmaceutical teams with the data-driven intelligence to build portfolios and execute global filings with confidence.
              </p>
            </div>

            {/* Feature pills */}
            <div className="flex flex-col gap-3">
              {[
                "CMC & Regulatory Intelligence",
                "Global Filing Intelligence",
                "Portfolio Analytics",
              ].map((feat) => (
                <div key={feat} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <FiShield className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-body text-sm font-medium">{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom tagline */}
          <p className="relative z-10 text-secondary text-xs">
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
                  {isForgotPassword ? "Reset your password" : "Welcome back"}
                </h2>
                <p className="text-body text-sm">
                  {isForgotPassword
                    ? "Enter your email and create a new password."
                    : "Sign in to your CMCIntel account to continue."}
                </p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  isForgotPassword ? handleResetPassword() : handleLogin();
                }}
                className="flex flex-col gap-4"
              >
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
                    onChange={(e) => { setEmail(e.target.value); clearErrors(); }}
                    className={inputClass}
                    autoComplete="email"
                    onKeyDown={handleKeyPress}
                  />
                </div>

                {/* Login mode */}
                {!isForgotPassword ? (
                  <>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#94A3B8]">
                        <FiLock className="w-4 h-4" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        ref={passwordRef}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); clearErrors(); }}
                        className={passwordInputClass}
                        autoComplete="current-password"
                        onKeyDown={handleKeyPress}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-primary transition-colors cursor-pointer"
                      >
                        {showPassword ? <AiFillEyeInvisible className="w-4 h-4" /> : <AiFillEye className="w-4 h-4" />}
                      </button>
                    </div>

                    <div className="flex justify-end -mt-1">
                      <button
                        type="button"
                        onClick={() => { setIsForgotPassword(true); setError(""); setPassword(""); }}
                        className="text-primary text-xs font-semibold hover:text-primary-hover transition-colors cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    {/* New Password */}
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#94A3B8]">
                        <FiLock className="w-4 h-4" />
                      </div>
                      <input
                        type={showNewPassword ? "text" : "password"}
                        ref={newPasswordRef}
                        placeholder="New password"
                        value={newPassword}
                        onChange={(e) => { setNewPassword(e.target.value); clearErrors(); }}
                        className={passwordInputClass}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-primary transition-colors cursor-pointer"
                      >
                        {showNewPassword ? <AiFillEyeInvisible className="w-4 h-4" /> : <AiFillEye className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Retype Password */}
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#94A3B8]">
                        <FiLock className="w-4 h-4" />
                      </div>
                      <input
                        type={showRetypePassword ? "text" : "password"}
                        ref={retypePasswordRef}
                        placeholder="Confirm new password"
                        value={retypePassword}
                        onChange={(e) => { setRetypePassword(e.target.value); clearErrors(); }}
                        className={passwordInputClass}
                      />
                      <button
                        type="button"
                        onClick={() => setShowRetypePassword(!showRetypePassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-primary transition-colors cursor-pointer"
                      >
                        {showRetypePassword ? <AiFillEyeInvisible className="w-4 h-4" /> : <AiFillEye className="w-4 h-4" />}
                      </button>
                    </div>
                  </>
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
                      {isForgotPassword ? "Reset Password" : "Sign In"}
                      <FiArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Footer link */}
                <p className="text-center text-sm text-body mt-1">
                  {!isForgotPassword ? (
                    <>
                      Don't have an account?{" "}
                      <button
                        type="button"
                        onClick={() => navigate("/register")}
                        className="text-primary font-semibold hover:text-primary-hover transition-colors cursor-pointer"
                      >
                        Register
                      </button>
                    </>
                  ) : (
                    <>
                      Remember your password?{" "}
                      <button
                        type="button"
                        onClick={() => { setIsForgotPassword(false); setError(""); setNewPassword(""); setRetypePassword(""); }}
                        className="text-primary font-semibold hover:text-primary-hover transition-colors cursor-pointer"
                      >
                        Back to Login
                      </button>
                    </>
                  )}
                </p>
              </form>
            </div>

          </div>
        </div>

      </div>
    </>
  );
};

export default Login;
