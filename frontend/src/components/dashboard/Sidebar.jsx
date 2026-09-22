import { useState } from "react";

import {
  LayoutDashboard,
  Brain,
  FileText,
  BarChart3,
  User,
  Zap,
  Settings,
} from "lucide-react";

import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

const navItems = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    path: "/dashboard",
  },

  {
    icon: Brain,
    label: "AI Interviews",
    path: "/interviews",
  },

  {
    icon: FileText,
    label: "Resume Analyzer",
    path: "/resume-analyzer",
  },

  {
    icon: BarChart3,
    label: "Analytics",
    path: "/analytics",
  },

  {
    icon: User,
    label: "Profile",
    path: "/profile",
  },

  {
    icon: Settings,
    label: "Settings",
    path: "/settings",
  },
];

const Sidebar = ({
  collapsed,
  setSidebarOpen,
}) => {
  const [imageError, setImageError] = useState(false);
  const user = useSelector((state) => state.auth.user || {});
  const displayName = user.name || "Student";
  const displayEmail = user.email || "student@example.com";

  return (

    <div
      className={`
        ${collapsed ? "w-20 px-2 py-5" : "w-72 p-5"}
        h-screen
        transition-[width,padding]
        duration-300
        flex
        flex-col
        relative
        overflow-hidden
        max-w-[85vw]
      `}
      style={{
        background: "rgba(2,6,23,0.95)",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        backdropFilter: "blur(24px)",
      }}
    >
      {/* Ambient Orb */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: "200px",
          height: "200px",
          top: "-60px",
          left: "-60px",
          background:
            "radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)",
        }}
      />

      {/* LOGO AREA */}
      <div
        className={`
          relative
          mb-6
          ${collapsed ? "flex flex-col items-center" : ""}
        `}
      >
        {/* AI BADGE */}
        <div
          className={`
            inline-flex items-center rounded-full mb-3 transition-all duration-300
            ${collapsed ? "justify-center w-10 h-10" : "gap-1.5 px-2.5 py-1"}
          `}
          title={collapsed ? "InterviewVerse AI Platform" : undefined}
          style={{
            background: "rgba(6,182,212,0.1)",
            border: "1px solid rgba(6,182,212,0.2)",
          }}
        >
          <Zap size={14} className="text-cyan-400" />
          {!collapsed && (
            <span
              className="text-cyan-400 font-mono uppercase tracking-widest"
              style={{ fontSize: "9px" }}
            >
              AI Platform
            </span>
          )}
        </div>

        {/* LOGO */}
        {!collapsed && (
          <>
            <h1
              className="text-xl font-bold leading-tight"
              style={{
                background: "linear-gradient(135deg, #06b6d4, #818cf8)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              InterviewVerse
            </h1>
            <p className="text-slate-500 text-xs mt-0.5">Powered by AI</p>
          </>
        )}

        {/* Divider */}
        <div
          className={`
            h-px mt-3 transition-all duration-300
            ${collapsed ? "w-8" : "w-full"}
          `}
          style={{
            background:
              "linear-gradient(90deg, rgba(6,182,212,0.4), transparent)",
          }}
        />
      </div>

      {/* NAVIGATION LABEL */}
      {!collapsed && (
        <p
          className="text-slate-600 font-mono uppercase tracking-widest mb-3"
          style={{ fontSize: "9px" }}
        >
          Navigation
        </p>
      )}

      {/* NAV ITEMS */}
      <nav
        className={`
          flex-1
          min-h-0
          space-y-2
          ${
            collapsed
              ? "flex flex-col items-center overflow-hidden"
              : "overflow-y-auto"
          }
        `}
      >
        {navItems.map(({ icon: Icon, label, path }) => (
          <NavLink
            key={label}
            to={path}
            title={collapsed ? label : undefined}
            onClick={() => setSidebarOpen?.(false)}
            className={({ isActive }) =>
              `
              flex items-center transition-all duration-200 group
              ${
                collapsed
                  ? "justify-center w-11 h-11 mx-auto"
                  : "gap-3 px-3 py-2.5"
              }
              rounded-xl border
              ${
                isActive
                  ? "bg-cyan-500/10 border-cyan-500/20 shadow-[0_0_12px_rgba(6,182,212,0.15)]"
                  : "border-transparent hover:bg-white/5 hover:border-white/10"
              }
            `
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={19}
                  className="transition-colors duration-200 flex-shrink-0"
                  style={{
                    color: isActive
                      ? "rgb(34,211,238)"
                      : "rgba(148,163,184,0.7)",
                  }}
                />

                {!collapsed && (
                  <>
                    <span
                      className="text-sm font-medium"
                      style={{
                        color: isActive
                          ? "rgba(255,255,255,0.92)"
                          : "rgba(148,163,184,0.7)",
                      }}
                    >
                      {label}
                    </span>

                    {isActive && (
                      <div
                        className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400"
                        style={{
                          boxShadow: "0 0 6px rgba(6,182,212,0.8)",
                        }}
                      />
                    )}
                  </>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* USER CARD */}
      <div
        className={`
          mt-4
          rounded-2xl
          border
          transition-all
          duration-300
          ${collapsed ? "p-1.5 flex justify-center" : "p-4"}
        `}
        title={collapsed ? `${displayName} (${displayEmail})` : undefined}
        style={{
          background: "rgba(255,255,255,0.03)",
          borderColor: "rgba(255,255,255,0.06)",
        }}
      >
        <div
          className={`
            flex items-center
            ${collapsed ? "justify-center" : "gap-3"}
          `}
        >
          {/* AVATAR */}
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #06b6d4, #0891b2)",
              color: "#020617",
            }}
          >
            {user.profileImage && !imageError ? (
              <img
                src={user.profileImage}
                alt={displayName}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              displayName.charAt(0).toUpperCase()
            )}
          </div>

          {/* USER INFO */}
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-slate-200 text-sm font-medium truncate">
                {displayName}
              </p>
              <p
                className="text-slate-500 truncate font-mono"
                style={{ fontSize: "10px" }}
              >
                {displayEmail}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Orb */}

      <div
        className="absolute pointer-events-none"
        style={{
          width: "160px",
          height: "160px",
          bottom: "-40px",
          right: "-40px",

          background:
            "radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)",
        }}
      />

    </div>
  );
};

export default Sidebar;