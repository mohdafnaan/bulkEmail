import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../../models/User/User.js";
import sendMail from "../../utils/mailer.js";
const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    let { fullName, email, password } = req.body;

    // Validate input
    if (!fullName || !email || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ msg: "Password must be at least 6 characters" });
    }

    // Check for duplicate user
    const dupCheck = await userModel.findOne({ email });
    if (dupCheck) {
      return res.status(400).json({ msg: "Email already registered" });
    }

    // Hash password
    let bPass = await bcrypt.hash(password, 10);
    
    // Generate OTP
    let emailOtp = Math.floor(Math.random() * (999999 - 100000) + 100000);

    // Send OTP email
    await sendMail(
      email,
      `Email Verification - OTP`,
      `Your verification code is: ${emailOtp}\n\nThis code will expire in 10 minutes.`,
    );

    // Create user
    let obj = {
      fullName,
      email,
      password: bPass,
      emailOtp: emailOtp.toString(),
    };

    await userModel.create(obj);

    res.status(201).json({ msg: "Registration successful. Please check your email for OTP." });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ msg: "Registration failed. Please try again." });
  }
});

router.post("/email-otp", async (req, res) => {
  try {
    let { otp } = req.body;

    // Validate input
    if (!otp) {
      return res.status(400).json({ msg: "OTP is required" });
    }

    // Find user with this OTP
    let user = await userModel.findOne({ emailOtp: otp });
    if (!user) {
      return res.status(400).json({ msg: "Invalid OTP. Please try again." });
    }

    // Update user verification status
    await userModel.updateOne(
      { emailOtp: otp },
      { $set: { emailVerify: true, emailOtp: null } }
    );

    res.status(200).json({ msg: "Email verified successfully. You can now login." });
  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(500).json({ msg: "Verification failed. Please try again." });
  }
});

router.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password are required" });
    }

    // Find user
    let user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Check if email is verified
    if (!user.emailVerify) {
      return res.status(400).json({ msg: "Please verify your email first" });
    }

    // Compare password
    let comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Generate token
    let payload = {
      email,
      id: user._id
    };
    let token = jwt.sign(payload, process.env.JWT_SECKEY, { expiresIn: "7d" });
    
    res.status(200).json({ 
      msg: "Login successful", 
      token,
      user: {
        fullName: user.fullName,
        email: user.email
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ msg: "Login failed. Please try again." });
  }
});
export default router;