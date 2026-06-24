import speakeasy from "speakeasy";
import QRCode from "qrcode";
import jwt from "jsonwebtoken";
import User from "../../models/user.model.js";
import { sanitizeUser } from "../../utils/adminHelpers.js";
import generateAccessToken from "../../utils/generateToken.js";
import generateRefreshToken from "../../utils/generateRefreshToken.js";

const refreshCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite:
    process.env.NODE_ENV === "production"
      ? "none"
      : "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

// Setup Two-Factor Authentication
const setup2FA = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Generate a unique TOTP secret
    const secret = speakeasy.generateSecret({
      name: `InterviewVerse:${user.email}`,
    });

    // Generate a QR code base64 URL
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);

    // Save temporary secret (not active until verified)
    user.twoFactorTempSecret = secret.base32;
    await user.save();

    return res.status(200).json({
      success: true,
      secret: secret.base32,
      qrCodeUrl,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Verify and enable 2FA
const verify2FA = async (req, res) => {
  try {
    const { otpToken } = req.body;
    if (!otpToken) {
      return res.status(400).json({
        success: false,
        message: "OTP token is required",
      });
    }

    const user = await User.findById(req.user._id);
    if (!user || !user.twoFactorTempSecret) {
      return res.status(400).json({
        success: false,
        message: "2FA setup has not been initiated",
      });
    }

    // Verify token
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorTempSecret,
      encoding: "base32",
      token: otpToken,
      window: 1,
    });

    if (!verified) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP token. Please scan the QR code again.",
      });
    }

    // Enable 2FA
    user.twoFactorSecret = user.twoFactorTempSecret;
    user.twoFactorTempSecret = "";
    user.isTwoFactorEnabled = true;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Two-factor authentication enabled successfully",
      user: sanitizeUser(user),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Disable 2FA
const disable2FA = async (req, res) => {
  try {
    const { otpToken } = req.body;
    if (!otpToken) {
      return res.status(400).json({
        success: false,
        message: "OTP token is required",
      });
    }

    const user = await User.findById(req.user._id);
    if (!user || !user.isTwoFactorEnabled) {
      return res.status(400).json({
        success: false,
        message: "2FA is not enabled for this account",
      });
    }

    // Verify token
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: "base32",
      token: otpToken,
      window: 1,
    });

    if (!verified) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP token",
      });
    }

    // Disable 2FA
    user.isTwoFactorEnabled = false;
    user.twoFactorSecret = "";
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Two-factor authentication disabled successfully",
      user: sanitizeUser(user),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Verify 2FA during Login
const verifyLogin2FA = async (req, res) => {
  try {
    const { tempToken, otpToken } = req.body;
    if (!tempToken || !otpToken) {
      return res.status(400).json({
        success: false,
        message: "Temp token and OTP token are required",
      });
    }

    // Decode temp token
    let decoded;
    try {
      decoded = jwt.verify(
        tempToken,
        process.env.JWT_2FA_SECRET || (process.env.JWT_ACCESS_SECRET + "-2fa")
      );
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Login session expired. Please enter password again.",
      });
    }

    const user = await User.findById(decoded.id);
    if (!user || !user.isTwoFactorEnabled) {
      return res.status(400).json({
        success: false,
        message: "Invalid login attempt",
      });
    }

    // Verify OTP
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: "base32",
      token: otpToken,
      window: 1,
    });

    if (!verified) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP token",
      });
    }

    // Generate real JWT tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    user.lastLoginAt = new Date();
    user.lastActiveAt = new Date();
    user.status = "active";
    await user.save();

    // Store Refresh Token in Cookie
    res.cookie("refreshToken", refreshToken, {
      ...refreshCookieOptions,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      accessToken,
      user: sanitizeUser(user),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export { setup2FA, verify2FA, disable2FA, verifyLogin2FA };
