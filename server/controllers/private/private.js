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
    if (!req.file) {
      return res.status(400).json({ msg: "No file uploaded or invalid file type" });
    }
    const user = req.user;
    // console.log(user)
    const updateResult = await userModel.updateOne(
      { email: user.email },
      {
        $set: {
          "resume.fileName": req.file.filename,
          "resume.filePath": req.file.path,
          "resume.fileType": req.file.mimetype,
        },
      },
    );
    
    if (updateResult.matchedCount === 0) {
        return res.status(404).json({ msg: "User not found to update" });
    }

    res.status(200).json({ msg: "CV uploaded successfully", file: req.file });
  } catch (error) {
    console.log("Upload error:", error);
    res.status(500).json({ msg: "Server error during upload", error: error.message });
  }
});

router.get("/sendcv", async (req, res) => {
    try {
      const lUser = req.user;
      const user = await userModel.findOne({email : lUser.email})
      
      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }

      if (!user.resume || !user.resume.filePath) {
        return res.status(400).json({ msg: "No resume found. Please upload one first." });
      }

      console.log(`Sending email for user: ${user.email}`);

      const transporter = mailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASS,
        },
      });

      const sender = await transporter.sendMail({
        from: process.env.EMAIL,
        to: emails, 
        subject: `Resume Submission - ${user.email}`,
        text: `
        Hello Team,

        please find attached my resume.

        Name : ${user.fullName || "Candidate"}
        Email : ${user.email}

        Regards,
        ${user.fullName || "Candidate"}
        `,
        attachments: [
          {
            filename: user.resume.fileName,
            path: user.resume.filePath,
          },
        ],
      });
      
      await userModel.updateOne(
        { email: user.email },
        { $set: { resumeSent: true, resumeSentAt: new Date() } },
      );
      
      console.log(`Email sent successfully to HRs`);
      res.status(200).json({msg : "Email sent successfully to HRs"})
    } catch (error) {
      console.log("Send CV error:", error); 
      res.status(500).json({ msg: "Failed to send email", error: error.message });
    }
  }
)
export default router;
