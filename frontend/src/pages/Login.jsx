// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";
// import { loginUser } from "../services/authService";

// export default function Login() {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const { data } = await loginUser(formData);

//       localStorage.setItem("user", JSON.stringify(data));
//       toast.success("Login successful!");

//       navigate("/dashboard");
//     } catch (error) {
//       toast.error(
//         error.response?.data?.message || "Login failed"
//       );
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-r from-blue-600 to-purple-700 flex items-center justify-center px-4">
//       <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">
//         <h1 className="text-4xl font-bold text-center mb-2 text-gray-800">
//           Welcome Back
//         </h1>

//         <p className="text-center text-gray-500 mb-8">
//           Login to your account
//         </p>

//         <form onSubmit={handleSubmit} className="space-y-5">
//           <input
//             type="email"
//             name="email"
//             placeholder="Email Address"
//             className="w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
//             value={formData.email}
//             onChange={handleChange}
//             required
//           />

//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             className="w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
//             value={formData.password}
//             onChange={handleChange}
//             required
//           />

//           <button
//             type="submit"
//             className="w-full bg-blue-600 text-white p-4 rounded-xl hover:bg-blue-700 transition duration-300"
//           >
//             Login
//           </button>
//         </form>

//         <p className="text-center mt-6 text-gray-600">
//           Don't have an account?{" "}
//           <Link
//             to="/register"
//             className="text-blue-600 font-semibold"
//           >
//             Register
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { loginUser } from "../services/authService";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await loginUser(formData);

      localStorage.setItem("user", JSON.stringify(data));
      toast.success("Welcome back! 🎉");

      setTimeout(() => {
        navigate("/dashboard");
      }, 800);
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 px-4 relative overflow-hidden">
      {/* floating blobs */}
      <div className="absolute w-72 h-72 bg-white/10 rounded-full blur-3xl top-10 left-10 animate-pulse"></div>
      <div className="absolute w-72 h-72 bg-white/10 rounded-full blur-3xl bottom-10 right-10 animate-pulse"></div>

      <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md p-8 transform hover:scale-[1.02] transition duration-300">
        <h1 className="text-4xl font-extrabold text-center text-gray-800">
          Welcome Back 👋
        </h1>

        <p className="text-center text-gray-500 mt-2 mb-8">
          Login to continue your journey
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            className="w-full p-4 border rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-200 transition"
            value={formData.email}
            onChange={handleChange}
            required
          />

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              className="w-full p-4 border rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-200 transition"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-4 text-gray-500"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full p-4 rounded-xl font-bold text-white transition duration-300 ${
              loading
                ? "bg-gray-400"
                : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:scale-[1.02]"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          Don't have an account?{" "}
          <Link to="/register" className="text-indigo-600 font-bold">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
