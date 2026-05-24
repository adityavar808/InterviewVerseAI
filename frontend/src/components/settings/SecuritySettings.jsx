// src/components/settings/SecuritySettings.jsx

import { motion } from "framer-motion";

import {
  ShieldCheck,
  Lock,
  Smartphone,
  MonitorSmartphone,
  Sparkles,
} from "lucide-react";

const activeSessions = [
  {
    device: "Chrome on Windows",
    location: "India",
    status: "Current Session",
  },
  {
    device: "Mobile App",
    location: "India",
    status: "Active",
  },
];

const SecuritySettings = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
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
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 pointer-events-none"></div>

      <div className="relative">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          
          <div className="flex items-center gap-4">
            
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <ShieldCheck
                className="text-cyan-400"
                size={26}
              />
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white">
                Security Settings
              </h2>

              <p className="text-sm text-gray-400">
                Manage password & account security
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm">
            <Sparkles size={16} />
            Secure Account
          </div>
        </div>

        {/* Change Password */}
        <div className="bg-[#111827] border border-white/10 rounded-3xl p-5 mb-6">
          
          <div className="flex items-center gap-3 mb-5">
            
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center">
              <Lock
                className="text-cyan-400"
                size={22}
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white">
                Change Password
              </h3>

              <p className="text-sm text-gray-400">
                Update your account password
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            
            <input
              type="password"
              placeholder="Current Password"
              className="
                w-full
                bg-black/20
                border
                border-white/10
                rounded-2xl
                px-4
                py-4
                text-white
                outline-none
                focus:border-cyan-500/40
              "
            />

            <input
              type="password"
              placeholder="New Password"
              className="
                w-full
                bg-black/20
                border
                border-white/10
                rounded-2xl
                px-4
                py-4
                text-white
                outline-none
                focus:border-cyan-500/40
              "
            />

            <input
              type="password"
              placeholder="Confirm Password"
              className="
                w-full
                bg-black/20
                border
                border-white/10
                rounded-2xl
                px-4
                py-4
                text-white
                outline-none
                focus:border-cyan-500/40
              "
            />
          </div>

          <button
            className="
              mt-5
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
            Update Password
          </button>
        </div>

        {/* Two Factor */}
        <div className="bg-[#111827] border border-white/10 rounded-3xl p-5 mb-6">
          
          <div className="flex items-center justify-between gap-4">
            
            <div className="flex items-center gap-4">
              
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center">
                <Smartphone
                  className="text-purple-400"
                  size={22}
                />
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white">
                  Two Factor Authentication
                </h3>

                <p className="text-sm text-gray-400">
                  Add extra security to your account
                </p>
              </div>
            </div>

            {/* Toggle */}
            <div className="w-14 h-8 rounded-full bg-cyan-500 flex items-center px-1">
              <div className="w-6 h-6 rounded-full bg-white ml-auto"></div>
            </div>
          </div>
        </div>

        {/* Active Sessions */}
        <div className="bg-[#111827] border border-white/10 rounded-3xl p-5">
          
          <div className="flex items-center gap-3 mb-6">
            
            <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center">
              <MonitorSmartphone
                className="text-green-400"
                size={22}
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white">
                Active Sessions
              </h3>

              <p className="text-sm text-gray-400">
                Devices currently logged into your account
              </p>
            </div>
          </div>

          <div className="space-y-4">
            
            {activeSessions.map((session, index) => (
              <div
                key={index}
                className="
                  flex
                  flex-col
                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                  gap-4
                  bg-black/20
                  border
                  border-white/10
                  rounded-2xl
                  p-4
                "
              >
                <div>
                  
                  <h4 className="text-white font-medium">
                    {session.device}
                  </h4>

                  <p className="text-sm text-gray-400">
                    {session.location}
                  </p>
                </div>

                <div className="px-4 py-2 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm w-fit">
                  {session.status}
                </div>
              </div>
            ))}
          </div>

          <button
            className="
              mt-5
              px-5
              py-3
              rounded-2xl
              border
              border-red-500/20
              bg-red-500/10
              hover:bg-red-500/20
              transition-all
              duration-300
              text-red-400
              font-medium
            "
          >
            Logout All Devices
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default SecuritySettings;