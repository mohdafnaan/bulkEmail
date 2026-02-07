import { useState } from "react";
import { Link, useNavigate } from "react-router";
import axios from "axios";
export default function Login() {
  const api = import.meta.env.VITE_URL
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success,setSuccess] = useState("")
  const navigate = useNavigate();

const handleLogin = async (e) => {
  e.preventDefault();
  setError("");

  if (!email || !password) {
    setError("Email and password are required");
    return;
  }

  try {
    setLoading(true);

    const res = await axios.post(
      `${api}/public/login`,
      { email, password },
      // {
      //   headers: { "Content-Type": "application/json" },
      // }
    );

    console.log("SUCCESS:", res.data);
    localStorage.setItem("token",res.data.token)
    
    navigate("/home");

  } catch (err) {
    console.log("ERROR:", err.response?.data);
    setError(err.response?.data?.msg || "Invalid credentials");
  } finally {
    setLoading(false);
  }
};



  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
      {/* Glow Lines */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#0f172a_0%,transparent_70%)] opacity-40" />

      {/* Card */}
      <div className="relative z-10 w-[380px] bg-zinc-900/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-zinc-800">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-full border-2 border-blue-500 flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-blue-500" />
          </div>
        </div>

        <h2 className="text-white text-2xl font-semibold text-center">
          Welcome Back
        </h2>
        <p className="text-zinc-400 text-sm text-center mt-1">
          Don’t have an account?{" "}
          <Link to={"/register"}>
            <span className="text-blue-500 cursor-pointer">Sign up</span>
          </Link>
        </p>

        {/* Error */}
        {error && (
          <p className="text-red-500 text-sm mt-4 text-center">{error}</p>
        )}
        {/* sucess */}
        {success && (
          <p className="text-green-500 text-sm mt-4 text-center">{success}</p>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <input
            type="email"
            placeholder="email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition text-white font-medium disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-zinc-700" />
          <span className="text-zinc-500 text-xs">OR</span>
          <div className="flex-1 h-px bg-zinc-700" />
        </div>

        {/* Social Buttons */}
        <div className="flex gap-3">
          <button className="flex-1 py-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-lg">
            
          </button>
          <button className="flex-1 py-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-bold">
            G
          </button>
          <button className="flex-1 py-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white">
            𝕏
          </button>
        </div>
      </div>
    </div>
  );
}
