// src/components/settings/AppearanceSettings.jsx

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import { Palette, Moon, Monitor, LayoutDashboard, Sparkles } from "lucide-react";

const defaultThemes = [
  {
    title: "Dark Mode",
    description: "Premium futuristic dark dashboard experience.",
    icon: Moon,
    value: "dark",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
  },
  {
    title: "System Theme",
    description: "Automatically match your system appearance.",
    icon: Monitor,
    value: "system",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
  },
];

const densities = ["Compact", "Comfortable", "Expanded"];
const STORAGE_KEY = "interviewverse_appearance_settings";

const AppearanceSettings = () => {
  const [selectedTheme, setSelectedTheme] = useState("dark");
  const [density, setDensity] = useState("Comfortable");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object") {
          setSelectedTheme(parsed.theme || "dark");
          setDensity(parsed.density || "Comfortable");
        }
      } catch (error) {
        console.error("Failed to parse appearance settings:", error);
      }
    }
  }, []);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ theme: selectedTheme, density })
      );
      toast.success("Appearance settings saved successfully.");
    } catch (error) {
      toast.error("Unable to save appearance settings.");
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
              <Palette
                className="text-cyan-400"
                size={22}
              />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white leading-tight">
                Appearance Settings
              </h2>

              <p className="text-xs text-slate-400 mt-0.5">
                Customize dashboard appearance & theme
              </p>
            </div>
          </div>

          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-violet-400/20 bg-violet-400/10 text-violet-300 text-[11px] font-semibold">
            <Sparkles size={11} />
            UI Personalization
          </span>
        </div>

        {/* Theme Cards */}
        <div className="space-y-5 mb-8">
          {defaultThemes.map((theme) => {
            const Icon = theme.icon;
            const isActive = theme.value === selectedTheme;

            return (
              <motion.button
                key={theme.value}
                type="button"
                whileHover={{ y: -3 }}
                onClick={() => setSelectedTheme(theme.value)}
                className={`
                  w-full
                  text-left
                  flex
                  flex-col
                  lg:flex-row
                  lg:items-center
                  lg:justify-between
                  gap-5
                  rounded-3xl
                  border
                  p-5
                  transition-all
                  duration-300
                  ${
                    isActive
                      ? "bg-cyan-400/10 border-cyan-400/30 ring-1 ring-cyan-400/30"
                      : "bg-white/[0.03] border-white/10 hover:border-cyan-400/20"
                  }
                `}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${theme.bg} border border-white/5`}>
                    <Icon className={theme.color} size={24} />
                  </div>

                  <div>
                    <h3 className="text-slate-200 font-semibold text-sm leading-tight mb-2">{theme.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{theme.description}</p>
                  </div>
                </div>

                <div
                  className={`
                    inline-flex
                    items-center
                    justify-center
                    rounded-2xl
                    px-4
                    py-2
                    text-xs
                    font-semibold
                    transition-all
                    duration-300
                    flex-shrink-0
                    ${
                      isActive
                        ? "bg-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(34,211,238,0.25)]"
                        : "bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10"
                    }
                  `}
                >
                  {isActive ? "Selected" : "Select"}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Dashboard Density */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 hover:bg-white/[0.045] transition-all duration-300">
          <div className="flex items-center gap-3.5 mb-6">
            <div className="w-10 h-10 rounded-xl bg-purple-400/10 flex items-center justify-center flex-shrink-0">
              <LayoutDashboard
                className="text-purple-400"
                size={18}
              />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white leading-tight">
                Dashboard Density
              </h3>

              <p className="text-[11px] text-slate-400 mt-0.5">
                Control dashboard spacing & layout feel
              </p>
            </div>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {densities.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setDensity(option)}
                className={`
                  py-3.5
                  rounded-2xl
                  border
                  text-xs
                  font-semibold
                  transition-all
                  duration-300
                  ${
                    option === density
                      ? "bg-cyan-400/10 border-cyan-400/30 text-cyan-400 ring-1 ring-cyan-400/30"
                      : "bg-white/[0.02] border-white/10 text-slate-300 hover:border-cyan-400/20"
                  }
                `}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Summary */}
        <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 hover:bg-white/[0.045] transition-all duration-300 flex-1">
            <h3 className="text-sm font-semibold text-white mb-2 leading-tight">
              AI Appearance Summary
            </h3>

            <p className="text-xs text-slate-400 leading-relaxed">
              Personalize your InterviewVerse AI dashboard experience with futuristic themes, optimized layout density, and premium UI customization preferences for better productivity.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="w-full lg:w-auto px-6 py-3.5 rounded-2xl bg-cyan-400 hover:bg-cyan-300 transition-all duration-200 text-slate-950 font-semibold text-sm shadow-[0_0_20px_rgba(34,211,238,0.25)] hover:shadow-[0_0_25px_rgba(34,211,238,0.35)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? "Saving..." : "Save Appearance"}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default AppearanceSettings;