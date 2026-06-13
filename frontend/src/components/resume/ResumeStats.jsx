import { motion } from "framer-motion";
import {
  BadgeCheck,
  BriefcaseBusiness,
  FileSearch,
  Layers3,
  Trophy,
  TrendingUp,
} from "lucide-react";

const getScoreValue = (scoreLabel) => {
  if (!scoreLabel) {
    return 0;
  }

  const value = Number(String(scoreLabel).split("/")[0]);
  return Number.isFinite(value) ? value : 0;
};

const getScoreTone = (score) => {
  if (score >= 85) {
    return {
      label: "Excellent match",
      accent: "#34d399",
      ring: "rgba(52,211,153,0.32)",
      surface: "from-emerald-500/20 via-emerald-400/6 to-transparent",
      border: "border-emerald-400/20",
      text: "text-emerald-200",
      chip: "bg-emerald-500/10 text-emerald-200 border-emerald-400/20",
    };
  }

  if (score >= 70) {
    return {
      label: "Competitive",
      accent: "#22d3ee",
      ring: "rgba(34,211,238,0.32)",
      surface: "from-cyan-500/18 via-cyan-400/6 to-transparent",
      border: "border-cyan-400/20",
      text: "text-cyan-100",
      chip: "bg-cyan-500/10 text-cyan-100 border-cyan-400/20",
    };
  }

  return {
    label: "Needs polish",
    accent: "#f59e0b",
    ring: "rgba(245,158,11,0.28)",
    surface: "from-amber-500/16 via-amber-400/6 to-transparent",
    border: "border-amber-400/20",
    text: "text-amber-100",
    chip: "bg-amber-500/10 text-amber-100 border-amber-400/20",
  };
};

const ResumeStats = ({ stats = {}, loading = false, analysis = null }) => {
  const atsScore = loading ? "..." : stats.atsScore || "0/100";
  const scoreValue = analysis?.scoreValue ?? getScoreValue(stats.atsScore);
  const scoreTone = getScoreTone(scoreValue);

  const metricCards = [
    {
      title: "Skills Found",
      value: loading ? "..." : stats.skillsFound ?? 0,
      description: "Technical stack detected from your resume text.",
      icon: Layers3,
      color: "text-violet-200",
      surface: "from-violet-500/14 via-violet-400/6 to-transparent",
      border: "border-violet-400/18",
    },
    {
      title: "Keyword Match",
      value: loading ? "..." : stats.keywordMatch || "0%",
      description: "Role-aligned terms already visible to ATS scans.",
      icon: FileSearch,
      color: "text-cyan-100",
      surface: "from-cyan-500/14 via-cyan-400/6 to-transparent",
      border: "border-cyan-400/18",
    },
    {
      title: "Projects Detected",
      value: loading ? "..." : stats.projects ?? 0,
      description: "Project mentions that strengthen proof of experience.",
      icon: BriefcaseBusiness,
      color: "text-amber-100",
      surface: "from-amber-500/14 via-amber-400/6 to-transparent",
      border: "border-amber-400/18",
    },
  ];

  const overviewPoints = [
    {
      label: "Percentile",
      value: analysis?.ranking || "Top 40%",
      icon: TrendingUp,
    },
    {
      label: "Best Area",
      value: analysis?.bestArea || "Skills",
      icon: BadgeCheck,
    },
    {
      label: "Weak Area",
      value: analysis?.weakArea || "Experience",
      icon: Trophy,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative overflow-hidden rounded-[30px] border bg-slate-950/70 p-6 backdrop-blur-xl sm:col-span-2 ${scoreTone.border}`}
      >
        <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        <div className={`absolute inset-0 bg-gradient-to-br ${scoreTone.surface}`} />

        <div className="relative space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">
                Resume Scorecard
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                Live ATS readiness snapshot
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
                Your score updates every time we re-run the analysis for the selected role, so you can see whether each resume revision is actually moving the needle.
              </p>
            </div>

            <div className={`inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium ${scoreTone.chip}`}>
              {analysis?.readinessLabel || scoreTone.label}
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-[176px_minmax(0,1fr)] lg:items-center">
            <div className="flex items-center justify-center">
              <div
                className="relative flex h-40 w-40 items-center justify-center rounded-full border border-white/10"
                style={{
                  background: `conic-gradient(${scoreTone.accent} ${scoreValue * 3.6}deg, rgba(148,163,184,0.14) 0deg)`,
                  boxShadow: `0 0 40px ${scoreTone.ring}`,
                }}
              >
                <div className="flex h-[calc(100%-18px)] w-[calc(100%-18px)] flex-col items-center justify-center rounded-full bg-slate-950/95">
                  <span className="text-4xl font-semibold text-white">{atsScore}</span>
                  <span className="mt-2 text-[11px] uppercase tracking-[0.26em] text-slate-500">
                    ATS Score
                  </span>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {overviewPoints.map((point) => {
                const Icon = point.icon;

                return (
                  <div
                    key={point.label}
                    className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4"
                  >
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
                      <Icon size={18} className="text-white" />
                    </div>
                    <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">
                      {point.label}
                    </p>
                    <p className={`mt-2 text-lg font-semibold ${scoreTone.text}`}>
                      {point.value}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>

      {metricCards.map((item, index) => {
        const Icon = item.icon;

        return (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 * (index + 1) }}
            className={`relative overflow-hidden rounded-[28px] border bg-slate-950/65 p-5 backdrop-blur-xl ${item.border}`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${item.surface}`} />
            <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            <div className="relative flex h-full flex-col">
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05]">
                  <Icon className={item.color} size={20} />
                </div>

                <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.22em] text-slate-400">
                  Live
                </span>
              </div>

              <div className="mt-6">
                <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">
                  {item.title}
                </p>
                <h3 className="mt-3 text-3xl font-semibold text-white">
                  {item.value}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {item.description}
                </p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default ResumeStats;
