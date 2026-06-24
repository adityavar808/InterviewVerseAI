import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import StatCard from "../../components/dashboard/StatCard";
import PerformanceChart from "../../components/dashboard/PerformanceChart";
import RecentInterviews from "../../components/dashboard/RecentInterviews";
import AIRecommendations from "../../components/dashboard/AIRecommendations";
import PerformanceStats from "../../components/analytics/PerformanceStats";
import SkillRadarChart from "../../components/analytics/SkillRadarChart";
import ActivityHeatmap from "../../components/analytics/ActivityHeatmap";
import WeaknessAnalysis from "../../components/analytics/WeaknessAnalysis";
import studentService from "../../services/studentApi";
import LoadingSpinner from "../../components/dashboard/LoadingSpinner";
import { motion } from "framer-motion";
import {
  Brain,
  FileText,
  Code2,
  Flame,
  Clock,
  CheckCircle2,
  ArrowRight,
  Zap,
  BookOpen,
  Lightbulb,
  TrendingUp,
  AlertCircle,
  Sparkles,
} from "lucide-react";

const recentActivity = [
  {
    icon: Brain,
    label: "Completed AI Interview",
    sub: "System Design Round",
    time: "2h ago",
    color: "#22d3ee",
  },
  {
    icon: Code2,
    label: "Solved LeetCode Problem",
    sub: "Binary Search — Medium",
    time: "5h ago",
    color: "#a78bfa",
  },
  {
    icon: FileText,
    label: "Resume Score Updated",
    sub: "ATS Score improved to 88%",
    time: "1d ago",
    color: "#4ade80",
  },
  {
    icon: Flame,
    label: "Streak Milestone",
    sub: "12 days — Personal best!",
    time: "1d ago",
    color: "#fb923c",
  },
];

const upcomingTasks = [
  { label: "Mock Interview — React JS", due: "Today", done: false },
  { label: "Review DSA Flashcards", due: "Today", done: true },
  { label: "System Design: URL Shortener", due: "Tomorrow", done: false },
  { label: "Update Resume — Projects", due: "This week", done: false },
];

