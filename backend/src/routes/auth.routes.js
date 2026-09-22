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

router.post("/reset-password/:token", resetPassword);
router.put("/reset-password/:token", resetPassword);


// ================= GOOGLE AUTH =================

// Start Google Login
router.get(
    "/google",
    (req, res, next) => {
        const state = req.query.platform || "web";
        passport.authenticate("google", {
            scope: ["profile", "email"],
            state: state,
        })(req, res, next);
    }
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

router.get("/oauth-success-info", (req, res) => {
    const token = req.query.token || "";
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>OAuth Success</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {
                    background-color: #080B10;
                    color: #F9FAFB;
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 100vh;
                    margin: 0;
                    padding: 24px;
                    box-sizing: border-box;
                }
                .card {
                    background-color: #121620;
                    border: 1px solid rgba(249, 250, 251, 0.08);
                    border-radius: 24px;
                    padding: 32px;
                    width: 100%;
                    max-width: 400px;
                    text-align: center;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.3);
                }
                .icon {
                    font-size: 48px;
                    color: #10B981;
                    margin-bottom: 16px;
                }
                h1 {
                    font-size: 22px;
                    margin-top: 0;
                    margin-bottom: 8px;
                    font-weight: 700;
                }
                p {
                    color: #9CA3AF;
                    font-size: 13px;
                    line-height: 1.5;
                    margin-bottom: 24px;
                }
                .token-box {
                    background-color: #080B10;
                    border: 1px solid rgba(249, 250, 251, 0.08);
                    border-radius: 12px;
                    padding: 12px;
                    font-family: monospace;
                    font-size: 12px;
                    color: #6366F1;
                    word-break: break-all;
                    margin-bottom: 24px;
                    max-height: 100px;
                    overflow-y: auto;
                    user-select: all;
                }
                .btn {
                    background-color: #6366F1;
                    color: white;
                    border: none;
                    border-radius: 12px;
                    padding: 12px 24px;
                    font-weight: 600;
                    font-size: 14px;
                    cursor: pointer;
                    width: 100%;
                    transition: background-color 0.2s;
                }
                .btn:hover {
                    background-color: #4F46E5;
                }
                .toast {
                    position: fixed;
                    bottom: 24px;
                    background-color: #10B981;
                    color: white;
                    padding: 8px 16px;
                    border-radius: 8px;
                    font-size: 12px;
                    font-weight: 600;
                    opacity: 0;
                    transition: opacity 0.3s;
                }
            </style>
        </head>
        <body>
            <div class="card">
                <div class="icon">✓</div>
                <h1>Login Successful</h1>
                <p>Google authentication was completed successfully. Copy the authorization token below and paste it back in the app to continue.</p>
                <div class="token-box" id="token">${token}</div>
                <button class="btn" onclick="copyToken()">Copy Token</button>
            </div>
            <div class="toast" id="toast">Token copied to clipboard!</div>
            <script>
                function copyToken() {
                    const tokenText = document.getElementById('token').innerText;
                    navigator.clipboard.writeText(tokenText).then(() => {
                        const toast = document.getElementById('toast');
                        toast.style.opacity = '1';
                        setTimeout(() => {
                            toast.style.opacity = '0';
                        }, 2000);
                    });
                }
            </script>
        </body>
        </html>
    `);
});

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
