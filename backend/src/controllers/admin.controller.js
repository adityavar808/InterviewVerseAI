import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/user.model.js";
import InterviewTemplate from "../models/interviewTemplate.model.js";
import CodingQuestion from "../models/codingQuestion.model.js";
import PlatformSetting from "../models/platformSetting.model.js";
import generateAccessToken from "../utils/generateToken.js";
import generateRefreshToken from "../utils/generateRefreshToken.js";

const ADMIN_USER_FIELDS =
  "-password -refreshToken -adminRefreshToken";

const DEFAULT_PAGE_SIZE = 10;

const toArray = (value) => {
  if (Array.isArray(value)) {
    return value
      .map((item) => `${item}`.trim())
      .filter(Boolean);
  }

  if (!value) {
    return [];
  }

  return `${value}`
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

const buildRegex = (value) =>
  new RegExp(value.trim(), "i");

const resolveUserStatus = (user) =>
  user.status || (user.isVerified ? "active" : "inactive");

const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  status: resolveUserStatus(user),
  isVerified: user.isVerified,
  skills: user.skills || [],
  streak: user.streak || 0,
  profileImage: user.profileImage || "",
  lastLoginAt: user.lastLoginAt || null,
  lastActiveAt: user.lastActiveAt || null,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const sanitizeInterviewTemplate = (template) => ({
  _id: template._id,
  title: template.title,
  description: template.description,
  category: template.category,
  difficulty: template.difficulty,
  durationMinutes: template.durationMinutes,
  questionCount: template.questionCount,
  status: template.status,
  tags: template.tags || [],
  usageCount: template.usageCount || 0,
  lastUsedAt: template.lastUsedAt || null,
  createdAt: template.createdAt,
  updatedAt: template.updatedAt,
});

const sanitizeCodingQuestion = (question) => ({
  _id: question._id,
  title: question.title,
  description: question.description,
  category: question.category,
  difficulty: question.difficulty,
  status: question.status,
  acceptanceRate: question.acceptanceRate,
  tags: question.tags || [],
  companies: question.companies || [],
  constraints: question.constraints || "",
  starterCode: question.starterCode || "",
  usageCount: question.usageCount || 0,
  createdAt: question.createdAt,
  updatedAt: question.updatedAt,
});

const sanitizeSettings = (settings) => ({
  key: settings.key,
  platformName: settings.platformName,
  supportEmail: settings.supportEmail,
  maintenanceMode: settings.maintenanceMode,
  allowRegistrations: settings.allowRegistrations,
  allowGoogleAuth: settings.allowGoogleAuth,
  dailyAiCreditLimit: settings.dailyAiCreditLimit,
  defaultInterviewDuration: settings.defaultInterviewDuration,
  defaultInterviewDifficulty:
    settings.defaultInterviewDifficulty,
  maxCodingQuestionsPerDay:
    settings.maxCodingQuestionsPerDay,
  sessionTimeoutMinutes:
    settings.sessionTimeoutMinutes,
  announcementBanner:
    settings.announcementBanner,
  onboardingMessage:
    settings.onboardingMessage,
  docsUrl: settings.docsUrl,
  statusPageUrl: settings.statusPageUrl,
  updatedAt: settings.updatedAt,
});

const buildPaginationMeta = (
  page,
  limit,
  total,
) => ({
  page,
  limit,
  total,
  totalPages:
    total === 0
      ? 1
      : Math.ceil(total / limit),
});

const getRecentBoundary = (days) => {
  const boundary = new Date();
  boundary.setDate(boundary.getDate() - days);
  return boundary;
};

const getMonthWindow = (offset) => {
  const start = new Date();
  start.setDate(1);
  start.setHours(0, 0, 0, 0);
  start.setMonth(start.getMonth() - offset);

  const end = new Date(start);
  end.setMonth(end.getMonth() + 1);

  return { start, end };
};

const calculateGrowth = (
  currentValue,
  previousValue,
) => {
  if (!previousValue) {
    return currentValue > 0 ? 100 : 0;
  }

  return Math.round(
    ((currentValue - previousValue) /
      previousValue) *
      100,
  );
};

const buildMonthlySeries = (
  items,
  valueKey,
  months = 6,
) => {
  const series = [];

  for (let offset = months - 1; offset >= 0; offset -= 1) {
    const { start, end } =
      getMonthWindow(offset);

    const bucketItems = items.filter(
      (item) => {
        const itemDate = new Date(
          item.createdAt,
        );

        return (
          itemDate >= start &&
          itemDate < end
        );
      },
    );

    series.push({
      month: start.toLocaleString("en-US", {
        month: "short",
      }),
      [valueKey]: bucketItems.length,
    });
  }

  return series;
};

const countByField = (
  items,
  field,
  fallback = "Unspecified",
) => {
  const counts = new Map();

  items.forEach((item) => {
    const rawValue =
      item[field] || fallback;
    const key =
      typeof rawValue === "string"
        ? rawValue
        : fallback;

    counts.set(
      key,
      (counts.get(key) || 0) + 1,
    );
  });

  return Array.from(counts.entries()).map(
    ([name, value]) => ({
      name,
      value,
    }),
  );
};

const countFromArrayField = (
  items,
  field,
  limit = 6,
) => {
  const counts = new Map();

  items.forEach((item) => {
    (item[field] || []).forEach(
      (entry) => {
        counts.set(
          entry,
          (counts.get(entry) || 0) + 1,
        );
      },
    );
  });

  return Array.from(counts.entries())
    .map(([name, count]) => ({
      name,
      count,
    }))
    .sort((left, right) =>
      right.count - left.count,
    )
    .slice(0, limit);
};

const createActivityItem = ({
  type,
  title,
  subtitle,
  createdAt,
}) => ({
  type,
  title,
  subtitle,
  createdAt,
});

const buildDashboardAlerts = ({
  suspendedUsers,
  draftInterviews,
  draftQuestions,
  settings,
}) => {
  const alerts = [];

  if (suspendedUsers > 0) {
    alerts.push({
      type: "warning",
      title: "Suspended accounts need review",
      message: `${suspendedUsers} account(s) are currently suspended.`,
    });
  }

  if (draftInterviews > 0) {
    alerts.push({
      type: "info",
      title: "Interview templates in draft",
      message: `${draftInterviews} interview template(s) are still waiting to be published.`,
    });
  }

  if (draftQuestions > 0) {
    alerts.push({
      type: "info",
      title: "Coding library has draft questions",
      message: `${draftQuestions} coding question(s) still need publishing review.`,
    });
  }

  if (settings.maintenanceMode) {
    alerts.push({
      type: "danger",
      title: "Maintenance mode is enabled",
      message: "Learner-facing routes should be reviewed before opening access again.",
    });
  }

  if (alerts.length === 0) {
    alerts.push({
      type: "success",
      title: "Platform health looks good",
      message: "No urgent admin actions are waiting right now.",
    });
  }

  return alerts;
};

const getPlatformSettingsDocument =
  async () => {
    let settings =
      await PlatformSetting.findOne({
        key: "default",
      });

    if (!settings) {
      settings =
        await PlatformSetting.create({
          key: "default",
        });
    }

    return settings;
  };

const buildInsights = ({
  totalStudents,
  verifiedStudents,
  suspendedUsers,
  publishedInterviews,
  totalInterviews,
  publishedQuestions,
  totalQuestions,
  topSkills,
}) => {
  const insights = [];

  const verificationRate =
    totalStudents === 0
      ? 0
      : Math.round(
          (verifiedStudents /
            totalStudents) *
            100,
        );

  insights.push(
    verificationRate >= 80
      ? `Verification is healthy at ${verificationRate}%, which means most learners can access the platform without onboarding friction.`
      : `Verification is at ${verificationRate}%, so follow-up onboarding reminders could improve activation.`,
  );

  const contentPublishRate =
    totalInterviews + totalQuestions === 0
      ? 0
      : Math.round(
          ((publishedInterviews +
            publishedQuestions) /
            (totalInterviews +
              totalQuestions)) *
            100,
        );

  insights.push(
    contentPublishRate >= 70
      ? `Published content coverage is ${contentPublishRate}%, so the library is in strong shape for students.`
      : `Published content coverage is ${contentPublishRate}%, which suggests more draft content should be reviewed.`,
  );

  if (suspendedUsers > 0) {
    insights.push(
      `${suspendedUsers} suspended account(s) are on the platform, which is worth checking for support or abuse follow-up.`,
    );
  }

  if (topSkills[0]) {
    insights.push(
      `${topSkills[0].name} is currently the most common learner skill tag, making it a good candidate for featured interview tracks.`,
    );
  }

  return insights;
};

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password are required",
      });
    }

    const admin = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!admin || admin.role !== "admin") {
      return res.status(401).json({
        success: false,
        message:
          "Invalid admin credentials",
      });
    }

    if (
      resolveUserStatus(admin) ===
      "suspended"
    ) {
      return res.status(403).json({
        success: false,
        message:
          "This admin account is suspended",
      });
    }

    const isMatch =
      await bcrypt.compare(
        password,
        admin.password,
      );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid admin credentials",
      });
    }

    const accessToken =
      generateAccessToken(admin);
    const refreshToken =
      generateRefreshToken(admin);

    admin.adminRefreshToken =
      refreshToken;
    admin.lastLoginAt = new Date();
    admin.lastActiveAt = new Date();
    admin.status = "active";

    await admin.save();

    res.cookie(
      "adminRefreshToken",
      refreshToken,
      {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge:
          7 *
          24 *
          60 *
          60 *
          1000,
      },
    );

    return res.status(200).json({
      success: true,
      message:
        "Admin login successful",
      accessToken,
      admin: sanitizeUser(
        admin.toObject(),
      ),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const refreshAdminToken = async (
  req,
  res,
) => {
  try {
    const refreshToken =
      req.cookies.adminRefreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message:
          "Admin refresh token missing",
      });
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET,
    );

    const admin = await User.findById(
      decoded.id,
    );

    if (
      !admin ||
      admin.role !== "admin" ||
      admin.adminRefreshToken !==
        refreshToken
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid admin refresh token",
      });
    }

    const accessToken =
      generateAccessToken(admin);

    admin.lastActiveAt = new Date();
    await admin.save();

    return res.status(200).json({
      success: true,
      accessToken,
      admin: sanitizeUser(
        admin.toObject(),
      ),
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message:
        "Admin session expired",
    });
  }
};

