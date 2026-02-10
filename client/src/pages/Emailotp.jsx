import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import axios from "axios";

export default function OtpVerify() {
  const api = import.meta.env.VITE_URL;
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const inputsRef = useRef([]);

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleBackspace = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split("").forEach((char, i) => {
      if (i < 6) newOtp[i] = char;
    });
    setOtp(newOtp);
    
    const nextEmptyIndex = newOtp.findIndex(val => val === "");
    if (nextEmptyIndex !== -1) {
      inputsRef.current[nextEmptyIndex].focus();
    } else {
      inputsRef.current[5].focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");

    const otpValue = otp.join("");

    if (otpValue.length !== 6) {
      setError("Please enter complete 6-digit OTP");
      return;
    }

    try {
      setLoading(true);

      await axios.post(`${api}/public/email-otp`, { otp: otpValue });
      navigate("/");
    } catch (err) {
      console.error("OTP verification error:", err);
      setError(err.response?.data?.msg || "Invalid OTP. Please try again.");
      setOtp(["", "", "", "", "", ""]);
      inputsRef.current[0].focus();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* Premium Background Effects */}
      <div className="bg-glow" />
      <div className="bg-glow-accent top-[30%] left-[20%]" />

      {/* Main Card */}
      <div className="w-full max-w-md animate-fade-in">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600/10 border border-blue-600/20 mb-6 group transition-all duration-500 hover:scale-110">
            <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Security Check</h1>
          <p className="text-zinc-500 text-sm font-light">
            Enter the 6-digit code sent to your inbox
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
          <form onSubmit={handleVerify} className="space-y-8">
            {/* OTP Inputs */}
            <div className="flex justify-center gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputsRef.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, index)}
                  onKeyDown={(e) => handleBackspace(e, index)}
                  onPaste={handlePaste}
                  className="w-12 h-14 text-center text-2xl font-bold rounded-xl bg-zinc-900/50 border border-white/5 text-white focus:border-blue-600 transition-all duration-300"
                  disabled={loading}
                  autoFocus={index === 0}
                />
              ))}
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
                  Verifying...
                </span>
              ) : (
                "Authorize"
              )}
            </button>
          </form>

          {/* Resend Link */}
          <p className="text-center text-sm text-zinc-500 font-light mt-8">
            Didn't receive the code?{" "}
            <button 
              type="button"
              className="text-blue-500 hover:text-blue-400 font-semibold transition-colors duration-300"
              onClick={() => {
                alert("Resend OTP functionality coming soon!");
              }}
            >
              Resend code
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

