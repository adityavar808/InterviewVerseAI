import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import speakeasy from "speakeasy";

import User from "../../models/user.model.js";

import generateAccessToken from "../../utils/generateToken.js";
import generateRefreshToken from "../../utils/generateRefreshToken.js";
import {
  resolveUserStatus,
  sanitizeUser,
} from "../../utils/adminHelpers.js";

const refreshCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite:
    process.env.NODE_ENV === "production"
      ? "none"
      : "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password are required",
      });
    }

    const admin = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!admin || admin.role !== "admin") {
      return res.status(401).json({
        success: false,
        message:
          "Invalid admin credentials",
      });
    }

    if (
      resolveUserStatus(admin) ===
      "suspended"
    ) {
      return res.status(403).json({
        success: false,
        message:
          "This admin account is suspended",
      });
    }

    if (!admin.isVerified) {
      return res.status(403).json({
        success: false,
        message:
          "Please verify your email first",
      });
    }

    if (resolveUserStatus(admin) !== "active") {
      return res.status(403).json({
        success: false,
        message:
          "This admin account is inactive",
      });
    }

    const isMatch =
      await bcrypt.compare(
        password,
        admin.password,
      );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid admin credentials",
      });
    }

    // Intercept with 2FA check if enabled
    if (admin.isTwoFactorEnabled) {
      const tempToken = jwt.sign(
        { id: admin._id, requires2FA: true },
        process.env.JWT_2FA_SECRET || (process.env.JWT_ACCESS_SECRET + "-2fa"),
        { expiresIn: "5m" }
      );
      return res.status(200).json({
        success: true,
        requires2FA: true,
        tempToken,
        email: admin.email,
        isAdmin: true,
      });
    }

    const accessToken =
      generateAccessToken(admin);
    const refreshToken =
      generateRefreshToken(admin);

    admin.adminRefreshToken =
      refreshToken;
    admin.lastLoginAt = new Date();
    admin.lastActiveAt = new Date();
    admin.status = "active";

    await admin.save();

    res.cookie(
      "adminRefreshToken",
      refreshToken,
      {
        ...refreshCookieOptions,
      },
    );

    return res.status(200).json({
      success: true,
      message:
        "Admin login successful",
      accessToken,
      admin: sanitizeUser(
        admin.toObject(),
      ),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const verifyAdminLogin2FA = async (req, res) => {
  try {
    const { tempToken, otp, otpToken } = req.body;
    const code = otpToken || otp;

    if (!tempToken || !code) {
      return res.status(400).json({
        success: false,
        message: "Temp token and OTP token are required",
      });
    }

    const decoded = jwt.verify(
      tempToken,
      process.env.JWT_2FA_SECRET || (process.env.JWT_ACCESS_SECRET + "-2fa")
    );

    const admin = await User.findById(decoded.id);
    if (!admin || admin.role !== "admin" || !admin.isTwoFactorEnabled) {
      return res.status(401).json({ success: false, message: "Invalid login attempt" });
    }

    const verified = speakeasy.totp.verify({
      secret: admin.twoFactorSecret,
      encoding: "base32",
      token: code,
      window: 1,
    });

    if (!verified) {
      return res.status(401).json({ success: false, message: "Invalid 2FA code" });
    }

    const accessToken = generateAccessToken(admin);
    const refreshToken = generateRefreshToken(admin);

    admin.adminRefreshToken = refreshToken;
    admin.lastLoginAt = new Date();
    admin.lastActiveAt = new Date();
    admin.status = "active";
    await admin.save();

    res.cookie("adminRefreshToken", refreshToken, refreshCookieOptions);

    return res.status(200).json({
      success: true,
      message: "Admin login successful",
      accessToken,
      admin: sanitizeUser(admin.toObject()),
    });
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid or expired session" });
  }
};

const refreshAdminToken = async (
  req,
  res,
) => {
  try {
    const refreshToken =
      req.cookies.adminRefreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message:
          "Admin refresh token missing",
      });
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET,
    );

    const admin = await User.findById(
      decoded.id,
    );

    if (
      !admin ||
      admin.role !== "admin" ||
      admin.adminRefreshToken !==
        refreshToken
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid admin refresh token",
      });
    }

    if (resolveUserStatus(admin) === "suspended") {
      admin.adminRefreshToken = "";
      await admin.save();
      res.clearCookie("adminRefreshToken");

      return res.status(403).json({
        success: false,
        message: "This admin account is suspended",
      });
    }

    if (!admin.isVerified) {
      admin.adminRefreshToken = "";
      await admin.save();
      res.clearCookie("adminRefreshToken");

      return res.status(403).json({
        success: false,
        message:
          "Please verify your email first",
      });
    }

    if (resolveUserStatus(admin) !== "active") {
      admin.adminRefreshToken = "";
      await admin.save();
      res.clearCookie("adminRefreshToken");

      return res.status(403).json({
        success: false,
        message:
          "This admin account is inactive",
      });
    }

    const accessToken =
      generateAccessToken(admin);

    admin.lastActiveAt = new Date();
    await admin.save();

    return res.status(200).json({
      success: true,
      accessToken,
      admin: sanitizeUser(
        admin.toObject(),
      ),
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message:
        "Admin session expired",
    });
  }
};

const logoutAdmin = async (req, res) => {
  try {
    const refreshToken =
      req.cookies.adminRefreshToken;

    if (refreshToken) {
      const admin =
        await User.findOne({
          adminRefreshToken:
            refreshToken,
        });

      if (admin) {
        admin.adminRefreshToken = "";
        await admin.save();
      }
    }

    res.clearCookie(
      "adminRefreshToken",
    );

    return res.status(200).json({
      success: true,
      message:
        "Admin logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAdminMe = async (req, res) => {
  return res.status(200).json({
    success: true,
    admin: sanitizeUser(
      req.user.toObject(),
    ),
  });
};

export {
  loginAdmin,
  verifyAdminLogin2FA,
  refreshAdminToken,
  logoutAdmin,
  getAdminMe,
};
