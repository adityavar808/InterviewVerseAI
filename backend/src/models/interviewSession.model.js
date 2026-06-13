import mongoose from "mongoose";

const interviewSessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    config: {
      role: { type: String, trim: true },
      difficulty: { type: String, trim: true },
      duration: { type: String, trim: true },
      language: { type: String, trim: true },
      experience: { type: String, trim: true },
      startTime: { type: Date, default: Date.now },
    },
    questions: {
      type: [
        {
          question: { type: String, trim: true },
          category: { type: String, trim: true },
          difficulty: { type: String, trim: true },
          type: { type: String, trim: true },
          tags: { type: [String], default: [] },
        },
      ],
      default: [],
    },
    responses: {
      type: [
        {
          questionIndex: { type: Number },
          answer: { type: String, trim: true },
          score: { type: Number, default: 0 },
          communication: { type: Number, default: 0 },
          technical: { type: Number, default: 0 },
          confidence: { type: Number, default: 0 },
          feedback: { type: String, default: "" },
          createdAt: { type: Date, default: Date.now },
        },
      ],
      default: [],
    },
    status: {
      type: String,
      enum: ["in_progress", "completed", "abandoned"],
      default: "in_progress",
    },
    averageScore: {
      type: Number,
      default: 0,
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

const InterviewSession = mongoose.model("InterviewSession", interviewSessionSchema);

export default InterviewSession;
