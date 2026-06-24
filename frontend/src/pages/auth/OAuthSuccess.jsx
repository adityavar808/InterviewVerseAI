import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { setCredentials, logout } from "../../redux/slices/authSlice";
import { API_BASE_URL } from "../../config/urls";

const G = { blue: "#4285F4", red: "#EA4335", yellow: "#FBBC05", green: "#34A853" };

const STEPS = [
  { id: "auth",     label: "Authenticating token",  color: G.blue,   bg: "#EFF6FF" },
  { id: "profile",  label: "Fetching your profile", color: G.red,    bg: "#FFF5F5" },
  { id: "session",  label: "Initializing session",  color: G.yellow, bg: "#FFFBEB" },
  { id: "redirect", label: "Launching dashboard",   color: G.green,  bg: "#F0FDF4" },
];

const GoogleG = () => (
  <svg width="44" height="44" viewBox="0 0 48 48" fill="none">
    <path d="M43.611 20.083H24v8h11.303C33.654 32.657 29.223 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" fill="#4285F4" />
    <path d="M6.306 14.691l6.571 4.819C14.655 15.108 19 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4c-7.682 0-14.344 4.337-17.694 10.691z" fill="#EA4335" />
    <path d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0124 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" fill="#34A853" />
    <path d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 01-4.087 5.571l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" fill="#FBBC05" />
  </svg>
);

const StepRow = ({ step, status }) => {
  const isDone   = status === "done";
  const isActive = status === "active";

  return (
    <div
      style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "10px 14px", borderRadius: 12,
        background: isDone ? step.bg : isActive ? "#fff" : "#fafafa",
        border: `1.5px solid ${isDone ? step.color + "44" : isActive ? step.color + "88" : "#f0f0f0"}`,
        boxShadow: isActive ? `0 0 0 3px ${step.color}18` : "none",
        transition: "all .3s",
        opacity: status === "wait" ? 0.5 : 1,
      }}
    >
      {/* Icon */}
      <div style={{
        width: 28, height: 28, borderRadius: 8, flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: isDone ? step.color : isActive ? step.color + "18" : "#f3f4f6",
        transition: "all .3s",
      }}>
        {isDone ? (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <polyline points="2,7 5.5,10.5 12,3.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : isActive ? (
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: step.color, animation: "ivPulse .7s ease infinite" }} />
        ) : (
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#d1d5db" }} />
        )}
      </div>

      {/* Label */}
      <span style={{ fontSize: 13, fontWeight: 500, flex: 1, color: status === "wait" ? "#9ca3af" : "#111827", transition: "color .3s" }}>
        {step.label}
      </span>

      {/* Badge */}
      {isDone && <span style={{ fontSize: 11, fontWeight: 600, color: step.color }}>Done</span>}
      {isActive && (
        <span style={{ fontSize: 12, color: step.color, animation: "ivBlink .8s ease infinite", letterSpacing: 1 }}>●●●</span>
      )}
    </div>
  );
};

