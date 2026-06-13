const FullScreenLoader = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-black to-slate-900 overflow-hidden">

      {/* Animated Rings */}
      <div className="relative flex items-center justify-center">
        <div className="absolute h-32 w-32 rounded-full border-4 border-cyan-500/20"></div>

        <div className="absolute h-32 w-32 rounded-full border-t-4 border-cyan-400 animate-spin"></div>

        <div className="absolute h-24 w-24 rounded-full border-b-4 border-violet-500 animate-spin [animation-direction:reverse]"></div>

        <div className="h-4 w-4 rounded-full bg-white animate-pulse"></div>
      </div>

      {/* Loading Text */}
      <div className="mt-10 text-center">
        <h2 className="text-2xl font-bold text-white tracking-wide">
          Loading
        </h2>

        <div className="mt-2 flex justify-center gap-1">
          <span className="h-2 w-2 rounded-full bg-cyan-400 animate-bounce"></span>
          <span
            className="h-2 w-2 rounded-full bg-cyan-400 animate-bounce"
            style={{ animationDelay: "0.15s" }}
          ></span>
          <span
            className="h-2 w-2 rounded-full bg-cyan-400 animate-bounce"
            style={{ animationDelay: "0.3s" }}
          ></span>
        </div>

        <p className="mt-4 text-sm text-slate-400">
          Preparing your experience...
        </p>
      </div>
    </div>
  );
};

export default FullScreenLoader;