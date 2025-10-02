import { useState } from "react";
import { useNavigate } from "react-router";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleLogin = () => {
    if (!email && !password) return setError("Please enter email and password");
    if (!email) return setError("Please enter email");
    if (!validateEmail(email)) return setError("Please enter a valid email");
    if (!password) return setError("Please enter password");

    setError("");
    navigate("/home");
  };

  return (
    <div className="flex justify-center items-center min-h-screen w-screen bg-gradient-to-br from-green-700 to-blue-500 fixed inset-0">
      <div className="bg-white p-10 rounded-xl shadow-lg w-[400px] max-w-[90vw] flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-center text-green-700">Login</h2>

        {/* Email Input */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError("");
          }}
          className="p-3 border border-gray-300 rounded-md text-sm w-full focus:outline-none focus:ring-2 focus:ring-green-600"
        />

        {/* Password Input */}
        <div className="relative w-full">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) setError("");
            }}
            className="p-3 border border-gray-300 rounded-md text-sm w-full pr-10 focus:outline-none focus:ring-2 focus:ring-green-600"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-700 text-lg"
          >
            {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
          </button>
        </div>

        {/* Error Message */}
        {error && <span className="text-red-500 text-sm">{error}</span>}

        {/* Login Button */}
        <button
          onClick={handleLogin}
          className="p-3 rounded-md bg-green-700 text-white font-semibold hover:bg-green-800 transition"
        >
          Login
        </button>

        {/* Register Redirect */}
        <p className="text-center text-sm">
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/register")}
            className="text-green-700 underline font-medium hover:text-green-900"
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
