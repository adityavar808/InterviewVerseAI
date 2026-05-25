import mongoose from "mongoose";

const platformSettingSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      default: "default",
      unique: true,
      trim: true,
    },

    platformName: {
      type: String,
      default: "InterviewVerse AI",
      trim: true,
    },

    supportEmail: {
      type: String,
      default: "support@interviewverse.ai",
      trim: true,
      lowercase: true,
    },

    maintenanceMode: {
      type: Boolean,
      default: false,
    },

    allowRegistrations: {
      type: Boolean,
      default: true,
    },

    allowGoogleAuth: {
      type: Boolean,
      default: true,
    },

    dailyAiCreditLimit: {
      type: Number,
      min: 0,
      default: 50,
    },

    defaultInterviewDuration: {
      type: Number,
      min: 10,
      default: 30,
    },

    defaultInterviewDifficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Intermediate",
    },

    maxCodingQuestionsPerDay: {
      type: Number,
      min: 1,
      default: 5,
    },

    sessionTimeoutMinutes: {
      type: Number,
      min: 15,
      default: 60,
    },

    announcementBanner: {
      type: String,
      default: "",
      trim: true,
    },

    onboardingMessage: {
      type: String,
      default: "Welcome to InterviewVerse AI.",
      trim: true,
    },

    docsUrl: {
      type: String,
      default: "",
      trim: true,
    },

    statusPageUrl: {
      type: String,
      default: "",
      trim: true,
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

const PlatformSetting = mongoose.model(
  "PlatformSetting",
  platformSettingSchema,
);

export default PlatformSetting;
