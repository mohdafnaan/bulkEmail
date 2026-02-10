import mailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

async function sendMail(to, subject, text) {
  try {
    const transporter = mailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
      },
    });

    const isOTP = subject.toLowerCase().includes("otp") || subject.toLowerCase().includes("verification");
    
    const mailOptions = {
      from: `"CV Uploader" <${process.env.EMAIL}>`,
      to: to,
      subject: subject,
      text: text,
    };

    if (isOTP) {
      const otpCode = text.match(/\d{6}/)?.[0] || "";
      mailOptions.html = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
          <h2 style="color: #3b82f6; text-align: center;">Verify Your Email</h2>
          <p style="color: #4b5563; font-size: 16px; line-height: 1.5;">Hello,</p>
          <p style="color: #4b5563; font-size: 16px; line-height: 1.5;">Thank you for registering. Please use the following one-time password (OTP) to verify your email address:</p>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center; margin: 25px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #111827;">${otpCode}</span>
          </div>
          <p style="color: #6b7280; font-size: 14px; line-height: 1.5;">This code will expire in 10 minutes. If you did not request this, please ignore this email.</p>
          <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 25px 0;" />
          <p style="text-align: center; color: #9ca3af; font-size: 12px;">&copy; ${new Date().getFullYear()} CV Uploader. All rights reserved.</p>
        </div>
      `;
    }

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error("Mailer Error:", error);
    throw error;
  }
}

export default sendMail;