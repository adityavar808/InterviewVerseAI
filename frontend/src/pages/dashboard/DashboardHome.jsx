import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import StatCard from "../../components/dashboard/StatCard";
import studentService from "../../services/studentApi";
import LoadingSpinner from "../../components/dashboard/LoadingSpinner";
import { motion } from "framer-motion";
import {
  Brain,
  FileText,
  Flame,
  ArrowRight,
  Zap,
  BookOpen,
  Sparkles,
  CheckSquare,
  Square,
  Lightbulb,
  Target,
  ChevronRight,
  BarChart3,
  Award,
  Shield,
  TrendingUp,
  Clock,
  Briefcase,
  Play,
} from "lucide-react";

const placementTips = [
  "Structure behavioral responses using the STAR method (Situation, Task, Action, Result).",
  "Always articulate your thought process aloud when explaining technical concepts.",
  "Ensure your resume includes quantitative metrics (e.g. 'improved API response speed by 35%').",
  "Tailor your technical keywords to match the exact job requirements before submitting applications.",
  "Practice mock interviews twice a week to build interview confidence and smooth delivery.",
];

const initialChecklist = [
  { id: 1, text: "Upload resume for ATS compatibility scan", completed: true, link: "/resume-analyzer" },
  { id: 2, text: "Practice 1 Voice AI Mock Interview round", completed: false, link: "/interviews" },
  { id: 3, text: "Review technical concepts & feedback notes", completed: false, link: "/analytics" },
  { id: 4, text: "Complete candidate profile details", completed: false, link: "/profile" },
];

const skillBreakdown = [
  { title: "Communication & Clarity", score: 88, color: "#67e8f9" },
  { title: "Technical Depth & Accuracy", score: 76, color: "#a78bfa" },
  { title: "Confidence & Articulation", score: 82, color: "#4ade80" },
  { title: "Problem Solving Logic", score: 70, color: "#fb923c" },
];

