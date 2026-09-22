// src/components/profile/ProfileAboutCard.jsx

import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { User, GraduationCap, BriefcaseBusiness, Sparkles, Rocket, Target, CalendarDays } from "lucide-react";

const ProfileAboutCard = () => {
  const user = useSelector((state) => state.auth.user || {});
  const bio = user.bio || "Bio not provided yet.";
  const headline = user.headline || "Headline not available.";
  const skillSummary = Array.isArray(user.skills) && user.skills.length > 0
    ? user.skills.slice(0, 6).join(", ")
    : "No skills added yet.";

  return (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
    className="relative overflow-hidden bg-slate-900/60 border border-white/10 backdrop-blur-md rounded-2xl p-4 shadow-xl"
  >
    {/* Glow */}
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute -top-20 -left-12 h-56 w-56 rounded-full bg-cyan-500/[0.06] blur-[50px]" />
      <div className="absolute top-0 left-0 right-0 h-[2px] rounded-full"
           style={{ background: "linear-gradient(90deg, rgba(6,182,212,0.5), transparent)" }} />
    </div>

    <div className="relative flex flex-col">

      {/* Header */}
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center flex-shrink-0">
            <User className="text-cyan-400" size={18} />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white leading-tight">About</h2>
            <p className="text-[11px] text-slate-400">Personal & career overview</p>
          </div>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-violet-400/20 bg-violet-400/10 text-violet-300 text-[10px] font-medium">
          <Sparkles size={11} />
          AI Profile
        </span>
      </div>

      <div className="flex flex-col gap-3 flex-1">

        {/* Bio */}
        <div className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
          <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mb-1">Bio</p>
          <p className="text-xs text-slate-300 leading-relaxed">
            {bio}
          </p>
        </div>

        {/* Education + Experience */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-7 h-7 rounded-lg bg-cyan-400/10 flex items-center justify-center flex-shrink-0">
                <GraduationCap className="text-cyan-400" size={15} />
              </div>
              <div>
                <p className="text-xs font-semibold text-white leading-tight">Headline</p>
                <p className="text-[10px] text-slate-400">Profile summary</p>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {headline}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-7 h-7 rounded-lg bg-violet-400/10 flex items-center justify-center flex-shrink-0">
                <BriefcaseBusiness className="text-violet-400" size={15} />
              </div>
              <div>
                <p className="text-xs font-semibold text-white leading-tight">Skills</p>
                <p className="text-[10px] text-slate-400">Top technologies</p>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {skillSummary}
            </p>
          </div>
        </div>

        {/* AI summary */}
        <div className="rounded-xl border border-white/10 px-4 py-3"
             style={{ background: "linear-gradient(135deg, rgba(6,182,212,0.08), rgba(139,92,246,0.08))" }}>
          <div className="flex items-start gap-2">
            <Sparkles size={13} className="text-cyan-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-white mb-0.5">AI Career Summary</p>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Strong growth in full-stack development, coding interviews, and AI product building.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
  );
};

export default ProfileAboutCard;