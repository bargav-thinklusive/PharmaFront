import { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import usePost from "../hooks/usePost";
import LoginService from "../services/LoginService";
import { useNavigate } from "react-router";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const login = new LoginService();

const Register: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { postData, loading } = usePost();
  const navigate = useNavigate();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!username && !email && !password)
        return setError("Please enter username, email and password");
      if (!username) return setError("Please enter username");
      if (!email) return setError("Please enter email");
      if (!validateEmail(email)) return setError("Please enter a valid email");
      if (!password) return setError("Please enter password");
      if (!validatePassword(password))
        return setError(
          "Password must be 8+ characters with uppercase, lowercase, number, and special character"
        );

      setError("");

      const payload = { name: username, email, password };
      const response = await postData(login.createRegister(), payload);

      console.log("Registration successful:", response);
      toast.success("🎉 Registration successful!");
      setTimeout(() => navigate("/login"), 2000); // redirect after 2s
    } catch (err) {
      setError("Registration failed. Please try again.");
      toast.error("Registration failed. Please try again.");
    }
  };

  return (
    <>
      {/* Toast notifications - moved outside main container */}
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        className="z-[9999]"
        theme="dark" // 🔑 this forces dark styling
        toastClassName="!bg-black !text-white text-center rounded-lg shadow-lg"
      />


      <div className="fixed inset-0 flex justify-center items-center bg-gradient-to-br from-green-700 to-blue-500 overflow-hidden">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-xl shadow-lg w-[400px] max-w-[90vw] flex flex-col gap-4"
        >
          <h2 className="text-2xl font-bold text-center text-green-700">Register</h2>

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
          />

          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

          {error && <span className="text-red-500 text-xs -mt-2">{error}</span>}

          <button
            type="submit"
            disabled={loading}
            className="p-3 rounded-md bg-green-700 text-white font-semibold hover:bg-green-800 transition disabled:opacity-60 cursor-pointer"
          >
            {loading ? "Registering..." : "Register"}
          </button>

          <p className="text-center text-sm">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-green-700 underline font-medium hover:text-green-900 cursor-pointer"
            >
              Login
            </button>
          </p>
        </form>
      </div>
    </>
  );
};

export default Register;