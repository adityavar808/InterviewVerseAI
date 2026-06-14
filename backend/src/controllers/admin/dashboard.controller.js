import User from "../../models/user.model.js";
import InterviewTemplate from "../../models/interviewTemplate.model.js";
import CodingQuestion from "../../models/codingQuestion.model.js";

import {
  ADMIN_USER_FIELDS,
  buildMonthlySeries,
  countByField,
  countFromArrayField,
  getPlatformSettingsDocument,
  resolveUserStatus,
  sanitizeSettings,
  sanitizeUser,
} from "../../utils/adminHelpers.js";

const getRecentBoundary = (days) => {
  const boundary = new Date();
  boundary.setDate(boundary.getDate() - days);
  return boundary;
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
        resolveUserStatus(user) ===
          "active",
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
        const start = new Date();
        start.setDate(1);
        start.setHours(0, 0, 0, 0);
        start.setMonth(start.getMonth() - offset);

        const end = new Date(start);
        end.setMonth(end.getMonth() + 1);

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
      const start = new Date();
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      start.setMonth(start.getMonth() - offset);

      const end = new Date(start);
      end.setMonth(end.getMonth() + 1);

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
      const start = new Date();
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      start.setMonth(start.getMonth() - offset);

      const end = new Date(start);
      end.setMonth(end.getMonth() + 1);

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
            subtitle: `${template.category} â€¢ ${template.status}`,
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
            subtitle: `${question.category} â€¢ ${question.difficulty}`,
            createdAt:
              question.updatedAt,
          }),
        ),
    ]
      .sort(
        (left, right) =>
          new Date(
            right.createdAt,
          ) - new Date(left.createdAt),
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

export {
  adminDashboard,
  getReports,
};
