import { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";

export default function Home() {
  const api = import.meta.env.VITE_URL;
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setError("");
    setMsg("");

    if (!selectedFile) {
      setFile(null);
      return;
    }

    // Validate file type
    const allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowedTypes.includes(selectedFile.type)) {
      setError("Only PDF, DOC, and DOCX files are allowed");
      setFile(null);
      return;
    }

    // Validate file size (5MB max)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      setFile(null);
      return;
    }

    setFile(selectedFile);
  };

  const uploadCV = async () => {
    if (!file) {
      setError("Please select a file first");
      return;
    }

    try {
      setUploading(true);
      setError("");
      setMsg("");

      const formData = new FormData();
      formData.append("resume", file);

      const res = await axios.post(
        `${api}/private/uploadcv`,
        formData,
        {
          headers: {
            authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMsg(res.data.msg || "Resume uploaded successfully!");
      setFile(null);
      // Reset file input
      document.getElementById("file-input").value = "";
    } catch (err) {
      console.error("Upload error:", err);
      if (err.response?.status === 401) {
        setError("Session expired. Please login again.");
        setTimeout(() => handleLogout(), 2000);
      } else {
        setError(err.response?.data?.msg || "Upload failed. Please try again.");
      }
    } finally {
      setUploading(false);
    }
  };

  const sendCV = async () => {
    try {
      setSending(true);
      setError("");
      setMsg("");

      const res = await axios.get(
        `${api}/private/sendcv`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      setMsg(res.data.msg || "Resume sent successfully to HR!");
    } catch (err) {
      console.error("Send error:", err);
      if (err.response?.status === 401) {
        setError("Session expired. Please login again.");
        setTimeout(() => handleLogout(), 2000);
      } else if (err.response?.status === 400) {
        setError(err.response?.data?.msg || "Please upload your resume first.");
      } else {
        setError("Failed to send resume. Please try again.");
      }
    } finally {
      setSending(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* Premium Background Effects */}
      <div className="bg-glow" />
      <div className="bg-glow-accent top-[10%] left-[10%]" />
      <div className="bg-glow-accent bottom-[10%] right-[10%]" />

      {/* Main Card */}
      <div className="w-full max-w-md animate-fade-in">
        {/* Header with Logout */}
        <div className="flex items-center justify-between mb-8">
          <div className="animate-slide-in">
            <h1 className="text-3xl font-bold text-white mb-1 tracking-tight">Resume Hub</h1>
            <p className="text-zinc-400 text-sm font-light">
              Submit your profile to HR teams
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900/50 border border-white/5 text-zinc-400 hover:text-white hover:bg-red-500/10 hover:border-red-500/20 transition-all duration-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>

        {/* Form Card */}
        <div className="glass-card rounded-2xl p-8 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-indigo-600" />
          
          {/* Success Message */}
          {msg && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 animate-slide-in">
              <p className="text-emerald-400 text-sm flex items-center gap-3">
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {msg}
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 animate-slide-in">
              <p className="text-red-400 text-sm flex items-center gap-3">
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </p>
            </div>
          )}

          {/* File Upload Section */}
          <div className="space-y-6">
            <div className="group/dropzone">
              <label className="block text-sm font-medium text-zinc-300 mb-3 ml-1">
                Professional Resume
              </label>
              <div className="relative">
                <input
                  id="file-input"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="w-full text-sm text-zinc-500 
                  file:mr-4 file:py-3 file:px-6 
                  file:rounded-xl file:border-0 
                  file:bg-blue-600 file:text-white 
                  file:font-semibold file:text-xs file:uppercase file:tracking-wider
                  hover:file:bg-blue-700 file:cursor-pointer cursor-pointer
                  bg-zinc-900/40 border border-white/5 rounded-xl p-1 transition-all duration-300"
                  disabled={uploading || sending}
                />
              </div>
              <p className="text-[11px] text-zinc-500 mt-3 flex items-center gap-2 ml-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                PDF, DOC, DOCX up to 5MB
              </p>
            </div>

            {/* Selected File Info */}
            {file && (
              <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 animate-slide-in">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-600/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{file.name}</p>
                    <p className="text-xs text-zinc-500">{(file.size / 1024).toFixed(2)} KB</p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid gap-4 pt-2">
              <button
                onClick={uploadCV}
                disabled={uploading || sending || !file}
                className="w-full py-4 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm tracking-wide shadow-lg shadow-blue-900/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed btn-glow"
              >
                {uploading ? (
                  <span className="flex items-center justify-center gap-2 uppercase">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Uploading...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2 uppercase">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    Sync Resume
                  </span>
                )}
              </button>

              <button
                onClick={sendCV}
                disabled={uploading || sending}
                className="w-full py-4 px-6 rounded-xl bg-zinc-900 border border-white/10 hover:border-emerald-500/50 hover:bg-emerald-500/5 text-zinc-300 hover:text-emerald-400 font-bold text-sm tracking-wide transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed uppercase"
              >
                {sending ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Executing...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Submit to HR
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

