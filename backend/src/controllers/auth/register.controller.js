import bcrypt from "bcryptjs";
import crypto from "crypto";

import User from "../../models/user.model.js";
import PlatformSetting from "../../models/platformSetting.model.js";

import getFrontendUrl from "../../utils/frontendUrl.js";
import sendEmail from "../../services/email.service.js";
import { createOrRefreshVerificationEntry } from "../../services/verification.service.js";
import {
  createVerifiedUser,
  deletePendingUser,
  findPendingUser,
  findUserByEmail,
} from "../../services/verificationStore.js";

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const normalizedEmail = `${email || ""}`
      .trim()
      .toLowerCase();

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
    const existingUser = await findUserByEmail(normalizedEmail);

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationResult = await createOrRefreshVerificationEntry({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      subject: "📧 Verify Your Email - InterviewVerse AI",
    });

    res.status(201).json({
      success: true,
      message: "User registered. OTP sent to email.",
      email: normalizedEmail,
      otp: process.env.NODE_ENV !== "production" ? verificationResult.otp : undefined,
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
    const normalizedEmail = `${email || ""}`
      .trim()
      .toLowerCase();

    // Find user
    const user = await User.findOne({
      email: normalizedEmail,
    });

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
    const resetUrl = `${getFrontendUrl()}/reset-password/${resetToken}`;

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
    const normalizedEmail = `${email || ""}`
      .trim()
      .toLowerCase();

    // Find pending user

    const pendingUser = await findPendingUser({
      email: normalizedEmail,
      otp,
    });

    // Invalid OTP

    if (!pendingUser) {
      return res.status(400).json({
        success: false,

        message: "Invalid or expired OTP",
      });
    }

    // Check existing real user

    const existingUser = await findUserByEmail(normalizedEmail);

    if (existingUser) {
      return res.status(400).json({
        success: false,

        message: "User already exists",
      });
    }

    // Create verified real user

    await createVerifiedUser({
      name: pendingUser.name,
      email: pendingUser.email,
      password: pendingUser.password,
      profileSetupDone: false,
    });

    // Delete pending user

    await deletePendingUser(normalizedEmail);

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
    const normalizedEmail = `${email || ""}`
      .trim()
      .toLowerCase();

    const pendingUser = await findPendingUser({
      email: normalizedEmail,
    });

    if (!pendingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const verificationResult = await createOrRefreshVerificationEntry({
      name: pendingUser.name,
      email: pendingUser.email,
      password: pendingUser.password,
      subject: "InterviewVerse AI New OTP",
    });

    res.status(200).json({
      success: true,
      message: "OTP resent successfully",
      email: pendingUser.email,
      otp: process.env.NODE_ENV !== "production" ? verificationResult.otp : undefined,
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
