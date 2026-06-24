import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { Clock3, Code2 } from "lucide-react";

const CodingNavbar = ({ question }) => {
  const [timeLeft, setTimeLeft] = useState(2700); // 45 minutes in seconds

  useEffect(() => {
    if (timeLeft <= 0) return;
    const intervalId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden bg-white/[0.035] border border-white/10 backdrop-blur-xl rounded-3xl px-4 py-2.5"
    >
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-16 h-72 w-72 rounded-full bg-cyan-500/[0.06] blur-[60px]" />
        <div className="absolute bottom-0 right-0 h-48 w-48 rounded-full bg-purple-500/[0.04] blur-[50px]" />
        <div className="absolute top-0 left-0 right-0 h-[2px] rounded-full"
             style={{ background: "linear-gradient(90deg, rgba(6,182,212,0.45), rgba(139,92,246,0.25), transparent)" }} />
      </div>

      <div className="relative flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        {/* Left */}
        <div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center flex-shrink-0">
              <Code2 className="text-cyan-400" size={16} />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-base font-semibold text-white leading-tight">
                  {question?.title || "Coding Problem"}
                </h1>

                {/* Badges shifted next to the question title */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span
                    className={`
                      px-2 py-0.5 rounded-full border text-[9px] font-semibold uppercase tracking-wider
                      ${
                        question?.difficulty === "Easy"
                          ? "bg-green-500/10 border-green-500/20 text-green-400"
                          : question?.difficulty === "Medium"
                            ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-400"
                            : "bg-red-500/10 border-red-500/20 text-red-400"
                      }
                    `}
                  >
                    {question?.difficulty || "Medium"}
                  </span>

                  <span className="px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[9px] font-semibold uppercase tracking-wider">
                    AI Assisted
                  </span>

                  <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[9px] font-semibold uppercase tracking-wider">
                    Interview Mode
                  </span>
                </div>
              </div>

              {question?.category && (
                <p className="text-[10px] text-slate-400 mt-0.5">{question?.category}</p>
              )}
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Timer */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-white/[0.03] border border-white/10">
            <Clock3 className="text-cyan-400" size={13} />
            <h3 className="text-white text-xs font-semibold">{formatTime(timeLeft)}</h3>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CodingNavbar;
