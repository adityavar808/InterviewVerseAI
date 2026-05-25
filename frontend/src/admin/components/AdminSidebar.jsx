import { NavLink } from "react-router-dom";
import { LogOut, ShieldCheck, X } from "lucide-react";

import useAdminSidebar from "../hooks/useAdminSidebar";
import { getAdminProfile, getInitials } from "../utils/adminHelpers";

const AdminSidebar = ({ open, onClose, onLogout, isLoggingOut }) => {
  const { navItems } = useAdminSidebar();
  const admin = getAdminProfile() || {};

  return (
    <aside
      className={`absolute inset-y-0 left-0 z-50 flex w-80 max-w-[88vw] flex-col justify-between border-r border-white/10 bg-slate-950/95 backdrop-blur-xl transition duration-300 lg:relative lg:max-w-none ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
    >
      <div className="absolute left-[-80px] top-[-80px] h-48 w-48 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative">
        <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">
          <div>
            <h1 className="text-2xl font-bold text-white">InterviewVerse</h1>

            <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-cyan-400/15 bg-cyan-400/5 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-cyan-300">
              <ShieldCheck size={11} />
              Intelligent Admin Workspace
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="mt-6 space-y-2 px-4">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.path === "/admin"}
                className={({ isActive }) =>
                  `group flex items-start gap-4 rounded-2xl border px-4 py-4 transition duration-300 ${
                    isActive
                      ? "border-cyan-400/20 bg-cyan-400/10 text-white shadow-[0_18px_60px_rgba(6,182,212,0.16)]"
                      : "border-transparent text-slate-300 hover:border-white/10 hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                <Icon
                  size={20}
                  className="mt-0.5 text-cyan-300 transition duration-300 group-hover:scale-110"
                />

                <div>
                  <p className="text-sm font-semibold tracking-wide">
                    {item.name}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">
                    {item.description}
                  </p>
                </div>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="relative border-t border-white/10 p-4">
        <div className="mb-4 rounded-[24px] border border-white/10 bg-white/5 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-sky-500 text-sm font-bold text-slate-950">
              {getInitials(admin.name)}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">
                {admin.name || "Admin"}
              </p>
              <p className="truncate text-xs text-slate-500">
                {admin.email || "superadmin@interviewverse.ai"}
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onLogout}
          disabled={isLoggingOut}
          className="flex w-full items-center justify-center gap-3 rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm font-medium text-rose-300 transition hover:bg-rose-400/15 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <LogOut size={18} />
          {isLoggingOut ? "Logging out..." : "Logout"}
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
