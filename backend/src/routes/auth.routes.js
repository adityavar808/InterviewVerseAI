import express from "express";
import passport from "../config/passport.js";

import {
  refreshAccessToken,
  loginUser,
  logoutUser,
  getMe,
  googleAuthSuccess,
} from "../controllers/auth/login.controller.js";
import {
  registerUser,
  verifyOTP,
  resendOTP,
  forgotPassword,
  resetPassword,
} from "../controllers/auth/register.controller.js";
import {
  studentDashboard,
  getStudentInterviews,
  getInterviewHistory,
  addInterviewHistory,
  getStudentCodingQuestions,
} from "../controllers/auth/student.controller.js";
import {
  startAIInterview,
  submitInterviewResponse,
  endInterviewSession,
  getInterviewSession,
} from "../controllers/auth/interviewSession.controller.js";

import protect from "../middleware/auth.middleware.js";

const router = express.Router();

// Public Routes
router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/verify-otp", verifyOTP);

router.post("/resend-otp", resendOTP);

router.get("/refresh-token", refreshAccessToken);

router.post("/logout", logoutUser);

router.post("/forgot-password", forgotPassword);

router.put("/reset-password/:token", resetPassword);


// Protected Routes
router.get("/me", protect, getMe);

router.get("/dashboard", protect, studentDashboard);

router.get("/interviews", protect, getStudentInterviews);

router.post("/interview-session", protect, startAIInterview);

router.get("/interview-session/:sessionId", protect, getInterviewSession);
router.post("/interview-session/:sessionId/response", protect, submitInterviewResponse);

router.post("/interview-session/:sessionId/end", protect, endInterviewSession);

router.get("/interview-history", protect, getInterviewHistory);

router.post("/interview-history", protect, addInterviewHistory);

router.get("/coding-questions", protect, getStudentCodingQuestions);

// ================= GOOGLE AUTH =================

// Start Google Login
router.get(

    "/google",

    passport.authenticate("google", {
        scope: ["profile", "email"],
    })
);


// Google Callback
router.get(

    "/google/callback",

    passport.authenticate("google", {
        session: false,
    }),

    googleAuthSuccess
);

export default router;
