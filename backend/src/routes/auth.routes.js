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
  updateProfile,
} from "../controllers/auth/profile.controller.js";
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
import requireProfileSetup from "../middleware/profile.middleware.js";

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

router.use(protect);

router.get("/me", getMe);
router.put("/me", updateProfile);

router.use(requireProfileSetup);

router.get("/dashboard", studentDashboard);

router.get("/interviews", getStudentInterviews);

router.post("/interview-session", startAIInterview);

router.get("/interview-session/:sessionId", getInterviewSession);
router.post("/interview-session/:sessionId/response", submitInterviewResponse);

router.post("/interview-session/:sessionId/end", endInterviewSession);

router.get("/interview-history", getInterviewHistory);

router.post("/interview-history", addInterviewHistory);

router.get("/coding-questions", getStudentCodingQuestions);

export default router;
