import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Rocket, Sparkles } from "lucide-react";

const defaultRoadmapSteps = [
  {
    title: "Add Cloud Technologies",
    description:
      "Include AWS, Docker, and CI/CD skills to improve ATS matching for modern full stack roles.",
    status: "High Impact",
  },
  {
    title: "Improve Project Descriptions",
    description:
      "Add measurable achievements, performance improvements, and real-world impact metrics.",
    status: "Recommended",
  },
  {
    title: "Optimize Resume Keywords",
    description:
      "Use role-specific keywords naturally inside projects, skills, and experience sections.",
    status: "Important",
  },
  {
    title: "Add Deployment Experience",
    description:
      "Mention platforms like Vercel, Render, Netlify, and cloud deployment workflows.",
    status: "Boost ATS",
  },
];

const statusStyles = {
  "High Impact": "border-rose-400/18 bg-rose-500/10 text-rose-100",
  Recommended: "border-cyan-400/18 bg-cyan-500/10 text-cyan-100",
  Important: "border-amber-400/18 bg-amber-500/10 text-amber-100",
  "Boost ATS": "border-emerald-400/18 bg-emerald-500/10 text-emerald-100",
};

const ResumeImprovementRoadmap = ({ steps = defaultRoadmapSteps }) => {
  const roadmapSteps = steps.length ? steps : defaultRoadmapSteps;
  const [primaryStep, ...secondarySteps] = roadmapSteps;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-[32px] border border-white/10 bg-slate-950/70 p-6 backdrop-blur-xl"
    >
      <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.14),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(245,158,11,0.1),transparent_32%)]" />

      <div className="relative space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">
              Improvement Plan
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              A cleaner path from good draft to stronger resume
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
              We rank the fixes by likely impact so you can spend time on the edits that should improve ATS performance first, instead of guessing where to start.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-100">
            <Sparkles size={15} />
            AI coach
          </div>
        </div>

        {primaryStep && (
          <div className="rounded-[30px] border border-cyan-400/18 bg-cyan-500/10 p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="inline-flex rounded-full border border-white/12 bg-white/[0.06] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.24em] text-white">
                  Highest leverage change
                </div>
                <h3 className="mt-4 text-2xl font-semibold text-white">{primaryStep.title}</h3>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-cyan-50/80">
                  {primaryStep.description}
                </p>
              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-3xl border border-cyan-300/20 bg-cyan-400/10">
                <Rocket className="text-cyan-100" size={22} />
              </div>
            </div>

            <div className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-cyan-100">
              Recommended as your first edit pass
              <ArrowRight size={16} />
            </div>
          </div>
        )}

        <div className="grid gap-4">
          {secondarySteps.map((step, index) => (
            <motion.div
              key={`${step.title}-${index}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.08 }}
              className="rounded-[26px] border border-white/10 bg-white/[0.03] p-5"
            >
              <div className="flex flex-wrap items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-black/20">
                  <CheckCircle2 className="text-white" size={18} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-lg font-semibold text-white">{step.title}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-400">{step.description}</p>
                    </div>

                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-medium ${
                        statusStyles[step.status] || "border-white/10 bg-white/[0.04] text-slate-200"
                      }`}
                    >
                      {step.status}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ResumeImprovementRoadmap;
