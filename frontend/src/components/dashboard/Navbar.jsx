import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Settings,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Zap,
  FileText,
  Bell,
  Trash2,
  Brain,
  Sparkles,
  ExternalLink,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../../services/api";
import { logout } from "../../redux/slices/authSlice";
import studentService from "../../services/studentApi";

const Navbar = ({ setSidebarOpen, collapsed, setCollapsed }) => {
  const [open, setOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  const dropdownRef = useRef(null);
  const notifRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user || {});

  const [notifications, setNotifications] = useState([]);

  // FETCH DYNAMIC USER NOTIFICATIONS
  useEffect(() => {
    const fetchUserNotifications = async () => {
      try {
        const dashboardData = await studentService.getDashboard().catch(() => null);
        const recentInterviews = dashboardData?.recentInterviews || [];
        const overview = dashboardData?.overview || {};

        const userId = user._id || user.id || "user";
        const storageKey = `iv_notifs_${userId}`;
        const savedReadState = JSON.parse(localStorage.getItem(storageKey) || "{}");

        let generated = [];

        // 1. Recent interview notification if available
        if (recentInterviews.length > 0) {
          const latest = recentInterviews[0];
          const notifId = `interview_${latest._id || latest.id || "latest"}`;
          generated.push({
            id: notifId,
            title: "AI Interview Session Recorded",
            message: `Your session '${latest.title || latest.role || "Mock Round"}' was completed with score ${latest.overallScore || latest.score || 85}%.`,
            time: latest.date ? new Date(latest.date).toLocaleDateString() : "Recent",
            link: "/interviews",
            read: !!savedReadState[notifId],
          });
        }

        // 2. ATS Resume status notification
        const resumeNotifId = "resume_ats_status";
        generated.push({
          id: resumeNotifId,
          title: "ATS Resume Compatibility",
          message: `Your current ATS resume score is ${overview.atsResumeScore || user.atsResumeScore || 88}%. Scan to identify keyword gaps.`,
          time: "Active",
          link: "/resume-analyzer",
          read: !!savedReadState[resumeNotifId],
        });

        // 3. Credits alert
        const creditsNotifId = "credits_info";
        const intCredits = user.interviewCredits ?? 10;
        const resCredits = user.resumeCredits ?? 10;
        generated.push({
          id: creditsNotifId,
          title: "Account Credits Balance",
          message: `Active balance: ${intCredits} Mock Interview credits and ${resCredits} Resume Scan credits available.`,
          time: "Balance",
          link: "/profile",
          read: !!savedReadState[creditsNotifId],
        });

        // 4. Onboarding tip if no sessions yet
        if (recentInterviews.length === 0) {
          const welcomeNotifId = "welcome_onboarding";
          generated.push({
            id: welcomeNotifId,
            title: "Welcome to InterviewVerse AI 🎉",
            message: "Start your placement preparation by selecting an AI mock interview track or scanning your resume.",
            time: "Welcome",
            link: "/interviews",
            read: !!savedReadState[welcomeNotifId],
          });
        }

        setNotifications(generated);
      } catch (e) {
        // Fallback default notifications
        setNotifications([
          {
            id: "default_1",
            title: "Welcome to InterviewVerse AI",
            message: "Get started with your first AI Mock Interview or ATS Resume Audit.",
            time: "Welcome",
            link: "/interviews",
            read: false,
          },
        ]);
      }
    };

    fetchUserNotifications();
  }, [user.interviewCredits, user.resumeCredits, user._id, user.id]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const saveReadState = (updatedNotifs) => {
    const userId = user._id || user.id || "user";
    const storageKey = `iv_notifs_${userId}`;
    const stateMap = {};
    updatedNotifs.forEach((n) => {
      stateMap[n.id] = n.read;
    });
    localStorage.setItem(storageKey, JSON.stringify(stateMap));
  };

  const getUserInitials = (name) =>
    (name || "")
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "ST";

  // CLOSE DROPDOWNS ON OUTSIDE CLICK
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false);
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

  const markAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(updated);
    saveReadState(updated);
    toast.success("All notifications marked as read");
  };

  const markAsRead = (id) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    setNotifications(updated);
    saveReadState(updated);
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    saveReadState([]);
    toast.success("Notifications cleared");
  };

  return (
    <div
      className="h-16 flex items-center justify-between px-6 relative z-40"
      style={{
        background: "rgba(255,255,255,0.03)",
        backdropFilter: "blur(24px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Bottom Shimmer */}
      <div
        className="absolute bottom-0 left-12 right-12 h-px pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(6,182,212,0.4), transparent)",
        }}
      />

      {/* LEFT SECTION */}
      <div className="flex items-center gap-3">
        <button className="lg:hidden text-slate-300 hover:text-white" onClick={() => setSidebarOpen(true)}>
          <Menu size={24} />
        </button>

        <button
          className="hidden lg:flex text-slate-400 hover:text-white transition"
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

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* CREDIT BADGES */}
        <div className="hidden sm:flex items-center gap-2">
          <motion.div
            key={`interview-credits-${user.interviewCredits}`}
            initial={{ scale: 0.95, opacity: 0.8 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold"
            style={{
              background: "rgba(6,182,212,0.1)",
              border: "1px solid rgba(6,182,212,0.25)",
              color: "#22d3ee",
            }}
            title="Interview Credits remaining"
          >
            <Zap size={13} className="text-cyan-400" />
            <span>{user.interviewCredits ?? 10} Interviews</span>
          </motion.div>

          <motion.div
            key={`resume-credits-${user.resumeCredits}`}
            initial={{ scale: 0.95, opacity: 0.8 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold"
            style={{
              background: "rgba(167,139,250,0.1)",
              border: "1px solid rgba(167,139,250,0.25)",
              color: "#c084fc",
            }}
            title="Resume Analyzer Credits remaining"
          >
            <FileText size={13} className="text-purple-400" />
            <span>{user.resumeCredits ?? 10} Resumes</span>
          </motion.div>
        </div>

        {/* NOTIFICATION BUTTON & DROPDOWN */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => {
              setNotifOpen(!notifOpen);
              setOpen(false);
            }}
            className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:bg-white/10"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
            title="Notifications"
            aria-label="View notifications"
          >
            <Bell size={17} className="text-slate-300" />
            {unreadCount > 0 && (
              <span
                className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-cyan-400 text-[10px] font-black text-slate-950 shadow-[0_0_8px_rgba(34,211,238,0.8)]"
              >
                {unreadCount}
              </span>
            )}
          </button>

          {/* NOTIFICATION DROPDOWN POPUP */}
          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-12 w-80 sm:w-96 rounded-2xl border border-white/10 bg-slate-900/95 p-4 shadow-2xl backdrop-blur-2xl z-[999999]"
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <Bell size={15} className="text-cyan-400" />
                    <span className="text-xs font-bold text-white">Your Notifications</span>
                    {unreadCount > 0 && (
                      <span className="rounded-full bg-cyan-400/20 px-2 py-0.5 text-[10px] font-bold text-cyan-300">
                        {unreadCount} unread
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[11px]">
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-cyan-400 hover:underline font-medium"
                      >
                        Mark read
                      </button>
                    )}
                    {notifications.length > 0 && (
                      <button
                        onClick={clearAllNotifications}
                        className="text-slate-500 hover:text-rose-400 transition"
                        title="Clear all"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>

                {/* List */}
                <div className="max-h-72 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-500">
                      No notifications right now
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          markAsRead(n.id);
                          if (n.link) {
                            navigate(n.link);
                            setNotifOpen(false);
                          }
                        }}
                        className={`group relative rounded-xl border p-3 transition cursor-pointer ${
                          n.read
                            ? "border-white/5 bg-white/[0.02] text-slate-400 opacity-75"
                            : "border-cyan-400/20 bg-cyan-400/5 text-slate-200 hover:border-cyan-400/40"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            {!n.read && (
                              <span className="h-2 w-2 rounded-full bg-cyan-400 shrink-0" />
                            )}
                            <p className="text-xs font-bold text-white group-hover:text-cyan-300 transition">
                              {n.title}
                            </p>
                          </div>
                          <span className="text-[10px] text-slate-500 shrink-0">{n.time}</span>
                        </div>
                        <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
                          {n.message}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* DIVIDER */}
        <div
          className="hidden md:block w-px h-6"
          style={{ background: "rgba(255,255,255,0.08)" }}
        />

        {/* PROFILE SECTION */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => {
              setOpen(!open);
              setNotifOpen(false);
            }}
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

          {/* PROFILE DROPDOWN */}
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-12 w-56 rounded-2xl p-2 z-[99999]"
                style={{
                  background: "rgba(15,23,42,0.95)",
                  backdropFilter: "blur(24px)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
                }}
              >
                <div className="px-3 py-2.5 mb-1 border-b border-white/5 pb-3">
                  <p className="text-sm font-medium text-white">
                    {user.name || "Student"}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {user.email || "student@example.com"}
                  </p>
                </div>

                <div className="space-y-1">
                  <button
                    onClick={() => {
                      navigate("/profile");
                      setOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-white/5 transition-all text-xs font-medium"
                  >
                    <User size={16} />
                    <span>Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      navigate("/settings");
                      setOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:bg-white/5 transition-all text-xs font-medium"
                  >
                    <Settings size={16} />
                    <span>Settings</span>
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 transition-all text-xs font-medium"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
