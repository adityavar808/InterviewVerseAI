import express from "express";

import protect from "../middleware/auth.middleware.js";
import requireProfileSetup from "../middleware/profile.middleware.js";

import {
  getCodingQuestions,
} from "../controllers/admin.controller.js";

import {
  submitCodingQuestion,
  runCodingQuestion,
  analyzeResume,
  getStudentCodingQuestionById,
} from "../controllers/auth/student.controller.js";

const router = express.Router();

router.use(protect);
router.use(requireProfileSetup);

router.get(
  "/coding-questions",
  getCodingQuestions,
);

router.get(
  "/coding-questions/:questionId",
  getStudentCodingQuestionById,
);

router.post(
  "/coding-questions/:questionId/run",
  runCodingQuestion
);

router.post(
  "/coding-questions/:questionId/submit",
  submitCodingQuestion
);

router.post(
  "/resume/analyze",
  analyzeResume
);

export default router;
