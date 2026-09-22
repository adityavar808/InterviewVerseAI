// src/components/profile/ProfileHeader.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  BadgeCheck,
  Pencil,
  Sparkles,
  MapPin,
  BriefcaseBusiness,
  Zap,
  Trophy,
  Flame,
} from "lucide-react";

const getInitials = (name) =>
  (name || "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "ST";

const ProfileHeader = ({ activeTab, onSelectTab }) => {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);
  const user = useSelector((state) => state.auth.user || {});

  const displayName = user.name || "Student Name";
  const displayRole = user.role === "student" ? "Student" : user.role || "Learner";
  const displayLocation = user.location || "Remote";
  const initials = getInitials(displayName);
  const interviewCount = Array.isArray(user.interviewHistory) ? user.interviewHistory.length : 0;
  const streakDays = user.streak || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="relative overflow-hidden bg-slate-900/60 border border-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-3.5 shadow-xl"
    >
      {/* Background Ambient Glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-16 -left-12 h-44 w-44 rounded-full bg-cyan-500/10 blur-[40px]" />
        <div className="absolute -bottom-16 -right-12 h-44 w-44 rounded-full bg-purple-500/10 blur-[40px]" />
        <div
          className="absolute top-0 left-0 right-0 h-[2px] rounded-full"
          style={{ background: "linear-gradient(90deg, rgba(34,211,238,0.6), rgba(167,139,250,0.4), transparent)" }}
        />
      </div>

      <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Left: Avatar + Details */}
        <div className="flex items-center gap-3">
          <div className="relative flex-shrink-0">
            <div
              className="w-11 h-11 sm:w-13 sm:h-13 rounded-xl p-[2px]"
              style={{ background: "linear-gradient(135deg, rgba(6,182,212,0.8), rgba(139,92,246,0.8))" }}
            >
              <div className="w-full h-full rounded-[10px] bg-slate-950 flex items-center justify-center overflow-hidden">
                {user.profileImage && !imageError ? (
                  <img
                    src={user.profileImage}
                    alt={displayName}
                    className="w-full h-full object-cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <span className="text-base sm:text-lg font-bold text-white/90">{initials}</span>
                )}
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-slate-950 border border-white/20 flex items-center justify-center shadow-md">
              <Zap size={9} className="text-cyan-400 fill-cyan-400" />
            </div>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base sm:text-lg font-bold text-white tracking-tight leading-tight">
                {displayName}
              </h1>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-cyan-400/20 bg-cyan-400/10 text-cyan-300 text-[10px] font-semibold">
                <BadgeCheck size={11} />
                Verified
              </span>
            </div>

            <div className="flex items-center gap-2 text-slate-400 text-[11px] mt-0.5 flex-wrap">
              <span className="flex items-center gap-1">
                <BriefcaseBusiness size={12} className="text-slate-400" />
                {displayRole}
              </span>
              <span className="text-slate-600">•</span>
              <span className="flex items-center gap-1">
                <MapPin size={12} className="text-slate-400" />
                {displayLocation}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Quick Stats & Actions */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap justify-between lg:justify-end">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onSelectTab && onSelectTab("overview")}
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 text-amber-300 text-[11px] font-semibold transition-all duration-200"
              title="View Interview Stats"
            >
              <Trophy size={12} className="text-amber-400" />
              <span>{interviewCount} Interviews</span>
            </button>
          </div>

          <button
            onClick={() => navigate("/settings")}
            className="flex items-center justify-center gap-1 px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 transition-all duration-200 text-slate-950 text-[11px] font-bold shadow-md shadow-cyan-500/20 cursor-pointer"
          >
            <Pencil size={12} />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileHeader;