import express from "express";
import dotenv from "dotenv";
dotenv.config();

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import database
import "./utils/dbConnect.js";

// Import routers
import userRouter from "./controllers/public/public.js";
import privateUserRouter from "./controllers/private/private.js";

// Auth middleware
import middleware from "./auth/auth.js";

const app = express();

app.use(express.json());

const port = process.env.PORT || 5000;

// Path to React build folder
const buildPath = path.join(__dirname, "dist");

// Serve static React build files
app.use(express.static(buildPath));


// -------- API ROUTES --------

// Public routes (no auth)
app.use("/public", userRouter);

// Auth middleware for private routes
app.use(middleware);

// Private routes (protected)
app.use("/private", privateUserRouter);


// -------- REACT FRONTEND FALLBACK --------

// This must be LAST
app.get("*", (req, res) => {
  res.sendFile(path.join(buildPath, "index.html"));
});


// Start server
app.listen(port, () => {
  console.log(`Server is live at http://localhost:${port}`);
});