const DashboardHome = () => {
  const [dashboard, setDashboard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setIsLoading(true);
        const response =
          await studentService.getDashboard();
        setDashboard(response);
      } catch (requestError) {
        setError(
          requestError.response?.data
            ?.message ||
            "Unable to load dashboard",
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-12">
          <LoadingSpinner label="Loading your dashboard" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="rounded-[28px] border border-rose-400/20 bg-rose-400/10 p-6 text-rose-300">
          {error}
        </div>
      </DashboardLayout>
    );
  }

  const overview = dashboard?.overview || {};
  const performanceChart =
    dashboard?.charts?.performanceChart || [];
  const skillRadar =
    dashboard?.charts?.skillRadar || [];
  const weaknesses = dashboard?.weaknesses || [];
  const recentInterviews =
    dashboard?.recentInterviews || [];
  const availableInterviews = dashboard?.availableInterviews || [];
  const availableCodingQuestions = dashboard?.availableCodingQuestions || [];

  const readinessScore = Math.min(100, Math.max(0, Math.round(
    ((overview.codingProblems || 0) / 250) * 40 +
    ((overview.totalInterviews || 0) / 15) * 30 +
    (overview.atsResumeScore || 0) * 0.3
  )));

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* HEADER SECTION */}
        <section className="relative overflow-hidden bg-white/[0.035] border border-white/10 backdrop-blur-xl rounded-[32px] p-6 lg:p-8">
          {/* Glow and top line border */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-cyan-500/[0.12] blur-[80px] animate-pulse duration-[8s]" />
            <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-purple-500/[0.12] blur-[80px] animate-pulse duration-[10s]" />
            <div className="absolute top-0 left-0 right-0 h-[2px] rounded-full"
                 style={{ background: "linear-gradient(90deg, transparent, rgba(6,182,212,0.8) 20%, rgba(139,92,246,0.8) 50%, rgba(244,114,182,0.6) 80%, transparent)" }} />
          </div>

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[10px] font-mono uppercase tracking-widest mb-3 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
                <Sparkles size={11} className="text-cyan-400 animate-pulse" />
                Student Dashboard
              </div>
              
              <h1 className="mt-2 text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                Welcome,{" "}
                <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  {dashboard?.user?.name || "Student"}
                </span>
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-300">
                Track your interview preparation journey, solve coding challenges, and improve your skills with personalized insights and recommendations.
              </p>
            </div>

            <div className="relative group/readiness shrink-0 w-full lg:w-auto">
              {/* Tooltip */}
              <div className="absolute bottom-full right-0 mb-3 w-64 p-3 rounded-2xl border border-white/10 bg-[#0b0f19]/95 backdrop-blur-md shadow-2xl opacity-0 translate-y-1 group-hover/readiness:opacity-100 group-hover/readiness:translate-y-0 transition-all duration-300 pointer-events-none z-50">
                <p className="text-[11px] text-white font-semibold mb-1 flex items-center gap-1.5">
                  <Sparkles size={13} className="text-cyan-400 animate-pulse" />
                  Interview Readiness Score
                </p>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  Based on your coding problems solved ({overview.codingProblems || 0}), total mock interviews ({overview.totalInterviews || 0}), and ATS resume score ({overview.atsResumeScore || 0}%).
                </p>
              </div>

              {/* Circular Gauge Card */}
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.06] p-3.5 transition-all duration-300 flex items-center gap-4 hover:border-cyan-500/30 cursor-default hover:-translate-y-0.5 group-hover/readiness:shadow-[0_0_20px_rgba(6,182,212,0.15)]">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/[0.02] to-cyan-500/0 opacity-0 group-hover/readiness:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-0 left-4 right-4 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent opacity-0 group-hover/readiness:opacity-100 transition-opacity duration-300" />
                
                {/* SVG Progress Circle */}
                <div className="relative w-14 h-14 flex items-center justify-center flex-shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 56 56">
                    {/* Background track */}
                    <circle
                      cx="28"
                      cy="28"
                      r="24"
                      className="stroke-white/[0.04] fill-none"
                      strokeWidth="4.5"
                    />
                    {/* Foreground progress path with gradient */}
                    <circle
                      cx="28"
                      cy="28"
                      r="24"
                      className="fill-none transition-all duration-1000 ease-out"
                      strokeWidth="4.5"
                      strokeDasharray="150.8"
                      strokeDashoffset={150.8 - (readinessScore / 100) * 150.8}
                      strokeLinecap="round"
                      stroke="url(#readinessGradient)"
                    />
                    <defs>
                      <linearGradient id="readinessGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#22d3ee" />
                        <stop offset="100%" stopColor="#818cf8" />
                      </linearGradient>
                    </defs>
                  </svg>
                  {/* Inside Text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-[13px] font-extrabold text-white leading-none">{readinessScore}%</span>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 font-mono font-semibold">Readiness</p>
                  <p className="text-sm font-bold text-white mt-0.5">
                    {readinessScore >= 80 ? "Excellent Progress" : readinessScore >= 60 ? "Ready to Apply" : "Needs Practice"}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Keep preparing!</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STATS GRID */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"
        >
          <StatCard
            title="Total Interviews"
            value={overview.totalInterviews || 0}
            icon={<Brain size={22} />}
            color={{
              bg: "rgba(6,182,212,0.12)",
              border: "rgba(6,182,212,0.25)",
              icon: "#22d3ee",
              glow: "rgba(6,182,212,0.12)",
            }}
            trend={{
              value: `+${overview.thisWeekInterviews || 0}`,
              positive: true,
              label: "this week",
            }}
          />
          <StatCard
            title="ATS Resume Score"
            value={`${overview.atsResumeScore || 0}%`}
            icon={<FileText size={22} />}
            color={{
              bg: "rgba(74,222,128,0.12)",
              border: "rgba(74,222,128,0.25)",
              icon: "#4ade80",
              glow: "rgba(34,197,94,0.1)",
            }}
            trend={{
              value: `+${overview.resumeImprovement || 0}%`,
              positive: true,
              label: "vs last scan",
            }}
          />
          <StatCard
            title="Coding Problems Solved"
            value={overview.codingProblems || 0}
            icon={<Code2 size={22} />}
            color={{
              bg: "rgba(167,139,250,0.12)",
              border: "rgba(167,139,250,0.25)",
              icon: "#a78bfa",
              glow: "rgba(139,92,246,0.1)",
            }}
            trend={{
              value: `+${overview.problemsThisWeek || 0}`,
              positive: true,
              label: "this week",
            }}
          />
          <StatCard
            title="Daily Streak"
            value={`${overview.dailyStreak || 0} days`}
            icon={<Flame size={22} />}
            color={{
              bg: "rgba(251,146,60,0.12)",
              border: "rgba(251,146,60,0.25)",
              icon: "#fb923c",
              glow: "rgba(249,115,22,0.1)",
            }}
            trend={{
              value: "Best!",
              positive: true,
              label: "personal record",
            }}
          />
        </motion.div>

        {/* PERFORMANCE CHART */}
        {performanceChart.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.12 }}
          >
            <PerformanceChart data={performanceChart} />
          </motion.div>
        )}

        {/* AVAILABLE CODING QUESTIONS */}
        {availableCodingQuestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.14 }}
            className="relative overflow-hidden bg-white/[0.035] border border-white/10 backdrop-blur-xl rounded-3xl p-5"
          >
            {/* Glow and top line border */}
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -top-20 -left-12 h-56 w-56 rounded-full bg-cyan-500/[0.05] blur-[50px]" />
              <div className="absolute top-0 left-0 right-0 h-[2px] rounded-full"
                   style={{ background: "linear-gradient(90deg, rgba(6,182,212,0.5), transparent)" }} />
            </div>

            <div className="relative mb-6 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-slate-500 font-semibold">
                  Practice
                </p>
                <h3 className="mt-1 text-lg font-semibold text-white tracking-tight">
                  Available Coding Questions
                </h3>
              </div>
              <a
                href="/coding"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 hover:bg-cyan-500/15 active:scale-[0.98] transition-all duration-300 cursor-pointer"
              >
                View All <ArrowRight size={12} />
              </a>
            </div>

            <div className="relative space-y-3">
              {availableCodingQuestions.slice(0, 5).map((question) => (
                <div
                  key={question._id}
                  className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 md:flex-row md:items-center md:justify-between hover:bg-white/[0.05] transition-all duration-300 cursor-pointer active:scale-[0.99]"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2.5">
                      <Code2 size={16} className="text-cyan-400" />
                      <p className="font-semibold text-white text-sm">
                        {question.title}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      {question.category && (
                        <span
                          className="text-xs px-2.5 py-0.5 rounded-lg border bg-cyan-500/10 border-cyan-500/20 text-cyan-300 font-medium"
                        >
                          {question.category}
                        </span>
                      )}
                      {question.difficulty && (
                        <span
                          className="text-xs px-2.5 py-0.5 rounded-lg border font-semibold"
                          style={{
                            background:
                              question.difficulty === "Hard"
                                ? "rgba(239,68,68,0.1)"
                                : question.difficulty === "Medium"
                                  ? "rgba(251,146,60,0.1)"
                                  : "rgba(34,197,94,0.1)",
                            borderColor:
                              question.difficulty === "Hard"
                                ? "rgba(239,68,68,0.2)"
                                : question.difficulty === "Medium"
                                  ? "rgba(251,146,60,0.2)"
                                  : "rgba(34,197,94,0.2)",
                            color:
                              question.difficulty === "Hard"
                                ? "#f87171"
                                : question.difficulty === "Medium"
                                  ? "#fb923c"
                                  : "#4ade80",
                          }}
                        >
                          {question.difficulty}
                        </span>
                      )}
                      {question.companies && question.companies.length > 0 && (
                        <span className="text-xs text-slate-500 font-medium">
                          {question.companies.slice(0, 2).join(", ")}
                          {question.companies.length > 2 &&
                            ` +${question.companies.length - 2}`}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {question.acceptanceRate !== undefined && (
                      <div className="text-right pr-2">
                        <p className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">Acceptance</p>
                        <p className="text-base font-bold text-white leading-tight mt-0.5">
                          {question.acceptanceRate}%
                        </p>
                      </div>
                    )}
                    <a
                      href={`/coding/${question._id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-cyan-400 hover:bg-cyan-300 text-slate-950 shadow-[0_0_15px_rgba(34,211,238,0.2)] active:scale-[0.98] transition-all duration-300 cursor-pointer"
                    >
                      Solve <ArrowRight size={12} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* AVAILABLE INTERVIEW TEMPLATES */}
        {availableInterviews.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.16 }}
            className="relative overflow-hidden bg-white/[0.035] border border-white/10 backdrop-blur-xl rounded-3xl p-5"
          >
            {/* Glow and top line border */}
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -top-20 -left-12 h-56 w-56 rounded-full bg-purple-500/[0.05] blur-[50px]" />
              <div className="absolute top-0 left-0 right-0 h-[2px] rounded-full"
                   style={{ background: "linear-gradient(90deg, rgba(167,139,250,0.5), transparent)" }} />
            </div>

            <div className="relative mb-6 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-slate-500 font-semibold">
                  Interviews
                </p>
                <h3 className="mt-1 text-lg font-semibold text-white tracking-tight">
                  Available Interview Templates
                </h3>
              </div>
              <a
                href="/interviews"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-purple-500/10 border border-purple-500/20 text-purple-300 hover:bg-purple-500/15 active:scale-[0.98] transition-all duration-300 cursor-pointer"
              >
                View All <ArrowRight size={12} />
              </a>
            </div>

            <div className="relative space-y-3">
              {availableInterviews.slice(0, 5).map((template) => (
                <div
                  key={template._id}
                  className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 md:flex-row md:items-center md:justify-between hover:bg-white/[0.05] transition-all duration-300 cursor-pointer active:scale-[0.99]"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <BookOpen size={16} className="text-violet-400" />
                      <p className="font-semibold text-white text-sm">
                        {template.title}
                      </p>
                    </div>
                    <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                      {template.description?.slice(0, 120)}...
                    </p>
                    <div className="flex items-center gap-3 flex-wrap">
                      {template.category && (
                        <span
                          className="text-xs px-2.5 py-0.5 rounded-lg border bg-purple-500/10 border-purple-500/20 text-purple-300 font-medium"
                        >
                          {template.category}
                        </span>
                      )}
                      {template.difficulty && (
                        <span
                          className="text-xs px-2.5 py-0.5 rounded-lg border font-semibold"
                          style={{
                            background:
                              template.difficulty === "Hard"
                                ? "rgba(239,68,68,0.1)"
                                : template.difficulty === "Medium"
                                  ? "rgba(251,146,60,0.1)"
                                  : "rgba(34,197,94,0.1)",
                            borderColor:
                              template.difficulty === "Hard"
                                ? "rgba(239,68,68,0.2)"
                                : template.difficulty === "Medium"
                                  ? "rgba(251,146,60,0.2)"
                                  : "rgba(34,197,94,0.2)",
                            color:
                              template.difficulty === "Hard"
                                ? "#f87171"
                                : template.difficulty === "Medium"
                                  ? "#fb923c"
                                  : "#4ade80",
                          }}
                        >
                          {template.difficulty}
                        </span>
                      )}
                    </div>
                  </div>
                  <a
                    href={`/interviews/${template._id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-purple-450 hover:bg-purple-350 text-slate-950 shadow-[0_0_15px_rgba(167,139,250,0.2)] active:scale-[0.98] transition-all duration-300 cursor-pointer flex-shrink-0"
                  >
                    Start <ArrowRight size={12} />
                  </a>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* DETAILED PERFORMANCE STATS */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.18 }}
        >
          <PerformanceStats stats={dashboard?.charts?.performanceStats} />
        </motion.div>

        {/* ANALYTICS SECTION — Skill Radar & Activity Heatmap */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <SkillRadarChart data={skillRadar} />
          <ActivityHeatmap data={dashboard?.charts?.activityHeatmap} />
        </motion.div>

        {/* WEAKNESS ANALYSIS */}
        {weaknesses.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.22 }}
          >
            <WeaknessAnalysis weaknesses={weaknesses} />
          </motion.div>
        )}

        {/* RECENT INTERVIEWS */}
        {recentInterviews.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.24 }}
          >
            <RecentInterviews interviews={recentInterviews} />
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DashboardHome;