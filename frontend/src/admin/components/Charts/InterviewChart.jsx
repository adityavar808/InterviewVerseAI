import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const InterviewChart = ({
  data = [],
}) => {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
          Templates
        </p>
        <h3 className="mt-2 text-xl font-semibold text-white">
          Interview coverage
        </h3>
        <p className="mt-2 text-sm text-slate-400">
          Category distribution across the interview template library.
        </p>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid
              stroke="rgba(148,163,184,0.12)"
              vertical={false}
            />
            <XAxis
              dataKey="name"
              tick={{
                fill: "#94a3b8",
                fontSize: 12,
              }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{
                fill: "#94a3b8",
                fontSize: 12,
              }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                background:
                  "rgba(2,6,23,0.96)",
                border:
                  "1px solid rgba(255,255,255,0.08)",
                borderRadius: "18px",
              }}
              labelStyle={{
                color: "#f8fafc",
              }}
            />
            <Bar
              dataKey="value"
              radius={[12, 12, 0, 0]}
              fill="#38bdf8"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default InterviewChart;
