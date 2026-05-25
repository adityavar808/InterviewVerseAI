import { LogOut, Menu } from "lucide-react";

import useAdminSidebar from "../hooks/useAdminSidebar";
import { formatDate, getAdminProfile } from "../utils/adminHelpers";

const AdminNavbar = ({ onMenuClick, onLogout, isLoggingOut }) => {
  const { pageTitle, pageDescription } = useAdminSidebar();
  const admin = getAdminProfile() || {};

  return (
    <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-white/10 bg-slate-950/70 px-6 backdrop-blur-xl">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onMenuClick}
          className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 lg:hidden"
        >
          <Menu size={18} />
        </button>

        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-semibold text-white">{pageTitle}</h1>
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-cyan-300">
            Live admin workspace
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden rounded-[22px] border border-white/10 bg-white/5 px-4 py-3 md:block">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
            Today
          </p>
          <p className="mt-1 text-sm font-medium text-white">
            {formatDate(new Date())}
          </p>
        </div>

        <div className="hidden rounded-[22px] border border-white/10 bg-white/5 px-4 py-3 lg:block">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
            Signed in as
          </p>
          <p className="mt-1 text-sm font-medium text-white">
            {admin.email || "superadmin@interviewverse.ai"}
          </p>
        </div>

        <button
          type="button"
          onClick={onLogout}
          disabled={isLoggingOut}
          className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <LogOut size={16} />
          {isLoggingOut ? "Logging out..." : "Logout"}
        </button>
      </div>
    </header>
  );
};

export default AdminNavbar;
