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

const Sidebar = ({
  collapsed,
  setSidebarOpen,
}) => {
  const user = useSelector((state) => state.auth.user || {});
  const displayName = user.name || "Student";
  const displayEmail = user.email || "student@example.com";

  return (

    <div
      className={`
        ${
          collapsed
            ? "w-24"
            : "w-72"
        }

        h-screen
        transition-[width]
        duration-300
        flex
        flex-col
        p-5
        relative
        overflow-hidden
        max-w-[85vw]
      `}
      style={{
        background:
          "rgba(2,6,23,0.95)",

        borderRight:
          "1px solid rgba(255,255,255,0.06)",

        backdropFilter:
          "blur(24px)",
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
          mb-8

          ${
            collapsed
              ? "flex flex-col items-center"
              : ""
          }
        `}
      >

        {/* AI BADGE */}

        <div
          className={`
            inline-flex items-center rounded-full mb-3

            ${
              collapsed
                ? "justify-center w-12 h-12"
                : "gap-1.5 px-2.5 py-1"
            }
          `}
          style={{
            background:
              "rgba(6,182,212,0.1)",

            border:
              "1px solid rgba(6,182,212,0.2)",
          }}
        >

          <Zap
            size={10}
            className="text-cyan-400"
          />

          {!collapsed && (

            <span
              className="text-cyan-400 font-mono uppercase tracking-widest"
              style={{
                fontSize: "9px",
              }}
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
                background:
                  "linear-gradient(135deg, #06b6d4, #818cf8)",

                WebkitBackgroundClip:
                  "text",

                WebkitTextFillColor:
                  "transparent",
              }}
            >

              InterviewVerse

            </h1>

            <p className="text-slate-500 text-xs mt-0.5">

              Powered by AI

            </p>

          </>

        )}

        {/* Divider */}

        <div
          className={`
            h-px mt-4

            ${
              collapsed
                ? "w-10"
                : "w-full"
            }
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
          style={{
            fontSize: "9px",
          }}
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

        {navItems.map(
          ({
            icon: Icon,
            label,
            path,
          }) => (

            <NavLink
              key={label}

              to={path}

              onClick={() =>
                setSidebarOpen?.(false)
              }

              className={({
                isActive,
              }) =>
                `
                flex items-center

                ${
                  collapsed
                    ? "justify-center w-14 h-14 mx-auto"
                    : "gap-3 px-3 py-2.5"
                }

                rounded-xl border transition-all duration-200

                ${
                  isActive
                    ? "bg-cyan-500/10 border-cyan-500/20"
                    : "border-transparent hover:bg-white/5 hover:border-white/10"
                }
              `
              }
            >

              {({
                isActive,
              }) => (
                <>

                  <Icon
                    size={18}
                    style={{
                      color:
                        isActive
                          ? "rgb(34,211,238)"
                          : "rgba(148,163,184,0.7)",
                    }}
                  />

                  {!collapsed && (

                    <>
                      <span
                        className="text-sm font-medium"
                        style={{
                          color:
                            isActive
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
                            boxShadow:
                              "0 0 6px rgba(6,182,212,0.8)",
                          }}
                        />

                      )}

                    </>

                  )}

                </>
              )}

            </NavLink>
          )
        )}

      </nav>

      {/* USER CARD */}

      <div
        className={`
          mt-6
          rounded-2xl
          border
          transition-all
          duration-300

          ${
            collapsed
              ? "p-3"
              : "p-4"
          }
        `}
        style={{
          background:
            "rgba(255,255,255,0.03)",

          borderColor:
            "rgba(255,255,255,0.06)",
        }}
      >

        <div
          className={`
            flex items-center

            ${
              collapsed
                ? "justify-center"
                : "gap-3"
            }
          `}
        >

          {/* AVATAR */}

          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
            style={{
              background:
                "linear-gradient(135deg, #06b6d4, #0891b2)",

              color: "#020617",
            }}
          >

            {displayName.charAt(0).toUpperCase()}

          </div>

          {/* USER INFO */}

          {!collapsed && (

            <div className="min-w-0 flex-1">

              <p className="text-slate-200 text-sm font-medium truncate">

                {displayName}

              </p>

              <p
                className="text-slate-500 truncate font-mono"
                style={{
                  fontSize: "10px",
                }}
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