const OAuthSuccess = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [phase,      setPhase]      = useState("loading"); // loading | done | error
  const [activeStep, setActiveStep] = useState(0);
  const [errorMsg,   setErrorMsg]   = useState("");

  // Step ticker
  useEffect(() => {
    if (phase !== "loading") return;
    const iv = setInterval(() => setActiveStep(s => Math.min(s + 1, STEPS.length - 1)), 700);
    return () => clearInterval(iv);
  }, [phase]);

  // OAuth sync
  useEffect(() => {
    const sync = async () => {
      const params = new URLSearchParams(window.location.search);
      const token  = params.get("token");
      if (!token) { navigate("/login", { replace: true }); return; }
      try {
        const { data } = await axios.get(`${API_BASE_URL}/auth/me`, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        });
        localStorage.setItem("accessToken", token);
        dispatch(setCredentials({ accessToken: token, user: data.user }));
        setPhase("done");
        setActiveStep(STEPS.length - 1);
        setTimeout(() => navigate(
          data.user?.profileSetupDone === false ? "/complete-profile" : "/dashboard",
          { replace: true }
        ), 1400);
      } catch (err) {
        localStorage.removeItem("accessToken");
        dispatch(logout());
        const msg = err.response?.data?.message || err.message || "Unable to complete Google sign-in";
        setPhase("error");
        setErrorMsg(msg);
        toast.error(msg);
        setTimeout(() => navigate("/login", { replace: true }), 2800);
      }
    };
    sync();
  }, [dispatch, navigate]);

  const ringDash     = phase === "done" ? "124 366" : phase === "error" ? "50 440" : "114 377";
  const ringOpacity  = phase === "error" ? 0.3 : 1;
  const labelColor   = phase === "done" ? G.green : phase === "error" ? G.red : G.blue;
  const labelText    = phase === "done" ? "Access granted" : phase === "error" ? "Sign-in failed" : "Google OAuth";
  const titleText    = phase === "done" ? "You're all set!" : phase === "error" ? "Something went wrong" : "Signing you in";
  const subText      = phase === "done"
    ? "Redirecting to your dashboard…"
    : phase === "error"
    ? (errorMsg || "Redirecting back to login…")
    : "Hang tight while we verify your account…";

  return (
    <>
      <style>{`
        @keyframes ivFadeUp  { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes ivSpin    { to{transform:rotate(360deg)} }
        @keyframes ivSpinRev { to{transform:rotate(-360deg)} }
        @keyframes ivCheck   { from{stroke-dashoffset:52} to{stroke-dashoffset:0} }
        @keyframes ivRipple  { 0%{transform:scale(1);opacity:.5} 100%{transform:scale(2.2);opacity:0} }
        @keyframes ivPulse   { 0%,100%{transform:scale(1)} 50%{transform:scale(.88)} }
        @keyframes ivBlink   { 0%,100%{opacity:1} 50%{opacity:.2} }
        @keyframes ivShake   { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-6px)} 40%,80%{transform:translateX(6px)} }
        @keyframes ivFloat1  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes ivFloat2  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
        @keyframes ivFloat3  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-13px)} }
        @keyframes ivStepIn  { from{opacity:0;transform:translateX(-6px)} to{opacity:1;transform:translateX(0)} }
      `}</style>

      {/* Full-page white bg */}
      <div style={{
        minHeight: "100vh", background: "#ffffff",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "24px 16px", position: "relative", overflow: "hidden",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}>

        {/* Dot grid */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: "radial-gradient(circle, #e5e7eb 1px, transparent 1px)",
          backgroundSize: "28px 28px", opacity: 0.55,
        }} />

        {/* Floating colour blobs */}
        {[
          { color: G.blue,   style: { width: 300, height: 300, top: -70, right: -50, animation: "ivFloat1 7s ease-in-out infinite" } },
          { color: G.green,  style: { width: 220, height: 220, bottom: -50, left: -30, animation: "ivFloat2 9s ease-in-out infinite" } },
          { color: G.yellow, style: { width: 160, height: 160, top: 60, left: 20, animation: "ivFloat3 6s ease-in-out infinite" } },
        ].map((b, i) => (
          <div key={i} style={{
            position: "absolute", borderRadius: "50%", pointerEvents: "none",
            background: b.color, opacity: 0.065, ...b.style,
          }} />
        ))}

        {/* Card */}
        <div style={{
          position: "relative", zIndex: 2,
          background: "#fff", borderRadius: 24,
          border: "1.5px solid #f1f1f1",
          boxShadow: "0 2px 8px rgba(0,0,0,.04), 0 12px 40px rgba(0,0,0,.07)",
          padding: "clamp(28px,5vw,48px) clamp(20px,6vw,40px) clamp(24px,4vw,36px)",
          width: "100%", maxWidth: 420,
          display: "flex", flexDirection: "column", alignItems: "center",
          animation: "ivFadeUp .5s cubic-bezier(.22,1,.36,1) both",
        }}>

          {/* Orbital ring + icon */}
          <div style={{
            position: "relative", width: "clamp(116px,28vw,140px)", height: "clamp(116px,28vw,140px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            marginBottom: 28,
          }}>
            {/* Ripple on success */}
            {phase === "done" && (
              <div style={{
                position: "absolute", inset: -10, borderRadius: "50%",
                border: `2px solid ${G.green}`,
                animation: "ivRipple 2s ease-out infinite",
                pointerEvents: "none",
              }} />
            )}

            <svg viewBox="0 0 200 200" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", animation: `ivSpin ${phase === "error" ? "8" : "5"}s linear infinite` }}>
              <circle cx="100" cy="100" r="88" fill="none" stroke="#f3f4f6" strokeWidth="1" strokeDasharray="3 8" />
              {[G.blue, G.red, G.yellow, G.green].map((col, i) => (
                <circle key={col} cx="100" cy="100" r="78" fill="none"
                  stroke={col} strokeWidth="3"
                  strokeDasharray={ringDash}
                  strokeDashoffset={-(i * 119)}
                  strokeLinecap="round"
                  strokeOpacity={ringOpacity}
                  style={{ transition: "stroke-dasharray .8s ease, stroke-opacity .4s" }}
                />
              ))}
              <circle cx="100" cy="100" r="62" fill="none" stroke="#f0f0f0" strokeWidth="1" strokeDasharray="2 8"
                style={{ animation: "ivSpinRev 3s linear infinite" }} />
            </svg>

            {/* Centre disc */}
            <div style={{
              width: "clamp(72px,18vw,88px)", height: "clamp(72px,18vw,88px)",
              borderRadius: "50%", background: "#fff",
              border: `2px solid ${phase === "done" ? G.green + "55" : phase === "error" ? G.red + "44" : "#f0f0f0"}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 2px 12px rgba(0,0,0,.08)",
              position: "relative", zIndex: 2,
              transition: "border-color .4s",
            }}>
              {phase === "loading" && <GoogleG />}
              {phase === "done" && (
                <svg width="44" height="44" viewBox="0 0 48 48" fill="none">
                  <polyline points="8,24 19,33 36,13" stroke={G.green} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"
                    strokeDasharray="52" style={{ animation: "ivCheck .55s cubic-bezier(.4,0,.2,1) both" }} />
                </svg>
              )}
              {phase === "error" && (
                <svg width="44" height="44" viewBox="0 0 48 48" fill="none" style={{ animation: "ivShake .4s ease both" }}>
                  <line x1="13" y1="13" x2="35" y2="35" stroke={G.red} strokeWidth="3.5" strokeLinecap="round" />
                  <line x1="35" y1="13" x2="13" y2="35" stroke={G.red} strokeWidth="3.5" strokeLinecap="round" />
                </svg>
              )}
            </div>
          </div>

          {/* 4-colour bar */}
          <div style={{ display: "flex", gap: 5, justifyContent: "center", marginBottom: 24, opacity: phase === "error" ? 0.25 : 1, transition: "opacity .4s" }}>
            {[G.blue, G.red, G.yellow, G.green].map(col => (
              <div key={col} style={{ height: 3, width: 28, borderRadius: 3, background: col }} />
            ))}
          </div>

          {/* Headline */}
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <p style={{ fontSize: 11, letterSpacing: ".16em", fontWeight: 600, textTransform: "uppercase", color: labelColor, marginBottom: 6, transition: "color .3s" }}>
              {labelText}
            </p>
            <h1 style={{ fontSize: "clamp(18px,4vw,22px)", fontWeight: 700, color: "#111827", marginBottom: 6, lineHeight: 1.25 }}>
              {titleText}
            </h1>
            <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.55 }}>
              {subText}
            </p>
          </div>

          {/* Steps */}
          {phase !== "error" && (
            <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
              {STEPS.map((step, i) => {
                const status =
                  phase === "done" || i < activeStep ? "done"
                  : phase === "loading" && i === activeStep ? "active"
                  : "wait";
                return (
                  <div key={step.id} style={{ animation: `ivStepIn .3s ease both`, animationDelay: `${i * 0.06}s` }}>
                    <StepRow step={step} status={status} />
                  </div>
                );
              })}
            </div>
          )}

          {/* Footer */}
          <div style={{
            width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            paddingTop: 18, borderTop: "1px solid #f3f4f6",
          }}>
            <span style={{ fontSize: 10, letterSpacing: ".18em", fontWeight: 500, color: "#9ca3af", textTransform: "uppercase" }}>
              InterviewVerse AI
            </span>
            <div style={{ width: 4, height: 4, borderRadius: "50%", background: labelColor, animation: "ivPulse 2s infinite", transition: "background .3s" }} />
            <span style={{ fontSize: 10, letterSpacing: ".18em", fontWeight: 500, color: "#9ca3af", textTransform: "uppercase" }}>
              Secure Auth
            </span>
          </div>

        </div>
      </div>
    </>
  );
};

export default OAuthSuccess;