import bcrypt from "bcryptjs";

import User from "../../models/user.model.js";

import {
  ADMIN_USER_FIELDS,
  DEFAULT_PAGE_SIZE,
  buildPaginationMeta,
  buildRegex,
  sanitizeUser,
  toArray,
} from "../../utils/adminHelpers.js";

const getUsers = async (req, res) => {
  try {
    const page = Math.max(
      1,
      Number(req.query.page) || 1,
    );
    const limit = Math.max(
      1,
      Number(req.query.limit) ||
        DEFAULT_PAGE_SIZE,
    );
    const skip = (page - 1) * limit;

    const filters = {};

    if (
      req.query.search &&
      req.query.search.trim()
    ) {
      filters.$or = [
        {
          name: buildRegex(
            req.query.search,
          ),
        },
        {
          email: buildRegex(
            req.query.search,
          ),
        },
      ];
    }

    if (
      req.query.role &&
      req.query.role !== "all"
    ) {
      filters.role = req.query.role;
    }

    if (
      req.query.status &&
      req.query.status !== "all"
    ) {
      filters.status = req.query.status;
    }

    const [total, users] =
      await Promise.all([
        User.countDocuments(filters),
        User.find(filters)
          .select(ADMIN_USER_FIELDS)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
      ]);

    return res.status(200).json({
      success: true,
      data: users.map(sanitizeUser),
      meta: buildPaginationMeta(
        page,
        limit,
        total,
      ),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const createUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role = "student",
      status = "active",
      skills = [],
      isVerified = true,
    } = req.body;

    if (
      !name ||
      !email ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email, and password are required",
      });
    }

    const existingUser =
      await User.findOne({
        email: email.toLowerCase(),
      });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message:
          "A user with this email already exists",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      status,
      skills: toArray(skills),
      isVerified:
        Boolean(isVerified),
      profileSetupDone: false,
    });

    return res.status(201).json({
      success: true,
      message:
        "User created successfully",
      data: sanitizeUser(
        user.toObject(),
      ),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await User.findById(
      req.params.userId,
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (
      req.user._id.toString() ===
        user._id.toString() &&
      req.body.role &&
      req.body.role !== "admin"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "You cannot remove your own admin access",
      });
    }

    if (
      req.body.email &&
      req.body.email.toLowerCase() !==
        user.email
    ) {
      const existingUser =
        await User.findOne({
          email:
            req.body.email.toLowerCase(),
        });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message:
            "Another user already uses this email",
        });
      }

      user.email =
        req.body.email.toLowerCase();
    }

    if (req.body.name) {
      user.name = req.body.name.trim();
    }

    if (req.body.password) {
      user.password =
        await bcrypt.hash(
          req.body.password,
          10,
        );
    }

    if (req.body.role) {
      user.role = req.body.role;
    }

    if (req.body.status) {
      if (
        req.user._id.toString() ===
          user._id.toString() &&
        req.body.status ===
          "suspended"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "You cannot suspend your own account",
        });
      }

      user.status = req.body.status;
    }

    if (req.body.skills) {
      user.skills = toArray(
        req.body.skills,
      );
    }

    if (req.body.profileSetupDone !== undefined) {
      user.profileSetupDone = Boolean(req.body.profileSetupDone);
    }

    if (
      req.body.isVerified !==
      undefined
    ) {
      user.isVerified = Boolean(
        req.body.isVerified,
      );
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message:
        "User updated successfully",
      data: sanitizeUser(
        user.toObject(),
      ),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateUserStatus = async (
  req,
  res,
) => {
  try {
    const { status } = req.body;
    const user = await User.findById(
      req.params.userId,
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (
      req.user._id.toString() ===
        user._id.toString() &&
      status === "suspended"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "You cannot suspend your own account",
      });
    }

    user.status = status;
    await user.save();

    return res.status(200).json({
      success: true,
      message:
        "User status updated successfully",
      data: sanitizeUser(
        user.toObject(),
      ),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(
      req.params.userId,
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (
      req.user._id.toString() ===
      user._id.toString()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "You cannot delete your own account",
      });
    }

    await user.deleteOne();

    return res.status(200).json({
      success: true,
      message:
        "User deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export {
  getUsers,
  createUser,
  updateUser,
  updateUserStatus,
  deleteUser,
};
