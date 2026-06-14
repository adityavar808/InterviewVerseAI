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

    const name = `${req.body.name || ""}`.trim();
    const location = `${req.body.location || ""}`.trim();
    const bio = `${req.body.bio || ""}`.trim();
    const headline = `${req.body.headline || ""}`.trim();
    const profileImage =
      req.body.profileImage === undefined
        ? undefined
        : `${req.body.profileImage || ""}`.trim();
    const skills = toArray(req.body.skills);

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

export {
  updateProfile,
};
