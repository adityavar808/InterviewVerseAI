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
              <Brain className="text-cyan-400" size={22} />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white leading-tight">Interview Preferences</h2>
              <p className="text-xs text-slate-400 mt-0.5">Customize AI interview experience</p>
            </div>
          </div>

          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-violet-400/20 bg-violet-400/10 text-violet-300 text-[11px] font-semibold">
            <Sparkles size={11} />
            AI Personalization
          </span>
        </div>

        {/* Form Fields Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-1.5 block">Preferred Language</label>
            <div className="relative">
              <Languages className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <select
                value={preferences.language}
                onChange={(e) => handleChange("language", e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-slate-200 outline-none focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/20 focus:bg-white/[0.05] transition-all duration-200 appearance-none [&>option]:bg-slate-900 [&>option]:text-white"
              >
                <option>English</option>
                <option>Hindi</option>
                <option>English + Hindi</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-1.5 block">Interview Duration</label>
            <div className="relative">
              <Timer className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <select
                value={preferences.duration}
                onChange={(e) => handleChange("duration", e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-slate-200 outline-none focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/20 focus:bg-white/[0.05] transition-all duration-200 appearance-none [&>option]:bg-slate-900 [&>option]:text-white"
              >
                <option>15 Minutes</option>
                <option>30 Minutes</option>
                <option>45 Minutes</option>
                <option>60 Minutes</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-1.5 block">AI Interview Voice</label>
            <div className="relative">
              <Mic className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <select
                value={preferences.voice}
                onChange={(e) => handleChange("voice", e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-slate-200 outline-none focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/20 focus:bg-white/[0.05] transition-all duration-200 appearance-none [&>option]:bg-slate-900 [&>option]:text-white"
              >
                <option>Professional Male</option>
                <option>Professional Female</option>
                <option>Neutral AI Voice</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-1.5 block">Default Difficulty</label>
            <div className="relative">
              <Brain className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <select
                value={preferences.difficulty}
                onChange={(e) => handleChange("difficulty", e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-slate-200 outline-none focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/20 focus:bg-white/[0.05] transition-all duration-200 appearance-none [&>option]:bg-slate-900 [&>option]:text-white"
              >
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>
          </div>
        </div>

        {/* Toggles */}
        <div className="space-y-5 mt-8">
          <div className="flex items-center justify-between bg-white/[0.03] border border-white/10 rounded-2xl p-5 hover:bg-white/[0.045] transition-all duration-300">
            <div>
              <h3 className="text-slate-200 font-semibold text-sm leading-tight">Camera Access</h3>
              <p className="text-xs text-slate-400 mt-1">Enable camera during interviews</p>
            </div>
            <button
              type="button"
              onClick={() => handleChange("camera", !preferences.camera)}
              className={`w-14 h-8 rounded-full flex items-center px-1 border transition-all duration-300 ${
                preferences.camera ? "bg-cyan-400/20 border-cyan-400/30" : "bg-white/5 border-white/10"
              }`}
            >
              <div className={`w-6 h-6 rounded-full transition-all duration-300 ${preferences.camera ? "ml-auto bg-cyan-400" : "ml-0 bg-slate-400"}`} />
            </button>
          </div>

          <div className="flex items-center justify-between bg-white/[0.03] border border-white/10 rounded-2xl p-5 hover:bg-white/[0.045] transition-all duration-300">
            <div>
              <h3 className="text-slate-200 font-semibold text-sm leading-tight">Microphone Access</h3>
              <p className="text-xs text-slate-400 mt-1">Enable voice interaction with AI interviewer</p>
            </div>
            <button
              type="button"
              onClick={() => handleChange("microphone", !preferences.microphone)}
              className={`w-14 h-8 rounded-full flex items-center px-1 border transition-all duration-300 ${
                preferences.microphone ? "bg-cyan-400/20 border-cyan-400/30" : "bg-white/5 border-white/10"
              }`}
            >
              <div className={`w-6 h-6 rounded-full transition-all duration-300 ${preferences.microphone ? "ml-auto bg-cyan-400" : "ml-0 bg-slate-400"}`} />
            </button>
          </div>
        </div>

        {/* Footer Area */}
        <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 hover:bg-white/[0.045] transition-all duration-300 flex-1">
            <h3 className="text-sm font-semibold text-white mb-2 leading-tight">Interview Preference Summary</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Save your preferred question language, interview length, voice style, difficulty, and device access settings for a more consistent AI interview flow.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="w-full lg:w-auto px-6 py-3.5 rounded-2xl bg-cyan-400 hover:bg-cyan-300 transition-all duration-200 text-slate-950 font-semibold text-sm shadow-[0_0_20px_rgba(34,211,238,0.25)] hover:shadow-[0_0_25px_rgba(34,211,238,0.35)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? "Saving..." : "Save Preferences"}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default InterviewPreferences;