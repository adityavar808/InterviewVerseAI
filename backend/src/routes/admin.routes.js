import express from "express";

import protect from "../middleware/auth.middleware.js";
import authorizeRoles from "../middleware/role.middleware.js";
import {
  adminDashboard,
  getReports,
} from "../controllers/admin/dashboard.controller.js";
import {
  getUsers,
  createUser,
  updateUser,
  updateUserStatus,
  deleteUser,
} from "../controllers/admin/user.controller.js";
import {
  getInterviews,
  createInterview,
  updateInterview,
  deleteInterview,
} from "../controllers/admin/interview.controller.js";
import {
  getCodingQuestions,
  getCodingQuestionById,
  createCodingQuestion,
  updateCodingQuestion,
  deleteCodingQuestion,
} from "../controllers/admin/codingQuestion.controller.js";
import {
  getSettings,
  updateSettings,
} from "../controllers/admin/settings.controller.js";
import {
  loginAdmin,
  verifyAdminLogin2FA,
  refreshAdminToken,
  logoutAdmin,
  getAdminMe,
} from "../controllers/admin/auth.controller.js";

const router = express.Router();

router.post("/login", loginAdmin);
router.post("/login-2fa", verifyAdminLogin2FA);
router.get(
  "/refresh-token",
  refreshAdminToken,
);
router.post("/logout", logoutAdmin);

router.use(
  protect,
  authorizeRoles("admin"),
);

router.get("/me", getAdminMe);
router.get("/dashboard", adminDashboard);

router
  .route("/users")
  .get(getUsers)
  .post(createUser);

router
  .route("/users/:userId")
  .put(updateUser)
  .delete(deleteUser);

router.patch(
  "/users/:userId/status",
  updateUserStatus,
);

router
  .route("/interviews")
  .get(getInterviews)
  .post(createInterview);

router
  .route("/interviews/:interviewId")
  .put(updateInterview)
  .delete(deleteInterview);

router
  .route("/coding-questions")
  .get(getCodingQuestions)
  .post(createCodingQuestion);

router
  .route("/coding-questions/:questionId")
  .get(getCodingQuestionById)
  .put(updateCodingQuestion)
  .delete(deleteCodingQuestion);

router.get("/reports", getReports);

router
  .route("/settings")
  .get(getSettings)
  .put(updateSettings);

export default router;
