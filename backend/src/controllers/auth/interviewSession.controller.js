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

    session.responses.push({
      questionIndex,
      answer,
      score: 0,
      communication: 0,
      technical: 0,
      confidence: 0,
      feedback: "",
      createdAt: new Date(),
    });

    await session.save();

    return res.status(200).json({
      success: true,
      message: "Response saved successfully"
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

    // Set status to completed immediately and save to database
    session.status = "completed";
    session.completedAt = new Date();
    session.averageScore = 0;
    await session.save();

    // Setup background evaluation promises
    const evaluationPromises = session.responses.map(async (resp) => {
      const question = session.questions[resp.questionIndex];
      if (!question) return;

      try {
        const evaluation = await evaluateAnswer({
          question: question.question,
          answer: resp.answer,
          role: session.config.role,
          difficulty: session.config.difficulty,
          language: session.config.language,
          experience: session.config.experience,
        });

        resp.score = evaluation.score || 0;
        resp.communication = evaluation.communication || 0;
        resp.technical = evaluation.technical || 0;
        resp.confidence = evaluation.confidence || 0;
        resp.feedback = evaluation.feedback || "";
      } catch (e) {
        console.error(`Failed to evaluate response index ${resp.questionIndex}:`, e);
        resp.score = 70;
        resp.communication = 70;
        resp.technical = 70;
        resp.confidence = 70;
        resp.feedback = "Dynamic feedback was unavailable at this time.";
      }
    });

    // Run parallel AI evaluation in background (non-blocking)
    Promise.all(evaluationPromises)
      .then(async () => {
        const bgSession = await InterviewSession.findById(sessionId);
        if (bgSession) {
          bgSession.responses = session.responses;
          bgSession.averageScore =
            bgSession.responses.length > 0
              ? bgSession.responses.reduce((sum, item) => sum + item.score, 0) / bgSession.responses.length
              : 0;

          await bgSession.save();

          const user = await User.findById(req.user._id);
          if (user) {
            // Remove previous placeholder if any, to avoid duplicate sessionId history items
            user.interviewHistory = user.interviewHistory.filter(
              (item) => item.sessionId?.toString() !== sessionId.toString()
            );

            user.interviewHistory.unshift({
              sessionId: bgSession._id,
              title: `${bgSession.config.role} Interview`,
              role: bgSession.config.role,
              score: Math.round(bgSession.averageScore),
              duration: bgSession.config.duration,
              status: "Completed",
              difficulty: bgSession.config.difficulty,
              tags: bgSession.questions.flatMap((q) => q.tags || []),
              tech: bgSession.questions.flatMap((q) => q.tags || []),
              notes: bgSession.responses.map((r) => r.feedback).join(" \n"),
              completedAt: bgSession.completedAt,
            });
            await user.save();
          }
        }
      })
      .catch((err) => {
        console.error(`Background evaluation error for session ${sessionId}:`, err);
      });

    return res.status(200).json({
      success: true,
      data: {
        sessionId: session._id,
        averageScore: 0,
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
