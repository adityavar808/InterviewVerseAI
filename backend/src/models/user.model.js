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
