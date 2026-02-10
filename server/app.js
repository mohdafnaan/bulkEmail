import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// import database
import "./utils/dbConnect.js";
// import public routers
import userRouter from "./controllers/public/public.js";
// import auth
import middleware from "./auth/auth.js";
// import private routers
import privateUserRouter from "./controllers/private/private.js";

const app = express();
app.use(express.json());
const port = process.env.PORT;

let corsObject = {
  origin: ["http://localhost:5173","https://cvuploader.afnaan.in"],
  methods: ["GET", "POST", "PUT", "DELETE"],
};

app.use(cors(corsObject));

// API Routes (must come before static files and catch-all)
app.use("/public", userRouter);
app.use(middleware);
app.use("/private", privateUserRouter);

// Static files and catch-all route (must be last)
const buildPath = path.join(__dirname, "dist");
app.use(express.static(buildPath));
app.get("*", (req, res) => {
  res.sendFile(path.join(buildPath, "index.html"));
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
//
