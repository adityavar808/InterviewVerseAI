// src/components/settings/NotificationSettings.jsx

import { motion } from "framer-motion";

import {
  Bell,
  Mail,
  Brain,
  CalendarDays,
  Sparkles,
} from "lucide-react";

const notifications = [
  {
    title: "Email Notifications",
    description:
      "Receive important updates and account activity alerts.",
    icon: Mail,
    enabled: true,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
  },
  {
    title: "Interview Reminders",
    description:
      "Get reminders for scheduled mock interviews and practice sessions.",
    icon: CalendarDays,
    enabled: true,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
  },
  {
    title: "AI Insights Alerts",
    description:
      "Receive AI-generated performance analytics and recommendations.",
    icon: Brain,
    enabled: false,
    color: "text-green-400",
    bg: "bg-green-500/10",
  },
];

const NotificationSettings = () => {
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
              <Bell
                className="text-cyan-400"
                size={26}
              />
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white">
                Notification Settings
              </h2>

              <p className="text-sm text-gray-400">
                Manage alerts & platform notifications
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm">
            <Sparkles size={16} />
            Smart Alerts
          </div>
        </div>

        {/* Notification Cards */}
        <div className="space-y-5">
          
          {notifications.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={index}
                whileHover={{ y: -3 }}
                className="
                  flex
                  flex-col
                  lg:flex-row
                  lg:items-center
                  lg:justify-between
                  gap-5
                  bg-[#111827]
                  border
                  border-white/10
                  rounded-3xl
                  p-5
                "
              >
                {/* Left */}
                <div className="flex items-start gap-4">
                  
                  <div
                    className={`
                      w-14
                      h-14
                      rounded-2xl
                      flex
                      items-center
                      justify-center
                      ${item.bg}
                    `}
                  >
                    <Icon
                      className={item.color}
                      size={24}
                    />
                  </div>

                  <div>
                    
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {item.title}
                    </h3>

                    <p className="text-sm text-gray-400 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Toggle */}
                <div
                  className={`
                    w-14
                    h-8
                    rounded-full
                    flex
                    items-center
                    px-1
                    transition-all
                    duration-300
                    ${
                      item.enabled
                        ? "bg-cyan-500"
                        : "bg-white/10"
                    }
                  `}
                >
                  <div
                    className={`
                      w-6
                      h-6
                      rounded-full
                      bg-white
                      transition-all
                      duration-300
                      ${
                        item.enabled
                          ? "ml-auto"
                          : "ml-0"
                      }
                    `}
                  ></div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Summary */}
        <div className="mt-8 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-white/10 rounded-3xl p-5">
          
          <h3 className="text-lg font-semibold text-white mb-2">
            AI Notification Summary
          </h3>

          <p className="text-sm text-gray-300 leading-relaxed">
            Customize alerts for interview schedules,
            AI-generated insights, coding reminders, and
            important platform updates to stay consistent
            with your placement preparation journey.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default NotificationSettings;