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
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center flex-shrink-0 shadow-sm">
              <Palette
                className="text-cyan-400"
                size={18}
              />
            </div>

            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight leading-tight">
                Appearance Settings
              </h2>
              <p className="text-[11px] text-slate-400">
                Customize dashboard appearance & theme
              </p>
            </div>
          </div>

          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-purple-500/20 bg-purple-500/10 text-purple-300 text-xs font-semibold">
            <Sparkles size={12} />
            UI Personalization
          </span>
        </div>

        {/* Theme Cards */}
        <div className="space-y-3 mb-4">
          {defaultThemes.map((theme) => {
            const Icon = theme.icon;
            const isActive = theme.value === selectedTheme;

            return (
              <motion.button
                key={theme.value}
                type="button"
                whileHover={{ y: -2 }}
                onClick={() => setSelectedTheme(theme.value)}
                className={`
                  w-full
                  text-left
                  flex
                  items-center
                  justify-between
                  gap-4
                  rounded-xl
                  border
                  p-3.5
                  transition-all
                  duration-200
                  ${
                    isActive
                      ? "bg-cyan-400/10 border-cyan-400/30 ring-1 ring-cyan-400/30"
                      : "bg-white/[0.025] border-white/10 hover:border-cyan-400/20"
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${theme.bg} border border-white/5 flex-shrink-0`}>
                    <Icon className={theme.color} size={18} />
                  </div>

                  <div>
                    <h3 className="text-slate-200 font-bold text-xs leading-tight mb-0.5">{theme.title}</h3>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{theme.description}</p>
                  </div>
                </div>

                <div
                  className={`
                    inline-flex
                    items-center
                    justify-center
                    rounded-lg
                    px-3
                    py-1
                    text-xs
                    font-bold
                    transition-all
                    duration-200
                    flex-shrink-0
                    ${
                      isActive
                        ? "bg-cyan-400 text-slate-950 shadow-sm"
                        : "bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10"
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
        <div className="bg-white/[0.025] border border-white/10 rounded-xl p-3.5 hover:bg-white/[0.04] transition-all duration-200">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-lg bg-purple-400/10 flex items-center justify-center flex-shrink-0">
              <LayoutDashboard
                className="text-purple-400"
                size={16}
              />
            </div>

            <div>
              <h3 className="text-xs font-bold text-white leading-tight">
                Dashboard Density
              </h3>
              <p className="text-[10px] text-slate-400">
                Control dashboard spacing & layout feel
              </p>
            </div>
          </div>

          {/* Options */}
          <div className="grid grid-cols-3 gap-2.5">
            {densities.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setDensity(option)}
                className={`
                  py-2
                  rounded-lg
                  border
                  text-xs
                  font-bold
                  transition-all
                  duration-200
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
        <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="bg-white/[0.025] border border-white/10 rounded-xl p-3 flex-1">
            <h3 className="text-xs font-bold text-white mb-0.5 leading-tight">
              AI Appearance Summary
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Personalize your InterviewVerse AI dashboard experience with futuristic themes and layout density options.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="w-full lg:w-auto px-5 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 transition-all duration-200 text-slate-950 font-bold text-xs shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? "Saving..." : "Save Appearance"}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default AppearanceSettings;