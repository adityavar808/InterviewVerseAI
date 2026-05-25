const toneMap = {
  active:
    "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
  published:
    "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
  verified:
    "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
  admin:
    "border-cyan-400/20 bg-cyan-400/10 text-cyan-300",
  inactive:
    "border-amber-400/20 bg-amber-400/10 text-amber-300",
  draft:
    "border-amber-400/20 bg-amber-400/10 text-amber-300",
  suspended:
    "border-rose-400/20 bg-rose-400/10 text-rose-300",
  archived:
    "border-slate-400/20 bg-slate-400/10 text-slate-300",
  student:
    "border-slate-300/10 bg-slate-300/10 text-slate-200",
};

const StatusBadge = ({
  value,
  className = "",
}) => {
  const normalizedValue = `${value || ""}`
    .toLowerCase()
    .trim();

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium capitalize ${toneMap[normalizedValue] || toneMap.student} ${className}`}
    >
      {value}
    </span>
  );
};

export default StatusBadge;
