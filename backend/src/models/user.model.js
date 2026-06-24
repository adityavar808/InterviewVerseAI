import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    role: {
      type: String,
      enum: ["student", "candidate", "recruiter", "admin"],
      default: "student",
    },

    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: function () {
        return this.isVerified ? "active" : "inactive";
      },
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    skills: {
      type: [String],
      default: [],
    },

    bio: {
      type: String,
      default: "",
      trim: true,
    },

    location: {
      type: String,
      default: "",
      trim: true,
    },

    headline: {
      type: String,
      default: "",
      trim: true,
    },

    profileSetupDone: {
      type: Boolean,
    },

    interviewHistory: {
      type: [
        {
          sessionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "InterviewSession",
          },
          title: { type: String, trim: true, default: "AI Interview" },
          role: { type: String, trim: true, default: "Interview" },
          score: { type: Number, default: 0 },
          duration: { type: String, default: "0 mins" },
          status: {
            type: String,
            enum: ["Completed", "In Progress", "Abandoned"],
            default: "Completed",
          },
          difficulty: {
            type: String,
            enum: ["Easy", "Medium", "Hard", "Advanced"],
            default: "Medium",
          },
          tags: {
            type: [String],
            default: [],
          },
          tech: {
            type: [String],
            default: [],
          },
          notes: {
            type: String,
            default: "",
          },
          completedAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      default: [],
    },

    solvedQuestions: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "CodingQuestion",
      default: [],
    },

    solvedQuestionsMeta: {
      type: [
        {
          questionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CodingQuestion",
          },
          code: { type: String, default: "" },
          language: { type: String, default: "" },
          timeComplexity: { type: String, default: "" },
          spaceComplexity: { type: String, default: "" },
          score: { type: Number, default: 0 },
          tips: { type: [String], default: [] },
          issues: { type: [String], default: [] },
          solvedAt: { type: Date, default: Date.now },
        },
      ],
      default: [],
    },

    resumeAnalysis: {
      atsScore: { type: Number, default: 0 },
      role: { type: String, default: "" },
      fileName: { type: String, default: "" },
      improvements: { type: [String], default: [] },
      analyzedAt: { type: Date },
    },

    streak: {
      type: Number,
      default: 0,
    },

    profileImage: {
      type: String,
      default: "",
    },

    githubUrl: {
      type: String,
      default: "",
      trim: true,
    },

    linkedinUrl: {
      type: String,
      default: "",
      trim: true,
    },

    portfolioUrl: {
      type: String,
      default: "",
      trim: true,
    },

    certifications: {
      type: [
        {
          title: { type: String, trim: true, default: "" },
          issuer: { type: String, trim: true, default: "" },
          year: { type: String, trim: true, default: "" },
          description: { type: String, trim: true, default: "" },
          certificateId: { type: String, trim: true, default: "" },
          issueDateStart: { type: String, trim: true, default: "" },
          issueDateEnd: { type: String, trim: true, default: "" },
          fileUrl: { type: String, default: "" },
          fileName: { type: String, trim: true, default: "" },
          fileType: { type: String, trim: true, default: "" },
        },
      ],
      default: [],
    },
    refreshToken: {
      type: String,
      default: "",
    },

    adminRefreshToken: {
      type: String,
      default: "",
    },

    lastLoginAt: {
      type: Date,
    },

    lastActiveAt: {
      type: Date,
    },

    otp: {
      type: String,
    },

    otpExpiry: {
      type: Date,
    },
    resetPasswordToken: {
      type: String,
    },

    resetPasswordExpire: {
      type: Date,
    },

    notificationSettings: {
      emailNotifications: {
        type: Boolean,
        default: true,
      },
      interviewReminders: {
        type: Boolean,
        default: true,
      },
      aiInsightsAlerts: {
        type: Boolean,
        default: false,
      },
    },

    twoFactorSecret: {
      type: String,
      default: "",
    },

    twoFactorTempSecret: {
      type: String,
      default: "",
    },

    isTwoFactorEnabled: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema);

export default User;