const DashboardHome = () => {
  const [dashboard, setDashboard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [checklist, setChecklist] = useState(initialChecklist);
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setIsLoading(true);
        const response = await studentService.getDashboard();
        setDashboard(response);
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Unable to load dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const toggleChecklist = (id) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center backdrop-blur-xl">
          <LoadingSpinner label="Initializing Candidate Command Center..." />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-5 text-xs text-rose-300">
          {error}
        </div>
      </DashboardLayout>
    );
  }

  const overview = dashboard?.overview || {};
  const user = dashboard?.user || {};
  const availableInterviews = dashboard?.availableInterviews || [];

  const readinessScore = Math.min(
    100,
    Math.max(
      0,
      Math.round(
        ((overview.totalInterviews || 0) / 10) * 50 + (overview.atsResumeScore || 0) * 0.5
      )
    )
  );

  const completedCount = checklist.filter((c) => c.completed).length;
  const progressPct = Math.round((completedCount / checklist.length) * 100);

  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* HERO COMMAND CENTER BANNER */}
        <motion.section
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative overflow-hidden rounded-2xl border border-cyan-500/25 bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950/50 p-6 backdrop-blur-2xl shadow-2xl"
        >
          {/* Glowing background circles */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-cyan-500/15 blur-3xl" />
            <div className="absolute -bottom-20 right-0 h-64 w-64 rounded-full bg-indigo-500/15 blur-3xl" />
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-400 via-sky-400 to-violet-500" />
          </div>

          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            {/* Left Welcome Details */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-300 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <Sparkles size={13} className="text-cyan-400" />
                <span>AI Candidate Dashboard 2.0</span>
              </div>

              <h1 className="text-2xl font-extrabold text-white tracking-tight sm:text-3xl lg:text-4xl">
                Ready for placement,{" "}
                <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
                  {user?.name || "Candidate"}
                </span>
                ! 👋
              </h1>

              <p className="max-w-xl text-xs md:text-sm text-slate-300 leading-relaxed">
                Elevate your interview scores, audit ATS resume compatibility, and track performance benchmarks in real-time.
              </p>

              {/* Badges strip */}
              <div className="pt-1 flex flex-wrap items-center gap-2.5 text-xs">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium">
                  <Flame size={13} />
                  {overview.dailyStreak || 1} Day Practice Streak
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-medium">
                  <Zap size={13} />
                  {user.interviewCredits ?? 10} AI Credits Remaining
                </span>
              </div>
            </div>

            {/* Right Readiness Gauge Widget */}
            <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-slate-900/80 p-4 shadow-xl shrink-0 backdrop-blur-xl">
              <div className="relative flex h-16 w-16 items-center justify-center">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 48 48">
                  <circle cx="24" cy="24" r="20" className="fill-none stroke-slate-800" strokeWidth="4" />
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    className="fill-none stroke-cyan-400 transition-all duration-1000"
                    strokeWidth="4"
                    strokeDasharray="125.6"
                    strokeDashoffset={125.6 - (readinessScore / 100) * 125.6}
                    strokeLinecap="round"
                    style={{ filter: "drop-shadow(0 0 8px rgba(34,211,238,0.4))" }}
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-sm font-extrabold text-white">{readinessScore}%</span>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Readiness Score</p>
                <h4 className="text-sm font-bold text-cyan-300 mt-0.5">
                  {readinessScore >= 80 ? "Placement Ready 🚀" : readinessScore >= 60 ? "On Track 📈" : "Practice Needed 🎯"}
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Based on mock interviews & ATS scan</p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* 4 STAT CARDS GRID */}
        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Interviews"
            value={overview.totalInterviews || 0}
            icon={<Brain size={18} />}
            color={{
              bg: "rgba(6,182,212,0.1)",
              border: "rgba(6,182,212,0.25)",
              icon: "#22d3ee",
              glow: "rgba(6,182,212,0.15)",
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
            icon={<FileText size={18} />}
            color={{
              bg: "rgba(74,222,128,0.1)",
              border: "rgba(74,222,128,0.25)",
              icon: "#4ade80",
              glow: "rgba(34,197,94,0.15)",
            }}
            trend={{
              value: `+${overview.resumeImprovement || 0}%`,
              positive: true,
              label: "vs last scan",
            }}
          />

          <StatCard
            title="Avg Interview Score"
            value={`${overview.avgScore || 78}%`}
            icon={<Award size={18} />}
            color={{
              bg: "rgba(167,139,250,0.1)",
              border: "rgba(167,139,250,0.25)",
              icon: "#a78bfa",
              glow: "rgba(167,139,250,0.15)",
            }}
            trend={{
              value: "Top 15%",
              positive: true,
              label: "candidate pool",
            }}
          />

          <StatCard
            title="Interview Credits"
            value={`${user.interviewCredits ?? 10}`}
            icon={<Zap size={18} />}
            color={{
              bg: "rgba(251,146,60,0.1)",
              border: "rgba(251,146,60,0.25)",
              icon: "#fb923c",
              glow: "rgba(249,115,22,0.15)",
            }}
            trend={{
              value: "Active",
              positive: true,
              label: "full access",
            }}
          />
        </div>

        {/* MIDDLE SECTION: PERFORMANCE BREAKDOWN & QUICK ACTION HUB */}
        <div className="grid gap-5 lg:grid-cols-12">
          {/* LEFT 7 COLS: PERFORMANCE RADAR & SKILL DIMENSIONS */}
          <div className="lg:col-span-7 space-y-4">
            <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 space-y-4 backdrop-blur-xl shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <BarChart3 size={16} className="text-cyan-400" />
                    AI Interview Evaluation Breakdown
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Average scores across recent mock interviews</p>
                </div>
                <Link to="/analytics" className="text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1">
                  Full Analytics <ChevronRight size={12} />
                </Link>
              </div>

              {/* Progress bars */}
              <div className="space-y-3 pt-1">
                {skillBreakdown.map((item) => (
                  <div key={item.title} className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-300 font-medium">{item.title}</span>
                      <span className="font-bold tabular-nums" style={{ color: item.color }}>{item.score}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.score}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="h-full rounded-full"
                        style={{
                          background: item.color,
                          boxShadow: `0 0 8px ${item.color}66`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Action Hub */}
            <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 space-y-3.5 backdrop-blur-xl shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white flex items-center gap-2">
                  <Target size={16} className="text-cyan-400" />
                  Quick Action Hub
                </span>
                <span className="text-[11px] text-slate-400">1-Click Launch</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Link
                  to="/interviews"
                  className="group flex items-center gap-3.5 rounded-xl border border-cyan-500/25 bg-cyan-500/10 p-3.5 hover:bg-cyan-500/20 hover:border-cyan-500/50 transition-all cursor-pointer shadow-md"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-400 text-slate-950 font-bold shadow-md shadow-cyan-400/30 group-hover:scale-105 transition-transform">
                    <Brain size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">Start Mock Interview</p>
                    <p className="text-[11px] text-cyan-300/80">Voice & Video AI round</p>
                  </div>
                </Link>

                <Link
                  to="/resume-analyzer"
                  className="group flex items-center gap-3.5 rounded-xl border border-emerald-500/25 bg-emerald-500/10 p-3.5 hover:bg-emerald-500/20 hover:border-emerald-500/50 transition-all cursor-pointer shadow-md"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-400 text-slate-950 font-bold shadow-md shadow-emerald-400/30 group-hover:scale-105 transition-transform">
                    <FileText size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">ATS Resume Audit</p>
                    <p className="text-[11px] text-emerald-300/80">Instant score & gap fix</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* RIGHT 5 COLS: PREPARATION CHECKLIST & DAILY TIP */}
          <div className="lg:col-span-5 space-y-4">
            {/* Preparation Checklist */}
            <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 space-y-3.5 backdrop-blur-xl shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white flex items-center gap-2">
                  <CheckSquare size={16} className="text-emerald-400" />
                  Placement Checklist
                </span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  {completedCount}/{checklist.length} Done ({progressPct}%)
                </span>
              </div>

              {/* Progress bar */}
              <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-400 transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>

              <div className="space-y-2 pt-1">
                {checklist.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => toggleChecklist(item.id)}
                    className={`flex items-center justify-between rounded-xl border p-3 text-xs transition cursor-pointer ${
                      item.completed
                        ? "border-emerald-500/20 bg-emerald-500/10 text-slate-400 line-through"
                        : "border-white/5 bg-white/[0.02] text-slate-200 hover:border-white/20 hover:bg-white/[0.04]"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {item.completed ? (
                        <CheckSquare size={16} className="text-emerald-400 shrink-0" />
                      ) : (
                        <Square size={16} className="text-slate-500 shrink-0" />
                      )}
                      <span>{item.text}</span>
                    </div>
                    <Link
                      to={item.link}
                      onClick={(e) => e.stopPropagation()}
                      className="text-[10px] font-semibold text-cyan-400 hover:underline flex items-center gap-0.5 shrink-0"
                    >
                      Go <ChevronRight size={10} />
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Daily Placement Tip Box */}
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 space-y-2 backdrop-blur-xl shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lightbulb size={16} className="text-amber-400" />
                  <span className="text-xs font-bold text-amber-300">Placement Tip of the Day</span>
                </div>
                <button
                  onClick={() => setTipIndex((prev) => (prev + 1) % placementTips.length)}
                  className="text-[10px] font-semibold text-amber-400/80 hover:text-amber-300 cursor-pointer"
                >
                  Next Tip ➔
                </button>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-normal">
                "{placementTips[tipIndex]}"
              </p>
            </div>
          </div>
        </div>

        {/* RECOMMENDED INTERVIEW TRACKS STRIP */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 space-y-3.5 backdrop-blur-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Briefcase size={16} className="text-cyan-400" />
                Featured AI Practice Tracks
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Select a role track to instantly start practicing</p>
            </div>
            <Link
              to="/interviews"
              className="text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1"
            >
              Explore All Tracks <ArrowRight size={12} />
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Frontend Developer", category: "Technical", diff: "Medium", color: "#22d3ee" },
              { title: "Backend Developer", category: "System Architecture", diff: "Hard", color: "#a78bfa" },
              { title: "HR Behavioral", category: "Communication", diff: "Easy", color: "#4ade80" },
              { title: "AI Adaptive Round", category: "Voice AI", diff: "Adaptive", color: "#fb923c" },
            ].map((track, i) => (
              <div
                key={i}
                className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] p-3.5 hover:border-cyan-400/40 hover:bg-white/[0.05] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-wider"
                      style={{ background: `${track.color}15`, color: track.color, border: `1px solid ${track.color}30` }}
                    >
                      {track.diff}
                    </span>
                    <Play size={12} className="text-slate-500 group-hover:text-cyan-400 transition-colors" />
                  </div>
                  <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">{track.title}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">{track.category}</p>
                </div>

                <Link
                  to="/interviews"
                  className="mt-3 w-full py-1.5 rounded-lg bg-white/5 border border-white/10 group-hover:bg-cyan-400 group-hover:text-slate-950 group-hover:border-cyan-400 text-center text-[11px] font-bold text-slate-300 transition-all block"
                >
                  Start Practice
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardHome;