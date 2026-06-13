import { motion } from "framer-motion";
import {
  AlertTriangle,
  BadgeCheck,
  Plus,
  Sparkles,
  Target,
} from "lucide-react";

const defaultMissingKeywords = [
  "Docker",
  "AWS",
  "CI/CD",
  "TypeScript",
  "Redis",
  "Kubernetes",
];

const MissingKeywords = ({
  missingKeywords = defaultMissingKeywords,
  selectedRole = "Target role",
  matchedKeywords = [],
  totalKeywords = 0,
}) => {
  const keywords = missingKeywords.length ? missingKeywords : [];
  const coverageText = totalKeywords
    ? `${matchedKeywords.length}/${totalKeywords} keywords already covered`
    : "Coverage appears once analysis is ready";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-[32px] border border-white/10 bg-slate-950/70 p-6 backdrop-blur-xl"
    >
      <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(244,63,94,0.12),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.1),transparent_34%)]" />

      <div className="relative space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">
              Keyword Gaps
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              The role-specific terms still missing from your draft
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
              ATS systems often scan for proof of relevance before they care about nuance. These are the terms you should consider weaving into skills, project bullets, and experience highlights.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-4 py-2 text-sm font-medium text-violet-100">
            <Sparkles size={15} />
            AI suggestions
          </div>
        </div>

        {keywords.length ? (
          <>
            <div className="rounded-[28px] border border-rose-400/18 bg-rose-500/10 p-5">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-rose-400/18 bg-rose-500/10">
                  <AlertTriangle className="text-rose-100" size={18} />
                </div>

                <div>
                  <p className="text-[11px] uppercase tracking-[0.26em] text-rose-100/70">
                    Focus Area
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-white">
                    {keywords.length} missing terms for {selectedRole}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-rose-50/80">
                    Start with the terms below and add them only where they are true and supported by your actual experience.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {keywords.map((keyword, index) => (
                <motion.div
                  key={keyword}
                  whileHover={{ y: -2 }}
                  className="group relative flex items-center gap-3 rounded-[22px] border border-rose-400/18 bg-black/20 px-4 py-3"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-rose-400/18 bg-rose-500/10">
                    <Plus size={16} className="text-rose-100" />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-white">{keyword}</p>
                    <p className="text-xs text-slate-500">Priority #{index + 1}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        ) : (
          <div className="rounded-[30px] border border-emerald-400/18 bg-emerald-500/10 p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-3xl border border-emerald-400/18 bg-emerald-500/10">
                <BadgeCheck className="text-emerald-100" size={22} />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.26em] text-emerald-100/70">
                  Strong coverage
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-white">
                  No urgent keyword gaps found
                </h3>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-emerald-50/80">
                  Your resume is already hitting the key role terms we expected. The next improvements should focus on stronger proof, clearer outcomes, and sharper storytelling.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-[26px] border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
                <Target className="text-cyan-100" size={18} />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.26em] text-slate-500">
                  Coverage
                </p>
                <p className="mt-2 text-sm text-slate-300">{coverageText}</p>
              </div>
            </div>
          </div>

          <div className="rounded-[26px] border border-white/10 bg-white/[0.03] p-5">
            <p className="text-[11px] uppercase tracking-[0.26em] text-slate-500">
              Best Places To Add Them
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Summary paragraph, skills matrix, project tech stack, and measurable bullet points are usually the safest places to add these terms naturally.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MissingKeywords;
