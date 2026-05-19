import mongoose from "mongoose";

const pendingUserSchema =
  new mongoose.Schema(

    {
      name: String,

      email: {
        type: String,
        unique: true,
      },

      password: String,

      otp: String,

      otpExpiry: Date,
    },

    {
      timestamps: true,
    }
  );

// Auto delete after 2 days

pendingUserSchema.index(
  {
    createdAt: 1,
  },

  {
    expireAfterSeconds:
      2 * 24 * 60 * 60,
  }
);

const PendingUser =
  mongoose.model(
    "PendingUser",
    pendingUserSchema
  );

export default PendingUser;