import { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";

import {
  Brain,
  Code2,
  Briefcase,
  Database,
  ArrowRight,
  Clock3,
  Sparkles,
} from "lucide-react";

import InterviewSetupModal from "../../components/interviews/InterviewSetupModal";

const interviewTypes = [
  {
    title: "Frontend Interview",
    description: "React, JavaScript, System Design, UI architecture.",

    icon: Code2,

    color: "#22d3ee",

    glow: "rgba(34,211,238,0.15)",
  },

  {
    title: "Backend Interview",
    description: "Node.js, APIs, Databases, Scalability concepts.",

    icon: Database,

    color: "#a78bfa",

    glow: "rgba(167,139,250,0.15)",
  },

  {
    title: "HR Interview",
    description: "Communication, confidence, behavioral questions.",

    icon: Briefcase,

    color: "#4ade80",

    glow: "rgba(74,222,128,0.15)",
  },

  {
    title: "AI Mock Interview",
    description: "Real-time AI interviewer with adaptive questions.",

    icon: Brain,

    color: "#fb923c",

    glow: "rgba(251,146,60,0.15)",
  },
];

const Interviews = () => {
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <DashboardLayout>
        <div className="max-w-7xl mx-auto space-y-8">
          {/* HERO */}

          <div
            className="rounded-3xl p-8 relative overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.04)",

              backdropFilter: "blur(24px)",

              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {/* Glow */}

            <div
              className="absolute pointer-events-none"
              style={{
                width: "400px",
                height: "400px",
                top: "-180px",
                right: "-120px",

                background:
                  "radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)",
              }}
            />

            <div className="relative z-10">
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4"
                style={{
                  background: "rgba(6,182,212,0.1)",

                  border: "1px solid rgba(6,182,212,0.2)",
                }}
              >
                <Sparkles size={14} className="text-cyan-400" />

                <span
                  className="text-cyan-400 font-mono uppercase tracking-widest"
                  style={{
                    fontSize: "10px",
                  }}
                >
                  AI Interview Engine
                </span>
              </div>

              <h1 className="text-4xl font-bold text-white leading-tight">
                Practice Interviews
                <br />
                With AI Precision
              </h1>

              <p className="text-slate-400 mt-4 max-w-2xl">
                Simulate real-world technical and HR interviews powered by
                AI-generated adaptive questioning.
              </p>

              <button
                className="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-[#020617]"
                style={{
                  background: "linear-gradient(135deg, #06b6d4, #0891b2)",

                  boxShadow: "0 0 24px rgba(6,182,212,0.25)",
                }}
                onClick={() => setOpenModal(true)}
              >
                Start AI Interview
                <ArrowRight size={18} />
              </button>
            </div>
          </div>

          {/* INTERVIEW TYPES */}

          <div>
            <div className="flex items-center justify-between mb-5">
              <div>
                <p
                  className="text-slate-500 uppercase tracking-widest font-mono"
                  style={{
                    fontSize: "10px",
                  }}
                >
                  Categories
                </p>

                <h2 className="text-2xl font-bold text-white mt-1">
                  Interview Tracks
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
              {interviewTypes.map((item, index) => {
                const Icon = item.icon;

                return (
                  <div
                    key={index}
                    className="rounded-2xl p-5 relative overflow-hidden transition-all hover:-translate-y-1"
                    style={{
                      background: "rgba(255,255,255,0.04)",

                      backdropFilter: "blur(20px)",

                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    {/* Glow */}

                    <div
                      className="absolute pointer-events-none"
                      style={{
                        width: "180px",
                        height: "180px",
                        top: "-70px",
                        right: "-70px",

                        background: `radial-gradient(circle, ${item.glow} 0%, transparent 70%)`,
                      }}
                    />

                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 relative z-10"
                      style={{
                        background: `${item.color}15`,

                        border: `1px solid ${item.color}30`,
                      }}
                    >
                      <Icon
                        size={22}
                        style={{
                          color: item.color,
                        }}
                      />
                    </div>

                    <div className="relative z-10">
                      <h3 className="text-white font-semibold text-lg">
                        {item.title}
                      </h3>

                      <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                        {item.description}
                      </p>

                      <button
                        className="mt-5 flex items-center gap-2 text-sm font-medium"
                        style={{
                          color: item.color,
                        }}
                        onClick={() => setOpenModal(true)}
                      >
                        Start Interview
                        <ArrowRight size={15} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RECENT SESSIONS */}

          <div
            className="rounded-3xl p-6"
            style={{
              background: "rgba(255,255,255,0.04)",

              backdropFilter: "blur(24px)",

              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <p
                  className="text-slate-500 uppercase tracking-widest font-mono"
                  style={{
                    fontSize: "10px",
                  }}
                >
                  Sessions
                </p>

                <h2 className="text-2xl font-bold text-white mt-1">
                  Recent Interviews
                </h2>
              </div>
            </div>

            <div className="space-y-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="flex items-center justify-between p-4 rounded-2xl"
                  style={{
                    background: "rgba(255,255,255,0.03)",

                    border: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <div>
                    <h3 className="text-white font-medium">
                      Frontend Developer Interview
                    </h3>

                    <p className="text-slate-500 text-sm mt-1">
                      React • JavaScript • System Design
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <Clock3 size={14} />
                    25 mins ago
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
      <InterviewSetupModal
        open={openModal}
        onClose={() => setOpenModal(false)}
      />
    </>
  );
};

export default Interviews;