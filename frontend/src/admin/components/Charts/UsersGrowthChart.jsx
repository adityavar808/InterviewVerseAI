import {
  ResponsiveContainer,
  CartesianGrid,
  LineChart,
  Line,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const UsersGrowthChart = ({
  data = [],
}) => {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
          Growth
        </p>
        <h3 className="mt-2 text-xl font-semibold text-white">
          User acquisition
        </h3>
        <p className="mt-2 text-sm text-slate-400">
          New learner signups compared with verified accounts over the last six months.
        </p>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid
              stroke="rgba(148,163,184,0.12)"
              vertical={false}
            />
            <XAxis
              dataKey="month"
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
            <Line
              type="monotone"
              dataKey="users"
              stroke="#22d3ee"
              strokeWidth={3}
              dot={{
                r: 4,
                strokeWidth: 0,
              }}
              activeDot={{
                r: 6,
              }}
            />
            <Line
              type="monotone"
              dataKey="verifiedUsers"
              stroke="#f59e0b"
              strokeWidth={3}
              dot={{
                r: 4,
                strokeWidth: 0,
              }}
              activeDot={{
                r: 6,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default UsersGrowthChart;
