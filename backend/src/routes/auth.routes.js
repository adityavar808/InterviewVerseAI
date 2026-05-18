import express from "express";

import {
    registerUser,
    loginUser,
    getMe,
    refreshAccessToken,
    logoutUser,
} from "../controllers/auth.controller.js";

import protect from "../middleware/auth.middleware.js";

const router = express.Router();


// Public Routes
router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/refresh-token", refreshAccessToken);

router.post("/logout", logoutUser);


// Protected Route
router.get("/me", protect, getMe);


export default router;