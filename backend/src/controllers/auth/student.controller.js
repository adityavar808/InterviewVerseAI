import User from "../../models/user.model.js";

const studentDashboard = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user || user.role !== "student") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    // Import models
    const InterviewTemplate =
      (await import(
        "../../models/interviewTemplate.model.js"
      )).default;
    const CodingQuestion =
      (await import(
        "../../models/codingQuestion.model.js"
      )).default;

    // Fetch published templates and questions
    const [interviews, codingQuestions, totalInterviewTemplates, totalCodingQuestions] =
      await Promise.all([
        InterviewTemplate.find({
          status: "published",
        }).lean(),
        CodingQuestion.find({
          status: "published",
        }).lean(),
        InterviewTemplate.countDocuments({
          status: "published",
        }),
        CodingQuestion.countDocuments({
          status: "published",
        }),
      ]);

    // Calculate performance metrics
    const performanceData = [
      {
        day: "Mon",
        score: 65,
      },
      {
        day: "Tue",
        score: 72,
      },
      {
        day: "Wed",
        score: 68,
      },
      {
        day: "Thu",
        score: 80,
      },
      {
        day: "Fri",
        score: 84,
      },
      {
        day: "Sat",
        score: 90,
      },
    ];

    // Sample performance stats
    const performanceStats = [
      {
        title: "Total Interviews",
        value: "24",
        growth: "+18%",
      },
      {
        title: "Average Score",
        value: "89%",
        growth: "+6%",
      },
      {
        title: "Coding Accuracy",
        value: "93%",
        growth: "+12%",
      },
      {
        title: "Communication",
        value: "84%",
        growth: "+9%",
      },
    ];

    // Skill distribution
    const skillData = [
      {
        subject: "DSA",
        score: 92,
      },
      {
        subject: "React",
        score: 88,
      },
      {
        subject: "Backend",
        score: 81,
      },
      {
        subject: "Communication",
        score: 84,
      },
      {
        subject: "System Design",
        score: 70,
      },
      {
        subject: "Problem Solving",
        score: 95,
      },
    ];

    // Activity heatmap (5 weeks)
    const activityHeatmap = [
      [1, 2, 0, 4, 3, 2, 1],
      [0, 3, 2, 1, 4, 2, 0],
      [2, 4, 3, 2, 1, 0, 1],
      [1, 2, 4, 3, 2, 1, 2],
      [3, 1, 2, 4, 4, 3, 2],
    ];

    // Weakness analysis
    const weaknesses = [
      {
        title: "System Design",
        issue:
          "Need stronger understanding of scalable architecture patterns and distributed systems.",
        improvement:
          "Focus on HLD & LLD practice.",
        severity: "High",
      },
      {
        title: "Communication Confidence",
        issue:
          "Speech confidence slightly drops during technical explanations.",
        improvement:
          "Practice mock HR interviews regularly.",
        severity: "Medium",
      },
      {
        title: "Code Optimization",
        issue:
          "Some solutions use unnecessary loops and redundant conditions.",
        improvement:
          "Focus on time complexity optimization.",
        severity: "Medium",
      },
    ];

    // Recent interviews
    const userHistory = (user.interviewHistory || []).slice();
    const sortedHistory = userHistory
      .map((item) => ({
        ...item,
        date: item.completedAt
          ? new Date(item.completedAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
          : "",
      }))
      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));

    const totalInterviews = sortedHistory.length;
    const thisWeekInterviews = sortedHistory.filter((item) => {
      const completedAt = new Date(item.completedAt);
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return completedAt >= sevenDaysAgo;
    }).length;

    const recentInterviews = sortedHistory.length
      ? sortedHistory.slice(0, 3)
      : [
        {
          role: "Frontend Developer",
          score: 84,
          date: "12 May 2026",
          status: "Completed",
          tech: ["React", "CSS"],
        },
        {
          role: "MERN Stack Developer",
          score: 78,
          date: "14 May 2026",
          status: "Completed",
          tech: ["MongoDB", "Node"],
        },
        {
          role: "AI Engineer",
          score: 91,
          date: "16 May 2026",
          status: "Completed",
          tech: ["Python", "ML"],
        },
      ];

    const data = {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage || "",
      },
      overview: {
        totalInterviews,
        atsResumeScore: 88,
        codingProblems: 136,
        dailyStreak: user.streak || 0,
        thisWeekInterviews,
        resumeImprovement: 5,
        problemsThisWeek: 8,
        availableInterviewTemplates: totalInterviewTemplates,
        availableCodingQuestions: totalCodingQuestions,
      },
      charts: {
        performanceChart: performanceData,
        performanceStats,
        skillRadar: skillData,
        activityHeatmap,
      },
      weaknesses,
      recentInterviews,
      availableInterviews:
        interviews.slice(0, 5),
      availableCodingQuestions:
        codingQuestions.slice(0, 5),
    };

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getStudentInterviews = async (req, res) => {
  try {
    const InterviewTemplate = (await import("../../models/interviewTemplate.model.js")).default;

    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.max(1, Number(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    const filters = { status: "published" };

    if (req.query.search && req.query.search.trim()) {
      const regex = new RegExp(req.query.search.trim(), "i");
      filters.$or = [
        { title: regex },
        { description: regex },
        { tags: regex },
      ];
    }

    if (req.query.category && req.query.category !== "all") {
      filters.category = req.query.category;
    }

    if (req.query.difficulty && req.query.difficulty !== "all") {
      filters.difficulty = req.query.difficulty;
    }

    const [total, interviews] = await Promise.all([
      InterviewTemplate.countDocuments(filters),
      InterviewTemplate.find(filters)
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

    res.status(200).json({
      success: true,
      data: interviews,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getInterviewHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).lean();

    if (!user || user.role !== "student") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const history = (user.interviewHistory || [])
      .map((item) => ({
        ...item,
        sessionId: item.sessionId || null,
        date: item.completedAt
          ? new Date(item.completedAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
          : "",
      }))
      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));

    return res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const addInterviewHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user || user.role !== "student") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const {
      title,
      role,
      score,
      duration,
      status,
      difficulty,
      tags,
      tech,
      notes,
      completedAt,
    } = req.body;

    const newRecord = {
      sessionId: req.body.sessionId || undefined,
      title: title?.trim() || role?.trim() || "AI Interview",
      role: role?.trim() || "Interview",
      score: Number(score) || 0,
      duration: duration?.trim() || "0 mins",
      status: status || "Completed",
      difficulty: difficulty || "Medium",
      tags: Array.isArray(tags) ? tags : [],
      tech: Array.isArray(tech) ? tech : [],
      notes: notes?.trim() || "",
      completedAt: completedAt ? new Date(completedAt) : new Date(),
    };

    user.interviewHistory.unshift(newRecord);
    await user.save();

    return res.status(201).json({
      success: true,
      data: newRecord,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getStudentCodingQuestions = async (req, res) => {
  try {
    const CodingQuestion = (await import("../../models/codingQuestion.model.js")).default;

    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.max(1, Number(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    const filters = { status: "published" };

    if (req.query.search && req.query.search.trim()) {
      const regex = new RegExp(req.query.search.trim(), "i");
      filters.$or = [
        { title: regex },
        { description: regex },
        { tags: regex },
        { companies: regex },
      ];
    }

    if (req.query.category && req.query.category !== "all") {
      filters.category = req.query.category;
    }

    if (req.query.difficulty && req.query.difficulty !== "all") {
      filters.difficulty = req.query.difficulty;
    }

    const [total, questions] = await Promise.all([
      CodingQuestion.countDocuments(filters),
      CodingQuestion.find(filters)
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

    res.status(200).json({
      success: true,
      data: questions,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export {
  studentDashboard,
  getStudentInterviews,
  getInterviewHistory,
  addInterviewHistory,
  getStudentCodingQuestions,
};
