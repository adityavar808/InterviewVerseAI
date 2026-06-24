import bcrypt from "bcryptjs";
import User from "../../models/user.model.js";

import {
  sanitizeUser,
  toArray,
} from "../../utils/adminHelpers.js";

const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user || user.role !== "student") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    // Handle partial notification settings update
    if (req.body.notificationSettings !== undefined && !req.body.name) {
      user.notificationSettings = {
        emailNotifications: req.body.notificationSettings.emailNotifications === undefined
          ? (user.notificationSettings?.emailNotifications ?? true)
          : !!req.body.notificationSettings.emailNotifications,
        interviewReminders: req.body.notificationSettings.interviewReminders === undefined
          ? (user.notificationSettings?.interviewReminders ?? true)
          : !!req.body.notificationSettings.interviewReminders,
        aiInsightsAlerts: req.body.notificationSettings.aiInsightsAlerts === undefined
          ? (user.notificationSettings?.aiInsightsAlerts ?? false)
          : !!req.body.notificationSettings.aiInsightsAlerts,
      };
      user.lastActiveAt = new Date();
      await user.save();
      return res.status(200).json({
        success: true,
        message: "Notification settings updated successfully",
        data: sanitizeUser(user.toObject()),
      });
    }

    // If notifications are passed along with a full profile update
    if (req.body.notificationSettings !== undefined) {
      user.notificationSettings = {
        emailNotifications: req.body.notificationSettings.emailNotifications === undefined
          ? (user.notificationSettings?.emailNotifications ?? true)
          : !!req.body.notificationSettings.emailNotifications,
        interviewReminders: req.body.notificationSettings.interviewReminders === undefined
          ? (user.notificationSettings?.interviewReminders ?? true)
          : !!req.body.notificationSettings.interviewReminders,
        aiInsightsAlerts: req.body.notificationSettings.aiInsightsAlerts === undefined
          ? (user.notificationSettings?.aiInsightsAlerts ?? false)
          : !!req.body.notificationSettings.aiInsightsAlerts,
      };
    }

    const name = `${req.body.name || ""}`.trim();
    const location = `${req.body.location || ""}`.trim();
    const bio = `${req.body.bio || ""}`.trim();
    const headline = `${req.body.headline || ""}`.trim();
    const profileImage =
      req.body.profileImage === undefined
        ? undefined
        : `${req.body.profileImage || ""}`.trim();
    const skills = toArray(req.body.skills);
    const githubUrl = `${req.body.githubUrl || ""}`.trim();
    const linkedinUrl = `${req.body.linkedinUrl || ""}`.trim();
    const portfolioUrl = `${req.body.portfolioUrl || ""}`.trim();
    const certifications = Array.isArray(req.body.certifications)
      ? req.body.certifications.map((item) => ({
          title: `${item.title || ""}`.trim(),
          issuer: `${item.issuer || ""}`.trim(),
          year: `${item.year || ""}`.trim(),
          description: `${item.description || ""}`.trim(),
          certificateId: `${item.certificateId || ""}`.trim(),
          issueDateStart: `${item.issueDateStart || ""}`.trim(),
          issueDateEnd: `${item.issueDateEnd || ""}`.trim(),
          fileUrl: `${item.fileUrl || ""}`.trim(),
          fileName: `${item.fileName || ""}`.trim(),
          fileType: `${item.fileType || ""}`.trim(),
        }))
      : `${req.body.certifications || ""}`
          .split(/\n+/)
          .map((item) => item.trim())
          .filter(Boolean)
          .map((entry) => {
            const parts = entry
              .split(/\s*\|\s*|\s*-\s*/)
              .map((part) => part.trim())
              .filter(Boolean);

            return {
              title: parts[0] || entry,
              issuer: parts[1] || "",
              year: parts[2] || "",
              description: "",
              certificateId: "",
              issueDateStart: "",
              issueDateEnd: "",
              fileUrl: "",
              fileName: "",
              fileType: "",
            };
          });

    if (!name || !location || !bio || skills.length === 0) {
      return res.status(400).json({
        success: false,
        message:
          "Name, location, bio, and at least one skill are required",
      });
    }

    user.name = name;
    user.location = location;
    user.bio = bio;
    user.headline = headline;
    user.skills = skills;
    user.githubUrl = githubUrl;
    user.linkedinUrl = linkedinUrl;
    user.portfolioUrl = portfolioUrl;
    user.certifications = certifications;

    if (profileImage !== undefined) {
      user.profileImage = profileImage;
    }

    user.profileSetupDone = true;
    user.lastActiveAt = new Date();

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile completed successfully",
      data: sanitizeUser(user.toObject()),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await user.deleteOne();

    res.clearCookie("refreshToken");

    return res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required",
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect current password",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export {
  updateProfile,
  deleteProfile,
  updatePassword,
};
