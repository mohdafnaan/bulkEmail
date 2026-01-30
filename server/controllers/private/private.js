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
      return res.status(400).json({ msg: "No file uploaded" });
    }
    const user = req.user;
    await userModel.updateOne(
      { email: user.email },
      {
        $set: {
          "resume.fileName": req.file.filename,
          "resume.filePath": req.file.path,
          "resume.fileType": req.file.mimetype,
        },
      },
    );
    res.status(200).json({ msg: "CV uploaded", file: req.file });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.get("/sendcv", async (req, res) => {
    try {
      const lUser = req.user;
      const user = await userModel.findOne({email : lUser.email})
      console.log(user)
      const transporter = mailer.createTransport({
        service: "gmail",
        auth: {
          user: user.email,
          pass: process.env.PASS,
        },
      });

      const sender = await transporter.sendMail({
        from: user.email,
        to: emails,
        subject: `Resume Submission - ${user.email}`,
        text: `
        Hello Team,

        please find attached my resume.

        Name : ${user.fullName}
        Email : ${user.email}

        Regards,
        ${user.fullName}
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
      // console.log(`email sent`);
    } catch (error) {
      console.log(error);
    }
  }
)
export default router;
