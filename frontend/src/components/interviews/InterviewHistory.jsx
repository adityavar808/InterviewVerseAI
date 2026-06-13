import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  BarChart3,
  FileText,
  RotateCcw,
  Loader,
  AlertCircle,
  X,
  TrendingUp,
  MessageSquare,
  Zap,
  Shield,
  ChevronDown,
  ChevronUp,
  Star,
  Award,
  Target,
} from "lucide-react";
import toast from "react-hot-toast";
import studentService from "../../services/studentApi";

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */
const getScoreColor = (score) => {
  if (score >= 85) return { bg: "rgba(34,197,94,0.1)", glow: "rgba(74,222,128,0.25)", text: "#4ade80", border: "rgba(74,222,128,0.3)", label: "Excellent" };
  if (score >= 75) return { bg: "rgba(251,146,60,0.1)", glow: "rgba(251,146,60,0.2)", text: "#fb923c", border: "rgba(251,146,60,0.3)", label: "Good" };
  if (score >= 65) return { bg: "rgba(245,158,11,0.1)", glow: "rgba(251,191,36,0.2)", text: "#fbbf24", border: "rgba(251,191,36,0.3)", label: "Fair" };
  return { bg: "rgba(239,68,68,0.1)", glow: "rgba(248,113,113,0.2)", text: "#f87171", border: "rgba(248,113,113,0.3)", label: "Needs Work" };
};

const getDifficultyBadge = (difficulty) => {
  switch (difficulty) {
    case "Easy": return { bg: "rgba(34,197,94,0.08)", border: "rgba(34,197,94,0.2)", text: "#4ade80" };
    case "Medium": return { bg: "rgba(251,146,60,0.08)", border: "rgba(251,146,60,0.2)", text: "#fb923c" };
    case "Hard": return { bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.2)", text: "#f87171" };
    case "Advanced": return { bg: "rgba(139,92,246,0.08)", border: "rgba(139,92,246,0.25)", text: "#a78bfa" };
    default: return { bg: "rgba(100,116,139,0.08)", border: "rgba(100,116,139,0.2)", text: "#94a3b8" };
  }
};

/* Score ring SVG */
const ScoreRing = ({ score, size = 72, strokeWidth = 5 }) => {
  const sc = getScoreColor(score);
  const r = (size - strokeWidth * 2) / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(score / 100, 1);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={strokeWidth} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={sc.text} strokeWidth={strokeWidth}
          strokeDasharray={`${pct * circ} ${circ}`}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 6px ${sc.glow})`, transition: "stroke-dasharray 1s ease" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-xl font-bold leading-none" style={{ color: sc.text }}>{score}</span>
        <span className="text-[9px] text-slate-500 uppercase tracking-widest mt-0.5">Score</span>
      </div>
    </div>
  );
};

/* Mini horizontal bar */
const MiniBar = ({ value, color, label }) => (
  <div className="space-y-1">
    <div className="flex justify-between items-center">
      <span className="text-[11px] text-slate-500 uppercase tracking-wider">{label}</span>
      <span className="text-[11px] font-semibold" style={{ color }}>{value}%</span>
    </div>
    <div className="h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
      <div
        className="h-full rounded-full"
        style={{
          width: `${value}%`,
          background: color,
          boxShadow: `0 0 6px ${color}55`,
          transition: "width 0.8s ease",
        }}
      />
    </div>
  </div>
);

/* Question card inside modal */
const QuestionCard = ({ question, response, index }) => {
  const [expanded, setExpanded] = useState(false);
  const sc = getScoreColor(response?.score ?? 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="rounded-2xl overflow-hidden"
      style={{ border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}
    >
      {/* Header row */}
      <button
        className="w-full text-left p-4 flex items-start gap-4 hover:bg-white/[0.02] transition-colors"
        onClick={() => setExpanded((p) => !p)}
      >
        {/* Index bubble */}
        <div
          className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
          style={{ background: sc.bg, border: `1px solid ${sc.border}`, color: sc.text }}
        >
          {index + 1}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-medium leading-snug line-clamp-2">{question.question}</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {question.category && (
              <span className="px-2 py-0.5 rounded-full text-[10px] uppercase tracking-widest" style={{ background: "rgba(6,182,212,0.08)", color: "#67e8f9", border: "1px solid rgba(6,182,212,0.15)" }}>
                {question.category}
              </span>
            )}
            {question.difficulty && (
              <span className="px-2 py-0.5 rounded-full text-[10px] uppercase tracking-widest" style={{ ...getDifficultyBadge(question.difficulty) }}>
                {question.difficulty}
              </span>
            )}
          </div>
        </div>

        {/* Score pill */}
        <div className="flex-shrink-0 flex items-center gap-2">
          <span className="text-sm font-bold" style={{ color: sc.text }}>{response?.score ?? 0}%</span>
          <div className="text-slate-500">
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </div>
        </div>
      </button>

      {/* Expanded body */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-4 border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
              {/* Metric bars */}
              <div className="grid grid-cols-2 gap-3 pt-4">
                <MiniBar value={response?.communication ?? 0} color="#67e8f9" label="Communication" />
                <MiniBar value={response?.technical ?? 0} color="#a78bfa" label="Technical" />
                <MiniBar value={response?.confidence ?? 0} color="#fb923c" label="Confidence" />
                <MiniBar value={response?.score ?? 0} color={sc.text} label="Overall" />
              </div>

              {/* Answer / Feedback grid */}
              <div className="grid md:grid-cols-2 gap-3">
                <div className="rounded-xl p-4 space-y-2" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-slate-500">
                    <MessageSquare size={11} />
                    <span>Your Answer</span>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {response?.answer || "No answer recorded."}
                  </p>
                </div>
                <div className="rounded-xl p-4 space-y-2" style={{ background: "rgba(6,182,212,0.03)", border: "1px solid rgba(6,182,212,0.08)" }}>
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-cyan-500/70">
                    <Zap size={11} />
                    <span>AI Feedback</span>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {response?.feedback || "No feedback available."}
                  </p>
                </div>
              </div>

              {/* Tags */}
              {question.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {question.tags.map((tag) => (
                    <span key={tag} className="px-2 py-0.5 rounded-md text-[10px]" style={{ background: "rgba(255,255,255,0.04)", color: "#94a3b8" }}>
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/* ─────────────────────────────────────────────
   Analysis Modal
───────────────────────────────────────────── */
const AnalysisModal = ({ sessionLoading, sessionDetail, sessionError, onClose }) => {
  const isVisible = sessionLoading || sessionDetail || sessionError;
  if (!isVisible) return null;

  const avg = sessionDetail ? Math.round(sessionDetail.averageScore || 0) : 0;
  const sc = getScoreColor(avg);

  return createPortal(
    <AnimatePresence>
      <motion.div
        key="modal-backdrop"
        className="fixed inset-0 z-[99999] flex items-end md:items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0"
          style={{ background: "rgba(2,6,23,0.88)", backdropFilter: "blur(20px)" }}
          onClick={onClose}
        />

        {/* Sheet */}
        <motion.div
          key="modal-sheet"
          className="relative z-10 w-full md:max-w-6xl flex flex-col"
          style={{
            maxHeight: "92vh",
            background: "linear-gradient(160deg, rgba(15,23,42,0.98) 0%, rgba(2,6,23,0.99) 100%)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "28px 28px 0 0",
          }}
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 32 }}
        >
          {/* Ambient top glow */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
            style={{
              width: "60%", height: "1px",
              background: "linear-gradient(90deg, transparent, rgba(6,182,212,0.5), transparent)",
            }}
          />
          <div
            className="absolute top-0 left-0 right-0 pointer-events-none"
            style={{
              height: "160px",
              background: "radial-gradient(ellipse at 50% 0%, rgba(6,182,212,0.07) 0%, transparent 70%)",
            }}
          />

          {/* Drag pill (mobile) */}
          <div className="flex justify-center pt-3 pb-1 md:hidden">
            <div className="w-10 h-1 rounded-full" style={{ background: "rgba(255,255,255,0.15)" }} />
          </div>

          {/* ── LOADING STATE ── */}
          {sessionLoading && !sessionDetail && (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="relative">
                <div className="w-14 h-14 rounded-full" style={{ border: "1px solid rgba(6,182,212,0.2)", background: "rgba(6,182,212,0.05)" }} />
                <Loader size={20} className="absolute inset-0 m-auto text-cyan-400 animate-spin" />
              </div>
              <p className="text-slate-400 text-sm">Fetching your analysis…</p>
            </div>
          )}

          {/* ── ERROR STATE ── */}
          {sessionError && !sessionDetail && !sessionLoading && (
            <div className="flex flex-col items-center justify-center py-24 gap-4 px-8 text-center">
              <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
                <AlertCircle size={22} className="text-red-400" />
              </div>
              <div>
                <p className="text-white font-semibold mb-1">Analysis Unavailable</p>
                <p className="text-red-300 text-sm">{sessionError}</p>
              </div>
            </div>
          )}

          {/* ── SUCCESS STATE ── */}
          {sessionDetail && (() => {
            const responses = sessionDetail.responses || [];
            const n = responses.length || 1;
            const avg_comm = Math.round(responses.reduce((s, r) => s + (r.communication || 0), 0) / n);
            const avg_tech = Math.round(responses.reduce((s, r) => s + (r.technical || 0), 0) / n);
            const avg_conf = Math.round(responses.reduce((s, r) => s + (r.confidence || 0), 0) / n);
            const avg_overall = Math.round(sessionDetail.averageScore || 0);

            const metrics = [
              { key: "overall", label: "Overall Score", desc: "Weighted average across all parameters", value: avg_overall, color: sc.text, glow: sc.glow, bg: sc.bg, border: sc.border, icon: <Award size={13} /> },
              { key: "comm", label: "Communication", desc: "Clarity, structure & articulation", value: avg_comm, color: "#67e8f9", glow: "rgba(103,232,249,0.2)", bg: "rgba(6,182,212,0.07)", border: "rgba(6,182,212,0.18)", icon: <MessageSquare size={13} /> },
              { key: "tech", label: "Technical", desc: "Accuracy & depth of knowledge", value: avg_tech, color: "#a78bfa", glow: "rgba(167,139,250,0.2)", bg: "rgba(139,92,246,0.07)", border: "rgba(139,92,246,0.18)", icon: <Zap size={13} /> },
              { key: "conf", label: "Confidence", desc: "Tone, certainty & delivery", value: avg_conf, color: "#fb923c", glow: "rgba(251,146,60,0.2)", bg: "rgba(251,146,60,0.07)", border: "rgba(251,146,60,0.18)", icon: <Shield size={13} /> },
            ];

            return (
              <div className="flex overflow-hidden" style={{ height: "88vh" }}>

                {/* ══ LEFT PANEL — Score Summary ══ */}
                <div
                  className="flex-shrink-0 flex flex-col overflow-y-auto"
                  style={{
                    width: "320px",
                    borderRight: "1px solid rgba(255,255,255,0.06)",
                    scrollbarWidth: "none",
                  }}
                >
                  {/* Header */}
                  <div className="px-6 pt-6 pb-5 flex-shrink-0">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-cyan-400/70 mb-1">Interview Analysis</p>
                    <h2 className="text-xl font-semibold text-white leading-snug">
                      {sessionDetail.config?.role || "Interview"} Review
                    </h2>
                  </div>

                  {/* Meta pills */}
                  <div className="px-6 pb-5 flex flex-col gap-2 flex-shrink-0">
                    {[
                      { icon: <Target size={11} />, label: "Role", value: sessionDetail.config?.role || "—" },
                      { icon: <TrendingUp size={11} />, label: "Difficulty", value: sessionDetail.config?.difficulty || "Medium" },
                      { icon: <Clock size={11} />, label: "Completed", value: sessionDetail.completedAt ? new Date(sessionDetail.completedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—" },
                      { icon: <Star size={11} />, label: "Questions", value: `${sessionDetail.questions?.length || 0} total` },
                    ].map(({ icon, label, value }) => (
                      <div key={label} className="flex items-center justify-between px-3 py-2 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-500">{icon}</span>
                          <span className="text-[11px] text-slate-500">{label}</span>
                        </div>
                        <span className="text-[12px] font-semibold text-slate-200">{value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Divider */}
                  <div className="mx-6 mb-4 flex-shrink-0">
                    <div className="h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
                    <p className="text-[10px] uppercase tracking-[0.25em] text-slate-600 mt-3">Avg. across all questions</p>
                  </div>

                  {/* Metric rows — compact */}
                  <div className="px-6 pb-6 flex flex-col gap-2 flex-shrink-0">
                    {metrics.map((m) => (
                      <div
                        key={m.key}
                        className="rounded-xl px-3 py-2.5"
                        style={{ background: m.bg, border: `1px solid ${m.border}` }}
                      >
                        {/* Top row: icon + label + score */}
                        <div className="flex items-center gap-2 mb-2">
                          <span style={{ color: m.color, opacity: 0.85 }}>{m.icon}</span>
                          <span className="text-[11px] uppercase tracking-widest font-semibold flex-1" style={{ color: m.color }}>{m.label}</span>
                          <span className="text-sm font-bold tabular-nums" style={{ color: m.color }}>{m.value}<span className="text-[10px] font-normal opacity-60">%</span></span>
                        </div>
                        {/* Bar */}
                        <div className="h-1 rounded-full" style={{ background: "rgba(0,0,0,0.25)" }}>
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{ width: `${m.value}%`, background: m.color, boxShadow: `0 0 6px ${m.glow}` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ══ RIGHT PANEL — Question List ══ */}
                <div className="flex-1 flex flex-col overflow-hidden">
                  {/* Right header */}
                  <div
                    className="flex-shrink-0 px-6 py-4 flex items-center gap-3"
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    <FileText size={14} className="text-slate-500" />
                    <span className="text-[11px] uppercase tracking-widest text-slate-500">Per Question Breakdown</span>
                    <span
                      className="ml-auto px-2.5 py-0.5 rounded-full text-[10px] font-semibold"
                      style={{ background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.2)", color: "#67e8f9" }}
                    >
                      {sessionDetail.questions?.length || 0} questions
                    </span>
                    <span>
                      {/* Close button */}
                      <button
                        onClick={onClose}
                        className="ml-2 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-105"
                        style={{
                          background: "rgba(255,255,255,0.06)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          color: "#94a3b8"
                        }}
                      >
                        <X size={14} />
                      </button>
                    </span>
                  </div>

                  {/* Scrollable questions */}
                  <div
                    className="flex-1 overflow-y-auto px-6 py-4 space-y-2"
                    style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.08) transparent" }}
                  >
                    {sessionDetail.questions?.map((question, index) => {
                      const response = sessionDetail.responses?.find((r) => r.questionIndex === index);
                      return <QuestionCard key={index} question={question} response={response} index={index} />;
                    })}

                    {(!sessionDetail.questions || sessionDetail.questions.length === 0) && (
                      <div className="text-center py-16">
                        <FileText size={32} className="text-slate-600 mx-auto mb-3" />
                        <p className="text-slate-500 text-sm">No questions recorded for this session.</p>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            );
          })()}
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};

/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────── */
const InterviewHistory = () => {
  const [interviews, setInterviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal state
  const [selectedSession, setSelectedSession] = useState(null);
  const [sessionDetail, setSessionDetail] = useState(null);
  const [sessionLoading, setSessionLoading] = useState(false);
  const [sessionError, setSessionError] = useState("");

  useEffect(() => {
    const loadInterviews = async () => {
      try {
        setIsLoading(true);
        const response = await studentService.getInterviewHistory();
        const data = Array.isArray(response) ? response : [];

        setInterviews(
          data.map((item) => ({
            id: item._id || item.id,
            sessionId: item.sessionId || item._id || item.id,
            role: item.role || item.title || "Interview",
            score: item.score ?? 0,
            duration: item.duration || "0 mins",
            date: item.date ||
              (item.completedAt
                ? new Date(item.completedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                : ""),
            status: item.status || "Completed",
            difficulty: item.difficulty || "Medium",
            tags: item.tags || item.tech || [],
          })),
        );
      } catch (err) {
        setError("Failed to load interview history");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadInterviews();
  }, []);

  const openSessionAnalysis = async (interview) => {
    const sessionId = interview.sessionId;

    // Reset all modal state first
    setSessionError("");
    setSessionDetail(null);
    setSessionLoading(true);
    setSelectedSession(sessionId || interview.id || null);

    if (!sessionId) {
      setSessionError("Session details are unavailable for this interview.");
      setSessionLoading(false);
      return;
    }

    try {
      const details = await studentService.getInterviewSession(sessionId);
      setSessionDetail(details);
    } catch (err) {
      console.error(err);
      setSessionError("Unable to load interview analysis. Please try again later.");
      toast.error("Unable to load interview analysis.");
    } finally {
      setSessionLoading(false);
    }
  };

  const closeModal = () => {
    setSessionDetail(null);
    setSessionLoading(false);
    setSessionError("");
    setSelectedSession(null);
  };

  /* ── Empty / Loading / Error states ── */
  if (isLoading) {
    return (
      <div className="rounded-3xl p-6" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="flex items-center justify-center py-12 gap-3">
          <Loader size={20} className="text-cyan-400 animate-spin" />
          <p className="text-slate-400 text-sm">Loading interview history…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl p-6" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)" }}>
        <div className="flex items-center gap-3">
          <AlertCircle size={18} className="text-red-400 flex-shrink-0" />
          <div>
            <p className="text-red-300 font-medium text-sm">Error Loading History</p>
            <p className="text-red-400/70 text-xs mt-0.5">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (interviews.length === 0) {
    return (
      <div className="rounded-3xl p-12 text-center" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <FileText size={40} className="text-slate-600 mx-auto mb-4" />
        <p className="text-slate-400 font-medium mb-1">No interviews yet</p>
        <p className="text-slate-600 text-sm">Start your first AI interview to see your progress here.</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-2">
        {interviews.map((interview, index) => {
          const sc = getScoreColor(interview.score);
          const diffStyle = getDifficultyBadge(interview.difficulty);
          const isActive = selectedSession === (interview.sessionId || interview.id);

          return (
            <motion.div
              key={interview.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.07 }}
              className="rounded-2xl p-4 md:p-5 transition-all"
              style={{
                background: isActive ? "rgba(6,182,212,0.04)" : "rgba(255,255,255,0.02)",
                border: isActive
                  ? "1px solid rgba(6,182,212,0.15)"
                  : "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <div className="flex items-center gap-4">
                {/* Score ring */}
                <div className="flex-shrink-0">
                  <ScoreRing score={interview.score} size={64} strokeWidth={4} />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="text-white font-semibold text-base leading-snug">{interview.role}</h3>
                    <span
                      className="px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider"
                      style={diffStyle}
                    >
                      {interview.difficulty}
                    </span>
                  </div>

                  {interview.tags?.length > 0 && (
                    <p className="text-slate-500 text-xs mb-2 truncate">{interview.tags.join(" · ")}</p>
                  )}

                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock size={11} />
                      {interview.duration}
                    </span>
                    <span className="w-0.5 h-0.5 rounded-full bg-slate-600" />
                    <span>{interview.date}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex-shrink-0 flex gap-2">
                  <button
                    className="w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-95"
                    style={{
                      background: isActive ? "rgba(6,182,212,0.15)" : "rgba(6,182,212,0.08)",
                      border: "1px solid rgba(6,182,212,0.2)",
                      color: "#06b6d4",
                    }}
                    title="View Analysis"
                    onClick={() => openSessionAnalysis(interview)}
                  >
                    <BarChart3 size={15} />
                  </button>
                  <button
                    className="w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-95"
                    style={{
                      background: "rgba(139,92,246,0.08)",
                      border: "1px solid rgba(139,92,246,0.2)",
                      color: "#a78bfa",
                    }}
                    title="Reattempt"
                    onClick={() => toast.success("Use the AI Interview page to start a new session.")}
                  >
                    <RotateCcw size={15} />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── Analysis Modal (portal) ── */}
      <AnalysisModal
        sessionLoading={sessionLoading}
        sessionDetail={sessionDetail}
        sessionError={sessionError}
        onClose={closeModal}
      />
    </>
  );
};

export default InterviewHistory;