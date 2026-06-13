import InterviewTemplate from "../../models/interviewTemplate.model.js";

import {
  DEFAULT_PAGE_SIZE,
  buildPaginationMeta,
  buildRegex,
  sanitizeInterviewTemplate,
  toArray,
} from "../../utils/adminHelpers.js";

const getInterviews = async (
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

    const [total, interviews] =
      await Promise.all([
        InterviewTemplate.countDocuments(
          filters,
        ),
        InterviewTemplate.find(filters)
          .sort({ updatedAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
      ]);

    return res.status(200).json({
      success: true,
      data: interviews.map(
        sanitizeInterviewTemplate,
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

const createInterview = async (
  req,
  res,
) => {
  try {
    const {
      title,
      description,
      category,
      difficulty,
      durationMinutes,
      questionCount,
      status,
      tags,
    } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message:
          "Interview title is required",
      });
    }

    const template =
      await InterviewTemplate.create({
        title: title.trim(),
        description:
          description?.trim() || "",
        category,
        difficulty,
        durationMinutes,
        questionCount,
        status,
        tags: toArray(tags),
        createdBy: req.user._id,
        updatedBy: req.user._id,
      });

    return res.status(201).json({
      success: true,
      message:
        "Interview template created successfully",
      data: sanitizeInterviewTemplate(
        template.toObject(),
      ),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateInterview = async (
  req,
  res,
) => {
  try {
    const template =
      await InterviewTemplate.findById(
        req.params.interviewId,
      );

    if (!template) {
      return res.status(404).json({
        success: false,
        message:
          "Interview template not found",
      });
    }

    [
      "title",
      "description",
      "category",
      "difficulty",
      "status",
    ].forEach((field) => {
      if (
        req.body[field] !==
        undefined
      ) {
        template[field] =
          typeof req.body[field] ===
          "string"
            ? req.body[field].trim()
            : req.body[field];
      }
    });

    if (
      req.body.durationMinutes !==
      undefined
    ) {
      template.durationMinutes =
        Number(
          req.body.durationMinutes,
        );
    }

    if (
      req.body.questionCount !==
      undefined
    ) {
      template.questionCount =
        Number(
          req.body.questionCount,
        );
    }

    if (req.body.tags !== undefined) {
      template.tags = toArray(
        req.body.tags,
      );
    }

    template.updatedBy = req.user._id;

    await template.save();

    return res.status(200).json({
      success: true,
      message:
        "Interview template updated successfully",
      data: sanitizeInterviewTemplate(
        template.toObject(),
      ),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteInterview = async (
  req,
  res,
) => {
  try {
    const template =
      await InterviewTemplate.findById(
        req.params.interviewId,
      );

    if (!template) {
      return res.status(404).json({
        success: false,
        message:
          "Interview template not found",
      });
    }

    await template.deleteOne();

    return res.status(200).json({
      success: true,
      message:
        "Interview template deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export {
  getInterviews,
  createInterview,
  updateInterview,
  deleteInterview,
};
