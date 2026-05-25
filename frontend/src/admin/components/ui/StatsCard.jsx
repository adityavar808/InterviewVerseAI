const StatsCard = ({
  title,
  value,
  growth,
  subtitle,
  icon: Icon,
  accent = "cyan",
}) => {
  const accentStyles = {
    cyan: {
      glow: "bg-cyan-400/10",
      iconBox:
        "border-cyan-400/20 bg-cyan-400/10 text-cyan-300",
      growth:
        growth >= 0
          ? "text-cyan-300"
          : "text-rose-300",
    },
    amber: {
      glow: "bg-amber-400/10",
      iconBox:
        "border-amber-400/20 bg-amber-400/10 text-amber-300",
      growth:
        growth >= 0
          ? "text-amber-300"
          : "text-rose-300",
    },
    emerald: {
      glow: "bg-emerald-400/10",
      iconBox:
        "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
      growth:
        growth >= 0
          ? "text-emerald-300"
          : "text-rose-300",
    },
    sky: {
      glow: "bg-sky-400/10",
      iconBox:
        "border-sky-400/20 bg-sky-400/10 text-sky-300",
      growth:
        growth >= 0
          ? "text-sky-300"
          : "text-rose-300",
    },
  };

  const tone =
    accentStyles[accent] ||
    accentStyles.cyan;

  return (
    <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-cyan-400/20 hover:shadow-[0_24px_80px_rgba(8,145,178,0.14)]">
      <div
        className={`absolute right-0 top-0 h-32 w-32 rounded-full blur-3xl ${tone.glow}`}
      />

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium tracking-wide text-slate-400">
              {title}
            </p>

            <h2 className="mt-5 text-4xl font-bold tracking-tight text-white">
              {value}
            </h2>
          </div>

          {Icon ? (
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-2xl border ${tone.iconBox}`}
            >
              <Icon size={24} />
            </div>
          ) : null}
        </div>

        <div className="mt-6 flex items-center gap-3">
          <span
            className={`text-sm font-semibold ${tone.growth}`}
          >
            {growth >= 0 ? "+" : ""}
            {growth}%
          </span>

          <p className="text-sm text-slate-500">
            {subtitle || "vs last month"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
