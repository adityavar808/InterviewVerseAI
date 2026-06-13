import { motion } from "framer-motion";
import {
  BadgeCheck,
  BriefcaseBusiness,
  ChevronRight,
  Sparkles,
  Target,
} from "lucide-react";

const roles = [
  "MERN Developer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Machine Learning Engineer",
  "Data Analyst",
  "DevOps Engineer",
];

const TargetRoleSelector = ({
  selectedRole,
  onSelect,
  suggestedRoles = [],
  keywordCoverage,
  matchedKeywords = [],
  missingKeywords = [],
  loading = false,
}) => {
  const coverage = keywordCoverage?.percent ?? 0;
  const matchedCount = keywordCoverage?.matched ?? matchedKeywords.length;
  const totalCount = keywordCoverage?.total ?? 0;
  const highlightKeywords = matchedKeywords.slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-[30px] border border-white/10 bg-slate-950/70 p-6 backdrop-blur-xl"
    >
      <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.14),transparent_38%),radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.12),transparent_32%)]" />

      <div className="relative space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">
              Targeting
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              Tune the analyzer to the role you want
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
              Role selection changes the keyword benchmark, coverage score, and the improvement priorities we recommend next.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-4 py-2 text-sm font-medium text-violet-100">
            <Sparkles size={15} />
            Smart matching
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {roles.map((role) => {
            const isSelected = role === selectedRole;
            const isSuggested = suggestedRoles.includes(role);

            return (
              <button
                key={role}
                type="button"
                onClick={() => onSelect(role)}
                className={`group rounded-[24px] border p-4 text-left transition ${
                  isSelected
                    ? "border-cyan-300/40 bg-cyan-500/12 shadow-[0_18px_50px_-35px_rgba(34,211,238,0.7)]"
                    : "border-white/10 bg-white/[0.03] hover:border-cyan-400/25 hover:bg-white/[0.05]"
                }`}
                aria-pressed={isSelected}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${
                        isSelected
                          ? "border-cyan-300/30 bg-cyan-500/10"
                          : "border-white/10 bg-white/[0.04]"
                      }`}
                    >
                      <BriefcaseBusiness
                        size={18}
                        className={isSelected ? "text-cyan-100" : "text-slate-300"}
                      />
                    </div>

                    <div>
                      <p className="text-base font-medium text-white">{role}</p>
                      <p className="mt-1 text-sm text-slate-400">
                        {isSuggested ? "Recommended based on common software roles." : "Benchmark against this role's ATS keywords."}
                      </p>
                    </div>
                  </div>

                  {isSelected ? (
                    <BadgeCheck className="text-cyan-100" size={18} />
                  ) : (
                    <ChevronRight className="text-slate-500 transition group-hover:text-cyan-200" size={18} />
                  )}
                </div>

                {isSuggested && (
                  <div className="mt-4 inline-flex rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-slate-300">
                    Suggested
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_280px]">
          <div className="rounded-[26px] border border-white/10 bg-black/20 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-500/10">
                <Target className="text-cyan-100" size={18} />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.26em] text-slate-500">
                  Role Coverage
                </p>
                <p className="mt-1 text-sm text-slate-300">
                  {loading
                    ? "Refreshing keyword coverage..."
                    : `Currently matching ${matchedCount}/${totalCount || "—"} target keywords for ${selectedRole}.`}
                </p>
              </div>
            </div>

            <div className="mt-5">
              <div className="h-2 rounded-full bg-white/8">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-300 to-emerald-300 transition-all duration-700"
                  style={{ width: `${Math.min(coverage, 100)}%` }}
                />
              </div>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-slate-400">Coverage score</span>
                <span className="font-semibold text-white">{coverage}%</span>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {highlightKeywords.length ? (
                highlightKeywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="rounded-full border border-emerald-400/18 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-100"
                  >
                    {keyword}
                  </span>
                ))
              ) : (
                <p className="text-sm text-slate-400">
                  Upload a resume to see which keywords are already working in your favor.
                </p>
              )}
            </div>
          </div>

          <div className="rounded-[26px] border border-white/10 bg-white/[0.03] p-5">
            <p className="text-[11px] uppercase tracking-[0.26em] text-slate-500">
              Watch Outs
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              {missingKeywords.length
                ? `The current draft is still missing ${missingKeywords.length} role markers. Fixing the top few terms can quickly improve ATS relevance.`
                : "Your resume is covering the expected role terms well. Focus next on stronger project outcomes and clearer impact statements."}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TargetRoleSelector;
