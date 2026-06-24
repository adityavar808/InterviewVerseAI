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
    color: "text-green-400",
    bg: "bg-green-500/10",
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
          color: "text-green-400",
          bg: "bg-green-500/10",
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
      initial={{ opacity: 0, y: 15 }}
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

      <div className="relative">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center flex-shrink-0">
              <Bell className="text-cyan-400" size={22} />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white leading-tight">Notification Settings</h2>
              <p className="text-xs text-slate-400 mt-0.5">Manage alerts & platform notifications</p>
            </div>
          </div>

          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-violet-400/20 bg-violet-400/10 text-violet-300 text-[11px] font-semibold">
            <Sparkles size={11} />
            Smart Alerts
          </span>
        </div>

        {/* List of Notification Items */}
        <div className="space-y-5">
          {items.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={index}
                whileHover={{ y: -3 }}
                className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 bg-white/[0.03] border border-white/10 rounded-2xl p-5 hover:bg-white/[0.045] transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${item.bg} border border-white/5`}>
                    {Icon ? (
                      <Icon className={item.color} size={24} />
                    ) : (
                      <Bell className={item.color} size={24} />
                    )}
                  </div>

                  <div>
                    <h3 className="text-slate-200 font-semibold text-sm leading-tight mb-2">{item.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => toggleNotification(index)}
                  className={`w-14 h-8 rounded-full flex items-center px-1 border transition-all duration-300 flex-shrink-0 ${
                    item.enabled ? "bg-cyan-400/20 border-cyan-400/30" : "bg-white/5 border-white/10"
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full transition-all duration-300 ${
                      item.enabled ? "ml-auto bg-cyan-400" : "ml-0 bg-slate-400"
                    }`}
                  />
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Footer Area */}
        <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 hover:bg-white/[0.045] transition-all duration-300 flex-1">
            <h3 className="text-sm font-semibold text-white mb-2 leading-tight">AI Notification Summary</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Customize alerts for interview schedules, AI-generated insights, coding reminders, and important platform updates to stay consistent with your placement preparation journey.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="w-full lg:w-auto px-6 py-3.5 rounded-2xl bg-cyan-400 hover:bg-cyan-300 transition-all duration-200 text-slate-950 font-semibold text-sm shadow-[0_0_20px_rgba(34,211,238,0.25)] hover:shadow-[0_0_25px_rgba(34,211,238,0.35)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? "Saving..." : "Save Notifications"}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default NotificationSettings;