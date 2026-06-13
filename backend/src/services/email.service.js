import nodemailer from "nodemailer";

const sendEmail = async (options) => {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  if (!emailUser || !emailPass) {
    throw new Error(
      "Email service is not configured. Set EMAIL_USER and EMAIL_PASS in the backend environment.",
    );
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
    from: `"InterviewVerse AI" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message || "",
    html: options.html || "",
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;
