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
  Sliders,
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
          {/* EQUAL HEIGHT 2-COLUMN GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            
            {/* LEFT COLUMN: Fixed Intro & Track Selection Panel */}
            <div className="lg:col-span-5 space-y-3.5 lg:sticky lg:top-2 self-start">
              
              {/* HERO INTRO CARD */}
              <div className="relative overflow-hidden rounded-2xl border border-cyan-500/25 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-5 backdrop-blur-2xl shadow-2xl">
                {/* Glowing Background Orbs */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <div className="absolute -top-20 right-[-60px] h-[260px] w-[260px] rounded-full bg-cyan-500/15 blur-3xl" />
                  <div className="absolute bottom-[-120px] left-[-40px] h-[200px] w-[200px] rounded-full bg-indigo-500/15 blur-3xl" />
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400" />
                </div>

                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 bg-cyan-500/10 border border-cyan-500/25 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    <Sparkles size={13} className="text-cyan-400" />
                    <span className="text-[11px] font-semibold text-cyan-300">
                      AI Interview Engine 2.0
                    </span>
                  </div>

                  <h1 className="mt-3 text-xl md:text-2xl font-extrabold leading-tight text-white tracking-tight">
                    Master Technical &{" "}
                    <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
                      HR Interviews
                    </span>
                  </h1>

                  <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                    Practice voice & video AI mock interviews with real-time feedback, rubric scoring, and question breakdown.
                  </p>

                  {/* Highlights */}
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-[10px] text-slate-300">
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10 font-medium">
                      <Zap size={12} className="text-amber-400" />
                      Instant Evaluation
                    </span>
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10 font-medium">
                      <Target size={12} className="text-cyan-400" />
                      Role Adaptive
                    </span>
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10 font-medium">
                      <Clock size={12} className="text-emerald-400" />
                      15–60 Min
                    </span>
                  </div>

                  {/* Start Custom Setup CTA */}
                  <button
                    className="mt-4 w-full group inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-950 transition-all duration-300 hover:scale-[1.01] cursor-pointer shadow-lg shadow-cyan-500/20"
                    style={{
                      background: "linear-gradient(135deg, #22d3ee 0%, #0891b2 100%)",
                    }}
                    onClick={() => handleLaunchTrack("")}
                  >
                    <Sliders size={14} />
                    <span>Configure Custom Session</span>
                    <ArrowRight
                      size={14}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </button>
                </div>
              </div>

              {/* TRACK SELECTION LIST */}
              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Available Track Sessions
                  </p>
                  <span className="text-[10px] text-cyan-400 font-medium">1-Click Launch</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
                  {interviewTypes.map((item, index) => {
                    const Icon = item.icon;

                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleLaunchTrack(item.role)}
                        className="group relative text-left overflow-hidden rounded-xl border border-white/10 bg-slate-900/60 p-3 transition-all duration-300 hover:border-cyan-500/40 hover:bg-slate-900/90 cursor-pointer shadow-md backdrop-blur-md"
                      >
                        {/* Glow */}
                        <div
                          className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none"
                          style={{
                            background: `radial-gradient(circle at top right, ${item.glow}, transparent 70%)`,
                          }}
                        />

                        <div className="relative z-10 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div
                              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-105"
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
                              <div className="flex items-center gap-2">
                                <h3 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                                  {item.title}
                                </h3>
                                <span
                                  className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider"
                                  style={{
                                    background: `${item.color}15`,
                                    color: item.color,
                                    border: `1px solid ${item.color}25`,
                                  }}
                                >
                                  {item.badge}
                                </span>
                              </div>
                              <p className="mt-0.5 text-[11px] leading-tight text-slate-400 line-clamp-1">
                                {item.description}
                              </p>
                            </div>
                          </div>

                          <ChevronRight
                            size={15}
                            className="text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all shrink-0"
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Fixed Height Container with Internal Scrollable History */}
            <div className="lg:col-span-7 flex flex-col h-[calc(100vh-140px)] min-h-[560px]">
              <div className="flex items-center justify-between gap-4 px-1 mb-2.5 shrink-0">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-cyan-400/80">
                    Performance Records
                  </p>
                  <h2 className="text-lg md:text-xl font-extrabold text-white tracking-tight">
                    Interview History & Analytics
                  </h2>
                </div>
              </div>

              <div className="flex-1 overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 p-4 backdrop-blur-2xl shadow-2xl flex flex-col">
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