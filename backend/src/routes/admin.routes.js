import express from "express";

import protect from "../middleware/auth.middleware.js";

import authorizeRoles from "../middleware/role.middleware.js";

import {
    adminDashboard,
} from "../controllers/admin.controller.js";

const router = express.Router();


// Admin Protected Route
router.get(
    "/dashboard",
    protect,
    authorizeRoles("admin"),
    adminDashboard
);


export default router;