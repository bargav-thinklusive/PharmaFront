import { useNavigate } from "react-router-dom";
import useRoles from "../../hooks/useRoles";

const Unauthorized: React.FC = () => {
  const navigate = useNavigate();
  const { roles } = useRoles();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      {/* Icon */}
      <div className="text-7xl mb-6 select-none">🔒</div>

      {/* Heading */}
      <h1 className="text-4xl font-bold text-gray-800 mb-3">Access Denied</h1>

      {/* Sub message */}
      <p className="text-gray-500 text-lg mb-2 max-w-md">
        You don't have permission to view this page.
      </p>

      {/* Current role badge */}
      {roles.length > 0 && (
        <p className="text-sm text-gray-400 mb-8">
          Your role:{" "}
          {roles.map((r) => (
            <span
              key={r}
              className="inline-block bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs font-semibold mx-1 capitalize"
            >
              {r}
            </span>
          ))}
        </p>
      )}

      {/* Back button */}
      <button
        id="go-home-btn"
        onClick={() => navigate("/home")}
        className="bg-[#36b669] hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-200 cursor-pointer"
      >
        Go to Home
      </button>

      <button
        id="go-back-btn"
        onClick={() => navigate(-1)}
        className="mt-3 text-gray-400 hover:text-gray-600 underline text-sm cursor-pointer"
      >
        ← Go back
      </button>
    </div>
  );
};

export default Unauthorized;
