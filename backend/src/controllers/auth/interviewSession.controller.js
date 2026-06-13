import User from "../../models/user.model.js";
import InterviewSession from "../../models/interviewSession.model.js";

import {
  generateInterviewQuestions,
  evaluateAnswer,
} from "../../services/aiPython.service.js";

const startAIInterview = async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const { role, difficulty, duration, language, experience } = req.body;

    if (!role || !difficulty || !duration || !language || !experience) {
      return res.status(400).json({
        success: false,
        message: "Missing interview configuration values",
      });
    }

    const questions = await generateInterviewQuestions({
      role,
      difficulty,
      duration,
      language,
      experience,
    });

    const session = await InterviewSession.create({
      user: req.user._id,
      config: {
        role,
        difficulty,
        duration,
        language,
        experience,
        startTime: new Date(),
      },
      questions:
        questions.length > 0
          ? questions
          : [
            {
              question: `Describe your experience as a ${role} and how you would approach a ${difficulty} interview scenario.`,
              category: "General",
              difficulty,
              type: "Open-ended",
              tags: [role],
            },
          ],
    });

    return res.status(201).json({
      success: true,
      data: {
        sessionId: session._id,
        questions: session.questions,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const submitInterviewResponse = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { questionIndex, answer } = req.body;

    const session = await InterviewSession.findById(sessionId);

    if (!session || session.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({
        success: false,
        message: "Interview session not found",
      });
    }

    if (session.status !== "in_progress") {
      return res.status(400).json({
        success: false,
        message: "Interview session is no longer active",
      });
    }

    if (questionIndex === undefined || answer === undefined) {
      return res.status(400).json({
        success: false,
        message: "questionIndex and answer are required",
      });
    }

    const question = session.questions[questionIndex];

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Interview question not found",
      });
    }

    const evaluation = await evaluateAnswer({
      question: question.question,
      answer,
      role: session.config.role,
      difficulty: session.config.difficulty,
      language: session.config.language,
      experience: session.config.experience,
    });

    session.responses.push({
      questionIndex,
      answer,
      score: evaluation.score,
      communication: evaluation.communication,
      technical: evaluation.technical,
      confidence: evaluation.confidence,
      feedback: evaluation.feedback,
      createdAt: new Date(),
    });

    session.averageScore =
      session.responses.reduce((sum, item) => sum + item.score, 0) /
      Math.max(1, session.responses.length);

    await session.save();

    return res.status(200).json({
      success: true,
      data: evaluation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getInterviewSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await InterviewSession.findById(sessionId).lean();

    if (!session || session.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({
        success: false,
        message: "Interview session not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: session,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const endInterviewSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await InterviewSession.findById(sessionId);

    if (!session || session.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({
        success: false,
        message: "Interview session not found",
      });
    }

    if (session.status !== "in_progress") {
      return res.status(400).json({
        success: false,
        message: "Interview session has already ended",
      });
    }

    session.status = "completed";
    session.completedAt = new Date();
    session.averageScore =
      session.responses.length > 0
        ? session.responses.reduce((sum, item) => sum + item.score, 0) / session.responses.length
        : 0;

    await session.save();

    const user = await User.findById(req.user._id);

    if (user) {
      user.interviewHistory.unshift({
        sessionId: session._id,
        title: `${session.config.role} Interview`,
        role: session.config.role,
        score: Math.round(session.averageScore),
        duration: session.config.duration,
        status: "Completed",
        difficulty: session.config.difficulty,
        tags: session.questions.flatMap((q) => q.tags || []),
        tech: session.questions.flatMap((q) => q.tags || []),
        notes: session.responses.map((r) => r.feedback).join(" \n"),
        completedAt: session.completedAt,
      });
      await user.save();
    }

    return res.status(200).json({
      success: true,
      data: {
        sessionId: session._id,
        averageScore: Math.round(session.averageScore),
        completedAt: session.completedAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export {
  startAIInterview,
  submitInterviewResponse,
  getInterviewSession,
  endInterviewSession,
};
