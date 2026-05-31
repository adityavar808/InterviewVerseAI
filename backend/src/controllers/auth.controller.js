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

// ================= STUDENT DASHBOARD =================
const studentDashboard = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user || user.role !== "student") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    // Import models
    const InterviewTemplate =
      (await import(
        "../models/interviewTemplate.model.js"
      )).default;
    const CodingQuestion =
      (await import(
        "../models/codingQuestion.model.js"
      )).default;

    // Fetch published templates and questions
    const [interviews, codingQuestions, totalInterviewTemplates, totalCodingQuestions] =
      await Promise.all([
        InterviewTemplate.find({
          status: "published",
        }).lean(),
        CodingQuestion.find({
          status: "published",
        }).lean(),
        InterviewTemplate.countDocuments({
          status: "published",
        }),
        CodingQuestion.countDocuments({
          status: "published",
        }),
      ]);

    // Calculate performance metrics
    const performanceData = [
      {
        day: "Mon",
        score: 65,
      },
      {
        day: "Tue",
        score: 72,
      },
      {
        day: "Wed",
        score: 68,
      },
      {
        day: "Thu",
        score: 80,
      },
      {
        day: "Fri",
        score: 84,
      },
      {
        day: "Sat",
        score: 90,
      },
    ];

    // Sample performance stats
    const performanceStats = [
      {
        title: "Total Interviews",
        value: "24",
        growth: "+18%",
      },
      {
        title: "Average Score",
        value: "89%",
        growth: "+6%",
      },
      {
        title: "Coding Accuracy",
        value: "93%",
        growth: "+12%",
      },
      {
        title: "Communication",
        value: "84%",
        growth: "+9%",
      },
    ];

    // Skill distribution
    const skillData = [
      {
        subject: "DSA",
        score: 92,
      },
      {
        subject: "React",
        score: 88,
      },
      {
        subject: "Backend",
        score: 81,
      },
      {
        subject: "Communication",
        score: 84,
      },
      {
        subject: "System Design",
        score: 70,
      },
      {
        subject: "Problem Solving",
        score: 95,
      },
    ];

    // Activity heatmap (5 weeks)
    const activityHeatmap = [
      [1, 2, 0, 4, 3, 2, 1],
      [0, 3, 2, 1, 4, 2, 0],
      [2, 4, 3, 2, 1, 0, 1],
      [1, 2, 4, 3, 2, 1, 2],
      [3, 1, 2, 4, 4, 3, 2],
    ];

    // Weakness analysis
    const weaknesses = [
      {
        title: "System Design",
        issue:
          "Need stronger understanding of scalable architecture patterns and distributed systems.",
        improvement:
          "Focus on HLD & LLD practice.",
        severity: "High",
      },
      {
        title: "Communication Confidence",
        issue:
          "Speech confidence slightly drops during technical explanations.",
        improvement:
          "Practice mock HR interviews regularly.",
        severity: "Medium",
      },
      {
        title: "Code Optimization",
        issue:
          "Some solutions use unnecessary loops and redundant conditions.",
        improvement:
          "Focus on time complexity optimization.",
        severity: "Medium",
      },
    ];

    // Recent interviews
    const recentInterviews = [
      {
        role: "Frontend Developer",
        score: 84,
        date: "12 May 2026",
        status: "Completed",
        tech: ["React", "CSS"],
      },
      {
        role: "MERN Stack Developer",
        score: 78,
        date: "14 May 2026",
        status: "Completed",
        tech: ["MongoDB", "Node"],
      },
      {
        role: "AI Engineer",
        score: 91,
        date: "16 May 2026",
        status: "Completed",
        tech: ["Python", "ML"],
      },
    ];

    const data = {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage || "",
      },
      overview: {
        totalInterviews: 24,
        atsResumeScore: 88,
        codingProblems: 136,
        dailyStreak: 12,
        thisWeekInterviews: 3,
        resumeImprovement: 5,
        problemsThisWeek: 8,
        availableInterviewTemplates: totalInterviewTemplates,
        availableCodingQuestions: totalCodingQuestions,
      },
      charts: {
        performanceChart: performanceData,
        performanceStats,
        skillRadar: skillData,
        activityHeatmap,
      },
      weaknesses,
      recentInterviews,
      availableInterviews:
        interviews.slice(0, 5),
      availableCodingQuestions:
        codingQuestions.slice(0, 5),
    };

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= GET STUDENT INTERVIEWS =================
const getStudentInterviews = async (req, res) => {
  try {
    const InterviewTemplate = (await import("../models/interviewTemplate.model.js")).default;
    
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.max(1, Number(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    const filters = { status: "published" };

    if (req.query.search && req.query.search.trim()) {
      const regex = new RegExp(req.query.search.trim(), "i");
      filters.$or = [
        { title: regex },
        { description: regex },
        { tags: regex },
      ];
    }

    if (req.query.category && req.query.category !== "all") {
      filters.category = req.query.category;
    }

    if (req.query.difficulty && req.query.difficulty !== "all") {
      filters.difficulty = req.query.difficulty;
    }

    const [total, interviews] = await Promise.all([
      InterviewTemplate.countDocuments(filters),
      InterviewTemplate.find(filters)
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

    res.status(200).json({
      success: true,
      data: interviews,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= GET STUDENT CODING QUESTIONS =================
const getStudentCodingQuestions = async (req, res) => {
  try {
    const CodingQuestion = (await import("../models/codingQuestion.model.js")).default;
    
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.max(1, Number(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    const filters = { status: "published" };

    if (req.query.search && req.query.search.trim()) {
      const regex = new RegExp(req.query.search.trim(), "i");
      filters.$or = [
        { title: regex },
        { description: regex },
        { tags: regex },
        { companies: regex },
      ];
    }

    if (req.query.category && req.query.category !== "all") {
      filters.category = req.query.category;
    }

    if (req.query.difficulty && req.query.difficulty !== "all") {
      filters.difficulty = req.query.difficulty;
    }

    const [total, questions] = await Promise.all([
      CodingQuestion.countDocuments(filters),
      CodingQuestion.find(filters)
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

    res.status(200).json({
      success: true,
      data: questions,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
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
  loginUser,
  getMe,
  refreshAccessToken,
  logoutUser,
  forgotPassword,
  resetPassword,
  verifyOTP,
  resendOTP,
  googleAuthSuccess,
  studentDashboard,
  getStudentInterviews,
  getStudentCodingQuestions,
};
