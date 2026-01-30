import mailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
import userModel from "../models/User/User.js";
import emails from "./listofmails.js";

async function sendMailToHr() {
  try {
    const user = req.user;
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
      subject: `Resume Submission - ${from}`,
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
          path: user.resume.failePath,
        },
      ],
    });
    await userModel.updateOne(
      { email: user.email },
      { $set: { resumeSent: true, resumeSentAt: new Date() } },
    );
    console.log(`email sent to hr`,sender.messageId);
  } catch (error) {
    console.log(error);
  }
}

export default sendMailToHr;
