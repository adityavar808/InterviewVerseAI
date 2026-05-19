import {
  LayoutDashboard,
  Brain,
  FileText,
  Code2,
  BarChart3,
  User,
  Zap,
  Settings,
} from "lucide-react";

import { NavLink } from "react-router-dom";

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
    icon: Code2,
    label: "Coding Practice",
    path: "/coding",
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

const Sidebar = ({ collapsed, setSidebarOpen }) => {
  return (
    <div
      className={`
    ${collapsed ? "w-24" : "w-72"}

    transition-[width] duration-300
    flex flex-col
    p-5
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
      {/* Ambient orb top-left */}

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

      {/* Logo Area */}

      <div className="relative mb-8">
        {/* Badge */}

        <div
          className="inline-flex items-center gap-1.5 mb-3 px-2.5 py-1 rounded-full"
          style={{
            background: "rgba(6,182,212,0.1)",

            border: "1px solid rgba(6,182,212,0.2)",
          }}
        >
          <Zap size={10} className="text-cyan-400" />

          <span
            className="text-cyan-400 font-mono uppercase tracking-widest"
            style={{
              fontSize: "9px",
            }}
          >
            AI Platform
          </span>
        </div>

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

        {/* Shimmer line */}

        <div
          className="absolute bottom-0 left-0 right-0 h-px mt-3"
          style={{
            background:
              "linear-gradient(90deg, rgba(6,182,212,0.4), transparent)",

            marginTop: "12px",

            position: "relative",
          }}
        />
      </div>

      {/* Nav Label */}

      <p
        className="text-slate-600 font-mono uppercase tracking-widest mb-3"
        style={{
          fontSize: "9px",
        }}
      >
        Navigation
      </p>

      {/* Nav Items */}

      <nav
        className={`
    space-y-2
    flex-1
    min-h-0
    overflow-y-auto

    ${collapsed ? "flex flex-col items-center" : ""}
  `}
      >
        {navItems.map(({ icon: Icon, label, path }) => (
          <NavLink
            onClick={() => setSidebarOpen?.(false)}
            key={label}
            to={path}
            className={({ isActive }) =>
              `
  flex items-center

  ${collapsed ? "justify-center w-14 h-14 mx-auto" : "gap-3 px-3 py-2.5"}

  rounded-xl transition-all duration-200 border

  ${
    isActive
      ? "bg-cyan-500/10 border-cyan-500/20"
      : "border-transparent hover:bg-white/5 hover:border-white/10"
  }
`
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={17}
                  style={{
                    color: isActive
                      ? "rgb(34,211,238)"
                      : "rgba(148,163,184,0.7)",
                  }}
                />

                <span
                  className="text-sm font-medium"
                  style={{
                    color: isActive
                      ? "rgba(255,255,255,0.9)"
                      : "rgba(148,163,184,0.7)",
                  }}
                >
                  {!collapsed && label}
                </span>

                {/* Active Indicator */}

                {isActive && !collapsed && (
                  <div
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400"
                    style={{
                      boxShadow: "0 0 6px rgba(6,182,212,0.8)",
                    }}
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom User Card */}

      <div
        className="mt-6 p-3 rounded-xl"
        style={{
          background: "rgba(255,255,255,0.03)",

          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          className={`
  flex items-center
  ${collapsed ? "justify-center" : "gap-3"}
  px-3 py-2.5 rounded-xl transition-all duration-200 border
`}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, #06b6d4, #0891b2)",

              color: "#020617",
            }}
          >
            A
          </div>

          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-slate-200 text-sm font-medium truncate">
                Aditya
              </p>

              <p
                className="text-slate-500 truncate font-mono"
                style={{
                  fontSize: "10px",
                }}
              >
                aditya@example.com
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Ambient Orb Bottom */}

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
