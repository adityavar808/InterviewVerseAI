import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import User from "../models/user.model.js";

import generateAccessToken from "../utils/generateToken.js";
import generateRefreshToken from "../utils/generateRefreshToken.js";
import generateOTP from "../utils/generateOTP.js";

import sendEmail from "../services/email.service.js";

import PendingUser from "../models/pendingUser.model.js";
import PlatformSetting from "../models/platformSetting.model.js";

// ================= REFRESH ACCESS TOKEN =================
const refreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token missing",
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Find user
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    if (user.role === "admin") {
      user.refreshToken = "";

      await user.save();

      res.clearCookie("refreshToken");

      return res.status(403).json({
        success: false,
        message:
          "Admin accounts cannot use the candidate session. Please use the admin portal.",
      });
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(user);

    res.status(200).json({
      success: true,
      accessToken: newAccessToken,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Refresh token expired",
    });
  }
};

// ================= REGISTER USER =================
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

    // Send OTP Email
    const message = `
Your InterviewVerse AI verification OTP is:

${otp}

This OTP will expire in 10 minutes.
`;

    await sendEmail({
      email: user.email,

      subject: "InterviewVerse AI Email Verification OTP",

      message,
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

// ================= LOGIN USER =================
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (user.status === "suspended") {
      return res.status(403).json({
        success: false,
        message: "Your account has been suspended",
      });
    }

    if (user.role === "admin") {
      return res.status(403).json({
        success: false,
        message:
          "This account belongs to an admin. Please use the admin login portal.",
      });
    }

    if (!user.isVerified) {
      return res.status(401).json({
        success: false,
        message: "Please verify your email first",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate Tokens
    const accessToken = generateAccessToken(user);

    const refreshToken = generateRefreshToken(user);

    // Save refresh token in DB
    user.refreshToken = refreshToken;
    user.lastLoginAt = new Date();
    user.lastActiveAt = new Date();
    user.status = "active";

    await user.save();

    // Store Refresh Token in Cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,

      secure: false,

      sameSite: "strict",

      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Login successful",

      accessToken,

      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= LOGOUT USER =================
const logoutUser = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      const user = await User.findOne({ refreshToken });

      if (user) {
        user.refreshToken = "";

        await user.save();
      }
    }

    // Clear cookie
    res.clearCookie("refreshToken");

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= CURRENT USER =================
const getMe = async (req, res) => {
  if (req.user.role === "admin") {
    return res.status(403).json({
      success: false,
      message:
        "Admin accounts are not allowed in the candidate portal. Please use the admin portal.",
    });
  }

  res.status(200).json({
    success: true,
    user: req.user,
  });
};

// ================= FORGOT PASSWORD =================
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

// ================= RESET PASSWORD =================
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

// ================= VERIFY OTP =================
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

// ================= RESEND OTP =================
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

// ================= GOOGLE AUTH SUCCESS =================
const googleAuthSuccess = async (req, res) => {
  try {
    const user = req.user;

    if (user.role === "admin") {
      return res.redirect(
        `${process.env.CLIENT_URL}/admin-login`,
      );
    }

    // Generate Tokens
    const accessToken = generateAccessToken(user);

    const refreshToken = generateRefreshToken(user);

    // Save refresh token
    user.refreshToken = refreshToken;
    user.lastLoginAt = new Date();
    user.lastActiveAt = new Date();
    user.status = "active";

    await user.save();

    // Store cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,

      secure: false,

      sameSite: "strict",

      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Redirect frontend
    res.redirect(
      `${process.env.CLIENT_URL}/oauth-success?token=${accessToken}`,
    );
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export {
  registerUser,
  loginUser,
  getMe,
  refreshAccessToken,
  logoutUser,
  forgotPassword,
  resetPassword,
  verifyOTP,
  resendOTP,
  googleAuthSuccess,
};
