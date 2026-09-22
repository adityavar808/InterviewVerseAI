import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";
import { useSelector, useDispatch } from "react-redux";
import {
  AlertTriangle,
  Sparkles,
  Upload,
  FileText,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Target,
  BarChart3,
  ListChecks,
  UserCheck,
  RefreshCw,
  Zap,
  ShieldCheck,
  Briefcase,
  Layers,
  Award,
  BookOpen,
  Check
} from "lucide-react";

import DashboardLayout from "../../layouts/DashboardLayout";
import { buildAnalysis, extractTextFromFile, ROLE_KEYWORDS } from "../../utils/resumeAnalyzerUtils";
import studentService from "../../services/studentApi";
import { updateUserCredits } from "../../redux/slices/authSlice";

const roleOptions = Object.keys(ROLE_KEYWORDS);
const defaultRole = roleOptions[0] || "Frontend Developer";

const SAMPLE_RESUME_TEXT = `
Aditya Verma
Full Stack Software Engineer | MERN & Cloud Architecture
Email: aditya@example.com | GitHub: github.com/adityavar808 | LinkedIn: linkedin.com/in/aditya

PROFESSIONAL SUMMARY
Results-driven Full Stack Engineer with 3+ years of experience building scalable web applications, microservices, and AI-powered interfaces. Proficient in React, Node.js, Express, MongoDB, TypeScript, and AWS. Passionate about system design and automated CI/CD pipelines.

TECHNICAL SKILLS
- Frontend: React, Redux, JavaScript, TypeScript, HTML, CSS, TailwindCSS, Next.js
- Backend: Node.js, Express, REST APIs, Microservices, Authentication, JWT
- Database: MongoDB, PostgreSQL, SQL, Redis
- Cloud & DevOps: Docker, Kubernetes, AWS, CI/CD, Git

WORK EXPERIENCE
Senior Frontend & Full Stack Developer | TechVerse Inc. (2023 - Present)
- Engineered high-concurrency AI interview web application using React, Redux, and Node.js backend.
- Optimized frontend bundle sizes by 35% and improved page load speeds using lazy loading and code splitting.
- Implemented secure JWT authentication and role-based access control for 10,000+ active users.

Software Engineer Intern | Innovate Labs (2022 - 2023)
- Built interactive dashboard UI components using React, TailwindCSS, and Chart.js.
- Developed RESTful API endpoints using Node.js and MongoDB for real-time analytics.

PROJECTS
- AI InterviewVerse Platform: Comprehensive interview preparation portal featuring real-time speech evaluation, interactive coding sandbox, and ATS resume optimization engine.
- Distributed Microservices API Gateway: High-throughput API gateway built with Express and Redis for caching.
`;

