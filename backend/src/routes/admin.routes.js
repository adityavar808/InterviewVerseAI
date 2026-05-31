import express from "express";

import protect from "../middleware/auth.middleware.js";
import authorizeRoles from "../middleware/role.middleware.js";
import {
  loginAdmin,
  refreshAdminToken,
  logoutAdmin,
  getAdminMe,
  adminDashboard,
  getUsers,
  createUser,
  updateUser,
  updateUserStatus,
  deleteUser,
  getInterviews,
  createInterview,
  updateInterview,
  deleteInterview,
  getCodingQuestions,
  getCodingQuestionById,
  createCodingQuestion,
  updateCodingQuestion,
  deleteCodingQuestion,
  getReports,
  getSettings,
  updateSettings,
} from "../controllers/admin.controller.js";

const router = express.Router();

router.post("/login", loginAdmin);
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