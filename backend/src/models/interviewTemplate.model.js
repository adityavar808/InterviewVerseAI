import mongoose from "mongoose";

const interviewTemplateSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    category: {
      type: String,
      enum: [
        "Frontend",
        "Backend",
        "Full Stack",
        "HR",
        "System Design",
        "Data Structures",
      ],
      default: "Frontend",
    },

    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Intermediate",
    },

    durationMinutes: {
      type: Number,
      min: 10,
      default: 30,
    },

    questionCount: {
      type: Number,
      min: 1,
      default: 5,
    },

    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },

    tags: {
      type: [String],
      default: [],
    },

    usageCount: {
      type: Number,
      default: 0,
    },

    lastUsedAt: {
      type: Date,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

const InterviewTemplate = mongoose.model(
  "InterviewTemplate",
  interviewTemplateSchema,
);

export default InterviewTemplate;
