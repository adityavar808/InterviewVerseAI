import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const COLORS = [
  "#22d3ee",
  "#38bdf8",
  "#f59e0b",
  "#34d399",
  "#fb7185",
];

const AIUsageChart = ({
  data = [],
}) => {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
          Question Bank
        </p>
        <h3 className="mt-2 text-xl font-semibold text-white">
          Difficulty mix
        </h3>
        <p className="mt-2 text-sm text-slate-400">
          Current coding question balance across easy, medium, and hard problems.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_220px] lg:items-center">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={64}
                outerRadius={110}
                paddingAngle={3}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={
                      COLORS[
                        index %
                          COLORS.length
                      ]
                    }
                  />
                ))}
              </Pie>
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
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-3">
          {data.map((item, index) => (
            <div
              key={item.name}
              className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{
                    background:
                      COLORS[
                        index %
                          COLORS.length
                      ],
                  }}
                />
                <span className="text-sm text-slate-300">
                  {item.name}
                </span>
              </div>

              <span className="text-sm font-semibold text-white">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AIUsageChart;
