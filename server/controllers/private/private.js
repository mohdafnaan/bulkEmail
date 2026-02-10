import express from "express";
import mailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config()
import upload from "../../utils/multer.js";
import userModel from "../../models/User/User.js";
import sendMailToHr from "../../utils/hrMail.js";
import emails from "../../utils/listofmails.js";

const router = express.Router();

router.post("/uploadcv", upload.single("resume"), async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ msg: "No file uploaded or invalid file type" });
    }

    const user = req.user;

    // Update user with resume details
    const updateResult = await userModel.updateOne(
      { email: user.email },
      {
        $set: {
          "resume.fileName": req.file.filename,
          "resume.filePath": req.file.path,
          "resume.fileType": req.file.mimetype,
          "resume.uploadedAt": new Date(),
        },
      },
    );

    if (updateResult.matchedCount === 0) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json({ 
      msg: "Resume uploaded successfully", 
      file: {
        name: req.file.filename,
        size: req.file.size,
        type: req.file.mimetype
      }
    });
  } catch (error) {
    console.error("Upload error:", error);
    
    // Handle multer errors
    if (error.message === "Only PDF, DOC, and DOCX files are allowed") {
      return res.status(400).json({ msg: error.message });
    }
    
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ msg: "File size exceeds 5MB limit" });
    }
    
    res.status(500).json({ msg: "Upload failed. Please try again." });
  }
});

router.get("/sendcv", async (req, res) => {
  try {
    const lUser = req.user;
    
    // Find user
    const user = await userModel.findOne({ email: lUser.email });
    
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Check if resume exists
    if (!user.resume || !user.resume.filePath) {
      return res.status(400).json({ msg: "No resume found. Please upload your resume first." });
    }

    // Create email transporter
    const transporter = mailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
      },
    });

    // Send email with resume attachment
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: emails,
      subject: `Resume Submission - ${user.fullName}`,
      text: `Hello HR Team,

Please find attached the resume for your review.

Candidate Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name: ${user.fullName}
Email: ${user.email}
Submitted: ${new Date().toLocaleString()}

Thank you for your consideration.

Best regards,
${user.fullName}`,
      attachments: [
        {
          filename: user.resume.fileName,
          path: user.resume.filePath,
        },
      ],
    });
    
    // Update user record
    await userModel.updateOne(
      { email: user.email },
      { 
        $set: { 
          resumeSent: true, 
          resumeSentAt: new Date() 
        } 
      },
    );
    
    console.log(`Resume sent successfully for: ${user.email}`);
    res.status(200).json({ msg: "Resume sent successfully to HR team!" });
  } catch (error) {
    console.error("Send CV error:", error);
    res.status(500).json({ msg: "Failed to send resume. Please try again." });
  }
});
export default router;
