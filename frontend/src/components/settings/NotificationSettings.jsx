// src/components/settings/NotificationSettings.jsx

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import { Bell, Mail, Brain, CalendarDays, Sparkles } from "lucide-react";
import studentService from "../../services/studentApi";
import { setCredentials } from "../../redux/slices/authSlice";

const defaultNotifications = [
  {
    title: "Email Notifications",
    description: "Receive important updates and account activity alerts.",
    icon: Mail,
    enabled: true,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
  },
  {
    title: "Interview Reminders",
    description: "Get reminders for scheduled mock interviews and practice sessions.",
    icon: CalendarDays,
    enabled: true,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
  },
  {
    title: "AI Insights Alerts",
    description: "Receive AI-generated performance analytics and recommendations.",
    icon: Brain,
    enabled: false,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
];

const NotificationSettings = () => {
  const dispatch = useDispatch();
  const { user, accessToken } = useSelector((state) => state.auth);
  const [items, setItems] = useState(defaultNotifications);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user?.notificationSettings) {
      setItems([
        {
          title: "Email Notifications",
          description: "Receive important updates and account activity alerts.",
          icon: Mail,
          enabled: user.notificationSettings.emailNotifications ?? true,
          color: "text-cyan-400",
          bg: "bg-cyan-500/10",
        },
        {
          title: "Interview Reminders",
          description: "Get reminders for scheduled mock interviews and practice sessions.",
          icon: CalendarDays,
          enabled: user.notificationSettings.interviewReminders ?? true,
          color: "text-purple-400",
          bg: "bg-purple-500/10",
        },
        {
          title: "AI Insights Alerts",
          description: "Receive AI-generated performance analytics and recommendations.",
          icon: Brain,
          enabled: user.notificationSettings.aiInsightsAlerts ?? false,
          color: "text-emerald-400",
          bg: "bg-emerald-500/10",
        },
      ]);
    }
  }, [user?.notificationSettings]);

  const toggleNotification = (index) => {
    setItems((prev) =>
      prev.map((item, idx) =>
        idx === index ? { ...item, enabled: !item.enabled } : item
      )
    );
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      const payload = {
        notificationSettings: {
          emailNotifications: items[0].enabled,
          interviewReminders: items[1].enabled,
          aiInsightsAlerts: items[2].enabled,
        },
      };

      const updatedUser = await studentService.updateProfile(payload);
      dispatch(setCredentials({ user: updatedUser, accessToken }));
      toast.success("Notification settings saved successfully.");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Unable to save notification settings."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="relative overflow-hidden bg-slate-900/60 border border-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-xl"
    >
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-16 -left-12 h-44 w-44 rounded-full bg-cyan-500/10 blur-[40px]" />
        <div className="absolute -bottom-16 -right-12 h-44 w-44 rounded-full bg-purple-500/10 blur-[40px]" />
        <div className="absolute top-0 left-0 right-0 h-[2px] rounded-full"
             style={{ background: "linear-gradient(90deg, rgba(34,211,238,0.6), rgba(167,139,250,0.4), transparent)" }} />
      </div>

      <div className="relative">
        
        {/* Compact Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center flex-shrink-0 shadow-sm">
              <Bell className="text-violet-400" size={18} />
            </div>

            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight leading-tight">Notification Settings</h2>
              <p className="text-[11px] text-slate-400">Manage alerts & platform notifications</p>
            </div>
          </div>

          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-purple-500/20 bg-purple-500/10 text-purple-300 text-xs font-semibold">
            <Sparkles size={12} />
            Smart Alerts
          </span>
        </div>

        {/* List of Notification Items */}
        <div className="space-y-3">
          {items.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={index}
                whileHover={{ y: -2 }}
                className="flex items-center justify-between gap-4 bg-white/[0.025] border border-white/10 rounded-xl p-3.5 hover:bg-white/[0.04] transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${item.bg} border border-white/5`}>
                    {Icon ? (
                      <Icon className={item.color} size={18} />
                    ) : (
                      <Bell className={item.color} size={18} />
                    )}
                  </div>

                  <div>
                    <h3 className="text-slate-200 font-bold text-xs leading-tight mb-0.5">{item.title}</h3>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{item.description}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => toggleNotification(index)}
                  className={`w-11 h-6 rounded-full flex items-center px-0.5 border transition-all duration-300 flex-shrink-0 ${
                    item.enabled ? "bg-cyan-400/20 border-cyan-400/30" : "bg-white/5 border-white/10"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full transition-all duration-300 ${
                      item.enabled ? "ml-auto bg-cyan-400" : "ml-0 bg-slate-400"
                    }`}
                  />
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Footer Area */}
        <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="bg-white/[0.025] border border-white/10 rounded-xl p-3 flex-1">
            <h3 className="text-xs font-bold text-white mb-0.5 leading-tight">AI Notification Summary</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Customize alerts for interview schedules, AI-generated insights, coding reminders, and important platform updates.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="w-full lg:w-auto px-5 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 transition-all duration-200 text-slate-950 font-bold text-xs shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? "Saving..." : "Save Notifications"}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default NotificationSettings;