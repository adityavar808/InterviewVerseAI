import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../../models/user.model.js";

import generateAccessToken from "../../utils/generateToken.js";
import generateRefreshToken from "../../utils/generateRefreshToken.js";

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

  res.status(200).json({
    success: true,
    user: req.user,
  });
};

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
  refreshAccessToken,
  loginUser,
  logoutUser,
  getMe,
  googleAuthSuccess,
};
