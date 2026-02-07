import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

async function middleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
       return res.status(401).json({ msg: "No token provided or invalid format" });
    }
    
    let token = authHeader.split(" ")[1];
    
    // Check if token is "null" string (common frontend mistake)
    if (!token || token === "null" || token === "undefined") {
      return res.status(401).json({ msg: "Invalid token" });
    }

    let decode = jwt.verify(token, process.env.JWT_SECKEY);
    req.user = decode;
    next();
  } catch (error) {
    console.log("Auth Middleware Error:", error.message);
    return res.status(401).json({ msg: "Token verification failed", error: error.message });
  }
}

export default middleware