import DashboardLayout from "../../layouts/DashboardLayout";
import StatCard from "../../components/dashboard/StatCard";
import PerformanceChart from "../../components/dashboard/PerformanceChart";
import RecentInterviews from "../../components/dashboard/RecentInterviews";
import AIRecommendations from "../../components/dashboard/AIRecommendations";
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
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-start justify-between"
        >
          <div>
            {/* Badge */}
            <div
              className="inline-flex items-center gap-1.5 mb-3 px-3 py-1 rounded-full"
              style={{
                background: "rgba(6,182,212,0.1)",
                border: "1px solid rgba(6,182,212,0.2)",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span
                className="text-cyan-400 font-mono uppercase tracking-widest"
                style={{ fontSize: "9px" }}
              >
                AI Interview Platform
              </span>
            </div>

            <h1 className="text-4xl font-bold text-slate-50 leading-tight">
              Welcome Back,{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #06b6d4, #818cf8)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Aditya 👋
              </span>
            </h1>
            <p className="text-slate-400 mt-2 text-sm">
              Track your AI interview preparation journey. You're on a 12-day
              streak — keep it going!
            </p>
          </div>

          {/* Quick action */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-[#020617] flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, #06b6d4, #0891b2)",
              boxShadow: "0 0 20px rgba(6,182,212,0.3)",
            }}
          >
            <Zap size={15} />
            Start Interview
          </motion.button>
        </motion.div>

        {/* STATS GRID */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4"
        >
          <StatCard
            title="Total Interviews"
            value="24"
            icon={<Brain size={22} />}
            color={{
              bg: "rgba(6,182,212,0.12)",
              border: "rgba(6,182,212,0.25)",
              icon: "#22d3ee",
              glow: "rgba(6,182,212,0.12)",
            }}
            trend={{ value: "+3", positive: true, label: "this week" }}
          />
          <StatCard
            title="ATS Resume Score"
            value="88%"
            icon={<FileText size={22} />}
            color={{
              bg: "rgba(74,222,128,0.12)",
              border: "rgba(74,222,128,0.25)",
              icon: "#4ade80",
              glow: "rgba(34,197,94,0.1)",
            }}
            trend={{ value: "+5%", positive: true, label: "vs last scan" }}
          />
          <StatCard
            title="Coding Problems"
            value="136"
            icon={<Code2 size={22} />}
            color={{
              bg: "rgba(167,139,250,0.12)",
              border: "rgba(167,139,250,0.25)",
              icon: "#a78bfa",
              glow: "rgba(139,92,246,0.1)",
            }}
            trend={{ value: "+8", positive: true, label: "this week" }}
          />
          <StatCard
            title="Daily Streak"
            value="12 Days"
            icon={<Flame size={22} />}
            color={{
              bg: "rgba(251,146,60,0.12)",
              border: "rgba(251,146,60,0.25)",
              icon: "#fb923c",
              glow: "rgba(249,115,22,0.1)",
            }}
            trend={{ value: "Best!", positive: true, label: "personal record" }}
          />
        </motion.div>

        <PerformanceChart />

        <RecentInterviews />

        <AIRecommendations />

        {/* BOTTOM ROW — Activity + Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Recent Activity */}
          <div
            className="rounded-2xl p-5 relative overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.04)",
              backdropFilter: "blur(24px)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {/* Shimmer */}
            <div
              className="absolute top-0 left-8 right-8 h-px"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(6,182,212,0.35), transparent)",
              }}
            />

            <div className="flex items-center justify-between mb-5">
              <div>
                <p
                  className="text-slate-500 font-mono uppercase tracking-widest mb-0.5"
                  style={{ fontSize: "9px" }}
                >
                  Activity
                </p>
                <h3 className="text-slate-100 font-semibold text-base">
                  Recent Progress
                </h3>
              </div>
              <button className="flex items-center gap-1 text-cyan-400 text-xs hover:text-cyan-300 transition-colors">
                View all <ArrowRight size={12} />
              </button>
            </div>

            <div className="space-y-3">
              {recentActivity.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-xl transition-all"
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.05)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        "rgba(255,255,255,0.05)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background =
                        "rgba(255,255,255,0.02)";
                    }}
                  >
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{
                        background: `${item.color}18`,
                        border: `1px solid ${item.color}30`,
                      }}
                    >
                      <Icon size={16} style={{ color: item.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-200 text-sm font-medium truncate">
                        {item.label}
                      </p>
                      <p className="text-slate-500 text-xs truncate">
                        {item.sub}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-slate-600 text-xs flex-shrink-0">
                      <Clock size={11} />
                      {item.time}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upcoming Tasks */}
          <div
            className="rounded-2xl p-5 relative overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.04)",
              backdropFilter: "blur(24px)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {/* Shimmer */}
            <div
              className="absolute top-0 left-8 right-8 h-px"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(139,92,246,0.35), transparent)",
              }}
            />

            <div className="flex items-center justify-between mb-5">
              <div>
                <p
                  className="text-slate-500 font-mono uppercase tracking-widest mb-0.5"
                  style={{ fontSize: "9px" }}
                >
                  Tasks
                </p>
                <h3 className="text-slate-100 font-semibold text-base">
                  Upcoming Goals
                </h3>
              </div>
              <div
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                style={{
                  background: "rgba(167,139,250,0.1)",
                  border: "1px solid rgba(167,139,250,0.2)",
                }}
              >
                <Target size={11} className="text-violet-400" />
                <span className="text-violet-400 text-xs">
                  {upcomingTasks.filter((t) => !t.done).length} pending
                </span>
              </div>
            </div>

            <div className="space-y-2.5">
              {upcomingTasks.map((task, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer"
                  style={{
                    background: task.done
                      ? "rgba(74,222,128,0.04)"
                      : "rgba(255,255,255,0.02)",
                    border: task.done
                      ? "1px solid rgba(74,222,128,0.12)"
                      : "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <CheckCircle2
                    size={18}
                    style={{
                      color: task.done ? "#4ade80" : "rgba(100,116,139,0.5)",
                      flexShrink: 0,
                    }}
                  />
                  <span
                    className="flex-1 text-sm"
                    style={{
                      color: task.done
                        ? "rgba(148,163,184,0.5)"
                        : "rgba(226,232,240,0.9)",
                      textDecoration: task.done ? "line-through" : "none",
                    }}
                  >
                    {task.label}
                  </span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-md flex-shrink-0"
                    style={{
                      background:
                        task.due === "Today"
                          ? "rgba(6,182,212,0.1)"
                          : "rgba(255,255,255,0.05)",
                      color:
                        task.due === "Today"
                          ? "#22d3ee"
                          : "rgba(100,116,139,0.8)",
                      border:
                        task.due === "Today"
                          ? "1px solid rgba(6,182,212,0.2)"
                          : "1px solid rgba(255,255,255,0.05)",
                    }}
                  >
                    {task.due}
                  </span>
                </div>
              ))}
            </div>

            {/* Progress bar */}
            <div className="mt-5">
              <div className="flex justify-between text-xs text-slate-500 mb-2">
                <span>Weekly Progress</span>
                <span className="text-cyan-400">
                  {Math.round(
                    (upcomingTasks.filter((t) => t.done).length /
                      upcomingTasks.length) *
                      100,
                  )}
                  %
                </span>
              </div>
              <div
                className="w-full h-1.5 rounded-full overflow-hidden"
                style={{ background: "rgba(255,255,255,0.06)" }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${
                      (upcomingTasks.filter((t) => t.done).length /
                        upcomingTasks.length) *
                      100
                    }%`,
                    background: "linear-gradient(90deg, #06b6d4, #818cf8)",
                  }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardHome;
