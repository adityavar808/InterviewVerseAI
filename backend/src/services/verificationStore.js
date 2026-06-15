import mongoose from "mongoose";
import User from "../models/user.model.js";
import PendingUser from "../models/pendingUser.model.js";

const MEMORY_STORE_KEY = "__interviewverseVerificationStore";

const getStore = () => {
  if (!globalThis[MEMORY_STORE_KEY]) {
    globalThis[MEMORY_STORE_KEY] = {
      pendingUsers: new Map(),
      verifiedUsers: new Map(),
    };
  }

  return globalThis[MEMORY_STORE_KEY];
};

const normalizeEmail = (email) => `${email || ""}`.trim().toLowerCase();

const isDatabaseAvailable = () => mongoose.connection.readyState === 1;

export const findUserByEmail = async (email) => {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail) {
    return null;
  }

  if (isDatabaseAvailable()) {
    try {
      return await User.findOne({ email: normalizedEmail });
    } catch (error) {
      console.warn("[otp] Falling back to memory user lookup:", error.message);
    }
  }

  return getStore().verifiedUsers.get(normalizedEmail) || null;
};

export const createVerifiedUser = async ({ name, email, password, profileSetupDone = false }) => {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail || !password) {
    throw new Error("Email and password are required for verification");
  }

  if (isDatabaseAvailable()) {
    try {
      const createdUser = await User.create({
        name: `${name || "User"}`.trim(),
        email: normalizedEmail,
        password,
        isVerified: true,
        profileSetupDone,
      });

      return createdUser;
    } catch (error) {
      console.warn("[otp] Falling back to memory user creation:", error.message);
    }
  }

  const userRecord = {
    name: `${name || "User"}`.trim(),
    email: normalizedEmail,
    password,
    isVerified: true,
    profileSetupDone,
  };

  getStore().verifiedUsers.set(normalizedEmail, userRecord);
  return userRecord;
};

export const savePendingUser = async ({ name, email, password, otp, otpExpiry }) => {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail || !password || !otp) {
    throw new Error("Email, password, and otp are required for pending verification");
  }

  if (isDatabaseAvailable()) {
    try {
      await PendingUser.deleteMany({ email: normalizedEmail });
      return await PendingUser.create({
        name: `${name || "User"}`.trim(),
        email: normalizedEmail,
        password,
        otp,
        otpExpiry,
      });
    } catch (error) {
      console.warn("[otp] Falling back to memory pending-user storage:", error.message);
    }
  }

  const pendingUser = {
    name: `${name || "User"}`.trim(),
    email: normalizedEmail,
    password,
    otp,
    otpExpiry,
  };

  getStore().pendingUsers.set(normalizedEmail, pendingUser);
  return pendingUser;
};

export const findPendingUser = async ({ email, otp }) => {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail) {
    return null;
  }

  if (isDatabaseAvailable()) {
    try {
      return await PendingUser.findOne({
        email: normalizedEmail,
        ...(otp ? { otp } : {}),
        otpExpiry: { $gt: Date.now() },
      });
    } catch (error) {
      console.warn("[otp] Falling back to memory pending-user lookup:", error.message);
    }
  }

  const pendingUser = getStore().pendingUsers.get(normalizedEmail);

  if (!pendingUser) {
    return null;
  }

  if (otp && pendingUser.otp !== otp) {
    return null;
  }

  if (pendingUser.otpExpiry <= Date.now()) {
    getStore().pendingUsers.delete(normalizedEmail);
    return null;
  }

  return pendingUser;
};

export const deletePendingUser = async (email) => {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail) {
    return;
  }

  if (isDatabaseAvailable()) {
    try {
      await PendingUser.deleteOne({ email: normalizedEmail });
      return;
    } catch (error) {
      console.warn("[otp] Falling back to memory pending-user deletion:", error.message);
    }
  }

  getStore().pendingUsers.delete(normalizedEmail);
};