const logoutAdmin = async (req, res) => {
  try {
    const refreshToken =
      req.cookies.adminRefreshToken;

    if (refreshToken) {
      const admin =
        await User.findOne({
          adminRefreshToken:
            refreshToken,
        });

      if (admin) {
        admin.adminRefreshToken = "";
        await admin.save();
      }
    }

    res.clearCookie(
      "adminRefreshToken",
    );

    return res.status(200).json({
      success: true,
      message:
        "Admin logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAdminMe = async (req, res) => {
  return res.status(200).json({
    success: true,
    admin: sanitizeUser(
      req.user.toObject(),
    ),
  });
};

const adminDashboard = async (
  req,
  res,
) => {
  try {
    const [
      users,
      interviews,
      codingQuestions,
      settings,
    ] = await Promise.all([
      User.find()
        .select(ADMIN_USER_FIELDS)
        .lean(),
      InterviewTemplate.find().lean(),
      CodingQuestion.find().lean(),
      getPlatformSettingsDocument(),
    ]);

    const students = users.filter(
      (user) => user.role === "student",
    );
    const activeBoundary =
      getRecentBoundary(30);
    const activeUsers = students.filter(
      (user) =>
        user.lastActiveAt &&
        new Date(user.lastActiveAt) >=
          activeBoundary &&
        resolveUserStatus(user) !==
          "suspended",
    );

    const verifiedStudents =
      students.filter(
        (user) => user.isVerified,
      );

    const publishedInterviews =
      interviews.filter(
        (template) =>
          template.status ===
          "published",
      );
    const publishedQuestions =
      codingQuestions.filter(
        (question) =>
          question.status ===
          "published",
      );
    const suspendedUsers =
      students.filter(
        (user) =>
          resolveUserStatus(user) ===
          "suspended",
      ).length;

    const [thisMonthUsers, lastMonthUsers] =
      [0, 1].map((offset) => {
        const { start, end } =
          getMonthWindow(offset);

        return students.filter((user) => {
          const createdAt =
            new Date(
              user.createdAt,
            );

          return (
            createdAt >= start &&
            createdAt < end
          );
        }).length;
      });

    const [
      thisMonthInterviews,
      lastMonthInterviews,
    ] = [0, 1].map((offset) => {
      const { start, end } =
        getMonthWindow(offset);

      return interviews.filter(
        (template) => {
          const createdAt =
            new Date(
              template.createdAt,
            );

          return (
            createdAt >= start &&
            createdAt < end
          );
        },
      ).length;
    });

    const [
      thisMonthQuestions,
      lastMonthQuestions,
    ] = [0, 1].map((offset) => {
      const { start, end } =
        getMonthWindow(offset);

      return codingQuestions.filter(
        (question) => {
          const createdAt =
            new Date(
              question.createdAt,
            );

          return (
            createdAt >= start &&
            createdAt < end
          );
        },
      ).length;
    });

    const sortedStudents = students
      .slice()
      .sort(
        (left, right) =>
          new Date(
            right.createdAt,
          ) -
          new Date(
            left.createdAt,
          ),
      )
      .slice(0, 5);

    const recentActivity = [
      ...sortedStudents.slice(0, 6).map((user) =>
        createActivityItem({
          type: "user",
          title: `${user.name} joined the platform`,
          subtitle: `${user.email} registered as ${user.role}.`,
          createdAt: user.createdAt,
        }),
      ),
      ...interviews
        .slice()
        .sort(
          (left, right) =>
            new Date(
              right.updatedAt,
            ) -
            new Date(
              left.updatedAt,
            ),
        )
        .slice(0, 6)
        .map((template) =>
          createActivityItem({
            type: "interview",
            title: `${template.title} template updated`,
            subtitle: `${template.category} • ${template.status}`,
            createdAt:
              template.updatedAt,
          }),
        ),
      ...codingQuestions
        .slice()
        .sort(
          (left, right) =>
            new Date(
              right.updatedAt,
            ) -
            new Date(
              left.updatedAt,
            ),
        )
        .slice(0, 6)
        .map((question) =>
          createActivityItem({
            type: "coding",
            title: `${question.title} question updated`,
            subtitle: `${question.category} • ${question.difficulty}`,
            createdAt:
              question.updatedAt,
          }),
        ),
    ]
      .sort(
        (left, right) =>
          new Date(
            right.createdAt,
          ) -
          new Date(
            left.createdAt,
          ),
      )
      .slice(0, 8);

    const topSkills =
      countFromArrayField(
        students,
        "skills",
      );

    const data = {
      overview: {
        totalUsers: students.length,
        activeUsers:
          activeUsers.length,
        verifiedUsers:
          verifiedStudents.length,
        totalAdmins: users.filter(
          (user) => user.role === "admin",
        ).length,
        totalInterviews:
          interviews.length,
        publishedInterviews:
          publishedInterviews.length,
        totalCodingQuestions:
          codingQuestions.length,
        publishedCodingQuestions:
          publishedQuestions.length,
        suspendedUsers,
        userGrowth:
          calculateGrowth(
            thisMonthUsers,
            lastMonthUsers,
          ),
        interviewGrowth:
          calculateGrowth(
            thisMonthInterviews,
            lastMonthInterviews,
          ),
        questionGrowth:
          calculateGrowth(
            thisMonthQuestions,
            lastMonthQuestions,
          ),
      },
      charts: {
        userGrowth:
          buildMonthlySeries(
            students,
            "users",
          ).map(
            (
              bucket,
              index,
            ) => ({
              ...bucket,
              verifiedUsers:
                buildMonthlySeries(
                  verifiedStudents,
                  "verifiedUsers",
                )[index]
                  .verifiedUsers,
            }),
          ),
        interviewCategories:
          countByField(
            interviews,
            "category",
          ),
        codingDifficulties:
          countByField(
            codingQuestions,
            "difficulty",
          ),
        roleDistribution:
          countByField(
            users,
            "role",
          ),
        userStatuses:
          countByField(
            students.map((user) => ({
              ...user,
              status:
                resolveUserStatus(
                  user,
                ),
            })),
            "status",
          ),
      },
      recentUsers:
        sortedStudents.map(
          sanitizeUser,
        ),
      recentActivity,
      topSkills,
      alerts: buildDashboardAlerts({
        suspendedUsers,
        draftInterviews:
          interviews.filter(
            (item) =>
              item.status ===
              "draft",
          ).length,
        draftQuestions:
          codingQuestions.filter(
            (item) =>
              item.status ===
              "draft",
          ).length,
        settings,
      }),
      settings: sanitizeSettings(
        settings,
      ),
    };

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

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

const getInterviews = async (
  req,
  res,
) => {
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
      const regex = buildRegex(
        req.query.search,
      );

      filters.$or = [
        { title: regex },
        { description: regex },
        { tags: regex },
      ];
    }

    if (
      req.query.status &&
      req.query.status !== "all"
    ) {
      filters.status = req.query.status;
    }

    if (
      req.query.category &&
      req.query.category !== "all"
    ) {
      filters.category =
        req.query.category;
    }

    if (
      req.query.difficulty &&
      req.query.difficulty !== "all"
    ) {
      filters.difficulty =
        req.query.difficulty;
    }

    const [total, interviews] =
      await Promise.all([
        InterviewTemplate.countDocuments(
          filters,
        ),
        InterviewTemplate.find(filters)
          .sort({ updatedAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
      ]);

    return res.status(200).json({
      success: true,
      data: interviews.map(
        sanitizeInterviewTemplate,
      ),
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

const createInterview = async (
  req,
  res,
) => {
  try {
    const {
      title,
      description,
      category,
      difficulty,
      durationMinutes,
      questionCount,
      status,
      tags,
    } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message:
          "Interview title is required",
      });
    }

    const template =
      await InterviewTemplate.create({
        title: title.trim(),
        description:
          description?.trim() || "",
        category,
        difficulty,
        durationMinutes,
        questionCount,
        status,
        tags: toArray(tags),
        createdBy: req.user._id,
        updatedBy: req.user._id,
      });

    return res.status(201).json({
      success: true,
      message:
        "Interview template created successfully",
      data: sanitizeInterviewTemplate(
        template.toObject(),
      ),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateInterview = async (
  req,
  res,
) => {
  try {
    const template =
      await InterviewTemplate.findById(
        req.params.interviewId,
      );

    if (!template) {
      return res.status(404).json({
        success: false,
        message:
          "Interview template not found",
      });
    }

    [
      "title",
      "description",
      "category",
      "difficulty",
      "status",
    ].forEach((field) => {
      if (
        req.body[field] !==
        undefined
      ) {
        template[field] =
          typeof req.body[field] ===
          "string"
            ? req.body[field].trim()
            : req.body[field];
      }
    });

    if (
      req.body.durationMinutes !==
      undefined
    ) {
      template.durationMinutes =
        Number(
          req.body.durationMinutes,
        );
    }

    if (
      req.body.questionCount !==
      undefined
    ) {
      template.questionCount =
        Number(
          req.body.questionCount,
        );
    }

    if (req.body.tags !== undefined) {
      template.tags = toArray(
        req.body.tags,
      );
    }

    template.updatedBy = req.user._id;

    await template.save();

    return res.status(200).json({
      success: true,
      message:
        "Interview template updated successfully",
      data: sanitizeInterviewTemplate(
        template.toObject(),
      ),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteInterview = async (
  req,
  res,
) => {
  try {
    const template =
      await InterviewTemplate.findById(
        req.params.interviewId,
      );

    if (!template) {
      return res.status(404).json({
        success: false,
        message:
          "Interview template not found",
      });
    }

    await template.deleteOne();

    return res.status(200).json({
      success: true,
      message:
        "Interview template deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getCodingQuestions = async (
  req,
  res,
) => {
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
      const regex = buildRegex(
        req.query.search,
      );

      filters.$or = [
        { title: regex },
        { description: regex },
        { tags: regex },
        { companies: regex },
      ];
    }

    if (
      req.query.status &&
      req.query.status !== "all"
    ) {
      filters.status = req.query.status;
    }

    if (
      req.query.category &&
      req.query.category !== "all"
    ) {
      filters.category =
        req.query.category;
    }

    if (
      req.query.difficulty &&
      req.query.difficulty !== "all"
    ) {
      filters.difficulty =
        req.query.difficulty;
    }

    const [total, questions] =
      await Promise.all([
        CodingQuestion.countDocuments(
          filters,
        ),
        CodingQuestion.find(filters)
          .sort({ updatedAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
      ]);

    return res.status(200).json({
      success: true,
      data: questions.map(
        sanitizeCodingQuestion,
      ),
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

const createCodingQuestion = async (
  req,
  res,
) => {
  try {
    const {
      title,
      description,
      category,
      difficulty,
      status,
      acceptanceRate,
      tags,
      companies,
      constraints,
      starterCode,
    } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message:
          "Question title is required",
      });
    }

    const question =
      await CodingQuestion.create({
        title: title.trim(),
        description:
          description?.trim() || "",
        category,
        difficulty,
        status,
        acceptanceRate:
          Number(acceptanceRate) || 0,
        tags: toArray(tags),
        companies: toArray(companies),
        constraints:
          constraints?.trim() || "",
        starterCode:
          starterCode || "",
        createdBy: req.user._id,
        updatedBy: req.user._id,
      });

    return res.status(201).json({
      success: true,
      message:
        "Coding question created successfully",
      data: sanitizeCodingQuestion(
        question.toObject(),
      ),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateCodingQuestion = async (
  req,
  res,
) => {
  try {
    const question =
      await CodingQuestion.findById(
        req.params.questionId,
      );

    if (!question) {
      return res.status(404).json({
        success: false,
        message:
          "Coding question not found",
      });
    }

    [
      "title",
      "description",
      "category",
      "difficulty",
      "status",
      "constraints",
      "starterCode",
    ].forEach((field) => {
      if (
        req.body[field] !==
        undefined
      ) {
        question[field] =
          typeof req.body[field] ===
          "string"
            ? req.body[field].trim()
            : req.body[field];
      }
    });

    if (
      req.body.acceptanceRate !==
      undefined
    ) {
      question.acceptanceRate =
        Number(
          req.body.acceptanceRate,
        ) || 0;
    }

    if (req.body.tags !== undefined) {
      question.tags = toArray(
        req.body.tags,
      );
    }

    if (
      req.body.companies !==
      undefined
    ) {
      question.companies =
        toArray(req.body.companies);
    }

    question.updatedBy = req.user._id;

    await question.save();

    return res.status(200).json({
      success: true,
      message:
        "Coding question updated successfully",
      data: sanitizeCodingQuestion(
        question.toObject(),
      ),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteCodingQuestion = async (
  req,
  res,
) => {
  try {
    const question =
      await CodingQuestion.findById(
        req.params.questionId,
      );

    if (!question) {
      return res.status(404).json({
        success: false,
        message:
          "Coding question not found",
      });
    }

    await question.deleteOne();

    return res.status(200).json({
      success: true,
      message:
        "Coding question deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getReports = async (req, res) => {
  try {
    const [
      users,
      interviews,
      codingQuestions,
    ] = await Promise.all([
      User.find()
        .select(ADMIN_USER_FIELDS)
        .lean(),
      InterviewTemplate.find().lean(),
      CodingQuestion.find().lean(),
    ]);

    const students = users.filter(
      (user) => user.role === "student",
    );
    const verifiedStudents =
      students.filter(
        (user) => user.isVerified,
      ).length;
    const suspendedUsers =
      students.filter(
        (user) =>
          resolveUserStatus(user) ===
          "suspended",
      ).length;

    const publishedInterviews =
      interviews.filter(
        (template) =>
          template.status ===
          "published",
      ).length;
    const publishedQuestions =
      codingQuestions.filter(
        (question) =>
          question.status ===
          "published",
      ).length;

    const verificationRate =
      students.length === 0
        ? 0
        : Math.round(
            (verifiedStudents /
              students.length) *
              100,
          );

    const publishRate =
      interviews.length + codingQuestions.length ===
      0
        ? 0
        : Math.round(
            ((publishedInterviews +
              publishedQuestions) /
              (interviews.length +
                codingQuestions.length)) *
              100,
          );

    const topSkills =
      countFromArrayField(
        students,
        "skills",
        8,
      );

    const topTags = countFromArrayField(
      [
        ...interviews.map((item) => ({
          tags: item.tags,
        })),
        ...codingQuestions.map((item) => ({
          tags: item.tags,
        })),
      ],
      "tags",
      8,
    );

    return res.status(200).json({
      success: true,
      data: {
        summary: {
          totalStudents:
            students.length,
          totalAdmins: users.filter(
            (user) =>
              user.role === "admin",
          ).length,
          verificationRate,
          publishRate,
          suspendedUsers,
          contentItems:
            interviews.length +
            codingQuestions.length,
        },
        distributions: {
          userStatuses:
            countByField(
              students.map((user) => ({
                ...user,
                status:
                  resolveUserStatus(
                    user,
                  ),
              })),
              "status",
            ),
          interviewDifficulty:
            countByField(
              interviews,
              "difficulty",
            ),
          codingDifficulty:
            countByField(
              codingQuestions,
              "difficulty",
            ),
          interviewCategories:
            countByField(
              interviews,
              "category",
            ),
          codingCategories:
            countByField(
              codingQuestions,
              "category",
            ),
        },
        monthly: {
          userSignups:
            buildMonthlySeries(
              students,
              "users",
            ),
          contentCreated:
            buildMonthlySeries(
              [
                ...interviews,
                ...codingQuestions,
              ],
              "items",
            ),
        },
        topSkills,
        topTags,
        insights: buildInsights({
          totalStudents:
            students.length,
          verifiedStudents,
          suspendedUsers,
          publishedInterviews,
          totalInterviews:
            interviews.length,
          publishedQuestions,
          totalQuestions:
            codingQuestions.length,
          topSkills,
        }),
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getSettings = async (req, res) => {
  try {
    const settings =
      await getPlatformSettingsDocument();

    return res.status(200).json({
      success: true,
      data: sanitizeSettings(
        settings,
      ),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateSettings = async (
  req,
  res,
) => {
  try {
    const settings =
      await getPlatformSettingsDocument();

    const fields = [
      "platformName",
      "supportEmail",
      "maintenanceMode",
      "allowRegistrations",
      "allowGoogleAuth",
      "dailyAiCreditLimit",
      "defaultInterviewDuration",
      "defaultInterviewDifficulty",
      "maxCodingQuestionsPerDay",
      "sessionTimeoutMinutes",
      "announcementBanner",
      "onboardingMessage",
      "docsUrl",
      "statusPageUrl",
    ];

    fields.forEach((field) => {
      if (
        req.body[field] !==
        undefined
      ) {
        settings[field] =
          req.body[field];
      }
    });

    settings.updatedBy = req.user._id;

    await settings.save();

    return res.status(200).json({
      success: true,
      message:
        "Platform settings updated successfully",
      data: sanitizeSettings(
        settings,
      ),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export {
  loginAdmin,
  refreshAdminToken,
  logoutAdmin,
  getAdminMe,
  adminDashboard,
  getUsers,
  createUser,
  updateUser,
  updateUserStatus,
  deleteUser,
  getInterviews,
  createInterview,
  updateInterview,
  deleteInterview,
  getCodingQuestions,
  createCodingQuestion,
  updateCodingQuestion,
  deleteCodingQuestion,
  getReports,
  getSettings,
  updateSettings,
};
