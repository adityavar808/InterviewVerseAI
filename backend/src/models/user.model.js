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
      enum: ["student", "admin"],
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

    streak: {
      type: Number,
      default: 0,
    },

    profileImage: {
      type: String,
      default: "",
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
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema);

export default User;
