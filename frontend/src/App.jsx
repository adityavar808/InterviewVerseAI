import { useSelector } from "react-redux";

import AppRoutes from "./routes/AppRoutes";
import AuthLoader from "./components/auth/AuthLoader";
import FullScreenLoader from "./components/common/FullScreenLoader";

function App() {
  const currentPath = typeof window !== "undefined" ? window.location.pathname : "/";
  const { isAuthLoading } = useSelector((state) => state.auth);

  return (
    <>
      <AuthLoader />

      {isAuthLoading ? (
        <FullScreenLoader />
      ) : (
        <AppRoutes />
      )}

      {currentPath === "/debug-otp" && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/95 p-4">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-6 text-white shadow-2xl">
            <h2 className="mb-2 text-xl font-semibold">OTP Debug</h2>
            <p className="mb-4 text-sm text-slate-400">This screen is available for testing the OTP boxes.</p>
            <div className="mb-6 flex justify-between gap-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <input
                  key={index}
                  type="text"
                  inputMode="numeric"
                  maxLength="1"
                  className="h-14 w-12 rounded-xl border border-white/10 bg-white/5 text-center text-xl font-semibold text-white outline-none focus:border-cyan-400"
                />
              ))}
            </div>
            <button className="w-full rounded-xl bg-cyan-500 px-4 py-3 font-semibold text-slate-950">
              Verify OTP
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default App;