import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import axios from "axios"
export default function OtpVerify() {
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

    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleBackspace = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");

    const otpValue = otp.join("");

    if (otpValue.length !== 6) {
      setError("Enter complete 6-digit OTP");
      return;
    }

    try {
      setLoading(true);

      // 🔁 Replace with backend API
       await axios.post("http://localhost:5000/public/email-otp", {otp:otpValue});
      alert("OTP Verified Successfully ✅");
      navigate("/home")
      console.log(data);

    } catch (err) {
      setError(err.message);
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
          Verify OTP
        </h2>
        <p className="text-zinc-400 text-sm text-center mt-1">
          Enter the 6-digit code sent to your email
        </p>

        {/* Error */}
        {error && (
          <p className="text-red-500 text-sm mt-4 text-center">{error}</p>
        )}

        {/* OTP Inputs */}
        <form onSubmit={handleVerify} className="mt-6 space-y-6">

          <div className="flex justify-between gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputsRef.current[index] = el)}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleBackspace(e, index)}
                className="w-12 h-12 text-center text-xl rounded-lg bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition text-white font-medium disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        {/* Resend */}
        <p className="text-zinc-400 text-sm text-center mt-5">
          Didn’t receive code?{" "}
          <span className="text-blue-500 cursor-pointer">
            Resend OTP
          </span>
        </p>

      </div>
    </div>
  );
}
