// src/components/profile/ProfileHeader.jsx

import { useSelector } from "react-redux";
import { motion } from "framer-motion";

import {
  BadgeCheck,
  Pencil,
  Sparkles,
  MapPin,
  BriefcaseBusiness,
} from "lucide-react";

const getInitials = (name) =>
  (name || "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "ST";

const ProfileHeader = () => {
  const user = useSelector((state) => state.auth.user || {});
  const displayName = user.name || "Student Name";
  const displayRole =
    user.role === "student" ? "Student" : user.role || "Learner";
  const displayLocation = user.location || "Remote";
  const displayBio =
    user.bio ||
    "Passionate learner tracking interview performance, coding progress, and career readiness with AI-powered insights.";
  const skills = user.skills || ["React", "Node.js", "MongoDB", "AI/ML", "Tailwind CSS"];
  const initials = getInitials(displayName);

  return (
    <motion.div
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      className="
        relative
        overflow-hidden
        bg-white/5
        border
        border-white/10
        backdrop-blur-xl
        rounded-3xl
        p-6
      "
    >
      {/* Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-purple-500/5 pointer-events-none"></div>

      <div className="relative flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">
        
        {/* Left */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          
          {/* Profile Image */}
          <div className="relative">
            
            <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-cyan-500 to-purple-500 p-[3px]">
              
              <div className="w-full h-full rounded-3xl bg-[#0B1120] flex items-center justify-center text-4xl font-bold text-white">
                {initials}
              </div>
            </div>

            {/* Online Badge */}
            <div className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-green-400 border-4 border-[#0B1120]"></div>
          </div>

          {/* User Info */}
          <div>
            
            <div className="flex flex-wrap items-center gap-3 mb-3">
              
              <h1 className="text-4xl font-bold text-white">
                {displayName}
              </h1>

              <div className="flex items-center gap-2 px-4 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-sm">
                
                <BadgeCheck size={16} />

                Verified
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-gray-400 mb-5">
              
              <div className="flex items-center gap-2">
                
                <BriefcaseBusiness size={18} />

                <span>{displayRole}</span>
              </div>

              <div className="flex items-center gap-2">
                
                <MapPin size={18} />

                <span>{displayLocation}</span>
              </div>
            </div>

            <p className="max-w-2xl text-gray-300 leading-relaxed">
              {displayBio}
            </p>

            {/* Skills */}
            <div className="flex flex-wrap gap-3 mt-5">
              
              {skills.map((skill, index) => (
                <div
                  key={index}
                  className="
                    px-4
                    py-2
                    rounded-2xl
                    bg-white/5
                    border
                    border-white/10
                    text-sm
                    text-gray-300
                  "
                >
                  {skill}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="flex flex-col gap-4">
          
          {/* AI Badge */}
          <div className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-300">
            
            <Sparkles size={18} />

            AI Optimized Profile
          </div>

          {/* Edit Button */}
          <button
            className="
              flex
              items-center
              justify-center
              gap-2
              px-6
              py-3
              rounded-2xl
              bg-cyan-500
              hover:bg-cyan-400
              transition-all
              duration-300
              text-white
              font-medium
            "
          >
            <Pencil size={18} />

            Edit Profile
          </button>
        </div>
      </div>

      {/* Bottom Info */}
      <div className="relative mt-8 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-white/10 rounded-3xl p-5">
        
        <div className="flex items-start gap-3">
          
          <Sparkles
            className="text-cyan-400 mt-1"
            size={18}
          />

          <p className="text-sm text-gray-300 leading-relaxed">
            Your profile showcases interview performance,
            coding analytics, resume strength, achievements,
            and AI-generated career insights to recruiters
            and placement systems.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileHeader;