import { useState } from "react";
import { Link, useNavigate } from "react-router";
import axios from "axios";

export default function Register() {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!fullname || !email || !password) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        "http://localhost:5000/public/register",
        {
          fullName: fullname,
          email,
          password,
        }
      );

      alert("Account created successfully ✅");
      navigate("/otp-verify");

    } catch (err) {
      setError(err.response?.data?.msg || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
      {/* Background Glow */}
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
          Create Account
        </h2>

        <p className="text-zinc-400 text-sm text-center mt-1">
          Already have an account?{" "}
          <Link to="/" className="text-blue-500">
            Login
          </Link>
        </p>

        {/* Error */}
        {error && (
          <p className="text-red-500 text-sm mt-4 text-center">{error}</p>
        )}

        {/* Form */}
        <form onSubmit={handleRegister} className="mt-6 space-y-4">

          <input
            type="text"
            placeholder="Full name"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="email"
            placeholder="Email address"
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
            {loading ? "Creating account..." : "Register"}
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
