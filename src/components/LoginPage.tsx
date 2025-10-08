import { useState } from "react";
import { useNavigate } from "react-router";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
//import AuthService from "../services/AuthService";
import { useUser } from "../context/UserContext";
//import { LOGIN_URL } from "../urlConfig";

//const authService = new AuthService();

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showRetypePassword, setShowRetypePassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { checkTokenAndGetUser, } = useUser();

console.log(checkTokenAndGetUser,loading)
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
    try {
      setLoading(true);
      if (!email && !password) return setError("Please enter email and password");
      if (!email) return setError("Please enter email");
      if (!validateEmail(email)) return setError("Please enter a valid email");
      if (!password) return setError("Please enter password");

      setError("");
      // await authService.login(email, password);
      // const user: any = await checkTokenAndGetUser();
      // if (user) {
      //   navigate("/home");
      // } else {
      //   navigate(LOGIN_URL)
      // }
navigate("/home");
    } catch (error: any) {
      setError("Please Enter a Valid Email and Password");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = () => {
    setError("");
    setSuccess("");

    if (!email && !newPassword && !retypePassword) {
      return setError("Please fill in all fields");
    }
    if (!email) return setError("Please enter your email");
    if (!validateEmail(email)) return setError("Please enter a valid email");
    if (!newPassword) return setError("Please enter a new password");

    // Use the new password validation
    if (!validatePassword(newPassword)) {
      return setError("Password must contain: 8+ characters, 1 uppercase, 1 lowercase, 1 number, 1 special character");
    }

    if (!retypePassword) return setError("Please retype your password");
    if (newPassword !== retypePassword) {
      return setError("New password and retype new password not matched");
    }

    setSuccess("Password reset successfully! Redirecting to login...");

    setTimeout(() => {
      setIsForgotPassword(false);
      setEmail("");
      setNewPassword("");
      setRetypePassword("");
      setSuccess("");
    }, 2000);
  };

  const clearErrors = () => {
    if (error) setError("");
    if (success) setSuccess("");
  };

  return (
    <div className="flex justify-center items-center min-h-screen w-screen bg-gradient-to-br from-green-700 to-blue-500 fixed inset-0 pt-16">
      <div className="bg-white p-8 rounded-xl shadow-lg w-[450px] h-auto min-h-[500px] max-w-[90vw] flex flex-col gap-5 justify-center">
        <h2 className="text-2xl font-bold text-center text-green-700">
          {isForgotPassword ? "Reset Password" : "Login"}
        </h2>

        {/* Email Input */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            clearErrors();
          }}
          className="p-3 border border-gray-300 rounded-md text-sm w-full focus:outline-none focus:ring-2 focus:ring-green-600"
        />

        {/* Conditional Password Fields */}
        {!isForgotPassword ? (
          <>
            {/* Login Password Input */}
            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  clearErrors();
                }}
                className="p-3 border border-gray-300 rounded-md text-sm w-full pr-10 focus:outline-none focus:ring-2 focus:ring-green-600"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-700 text-lg cursor-pointer"
              >
                {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
              </button>
            </div>

            {/* Forgot Password Button */}
            <div className="flex justify-start">
              <button
                onClick={() => {
                  setIsForgotPassword(true);
                  setError("");
                  setPassword("");
                }}
                className="text-green-700 underline text-sm font-medium hover:text-green-900 cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>
          </>
        ) : (
          <>
            {/* New Password Input */}
            <div className="relative w-full">
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  clearErrors();
                }}
                className="p-3 border border-gray-300 rounded-md text-sm w-full pr-10 focus:outline-none focus:ring-2 focus:ring-green-600"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-700 text-lg cursor-pointer"
              >
                {showNewPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
              </button>
            </div>

            {/* Retype Password Input */}
            <div className="relative w-full">
              <input
                type={showRetypePassword ? "text" : "password"}
                placeholder="Retype New Password"
                value={retypePassword}
                onChange={(e) => {
                  setRetypePassword(e.target.value);
                  clearErrors();
                }}
                className="p-3 border border-gray-300 rounded-md text-sm w-full pr-10 focus:outline-none focus:ring-2 focus:ring-green-600"
              />
              <button
                type="button"
                onClick={() => setShowRetypePassword(!showRetypePassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-700 text-lg cursor-pointer"
              >
                {showRetypePassword ? <AiFillEyeInvisible /> : <AiFillEye />}
              </button>
            </div>
          </>
        )}

        {/* Error Message */}
        {error && <span className="text-red-500 text-sm">{error}</span>}

        {/* Success Message */}
        {success && <span className="text-green-600 text-sm">{success}</span>}

        {/* Action Button */}
        <button
          onClick={isForgotPassword ? handleResetPassword : handleLogin}
          className="p-3 rounded-md bg-green-700 text-white font-semibold hover:bg-green-800 transition cursor-pointer"
          //disabled={loading}
        >
          {isForgotPassword ? "Reset Password" : "Login"}
        </button>

        {/* Navigation Links */}
        {!isForgotPassword ? (
          <p className="text-center text-sm">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-green-700 underline font-medium hover:text-green-900 cursor-pointer"
            >
              Register
            </button>
          </p>
        ) : (
          <p className="text-center text-sm">
            Remember your password?{" "}
            <button
              onClick={() => {
                setIsForgotPassword(false);
                setError("");
                setSuccess("");
                setNewPassword("");
                setRetypePassword("");
              }}
              className="text-green-700 underline font-medium hover:text-green-900 cursor-pointer"
            >
              Back to Login
            </button>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
