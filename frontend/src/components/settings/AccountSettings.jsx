// src/components/settings/AccountSettings.jsx

import { motion } from "framer-motion";

import {
  User,
  Mail,
  BriefcaseBusiness,
  FileText,
  Save,
  Sparkles,
} from "lucide-react";

const AccountSettings = () => {
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
              <User
                className="text-cyan-400"
                size={26}
              />
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white">
                Account Settings
              </h2>

              <p className="text-sm text-gray-400">
                Manage personal account information
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm">
            <Sparkles size={16} />
            Profile Preferences
          </div>
        </div>

        {/* Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Full Name */}
          <div>
            <label className="text-sm text-gray-400 mb-2 block">
              Full Name
            </label>

            <div className="relative">
              
              <User
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                size={18}
              />

              <input
                type="text"
                defaultValue="Aditya Varshney"
                className="
                  w-full
                  bg-[#111827]
                  border
                  border-white/10
                  rounded-2xl
                  py-4
                  pl-12
                  pr-4
                  text-white
                  outline-none
                  focus:border-cyan-500/40
                  transition-all
                "
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-sm text-gray-400 mb-2 block">
              Email Address
            </label>

            <div className="relative">
              
              <Mail
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                size={18}
              />

              <input
                type="email"
                defaultValue="aditya@example.com"
                className="
                  w-full
                  bg-[#111827]
                  border
                  border-white/10
                  rounded-2xl
                  py-4
                  pl-12
                  pr-4
                  text-white
                  outline-none
                  focus:border-cyan-500/40
                  transition-all
                "
              />
            </div>
          </div>

          {/* Role */}
          <div>
            <label className="text-sm text-gray-400 mb-2 block">
              Career Role
            </label>

            <div className="relative">
              
              <BriefcaseBusiness
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                size={18}
              />

              <input
                type="text"
                defaultValue="MERN Stack Developer"
                className="
                  w-full
                  bg-[#111827]
                  border
                  border-white/10
                  rounded-2xl
                  py-4
                  pl-12
                  pr-4
                  text-white
                  outline-none
                  focus:border-cyan-500/40
                  transition-all
                "
              />
            </div>
          </div>

          {/* Resume */}
          <div>
            <label className="text-sm text-gray-400 mb-2 block">
              Resume Status
            </label>

            <div className="relative">
              
              <FileText
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                size={18}
              />

              <input
                type="text"
                defaultValue="ATS Optimized Resume Uploaded"
                className="
                  w-full
                  bg-[#111827]
                  border
                  border-white/10
                  rounded-2xl
                  py-4
                  pl-12
                  pr-4
                  text-white
                  outline-none
                  focus:border-cyan-500/40
                  transition-all
                "
              />
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="mt-6">
          
          <label className="text-sm text-gray-400 mb-2 block">
            Bio
          </label>

          <textarea
            rows="5"
            defaultValue="Passionate full stack developer focused on building AI-powered SaaS platforms, coding interview systems, and scalable MERN applications."
            className="
              w-full
              bg-[#111827]
              border
              border-white/10
              rounded-3xl
              p-5
              text-white
              outline-none
              resize-none
              focus:border-cyan-500/40
              transition-all
            "
          ></textarea>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          
          <button
            className="
              flex
              items-center
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
            <Save size={18} />

            Save Changes
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default AccountSettings;