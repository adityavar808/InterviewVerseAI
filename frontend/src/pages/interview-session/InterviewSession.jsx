import DashboardLayout from "../../layouts/DashboardLayout";

import {
  Brain,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  PhoneOff,
  Timer,
  Sparkles,
} from "lucide-react";

const InterviewSession = () => {

  return (

    <DashboardLayout>

      <div className="h-full flex flex-col gap-6">

        {/* TOP BAR */}

        <div
          className="rounded-2xl p-4 flex items-center justify-between flex-wrap gap-4"
          style={{
            background:
              "rgba(255,255,255,0.04)",

            border:
              "1px solid rgba(255,255,255,0.08)",

            backdropFilter:
              "blur(20px)",
          }}
        >

          {/* LEFT */}

          <div>

            <div
              className="
                inline-flex
                items-center
                gap-2
                px-3 py-1
                rounded-full
                mb-3
              "
              style={{
                background:
                  "rgba(6,182,212,0.1)",

                border:
                  "1px solid rgba(6,182,212,0.2)",
              }}
            >

              <Sparkles
                size={12}
                className="text-cyan-400"
              />

              <span
                className="
                  text-cyan-400
                  font-mono
                  uppercase
                  tracking-widest
                "
                style={{
                  fontSize: "9px",
                }}
              >

                Live AI Interview

              </span>

            </div>

            <h1 className="text-2xl font-bold text-white">

              Frontend Developer Interview

            </h1>

            <p className="text-slate-400 text-sm mt-1">

              Medium Difficulty • 30 Minutes

            </p>

          </div>

          {/* RIGHT */}

          <div className="flex items-center gap-3 flex-wrap">

            {/* LIVE */}

            <div
              className="
                px-4 py-2 rounded-xl
                flex items-center gap-2
              "
              style={{
                background:
                  "rgba(239,68,68,0.1)",

                border:
                  "1px solid rgba(239,68,68,0.2)",
              }}
            >

              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />

              <span className="text-red-400 text-sm font-medium">

                Live

              </span>

            </div>

            {/* TIMER */}

            <div
              className="
                px-4 py-2 rounded-xl
                flex items-center gap-2
              "
              style={{
                background:
                  "rgba(255,255,255,0.05)",

                border:
                  "1px solid rgba(255,255,255,0.08)",
              }}
            >

              <Timer
                size={16}
                className="text-cyan-400"
              />

              <span className="text-white text-sm font-medium">

                00:12:24

              </span>

            </div>

          </div>

        </div>

        {/* MAIN GRID */}

        <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-6 flex-1">

          {/* LEFT SIDE */}

          <div className="space-y-6">

            {/* AI INTERVIEWER */}

            <div
              className="
                rounded-3xl
                p-6
                relative
                overflow-hidden
              "
              style={{
                background:
                  "rgba(255,255,255,0.04)",

                border:
                  "1px solid rgba(255,255,255,0.08)",
              }}
            >

              {/* GLOW */}

              <div
                className="absolute pointer-events-none"
                style={{
                  width: "300px",
                  height: "300px",
                  top: "-120px",
                  right: "-120px",

                  background:
                    "radial-gradient(circle, rgba(6,182,212,0.14) 0%, transparent 70%)",
                }}
              />

              <div className="relative z-10 flex flex-col items-center text-center">

                {/* AI AVATAR */}

                <div
                  className="
                    w-32 h-32 rounded-full
                    flex items-center justify-center
                    relative
                  "
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(6,182,212,0.2), rgba(139,92,246,0.2))",

                    border:
                      "1px solid rgba(255,255,255,0.08)",
                  }}
                >

                  {/* Pulse */}

                  <div
                    className="
                      absolute inset-0 rounded-full
                      animate-ping
                    "
                    style={{
                      background:
                        "rgba(6,182,212,0.12)",
                    }}
                  />

                  <Brain
                    size={48}
                    className="text-cyan-400 relative z-10"
                  />

                </div>

                <h2 className="text-2xl font-bold text-white mt-6">

                  AI Interviewer

                </h2>

                <p className="text-slate-400 text-sm mt-2 max-w-xl">

                  Ask thoughtful, structured, and concise questions.
                  Focus on React architecture and performance optimization.

                </p>

              </div>

            </div>

            {/* QUESTION PANEL */}

            <div
              className="rounded-3xl p-6"
              style={{
                background:
                  "rgba(255,255,255,0.04)",

                border:
                  "1px solid rgba(255,255,255,0.08)",
              }}
            >

              <p
                className="
                  text-slate-500
                  uppercase
                  tracking-widest
                  font-mono
                  mb-3
                "
                style={{
                  fontSize: "10px",
                }}
              >

                Current Question

              </p>

              <h3 className="text-xl font-semibold text-white leading-relaxed">

                Explain the difference between
                useMemo and useCallback in React.
                When would you use each?

              </h3>

            </div>

            {/* LIVE TRANSCRIPT */}

            <div
              className="rounded-3xl p-6 flex-1"
              style={{
                background:
                  "rgba(255,255,255,0.04)",

                border:
                  "1px solid rgba(255,255,255,0.08)",
              }}
            >

              <div className="flex items-center justify-between mb-5">

                <div>

                  <p
                    className="
                      text-slate-500
                      uppercase
                      tracking-widest
                      font-mono
                    "
                    style={{
                      fontSize: "10px",
                    }}
                  >

                    Transcript

                  </p>

                  <h3 className="text-lg font-semibold text-white mt-1">

                    Live Conversation

                  </h3>

                </div>

                <div
                  className="
                    px-3 py-1 rounded-full
                    flex items-center gap-2
                  "
                  style={{
                    background:
                      "rgba(6,182,212,0.1)",

                    border:
                      "1px solid rgba(6,182,212,0.2)",
                  }}
                >

                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />

                  <span className="text-cyan-400 text-xs">

                    Recording

                  </span>

                </div>

              </div>

              <div className="space-y-4">

                {/* AI */}

                <div className="flex gap-3">

                  <div
                    className="
                      w-10 h-10 rounded-xl
                      flex items-center justify-center
                      flex-shrink-0
                    "
                    style={{
                      background:
                        "rgba(6,182,212,0.12)",
                    }}
                  >

                    <Brain
                      size={18}
                      className="text-cyan-400"
                    />

                  </div>

                  <div
                    className="
                      px-4 py-3 rounded-2xl
                      max-w-xl
                    "
                    style={{
                      background:
                        "rgba(255,255,255,0.04)",

                      border:
                        "1px solid rgba(255,255,255,0.06)",
                    }}
                  >

                    <p className="text-slate-300 text-sm leading-relaxed">

                      Can you explain how React reconciliation works internally?

                    </p>

                  </div>

                </div>

                {/* USER */}

                <div className="flex gap-3 justify-end">

                  <div
                    className="
                      px-4 py-3 rounded-2xl
                      max-w-xl
                    "
                    style={{
                      background:
                        "rgba(6,182,212,0.12)",

                      border:
                        "1px solid rgba(6,182,212,0.15)",
                    }}
                  >

                    <p className="text-white text-sm leading-relaxed">

                      React reconciliation compares the virtual DOM
                      trees and updates only changed nodes efficiently.

                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* RIGHT SIDE */}

          <div className="space-y-6">

            {/* USER CAMERA */}

            <div
              className="
                rounded-3xl
                h-[420px]
                flex flex-col items-center justify-center
                relative overflow-hidden
              "
              style={{
                background:
                  "rgba(255,255,255,0.04)",

                border:
                  "1px solid rgba(255,255,255,0.08)",
              }}
            >

              {/* GLOW */}

              <div
                className="absolute pointer-events-none"
                style={{
                  width: "260px",
                  height: "260px",

                  background:
                    "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)",
                }}
              />

              <Camera
                size={56}
                className="text-slate-500 relative z-10"
              />

              <p className="text-slate-400 mt-4 text-sm relative z-10">

                Camera Feed

              </p>

            </div>

            {/* SESSION STATS */}

            <div
              className="rounded-3xl p-5"
              style={{
                background:
                  "rgba(255,255,255,0.04)",

                border:
                  "1px solid rgba(255,255,255,0.08)",
              }}
            >

              <h3 className="text-white font-semibold mb-4">

                Session Stats

              </h3>

              <div className="space-y-4">

                <div className="flex items-center justify-between">

                  <p className="text-slate-400 text-sm">

                    Questions Asked

                  </p>

                  <p className="text-white font-semibold">

                    5

                  </p>

                </div>

                <div className="flex items-center justify-between">

                  <p className="text-slate-400 text-sm">

                    Confidence Score

                  </p>

                  <p className="text-cyan-400 font-semibold">

                    82%

                  </p>

                </div>

                <div className="flex items-center justify-between">

                  <p className="text-slate-400 text-sm">

                    Communication

                  </p>

                  <p className="text-emerald-400 font-semibold">

                    Good

                  </p>

                </div>

              </div>

            </div>

            {/* CONTROLS */}

            <div
              className="
                rounded-3xl
                p-5
                flex items-center justify-center gap-4
              "
              style={{
                background:
                  "rgba(255,255,255,0.04)",

                border:
                  "1px solid rgba(255,255,255,0.08)",
              }}
            >

              {/* MIC */}

              <button
                className="
                  w-14 h-14 rounded-2xl
                  flex items-center justify-center
                  bg-white/5 hover:bg-white/10
                  border border-white/10
                  transition-all
                "
              >

                <Mic
                  size={22}
                  className="text-white"
                />

              </button>

              {/* CAMERA */}

              <button
                className="
                  w-14 h-14 rounded-2xl
                  flex items-center justify-center
                  bg-white/5 hover:bg-white/10
                  border border-white/10
                  transition-all
                "
              >

                <Camera
                  size={22}
                  className="text-white"
                />

              </button>

              {/* END */}

              <button
                className="
                  w-14 h-14 rounded-2xl
                  flex items-center justify-center
                  transition-all
                "
                style={{
                  background:
                    "rgba(239,68,68,0.15)",

                  border:
                    "1px solid rgba(239,68,68,0.25)",
                }}
              >

                <PhoneOff
                  size={22}
                  className="text-red-400"
                />

              </button>

            </div>

          </div>

        </div>

      </div>

    </DashboardLayout>
  );
};

export default InterviewSession;