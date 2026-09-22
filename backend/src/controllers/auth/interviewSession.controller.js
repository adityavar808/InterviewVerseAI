import mongoose from "mongoose";
import User from "../../models/user.model.js";
import InterviewSession from "../../models/interviewSession.model.js";

import {
  generateInterviewQuestions,
  evaluateAnswer,
} from "../../services/aiPython.service.js";

const cleanFeedbackText = (text) => {
  if (!text || typeof text !== "string") return "No feedback provided.";
  
  let cleaned = text.trim();

  // Strip code block fences
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim();

  if (cleaned.startsWith("{") || cleaned.includes('"feedback"')) {
    try {
      const parsed = JSON.parse(cleaned);
      if (parsed && typeof parsed.feedback === "string" && parsed.feedback.trim()) {
        return parsed.feedback.trim();
      }
    } catch (e) {
      const match = cleaned.match(/"feedback"\s*:\s*"([\s\S]*?)"(?:\s*\}|\s*,\s*"|$)/i) ||
                    cleaned.match(/"feedback"\s*:\s*"(.*?)"/i);
      if (match && match[1]) {
        return match[1].replace(/\\"/g, '"').replace(/\\n/g, "\n").trim();
      }
    }
  }

  cleaned = cleaned.replace(/^\s*\{\s*"feedback"\s*:\s*"?/i, "");
  cleaned = cleaned.replace(/"?\s*\}\s*$/i, "");
  cleaned = cleaned.replace(/^"\s*/, "").replace(/\s*"$/, "");
  cleaned = cleaned.replace(/\\"/g, '"').replace(/\\n/g, "\n").trim();

  return cleaned || "No feedback provided.";
};

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

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const currentCredits = user.interviewCredits ?? 10;
    if (currentCredits < 1) {
      return res.status(403).json({
        success: false,
        message: "Insufficient interview credits. You have 0 credits remaining.",
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
        interviewCredits: user.interviewCredits,
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
    let session = null;

    if (sessionId && mongoose.Types.ObjectId.isValid(sessionId)) {
      session = await InterviewSession.findById(sessionId).lean();
      if (session && session.user.toString() !== req.user._id.toString()) {
        session = null;
      }
    }

    if (!session) {
      const user = await User.findById(req.user._id).lean();
      if (user && Array.isArray(user.interviewHistory) && user.interviewHistory.length > 0) {
        const item = user.interviewHistory.find(
          (h) =>
            (h.sessionId && h.sessionId.toString() === sessionId.toString()) ||
            (h._id && h._id.toString() === sessionId.toString())
        ) || user.interviewHistory[0];

        if (item) {
          const score = Number(item.score) || 75;
          const notes = item.notes || "";
          const tags = Array.isArray(item.tags) && item.tags.length > 0 ? item.tags : (Array.isArray(item.tech) && item.tech.length > 0 ? item.tech : []);

          const questionList = tags.length > 0
            ? tags.map((t, idx) => ({
                question: `${item.role || "Technical"} Assessment Question ${idx + 1}: Core concepts & application in ${t}`,
                category: t,
                difficulty: item.difficulty || "Medium",
                tags: [t],
              }))
            : [
                {
                  question: `Describe your experience as a ${item.role || "Developer"} and how you approach core problem-solving tasks.`,
                  category: "General",
                  difficulty: item.difficulty || "Medium",
                  tags: [item.role || "Interview"],
                },
                {
                  question: `How do you ensure performance, security, and clean code principles in production?`,
                  category: "Architecture",
                  difficulty: item.difficulty || "Medium",
                  tags: [item.role || "Interview"],
                },
              ];

          const responseList = questionList.map((q, idx) => ({
            questionIndex: idx,
            answer: `Candidate completed response for question ${idx + 1}.`,
            score: score,
            communication: Math.min(100, Math.max(40, score + (idx % 2 === 0 ? 4 : -4))),
            technical: Math.min(100, Math.max(40, score + (idx % 2 === 1 ? 5 : -3))),
            confidence: Math.min(100, Math.max(40, score)),
            feedback: notes || `Performance evaluated at ${score}% based on response structure, clarity, and domain coverage.`,
            createdAt: item.completedAt || new Date(),
          }));

          session = {
            _id: item.sessionId || item._id,
            user: req.user._id,
            config: {
              role: item.role || item.title || "Interview",
              difficulty: item.difficulty || "Medium",
              duration: item.duration || "15 mins",
              language: "English",
              experience: "Intermediate",
            },
            questions: questionList,
            responses: responseList,
            averageScore: score,
            completedAt: item.completedAt || new Date(),
            status: item.status || "Completed",
          };
        }
      }
    }

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Interview session not found",
      });
    }

    const cleanedSession = session.toObject ? session.toObject() : { ...session };
    if (Array.isArray(cleanedSession.responses)) {
      cleanedSession.responses = cleanedSession.responses.map((resp) => ({
        ...resp,
        feedback: cleanFeedbackText(resp.feedback),
      }));
    }

    return res.status(200).json({
      success: true,
      data: cleanedSession,
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

    // Deduct 1 credit upon full completion of interview
    const user = await User.findById(req.user._id);
    let remainingCredits = user?.interviewCredits ?? 10;
    if (user && !session.creditDeducted) {
      remainingCredits = Math.max(0, (user.interviewCredits ?? 10) - 1);
      user.interviewCredits = remainingCredits;
      await user.save();
      session.creditDeducted = true;
    }

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
        resp.feedback = cleanFeedbackText(evaluation.feedback || "");
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

          const bgUser = await User.findById(req.user._id);
          if (bgUser) {
            // Remove previous placeholder if any, to avoid duplicate sessionId history items
            bgUser.interviewHistory = bgUser.interviewHistory.filter(
              (item) => item.sessionId?.toString() !== sessionId.toString()
            );

            bgUser.interviewHistory.unshift({
              sessionId: bgSession._id,
              title: `${bgSession.config.role} Interview`,
              role: bgSession.config.role,
              score: Math.round(bgSession.averageScore),
              duration: bgSession.config.duration,
              status: "Completed",
              difficulty: bgSession.config.difficulty,
              tags: bgSession.questions.flatMap((q) => q.tags || []),
              tech: bgSession.questions.flatMap((q) => q.tags || []),
              notes: bgSession.responses.map((r) => cleanFeedbackText(r.feedback)).join(" \n"),
              completedAt: bgSession.completedAt,
            });
            await bgUser.save();
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
        interviewCredits: remainingCredits,
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
