import { motion } from "framer-motion";
import {
  BadgeCheck,
  Brain,
  ScanSearch,
  Sparkles,
  Upload,
} from "lucide-react";

const defaultActivities = [
  {
    title: "Resume Uploaded",
    description: "Your resume was uploaded successfully.",
    time: "2 min ago",
    type: "upload",
  },
  {
    title: "ATS Analysis Completed",
    description: "AI generated ATS optimization insights.",
    time: "1 min ago",
    type: "analysis",
  },
  {
    title: "Skills Extracted",
    description: "24 technical skills identified.",
    time: "Just now",
    type: "skills",
  },
  {
    title: "Optimization Score Updated",
    description: "ATS score improved to 82/100.",
    time: "Live",
    type: "score",
  },
];

const activityIcons = {
  upload: Upload,
  analysis: ScanSearch,
  skills: Brain,
  score: BadgeCheck,
};

const activityStyles = {
  upload: {
    chip: "border-cyan-400/18 bg-cyan-500/10 text-cyan-100",
    icon: "border-cyan-400/18 bg-cyan-500/10 text-cyan-100",
  },
  analysis: {
    chip: "border-violet-400/18 bg-violet-500/10 text-violet-100",
    icon: "border-violet-400/18 bg-violet-500/10 text-violet-100",
  },
  skills: {
    chip: "border-amber-400/18 bg-amber-500/10 text-amber-100",
    icon: "border-amber-400/18 bg-amber-500/10 text-amber-100",
  },
  score: {
    chip: "border-emerald-400/18 bg-emerald-500/10 text-emerald-100",
    icon: "border-emerald-400/18 bg-emerald-500/10 text-emerald-100",
  },
};

const ResumeActivityTimeline = ({ activities = defaultActivities }) => {
  const latestActivity = activities[activities.length - 1] || defaultActivities[defaultActivities.length - 1];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-[30px] border border-white/10 bg-slate-950/70 p-6 backdrop-blur-xl"
    >
      <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.14),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(34,197,94,0.12),transparent_34%)]" />

      <div className="relative space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">
              Activity Feed
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              Follow the analysis as it happens
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
              A simple event trail makes it easier to understand what the analyzer has already processed and what it updated most recently.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-100">
            <Sparkles size={15} />
            Live updates
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.26em] text-slate-500">
                Latest Update
              </p>
              <h3 className="mt-2 text-xl font-semibold text-white">{latestActivity.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">{latestActivity.description}</p>
            </div>
            <div className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm text-slate-300">
              {latestActivity.time}
            </div>
          </div>
        </div>

        <div className="relative pl-3">
          <div className="absolute bottom-0 left-[27px] top-3 w-px bg-gradient-to-b from-cyan-400/50 via-white/12 to-transparent" />

          <div className="space-y-4">
            {activities.map((item, index) => {
              const Icon = activityIcons[item.type] || Upload;
              const style = activityStyles[item.type] || activityStyles.upload;

              return (
                <motion.div
                  key={`${item.title}-${index}`}
                  initial={{ opacity: 0, x: -14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className="relative flex gap-4"
                >
                  <div
                    className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-2xl border ${style.icon}`}
                  >
                    <Icon size={18} />
                  </div>

                  <div className="flex-1 rounded-[24px] border border-white/10 bg-black/20 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="text-base font-semibold text-white">{item.title}</h3>
                          <span className={`rounded-full border px-3 py-1 text-[11px] font-medium ${style.chip}`}>
                            Step {index + 1}
                          </span>
                        </div>
                        <p className="mt-2 text-sm leading-6 text-slate-400">{item.description}</p>
                      </div>

                      <span className="text-xs uppercase tracking-[0.22em] text-slate-500">
                        {item.time}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ResumeActivityTimeline;
