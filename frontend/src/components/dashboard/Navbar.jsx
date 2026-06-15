import { useState, useRef, useEffect } from "react";

import {
  User,
  Settings,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";

import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import api from "../../services/api";

import { logout } from "../../redux/slices/authSlice";

const Navbar = ({ setSidebarOpen, collapsed, setCollapsed }) => {
  const [open, setOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  const dropdownRef = useRef(null);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user || {});

  const getUserInitials = (name) =>
    (name || "").
      split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "ST";

  // CLOSE DROPDOWN ON OUTSIDE CLICK

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");

      localStorage.removeItem("accessToken");

      dispatch(logout());

      setOpen(false);

      toast.success("Logged out successfully");

      navigate("/login");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  return (
    <div
      className="h-16 flex items-center justify-between px-6 relative"
      style={{
        background: "rgba(255,255,255,0.03)",
        backdropFilter: "blur(24px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Bottom Shimmer */}
      <div
        className="absolute bottom-0 left-12 right-12 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(6,182,212,0.4), transparent)",
        }}
      />

      {/* LEFT SECTION — untouched */}
      <div className="flex items-center gap-3">
        {/* MOBILE MENU BUTTON */}
        <button className="lg:hidden" onClick={() => setSidebarOpen(true)}>
          <Menu size={24} />
        </button>

        <button
          className="hidden lg:flex"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <PanelLeftOpen size={22} />
          ) : (
            <PanelLeftClose size={22} />
          )}
        </button>

        <h2
          className="text-lg font-semibold"
          style={{ color: "rgba(255,255,255,0.85)" }}
        >
          Dashboard
        </h2>

        {/* LIVE BADGE */}
        <div
          className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full"
          style={{
            background: "rgba(6,182,212,0.1)",
            border: "1px solid rgba(6,182,212,0.2)",
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span
            className="text-cyan-400 font-mono uppercase tracking-widest"
            style={{ fontSize: "9px" }}
          >
            Live
          </span>
        </div>
      </div>

      {/* RIGHT SECTION — responsive */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* NOTIFICATION */}
        <button
          className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-all"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <svg
            className="w-4 h-4 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
            />
          </svg>
          <span
            className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-cyan-400"
            style={{ boxShadow: "0 0 6px rgba(6,182,212,0.8)" }}
          />
        </button>

        {/* DIVIDER — hidden on mobile */}
        <div
          className="hidden md:block w-px h-6"
          style={{ background: "rgba(255,255,255,0.08)" }}
        />

        {/* PROFILE SECTION */}
        <div className="relative" ref={dropdownRef}>  
          {/* PROFILE BUTTON */}
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2.5"
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center font-semibold text-sm flex-shrink-0 overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #06b6d4, #0891b2)",
                color: "#020617",
                boxShadow: "0 0 16px rgba(6,182,212,0.3)",
              }}
            >
              {user.profileImage && !imageError ? (
                <img
                  src={user.profileImage}
                  alt={user.name || "User profile"}
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                getUserInitials(user.name)
              )}
            </div>

            {/* Name + role — hidden on mobile */}
            <div className="hidden md:block text-left">
              <p className="text-slate-200 text-sm font-medium leading-none">
                {user.name || "Student"}
              </p>
              <p
                className="text-slate-500 font-mono uppercase tracking-widest mt-0.5"
                style={{ fontSize: "9px" }}
              >
                {user.role === "student" ? "Student" : user.role || "Learner"}
              </p>
            </div>
          </button>

          {/* DROPDOWN */}

          {open && (
            <div
              className="
      absolute
      right-0
      top-14
      w-56
      rounded-2xl
      p-2
      z-[99999]
    "
              style={{
                background: "rgba(15,23,42,0.88)",

                backdropFilter: "blur(24px)",

                border: "1px solid rgba(255,255,255,0.06)",

                boxShadow: "0 12px 40px rgba(0,0,0,0.35)",
              }}
            >
              {/* USER INFO */}

              <div className="px-3 py-2.5 mb-1">
                <p className="text-sm font-medium text-white">
                  {user.name || "Student"}
                </p>

                <p className="text-[11px] text-slate-500 mt-0.5">
                  {user.email || "student@example.com"}
                </p>
              </div>

              {/* MENU */}

              <div className="space-y-1">
                {/* PROFILE */}

                <button
                  onClick={() => {
                    navigate("/profile");
                    setOpen(false);
                  }}
                  className="
          w-full
          flex
          items-center
          gap-3
          px-3
          py-2.5
          rounded-xl
          text-slate-300
          hover:bg-white/5
          transition-all
        "
                >
                  <User size={16} />

                  <span className="text-sm">Profile</span>
                </button>

                {/* SETTINGS */}

                <button
                  onClick={() => {
                    navigate("/settings");
                    setOpen(false);
                  }}
                  className="
          w-full
          flex
          items-center
          gap-3
          px-3
          py-2.5
          rounded-xl
          text-slate-300
          hover:bg-white/5
          transition-all
        "
                >
                  <Settings size={16} />

                  <span className="text-sm">Settings</span>
                </button>

                {/* LOGOUT */}

                <button
                  onClick={handleLogout}
                  className="
          w-full
          flex
          items-center
          gap-3
          px-3
          py-2.5
          rounded-xl
          text-red-400
          hover:bg-red-500/10
          transition-all
        "
                >
                  <LogOut size={16} />

                  <span className="text-sm">Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
