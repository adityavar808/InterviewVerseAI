import { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";

import {
  Brain,
  Code2,
  Briefcase,
  Database,
  ArrowRight,
  Sparkles,
  Play,
  Clock3,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

import InterviewSetupModal from "../../components/interviews/InterviewSetupModal";
import InterviewHistory from "../../components/interviews/InterviewHistory";

const interviewTypes = [
  {
    title: "Frontend Interview",
    description: "React, JavaScript, System Design, UI architecture.",
    icon: Code2,
    color: "#22d3ee",
    glow: "rgba(34,211,238,0.18)",
  },

  {
    title: "Backend Interview",
    description: "Node.js, APIs, Databases, Scalability concepts.",
    icon: Database,
    color: "#a78bfa",
    glow: "rgba(167,139,250,0.18)",
  },

  {
    title: "HR Interview",
    description: "Communication, confidence, behavioral questions.",
    icon: Briefcase,
    color: "#4ade80",
    glow: "rgba(74,222,128,0.18)",
  },

  {
    title: "AI Mock Interview",
    description: "Real-time AI interviewer with adaptive questions.",
    icon: Brain,
    color: "#fb923c",
    glow: "rgba(251,146,60,0.18)",
  },
];

const Interviews = () => {
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <DashboardLayout>
        <div className="max-w-7xl mx-auto space-y-10">
          {/* HERO SECTION */}

          <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl">
            {/* Background Glow */}

            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-32 right-[-120px] h-[380px] w-[380px] rounded-full bg-cyan-500/10 blur-3xl" />

              <div className="absolute bottom-[-180px] left-[-100px] h-[320px] w-[320px] rounded-full bg-sky-500/10 blur-3xl" />
            </div>

            <div className="relative z-10 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] p-8 lg:p-10">
              {/* LEFT CONTENT */}

              <div className="flex flex-col justify-center">
                <div
                  className="inline-flex w-fit items-center gap-2 rounded-full px-4 py-1.5"
                  style={{
                    background: "rgba(6,182,212,0.10)",
                    border: "1px solid rgba(6,182,212,0.18)",
                  }}
                >
                  <Sparkles size={14} className="text-cyan-400" />

                  <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-cyan-300">
                    AI Interview Engine
                  </span>
                </div>

                <h1 className="mt-6 text-4xl lg:text-5xl font-bold leading-tight text-white">
                  Master Your
                  <span className="bg-gradient-to-r from-cyan-400 to-sky-500 bg-clip-text text-transparent">
                    {" "}
                    Technical Interviews
                  </span>
                </h1>

                <p className="mt-5 max-w-2xl text-[15px] leading-7 text-slate-400">
                  Practice real interview scenarios with AI-generated questions,
                  instant feedback, and adaptive difficulty tailored to your
                  role.
                </p>

                {/* CTA */}

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <button
                    className="group inline-flex items-center gap-2 rounded-2xl px-6 py-3.5 font-semibold text-slate-950 transition-all duration-300 hover:scale-[1.02]"
                    style={{
                      background:
                        "linear-gradient(135deg, #22d3ee 0%, #0891b2 100%)",
                      boxShadow: "0 0 30px rgba(34,211,238,0.28)",
                    }}
                    onClick={() => setOpenModal(true)}
                  >
                    Start AI Interview
                    <ArrowRight
                      size={18}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </button>
                </div>
              </div>

              {/* RIGHT SIDE CARDS */}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {interviewTypes.map((item, index) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={index}
                      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.05]"
                    >
                      {/* Glow */}

                      <div
                        className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                        style={{
                          background: `radial-gradient(circle at top right, ${item.glow}, transparent 70%)`,
                        }}
                      />

                      <div className="relative z-10">
                        <div
                          className="flex h-14 w-14 items-center justify-center rounded-2xl"
                          style={{
                            background: `${item.color}15`,
                            border: `1px solid ${item.color}25`,
                          }}
                        >
                          <Icon
                            size={26}
                            style={{
                              color: item.color,
                            }}
                          />
                        </div>

                        <h3 className="mt-5 text-lg font-semibold text-white">
                          {item.title}
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-slate-400">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* INTERVIEW HISTORY */}

          <div>
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-slate-500">
                  Your Progress
                </p>

                <h2 className="mt-2 text-3xl font-bold text-white">
                  Interview History
                </h2>
              </div>

              <button className="hidden rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-slate-300 transition-all duration-300 hover:bg-white/[0.06] md:block">
                View All
              </button>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
              <InterviewHistory />
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