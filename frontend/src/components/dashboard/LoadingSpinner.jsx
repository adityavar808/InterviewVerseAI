const LoadingSpinner = ({
  label = "Loading",
  className = "",
}) => {
  return (
    <div
      className={`flex items-center justify-center gap-3 text-slate-300 ${className}`}
    >
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-cyan-400/30 border-t-cyan-400" />
      <span className="text-sm">{label}</span>
    </div>
  );
};

export default LoadingSpinner;