const ResumeAnalyzer = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user || {});
  const resumeCredits = user.resumeCredits ?? 10;

  const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [selectedRole, setSelectedRole] = useState(defaultRole);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("roadmap"); // 'roadmap' | 'keywords' | 'breakdown' | 'profile'

  const handleAnalyze = async (file, text, role) => {
    if (resumeCredits < 1) {
      setAnalysis(null);
      setError("Insufficient resume analyzer credits. You have 0 credits remaining.");
      return;
    }

    if (!text) {
      setAnalysis(null);
      setError("Please upload a resume containing text content to analyze.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      let data = null;
      try {
        const response = await studentService.analyzeResume({
          resumeText: text,
          role,
          fileName: file?.name || "Sample_Resume.pdf"
        });
        data = response?.data || response;
        if (data?.resumeCredits !== undefined) {
          dispatch(updateUserCredits({ resumeCredits: data.resumeCredits }));
        }
      } catch (apiErr) {
        console.warn("Backend API unavailable or fallback used:", apiErr);
      }

      // Generate comprehensive client analysis as fallback/enrichment
      const localAnalysis = buildAnalysis({ resumeText: text, role, file: file || { name: "Sample_Resume.pdf" } });

      const scoreValue = data?.score ?? localAnalysis.scoreValue;
      const matched = data?.matchedKeywords ?? localAnalysis.matchedKeywords;
      const missing = data?.missingKeywords ?? localAnalysis.missingKeywords;

      const formattedAnalysis = {
        scoreValue,
        stats: {
          atsScore: `${scoreValue}/100`,
          skillsFound: localAnalysis.skillsFound.length,
          keywordMatch: `${Math.round((matched.length / (matched.length + missing.length || 1)) * 100)}%`,
          projects: localAnalysis.projectCount || (text.match(/project[s]?/gi)?.length || 0),
        },
        radarData: localAnalysis.radarData,
        roadmapSteps: data?.improvements
          ? data.improvements.map((imp, idx) => ({
              title: `Priority Action #${idx + 1}`,
              description: imp,
              status: idx === 0 ? "High Impact" : idx === 1 ? "Recommended" : "Boost ATS"
            }))
          : localAnalysis.roadmapSteps,
        matchedKeywords: matched,
        missingKeywords: missing,
        skillsFound: localAnalysis.skillsFound,
        improvement: localAnalysis.improvement,
        ranking: localAnalysis.ranking,
        readinessLabel: localAnalysis.readinessLabel,
        summary: {
          name: localAnalysis.summary.name || (file?.name ? file.name.split(".")[0] : "Candidate Profile"),
          email: localAnalysis.summary.email || "Extracted by AI Engine",
          description: `Resume analyzed and benchmarked against ${role} industry standards.`
        }
      };

      setAnalysis(formattedAnalysis);
    } catch (err) {
      console.error("Resume analysis failed:", err);
      setError("Resume analysis failed. Please try again or test with sample text.");
      setAnalysis(null);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file) => {
    if (!file) return;

    setError("");
    setResumeFile(file);

    try {
      const text = await extractTextFromFile(file);

      if (!text || text.trim().length === 0) {
        setResumeText("");
        setAnalysis(null);
        setError("Unable to extract text from file. Please ensure it contains readable text or convert to TXT/PDF.");
        return;
      }

      setResumeText(text);
      await handleAnalyze(file, text, selectedRole);
    } catch (err) {
      setResumeText("");
      setAnalysis(null);
      setError(err?.message || "Something went wrong while reading the resume file.");
    }
  };

  const handleSampleResume = async () => {
    setError("");
    const dummyFile = { name: "Sample_Software_Engineer_Resume.pdf" };
    setResumeFile(dummyFile);
    setResumeText(SAMPLE_RESUME_TEXT);
    await handleAnalyze(dummyFile, SAMPLE_RESUME_TEXT, selectedRole);
  };

  const handleRoleSelect = async (role) => {
    setSelectedRole(role);
    if (resumeText) {
      await handleAnalyze(resumeFile || { name: "Resume.pdf" }, resumeText, role);
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

  // Circle SVG Gauge calculations
  const score = analysis ? analysis.scoreValue : 0;
  const radius = 44;
  const stroke = 6;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const scoreColor = score >= 80 ? "text-emerald-400" : score >= 65 ? "text-amber-400" : "text-rose-400";
  const scoreStroke = score >= 80 ? "#34d399" : score >= 65 ? "#fbbf24" : "#f87171";

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-5.5rem)] flex flex-col overflow-hidden text-white max-w-7xl mx-auto space-y-4">
        
        {/* COMPACT TOP HEADER CARD (FIXED HEIGHT) */}
        <div className="shrink-0 rounded-2xl border border-white/10 bg-gradient-to-r from-slate-900/90 via-slate-950/80 to-slate-900/90 p-4 sm:p-5 backdrop-blur-xl shadow-xl space-y-3">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-500/10 text-cyan-300 shadow-md">
                <Sparkles size={20} className="text-cyan-400" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-white leading-none">
                  ATS Resume Optimizer
                </h1>
                <p className="mt-1 text-[11px] text-slate-400 truncate max-w-xl">
                  Benchmark your resume compatibility, discover missing keywords, and get instant priority fixes.
                </p>
              </div>
            </div>

            {/* Credit Counter Pill */}
            <div className={`shrink-0 inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-bold ${
              resumeCredits > 0
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                : "border-rose-500/30 bg-rose-500/10 text-rose-300"
            }`}>
              <Zap size={14} />
              <span>{resumeCredits} Credits</span>
            </div>
          </div>

          {/* TARGET ROLE PILLS */}
          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-white/5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 shrink-0 mr-1 flex items-center gap-1">
              <Target size={12} className="text-cyan-400" /> Target Role:
            </span>
            {roleOptions.map((role) => {
              const isSelected = selectedRole === role;
              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => handleRoleSelect(role)}
                  disabled={loading}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20"
                      : "bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] hover:text-white border border-white/5"
                  }`}
                >
                  <Briefcase size={11} />
                  <span>{role}</span>
                </button>
              );
            })}
          </div>

        </div>

        {/* ERROR NOTIFICATION BANNER */}
        {error && (
          <div className="shrink-0 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs font-medium text-rose-300 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertTriangle size={16} className="text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => setError("")}
              className="text-rose-400 hover:text-white text-xs underline cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* MAIN NON-SCROLLABLE CONTAINER */}
        <div className="flex-1 min-h-0 flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-4 backdrop-blur-xl">

          {/* STATE 1: UNANALYZED UPLOADER VIEW */}
          {!analysis && !loading && (
            <div className="flex-1 min-h-0 flex flex-col items-center justify-center space-y-5 p-6">
              <div
                {...getRootProps()}
                className={`w-full max-w-2xl overflow-hidden rounded-3xl border-2 border-dashed p-8 text-center transition-all duration-300 cursor-pointer ${
                  isDragActive
                    ? "border-cyan-400 bg-cyan-500/[0.08]"
                    : "border-white/15 bg-white/[0.02] hover:border-cyan-400/40 hover:bg-white/[0.04]"
                }`}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-500/10 text-cyan-400 shadow-xl shadow-cyan-500/10">
                    <Upload className={isDragActive ? "animate-bounce" : ""} size={24} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">
                      {isDragActive ? "Drop your resume file here!" : "Upload Your Resume for AI Analysis"}
                    </h3>
                    <p className="mt-1 text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                      Drag & drop your file or browse. Supports PDF (.pdf), Word (.docx), Plain Text (.txt), or Markdown (.md).
                    </p>
                  </div>

                  <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={open}
                      className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 px-4 py-2 text-xs font-bold text-slate-950 transition-all shadow-lg shadow-cyan-500/20 active:scale-95 cursor-pointer"
                    >
                      <FileText size={14} />
                      <span>Browse Resume File</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleSampleResume}
                      className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] hover:bg-white/[0.12] px-4 py-2 text-xs font-semibold text-white transition-all active:scale-95 cursor-pointer"
                    >
                      <Sparkles size={13} className="text-amber-400" />
                      <span>Try Sample Resume</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-6 text-[11px] text-slate-400 pt-2">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-emerald-400" />
                  <span>100% Private & Safe</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Zap size={14} className="text-cyan-400" />
                  <span>Real-time ATS Syntax Scanner</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Award size={14} className="text-purple-400" />
                  <span>Role Keyword Density</span>
                </div>
              </div>
            </div>
          )}

          {/* STATE 2: SCANNING & LOADING */}
          {loading && (
            <div className="flex-1 min-h-0 flex flex-col items-center justify-center space-y-4 p-8 text-center">
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-500/10 text-cyan-400">
                <RefreshCw size={28} className="animate-spin text-cyan-400" />
                <div className="absolute inset-0 rounded-2xl border border-cyan-400/40 animate-ping" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Evaluating Resume for {selectedRole}...</h3>
                <p className="mt-1 text-xs text-slate-400 max-w-xs mx-auto">
                  Extracting skills, matching role keywords, and generating priority fix roadmap.
                </p>
              </div>
              <div className="w-full max-w-xs bg-white/10 rounded-full h-1.5 overflow-hidden">
                <div className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 h-full w-2/3 animate-pulse rounded-full" />
              </div>
            </div>
          )}

          {/* STATE 3: ANALYZED RESULTS DASHBOARD (NON-SCROLLABLE PAGE, INTERNAL SCROLL ONLY) */}
          {analysis && !loading && (
            <div className="flex-1 min-h-0 flex flex-col space-y-4">
              
              {/* FIXED METRICS RIBBON */}
              <div className="shrink-0 grid grid-cols-2 lg:grid-cols-4 gap-3">
                
                {/* Metric 1: ATS Score Gauge */}
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">ATS Score</span>
                    <div className={`text-xl font-black ${scoreColor}`}>
                      {analysis.scoreValue}/100
                    </div>
                    <span className="text-[10px] text-slate-300 font-medium">
                      {analysis.ranking} Candidate
                    </span>
                  </div>

                  <div className="relative flex items-center justify-center">
                    <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
                      <circle
                        stroke="rgba(255,255,255,0.06)"
                        fill="transparent"
                        strokeWidth={stroke}
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                      />
                      <circle
                        stroke={scoreStroke}
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
                    <span className="absolute text-xs font-extrabold text-white">{analysis.scoreValue}%</span>
                  </div>
                </div>

                {/* Metric 2: Keyword Match */}
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Role Match</span>
                    <Target size={14} className="text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-xl font-black text-white">{analysis.stats.keywordMatch}</div>
                    <p className="text-[10px] text-slate-400 truncate">
                      {analysis.matchedKeywords.length}/{analysis.matchedKeywords.length + analysis.missingKeywords.length} keywords found
                    </p>
                  </div>
                </div>

                {/* Metric 3: Skills Discovered */}
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Tech Skills</span>
                    <Layers size={14} className="text-cyan-400" />
                  </div>
                  <div>
                    <div className="text-xl font-black text-white">{analysis.stats.skillsFound} Extracted</div>
                    <p className="text-[10px] text-slate-400 truncate">Verified technologies</p>
                  </div>
                </div>

                {/* Metric 4: Projects Count */}
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Projects</span>
                    <BookOpen size={14} className="text-purple-400" />
                  </div>
                  <div>
                    <div className="text-xl font-black text-white">{analysis.stats.projects} Found</div>
                    <p className="text-[10px] text-slate-400 truncate">Project sections</p>
                  </div>
                </div>

              </div>

              {/* FIXED TABS NAVIGATION BAR */}
              <div className="shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
                <div className="flex flex-wrap items-center gap-1.5">
                  {[
                    { id: "roadmap", label: "Priority Fix Roadmap", icon: ListChecks, count: analysis.roadmapSteps.length },
                    { id: "keywords", label: "Keyword Intelligence", icon: Target, count: analysis.missingKeywords.length },
                    { id: "breakdown", label: "Competency Breakdown", icon: BarChart3 },
                    { id: "profile", label: "Candidate Summary", icon: UserCheck },
                  ].map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                          isActive
                            ? "bg-white/10 text-white border border-white/20 shadow"
                            : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-200"
                        }`}
                      >
                        <Icon size={13} className={isActive ? "text-cyan-400" : "text-slate-400"} />
                        <span>{tab.label}</span>
                        {tab.count !== undefined && (
                          <span className={`px-1.5 py-0.2 rounded-full text-[9px] ${
                            isActive ? "bg-cyan-500/20 text-cyan-300" : "bg-white/10 text-slate-400"
                          }`}>
                            {tab.count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setResumeFile(null);
                    setResumeText("");
                    setAnalysis(null);
                    setError("");
                  }}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white transition cursor-pointer"
                >
                  <RefreshCw size={12} />
                  <span>New Resume</span>
                </button>
              </div>

              {/* INTERNAL SCROLLABLE TAB CONTENT CONTAINER */}
              <div className="flex-1 min-h-0 overflow-y-auto pr-1 text-slate-100 space-y-3 custom-scrollbar">
                
                {/* TAB 1: PRIORITY ROADMAP */}
                {activeTab === "roadmap" && (
                  <div className="space-y-3">
                    {analysis.roadmapSteps.map((step, index) => (
                      <div
                        key={index}
                        className="rounded-xl border border-white/10 bg-white/[0.025] p-4 hover:bg-white/[0.045] transition-all flex items-start gap-3.5"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-400">
                          <AlertTriangle size={16} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-xs sm:text-sm font-bold text-white">{step.title}</h4>
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                              step.status === "High Impact"
                                ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                                : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                            }`}>
                              {step.status}
                            </span>
                          </div>
                          <p className="mt-1 text-xs leading-relaxed text-slate-300">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* TAB 2: KEYWORD INTELLIGENCE */}
                {activeTab === "keywords" && (
                  <div className="grid md:grid-cols-2 gap-4">
                    
                    {/* Matched Keywords */}
                    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.03] p-4 space-y-3">
                      <div className="flex items-center gap-2 border-b border-emerald-500/10 pb-2">
                        <CheckCircle2 size={16} className="text-emerald-400" />
                        <h4 className="text-xs font-bold text-white">Matched Keywords ({analysis.matchedKeywords.length})</h4>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {analysis.matchedKeywords.length > 0 ? (
                          analysis.matchedKeywords.map((kw) => (
                            <span
                              key={kw}
                              className="inline-flex items-center gap-1 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-200"
                            >
                              <Check size={11} className="text-emerald-400" />
                              <span>{kw}</span>
                            </span>
                          ))
                        ) : (
                          <p className="text-xs text-slate-400 italic">No role keywords matched yet.</p>
                        )}
                      </div>
                    </div>

                    {/* Missing Keywords */}
                    <div className="rounded-xl border border-rose-500/20 bg-rose-500/[0.03] p-4 space-y-3">
                      <div className="flex items-center gap-2 border-b border-rose-500/10 pb-2">
                        <XCircle size={16} className="text-rose-400" />
                        <h4 className="text-xs font-bold text-white">Missing Role Keywords ({analysis.missingKeywords.length})</h4>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {analysis.missingKeywords.length > 0 ? (
                          analysis.missingKeywords.map((kw) => (
                            <span
                              key={kw}
                              className="inline-flex items-center gap-1 rounded-md border border-rose-500/30 bg-rose-500/10 px-2.5 py-1 text-xs font-semibold text-rose-200"
                            >
                              <span>+ {kw}</span>
                            </span>
                          ))
                        ) : (
                          <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                            <CheckCircle2 size={13} />
                            <span>100% Keyword match achieved!</span>
                          </p>
                        )}
                      </div>
                    </div>

                  </div>
                )}

                {/* TAB 3: COMPETENCY BREAKDOWN */}
                {activeTab === "breakdown" && (
                  <div className="rounded-xl border border-white/10 bg-white/[0.025] p-4 space-y-4">
                    <h4 className="text-xs font-bold text-white">Dimension Competency Scores</h4>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {analysis.radarData.map((item) => (
                        <div key={item.subject} className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs font-semibold">
                            <span className="text-slate-300">{item.subject}</span>
                            <span className="text-cyan-400 font-bold">{item.score}%</span>
                          </div>
                          <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full rounded-full transition-all duration-700"
                              style={{ width: `${item.score}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 4: CANDIDATE SUMMARY */}
                {activeTab === "profile" && (
                  <div className="rounded-xl border border-white/10 bg-white/[0.025] p-4 space-y-3">
                    <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 font-bold text-base">
                        {analysis.summary.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-white">{analysis.summary.name}</h4>
                        <p className="text-[11px] text-slate-400">{analysis.summary.email}</p>
                      </div>
                    </div>

                    <div>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-1">AI Notes</span>
                      <p className="text-xs text-slate-300 leading-relaxed">{analysis.summary.description}</p>
                    </div>

                    <div>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">Detected Tech Skills</span>
                      <div className="flex flex-wrap gap-1.5">
                        {analysis.skillsFound.map((skill) => (
                          <span
                            key={skill}
                            className="rounded bg-white/[0.06] border border-white/10 px-2 py-0.5 text-[11px] font-medium text-slate-300"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

              </div>

            </div>
          )}

        </div>

      </div>
    </DashboardLayout>
  );
};

export default ResumeAnalyzer;