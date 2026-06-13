import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";

import { motion } from "framer-motion";
import { Activity, ArrowUpRight, ShieldCheck, Sparkles, TrendingDown, TrendingUp } from "lucide-react";

const defaultData = [
  { subject: "Technical", score: 55 },
  { subject: "Projects", score: 55 },
  { subject: "ATS", score: 55 },
  { subject: "Communication", score: 55 },
  { subject: "Skills", score: 55 },
  { subject: "Experience", score: 55 },
];

const ATSRadarChart = ({
  radarData = defaultData,
  bestArea = "Skills",
  weakArea = "Experience",
  improvement = "+0%",
  ranking = "Top 40%",
}) => {
  const chartData = radarData.length ? radarData : defaultData;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-[32px] border border-white/10 bg-slate-950/70 p-6 backdrop-blur-xl"
    >
      <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.14),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(99,102,241,0.12),transparent_34%)]" />

      <div className="relative space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">
              Signal Map
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              Where the resume is strong and where it breaks down
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
              The radar view translates your resume into scoring buckets that ATS systems and recruiters usually care about most: relevance, depth, and evidence.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-4 py-2 text-sm font-medium text-violet-100">
            <Sparkles size={15} />
            Smart analysis
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px] xl:items-center">
          <div className="rounded-[30px] border border-white/10 bg-black/20 p-4">
            <div className="h-[360px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={chartData}>
                  <PolarGrid stroke="rgba(148,163,184,0.18)" />
                  <PolarRadiusAxis axisLine={false} tick={false} domain={[0, 100]} />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{
                      fill: "#CBD5E1",
                      fontSize: 12,
                    }}
                  />
                  <Radar
                    name="ATS"
                    dataKey="score"
                    stroke="#67E8F9"
                    fill="#22D3EE"
                    fillOpacity={0.28}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-[26px] border border-cyan-400/18 bg-cyan-500/10 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.26em] text-cyan-100/70">
                    Strongest Signal
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-white">{bestArea}</h3>
                  <p className="mt-2 text-sm leading-6 text-cyan-50/80">
                    This is the area where your resume currently feels most persuasive to automated screening.
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-400/10">
                  <TrendingUp className="text-cyan-100" size={18} />
                </div>
              </div>
            </div>

            <div className="rounded-[26px] border border-amber-400/18 bg-amber-500/10 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.26em] text-amber-100/70">
                    Biggest Risk
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-white">{weakArea}</h3>
                  <p className="mt-2 text-sm leading-6 text-amber-50/80">
                    Improving this section is usually the fastest way to lift both the ATS score and recruiter confidence.
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-300/20 bg-amber-400/10">
                  <TrendingDown className="text-amber-100" size={18} />
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
                    <ArrowUpRight className="text-emerald-100" size={16} />
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">
                      Improvement Potential
                    </p>
                    <p className="mt-2 text-lg font-semibold text-white">{improvement}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
                    <ShieldCheck className="text-cyan-100" size={16} />
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">
                      Percentile
                    </p>
                    <p className="mt-2 text-lg font-semibold text-white">{ranking}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
              <Activity className="text-cyan-100" size={18} />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.26em] text-slate-500">
                Score Breakdown
              </p>
              <p className="mt-1 text-sm text-slate-300">
                Quick comparison across every scoring dimension.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {chartData.map((item) => (
              <div key={item.subject} className="rounded-[22px] border border-white/8 bg-black/20 p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-white">{item.subject}</span>
                  <span className="text-sm font-semibold text-cyan-100">{item.score}</span>
                </div>
                <div className="mt-3 h-2 rounded-full bg-white/8">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-sky-300 transition-all duration-700"
                    style={{ width: `${item.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ATSRadarChart;
