import { useState } from "react";
import { Link, useNavigate } from "react-router";
import axios from "axios";

export default function Register() {
  const api = import.meta.env.VITE_URL;
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

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      await axios.post(`${api}/public/register`, {
        fullName: fullname,
        email,
        password,
      });

      navigate("/otp-verify");
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.response?.data?.msg || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* Premium Background Effects */}
      <div className="bg-glow" />
      <div className="bg-glow-accent bottom-[20%] left-[20%]" />

      {/* Main Card */}
      <div className="w-full max-w-md animate-fade-in">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600/10 border border-indigo-600/20 mb-6 group transition-all duration-500 hover:-rotate-6">
            <svg className="w-8 h-8 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Create Account</h1>
          <p className="text-zinc-500 text-sm font-light">
            Join the community and start applying
          </p>
        </div>

        {/* Form Card */}
        <div className="glass-card rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-600 to-blue-600" />
          
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
          <form onSubmit={handleRegister} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest ml-1">
                Full Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                className="w-full px-5 py-4 rounded-xl bg-zinc-900/50 border border-white/5 text-white placeholder-zinc-600 focus:border-indigo-600 transition-all duration-300"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest ml-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-4 rounded-xl bg-zinc-900/50 border border-white/5 text-white placeholder-zinc-600 focus:border-indigo-600 transition-all duration-300"
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
                className="w-full px-5 py-4 rounded-xl bg-zinc-900/50 border border-white/5 text-white placeholder-zinc-600 focus:border-indigo-600 transition-all duration-300"
                disabled={loading}
              />
              <p className="text-[10px] text-zinc-600 ml-1 font-medium italic">Minimum 6 characters required</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm tracking-wide shadow-lg shadow-indigo-900/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed btn-glow uppercase"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Initializing...
                </span>
              ) : (
                "Get Started"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-white/5" />
            <span className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest">Entry</span>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          {/* Sign In Link */}
          <p className="text-center text-sm text-zinc-500 font-light">
            Already registered?{" "}
            <Link to="/" className="text-indigo-500 hover:text-indigo-400 font-semibold transition-colors duration-300">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

