import User from "../../models/user.model.js";
import { analyzeResumeAI } from "../../services/aiPython.service.js";

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
    const InterviewSession =
      (await import(
        "../../models/interviewSession.model.js"
      )).default;

    // Fetch published templates and questions
    const [interviews, codingQuestions, totalInterviewTemplates, totalCodingQuestions, completedSessions] =
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
        InterviewSession.find({
          user: userId,
          status: "completed"
        }).sort({ completedAt: 1 }).lean()
      ]);

    // Calculate dynamic performance data for charts
    const performanceData = completedSessions.map(s => ({
      day: new Date(s.completedAt).toLocaleDateString("en-US", { weekday: "short" }),
      score: Math.round(s.averageScore)
    }));

    if (performanceData.length === 0) {
      performanceData.push({ day: "Mon", score: 0 });
    }

    const totalInterviewsCount = completedSessions.length;
    const avgScoreValue = completedSessions.length > 0 
      ? Math.round(completedSessions.reduce((sum, s) => sum + s.averageScore, 0) / completedSessions.length) 
      : 0;
    const codingAccuracyValue = user.solvedQuestionsMeta.length > 0 
      ? Math.round(user.solvedQuestionsMeta.reduce((sum, m) => sum + m.score, 0) / user.solvedQuestionsMeta.length) 
      : 0;
    const commsValue = completedSessions.length > 0 
      ? Math.round(completedSessions.flatMap(s => s.responses).reduce((sum, r) => sum + (r.communication || 0), 0) / Math.max(1, completedSessions.flatMap(s => s.responses).length)) 
      : 0;

    const performanceStats = [
      {
        title: "Total Interviews",
        value: String(totalInterviewsCount),
        growth: "+100%",
      },
      {
        title: "Average Score",
        value: `${avgScoreValue}%`,
        growth: "+0%",
      },
      {
        title: "Coding Accuracy",
        value: `${codingAccuracyValue}%`,
        growth: "+0%",
      },
      {
        title: "Communication",
        value: `${commsValue}%`,
        growth: "+0%",
      },
    ];

    // Dynamic skill distribution based on real code evaluations and interview scores
    let dsaScores = [];
    let reactScores = [];
    let backendScores = [];
    let systemDesignScores = [];

    user.solvedQuestionsMeta.forEach(m => {
      const score = Number(m.score) || 0;
      if (m.language === "javascript" || m.language === "typescript") {
        reactScores.push(score);
      } else {
        dsaScores.push(score);
      }
      backendScores.push(score);
    });

    completedSessions.forEach(s => {
      s.responses.forEach(r => {
        if (s.config?.role?.toLowerCase().includes("system design")) {
          systemDesignScores.push(r.score || 0);
        }
      });
    });

    const getAvg = (arr) => arr.length > 0 ? Math.round(arr.reduce((a,b) => a+b, 0)/arr.length) : 0;

    const skillData = [
      {
        subject: "DSA",
        score: getAvg(dsaScores),
      },
      {
        subject: "React",
        score: getAvg(reactScores),
      },
      {
        subject: "Backend",
        score: getAvg(backendScores),
      },
      {
        subject: "Communication",
        score: commsValue,
      },
      {
        subject: "System Design",
        score: getAvg(systemDesignScores),
      },
      {
        subject: "Problem Solving",
        score: avgScoreValue,
      },
    ];

    // Dynamic 20-week activity heatmap based strictly on all user activities
    const activityHeatmap = Array.from({ length: 20 }, () => [0, 0, 0, 0, 0, 0, 0]);

    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;

    const registerActivity = (dateInput) => {
      if (!dateInput) return;
      const d = new Date(dateInput);
      if (isNaN(d.getTime())) return;

      const diffMs = now - d.getTime();
      const diffDays = Math.floor(diffMs / oneDayMs);

      if (diffDays >= 0 && diffDays < 140) {
        const weekIdx = Math.floor(diffDays / 7);
        const dayIdx = d.getDay();
        const adjustedDayIdx = dayIdx === 0 ? 6 : dayIdx - 1;
        if (weekIdx >= 0 && weekIdx < 20 && adjustedDayIdx >= 0 && adjustedDayIdx < 7) {
          activityHeatmap[19 - weekIdx][adjustedDayIdx] += 1;
        }
      }
    };

    completedSessions.forEach(s => registerActivity(s.completedAt || s.createdAt));
    (user.interviewHistory || []).forEach(h => registerActivity(h.completedAt || h.createdAt || h.date));
    (user.solvedQuestionsMeta || []).forEach(m => registerActivity(m.solvedAt));

    // Dynamic weaknesses list strictly derived from performance
    const weaknesses = [];
    if (systemDesignScores.length > 0 && getAvg(systemDesignScores) < 70) {
      weaknesses.push({
        title: "System Design",
        issue: "Need stronger understanding of scalable architecture patterns and distributed systems.",
        improvement: "Focus on HLD & LLD practice.",
        severity: "High",
      });
    }
    if (commsValue > 0 && commsValue < 80) {
      weaknesses.push({
        title: "Communication Confidence",
        issue: "Speech confidence slightly drops during technical explanations.",
        improvement: "Practice mock HR interviews regularly.",
        severity: "Medium",
      });
    }
    if (dsaScores.length > 0 && getAvg(dsaScores) < 75) {
      weaknesses.push({
        title: "Code Optimization",
        issue: "Some solutions use unnecessary loops and redundant conditions.",
        improvement: "Focus on time complexity optimization.",
        severity: "Medium",
      });
    }

    // Recent interviews strictly from user history
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
      const completedAt = new Date(item.completedAt || item.createdAt);
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return completedAt >= sevenDaysAgo;
    }).length;

    const recentInterviews = sortedHistory.slice(0, 3);

    const atsResumeScore = user.resumeAnalysis?.atsScore || 0;
    const codingProblems = user.solvedQuestions?.length || 0;
    const resumeImprovement = user.resumeAnalysis ? 10 : 0;
    const problemsThisWeek = Math.min(codingProblems, 5);
    const calculatedStreak = (user.streak && user.streak > 0) ? user.streak : ((totalInterviews > 0 || codingProblems > 0) ? 1 : 0);

    const data = {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage || "",
      },
      overview: {
        totalInterviews,
        atsResumeScore,
        codingProblems,
        dailyStreak: calculatedStreak,
        thisWeekInterviews,
        resumeImprovement,
        problemsThisWeek,
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

const ROLE_KEYWORDS = {
  "MERN Developer": ["React", "Node.js", "Express", "MongoDB", "JavaScript", "REST", "APIs", "HTML", "CSS", "Redux"],
  "Frontend Developer": ["React", "Vue", "Angular", "JavaScript", "TypeScript", "CSS", "HTML", "Responsive", "Accessibility", "UI/UX"],
  "Backend Developer": ["Node.js", "Express", "Java", "Python", "SQL", "APIs", "Microservices", "Docker", "Kubernetes", "Authentication"],
  "Full Stack Developer": ["React", "Node.js", "Express", "MongoDB", "REST", "JavaScript", "CSS", "HTML", "CI/CD", "Cloud"],
  "Machine Learning Engineer": ["Python", "TensorFlow", "PyTorch", "Data", "ML", "Model", "NLP", "Scikit-learn", "Statistics", "Algorithms"],
  "Data Analyst": ["SQL", "Python", "Pandas", "Tableau", "Power BI", "Visualization", "Excel", "Data Cleaning", "Analytics", "Reporting"],
  "DevOps Engineer": ["Docker", "Kubernetes", "CI/CD", "AWS", "Azure", "Terraform", "Monitoring", "Automation", "Linux", "SRE"],
};

const runLocalAnalysis = (resumeText, role) => {
  const normalized = (resumeText || "").toLowerCase();
  const roleKeywords = ROLE_KEYWORDS[role] || ROLE_KEYWORDS["Frontend Developer"];
  const matched = roleKeywords.filter(keyword => normalized.includes(keyword.toLowerCase()));
  const missing = roleKeywords.filter(keyword => !normalized.includes(keyword.toLowerCase()));
  
  const matchPercent = roleKeywords.length ? Math.round((matched.length / roleKeywords.length) * 100) : 0;
  
  let score = 40 + Math.round(matchPercent * 0.4);
  
  const sections = ["experience", "projects", "education", "skills", "certifications", "summary"];
  const foundSections = sections.filter(sec => normalized.includes(sec));
  score += foundSections.length * 3;
  
  const wordCount = normalized.split(/\s+/).length;
  if (wordCount > 100 && wordCount < 600) {
    score += 5;
  }
  
  const atsScore = Math.min(95, Math.max(30, score));
  
  const improvements = [];
  if (missing.length > 0) {
    improvements.push(`Include missing key technologies: ${missing.slice(0, 4).join(", ")}.`);
  }
  if (!normalized.includes("project")) {
    improvements.push("Add a dedicated projects section detailing your technical accomplishments.");
  }
  if (!normalized.includes("experience")) {
    improvements.push("Add a professional work or internship experience section.");
  }
  if (wordCount < 150) {
    improvements.push("Your resume is very short. Elaborate on your projects and professional achievements.");
  }
  if (wordCount > 800) {
    improvements.push("Your resume is quite long. Try keeping it under 2 pages for optimal ATS readability.");
  }
  
  if (improvements.length === 0) {
    improvements.push("Perfect structure! Refine grammar and typography to maximize readability.");
  }
  
  return {
    atsScore,
    matchedKeywords: matched,
    missingKeywords: missing,
    improvements
  };
};

const analyzeResume = async (req, res) => {
  try {
    const { resumeText, role, fileName } = req.body;
    const userId = req.user._id;

    if (!resumeText) {
      return res.status(400).json({ success: false, message: "Resume text content is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const currentCredits = user.resumeCredits ?? 10;
    if (currentCredits < 1) {
      return res.status(403).json({
        success: false,
        message: "Insufficient resume analyzer credits. You have 0 credits remaining.",
      });
    }

    let analysis;
    try {
      const response = await analyzeResumeAI({ resume_text: resumeText, role });
      analysis = {
        atsScore: response.atsScore,
        improvements: response.improvements,
        matchedKeywords: response.matchedKeywords,
        missingKeywords: response.missingKeywords,
      };
    } catch (error) {
      console.error("Python AI Resume analysis failed, falling back to local analysis:", error);
      analysis = runLocalAnalysis(resumeText, role);
    }

    user.resumeCredits = currentCredits - 1;
    user.resumeAnalysis = {
      atsScore: analysis.atsScore,
      role: role || "MERN Developer",
      fileName: fileName || "resume.pdf",
      improvements: analysis.improvements,
      analyzedAt: new Date()
    };
    await user.save();

    return res.status(200).json({
      success: true,
      data: {
        score: analysis.atsScore,
        improvements: analysis.improvements,
        matchedKeywords: analysis.matchedKeywords,
        missingKeywords: analysis.missingKeywords,
        fileName: user.resumeAnalysis.fileName,
        role: user.resumeAnalysis.role,
        analyzedAt: user.resumeAnalysis.analyzedAt,
        resumeCredits: user.resumeCredits,
      }
    });
  } catch (error) {
    console.error("Resume analysis controller error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getStudentCodingQuestionById = async (req, res) => {
  try {
    const { questionId } = req.params;
    const CodingQuestion = (await import("../../models/codingQuestion.model.js")).default;
    const question = await CodingQuestion.findById(questionId).lean();

    if (!question || question.status !== "published") {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    const sanitized = {
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
    };

    return res.status(200).json({
      success: true,
      data: sanitized,
    });
  } catch (error) {
    console.error("Get student coding question error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const runCodingQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;
    const { code, language } = req.body;

    const CodingQuestion = (await import("../../models/codingQuestion.model.js")).default;
    const question = await CodingQuestion.findById(questionId);
    if (!question || question.status !== "published") {
      return res.status(404).json({ success: false, message: "Question not found" });
    }

    const { runCodeAI } = await import("../../services/aiPython.service.js");
    const result = await runCodeAI({
      code,
      language,
      questionTitle: question.title,
      testCases: question.testCases || []
    });

    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error("Run coding question error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const submitCodingQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;
    const { code, language } = req.body;
    const userId = req.user._id;

    const CodingQuestion = (await import("../../models/codingQuestion.model.js")).default;
    const question = await CodingQuestion.findById(questionId);
    if (!question || question.status !== "published") {
      return res.status(404).json({ success: false, message: "Question not found" });
    }

    const { evaluateCodeAI } = await import("../../services/aiPython.service.js");
    const evaluation = await evaluateCodeAI({
      code,
      language,
      questionTitle: question.title,
      testCases: question.testCases || []
    });

    const user = await User.findById(userId);
    if (!user.solvedQuestions.includes(questionId)) {
      user.solvedQuestions.push(questionId);
    }

    const metaIdx = user.solvedQuestionsMeta.findIndex(m => m.questionId.toString() === questionId);
    const metaRecord = {
      questionId,
      code,
      language,
      timeComplexity: evaluation.timeComplexity,
      spaceComplexity: evaluation.spaceComplexity,
      score: evaluation.score,
      tips: evaluation.tips,
      issues: evaluation.issues,
      solvedAt: new Date()
    };

    if (metaIdx > -1) {
      user.solvedQuestionsMeta[metaIdx] = metaRecord;
    } else {
      user.solvedQuestionsMeta.push(metaRecord);
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Coding problem solved and evaluated successfully!",
      solvedCount: user.solvedQuestions.length,
      evaluation: metaRecord
    });
  } catch (error) {
    console.error("Submit coding question error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  studentDashboard,
  getStudentInterviews,
  getInterviewHistory,
  addInterviewHistory,
  getStudentCodingQuestions,
  analyzeResume,
  runCodingQuestion,
  submitCodingQuestion,
  getStudentCodingQuestionById,
};
