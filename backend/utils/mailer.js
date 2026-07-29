import dotenv from "dotenv";
import nodemailer from "nodemailer";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587,
  secure: process.env.SMTP_SECURE === "true" || false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  connectionTimeout: 30000,
  greetingTimeout: 30000,
  socketTimeout: 60000,
});

// verify transporter once at startup in server.js (optional)
const sendMail = async (options) => {
  const mailOptions = {
    from: process.env.SMTP_FROM || `"FixMate" <${process.env.SMTP_USER}>`,
    ...options,
  };
  return transporter.sendMail(mailOptions);
};

export default { sendMail, transporter };
