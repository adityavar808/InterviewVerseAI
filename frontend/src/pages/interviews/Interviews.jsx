import { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";

import {
  Brain,
  Code2,
  Briefcase,
  Database,
  ArrowRight,
  Sparkles,
  ChevronRight,
  Zap,
  Target,
  Clock,
} from "lucide-react";

import InterviewSetupModal from "../../components/interviews/InterviewSetupModal";
import InterviewHistory from "../../components/interviews/InterviewHistory";

const interviewTypes = [
  {
    title: "Frontend Track",
    role: "Frontend Developer",
    description: "React, JavaScript, CSS Architecture & UI System Design.",
    icon: Code2,
    color: "#22d3ee",
    glow: "rgba(34,211,238,0.22)",
    badge: "Popular",
  },
  {
    title: "Backend Track",
    role: "Backend Developer",
    description: "Node.js, REST APIs, Databases & Distributed Systems.",
    icon: Database,
    color: "#a78bfa",
    glow: "rgba(167,139,250,0.22)",
    badge: "High Demand",
  },
  {
    title: "HR Behavioral",
    role: "HR Interview",
    description: "STAR method, communication, scenario-based & leadership.",
    icon: Briefcase,
    color: "#4ade80",
    glow: "rgba(74,222,128,0.22)",
    badge: "Essential",
  },
  {
    title: "AI Adaptive Mock",
    role: "Frontend Developer",
    description: "Real-time AI voice interviewer with dynamic follow-ups.",
    icon: Brain,
    color: "#fb923c",
    glow: "rgba(251,146,60,0.22)",
    badge: "AI Powered",
  },
];

const Interviews = () => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");

  const handleLaunchTrack = (roleName) => {
    setSelectedRole(roleName);
    setOpenModal(true);
  };

  return (
    <>
      <DashboardLayout>
        <div className="max-w-[1600px] mx-auto">
          {/* SIDE-BY-SIDE 2-COLUMN LAYOUT */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            
            {/* LEFT COLUMN: Interview Section Intro & Track Selection */}
            <div className="lg:col-span-5 space-y-4">
              {/* HERO INTRO CARD */}
              <div className="relative overflow-hidden rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-slate-950/90 p-5 backdrop-blur-2xl shadow-xl">
                {/* Ambient Glow */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <div className="absolute -top-24 right-[-80px] h-[250px] w-[250px] rounded-full bg-cyan-500/15 blur-3xl" />
                  <div className="absolute bottom-[-140px] left-[-60px] h-[200px] w-[200px] rounded-full bg-sky-500/10 blur-3xl" />
                </div>

                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 bg-cyan-500/10 border border-cyan-500/25">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    <Sparkles size={13} className="text-cyan-400" />
                    <span className="text-[11px] font-semibold text-cyan-300 tracking-wide">
                      AI Interview Engine
                    </span>
                  </div>

                  <h1 className="mt-3 text-xl md:text-2xl font-bold leading-tight text-white">
                    Master Technical &
                    <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400 bg-clip-text text-transparent">
                      {" "}HR Interviews
                    </span>
                  </h1>

                  <p className="mt-2 text-xs leading-relaxed text-slate-300">
                    Interactive voice & video AI mock interviews with instant scoring, rubric feedback, and question breakdown.
                  </p>

                  {/* Feature Highlights */}
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-[10px] text-slate-400">
                    <span className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/[0.04] border border-white/5">
                      <Zap size={11} className="text-amber-400" />
                      Instant Scoring
                    </span>
                    <span className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/[0.04] border border-white/5">
                      <Target size={11} className="text-cyan-400" />
                      Role-Specific
                    </span>
                    <span className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/[0.04] border border-white/5">
                      <Clock size={11} className="text-emerald-400" />
                      15–60 Min
                    </span>
                  </div>

                  {/* Custom Setup CTA */}
                  <button
                    className="mt-4 w-full group inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-950 transition-all duration-300 hover:scale-[1.01] cursor-pointer"
                    style={{
                      background: "linear-gradient(135deg, #22d3ee 0%, #0891b2 100%)",
                      boxShadow: "0 0 20px rgba(34,211,238,0.25)",
                    }}
                    onClick={() => handleLaunchTrack("")}
                  >
                    <span>Start Custom Interview</span>
                    <ArrowRight
                      size={14}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </button>
                </div>
              </div>

              {/* TRACK SELECTION CARDS */}
              <div className="space-y-2">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 px-1">
                  Available Track Sessions
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
                  {interviewTypes.map((item, index) => {
                    const Icon = item.icon;

                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleLaunchTrack(item.role)}
                        className="group relative text-left overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] p-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-500/40 hover:bg-white/[0.06] cursor-pointer"
                      >
                        {/* Glow */}
                        <div
                          className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none"
                          style={{
                            background: `radial-gradient(circle at top right, ${item.glow}, transparent 70%)`,
                          }}
                        />

                        <div className="relative z-10 flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <div
                              className="flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-lg"
                              style={{
                                background: `${item.color}15`,
                                border: `1px solid ${item.color}30`,
                              }}
                            >
                              <Icon
                                size={17}
                                style={{
                                  color: item.color,
                                }}
                              />
                            </div>
                            <div>
                              <h3 className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors">
                                {item.title}
                              </h3>
                              <span
                                className="inline-block mt-0.5 px-1.5 py-0.2 rounded text-[9px] font-medium"
                                style={{
                                  background: `${item.color}15`,
                                  color: item.color,
                                  border: `1px solid ${item.color}25`,
                                }}
                              >
                                {item.badge}
                              </span>
                            </div>
                          </div>

                          <ChevronRight
                            size={14}
                            className="text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all mt-1"
                          />
                        </div>

                        <p className="relative z-10 mt-1.5 text-[11px] leading-snug text-slate-400 line-clamp-2">
                          {item.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Interview History */}
            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center justify-between gap-4 px-1">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-cyan-400/80">
                    Performance Records
                  </p>
                  <h2 className="mt-0.5 text-lg md:text-xl font-bold text-white">
                    Interview History
                  </h2>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl min-h-[480px]">
                <InterviewHistory />
              </div>
            </div>

          </div>
        </div>
      </DashboardLayout>

      <InterviewSetupModal
        open={openModal}
        initialRole={selectedRole}
        onClose={() => {
          setOpenModal(false);
          setSelectedRole("");
        }}
      />
    </>
  );
};

export default Interviews;