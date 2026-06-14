import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

export const normalizeEmailCredential = (value) => {
  if (!value) {
    return "";
  }

  return String(value).trim().replace(/\s+/g, "");
};

const sendEmail = async (options) => {
  const emailUser = normalizeEmailCredential(process.env.EMAIL_USER);
  const emailPass = normalizeEmailCredential(process.env.EMAIL_PASS);
  const isMockEmailMode = process.env.EMAIL_MOCK === "true";

  if (!emailUser || !emailPass) {
    const missingConfigMessage =
      "Email service is not configured. Set EMAIL_USER and EMAIL_PASS in the backend environment (for Gmail, use an app password).";

    if (isMockEmailMode || process.env.NODE_ENV !== "production") {
      console.warn(`[email] ${missingConfigMessage}`);
      console.warn(`[email] OTP email was skipped locally. Set EMAIL_MOCK=false and provide SMTP credentials to send real emails.`);
      return;
    }

    throw new Error(missingConfigMessage);
  }

  const emailPort = Number(process.env.EMAIL_PORT || 587);
  const emailSecure = process.env.EMAIL_SECURE
    ? process.env.EMAIL_SECURE === "true"
    : emailPort === 465;

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: emailPort,
    family: 4,
    secure: emailSecure,
    requireTLS: !emailSecure,
    auth: {
      user: emailUser,
      pass: emailPass,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM || `"InterviewVerse AI" <${emailUser}>`,
    to: options.email,
    subject: options.subject,
    text: options.message || "",
    html: options.html || "",
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("[email] Failed to send email:", error.message);
    throw new Error(`Email delivery failed: ${error.message}`);
  }
};

export default sendEmail;
