import PlatformSetting from "../models/platformSetting.model.js";

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

const resolveUserStatus = (user) => {
  if (user.status === "suspended") {
    return "suspended";
  }

  if (user.isVerified === false) {
    return "inactive";
  }

  return user.status || "active";
};

const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  status: resolveUserStatus(user),
  isVerified: user.isVerified,
  skills: user.skills || [],
  bio: user.bio || "",
  location: user.location || "",
  headline: user.headline || "",
  githubUrl: user.githubUrl || "",
  linkedinUrl: user.linkedinUrl || "",
  portfolioUrl: user.portfolioUrl || "",
  certifications: user.certifications || [],
  profileSetupDone: user.profileSetupDone,
  streak: user.streak || 0,
  profileImage: user.profileImage || "",
  lastLoginAt: user.lastLoginAt || null,
  lastActiveAt: user.lastActiveAt || null,
  notificationSettings: user.notificationSettings || {
    emailNotifications: true,
    interviewReminders: true,
    aiInsightsAlerts: false,
  },
  isTwoFactorEnabled: !!user.isTwoFactorEnabled,
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
  testCases: question.testCases || [],
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

const getMonthWindow = (offset) => {
  const start = new Date();
  start.setDate(1);
  start.setHours(0, 0, 0, 0);
  start.setMonth(start.getMonth() - offset);

  const end = new Date(start);
  end.setMonth(end.getMonth() + 1);

  return { start, end };
};

const buildMonthlySeries = (
  items,
  valueKey,
  months = 6,
) => {
  const series = [];

  for (let offset = months - 1; offset >= 0; offset -= 1) {
    const { start, end } = getMonthWindow(offset);

    const bucketItems = items.filter(
      (item) => {
        const itemDate = new Date(item.createdAt);

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
    const rawValue = item[field] || fallback;
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
    (item[field] || []).forEach((entry) => {
      counts.set(
        entry,
        (counts.get(entry) || 0) + 1,
      );
    });
  });

  return Array.from(counts.entries())
    .map(([name, count]) => ({
      name,
      count,
    }))
    .sort((left, right) => right.count - left.count)
    .slice(0, limit);
};

const getPlatformSettingsDocument = async () => {
  let settings = await PlatformSetting.findOne({
    key: "default",
  });

  if (!settings) {
    settings = await PlatformSetting.create({
      key: "default",
    });
  }

  return settings;
};

export {
  ADMIN_USER_FIELDS,
  DEFAULT_PAGE_SIZE,
  toArray,
  buildRegex,
  resolveUserStatus,
  sanitizeUser,
  sanitizeInterviewTemplate,
  sanitizeCodingQuestion,
  sanitizeSettings,
  buildPaginationMeta,
  buildMonthlySeries,
  countByField,
  countFromArrayField,
  getPlatformSettingsDocument,
};
