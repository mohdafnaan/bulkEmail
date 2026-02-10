import express from "express";
import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import database connection
import "./utils/dbConnect.js";

// Import routers
import userRouter from "./controllers/public/public.js";
import privateUserRouter from "./controllers/private/private.js";

// Import auth middleware
import middleware from "./auth/auth.js";

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// CORS configuration
let corsObject = {
  origin: ["http://localhost:5173", "https://cvuploader.afnaan.in"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsObject));

/* ========== ROUTE ORDER (VERY IMPORTANT) ========== */

// 1. Public routes (NO AUTH REQUIRED)
app.use("/public", userRouter);

// 2. Private routes (AUTH REQUIRED)
app.use("/private", middleware, privateUserRouter);

// 3. Static React build (NO AUTH)
const buildPath = path.join(__dirname, "dist");
app.use(express.static(buildPath));

// 4. Catch-all route for React app
app.get("*", (req, res) => {
  res.sendFile(path.join(buildPath, "index.html"));
});

// Start server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
