import { motion } from "framer-motion";
import {
  Download,
  FileSpreadsheet,
  RefreshCcw,
  Share2,
  Sparkles,
  Wand2,
} from "lucide-react";

const actions = [
  {
    key: "reanalyze",
    title: "Run fresh analysis",
    description: "Re-check the current resume against the selected role after edits.",
    icon: RefreshCcw,
    color: "text-cyan-100",
    surface: "from-cyan-500/14 via-cyan-400/6 to-transparent",
    border: "border-cyan-400/18",
  },
  {
    key: "download-report",
    title: "Download report",
    description: "Export the ATS findings and recommendations as structured JSON.",
    icon: Download,
    color: "text-emerald-100",
    surface: "from-emerald-500/14 via-emerald-400/6 to-transparent",
    border: "border-emerald-400/18",
  },
  {
    key: "share-resume",
    title: "Copy share link",
    description: "Create a quick handoff link you can send to a reviewer or teammate.",
    icon: Share2,
    color: "text-violet-100",
    surface: "from-violet-500/14 via-violet-400/6 to-transparent",
    border: "border-violet-400/18",
  },
  {
    key: "export-pdf",
    title: "Export parsed text",
    description: "Download the extracted resume text so you can inspect the parser output.",
    icon: FileSpreadsheet,
    color: "text-amber-100",
    surface: "from-amber-500/14 via-amber-400/6 to-transparent",
    border: "border-amber-400/18",
  },
];

const ResumeActionCenter = ({
  onAction,
  hasAnalysis = false,
  hasResume = false,
  loading = false,
}) => {
  const isActionDisabled = (key) => {
    if (loading && key === "reanalyze") {
      return true;
    }

    if (key === "download-report") {
      return !hasAnalysis;
    }

    if (key === "export-pdf") {
      return !hasResume;
    }

    if (key === "share-resume") {
      return !hasAnalysis;
    }

    return !hasResume;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-[30px] border border-white/10 bg-slate-950/70 p-6 backdrop-blur-xl"
    >
      <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.14),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(139,92,246,0.12),transparent_32%)]" />

      <div className="relative space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">
              Action Center
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              Ship the next step without leaving this page
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
              Once the analysis is ready, the most useful follow-up actions are right here: re-run the scan, share it, or export the results.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-4 py-2 text-sm font-medium text-violet-100">
            <Sparkles size={15} />
            Productivity tools
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {actions.map((item, index) => {
            const Icon = item.icon;
            const disabled = isActionDisabled(item.key);

            return (
              <motion.button
                key={item.key}
                type="button"
                onClick={() => !disabled && onAction?.(item.key)}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
                className={`relative overflow-hidden rounded-[28px] border p-5 text-left transition ${
                  disabled
                    ? "cursor-not-allowed border-white/8 bg-white/[0.025] opacity-55"
                    : `${item.border} bg-white/[0.03] hover:-translate-y-0.5 hover:border-white/20`
                }`}
                aria-disabled={disabled}
              >
                {!disabled && <div className={`absolute inset-0 bg-gradient-to-br ${item.surface}`} />}

                <div className="relative flex h-full flex-col">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-black/20">
                      <Icon className={disabled ? "text-slate-500" : item.color} size={18} />
                    </div>

                    <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.24em] text-slate-400">
                      {disabled ? "Locked" : "Ready"}
                    </span>
                  </div>

                  <div className="mt-5">
                    <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{item.description}</p>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        <div className="rounded-[26px] border border-white/10 bg-white/[0.03] p-5">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-500/10">
              <Wand2 className="text-cyan-100" size={18} />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.26em] text-slate-500">
                Usage Note
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Actions unlock as soon as a resume is uploaded, and report-sharing options become available after the analyzer finishes its first pass.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ResumeActionCenter;
