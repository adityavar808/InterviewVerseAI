import { useMemo, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import {
  BadgeCheck,
  Eye,
  EyeOff,
  FileText,
  Mail,
  ScanSearch,
  Sparkles,
  Target,
  User2,
} from "lucide-react";

import ResumeActionCenter from "../../components/resume/ResumeActionCenter";
import ResumeActivityTimeline from "../../components/resume/ResumeActivityTimeline";
import ResumeImprovementRoadmap from "../../components/resume/ResumeImprovementRoadmap";
import ResumePreviewCard from "../../components/resume/ResumePreviewCard";
import ResumeStats from "../../components/resume/ResumeStats";
import MissingKeywords from "../../components/resume/MissingKeywords";
import ATSRadarChart from "../../components/resume/ATSRadarChart";
import TargetRoleSelector from "../../components/resume/TargetRoleSelector";
import DashboardLayout from "../../layouts/DashboardLayout";
import { buildAnalysis, extractTextFromFile, ROLE_KEYWORDS } from "../../utils/resumeAnalyzerUtils";

const roleOptions = Object.keys(ROLE_KEYWORDS);
const defaultRole = roleOptions[0] || "Frontend Developer";

const emptyStats = {
  atsScore: "0/100",
  skillsFound: 0,
  keywordMatch: "0%",
  projects: 0,
};

const getStateTone = ({ error, loading, analysis }) => {
  if (error) {
    return "border-rose-400/20 bg-rose-500/10 text-rose-100";
  }

  if (loading) {
    return "border-cyan-400/20 bg-cyan-500/10 text-cyan-100";
  }

  if (analysis) {
    return "border-emerald-400/20 bg-emerald-500/10 text-emerald-100";
  }

  return "border-white/10 bg-white/[0.04] text-slate-200";
};

const ResumeAnalyzer = () => {
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [selectedRole, setSelectedRole] = useState(defaultRole);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("Upload your resume to start analysis.");
  const [previewVisible, setPreviewVisible] = useState(false);
  const [error, setError] = useState("");

  const resumeMeta = useMemo(() => {
    if (!resumeFile) {
      return {
        fileName: "No file uploaded",
        description: "Upload a plain text or markdown resume to analyze.",
        uploadDate: "—",
        size: "—",
      };
    }

    return {
      fileName: resumeFile.name,
      description: `${resumeFile.name.replace(/\.[^.]+$/, "")} resume`,
      uploadDate: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      size: `${Math.round(resumeFile.size / 1024)} KB`,
    };
  }, [resumeFile]);

  const keywordCoverage = useMemo(() => {
    if (analysis?.keywordCoverage) {
      return analysis.keywordCoverage;
    }

    const total = ROLE_KEYWORDS[selectedRole]?.length || 0;
    return {
      matched: 0,
      total,
      percent: 0,
    };
  }, [analysis, selectedRole]);

  const stateTone = getStateTone({ error, loading, analysis });

  const heroHighlights = analysis
    ? [
        {
          label: "ATS Standing",
          value: analysis.ranking,
          note: "Percentile estimate from the current scan.",
        },
        {
          label: "Keyword Coverage",
          value: `${keywordCoverage.percent}%`,
          note: `${keywordCoverage.matched}/${keywordCoverage.total} role terms are already present.`,
        },
        {
          label: "Best Signal",
          value: analysis.bestArea,
          note: `${analysis.weakArea} is the main improvement opportunity.`,
        },
      ]
    : [
        {
          label: "Step 1",
          value: "Upload resume",
          note: "Use plain text, markdown, or JSON for the current parser.",
        },
        {
          label: "Step 2",
          value: "Choose role",
          note: "Benchmark against the role you actually want next.",
        },
        {
          label: "Step 3",
          value: "Refine faster",
          note: "Prioritize the changes with the biggest ATS payoff.",
        },
      ];

  const matchedKeywordPreview = analysis?.matchedKeywords?.slice(0, 4) || [];
  const candidateSummary = analysis?.summary || {
    name: "Your profile snapshot appears here",
    email: "We'll extract contact details after upload",
    description: "Once a resume is parsed, this panel becomes your high-level analyzer briefing.",
  };

  const handleAnalyze = async (file, text, role) => {
    if (!text) {
      setAnalysis(null);
      setStatusMessage("Upload a resume file with plain text to analyze.");
      return;
    }

    setLoading(true);
    setError("");
    setStatusMessage(`Analyzing your resume for ${role}...`);

    try {
      const result = buildAnalysis({ resumeText: text, role, file });
      setAnalysis(result);
      setStatusMessage(`Analysis complete for ${role}.`);
    } catch {
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
    setStatusMessage("Parsing resume document...");

    try {
      const text = await extractTextFromFile(file);

      if (!text) {
        setResumeText("");
        setAnalysis(null);
        setStatusMessage("Upload a supported resume format to start.");
        setError("Only plain text, markdown, or JSON resume files are supported right now.");
        return;
      }

      setResumeText(text);
      setPreviewVisible(true);
      await handleAnalyze(file, text, selectedRole);
    } catch {
      setResumeText("");
      setAnalysis(null);
      setStatusMessage("We couldn't parse that file.");
      setError("Something went wrong while reading the resume file. Please try again.");
    }
  };

  const handleRoleSelect = async (role) => {
    setSelectedRole(role);

    if (resumeText) {
      await handleAnalyze(resumeFile, resumeText, role);
    }
  };

  const handleAction = async (key) => {
    if (key === "reanalyze") {
      await handleAnalyze(resumeFile, resumeText, selectedRole);
      return;
    }

    if (key === "download-report") {
      if (!analysis) {
        setError("Run an analysis first before downloading the report.");
        return;
      }

      const report = {
        analysis,
        selectedRole,
        fileName: resumeMeta.fileName,
        generatedAt: new Date().toISOString(),
      };
      const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${resumeMeta.fileName.replace(/\.[^.]+$/, "") || "resume"}-report.json`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      setStatusMessage("Report downloaded.");
      return;
    }

    if (key === "share-resume") {
      const shareUrl = `${window.location.origin}${window.location.pathname}?shared=true`;
      try {
        await navigator.clipboard.writeText(shareUrl);
        setStatusMessage("Share link copied to clipboard.");
      } catch {
        setError("Unable to copy share link in this browser.");
      }
      return;
    }

    if (key === "export-pdf") {
      if (!resumeText) {
        setError("Upload a resume first before exporting.");
        return;
      }

      const blob = new Blob([resumeText], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${resumeMeta.fileName.replace(/\.[^.]+$/, "") || "resume"}.txt`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      setStatusMessage("Resume exported as text file.");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 pb-10 text-white">
        <section className="relative overflow-hidden rounded-[36px] border border-white/10 bg-slate-950/75 p-6 backdrop-blur-xl sm:p-8 lg:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_36%),radial-gradient(circle_at_top_right,rgba(245,158,11,0.12),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.14),transparent_32%)]" />
          <div className="absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

          <div className="relative grid gap-8 xl:grid-cols-[minmax(0,1.25fr)_360px] xl:items-start">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-100">
                <Sparkles size={14} />
                Resume Intelligence Suite
              </div>

              <motion.h1
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 max-w-4xl text-4xl font-semibold leading-tight sm:text-5xl"
              >
                Redesign your resume with a clearer review loop, not just a score.
              </motion.h1>

              <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300">
                Upload a resume, benchmark it against the role you want next, and get a better sense of what is already working, what is missing, and which changes should improve ATS performance fastest.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <span className={`rounded-full border px-4 py-2 text-sm font-medium ${stateTone}`}>
                  {error ? "Attention needed" : loading ? "Analyzing now" : analysis ? "Analysis ready" : "Waiting for resume"}
                </span>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-slate-200">
                  Targeting {selectedRole}
                </span>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-slate-200">
                  {resumeFile ? resumeMeta.fileName : "No file selected"}
                </span>
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {heroHighlights.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5"
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">
                      {item.label}
                    </p>
                    <h3 className="mt-3 text-2xl font-semibold text-white">{item.value}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-400">{item.note}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[32px] border border-white/10 bg-black/20 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-slate-500">
                    Resume Briefing
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold text-white">{candidateSummary.name}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{candidateSummary.description}</p>
                </div>

                <div className={`rounded-full border px-3 py-1 text-xs font-medium ${stateTone}`}>
                  {analysis?.readinessLabel || "Idle"}
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {[
                  {
                    icon: User2,
                    label: "Candidate",
                    value: candidateSummary.name,
                  },
                  {
                    icon: Mail,
                    label: "Email",
                    value: candidateSummary.email,
                  },
                  {
                    icon: Target,
                    label: "Role Fit",
                    value: analysis?.ranking || "Pending analysis",
                  },
                  {
                    icon: ScanSearch,
                    label: "Keyword Match",
                    value: analysis?.stats?.keywordMatch || "0%",
                  },
                ].map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.label}
                      className="flex items-start gap-3 rounded-[22px] border border-white/8 bg-white/[0.03] p-3"
                    >
                      <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05]">
                        <Icon size={16} className="text-slate-200" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">
                          {item.label}
                        </p>
                        <p className="mt-2 break-words text-sm text-white">{item.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-slate-500">
                  Terms already helping you
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {matchedKeywordPreview.length ? (
                    matchedKeywordPreview.map((keyword) => (
                      <span
                        key={keyword}
                        className="rounded-full border border-emerald-400/18 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-100"
                      >
                        {keyword}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-slate-400">
                      Upload a resume to see the strongest matched keywords here.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.12fr)_minmax(340px,0.88fr)]">
          <div className="space-y-6">
            <ResumePreviewCard
              resumeMeta={resumeMeta}
              previewText={resumeText}
              onFileUpload={handleFileUpload}
              onPreview={() => setPreviewVisible((current) => !current)}
              statusMessage={statusMessage}
              error={error}
              loading={loading}
              analysis={analysis}
              selectedRole={selectedRole}
            />

            <ResumeImprovementRoadmap steps={analysis?.roadmapSteps} />
          </div>

          <div className="space-y-6">
            <ResumeStats stats={analysis?.stats || emptyStats} loading={loading} analysis={analysis} />

            <TargetRoleSelector
              selectedRole={selectedRole}
              onSelect={handleRoleSelect}
              suggestedRoles={roleOptions.slice(0, 4)}
              keywordCoverage={keywordCoverage}
              matchedKeywords={analysis?.matchedKeywords}
              missingKeywords={analysis?.missingKeywords}
              loading={loading}
            />

            <ResumeActionCenter
              onAction={handleAction}
              hasAnalysis={Boolean(analysis)}
              hasResume={Boolean(resumeText)}
              loading={loading}
            />
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <ATSRadarChart
            radarData={analysis?.radarData}
            bestArea={analysis?.bestArea}
            weakArea={analysis?.weakArea}
            improvement={analysis?.improvement}
            ranking={analysis?.ranking}
          />

          <MissingKeywords
            missingKeywords={analysis?.missingKeywords}
            selectedRole={selectedRole}
            matchedKeywords={analysis?.matchedKeywords}
            totalKeywords={keywordCoverage.total}
          />
        </section>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)]">
          <ResumeActivityTimeline activities={analysis?.activities} />

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-[30px] border border-white/10 bg-slate-950/70 p-6 backdrop-blur-xl"
          >
            <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.14),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(245,158,11,0.1),transparent_32%)]" />

            <div className="relative space-y-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">
                    Document View
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">
                    Inspect the exact text being analyzed
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
                    This preview is useful for spotting parser issues, accidental formatting noise, or sections that need stronger phrasing.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setPreviewVisible((current) => !current)}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-medium text-white transition hover:bg-white/[0.08]"
                  disabled={!resumeText}
                >
                  {previewVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                  {previewVisible ? "Hide preview" : "Show preview"}
                </button>
              </div>

              <AnimatePresence mode="wait">
                {resumeText && previewVisible ? (
                  <motion.div
                    key="preview-open"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03]"
                  >
                    <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-500/10">
                          <FileText className="text-cyan-100" size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{resumeMeta.fileName}</p>
                          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                            Parsed resume text
                          </p>
                        </div>
                      </div>

                      <div className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-slate-300">
                        {resumeMeta.size}
                      </div>
                    </div>

                    <div className="max-h-[540px] overflow-auto p-5">
                      <pre className="whitespace-pre-wrap break-words text-sm leading-7 text-slate-200">
                        {resumeText}
                      </pre>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="preview-closed"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6"
                  >
                    {resumeText ? (
                      <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-100">
                          <BadgeCheck size={15} />
                          Preview ready
                        </div>
                        <p className="text-sm leading-6 text-slate-300">
                          Your resume text has been parsed successfully. Open the document preview whenever you want to verify the extracted content line by line.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-100">
                          <Sparkles size={15} />
                          Preview comes next
                        </div>
                        <p className="text-sm leading-6 text-slate-300">
                          Upload a resume first. Once the parser extracts the text, you’ll be able to review exactly what the analyzer is using for scoring.
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </section>
      </div>
    </DashboardLayout>
  );
};

export default ResumeAnalyzer;