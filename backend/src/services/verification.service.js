import generateOTP from "../utils/generateOTP.js";
import sendEmail from "./email.service.js";
import { savePendingUser } from "./verificationStore.js";

const normalizeEmail = (email) => `${email || ""}`.trim().toLowerCase();

export const createOrRefreshVerificationEntry = async ({
  name = "User",
  email,
  password,
  subject = "InterviewVerse AI Verification OTP",
}) => {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail || !password) {
    throw new Error("Email and password are required for verification");
  }

  const otp = generateOTP();

  await savePendingUser({
    name,
    email: normalizedEmail,
    password,
    otp,
    otpExpiry: Date.now() + 10 * 60 * 1000,
  });

  const message = `
Hello ${name || "there"},

Use the following OTP to verify your email address for InterviewVerse AI:

${otp}

This OTP will expire in 10 minutes.
If you did not request this, please ignore this email.
`;

  const html = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Verify Your Email</title>
  </head>
  <body style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background:#f4f7fb;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" style="max-width:600px;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 12px 32px rgba(15,23,42,0.08);">
            <tr>
              <td style="background:linear-gradient(135deg,#0f172a,#2563eb);padding:28px 24px;color:#ffffff;">
                <h2 style="margin:0 0 8px;font-size:24px;">Verify your email</h2>
                <p style="margin:0;font-size:14px;opacity:0.9;">Welcome to InterviewVerse AI</p>
              </td>
            </tr>
            <tr>
              <td style="padding:32px 24px;">
                <p style="margin:0 0 12px;font-size:16px;line-height:1.6;">Hello ${name || "there"},</p>
                <p style="margin:0 0 20px;font-size:15px;line-height:1.7;">Use the One-Time Password below to complete your email verification. This code is valid for 10 minutes.</p>
                <div style="display:inline-block;padding:14px 24px;border-radius:12px;background:#f8fafc;border:1px solid #dbeafe;font-size:32px;letter-spacing:6px;font-weight:700;color:#0f172a;">${otp}</div>
                <p style="margin:20px 0 0;font-size:13px;line-height:1.6;color:#64748b;">If you didn’t request this verification, you can safely ignore this email.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

  await sendEmail({
    email: normalizedEmail,
    subject,
    message,
    html,
  });

  return {
    email: normalizedEmail,
    otp,
  };
};

export default createOrRefreshVerificationEntry;