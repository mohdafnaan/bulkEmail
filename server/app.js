import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(__dirname, "dist");
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
app.use(express.static(publicDir));
const port = process.env.PORT;

let corsObject = {
  origin: ["http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "DELETE"],
};

app.use(cors(corsObject));
app.get(/(.*)/, (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});
app.get("/", (req, res) => {
  try {
    res.status(200).json({ msg: "server is live" });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});
app.use("/public", userRouter);
app.use(middleware);
app.use("/private", privateUserRouter);
app.listen(port, () => {
  console.log(`server is live at http://localhost:5000`);
});
//
