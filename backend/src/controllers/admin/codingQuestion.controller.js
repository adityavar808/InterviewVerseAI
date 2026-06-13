import CodingQuestion from "../../models/codingQuestion.model.js";

import {
  DEFAULT_PAGE_SIZE,
  buildPaginationMeta,
  buildRegex,
  sanitizeCodingQuestion,
  toArray,
} from "../../utils/adminHelpers.js";

const getCodingQuestions = async (
  req,
  res,
) => {
  try {
    const page = Math.max(
      1,
      Number(req.query.page) || 1,
    );
    const limit = Math.max(
      1,
      Number(req.query.limit) ||
        DEFAULT_PAGE_SIZE,
    );
    const skip = (page - 1) * limit;

    const filters = {};

    if (
      req.query.search &&
      req.query.search.trim()
    ) {
      const regex = buildRegex(
        req.query.search,
      );

      filters.$or = [
        { title: regex },
        { description: regex },
        { tags: regex },
        { companies: regex },
      ];
    }

    if (
      req.query.status &&
      req.query.status !== "all"
    ) {
      filters.status = req.query.status;
    }

    if (
      req.query.category &&
      req.query.category !== "all"
    ) {
      filters.category =
        req.query.category;
    }

    if (
      req.query.difficulty &&
      req.query.difficulty !== "all"
    ) {
      filters.difficulty =
        req.query.difficulty;
    }

    const [total, questions] =
      await Promise.all([
        CodingQuestion.countDocuments(
          filters,
        ),
        CodingQuestion.find(filters)
          .sort({ updatedAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
      ]);

    return res.status(200).json({
      success: true,
      data: questions.map(
        sanitizeCodingQuestion,
      ),
      meta: buildPaginationMeta(
        page,
        limit,
        total,
      ),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getCodingQuestionById = async (
  req,
  res,
) => {
  try {
    const question =
      await CodingQuestion.findById(
        req.params.questionId,
      ).lean();

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Coding question not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: sanitizeCodingQuestion(question),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const createCodingQuestion = async (
  req,
  res,
) => {
  try {
    const {
      title,
      description,
      category,
      difficulty,
      status,
      acceptanceRate,
      tags,
      companies,
      constraints,
      starterCode,
    } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message:
          "Question title is required",
      });
    }

    const question =
      await CodingQuestion.create({
        title: title.trim(),
        description:
          description?.trim() || "",
        category,
        difficulty,
        status,
        acceptanceRate:
          Number(acceptanceRate) || 0,
        tags: toArray(tags),
        companies: toArray(companies),
        constraints:
          constraints?.trim() || "",
        starterCode:
          starterCode || "",
        createdBy: req.user._id,
        updatedBy: req.user._id,
      });

    return res.status(201).json({
      success: true,
      message:
        "Coding question created successfully",
      data: sanitizeCodingQuestion(
        question.toObject(),
      ),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateCodingQuestion = async (
  req,
  res,
) => {
  try {
    const question =
      await CodingQuestion.findById(
        req.params.questionId,
      );

    if (!question) {
      return res.status(404).json({
        success: false,
        message:
          "Coding question not found",
      });
    }

    [
      "title",
      "description",
      "category",
      "difficulty",
      "status",
      "constraints",
      "starterCode",
    ].forEach((field) => {
      if (
        req.body[field] !==
        undefined
      ) {
        question[field] =
          typeof req.body[field] ===
          "string"
            ? req.body[field].trim()
            : req.body[field];
      }
    });

    if (
      req.body.acceptanceRate !==
      undefined
    ) {
      question.acceptanceRate =
        Number(
          req.body.acceptanceRate,
        ) || 0;
    }

    if (req.body.tags !== undefined) {
      question.tags = toArray(
        req.body.tags,
      );
    }

    if (
      req.body.companies !==
      undefined
    ) {
      question.companies =
        toArray(req.body.companies);
    }

    question.updatedBy = req.user._id;

    await question.save();

    return res.status(200).json({
      success: true,
      message:
        "Coding question updated successfully",
      data: sanitizeCodingQuestion(
        question.toObject(),
      ),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteCodingQuestion = async (
  req,
  res,
) => {
  try {
    const question =
      await CodingQuestion.findById(
        req.params.questionId,
      );

    if (!question) {
      return res.status(404).json({
        success: false,
        message:
          "Coding question not found",
      });
    }

    await question.deleteOne();

    return res.status(200).json({
      success: true,
      message:
        "Coding question deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export {
  getCodingQuestions,
  getCodingQuestionById,
  createCodingQuestion,
  updateCodingQuestion,
  deleteCodingQuestion,
};
