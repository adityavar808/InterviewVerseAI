import express from "express";
import passport from "../config/passport.js";

import {
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
} from "../controllers/auth.controller.js";

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