import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../../models/user.model.js";

import generateAccessToken from "../../utils/generateToken.js";
import generateRefreshToken from "../../utils/generateRefreshToken.js";
import getFrontendUrl from "../../utils/frontendUrl.js";
import { resolveUserStatus, sanitizeUser } from "../../utils/adminHelpers.js";
import { createOrRefreshVerificationEntry } from "../../services/verification.service.js";
import { findPendingUser } from "../../services/verificationStore.js";

const refreshCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite:
    process.env.NODE_ENV === "production"
      ? "none"
      : "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

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

    if (resolveUserStatus(user) === "suspended") {
      user.refreshToken = "";

      await user.save();

      res.clearCookie("refreshToken");

      return res.status(403).json({
        success: false,
        message: "Your account has been suspended",
      });
    }

    if (!user.isVerified) {
      user.refreshToken = "";

      await user.save();

      res.clearCookie("refreshToken");

      return res.status(403).json({
        success: false,
        message: "Please verify your email first",
      });
    }

    if (resolveUserStatus(user) !== "active") {
      user.refreshToken = "";

      await user.save();

      res.clearCookie("refreshToken");

      return res.status(403).json({
        success: false,
        message: "Your account is inactive. Please contact support.",
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

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = `${email || ""}`
      .trim()
      .toLowerCase();

    // Find user
    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      const pendingUser = await findPendingUser({
        email: normalizedEmail,
        ignoreExpiry: true,
      });

      if (pendingUser) {
        const isMatch = await bcrypt.compare(password, pendingUser.password);
        if (isMatch) {
          const verificationResult = await createOrRefreshVerificationEntry({
            name: pendingUser.name,
            email: pendingUser.email,
            password: pendingUser.password,
            subject: "📧 Verify Your Email - InterviewVerse AI",
          });

          return res.status(200).json({
            success: false,
            requiresVerification: true,
            message: "Please verify your email first. A new OTP has been sent.",
            email: normalizedEmail,
            otp: process.env.NODE_ENV !== "production" ? verificationResult.otp : undefined,
          });
        }
      }

      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (resolveUserStatus(user) === "suspended") {
      return res.status(403).json({
        success: false,
        message: "Your account has been suspended",
      });
    }

    if (!user.isVerified) {
      return res.status(200).json({
        success: false,
        requiresVerification: true,
        message: "Please verify your email first",
        email: normalizedEmail,
      });
    }

    if (resolveUserStatus(user) !== "active") {
      return res.status(403).json({
        success: false,
        message: "Your account is inactive. Please contact support.",
      });
    }

    if (user.role === "admin") {
      return res.status(403).json({
        success: false,
        message:
          "This account belongs to an admin. Please use the admin login portal.",
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

    // Intercept with 2FA check if enabled
    if (user.isTwoFactorEnabled) {
      const tempToken = jwt.sign(
        { id: user._id, requires2FA: true },
        process.env.JWT_2FA_SECRET || (process.env.JWT_ACCESS_SECRET + "-2fa"),
        { expiresIn: "5m" }
      );
      return res.status(200).json({
        success: true,
        requires2FA: true,
        tempToken,
        email: user.email,
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
      ...refreshCookieOptions,
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

const getMe = async (req, res) => {
  if (req.user.role === "admin") {
    return res.status(403).json({
      success: false,
      message:
        "Admin accounts are not allowed in the candidate portal. Please use the admin portal.",
    });
  }

  let updated = false;
  if (req.user.interviewCredits === undefined) {
    req.user.interviewCredits = 10;
    updated = true;
  }
  if (req.user.resumeCredits === undefined) {
    req.user.resumeCredits = 10;
    updated = true;
  }
  if (updated && req.user.save) {
    await req.user.save();
  }

  const sanitized = sanitizeUser(req.user.toObject());

  res.status(200).json({
    success: true,
    data: sanitized,
    user: sanitized,
  });
};

const googleAuthSuccess = async (req, res) => {
  try {
    const user = req.user;

    if (resolveUserStatus(user) === "suspended") {
      res.clearCookie("refreshToken");

      return res.redirect(
        `${getFrontendUrl()}/login?error=${encodeURIComponent("Your account has been suspended")}`,
      );
    }

    if (!user.isVerified) {
      res.clearCookie("refreshToken");

      return res.redirect(
        `${getFrontendUrl()}/login?error=${encodeURIComponent("Please verify your email first")}`,
      );
    }

    if (resolveUserStatus(user) !== "active") {
      res.clearCookie("refreshToken");

      return res.redirect(
        `${getFrontendUrl()}/login?error=${encodeURIComponent("Your account is inactive. Please contact support.")}`,
      );
    }

    if (user.role === "admin") {
      return res.redirect(
        `${getFrontendUrl()}/admin-login`,
      );
    }

    // Generate Tokens
    const accessToken = generateAccessToken(user);

    const refreshToken = generateRefreshToken(user);

    // Save refresh token & initialize default credits if missing
    user.refreshToken = refreshToken;
    user.lastLoginAt = new Date();
    user.lastActiveAt = new Date();
    user.status = "active";
    if (user.interviewCredits === undefined) user.interviewCredits = 10;
    if (user.resumeCredits === undefined) user.resumeCredits = 10;

    await user.save();

    // Store cookie
    res.cookie("refreshToken", refreshToken, {
      ...refreshCookieOptions,
    });

    // Redirect frontend
    if (req.query.state === "mobile") {
      return res.redirect(
        `/api/auth/oauth-success-info?token=${accessToken}`
      );
    }

    res.redirect(
      `${getFrontendUrl()}/oauth-success?token=${accessToken}`,
    );
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export {
  refreshAccessToken,
  loginUser,
  logoutUser,
  getMe,
  googleAuthSuccess,
};
