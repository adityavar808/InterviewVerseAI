import bcrypt from "bcryptjs";
import crypto from "crypto";

import User from "../../models/user.model.js";
import PendingUser from "../../models/pendingUser.model.js";
import PlatformSetting from "../../models/platformSetting.model.js";

import generateOTP from "../../utils/generateOTP.js";
import sendEmail from "../../services/email.service.js";

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const settings = await PlatformSetting.findOne({
      key: "default",
    });

    if (settings && !settings.allowRegistrations) {
      return res.status(403).json({
        success: false,
        message: "New registrations are currently disabled",
      });
    }

    // Check existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = generateOTP();

    await PendingUser.deleteMany({
      email,
    });

    // Create user
    const user = await PendingUser.create({
      name,

      email,

      password: hashedPassword,

      otp,

      otpExpiry: Date.now() + 10 * 60 * 1000,
    });

    const otpEmailTemplate = (name, otp) => ` <!DOCTYPE html> <html lang="en"> <head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <title>Verify Your Email</title> </head> <body style="margin:0;padding:0;background-color:#f3f4f6;font-family:Arial,Helvetica,sans-serif;"> <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f3f4f6;padding:40px 0;"> <tr> <td align="center"> <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;"> <tr> <td style="padding:32px 40px;border-bottom:1px solid #e5e7eb;"> <h1 style=" margin:0; font-size:28px; font-weight:700; color:#111827; "> InterviewVerse AI </h1> <p style=" margin:8px 0 0; font-size:14px; color:#6b7280; "> AI-Powered Interview Preparation Platform </p> </td> </tr> <tr> <td style="padding:40px;"> <h2 style=" margin:0 0 24px; font-size:30px; font-weight:700; color:#111827; "> Verify your email address </h2> <p style=" margin:0 0 16px; font-size:16px; line-height:1.7; color:#374151; "> Hello <strong>${name || "User"}</strong>, </p> <p style=" margin:0 0 24px; font-size:16px; line-height:1.7; color:#374151; "> Thank you for signing up for InterviewVerse AI. To complete your registration, please enter the verification code below. </p> <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"> <tr> <td align="center"> <div style=" display:inline-block; padding:24px 32px; border:1px solid #d1d5db; border-radius:12px; background:#f9fafb; "> <p style=" margin:0; font-size:12px; letter-spacing:2px; text-transform:uppercase; color:#6b7280; "> Verification Code </p> <h1 style=" margin:12px 0 0; font-size:42px; font-weight:700; letter-spacing:10px; color:#111827; "> ${otp} </h1> </div> </td> </tr> </table> <p style=" margin:28px 0 0; font-size:15px; line-height:1.7; color:#374151; "> This verification code will expire in <strong>10 minutes</strong>. </p> <p style=" margin:12px 0 0; font-size:15px; line-height:1.7; color:#374151; "> For your security, never share this code with anyone. InterviewVerse AI will never ask for your verification code. </p> <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style=" margin-top:28px; background:#eff6ff; border-left:4px solid #2563eb; border-radius:6px; "> <tr> <td style="padding:16px;"> <p style=" margin:0; font-size:14px; line-height:1.6; color:#1e40af; "> If you did not create an account with InterviewVerse AI, you can safely ignore this email. </p> </td> </tr> </table> </td> </tr> <tr> <td style=" padding:24px 40px; background:#fafafa; border-top:1px solid #e5e7eb; "> <p style=" margin:0; font-size:13px; color:#9ca3af; text-align:center; "> Â© ${new Date().getFullYear()} InterviewVerse AI. All rights reserved. </p> <p style=" margin:8px 0 0; font-size:12px; color:#9ca3af; text-align:center; "> This is an automated message. Please do not reply to this email. </p> </td> </tr> </table> </td> </tr> </table> </body> </html> `;

    const html = otpEmailTemplate(user.name, otp);

    await sendEmail({
      email: user.email,
      subject: "ðŸ” Verify Your Email - InterviewVerse AI",
      html,
    });

    res.status(201).json({
      success: true,
      message: "User registered. OTP sent to email.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Generate token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Hash token and save
    user.resetPasswordToken = resetToken;

    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    await user.save();

    // Reset URL
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    // Message
    const message = `
You requested a password reset.

Reset your password using this link:

${resetUrl}

If you did not request this, please ignore this email.
`;

    // Send Email
    await sendEmail({
      email: user.email,
      subject: "Password Reset Request",
      message,
    });

    res.status(200).json({
      success: true,
      message: "Reset email sent",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;

    const { password } = req.body;

    // Find user
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save new password
    user.password = hashedPassword;

    user.resetPasswordToken = undefined;

    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Find pending user

    const pendingUser = await PendingUser.findOne({
      email,

      otp,

      otpExpiry: {
        $gt: Date.now(),
      },
    });

    // Invalid OTP

    if (!pendingUser) {
      return res.status(400).json({
        success: false,

        message: "Invalid or expired OTP",
      });
    }

    // Check existing real user

    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,

        message: "User already exists",
      });
    }

    // Create verified real user

    await User.create({
      name: pendingUser.name,

      email: pendingUser.email,

      password: pendingUser.password,

      isVerified: true,
    });

    // Delete pending user

    await PendingUser.deleteOne({
      email,
    });

    res.status(200).json({
      success: true,

      message: "Email verified successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // Find user
    const user = await PendingUser.findOne({
      email,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Generate new OTP
    const otp = generateOTP();

    user.otp = otp;

    user.otpExpiry = Date.now() + 10 * 60 * 1000;

    await user.save();

    // Send email
    const message = `
Your new InterviewVerse AI OTP is:

${otp}

This OTP will expire in 10 minutes.
`;

    await sendEmail({
      email: user.email,

      subject: "InterviewVerse AI New OTP",

      message,
    });

    res.status(200).json({
      success: true,
      message: "OTP resent successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export {
  registerUser,
  verifyOTP,
  resendOTP,
  forgotPassword,
  resetPassword,
};
