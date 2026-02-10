import { useState } from "react";
import { Link, useNavigate } from "react-router";
import axios from "axios";

export default function Login() {
  const api = import.meta.env.VITE_URL;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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
        { email, password }
      );

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        navigate("/home");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.msg || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* Premium Background Effects */}
      <div className="bg-glow" />
      <div className="bg-glow-accent top-[20%] right-[20%]" />
      
      {/* Main Card */}
      <div className="w-full max-w-md animate-fade-in">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600/10 border border-blue-600/20 mb-6 group transition-all duration-500 hover:rotate-6">
            <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Welcome Back</h1>
          <p className="text-zinc-500 text-sm font-light">
            Enter your credentials to access your portal
          </p>
        </div>

        {/* Form Card */}
        <div className="glass-card rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-indigo-600" />
          
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 animate-slide-in">
              <p className="text-red-400 text-sm flex items-center gap-3">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest ml-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-4 rounded-xl bg-zinc-900/50 border border-white/5 text-white placeholder-zinc-600 focus:border-blue-600 transition-all duration-300"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest ml-1">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-4 rounded-xl bg-zinc-900/50 border border-white/5 text-white placeholder-zinc-600 focus:border-blue-600 transition-all duration-300"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm tracking-wide shadow-lg shadow-blue-900/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed btn-glow uppercase"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Authenticating...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-white/5" />
            <span className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest">Connect</span>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-zinc-500 font-light">
            New here?{" "}
            <Link to="/register" className="text-blue-500 hover:text-blue-400 font-semibold transition-colors duration-300">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

