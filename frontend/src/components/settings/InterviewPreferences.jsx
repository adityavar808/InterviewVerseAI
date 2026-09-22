// src/components/settings/InterviewPreferences.jsx

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import { Brain, Languages, Timer, Mic, Sparkles } from "lucide-react";

const defaultPreferences = {
  language: "English",
  duration: "45 Minutes",
  voice: "Neutral AI Voice",
  difficulty: "Medium",
  camera: true,
  microphone: true,
};

const STORAGE_KEY = "interviewverse_interview_preferences";

const InterviewPreferences = () => {
  const [preferences, setPreferences] = useState(defaultPreferences);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object") {
          setPreferences((prev) => ({ ...prev, ...parsed }));
        }
      } catch (error) {
        console.error("Failed to parse interview preferences:", error);
      }
    }
  }, []);

  const handleChange = (key, value) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
      toast.success("Interview preferences saved successfully.");
    } catch (error) {
      toast.error("Unable to save interview preferences.");
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
              <Brain className="text-cyan-400" size={18} />
            </div>

            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight leading-tight">Interview Preferences</h2>
              <p className="text-[11px] text-slate-400">Customize AI interview experience</p>
            </div>
          </div>

          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-purple-500/20 bg-purple-500/10 text-purple-300 text-xs font-semibold">
            <Sparkles size={12} />
            AI Personalization
          </span>
        </div>

        {/* Form Fields Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          <div>
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1 block">Preferred Language</label>
            <div className="relative">
              <Languages className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
              <select
                value={preferences.language}
                onChange={(e) => handleChange("language", e.target.value)}
                className="w-full bg-slate-950/40 border border-white/10 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-200 outline-none focus:border-cyan-400/50 transition-all appearance-none [&>option]:bg-slate-900 [&>option]:text-white"
              >
                <option>English</option>
                <option>Hindi</option>
                <option>English + Hindi</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1 block">Interview Duration</label>
            <div className="relative">
              <Timer className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
              <select
                value={preferences.duration}
                onChange={(e) => handleChange("duration", e.target.value)}
                className="w-full bg-slate-950/40 border border-white/10 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-200 outline-none focus:border-cyan-400/50 transition-all appearance-none [&>option]:bg-slate-900 [&>option]:text-white"
              >
                <option>15 Minutes</option>
                <option>30 Minutes</option>
                <option>45 Minutes</option>
                <option>60 Minutes</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1 block">AI Interview Voice</label>
            <div className="relative">
              <Mic className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
              <select
                value={preferences.voice}
                onChange={(e) => handleChange("voice", e.target.value)}
                className="w-full bg-slate-950/40 border border-white/10 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-200 outline-none focus:border-cyan-400/50 transition-all appearance-none [&>option]:bg-slate-900 [&>option]:text-white"
              >
                <option>Professional Male</option>
                <option>Professional Female</option>
                <option>Neutral AI Voice</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1 block">Default Difficulty</label>
            <div className="relative">
              <Brain className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
              <select
                value={preferences.difficulty}
                onChange={(e) => handleChange("difficulty", e.target.value)}
                className="w-full bg-slate-950/40 border border-white/10 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-200 outline-none focus:border-cyan-400/50 transition-all appearance-none [&>option]:bg-slate-900 [&>option]:text-white"
              >
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>
          </div>
        </div>

        {/* Toggles */}
        <div className="space-y-2.5 mt-4">
          <div className="flex items-center justify-between bg-white/[0.025] border border-white/10 rounded-xl p-3 hover:bg-white/[0.04] transition-all duration-200">
            <div>
              <h3 className="text-slate-200 font-bold text-xs leading-tight">Camera Access</h3>
              <p className="text-[11px] text-slate-400">Enable camera during interviews</p>
            </div>
            <button
              type="button"
              onClick={() => handleChange("camera", !preferences.camera)}
              className={`w-11 h-6 rounded-full flex items-center px-0.5 border transition-all duration-300 ${
                preferences.camera ? "bg-cyan-400/20 border-cyan-400/30" : "bg-white/5 border-white/10"
              }`}
            >
              <div className={`w-4 h-4 rounded-full transition-all duration-300 ${preferences.camera ? "ml-auto bg-cyan-400" : "ml-0 bg-slate-400"}`} />
            </button>
          </div>

          <div className="flex items-center justify-between bg-white/[0.025] border border-white/10 rounded-xl p-3 hover:bg-white/[0.04] transition-all duration-200">
            <div>
              <h3 className="text-slate-200 font-bold text-xs leading-tight">Microphone Access</h3>
              <p className="text-[11px] text-slate-400">Enable voice interaction with AI interviewer</p>
            </div>
            <button
              type="button"
              onClick={() => handleChange("microphone", !preferences.microphone)}
              className={`w-11 h-6 rounded-full flex items-center px-0.5 border transition-all duration-300 ${
                preferences.microphone ? "bg-cyan-400/20 border-cyan-400/30" : "bg-white/5 border-white/10"
              }`}
            >
              <div className={`w-4 h-4 rounded-full transition-all duration-300 ${preferences.microphone ? "ml-auto bg-cyan-400" : "ml-0 bg-slate-400"}`} />
            </button>
          </div>
        </div>

        {/* Footer Area */}
        <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="bg-white/[0.025] border border-white/10 rounded-xl p-3 flex-1">
            <h3 className="text-xs font-bold text-white mb-0.5 leading-tight">Interview Preference Summary</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Save your preferred question language, interview length, voice style, difficulty, and device access settings for a more consistent AI interview flow.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="w-full lg:w-auto px-5 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 transition-all duration-200 text-slate-950 font-bold text-xs shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? "Saving..." : "Save Preferences"}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default InterviewPreferences;