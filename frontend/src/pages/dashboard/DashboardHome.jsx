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
  Sparkles,
  CheckSquare,
  Square,
  Lightbulb,
  Target,
  ChevronRight,
  BarChart3,
  Award,
  Briefcase,
  Play,
} from "lucide-react";

const placementTips = [
  "Structure behavioral responses using the STAR method (Situation, Task, Action, Result).",
  "Always articulate your thought process aloud when explaining technical concepts.",
  "Ensure your resume includes quantitative metrics (e.g. 'improved API speed by 35%').",
  "Tailor your technical keywords to match job requirements before applying.",
  "Practice mock interviews twice a week to build confidence and smooth delivery.",
];

const initialChecklist = [
  { id: 1, text: "Upload resume for ATS scan", completed: true, link: "/resume-analyzer" },
  { id: 2, text: "Practice 1 Voice AI Mock round", completed: false, link: "/interviews" },
  { id: 3, text: "Review technical notes & feedback", completed: false, link: "/analytics" },
  { id: 4, text: "Complete candidate profile details", completed: false, link: "/profile" },
];

const skillBreakdown = [
  { title: "Communication", score: 88, color: "#67e8f9" },
  { title: "Technical Depth", score: 76, color: "#a78bfa" },
  { title: "Confidence", score: 82, color: "#4ade80" },
  { title: "Problem Solving", score: 70, color: "#fb923c" },
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
        <div className="rounded-xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-xl">
          <LoadingSpinner label="Loading Command Center..." />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-xs text-rose-300">
          {error}
        </div>
      </DashboardLayout>
    );
  }

  const overview = dashboard?.overview || {};
  const user = dashboard?.user || {};

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
      <div className="space-y-3 max-w-[1600px] mx-auto">
        {/* COMPACT HERO COMMAND BANNER */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-xl border border-cyan-500/20 bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950/40 p-3.5 md:p-4 backdrop-blur-xl shadow-lg"
        >
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-16 -left-16 h-56 w-56 rounded-full bg-cyan-500/10 blur-2xl" />
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-400 via-sky-400 to-violet-500" />
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-2.5 py-0.5 text-[10px] font-semibold text-cyan-300">
                <Sparkles size={11} className="text-cyan-400" />
                <span>Candidate Command Center</span>
              </div>

              <h1 className="mt-1 text-lg md:text-xl font-bold text-white tracking-tight">
                Welcome back,{" "}
                <span className="bg-gradient-to-r from-cyan-400 to-indigo-300 bg-clip-text text-transparent">
                  {user?.name || "Candidate"}
                </span>
                ! 👋
              </h1>

              <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px]">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                  <Flame size={12} /> {overview.dailyStreak || 1} Day Streak
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-medium">
                  <Zap size={12} /> {user.interviewCredits ?? 10} Credits Left
                </span>
              </div>
            </div>

            {/* Compact Readiness Circle */}
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-900/80 px-3 py-2 shrink-0 backdrop-blur-md">
              <div className="relative flex h-11 w-11 items-center justify-center">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 48 48">
                  <circle cx="24" cy="24" r="20" className="fill-none stroke-slate-800" strokeWidth="4" />
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    className="fill-none stroke-cyan-400"
                    strokeWidth="4"
                    strokeDasharray="125.6"
                    strokeDashoffset={125.6 - (readinessScore / 100) * 125.6}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute text-[11px] font-extrabold text-white">{readinessScore}%</span>
              </div>

              <div>
                <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Readiness</p>
                <p className="text-xs font-bold text-cyan-300">
                  {readinessScore >= 80 ? "Placement Ready 🚀" : "On Track 📈"}
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* 4 STAT CARDS GRID */}
        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Interviews"
            value={overview.totalInterviews || 0}
            icon={<Brain size={16} />}
            color={{
              bg: "rgba(6,182,212,0.1)",
              border: "rgba(6,182,212,0.2)",
              icon: "#22d3ee",
              glow: "rgba(6,182,212,0.1)",
            }}
            trend={{ value: `+${overview.thisWeekInterviews || 0}`, positive: true, label: "this week" }}
          />

          <StatCard
            title="ATS Resume Score"
            value={`${overview.atsResumeScore || 0}%`}
            icon={<FileText size={16} />}
            color={{
              bg: "rgba(74,222,128,0.1)",
              border: "rgba(74,222,128,0.2)",
              icon: "#4ade80",
              glow: "rgba(34,197,94,0.1)",
            }}
            trend={{ value: `+${overview.resumeImprovement || 0}%`, positive: true, label: "vs last scan" }}
          />

          <StatCard
            title="Avg Interview Score"
            value={`${overview.avgScore || 78}%`}
            icon={<Award size={16} />}
            color={{
              bg: "rgba(167,139,250,0.1)",
              border: "rgba(167,139,250,0.2)",
              icon: "#a78bfa",
              glow: "rgba(167,139,250,0.1)",
            }}
            trend={{ value: "Top 15%", positive: true, label: "candidate pool" }}
          />

          <StatCard
            title="Interview Credits"
            value={`${user.interviewCredits ?? 10}`}
            icon={<Zap size={16} />}
            color={{
              bg: "rgba(251,146,60,0.1)",
              border: "rgba(251,146,60,0.2)",
              icon: "#fb923c",
              glow: "rgba(249,115,22,0.1)",
            }}
            trend={{ value: "Active", positive: true, label: "full access" }}
          />
        </div>

        {/* MIDDLE 2-COLUMN SECTION */}
        <div className="grid gap-3 lg:grid-cols-12">
          {/* LEFT 7 COLS: EVALUATION & QUICK ACTIONS */}
          <div className="lg:col-span-7 space-y-3">
            {/* AI Skill Breakdown */}
            <div className="rounded-xl border border-white/10 bg-slate-900/60 p-3.5 space-y-2.5 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <BarChart3 size={14} className="text-cyan-400" />
                  AI Evaluation Breakdown
                </h3>
                <Link to="/analytics" className="text-[11px] font-semibold text-cyan-400 hover:underline flex items-center gap-0.5">
                  Analytics <ChevronRight size={10} />
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-0.5">
                {skillBreakdown.map((item) => (
                  <div key={item.title} className="space-y-1 bg-white/[0.02] p-2 rounded-lg border border-white/5">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-300">{item.title}</span>
                      <span className="font-bold" style={{ color: item.color }}>{item.score}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${item.score}%`, background: item.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Action Hub */}
            <div className="rounded-xl border border-white/10 bg-slate-900/60 p-3 space-y-2 backdrop-blur-xl">
              <div className="flex items-center justify-between text-xs font-bold text-white">
                <span className="flex items-center gap-1.5">
                  <Target size={14} className="text-cyan-400" /> Quick Actions
                </span>
                <span className="text-[10px] text-slate-400">1-Click Launch</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/interviews"
                  className="flex items-center gap-2.5 rounded-lg border border-cyan-500/20 bg-cyan-500/10 p-2.5 hover:bg-cyan-500/20 transition cursor-pointer"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-400 text-slate-950 font-bold">
                    <Brain size={15} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">Start Mock Round</p>
                    <p className="text-[10px] text-cyan-300/80 truncate">Voice AI Interview</p>
                  </div>
                </Link>

                <Link
                  to="/resume-analyzer"
                  className="flex items-center gap-2.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-2.5 hover:bg-emerald-500/20 transition cursor-pointer"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-400 text-slate-950 font-bold">
                    <FileText size={15} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">ATS Resume Audit</p>
                    <p className="text-[10px] text-emerald-300/80 truncate">Scan Compatibility</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* RIGHT 5 COLS: CHECKLIST & TIP */}
          <div className="lg:col-span-5 space-y-3">
            {/* Checklist */}
            <div className="rounded-xl border border-white/10 bg-slate-900/60 p-3.5 space-y-2.5 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <CheckSquare size={14} className="text-emerald-400" /> Checklist
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {completedCount}/{checklist.length} Done ({progressPct}%)
                </span>
              </div>

              <div className="h-1 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full rounded-full bg-emerald-400 transition-all" style={{ width: `${progressPct}%` }} />
              </div>

              <div className="space-y-1.5 pt-0.5">
                {checklist.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => toggleChecklist(item.id)}
                    className={`flex items-center justify-between rounded-lg border p-2 text-[11px] transition cursor-pointer ${
                      item.completed
                        ? "border-emerald-500/20 bg-emerald-500/10 text-slate-400 line-through"
                        : "border-white/5 bg-white/[0.02] text-slate-200 hover:border-white/15"
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {item.completed ? (
                        <CheckSquare size={13} className="text-emerald-400 shrink-0" />
                      ) : (
                        <Square size={13} className="text-slate-500 shrink-0" />
                      )}
                      <span className="truncate">{item.text}</span>
                    </div>
                    <Link to={item.link} onClick={(e) => e.stopPropagation()} className="text-[10px] text-cyan-400 hover:underline shrink-0 ml-1">
                      Go
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Daily Placement Tip */}
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 space-y-1 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                  <Lightbulb size={14} /> Placement Tip
                </div>
                <button
                  onClick={() => setTipIndex((prev) => (prev + 1) % placementTips.length)}
                  className="text-[10px] text-amber-400/80 hover:text-amber-300 cursor-pointer"
                >
                  Next Tip ➔
                </button>
              </div>
              <p className="text-[11px] text-slate-200 leading-snug">
                "{placementTips[tipIndex]}"
              </p>
            </div>
          </div>
        </div>

        {/* BOTTOM PRACTICE TRACKS STRIP */}
        <div className="rounded-xl border border-white/10 bg-slate-900/60 p-3 space-y-2 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
              <Briefcase size={14} className="text-cyan-400" /> Practice Tracks
            </h3>
            <Link to="/interviews" className="text-[11px] font-semibold text-cyan-400 hover:underline flex items-center gap-0.5">
              View All <ArrowRight size={10} />
            </Link>
          </div>

          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Frontend Track", cat: "React & JS", diff: "Medium", color: "#22d3ee" },
              { title: "Backend Track", cat: "Node & APIs", diff: "Hard", color: "#a78bfa" },
              { title: "HR Behavioral", cat: "STAR Method", diff: "Easy", color: "#4ade80" },
              { title: "AI Adaptive", cat: "Real-time Voice", diff: "Adaptive", color: "#fb923c" },
            ].map((track, i) => (
              <Link
                key={i}
                to="/interviews"
                className="group flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 hover:border-cyan-400/40 hover:bg-white/[0.05] transition cursor-pointer"
              >
                <div>
                  <h4 className="text-[11px] font-bold text-white group-hover:text-cyan-300 transition-colors">{track.title}</h4>
                  <p className="text-[9px] text-slate-400">{track.cat}</p>
                </div>
                <Play size={12} className="text-slate-500 group-hover:text-cyan-400 transition-colors shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardHome;