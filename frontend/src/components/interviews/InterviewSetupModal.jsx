import { useNavigate } from "react-router-dom";

import {
  X,
  Camera,
  Mic,
  Brain,
  Clock3,
  Sparkles,
  ShieldCheck,
  Upload,
  Globe,
} from "lucide-react";

const difficulties = ["Easy", "Medium", "Hard"];
const durations = ["15 Min", "30 Min", "45 Min", "60 Min"];
const experiences = ["Fresher", "1-2 Years", "3+ Years"];
const languages = ["English", "Hindi", "Hinglish"];

const InterviewSetupModal = ({ open, onClose }) => {
  if (!open) return null;

  const navigate = useNavigate();
  return (
    <div
      className="
        fixed inset-0 z-[999999]
        flex items-center justify-center
        bg-[#020617]/80 backdrop-blur-md p-4
      "
    >
      {/* MODAL */}
      <div
        className="
          w-full max-w-3xl
          rounded-2xl p-6
          relative overflow-hidden
          animate-in fade-in zoom-in-95 duration-200
        "
        style={{
          background: "rgba(15,23,42,0.95)",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(24px)",
          boxShadow: "0 25px 80px rgba(0,0,0,0.45)",
        }}
      >
        {/* CYAN GLOW */}
        <div
          className="absolute pointer-events-none"
          style={{
            width: "300px",
            height: "300px",
            top: "-140px",
            right: "-80px",
            background:
              "radial-gradient(circle, rgba(6,182,212,0.13) 0%, transparent 70%)",
          }}
        />

        {/* PURPLE GLOW */}
        <div
          className="absolute pointer-events-none"
          style={{
            width: "260px",
            height: "260px",
            bottom: "-140px",
            left: "-80px",
            background:
              "radial-gradient(circle, rgba(139,92,246,0.11) 0%, transparent 70%)",
          }}
        />

        {/* HEADER */}
        <div className="flex items-start justify-between relative z-10">
          <div>
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-3"
              style={{
                background: "rgba(6,182,212,0.1)",
                border: "1px solid rgba(6,182,212,0.2)",
              }}
            >
              <Sparkles size={12} className="text-cyan-400" />
              <span
                className="text-cyan-400 font-mono uppercase tracking-widest"
                style={{ fontSize: "9px" }}
              >
                AI Interview Setup
              </span>
            </div>

            <h2 className="text-2xl font-bold text-white">Configure Session</h2>
            <p className="text-slate-400 mt-1.5 text-sm">
              Customize your AI-powered mock interview experience.
            </p>
          </div>

          {/* CLOSE */}
          <button
            onClick={onClose}
            className="
              w-9 h-9 rounded-xl flex-shrink-0
              flex items-center justify-center
              bg-white/5 hover:bg-white/10
              border border-white/10 transition-all
            "
          >
            <X size={16} className="text-slate-300" />
          </button>
        </div>

        {/* MAIN GRID */}
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
          {/* LEFT */}
          <div className="space-y-4">
            {/* DIFFICULTY */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Brain size={14} className="text-cyan-400" />
                <p className="text-xs font-semibold text-white">Difficulty</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                {difficulties.map((item) => (
                  <button
                    key={item}
                    className="
                      px-4 py-2 rounded-full text-xs
                      bg-white/5 hover:bg-cyan-500/10
                      border border-white/10 hover:border-cyan-500/25
                      text-slate-300 transition-all
                    "
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* ROLE */}
            <div>
              <p className="text-xs font-semibold text-white mb-2">
                Interview Role
              </p>
              <select
                className="
                  w-full px-4 py-3 rounded-xl text-sm
                  bg-white/5 border border-white/10
                  text-slate-300 outline-none
                "
              >
                <option>Frontend Developer</option>
                <option>Backend Developer</option>
                <option>Data Analyst</option>
                <option>Machine Learning Engineer</option>
                <option>HR Interview</option>
                <option>System Design</option>
              </select>
            </div>

            {/* EXPERIENCE */}
            <div>
              <p className="text-xs font-semibold text-white mb-2">
                Experience Level
              </p>
              <div className="space-y-2">
                {experiences.map((item) => (
                  <button
                    key={item}
                    className="
                      w-full text-left px-4 py-3 rounded-xl text-sm
                      bg-white/5 hover:bg-white/8
                      border border-white/10
                      text-slate-300 transition-all
                    "
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-4">
            {/* DURATION */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Clock3 size={14} className="text-violet-400" />
                <p className="text-xs font-semibold text-white">Duration</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                {durations.map((item) => (
                  <button
                    key={item}
                    className="
                      px-4 py-2 rounded-full text-xs
                      bg-white/5 hover:bg-violet-500/10
                      border border-white/10 hover:border-violet-500/25
                      text-slate-300 transition-all
                    "
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* LANGUAGE */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Globe size={14} className="text-emerald-400" />
                <p className="text-xs font-semibold text-white">
                  Interview Language
                </p>
              </div>
              <div className="flex gap-2 flex-wrap">
                {languages.map((item) => (
                  <button
                    key={item}
                    className="
                      px-4 py-2 rounded-full text-xs
                      bg-white/5 hover:bg-emerald-500/10
                      border border-white/10 hover:border-emerald-500/25
                      text-slate-300 transition-all
                    "
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* CAMERA */}
            <div
              className="rounded-2xl h-40 flex flex-col items-center justify-center relative overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div
                className="absolute pointer-events-none"
                style={{
                  width: "200px",
                  height: "200px",
                  background:
                    "radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)",
                }}
              />
              <Camera size={36} className="text-slate-500 relative z-10" />
              <p className="text-slate-400 mt-3 text-xs relative z-10">
                Camera Preview
              </p>
              <div className="flex items-center gap-2 mt-4 relative z-10">
                <button
                  className="
                    w-10 h-10 rounded-xl
                    flex items-center justify-center
                    bg-white/5 hover:bg-white/10
                    border border-white/10 transition-all
                  "
                >
                  <Mic size={15} className="text-slate-300" />
                </button>
                <button
                  className="
                    w-10 h-10 rounded-xl
                    flex items-center justify-center
                    bg-white/5 hover:bg-white/10
                    border border-white/10 transition-all
                  "
                >
                  <Camera size={15} className="text-slate-300" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div
          className="
            mt-4 pt-4
            flex items-center justify-between gap-4
            relative z-10 flex-wrap
            border-t border-white/[0.06]
          "
        >
          {/* SESSION INFO */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="px-3 py-2 rounded-xl bg-white/5 border border-white/10">
              <p className="text-[10px] text-slate-500">Estimated Questions</p>
              <p className="text-white font-semibold text-sm mt-0.5">
                12 Questions
              </p>
            </div>
            <div className="px-3 py-2 rounded-xl bg-white/5 border border-white/10">
              <p className="text-[10px] text-slate-500">AI Evaluation</p>
              <p className="text-emerald-400 font-semibold text-sm mt-0.5">
                Enabled
              </p>
            </div>
          </div>

          {/* BUTTONS */}
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="
                px-4 py-2.5 rounded-xl text-sm
                bg-white/5 hover:bg-white/10
                border border-white/10
                text-slate-300 transition-all
              "
            >
              Cancel
            </button>
            <button
              onClick={() => navigate("/interview-session")}
              className="
    px-6 py-2.5 rounded-xl
    font-semibold text-sm
    text-[#020617]
    transition-all
  "
              style={{
                background: "linear-gradient(135deg, #06b6d4, #0891b2)",

                boxShadow: "0 0 20px rgba(6,182,212,0.25)",
              }}
            >
              Start Interview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewSetupModal;
