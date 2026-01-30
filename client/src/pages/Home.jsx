// import { useState } from "react";
// import axios from "axios";

// export default function Home() {
//   const [file, setFile] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [msg, setMsg] = useState("");
//   const [error, setError] = useState("");

//   const token = localStorage.getItem("token");

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//     setError("");
//     setMsg("");
//   };

//   const uploadCV = async () => {
//     if (!file) {
//       setError("Please select a file");
//       return;
//     }

//     try {
//       setLoading(true);

//       const formData = new FormData();
//       formData.append("resume", file); // 🔥 MUST MATCH multer field name

//       const res = await axios.post(
//         "http://localhost:5000/private/uploadcv",
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       setMsg(res.data.msg || "CV uploaded successfully ✅");
//     } catch (err) {
//       console.log(err);
//       setError(err.response?.data?.msg || "Upload failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const sendCV = async () => {
//     try {
//       setLoading(true);

//       const res = await axios.get(
//         "http://localhost:5000/private/sendcv",
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       setMsg("Resume sent to HR successfully 📩");
//     } catch (err) {
//       console.log(err);
//       setError("Failed to send resume");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">

//       {/* Glow */}
//       <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#0f172a_0%,transparent_70%)] opacity-40" />

//       {/* Card */}
//       <div className="relative z-10 w-[380px] bg-zinc-900/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-zinc-800">

//         <h2 className="text-white text-2xl font-semibold text-center">
//           Upload Your CV
//         </h2>

//         <p className="text-zinc-400 text-sm text-center mt-1">
//           PDF / DOC / DOCX supported
//         </p>

//         {/* Messages */}
//         {error && <p className="text-red-500 text-sm text-center mt-4">{error}</p>}
//         {msg && <p className="text-green-500 text-sm text-center mt-4">{msg}</p>}

//         {/* Upload */}
//         <div className="mt-6 space-y-4">
//           <input
//             type="file"
//             accept=".pdf,.doc,.docx"
//             onChange={handleFileChange}
//             className="w-full text-sm text-zinc-400
//               file:mr-4 file:py-2 file:px-4
//               file:rounded-lg file:border-0
//               file:bg-blue-600 file:text-white
//               hover:file:bg-blue-700"
//           />

//           <button
//             onClick={uploadCV}
//             disabled={loading}
//             className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition text-white font-medium disabled:opacity-50"
//           >
//             {loading ? "Uploading..." : "Upload CV"}
//           </button>

//           <button
//             onClick={sendCV}
//             disabled={loading}
//             className="w-full py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 transition text-white font-medium disabled:opacity-50"
//           >
//             {loading ? "Sending..." : "Send CV to HR"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError("");
    setMsg("");
  };

  // 🔹 Upload CV (with loading)
  const uploadCV = async () => {
    if (!file) {
      setError("Please select a file");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("resume", file);

      const res = await axios.post(
        "http://localhost:5000/private/uploadcv",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMsg(res.data.msg || "CV uploaded successfully ✅");
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.msg || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  // 🔹 Send CV (NO loading, instant message)
  const sendCV = async () => {
    setError("");
    setMsg("Email sent completed ✅");

    try {
      await axios.get(
        "http://localhost:5000/private/sendcv",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (err) {
      console.log(err);
      setMsg("");
      setError("Failed to send resume");
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">

      {/* Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#0f172a_0%,transparent_70%)] opacity-40" />

      {/* Card */}
      <div className="relative z-10 w-[380px] bg-zinc-900/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-zinc-800">

        <h2 className="text-white text-2xl font-semibold text-center">
          Upload Your CV
        </h2>

        <p className="text-zinc-400 text-sm text-center mt-1">
          PDF / DOC / DOCX supported
        </p>

        {/* Messages */}
        {error && (
          <p className="text-red-500 text-sm text-center mt-4">{error}</p>
        )}
        {msg && (
          <p className="text-green-500 text-sm text-center mt-4">{msg}</p>
        )}

        {/* Upload */}
        <div className="mt-6 space-y-4">
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            className="w-full text-sm text-zinc-400
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:bg-blue-600 file:text-white
              hover:file:bg-blue-700"
          />

          <button
            onClick={uploadCV}
            disabled={uploading}
            className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition text-white font-medium disabled:opacity-50"
          >
            {uploading ? "Uploading..." : "Upload CV"}
          </button>

          <button
            onClick={sendCV}
            className="w-full py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 transition text-white font-medium"
          >
            Send CV to HR
          </button>
        </div>
      </div>
    </div>
  );
}
