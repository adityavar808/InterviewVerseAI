import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/user.model.js";

import generateAccessToken from "../utils/generateToken.js";
import generateRefreshToken from "../utils/generateRefreshToken.js";

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
        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET
        );


        // Find user
        const user = await User.findById(decoded.id);

        if (!user || user.refreshToken !== refreshToken) {

            return res.status(401).json({
                success: false,
                message: "Invalid refresh token",
            });
        }


        // Generate new access token
        const newAccessToken = generateAccessToken(user);


        res.status(200).json({
            success: true,
            accessToken: newAccessToken,
        });

    }

    catch (error) {

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


    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });


    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user,
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

    }

    catch (error) {

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

    }

    catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ================= CURRENT USER =================
const getMe = async (req, res) => {

    res.status(200).json({
        success: true,
        user: req.user,
    });
};

export {
  registerUser,
  loginUser,
  getMe,
  refreshAccessToken,
  logoutUser,
};