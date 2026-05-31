import express from "express";

import protect from "../middleware/auth.middleware.js";

import {
  getCodingQuestions,
  getCodingQuestionById,
} from "../controllers/admin.controller.js";

const router = express.Router();

router.use(protect);

router.get(
  "/coding-questions",
  getCodingQuestions,
);

router.get(
  "/coding-questions/:questionId",
  getCodingQuestionById,
);

export default router;