import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useDropzone } from "react-dropzone";
import {
  AlertTriangle,
  Sparkles,
  Upload,
} from "lucide-react";

import DashboardLayout from "../../layouts/DashboardLayout";
import { buildAnalysis, extractTextFromFile, ROLE_KEYWORDS } from "../../utils/resumeAnalyzerUtils";
import studentService from "../../services/studentApi";

const roleOptions = Object.keys(ROLE_KEYWORDS);
const defaultRole = roleOptions[0] || "Frontend Developer";

const ResumeAnalyzer = () => {
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [selectedRole, setSelectedRole] = useState(defaultRole);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async (file, text, role) => {
    if (!text) {
      setAnalysis(null);
      setError("Please upload a resume containing text content to analyze.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await studentService.analyzeResume({
        resumeText: text,
        role,
        fileName: file.name
      });
      
      const data = response?.data || response;
      
      const formattedAnalysis = {
        scoreValue: data.score,
        stats: {
          atsScore: `${data.score}/100`,
          skillsFound: data.matchedKeywords?.length || 0,
          keywordMatch: `${Math.round((data.matchedKeywords?.length / (data.matchedKeywords?.length + data.missingKeywords?.length || 1)) * 100)}%`,
          projects: text.match(/project[s]?/gi)?.length || 0,
        },
        radarData: [
          { subject: "Technical", score: Math.min(100, (data.matchedKeywords?.length || 0) * 10 + 20) },
          { subject: "Projects", score: Math.min(100, (text.match(/project[s]?/gi)?.length || 0) * 15 + 10) },
          { subject: "ATS", score: data.score },
          { subject: "Communication", score: Math.min(100, 50 + (data.matchedKeywords?.length || 0) * 4) },
          { subject: "Skills", score: Math.min(100, (data.matchedKeywords?.length || 0) * 12 + 10) },
          { subject: "Experience", score: Math.min(100, 40 + (data.matchedKeywords?.length || 0) * 5) },
        ],
        roadmapSteps: data.improvements.map((imp, idx) => ({
          title: `Improvement #${idx + 1}`,
          description: imp,
          status: idx === 0 ? "High Impact" : "Recommended"
        })),
        matchedKeywords: data.matchedKeywords || [],
        missingKeywords: data.missingKeywords || [],
        improvement: `${Math.max(5, (data.missingKeywords?.length || 0) * 3)}%`,
        ranking: data.score >= 90 ? "Top 5%" : data.score >= 80 ? "Top 12%" : data.score >= 70 ? "Top 25%" : "Top 40%",
        readinessLabel: data.score >= 90 ? "Recruiter Ready" : data.score >= 80 ? "High Potential" : data.score >= 70 ? "Strong Foundation" : "Needs Refinement",
        summary: {
          name: file.name.split(".")[0],
          email: "Extracted by AI",
          description: `Resume analyzed by AI for the role of ${role}.`
        }
      };

      setAnalysis(formattedAnalysis);
    } catch (err) {
      console.error("Resume analysis failed:", err);
      setError("Resume analysis failed. Please try again.");
      setAnalysis(null);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file) => {
    if (!file) {
      return;
    }

    setError("");
    setResumeFile(file);

    try {
      const text = await extractTextFromFile(file);

      if (!text) {
        setResumeText("");
        setAnalysis(null);
        setError("Only plain text, markdown, or JSON resume files are supported right now.");
        return;
      }

      setResumeText(text);
      await handleAnalyze(file, text, selectedRole);
    } catch {
      setResumeText("");
      setAnalysis(null);
      setError("Something went wrong while reading the resume file. Please try again.");
    }
  };

  const handleRoleSelect = async (role) => {
    setSelectedRole(role);
    if (resumeText) {
      await handleAnalyze(resumeFile, resumeText, role);
    }
  };

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    accept: {
      "text/plain": [".txt"],
      "text/markdown": [".md"],
      "application/json": [".json"],
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
    multiple: false,
    disabled: loading,
    noClick: true,
    noKeyboard: true,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles?.[0];
      if (file) {
        handleFileUpload(file);
      }
    },
  });

  // Circle progress calculation variables
  const score = analysis ? analysis.scoreValue : 0;
  const radius = 64;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <DashboardLayout>
      <div className="space-y-6 pb-10 text-white">
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] p-7 backdrop-blur-xl sm:p-8 lg:p-10">
          {/* Top visual glow */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-24 -left-16 h-72 w-72 rounded-full bg-cyan-500/[0.06] blur-[60px]" />
            <div className="absolute bottom-0 right-0 h-48 w-48 rounded-full bg-violet-500/[0.04] blur-[50px]" />
            <div className="absolute top-0 left-0 right-0 h-[2px] rounded-full"
                 style={{ background: "linear-gradient(90deg, rgba(6,182,212,0.45), rgba(139,92,246,0.25), transparent)" }} />
          </div>

          <div className="relative space-y-6">
            {/* Header info */}
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-100">
                  <Sparkles size={12} />
                  Resume Analyzer
                </div>
                <h1 className="mt-4 text-3xl font-semibold text-white leading-tight">
                  Optimize Your Resume for ATS
                </h1>
                <p className="mt-2 max-w-2xl text-xs leading-relaxed text-slate-400">
                  Select a target role, drop your resume, and instantly see your ATS compatibility score alongside a checklist of actionable changes to help you stand out.
                </p>
              </div>
            </div>

            {/* Target Role Selector */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 hover:bg-white/[0.045] transition-all duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400 block mb-1.5">
                    Target Job Role
                  </label>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Choose the profession you want the AI to analyze your resume against.
                  </p>
                </div>
                <select
                  value={selectedRole}
                  onChange={(e) => handleRoleSelect(e.target.value)}
                  disabled={loading}
                  className="w-full sm:w-72 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-xs font-semibold text-white focus:border-cyan-400/40 focus:outline-none cursor-pointer hover:border-white/20 transition-colors"
                >
                  {roleOptions.map((role) => (
                    <option key={role} value={role} className="bg-slate-950 text-white font-sans">
                      {role}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-xs text-rose-300 leading-relaxed">
                {error}
              </div>
            )}

            {/* Main Area based on state */}
            {!analysis && !loading && (
              <div
                {...getRootProps()}
                className={`relative overflow-hidden rounded-3xl border border-dashed p-10 text-center transition-all ${
                  isDragActive
                    ? "border-cyan-400 bg-cyan-500/[0.06]"
                    : "border-white/15 bg-white/[0.03] hover:border-cyan-400/30 hover:bg-white/[0.045]"
                }`}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center py-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-500/10 text-cyan-400">
                    <Upload className={isDragActive ? "animate-bounce" : ""} size={22} />
                  </div>
                  <h3 className="mt-5 text-base font-semibold text-white">
                    {isDragActive ? "Drop your resume here!" : "Drag & drop your resume file"}
                  </h3>
                  <p className="mt-2 max-w-sm text-xs text-slate-400 leading-relaxed">
                    Supports PDF, Word (.docx), plain text (.txt), or markdown (.md) formats.
                  </p>
                  <button
                    type="button"
                    onClick={open}
                    className="mt-6 inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-white/[0.08] hover:border-white/20 active:scale-[0.98] cursor-pointer"
                  >
                    Browse Files
                  </button>
                </div>
              </div>
            )}

            {loading && (
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-12 text-center flex flex-col items-center justify-center">
                <div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-cyan-400/20 bg-cyan-500/10 text-cyan-400 animate-spin">
                  <div className="absolute inset-0 rounded-full border-t-2 border-cyan-400" />
                </div>
                <h3 className="mt-6 text-base font-semibold text-white">Analyzing Resume...</h3>
                <p className="mt-2 text-xs text-slate-400">Benchmarking syntax and extracting keywords for {selectedRole}.</p>
              </div>
            )}

            {analysis && !loading && (
              <div className="grid gap-6 md:grid-cols-[280px_1fr] items-start">
                {/* Score Indicator Card */}
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center flex flex-col items-center hover:bg-white/[0.045] transition-all duration-300">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-500 block mb-5">
                    ATS Score
                  </p>

                  <div className="relative flex items-center justify-center mb-4">
                    <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
                      <circle
                        stroke="rgba(255,255,255,0.05)"
                        fill="transparent"
                        strokeWidth={stroke}
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                      />
                      <circle
                        stroke="#22d3ee" // cyan-400
                        fill="transparent"
                        strokeWidth={stroke}
                        strokeDasharray={circumference + ' ' + circumference}
                        style={{ strokeDashoffset }}
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <span className="absolute text-2xl font-bold text-white">{analysis.scoreValue}%</span>
                  </div>

                  <h3 className="text-base font-semibold text-white leading-tight">{analysis.readinessLabel}</h3>
                  <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                    Estimated in the {analysis.ranking} for {selectedRole} candidates.
                  </p>

                  <div className="mt-6 w-full pt-5 border-t border-white/5 flex flex-col gap-4 text-left">
                    <div>
                      <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-500">File Name</p>
                      <p className="mt-1 text-xs text-slate-300 font-medium truncate max-w-[230px]" title={resumeFile?.name}>
                        {resumeFile?.name}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setResumeFile(null);
                        setResumeText("");
                        setAnalysis(null);
                        setError("");
                      }}
                      className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-xs font-semibold text-red-300 transition hover:bg-red-500/20 hover:border-red-500/30 active:scale-[0.98] cursor-pointer"
                    >
                      Analyze New File
                    </button>
                  </div>
                </div>

                {/* Problems to Fix List */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-base font-semibold text-white">Required Improvements to Increase Score</h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Apply these recommendations to optimize your content and increase your ATS score.
                      </p>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full border border-rose-400/20 bg-rose-500/10 text-rose-300 text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap">
                      {analysis.roadmapSteps.length} items to fix
                    </span>
                  </div>

                  <div className="grid gap-3.5">
                    {analysis.roadmapSteps.map((step, index) => (
                      <div
                        key={`${step.title}-${index}`}
                        className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 hover:bg-white/[0.045] transition-all duration-300 flex items-start gap-4"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-400">
                          <AlertTriangle size={18} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <h4 className="text-sm font-semibold text-white">{step.title}</h4>
                            <span className="px-2 py-0.5 rounded-full border border-rose-400/25 bg-rose-400/10 text-rose-300 text-[9px] font-semibold uppercase tracking-wider">
                              {step.status}
                            </span>
                          </div>
                          <p className="mt-2 text-xs leading-relaxed text-slate-400">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
};

export default ResumeAnalyzer;