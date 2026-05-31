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
  Target,
  BookOpen,
  Lightbulb,
  TrendingUp,
  AlertCircle,
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

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* HEADER SECTION */}
        <section className="rounded-[32px] border border-white/10 bg-[linear-gradient(135deg,rgba(6,182,212,0.16),rgba(15,23,42,0.82),rgba(99,102,241,0.08))] p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.24em] text-cyan-300">
                Student dashboard
              </p>
              <h1 className="mt-3 text-4xl font-bold text-white">
                Welcome,{" "}
                <span
                  style={{
                    background: "linear-gradient(135deg, #06b6d4, #818cf8)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {dashboard?.user?.name || "Student"}
                </span>
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
                Track your interview preparation journey, solve coding challenges, and improve your skills with personalized insights and recommendations.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Streak
                </p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  {overview.dailyStreak || 0} days
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Coding Problems
                </p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  {overview.codingProblems || 0}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Available Questions
                </p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  {overview.availableCodingQuestions || 0}
                </p>
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
            className="rounded-[28px] border border-white/10 bg-white/5 p-6"
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                  Practice
                </p>
                <h3 className="mt-2 text-xl font-semibold text-white">
                  Available Coding Questions
                </h3>
              </div>
              <a
                href="/coding"
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white hover:bg-white/10 transition-colors"
                style={{
                  background: "rgba(6,182,212,0.1)",
                  border: "1px solid rgba(6,182,212,0.2)",
                  color: "#22d3ee",
                }}
              >
                View All <ArrowRight size={14} />
              </a>
            </div>

            <div className="space-y-3">
              {availableCodingQuestions.slice(0, 5).map((question) => (
                <div
                  key={question._id}
                  className="flex flex-col gap-3 rounded-[20px] border border-white/10 bg-white/5 p-4 md:flex-row md:items-center md:justify-between hover:bg-white/8 transition-colors cursor-pointer"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Code2 size={16} className="text-cyan-400" />
                      <p className="font-semibold text-white">
                        {question.title}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      {question.category && (
                        <span
                          className="text-xs px-2 py-1 rounded-md"
                          style={{
                            background: "rgba(6,182,212,0.1)",
                            border: "1px solid rgba(6,182,212,0.2)",
                            color: "#22d3ee",
                          }}
                        >
                          {question.category}
                        </span>
                      )}
                      {question.difficulty && (
                        <span
                          className="text-xs px-2 py-1 rounded-md"
                          style={{
                            background:
                              question.difficulty === "Hard"
                                ? "rgba(239,68,68,0.1)"
                                : question.difficulty === "Medium"
                                  ? "rgba(251,146,60,0.1)"
                                  : "rgba(34,197,94,0.1)",
                            border:
                              question.difficulty === "Hard"
                                ? "1px solid rgba(239,68,68,0.2)"
                                : question.difficulty === "Medium"
                                  ? "1px solid rgba(251,146,60,0.2)"
                                  : "1px solid rgba(34,197,94,0.2)",
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
                        <span className="text-xs text-slate-400">
                          {question.companies.slice(0, 2).join(", ")}
                          {question.companies.length > 2 &&
                            ` +${question.companies.length - 2}`}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {question.acceptanceRate !== undefined && (
                      <div className="text-right">
                        <p className="text-xs text-slate-500">Acceptance</p>
                        <p className="text-lg font-semibold text-white">
                          {question.acceptanceRate}%
                        </p>
                      </div>
                    )}
                    <a
                      href={`/coding/${question._id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold"
                      style={{
                        background: "rgba(6,182,212,0.15)",
                        border: "1px solid rgba(6,182,212,0.2)",
                        color: "#22d3ee",
                      }}
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
            className="rounded-[28px] border border-white/10 bg-white/5 p-6"
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                  Interviews
                </p>
                <h3 className="mt-2 text-xl font-semibold text-white">
                  Available Interview Templates
                </h3>
              </div>
              <a
                href="/interviews"
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white hover:bg-white/10 transition-colors"
                style={{
                  background: "rgba(99,102,241,0.1)",
                  border: "1px solid rgba(99,102,241,0.2)",
                  color: "#a78bfa",
                }}
              >
                View All <ArrowRight size={14} />
              </a>
            </div>

            <div className="space-y-3">
              {availableInterviews.slice(0, 5).map((template) => (
                <div
                  key={template._id}
                  className="flex flex-col gap-3 rounded-[20px] border border-white/10 bg-white/5 p-4 md:flex-row md:items-center md:justify-between hover:bg-white/8 transition-colors cursor-pointer"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <BookOpen size={16} className="text-violet-400" />
                      <p className="font-semibold text-white">
                        {template.title}
                      </p>
                    </div>
                    <p className="text-sm text-slate-400 mb-2">
                      {template.description?.slice(0, 80)}...
                    </p>
                    <div className="flex items-center gap-3 flex-wrap">
                      {template.category && (
                        <span
                          className="text-xs px-2 py-1 rounded-md"
                          style={{
                            background: "rgba(167,139,250,0.1)",
                            border: "1px solid rgba(167,139,250,0.2)",
                            color: "#a78bfa",
                          }}
                        >
                          {template.category}
                        </span>
                      )}
                      {template.difficulty && (
                        <span
                          className="text-xs px-2 py-1 rounded-md"
                          style={{
                            background:
                              template.difficulty === "Hard"
                                ? "rgba(239,68,68,0.1)"
                                : template.difficulty === "Medium"
                                  ? "rgba(251,146,60,0.1)"
                                  : "rgba(34,197,94,0.1)",
                            border:
                              template.difficulty === "Hard"
                                ? "1px solid rgba(239,68,68,0.2)"
                                : template.difficulty === "Medium"
                                  ? "1px solid rgba(251,146,60,0.2)"
                                  : "1px solid rgba(34,197,94,0.2)",
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
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold flex-shrink-0"
                    style={{
                      background: "rgba(167,139,250,0.15)",
                      border: "1px solid rgba(167,139,250,0.2)",
                      color: "#a78bfa",
                    }}
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