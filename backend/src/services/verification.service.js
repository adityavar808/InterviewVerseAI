import PendingUser from "../models/pendingUser.model.js";

import generateOTP from "../utils/generateOTP.js";
import sendEmail from "./email.service.js";

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

  await PendingUser.deleteMany({
    email: normalizedEmail,
  });

  await PendingUser.create({
    name: `${name || "User"}`.trim(),
    email: normalizedEmail,
    password,
    otp,
    otpExpiry: Date.now() + 10 * 60 * 1000,
  });

  const message = `
Your InterviewVerse AI OTP is:

${otp}

This OTP will expire in 10 minutes.
`;

  await sendEmail({
    email: normalizedEmail,
    subject,
    message,
  });

  return {
    email: normalizedEmail,
    otp,
  };
};

export default createOrRefreshVerificationEntry;
