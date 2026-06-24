// src/components/profile/ProfileHeader.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  BadgeCheck,
  Pencil,
  Sparkles,
  MapPin,
  BriefcaseBusiness,
  Zap,
} from "lucide-react";

const getInitials = (name) =>
  (name || "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "ST";

const ProfileHeader = () => {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);
  const user = useSelector((state) => state.auth.user || {});

  const displayName     = user.name || "Student Name";
  const displayRole     = user.role === "student" ? "Student" : user.role || "Learner";
  const displayLocation = user.location || "Remote";
  const initials = getInitials(displayName);

  return (
    <motion.div
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative overflow-hidden bg-white/[0.035] border border-white/10 backdrop-blur-xl rounded-3xl p-7"
    >
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-16 h-72 w-72 rounded-full bg-cyan-500/[0.06] blur-[60px]" />
        <div className="absolute bottom-0 right-0 h-48 w-48 rounded-full bg-violet-500/[0.05] blur-[50px]" />
        <div className="absolute top-0 left-0 right-0 h-[2px] rounded-full"
             style={{ background: "linear-gradient(90deg, rgba(6,182,212,0.55), rgba(139,92,246,0.3), transparent)" }} />
      </div>

      <div className="relative flex flex-col xl:flex-row xl:items-start xl:justify-between gap-8">

        {/* ── Left ── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-7">

          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-28 h-28 rounded-[22px] p-[2px]"
                 style={{ background: "linear-gradient(135deg, rgba(6,182,212,0.7), rgba(139,92,246,0.7))" }}>
              <div className="w-full h-full rounded-[20px] bg-slate-950 flex items-center justify-center overflow-hidden">
                {user.profileImage && !imageError ? (
                  <img
                    src={user.profileImage}
                    alt={displayName}
                    className="w-full h-full object-cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <span className="text-3xl font-bold text-white/80">{initials}</span>
                )}
              </div>
            </div>
            {/* Online dot */}
            <div className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-slate-950 border border-white/10 flex items-center justify-center">
              <Zap size={12} className="text-cyan-400" />
            </div>
          </div>

          {/* Info */}
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-white leading-tight tracking-tight">
                {displayName}
              </h1>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-cyan-400/20 bg-cyan-400/10 text-cyan-300 text-xs font-medium">
                <BadgeCheck size={13} />
                Verified
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-slate-400 text-sm mb-4">
              <span className="flex items-center gap-1.5">
                <BriefcaseBusiness size={15} />
                {displayRole}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin size={15} />
                {displayLocation}
              </span>
            </div>

          </div>
        </div>

        {/* ── Right ── */}
        <div className="flex flex-col gap-3 xl:items-end xl:flex-shrink-0">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl border border-violet-400/20 bg-violet-400/10 text-violet-300 text-sm">
            <Sparkles size={15} />
            AI Optimized Profile
          </div>
          <button
            onClick={() => navigate("/settings")}
            className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-2xl bg-cyan-400 hover:bg-cyan-300 transition-all duration-200 text-slate-950 text-sm font-semibold cursor-pointer"
          >
            <Pencil size={15} />
            Edit Profile
          </button>
        </div>
      </div>

      {/* Bottom AI note */}
      <div className="relative mt-7 flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4">
        <Sparkles size={15} className="text-cyan-400 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-slate-400 leading-relaxed">
          Your profile showcases interview performance, coding analytics, resume strength, achievements,
          and AI-generated career insights to recruiters and placement systems.
        </p>
      </div>
    </motion.div>
  );
};

export default ProfileHeader;