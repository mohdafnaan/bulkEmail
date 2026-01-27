import mailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

async function sendMail(to, subject, text) {
  try {
    const sender = mailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
      },
    });
    const user = await sender.sendMail({
      from: process.env.EMAIL,
      to: to,
      subject: subject,
      text: text,
    });
    console.log(`Email sent`, user.messageId);
  } catch (error) {
    console.log(error);
  }
}

export default sendMail;