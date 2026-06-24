import express from "express";
import passport from "../config/passport.js";
import getFrontendUrl from "../utils/frontendUrl.js";

import {
  refreshAccessToken,
  loginUser,
  logoutUser,
  getMe,
  googleAuthSuccess,
} from "../controllers/auth/login.controller.js";
import {
  setup2FA,
  verify2FA,
  disable2FA,
  verifyLogin2FA,
} from "../controllers/auth/twoFactor.controller.js";
import {
  updateProfile,
  deleteProfile,
  updatePassword,
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
router.get("/login", (req, res) => {
  res.redirect(`${getFrontendUrl()}/login`);
});

router.get("/register", (req, res) => {
  res.redirect(`${getFrontendUrl()}/register`);
});

router.post("/register", registerUser);

router.post("/login", loginUser);
router.post("/login-2fa", verifyLogin2FA);

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

    (req, res, next) => {
        passport.authenticate("google", {
            session: false,
        }, (error, user, info) => {
            if (error) {
                return res.redirect(
                    `${getFrontendUrl()}/login?error=${encodeURIComponent("Google sign-in failed")}`
                );
            }

            if (!user) {
                const message =
                    info?.message ||
                    "Google sign-in failed";

                if (
                    message ===
                    "Your account has been suspended"
                ) {
                    res.clearCookie(
                        "refreshToken"
                    );
                }

                return res.redirect(
                    `${getFrontendUrl()}/login?error=${encodeURIComponent(message)}`
                );
            }

            req.user = user;

            return googleAuthSuccess(
                req,
                res,
                next
            );
        })(req, res, next);
    }
);

router.use(protect);

router.get("/me", getMe);
router.put("/me", updateProfile);
router.put("/update-password", updatePassword);
router.delete("/me", deleteProfile);

router.post("/2fa/setup", setup2FA);
router.post("/2fa/verify", verify2FA);
router.post("/2fa/disable", disable2FA);

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
