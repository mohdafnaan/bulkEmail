import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../../models/User/User.js";
import sendMail from "../../utils/mailer.js";
const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    let { fullName, email, password } = req.body;

    const dupCheck = await userModel.findOne({ email });
    if (dupCheck) {
      return res.status(400).json({ msg: "user already exists" });
    }
    let bPass = await bcrypt.hash(password, 10);
    let emailOtp = Math.floor(Math.random() * (999999 - 100000) + 100000);

    await sendMail(
      email,
      `OTP verification`,
      `Enter the OTP to verify E-mail\n${emailOtp}`,
    );

    let obj = {
      fullName,
      email,
      password: bPass,
      emailOtp,
    };

    await userModel.insertOne(obj);

    res.status(201).json({ msg: "user created sucessfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.post("/email-otp",async (req,res)=>{
  try {
    let {otp} = req.body
    let user = await userModel.findOne({emailOtp : otp})
    if(!user){
      return res.status(400).json({msg : "invalid OTP"})
    }
    await userModel.updateOne({emailOtp : otp},{$set:{emailVerify : true,emailOtp:null}})
    res.status(200).json({msg : "email verified sucessfully"})
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
})

router.post("/login",async (req,res)=>{
  try {
    let {email , password} = req.body;
    let user = await userModel.findOne({email});
    if(!user){
      return res.status(400).json({msg: "user not found"})
    }
    let comparePassword  = await bcrypt.compare(password,user.password);
    if(!comparePassword){
      return res.status(400).json({msg : "invalid credentials"})
    }

    let payload = {
      email,
      id : user._id
    }
    let token = jwt.sign(payload,process.env.JWT_SECKEY,{expiresIn : "1D"})
    res.status(200).json({msg : "login sucessfully",token})
  } catch (error) {
    console.log(error)
    res.status(500).json({msg:"error krdiya"})
  }
})
export default router;