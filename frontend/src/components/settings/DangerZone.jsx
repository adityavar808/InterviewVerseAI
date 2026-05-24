// src/components/settings/DangerZone.jsx

import { motion } from "framer-motion";

import {
  TriangleAlert,
  Trash2,
  LogOut,
  ShieldAlert,
} from "lucide-react";

const DangerZone = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="
        relative
        overflow-hidden
        bg-red-500/5
        border
        border-red-500/20
        backdrop-blur-xl
        rounded-3xl
        p-6
      "
    >
      {/* Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent pointer-events-none"></div>

      <div className="relative">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <TriangleAlert
              className="text-red-400"
              size={28}
            />
          </div>

          <div>
            
            <h2 className="text-2xl font-semibold text-white">
              Danger Zone
            </h2>

            <p className="text-sm text-gray-400">
              Sensitive account & security actions
            </p>
          </div>
        </div>

        {/* Logout All Devices */}
        <div className="bg-[#111827] border border-white/10 rounded-3xl p-5 mb-6">
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            
            {/* Left */}
            <div className="flex items-start gap-4">
              
              <div className="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center">
                <LogOut
                  className="text-orange-400"
                  size={24}
                />
              </div>

              <div>
                
                <h3 className="text-lg font-semibold text-white mb-2">
                  Logout All Devices
                </h3>

                <p className="text-sm text-gray-400 leading-relaxed">
                  This will immediately sign you out from
                  all active devices and sessions.
                </p>
              </div>
            </div>

            {/* Button */}
            <button
              className="
                px-6
                py-3
                rounded-2xl
                bg-orange-500/10
                border
                border-orange-500/20
                hover:bg-orange-500/20
                transition-all
                duration-300
                text-orange-400
                font-medium
              "
            >
              Logout Devices
            </button>
          </div>
        </div>

        {/* Delete Account */}
        <div className="bg-[#111827] border border-red-500/20 rounded-3xl p-5">
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            
            {/* Left */}
            <div className="flex items-start gap-4">
              
              <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center">
                <Trash2
                  className="text-red-400"
                  size={24}
                />
              </div>

              <div>
                
                <h3 className="text-lg font-semibold text-white mb-2">
                  Delete Account
                </h3>

                <p className="text-sm text-gray-400 leading-relaxed">
                  Permanently remove your InterviewVerse AI
                  account, analytics, interviews, coding
                  history, and all associated data.
                </p>
              </div>
            </div>

            {/* Button */}
            <button
              className="
                px-6
                py-3
                rounded-2xl
                bg-red-500
                hover:bg-red-400
                transition-all
                duration-300
                text-white
                font-medium
              "
            >
              Delete Account
            </button>
          </div>
        </div>

        {/* Warning Box */}
        <div className="mt-8 bg-red-500/10 border border-red-500/20 rounded-3xl p-5">
          
          <div className="flex items-start gap-4">
            
            <ShieldAlert
              className="text-red-400 mt-1"
              size={22}
            />

            <div>
              
              <h3 className="text-lg font-semibold text-white mb-2">
                Important Warning
              </h3>

              <p className="text-sm text-gray-300 leading-relaxed">
                Actions performed inside the danger zone are
                sensitive and may permanently affect your
                account, interview history, coding analytics,
                resume reports, and AI-generated insights.
                Please proceed carefully.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DangerZone;