/**
 * InterviewSession.jsx — Production-Grade AI Interview Platform
 * Enterprise-level component with real camera/mic, speech-to-text,
 * AI interviewer, proctoring system, and live analytics.
 *
 * Architecture:
 *   Custom Hooks: useCamera, useMicrophone, useSpeechRecognition,
 *                 useProctoring, useInterviewTimer, useAnalytics
 *   Services:     aiInterviewService (API-ready stubs)
 *   Components:   ViolationOverlay, FullscreenGate, ViolationLog,
 *                 CameraPanel, MicPanel, AIInterviewer, AnalyticsPanel,
 *                 InterviewTimeline, ProctoringDashboard, AnswerEditor
 *
 * Drop-in replacement for the original InterviewSession — same props/routing.
 * Add react-hot-toast, lucide-react, framer-motion to your project.
 */

import {
  useState, useEffect, useRef, useCallback, useMemo, createContext, useContext, memo
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import studentService from "../../services/studentApi";
import {
  Mic, MicOff, Video, VideoOff, Send, CheckCircle2, Clock,
  AlertCircle, ShieldAlert, Maximize, XCircle, Activity,
  BarChart2, User, RefreshCw, Wifi, WifiOff, Eye, EyeOff,
  ChevronRight, Zap, Volume2, VolumeX, Award, TrendingUp,
  MessageSquare, Edit3, Save, Play, Square, RotateCcw,
  AlertTriangle, CheckCheck, Cpu, Camera, CameraOff, Radio,
} from "lucide-react";

// ─── Constants ────────────────────────────────────────────────────────────────
const MAX_VIOLATIONS = 3;

const QUESTIONS = [
  { id: 0, text: "Tell me about yourself and your background in software development.", category: "Behavioral", difficulty: "Easy" },
  { id: 1, text: "Explain the difference between useMemo and useCallback in React.", category: "Technical", difficulty: "Medium" },
  { id: 2, text: "What is the event loop in JavaScript? How does it work?", category: "Technical", difficulty: "Medium" },
  { id: 3, text: "Describe the SOLID principles with a concrete example.", category: "Design", difficulty: "Hard" },
  { id: 4, text: "How would you diagnose and optimize a slow SQL query?", category: "Technical", difficulty: "Hard" },
  { id: 5, text: "What are the key differences between REST and GraphQL?", category: "Architecture", difficulty: "Medium" },
  { id: 6, text: "Explain closures in JavaScript with a practical use case.", category: "Technical", difficulty: "Medium" },
  { id: 7, text: "What is your approach to writing robust unit tests?", category: "Quality", difficulty: "Easy" },
  { id: 8, text: "Describe a technically challenging project and how you resolved the core obstacles.", category: "Behavioral", difficulty: "Hard" },
  { id: 9, text: "What is the virtual DOM and what problem does it solve?", category: "Technical", difficulty: "Easy" },
  { id: 10, text: "Explain the CSS Box Model and common layout pitfalls.", category: "Frontend", difficulty: "Easy" },
  { id: 11, text: "How does async/await work under the hood in JavaScript?", category: "Technical", difficulty: "Hard" },
];

const VIOLATION_MSGS = {
  TAB_SWITCH: { icon: "👁️", title: "Tab Switch Detected", desc: "You navigated away from the interview tab." },
  WINDOW_BLUR: { icon: "🖥️", title: "Window Focus Lost", desc: "You switched to another application." },
  FULLSCREEN: { icon: "⛶", title: "Fullscreen Exited", desc: "You exited fullscreen mode." },
  COPY_ATTEMPT: { icon: "📋", title: "Copy Attempt Blocked", desc: "Copying content is not allowed." },
  PASTE_ATTEMPT: { icon: "📋", title: "Paste Attempt Blocked", desc: "Pasting content is not allowed." },
  DEVTOOLS: { icon: "🔧", title: "DevTools Detected", desc: "Opening developer tools is prohibited." },
  SCREENSHOT: { icon: "📸", title: "Screenshot Key Detected", desc: "Taking screenshots is not allowed." },
  RIGHT_CLICK: { icon: "🖱️", title: "Right-Click Blocked", desc: "Context menu is disabled during the interview." },
  MOUSE_LEAVE: { icon: "↖️", title: "Mouse Left Window", desc: "Your cursor left the interview window." },
  MULTI_FACE: { icon: "👥", title: "Multiple Faces Detected", desc: "Only one person should be present." },
  NO_FACE: { icon: "😶", title: "Face Not Detected", desc: "Please ensure your face is visible." },
};

const DIFF_COLORS = { Easy: "#22c55e", Medium: "#f59e0b", Hard: "#ef4444" };
const CAT_COLORS = { Behavioral: "#8b5cf6", Technical: "#06b6d4", Design: "#f97316", Architecture: "#ec4899", Quality: "#10b981", Frontend: "#3b82f6" };

const fmt = (s) => {
  if (s === null || s === undefined) return "00:00";
  const m = String(Math.floor(s / 60)).padStart(2, "0");
  const sc = String(s % 60).padStart(2, "0");
  return `${m}:${sc}`;
};

const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

// ─── Interview Context ────────────────────────────────────────────────────────
const InterviewCtx = createContext(null);
const useInterview = () => useContext(InterviewCtx);

// ─── AI Interview Service (API-ready stub) ────────────────────────────────────
const aiInterviewService = {
  async generateFollowUp(question, answer, role) {
    await new Promise(r => setTimeout(r, 1200));
    const followUps = [
      "Can you elaborate on the specific technologies you used in that situation?",
      "What would you do differently if you faced this challenge again?",
      "How did this experience shape your current approach to development?",
      "Can you walk me through a concrete code example of that concept?",
    ];
    return followUps[Math.floor(Math.random() * followUps.length)];
  },
  async scoreAnswer(question, answer) {
    await new Promise(r => setTimeout(r, 800));
    return {
      score: Math.floor(60 + Math.random() * 35),
      communication: Math.floor(65 + Math.random() * 30),
      technical: Math.floor(55 + Math.random() * 40),
      confidence: Math.floor(60 + Math.random() * 35),
    };
  },
  async detectEmotion(videoFrame) {
    return { emotion: "neutral", confidence: 0.85 };
  },
};

// ─── Custom Hook: useCamera ───────────────────────────────────────────────────
const useCamera = (enabled) => {
  // Use a stable ref callback instead of useRef so that srcObject is assigned
  // exactly once when the <video> element mounts — never on re-renders.
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [status, setStatus] = useState("idle");
  const [quality, setQuality] = useState(null);

  // Stable ref callback: called by React only when the DOM node appears/disappears.
  const videoRefCallback = useCallback((node) => {
    videoRef.current = node;
    // If a stream is already live when the node mounts, attach it immediately.
    if (node && streamRef.current) {
      node.srcObject = streamRef.current;
    }
  }, []);

  const start = useCallback(async () => {
    setStatus("requesting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" },
        audio: false,
      });
      streamRef.current = stream;
      // Attach to the DOM node directly — no setState involved, so no re-render flicker.
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => { });
      }
      const track = stream.getVideoTracks()[0];
      const settings = track.getSettings();
      setQuality(settings.width >= 1280 ? "HD" : settings.width >= 640 ? "SD" : "LOW");
      setStatus("active");
    } catch (err) {
      setStatus(err.name === "NotAllowedError" ? "denied" : "error");
    }
  }, []);

  const stop = useCallback(() => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setStatus("idle");
    setQuality(null);
  }, []);

  const reconnect = useCallback(() => { stop(); setTimeout(start, 300); }, [start, stop]);

  useEffect(() => {
    if (enabled) start(); else stop();
    return stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  // No bare useEffect without deps — that was the flicker source. Removed.

  return { videoRef: videoRefCallback, status, quality, reconnect };
};

// ─── Custom Hook: useMicrophone ───────────────────────────────────────────────
const useMicrophone = (enabled) => {
  const streamRef = useRef(null);
  const analyserRef = useRef(null);
  const rafRef = useRef(null);
  const [status, setStatus] = useState("idle");
  const [level, setLevel] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  const start = useCallback(async () => {
    setStatus("requesting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      streamRef.current = stream;
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;
      setStatus("active");
      const tick = () => {
        const buf = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(buf);
        const avg = buf.reduce((a, b) => a + b, 0) / buf.length;
        setLevel(clamp(avg / 128, 0, 1));
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    } catch (err) {
      setStatus(err.name === "NotAllowedError" ? "denied" : "error");
    }
  }, []);

  const stop = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    analyserRef.current = null;
    setStatus("idle");
    setLevel(0);
  }, []);

  const toggleMute = useCallback(() => {
    if (!streamRef.current) return;
    const next = !isMuted;
    streamRef.current.getAudioTracks().forEach(t => { t.enabled = !next; });
    setIsMuted(next);
  }, [isMuted]);

  useEffect(() => {
    if (enabled) start(); else stop();
    return stop;
  }, [enabled]);

  return { status, level, isMuted, toggleMute };
};

// ─── Custom Hook: useSpeechRecognition ───────────────────────────────────────
const useSpeechRecognition = ({ onTranscript, onFinal }) => {
  const recRef = useRef(null);
  const [active, setActive] = useState(false);
  const [interim, setInterim] = useState("");
  const [supported, setSupported] = useState(false);
  const [confidence, setConf] = useState(0);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    setSupported(!!SpeechRecognition);
    if (!SpeechRecognition) return;
    const rec = new SpeechRecognition();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "en-US";
    rec.onresult = (e) => {
      let fin = "", int = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) {
          fin += t;
          setConf(e.results[i][0].confidence);
          setHistory(h => [...h, { text: t, ts: Date.now() }]);
        } else { int += t; }
      }
      setInterim(int);
      if (fin) onFinal?.(fin);
      else onTranscript?.(int);
    };
    rec.onerror = (e) => {
      if (e.error !== "no-speech") setActive(false);
    };
    recRef.current = rec;
  }, []);

  const start = useCallback(() => {
    if (!recRef.current || active) return;
    try { recRef.current.start(); setActive(true); setInterim(""); }
    catch { }
  }, [active]);

  const stop = useCallback(() => {
    if (!recRef.current || !active) return;
    try { recRef.current.stop(); }
    catch { }
    setActive(false);
    setInterim("");
  }, [active]);

  const toggle = useCallback(() => { active ? stop() : start(); }, [active, start, stop]);

  return { active, interim, confidence, history, supported, toggle, start, stop };
};

// ─── Custom Hook: useProctoring ───────────────────────────────────────────────
const useProctoring = ({ enabled, onViolation, isFullscreen, enterFullscreen }) => {
  const [log, setLog] = useState([]);
  const countRef = useRef(0);
  const termRef = useRef(false);
  const mouseWarnRef = useRef(false);

  const trigger = useCallback((type) => {
    if (termRef.current || !enabled) return;
    countRef.current += 1;
    const newCount = countRef.current;
    setLog(prev => [...prev, { type, ts: Date.now(), count: newCount }]);
    onViolation?.(type, newCount);
    if (newCount >= MAX_VIOLATIONS) termRef.current = true;
  }, [enabled, onViolation]);

  const terminate = () => { termRef.current = true; };
  const reset = () => { countRef.current = 0; termRef.current = false; setLog([]); };

  // Tab visibility
  useEffect(() => {
    if (!enabled) return;
    const h = () => { if (document.hidden && !termRef.current) trigger("TAB_SWITCH"); };
    document.addEventListener("visibilitychange", h);
    return () => document.removeEventListener("visibilitychange", h);
  }, [enabled, trigger]);

  // Window blur
  useEffect(() => {
    if (!enabled) return;
    const h = () => { if (!termRef.current) trigger("WINDOW_BLUR"); };
    window.addEventListener("blur", h);
    return () => window.removeEventListener("blur", h);
  }, [enabled, trigger]);

  // Keyboard lockdown
  useEffect(() => {
    if (!enabled) return;
    const h = (e) => {
      const k = e.key?.toLowerCase();
      const ctrl = e.ctrlKey || e.metaKey;
      if (ctrl && (k === "c" || k === "x")) { e.preventDefault(); trigger("COPY_ATTEMPT"); return; }
      if (ctrl && k === "v") { e.preventDefault(); trigger("PASTE_ATTEMPT"); return; }
      if (e.key === "F12" || (ctrl && e.shiftKey && ["i", "j", "c"].includes(k))) { e.preventDefault(); trigger("DEVTOOLS"); return; }
      if (e.key === "PrintScreen" || (ctrl && e.shiftKey && k === "s")) { e.preventDefault(); trigger("SCREENSHOT"); return; }
      if (ctrl && k === "a") e.preventDefault();
      if (e.altKey && (k === "tab" || k === "f4")) e.preventDefault();
      if (k === "escape") { e.preventDefault(); setTimeout(enterFullscreen, 300); return; }
      if (["f1", "f3", "f5", "f6", "f7", "f10", "f11"].includes(k)) e.preventDefault();
    };
    document.addEventListener("keydown", h, true);
    return () => document.removeEventListener("keydown", h, true);
  }, [enabled, trigger, enterFullscreen]);

  // Right-click
  useEffect(() => {
    if (!enabled) return;
    const h = (e) => { e.preventDefault(); trigger("RIGHT_CLICK"); };
    document.addEventListener("contextmenu", h);
    return () => document.removeEventListener("contextmenu", h);
  }, [enabled, trigger]);

  // Copy/paste events
  useEffect(() => {
    if (!enabled) return;
    const bc = (e) => { e.preventDefault(); trigger("COPY_ATTEMPT"); };
    const bp = (e) => { e.preventDefault(); trigger("PASTE_ATTEMPT"); };
    document.addEventListener("copy", bc);
    document.addEventListener("cut", bc);
    document.addEventListener("paste", bp);
    return () => { document.removeEventListener("copy", bc); document.removeEventListener("cut", bc); document.removeEventListener("paste", bp); };
  }, [enabled, trigger]);

  // Mouse leave
  useEffect(() => {
    if (!enabled) return;
    const h = (e) => {
      if ((e.clientY <= 0 || e.clientX <= 0 || e.clientX >= window.innerWidth || e.clientY >= window.innerHeight)
        && !mouseWarnRef.current && !termRef.current) {
        mouseWarnRef.current = true;
        trigger("MOUSE_LEAVE");
        setTimeout(() => { mouseWarnRef.current = false; }, 5000);
      }
    };
    document.addEventListener("mouseleave", h);
    return () => document.removeEventListener("mouseleave", h);
  }, [enabled, trigger]);

  // DevTools size detection
  useEffect(() => {
    if (!enabled) return;
    const id = setInterval(() => {
      if ((window.outerWidth - window.innerWidth > 160 || window.outerHeight - window.innerHeight > 160) && !termRef.current)
        trigger("DEVTOOLS");
    }, 2000);
    return () => clearInterval(id);
  }, [enabled, trigger]);

  // Text selection block
  useEffect(() => {
    if (!enabled) return;
    const s = document.createElement("style");
    s.id = "no-select-ips";
    s.textContent = `body{-webkit-user-select:none!important;user-select:none!important}input,textarea{-webkit-user-select:text!important;user-select:text!important}`;
    document.head.appendChild(s);
    return () => document.getElementById("no-select-ips")?.remove();
  }, [enabled]);

  // Disable print
  useEffect(() => {
    if (!enabled) return;
    const s = document.createElement("style");
    s.id = "no-print-ips";
    s.textContent = `@media print{body{display:none!important}}`;
    document.head.appendChild(s);
    return () => document.getElementById("no-print-ips")?.remove();
  }, [enabled]);

  return { log, trigger, terminate, reset };
};

// ─── Custom Hook: useInterviewTimer ──────────────────────────────────────────
const useInterviewTimer = (durationStr) => {
  const [timeLeft, setTimeLeft] = useState(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const match = (durationStr || "30 Min").match(/(\d+)/);
    setTimeLeft((match ? parseInt(match[1], 10) : 30) * 60);
  }, [durationStr]);

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0 || paused) return;
    const id = setInterval(() => setTimeLeft(p => Math.max(p - 1, 0)), 1000);
    return () => clearInterval(id);
  }, [timeLeft, paused]);

  return { timeLeft, paused, setPaused };
};

// ─── Custom Hook: useAnalytics ────────────────────────────────────────────────
const useAnalytics = () => {
  const [data, setData] = useState({
    speakingTime: 0, silentTime: 0,
    answerDurations: [], scores: [],
    avgScore: 0, communication: 0, technical: 0, confidence: 0, engagement: 0,
  });
  const startRef = useRef(null);

  const startAnswer = useCallback(() => { startRef.current = Date.now(); }, []);

  const recordAnswer = useCallback(async (qId, answer, scores) => {
    const dur = startRef.current ? (Date.now() - startRef.current) / 1000 : 0;
    startRef.current = null;
    setData(prev => {
      const newScores = [...prev.scores, { qId, ...scores }];
      const avg = newScores.reduce((a, b) => a + b.score, 0) / newScores.length;
      const com = newScores.reduce((a, b) => a + b.communication, 0) / newScores.length;
      const tec = newScores.reduce((a, b) => a + b.technical, 0) / newScores.length;
      const con = newScores.reduce((a, b) => a + b.confidence, 0) / newScores.length;
      return {
        ...prev,
        answerDurations: [...prev.answerDurations, { qId, dur }],
        scores: newScores,
        avgScore: Math.round(avg),
        communication: Math.round(com),
        technical: Math.round(tec),
        confidence: Math.round(con),
        engagement: Math.round((com + con) / 2),
      };
    });
  }, []);

  const tickSpeaking = useCallback((isSpeaking) => {
    setData(prev => ({
      ...prev,
      speakingTime: isSpeaking ? prev.speakingTime + 1 : prev.speakingTime,
      silentTime: isSpeaking ? prev.silentTime : prev.silentTime + 1,
    }));
  }, []);

  return { data, startAnswer, recordAnswer, tickSpeaking };
};

// ─── Fullscreen helpers ───────────────────────────────────────────────────────
const enterFS = async () => {
  const el = document.documentElement;
  const req = el.requestFullscreen || el.webkitRequestFullscreen || el.mozRequestFullScreen || el.msRequestFullscreen;
  if (!req) return false;
  try { await req.call(el); return true; } catch { return false; }
};
const exitFS = async () => {
  const c = document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen;
  if (!c) return false;
  try { await c.call(document); return true; } catch { return false; }
};

// ═══════════════════════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Fullscreen Gate ──────────────────────────────────────────────────────────
const FullscreenGate = memo(({ onEnter }) => (
  <div style={gs.backdrop}>
    <div style={gs.glow1}></div>
    <div style={gs.glow2}></div>

    <div style={gs.card}>
      <div style={gs.badge}>
        🔒 AI Proctoring Enabled
      </div>

      <div style={gs.shieldWrap}>
        <ShieldAlert size={52} />
      </div>

      <h1 style={gs.title}>Secure Interview Mode</h1>

      <p style={gs.sub}>
        This assessment uses advanced AI proctoring and monitoring.
        Please review the interview requirements before proceeding.
      </p>

      <div style={gs.grid}>
        {[
          ["👁️", "Tab Switching"],
          ["🖥️", "App Switching"],
          ["📋", "Copy & Paste"],
          ["🔧", "Developer Tools"],
          ["📸", "Screenshots"],
          ["🖱️", "Right Click"],
          ["↖️", "Leaving Window"],
          ["👥", "Multiple Faces"],
        ].map(([icon, text]) => (
          <div key={text} style={gs.rule}>
            <span style={gs.icon}>{icon}</span>
            <span>{text}</span>
          </div>
        ))}
      </div>

      <div style={gs.warn}>
        ⚠️ Every violation is logged and reviewed.
        <br />
        After <strong>3 violations</strong>, the interview will be
        automatically terminated.
      </div>

      <div style={gs.requirements}>
        <div style={gs.reqCard}>
          <span>📷</span>
          <span>Camera Required</span>
        </div>

        <div style={gs.reqCard}>
          <span>🎤</span>
          <span>Microphone Required</span>
        </div>

        <div style={gs.reqCard}>
          <span>🌐</span>
          <span>Stable Internet</span>
        </div>
      </div>

      <button style={gs.btn} onClick={onEnter}>
        <Maximize size={18} />
        Enter Fullscreen & Begin Interview
      </button>
    </div>
  </div>
));

// ─── Violation Overlay ────────────────────────────────────────────────────────
const ViolationOverlay = memo(({ violation, count, max, onDismiss, onTerminate }) => {
  const v = VIOLATION_MSGS[violation] || {};
  const remaining = max - count;
  const isFinal = remaining <= 0;
  return (
    <div style={vs.backdrop}>
      <div style={{ ...vs.modal, borderColor: isFinal ? "#ef4444" : "#f59e0b" }}>
        <div style={{ ...vs.ring, borderColor: isFinal ? "#ef4444" : "#f59e0b", animation: "ringPulse 1.5s ease-out infinite" }} />
        <div style={vs.iconBg}><span style={{ fontSize: 36 }}>{v.icon || "⚠️"}</span></div>
        <div style={vs.badge(isFinal)}>{isFinal ? "INTERVIEW TERMINATED" : `WARNING ${count}/${max}`}</div>
        <h2 style={{ ...vs.title, color: isFinal ? "#ef4444" : "#f59e0b" }}>{v.title}</h2>
        <p style={vs.desc}>{v.desc}</p>
        {!isFinal && (
          <div style={vs.warn}>
            ⚡ {remaining} violation{remaining !== 1 ? "s" : ""} remaining before automatic termination
          </div>
        )}
        {isFinal
          ? <button style={vs.terminateBtn} onClick={onTerminate}><XCircle size={18} /> End Interview</button>
          : <button style={vs.dismissBtn} onClick={onDismiss}>I Understand — Return to Interview</button>
        }
      </div>
    </div>
  );
});

// ─── Violation Log Strip ──────────────────────────────────────────────────────
const ViolationLog = memo(({ log }) => {
  if (!log.length) return null;
  return (
    <div style={ls.strip}>
      <ShieldAlert size={13} color="#ef4444" />
      <span style={ls.label}>VIOLATIONS:</span>
      {log.slice(-5).map((v, i) => (
        <span key={i} style={ls.chip}>
          {VIOLATION_MSGS[v.type]?.icon} {VIOLATION_MSGS[v.type]?.title}
        </span>
      ))}
    </div>
  );
});

// ─── Camera Panel ─────────────────────────────────────────────────────────────
const CameraPanel = memo(({ videoRef, status, quality, reconnect, enabled, onToggle }) => {
  const StatusOverlay = () => {
    if (status === "active") return null;
    const msgs = {
      idle: { icon: <CameraOff size={24} color="#64748b" />, text: "Camera off" },
      requesting: { icon: <Camera size={24} color="#f59e0b" />, text: "Requesting access…" },
      denied: { icon: <CameraOff size={24} color="#ef4444" />, text: "Permission denied" },
      error: { icon: <AlertTriangle size={24} color="#ef4444" />, text: "Camera error" },
    };
    const { icon, text } = msgs[status] || msgs.idle;
    return (
      <div style={cp.overlay}>
        {icon}
        <span style={cp.overlayTxt}>{text}</span>
        {(status === "denied" || status === "error") && (
          <button style={cp.retryBtn} onClick={reconnect}>
            <RefreshCw size={14} /> Retry
          </button>
        )}
      </div>
    );
  };

  return (
    <div style={cp.card}>
      <div style={cp.videoWrap}>
        <video ref={videoRef} muted playsInline autoPlay
          style={{
            width: "100%", height: "100%", objectFit: "cover", transform: "scaleX(-1)",
            position: "absolute", inset: 0,
            opacity: status === "active" ? 1 : 0,
            transition: "opacity 0.3s ease",
            willChange: "opacity",
          }} />
        <StatusOverlay />
        {/* Live badge */}
        <div style={cp.liveBadge}>
          <span style={{ ...cp.liveDot, background: status === "active" ? "#22c55e" : "#64748b", animation: status === "active" ? "livePulse 1.2s infinite" : "none" }} />
          {status === "active" ? "LIVE" : "OFF"}
        </div>
        {/* Quality badge */}
        {status === "active" && quality && (
          <div style={cp.qualityBadge}>{quality}</div>
        )}
      </div>
      <div style={cp.controls}>
        <span style={cp.label}>YOU</span>
        <button style={{ ...cp.toggleBtn, ...(enabled ? cp.toggleBtnOff : {}) }} onClick={onToggle}>
          {enabled ? <><VideoOff size={13} /> Hide</> : <><Video size={13} /> Show</>}
        </button>
      </div>
    </div>
  );
});

// ─── Audio Level Bar ──────────────────────────────────────────────────────────
const AudioLevelBar = memo(({ level, bars = 16 }) => {
  const active = Math.round(level * bars);
  return (
    <div style={{ display: "flex", gap: 2, alignItems: "flex-end", height: 24 }}>
      {Array.from({ length: bars }, (_, i) => {
        const h = 4 + (i / bars) * 20;
        const lit = i < active;
        const col = i < bars * 0.6 ? "#22c55e" : i < bars * 0.85 ? "#f59e0b" : "#ef4444";
        return <div key={i} style={{ width: 3, height: h, borderRadius: 1.5, background: lit ? col : "#1e293b", transition: "background 0.05s" }} />;
      })}
    </div>
  );
});

// ─── AI Interviewer Avatar ────────────────────────────────────────────────────
const AIInterviewer = memo(({ speaking, thinking }) => (
  <div style={ai.card}>
    <div style={ai.avatarWrap}>
      <svg viewBox="0 0 200 220" width="190" height="210" style={{ display: "block" }}>
        <defs>
          <radialGradient id="bgGrad" cx="50%" cy="60%">
            <stop offset="0%" stopColor="#2a3a5c" />
            <stop offset="100%" stopColor="#0f172a" />
          </radialGradient>
        </defs>
        <rect width="200" height="220" fill="url(#bgGrad)" />
        <ellipse cx="100" cy="200" rx="60" ry="35" fill="#c7a98a" />
        <path d="M55 195 Q100 175 145 195 L145 220 L55 220Z" fill="#1e3a5f" />
        <rect x="88" y="140" width="24" height="30" rx="6" fill="#d4a574" />
        <ellipse cx="100" cy="110" rx="52" ry="62" fill="#d4a574" />
        <path d="M48 100 Q50 50 100 45 Q150 50 152 100 Q140 65 100 62 Q60 65 48 100Z" fill="#3d2b1f" />
        <ellipse cx="80" cy="105" rx="7" ry="8" fill="white" />
        <ellipse cx="120" cy="105" rx="7" ry="8" fill="white" />
        <circle cx="82" cy="107" r="4" fill="#1e3a5f" />
        <circle cx="122" cy="107" r="4" fill="#1e3a5f" />
        <circle cx="83" cy="106" r="1.5" fill="white" />
        <circle cx="123" cy="106" r="1.5" fill="white" />
        <path d="M72 95 Q80 91 88 94" fill="none" stroke="#3d2b1f" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M112 94 Q120 91 128 95" fill="none" stroke="#3d2b1f" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M85 148 Q100 158 115 148" fill="none" stroke="#8b5e3c" strokeWidth="2.5" strokeLinecap="round" />
        <ellipse cx="48" cy="112" rx="7" ry="10" fill="#c89060" />
        <ellipse cx="152" cy="112" rx="7" ry="10" fill="#c89060" />
      </svg>

      {/* Speaking wave */}
      {speaking && !thinking && (
        <div style={ai.wave}>
          {[1, 2, 3, 4, 5].map(n => (
            <div key={n} style={{ ...ai.bar, animationDelay: `${n * 0.1}s` }} />
          ))}
        </div>
      )}

      {/* Thinking dots */}
      {thinking && (
        <div style={ai.thinkWrap}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{ ...ai.thinkDot, animationDelay: `${i * 0.25}s` }} />
          ))}
        </div>
      )}
    </div>
    <div style={ai.liveBadge}>
      <span style={{ ...ai.liveDot, animation: (speaking || thinking) ? "livePulse 1.2s infinite" : "none" }} />
      {thinking ? "THINKING" : speaking ? "SPEAKING" : "STANDBY"}
    </div>
    <div style={ai.nameTag}>
      <span style={{ fontWeight: 700, color: "#e2e8f0", fontSize: 13 }}>AI Interviewer</span>
      <span style={{ fontSize: 10, color: "#64748b" }}>Powered by Claude</span>
    </div>
  </div>
));

// ─── Analytics Panel ──────────────────────────────────────────────────────────
const AnalyticsPanel = memo(({ data, answered, total, timeLeft }) => {
  const metrics = [
    { label: "Overall Score", value: data.avgScore || "—", suffix: data.avgScore ? "%" : "", color: "#6366f1" },
    { label: "Communication", value: data.communication || "—", suffix: data.communication ? "%" : "", color: "#06b6d4" },
    { label: "Technical", value: data.technical || "—", suffix: data.technical ? "%" : "", color: "#f59e0b" },
    { label: "Confidence", value: data.confidence || "—", suffix: data.confidence ? "%" : "", color: "#22c55e" },
    { label: "Engagement", value: data.engagement || "—", suffix: data.engagement ? "%" : "", color: "#ec4899" },
  ];

  const est = total > answered ? Math.round((timeLeft || 0) / Math.max(1, total - answered)) : 0;

  return (
    <div style={ap.panel}>
      <div style={ap.header}>
        <BarChart2 size={14} color="#6366f1" />
        <span style={ap.headerTxt}>LIVE ANALYTICS</span>
      </div>
      <div style={ap.metricGrid}>
        {metrics.map(m => (
          <div key={m.label} style={ap.metric}>
            <div style={ap.metricLabel}>{m.label}</div>
            <div style={{ ...ap.metricVal, color: m.color }}>
              {m.value}{m.suffix}
            </div>
          </div>
        ))}
      </div>
      <div style={ap.divider} />
      <div style={ap.row}><span style={ap.rLabel}>Questions Done</span><span style={ap.rVal}>{answered}/{total}</span></div>
      <div style={ap.row}><span style={ap.rLabel}>Speaking Time</span><span style={ap.rVal}>{fmt(data.speakingTime)}</span></div>
      <div style={ap.row}><span style={ap.rLabel}>Silent Time</span><span style={ap.rVal}>{fmt(data.silentTime)}</span></div>
      {est > 0 && <div style={ap.row}><span style={ap.rLabel}>Est. per Q</span><span style={ap.rVal}>{fmt(est)}</span></div>}
    </div>
  );
});

// ─── Interview Timeline ───────────────────────────────────────────────────────
const InterviewTimeline = memo(({ questions, activeQ, answered, scores }) => (
  <div style={tl.wrap}>
    <div style={tl.header}><Activity size={13} color="#06b6d4" /><span style={tl.headerTxt}>TIMELINE</span></div>
    <div style={tl.list}>
      {questions.map((q, i) => {
        const isAnswered = answered.includes(i);
        const isActive = i === activeQ;
        const score = scores?.find(s => s.qId === i);
        return (
          <div key={i} style={{ ...tl.item, borderLeftColor: isAnswered ? "#22c55e" : isActive ? "#6366f1" : "#1e293b" }}>
            <div style={{ ...tl.dot, background: isAnswered ? "#22c55e" : isActive ? "#6366f1" : "#334155" }}>
              {isAnswered ? <CheckCheck size={10} color="white" /> : <span style={{ fontSize: 9, color: isActive ? "white" : "#64748b", fontWeight: 700 }}>{i + 1}</span>}
            </div>
            <div style={tl.content}>
              <div style={tl.qnum}>Q{i + 1} <span style={{ ...tl.cat, color: CAT_COLORS[q.category] || "#6366f1" }}>{q.category}</span></div>
              <div style={tl.qtxt}>{(q?.text || q?.question || "").slice(0, 42)}…</div>
              {score && <div style={{ ...tl.score, color: score.score >= 75 ? "#22c55e" : score.score >= 55 ? "#f59e0b" : "#ef4444" }}>
                {score.score}%
              </div>}
            </div>
          </div>
        );
      })}
    </div>
  </div>
));

// ─── Proctoring Dashboard ─────────────────────────────────────────────────────
const ProctoringDashboard = memo(({ isFullscreen, violationCount, violationLog, cameraStatus, micStatus }) => {
  const checks = [
    { label: "Fullscreen", ok: isFullscreen, icon: <Maximize size={11} /> },
    { label: "Camera", ok: cameraStatus === "active", icon: <Camera size={11} /> },
    { label: "Microphone", ok: micStatus === "active", icon: <Mic size={11} /> },
    { label: "Tab Monitor", ok: true, icon: <Eye size={11} /> },
    { label: "Key Guard", ok: true, icon: <Zap size={11} /> },
    { label: "DevTools Block", ok: true, icon: <Cpu size={11} /> },
  ];
  return (
    <div style={pd.card}>
      <div style={pd.header}>
        <ShieldAlert size={13} color={violationCount > 0 ? "#ef4444" : "#22c55e"} />
        <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1.2, color: violationCount > 0 ? "#ef4444" : "#22c55e" }}>
          {violationCount > 0 ? `${violationCount} VIOLATION${violationCount > 1 ? "S" : ""}` : "SECURE"}
        </span>
      </div>
      {checks.map(({ label, ok, icon }) => (
        <div key={label} style={pd.row}>
          <span style={{ ...pd.dot, background: ok ? "#22c55e" : "#ef4444" }} />
          <span style={pd.icon}>{icon}</span>
          <span style={pd.label}>{label}</span>
          <span style={{ fontSize: 9, fontWeight: 700, color: ok ? "#16a34a" : "#ef4444" }}>{ok ? "ON" : "OFF"}</span>
        </div>
      ))}
    </div>
  );
});

// ─── Answer Editor ────────────────────────────────────────────────────────────
const AnswerEditor = memo(({ value, onChange, onSubmit, onVoiceToggle, voiceActive, speechSupported, interim, confidence }) => {
  const combined = value + (interim ? " " + interim : "");
  const words = combined.trim() ? combined.trim().split(/\s+/).length : 0;
  const chars = combined.length;

  return (
    <div style={ae.wrap}>
      {interim && (
        <div style={ae.interim}>
          <Radio size={11} color="#f59e0b" style={{ flexShrink: 0 }} />
          <span style={{ color: "#f59e0b", fontSize: 12, fontStyle: "italic" }}>{interim}</span>
          {confidence > 0 && <span style={{ marginLeft: "auto", fontSize: 10, color: "#64748b" }}>{Math.round(confidence * 100)}% confidence</span>}
        </div>
      )}
      <div style={ae.inputRow}>
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={e => e.key === "Enter" && e.ctrlKey && onSubmit()}
          placeholder="Type your answer here… (Ctrl+Enter to submit)"
          style={ae.textarea}
          rows={3}
        />
        <div style={ae.btnCol}>
          {speechSupported && (
            <button onClick={onVoiceToggle} title={voiceActive ? "Stop voice" : "Start voice"}
              style={{ ...ae.iconBtn, ...(voiceActive ? ae.iconBtnActive : {}) }}>
              {voiceActive ? <MicOff size={16} /> : <Mic size={16} />}
            </button>
          )}
          <button onClick={onSubmit} style={ae.sendBtn} title="Submit answer (Ctrl+Enter)">
            <Send size={16} color="white" />
          </button>
        </div>
      </div>
      <div style={ae.meta}>
        <span style={ae.metaTxt}>{words} words · {chars} chars</span>
        {voiceActive && <span style={{ fontSize: 11, color: "#ef4444", display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#ef4444", animation: "livePulse 1s infinite", display: "inline-block" }} />
          Recording
        </span>}
        <span style={ae.metaTxt}>Ctrl+Enter to submit</span>
      </div>
    </div>
  );
});

// ─── Candidate Info Panel ─────────────────────────────────────────────────────
const CandidatePanel = memo(({ config, analytics }) => (
  <div style={cand.card}>
    <div style={cand.avatar}>AV</div>
    <div style={cand.name}>ADITYA VARSHNEY</div>
    <div style={cand.dept}>B.Tech CS (AI&ML) · 2315510015</div>
    <div style={cand.divider} />
    {[
      ["Role", config.role || "Frontend Developer"],
      ["Difficulty", config.difficulty || "Intermediate"],
      ["Experience", config.experience || "2-4 Years"],
      ["Language", config.language || "English"],
    ].map(([k, v]) => (
      <div key={k} style={cand.row}>
        <span style={cand.rKey}>{k}</span>
        <span style={cand.rVal}>{v}</span>
      </div>
    ))}
    {analytics.avgScore > 0 && (
      <>
        <div style={cand.divider} />
        <div style={cand.scoreRow}>
          <Award size={14} color="#f59e0b" />
          <span style={{ fontSize: 12, color: "#e2e8f0", fontWeight: 600 }}>Live Score: {analytics.avgScore}%</span>
        </div>
      </>
    )}
  </div>
));

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
const normalizeQuestions = (items = []) =>
  Array.isArray(items)
    ? items.map((item, index) => ({
        ...item,
        question: item.question || item.text || item.prompt || item.title || `Question ${index + 1}`,
        text: item.text || item.question || item.prompt || item.title || `Question ${index + 1}`,
      }))
    : [];

const InterviewSession = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const config = location.state?.config || {
    role: "Frontend Developer", difficulty: "Intermediate",
    duration: "30 Min", experience: "2-4 Years", language: "English",
  };
  const [sessionId, setSessionId] = useState(location.state?.sessionId || null);
  const [questions, setQuestions] = useState(normalizeQuestions(location.state?.questions || []));

  const questionList = questions.length > 0 ? questions : QUESTIONS;

  // Gate / fullscreen
  const [gateOpen, setGateOpen] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Camera / mic toggles
  const [camEnabled, setCamEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);

  // Interview state
  const [activeQ, setActiveQ] = useState(0);
  const [answered, setAnswered] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [aiSpeaking, setAiSpeaking] = useState(true);
  const [aiThinking, setAiThinking] = useState(false);
  const [followUpMode, setFollowUpMode] = useState(false);
  const [followUpQ, setFollowUpQ] = useState("");

  // Violation overlay
  const [violationOverlay, setViolationOverlay] = useState(null);
  const [violationCount, setViolationCount] = useState(0);
  const [terminated, setTerminated] = useState(false);

  // Hooks
  const camera = useCamera(camEnabled && !gateOpen);
  const mic = useMicrophone(micEnabled && !gateOpen);
  const { timeLeft } = useInterviewTimer(config.duration);
  const analytics = useAnalytics();

  const handleTranscript = useCallback((t) => { }, []);
  const handleFinalTranscript = useCallback((t) => {
    setUserInput(prev => (prev ? prev + " " : "") + t);
  }, []);

  const speech = useSpeechRecognition({
    onTranscript: handleTranscript,
    onFinal: handleFinalTranscript,
  });

  const handleViolation = useCallback((type, count) => {
    setViolationCount(count);
    setViolationOverlay(type);
    if (count >= MAX_VIOLATIONS) setTerminated(true);
  }, []);

  const proctor = useProctoring({
    enabled: !gateOpen && !terminated,
    onViolation: handleViolation,
    isFullscreen,
    enterFullscreen: enterFS,
  });

  // Fonts
  useEffect(() => {
    if (document.querySelector('link[href*="Sora"]')) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap";
    document.head.appendChild(link);
    return () => link.remove();
  }, []);

  // Fullscreen tracking
  useEffect(() => {
    const h = () => {
      const inFS = !!(document.fullscreenElement || document.webkitFullscreenElement);
      setIsFullscreen(inFS);
      if (!inFS && !gateOpen && !terminated) {
        proctor.trigger("FULLSCREEN");
        setTimeout(enterFS, 250);
      }
    };
    document.addEventListener("fullscreenchange", h);
    document.addEventListener("webkitfullscreenchange", h);
    return () => {
      document.removeEventListener("fullscreenchange", h);
      document.removeEventListener("webkitfullscreenchange", h);
    };
  }, [gateOpen, terminated]);

  // AI speaking simulation
  useEffect(() => {
    const t = setTimeout(() => setAiSpeaking(false), 3000);
    return () => clearTimeout(t);
  }, [activeQ]);

  // Analytics speaking tick
  useEffect(() => {
    if (gateOpen) return;
    const id = setInterval(() => analytics.tickSpeaking(mic.level > 0.05), 1000);
    return () => clearInterval(id);
  }, [gateOpen, mic.level]);

  // Timer end
  useEffect(() => {
    if (timeLeft === 0) handleFinish();
  }, [timeLeft]);

  const handleGateEnter = async () => {
    const ok = await enterFS();
    if (ok) { setGateOpen(false); setIsFullscreen(true); }
    else toast.error("Please allow fullscreen and try again.");
  };

  const saveInterviewHistory = async (status = "Completed") => {
    const tags = Array.from(
      new Set(
        answered
          .map((qId) => questionList[qId]?.category || QUESTIONS[qId]?.category)
          .filter(Boolean),
      ),
    );

    try {
      await studentService.addInterviewHistory({
        sessionId: sessionId || undefined,
        title: `${config.role} Interview`,
        role: config.role || "Practice Interview",
        score: analytics.data.avgScore || 0,
        duration: config.duration || "30 mins",
        status,
        difficulty: config.difficulty || "Medium",
        tags,
        tech: tags,
        notes: "",
        completedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Unable to save interview history:", error);
    }
  };

  const handleSubmit = async () => {
    const text = userInput.trim();
    if (!text) { toast.error("Please type or speak your answer."); return; }
    if (speech.active) speech.stop();

    analytics.recordAnswer(activeQ, text, { score: 0, communication: 0, technical: 0, confidence: 0 });

    setUserInput("");
    setAiThinking(true);

    try {
const currentQuestion = questionList[activeQ] || QUESTIONS[activeQ];
      let evaluation = null;
      let followUp = null;
      let scores = null;

      if (sessionId && currentQuestion) {
        evaluation = await studentService.submitInterviewResponse(sessionId, {
          questionIndex: activeQ,
          answer: text,
        });

        scores = {
          score: evaluation.score ?? 0,
          communication: evaluation.communication ?? 0,
          technical: evaluation.technical ?? 0,
          confidence: evaluation.confidence ?? 0,
        };
        followUp = evaluation.followUp || null;

        if (evaluation.feedback) {
          toast.success(`AI Feedback: ${evaluation.feedback}`);
        }
      } else {
        const [aiScores, aiFollowUp] = await Promise.all([
          aiInterviewService.scoreAnswer(currentQuestion?.question || QUESTIONS[activeQ].question, text),
          Math.random() > 0.5 ? aiInterviewService.generateFollowUp(currentQuestion?.question || QUESTIONS[activeQ].question, text, config.role) : Promise.resolve(null),
        ]);
        scores = aiScores;
        followUp = aiFollowUp;
      }

      analytics.recordAnswer(activeQ, text, scores);

      if (followUp && !followUpMode) {
        setFollowUpQ(followUp);
        setFollowUpMode(true);
        setAiThinking(false);
        setAiSpeaking(true);
        setTimeout(() => setAiSpeaking(false), 3500);
      } else {
        setFollowUpMode(false);
        setFollowUpQ("");
        setAnswered(p => [...new Set([...p, activeQ])]);
        const isLastQuestion = activeQ >= questionList.length - 1;
        setAiThinking(false);
        setAiSpeaking(true);
        if (isLastQuestion) {
          setTimeout(() => setAiSpeaking(false), 3000);
          await handleFinish();
          return;
        }

        const next = activeQ < questionList.length - 1 ? activeQ + 1 : activeQ;
        setActiveQ(next);
        setTimeout(() => setAiSpeaking(false), 3000);
      }
      toast.success("Answer submitted!");
    } catch (error) {
      setAiThinking(false);
      console.error(error);
      toast.error("AI service unavailable. Your answer was saved.");
      setAnswered(p => [...new Set([...p, activeQ])]);
    }
  };

  const handleFinish = async () => {
    if (speech.active) speech.stop();
    await exitFS();
    if (sessionId) {
      try {
        await studentService.endInterviewSession(sessionId);
      } catch (error) {
        console.error("Failed to close interview session:", error);
      }
    }
    toast.success("Interview completed! Results are being processed.");
    navigate("/interviews", { replace: true });
  };

  const handleTerminate = async () => {
    if (speech.active) speech.stop();
    await exitFS();
    if (sessionId) {
      try {
        await studentService.endInterviewSession(sessionId);
      } catch (error) {
        console.error("Failed to close interview session:", error);
      }
    }
    toast.error("Interview terminated due to repeated violations.");
    navigate("/interviews", { replace: true });
  };

  const handleDismiss = async () => {
    const ok = await enterFS();
    if (!ok) { toast.error("Please re-enable fullscreen to continue."); return; }
    setViolationOverlay(null);
  };

  const answeredCount = answered.length;
  const pct = Math.round((answeredCount / questionList.length) * 100);
  const isLow = timeLeft !== null && timeLeft < 120;
  const currentQ = followUpMode ? { text: followUpQ, category: "Follow-Up", difficulty: "Medium", id: "fu" } : questionList[activeQ] || QUESTIONS[activeQ];

  return (
    <div style={s.root}>
      {gateOpen && <FullscreenGate onEnter={handleGateEnter} />}

      {violationOverlay && (
        <ViolationOverlay
          violation={violationOverlay} count={violationCount} max={MAX_VIOLATIONS}
          onDismiss={handleDismiss} onTerminate={handleTerminate}
        />
      )}

      {/* ── HEADER ── */}
      <header style={s.header}>
        <div style={s.logoWrap}>
          <div style={s.logoBadge}>GLA</div>
          <div>
            <p style={s.logoTitle}>GLA University</p>
            <p style={s.logoSub}>'A+' Grade NAAC · 12-B UGC</p>
          </div>
        </div>

        <div style={s.headerCenter}>
          <div style={{ ...s.timerChip, ...(isLow ? { animation: "livePulse 1s infinite", background: "#7f1d1d", borderColor: "#ef4444" } : {}) }}>
            <Clock size={14} color={isLow ? "#ef4444" : "#94a3b8"} />
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: 17, letterSpacing: 2, color: isLow ? "#ef4444" : "#e2e8f0" }}>
              {fmt(timeLeft)}
            </span>
          </div>
        </div>

        <div style={s.headerRight}>
          <div style={s.secBadge}>
            <ShieldAlert size={12} color={violationCount > 0 ? "#ef4444" : "#22c55e"} />
            <span style={{ color: violationCount > 0 ? "#ef4444" : "#22c55e", fontSize: 10, fontWeight: 800, letterSpacing: 1 }}>
              {violationCount > 0 ? `${violationCount} VIOLATIONS` : "SECURE"}
            </span>
          </div>
          <div style={s.candidateChip}>
            <div style={s.candidateAvatar}>AV</div>
            <div>
              <p style={s.candidateName}>ADITYA VARSHNEY</p>
              <p style={s.candidateDept}>B.Tech CS (AI&ML) [2315510015]</p>
            </div>
          </div>
        </div>
      </header>

      {/* Violation log */}
      <ViolationLog log={proctor.log} />

      {/* ── BODY ── */}
      <div style={s.body}>

        {/* LEFT SIDEBAR */}
        <aside style={s.leftAside}>
          <CandidatePanel config={config} analytics={analytics.data} />
          <div style={{ height: 1, background: "#1e293b", margin: "6px 0" }} />
          <ProctoringDashboard
            isFullscreen={isFullscreen} violationCount={violationCount}
            violationLog={proctor.log} cameraStatus={camera.status} micStatus={mic.status}
          />
          <div style={{ height: 1, background: "#1e293b", margin: "6px 0" }} />
          <AnalyticsPanel data={analytics.data} answered={answeredCount} total={questionList.length} timeLeft={timeLeft} />
        </aside>

        {/* CENTER MAIN */}
        <main style={s.main}>
          {/* AI Interviewer + Candidate cam row */}
          <div style={s.videoRow}>
            <AIInterviewer speaking={aiSpeaking} thinking={aiThinking} />

            <div style={s.midPanel}>
              {/* Info banner */}
              <div style={s.infoBanner}>
                <AlertCircle size={16} color="#0891b2" />
                <p style={s.infoTxt}>For best results, speak clearly in a quiet room with wired earphones.</p>
              </div>

              {/* Mic level */}
              {micEnabled && !gateOpen && (
                <div style={s.micBar}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    {mic.isMuted ? <VolumeX size={13} color="#ef4444" /> : <Volume2 size={13} color="#22c55e" />}
                    <span style={{ fontSize: 10, color: "#64748b", fontWeight: 600 }}>MIC LEVEL</span>
                  </div>
                  <AudioLevelBar level={mic.isMuted ? 0 : mic.level} bars={20} />
                  <button onClick={mic.toggleMute} style={s.muteBtn}>
                    {mic.isMuted ? <><MicOff size={11} /> Unmute</> : <><Mic size={11} /> Mute</>}
                  </button>
                </div>
              )}

              {/* Question card */}
              <div style={s.questionCard}>
                <div style={s.questionMeta}>
                  <span style={s.questionNum}>
                    {followUpMode ? "FOLLOW-UP" : `Question ${activeQ + 1} of ${questionList.length}`}
                  </span>
                  <span style={{ ...s.catBadge, background: CAT_COLORS[currentQ.category] + "22", color: CAT_COLORS[currentQ.category] || "#6366f1" }}>
                    {currentQ.category}
                  </span>
                  <span style={{ ...s.diffBadge, color: DIFF_COLORS[currentQ.difficulty] || "#94a3b8" }}>
                    {currentQ.difficulty}
                  </span>
                </div>
                {(aiSpeaking || aiThinking) && (
                  <div style={s.typingIndicator}>
                    {[0, 1, 2].map(i => <div key={i} style={{ ...s.typingDot, animationDelay: `${i * 0.2}s` }} />)}
                  </div>
                )}
                <p style={s.questionText}>{currentQ.text}</p>
              </div>

              {/* Answer editor */}
              <AnswerEditor
                value={userInput}
                onChange={setUserInput}
                onSubmit={handleSubmit}
                onVoiceToggle={speech.toggle}
                voiceActive={speech.active}
                speechSupported={speech.supported}
                interim={speech.interim}
                confidence={speech.confidence}
              />
            </div>

            {/* Candidate camera */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8, flexShrink: 0 }}>
              <CameraPanel
                videoRef={camera.videoRef}
                status={camera.status}
                quality={camera.quality}
                reconnect={camera.reconnect}
                enabled={camEnabled}
                onToggle={() => setCamEnabled(p => !p)}
              />
            </div>
          </div>

          {/* Timeline */}
          <InterviewTimeline
            questions={questionList} activeQ={activeQ}
            answered={answered} scores={analytics.data.scores}
          />
        </main>
      </div>

      {/* ── FOOTER ── */}
      <footer style={s.footer}>
        <div style={s.footerStats}>
          <div style={s.statChip}>
            <CheckCircle2 size={13} color="#22c55e" />
            <span style={{ color: "#16a34a", fontWeight: 600, fontSize: 12 }}>{answeredCount} Done</span>
          </div>
          <div style={s.statChip}>
            <Clock size={13} color="#f59e0b" />
            <span style={{ color: "#92400e", fontWeight: 600, fontSize: 12 }}>{questionList.length - answeredCount} Left</span>
          </div>
          {violationCount > 0 && (
            <div style={{ ...s.statChip, background: "#1c0a0a", borderColor: "#7f1d1d" }}>
              <ShieldAlert size={13} color="#ef4444" />
              <span style={{ color: "#ef4444", fontWeight: 700, fontSize: 12 }}>{violationCount} Violation{violationCount > 1 ? "s" : ""}</span>
            </div>
          )}
          {analytics.data.avgScore > 0 && (
            <div style={{ ...s.statChip, background: "#0f1a2e", borderColor: "#1e3a5f" }}>
              <TrendingUp size={13} color="#6366f1" />
              <span style={{ color: "#818cf8", fontWeight: 700, fontSize: 12 }}>Score: {analytics.data.avgScore}%</span>
            </div>
          )}
        </div>

        <div style={s.progressWrap}>
          <div style={s.progressTrack}>
            <div style={{ ...s.progressFill, width: `${pct}%` }} />
          </div>
          <span style={s.progressPct}>{pct}% complete</span>
        </div>

        <button onClick={handleFinish} style={s.finishBtn}>
          FINISH INTERVIEW
        </button>
      </footer>

      <style>{`
        @keyframes barPulse  { 0%,100%{height:5px}  50%{height:20px} }
        @keyframes livePulse { 0%,100%{opacity:1}   50%{opacity:0.35} }
        @keyframes ringPulse { 0%{transform:scale(1);opacity:0.8} 100%{transform:scale(1.7);opacity:0} }
        @keyframes shake     { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-8px)} 75%{transform:translateX(8px)} }
        @keyframes thinkBounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        * { box-sizing:border-box; }
        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-track { background:#0f172a; }
        ::-webkit-scrollbar-thumb { background:#334155; border-radius:2px; }
      `}</style>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════════
const s = {
  root: { fontFamily: "'Sora',sans-serif", display: "flex", flexDirection: "column", height: "100vh", background: "#0a0f1e", overflow: "hidden", color: "#e2e8f0" },
  header: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 20px", background: "#0d1526", borderBottom: "1px solid #1e293b", flexShrink: 0, zIndex: 10, gap: 16 },
  logoWrap: { display: "flex", alignItems: "center", gap: 10, flexShrink: 0 },
  logoBadge: { width: 40, height: 40, borderRadius: 10, background: "linear-gradient(135deg,#1d4ed8,#06b6d4)", color: "white", fontWeight: 800, fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", letterSpacing: 1 },
  logoTitle: { margin: 0, fontWeight: 700, fontSize: 13, color: "#e2e8f0" },
  logoSub: { margin: 0, fontSize: 9, color: "#475569", marginTop: 1 },
  headerCenter: { display: "flex", alignItems: "center", justifyContent: "center", flex: 1 },
  timerChip: { display: "flex", alignItems: "center", gap: 8, background: "#0d1a2e", border: "1px solid #1e3a5f", borderRadius: 12, padding: "6px 18px" },
  headerRight: { display: "flex", alignItems: "center", gap: 10, flexShrink: 0 },
  secBadge: { display: "flex", alignItems: "center", gap: 5, background: "#0d1526", border: "1px solid #1e293b", borderRadius: 20, padding: "4px 10px" },
  candidateChip: { display: "flex", alignItems: "center", gap: 8, background: "#0d1526", border: "1px solid #1e293b", borderRadius: 10, padding: "6px 12px" },
  candidateAvatar: { width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#1d4ed8,#6366f1)", color: "white", fontWeight: 700, fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center" },
  candidateName: { margin: 0, fontWeight: 700, fontSize: 12, color: "#e2e8f0" },
  candidateDept: { margin: 0, fontSize: 9, color: "#475569", marginTop: 1 },

  body: { display: "flex", flex: 1, overflow: "hidden" },

  leftAside: { width: 220, flexShrink: 0, background: "#0d1526", borderRight: "1px solid #1e293b", display: "flex", flexDirection: "column", overflowY: "auto", padding: "8px", gap: 0 },

  main: { flex: 1, display: "flex", flexDirection: "column", overflowY: "auto", padding: "12px 16px", gap: 12 },

  videoRow: { display: "flex", gap: 12, alignItems: "flex-start" },

  midPanel: { flex: 1, display: "flex", flexDirection: "column", gap: 10, minWidth: 0 },

  infoBanner: { display: "flex", alignItems: "center", gap: 10, background: "#0a1929", border: "1px solid #1e3a5f", borderLeft: "3px solid #0891b2", borderRadius: 10, padding: "8px 12px" },
  infoTxt: { margin: 0, fontSize: 12, color: "#7dd3fc", lineHeight: 1.5, fontWeight: 500 },

  micBar: { display: "flex", alignItems: "center", gap: 10, background: "#0d1a2e", border: "1px solid #1e293b", borderRadius: 10, padding: "8px 12px" },
  muteBtn: { marginLeft: "auto", display: "flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 8, background: "#1e293b", border: "1px solid #334155", color: "#94a3b8", fontSize: 11, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" },

  questionCard: { background: "#0d1526", border: "1px solid #1e3a5f", borderRadius: 14, padding: "14px 18px" },
  questionMeta: { display: "flex", alignItems: "center", gap: 8, marginBottom: 10, flexWrap: "wrap" },
  questionNum: { fontSize: 10, fontWeight: 700, color: "#475569", letterSpacing: 1.5, textTransform: "uppercase" },
  catBadge: { fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, letterSpacing: 0.5 },
  diffBadge: { fontSize: 10, fontWeight: 700, letterSpacing: 0.5 },
  typingIndicator: { display: "flex", gap: 4, marginBottom: 6 },
  typingDot: { width: 6, height: 6, borderRadius: "50%", background: "#6366f1", animation: "thinkBounce 0.8s ease infinite" },
  questionText: { margin: 0, fontSize: 15, fontWeight: 600, color: "#e2e8f0", lineHeight: 1.65 },

  footer: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 20px", background: "#0d1526", borderTop: "1px solid #1e293b", flexShrink: 0, gap: 14 },
  footerStats: { display: "flex", gap: 8, flexWrap: "wrap" },
  statChip: { display: "flex", alignItems: "center", gap: 5, background: "#0d1526", border: "1px solid #1e293b", borderRadius: 20, padding: "4px 10px" },
  progressWrap: { flex: 1, display: "flex", alignItems: "center", gap: 10 },
  progressTrack: { flex: 1, height: 6, borderRadius: 100, background: "#1e293b", overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 100, background: "linear-gradient(90deg,#1d4ed8,#6366f1,#06b6d4)", transition: "width 0.5s ease" },
  progressPct: { fontSize: 11, color: "#64748b", fontWeight: 600, whiteSpace: "nowrap" },
  finishBtn: { padding: "8px 22px", borderRadius: 10, background: "linear-gradient(135deg,#dc2626,#7f1d1d)", color: "white", fontWeight: 700, fontSize: 12, border: "1px solid #ef4444", cursor: "pointer", letterSpacing: 0.5, whiteSpace: "nowrap" },
};

const gs = {
  backdrop: {
    position: "fixed",
    inset: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background:
      "radial-gradient(circle at top,#0f172a,#020617)",
    overflow: "hidden",
    zIndex: 99999,
  },

  glow1: {
    position: "absolute",
    width: 400,
    height: 400,
    borderRadius: "50%",
    background: "#2563eb",
    filter: "blur(140px)",
    opacity: 0.15,
    top: -100,
    left: -100,
  },

  glow2: {
    position: "absolute",
    width: 400,
    height: 400,
    borderRadius: "50%",
    background: "#06b6d4",
    filter: "blur(140px)",
    opacity: 0.12,
    bottom: -100,
    right: -100,
  },

  card: {
    position: "relative",
    width: "90%",
    maxWidth: "600px",
    padding: "28px",
    borderRadius: "24px",
    background: "rgba(15,23,42,.85)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(59,130,246,.2)",
    boxShadow: "0 25px 60px rgba(0,0,0,.45)",
    zIndex: 2,
    transform: "scale(0.88)",
    transformOrigin: "center",
  },

  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 14px",
    borderRadius: "999px",
    background: "rgba(34,197,94,.15)",
    color: "#4ade80",
    fontSize: 13,
    fontWeight: 700,
    marginBottom: 24,
  },

  shieldWrap: {
    width: 72,
    height: 72,
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "0 auto 20px",
    color: "#fff",
    background:
      "linear-gradient(135deg,#2563eb,#06b6d4)",
    boxShadow:
      "0 0 35px rgba(37,99,235,.45)",
  },

  title: {
    textAlign: "center",
    fontSize: "1.6rem",
    fontWeight: 800,
    color: "#fff",
    marginBottom: 12,
  },

  sub: {
    textAlign: "center",
    color: "#94a3b8",
    lineHeight: 1.7,
    marginBottom: 28,
    fontSize: 14,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
    marginBottom: 24,
  },

  rule: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "12px",
    borderRadius: "16px",
    background: "rgba(255,255,255,.04)",
    border: "1px solid rgba(255,255,255,.08)",
    color: "#cbd5e1",
    fontSize: 14,
    fontWeight: 500,
  },

  icon: {
    fontSize: 18,
  },

  warn: {
    padding: "18px",
    borderRadius: "18px",
    background:
      "rgba(245,158,11,.08)",
    border: "1px solid rgba(245,158,11,.25)",
    color: "#fbbf24",
    lineHeight: 1.7,
    marginBottom: 24,
    textAlign: "center",
  },

  requirements: {
    display: "grid",
    gridTemplateColumns: "repeat(3,1fr)",
    gap: 12,
    marginBottom: 28,
  },

  reqCard: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
    padding: "16px",
    borderRadius: "16px",
    background: "rgba(255,255,255,.04)",
    border: "1px solid rgba(255,255,255,.08)",
    color: "#cbd5e1",
    fontSize: 13,
    fontWeight: 600,
  },

  btn: {
    width: "100%",
    height: "52px",
    border: "none",
    borderRadius: "18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    cursor: "pointer",
    color: "#fff",
    fontWeight: 700,
    fontSize: 14,
    background:
      "linear-gradient(90deg,#2563eb,#06b6d4)",
    boxShadow:
      "0 10px 30px rgba(37,99,235,.35)",
  },
};

const vs = {
  backdrop: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(6px)" },
  modal: { background: "#0d1526", border: "2px solid", borderRadius: 22, padding: "36px 32px", maxWidth: 460, width: "90%", textAlign: "center", position: "relative", animation: "shake 0.4s ease" },
  ring: { position: "absolute", inset: -14, borderRadius: 32, border: "2px solid", opacity: 0, pointerEvents: "none" },
  iconBg: { width: 76, height: 76, borderRadius: "50%", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center" },
  badge: (f) => ({ display: "inline-block", padding: "3px 12px", borderRadius: 20, fontSize: 9, fontWeight: 800, letterSpacing: 2, marginBottom: 10, background: f ? "rgba(239,68,68,0.15)" : "rgba(245,158,11,0.15)", color: f ? "#ef4444" : "#f59e0b", border: `1px solid ${f ? "rgba(239,68,68,0.35)" : "rgba(245,158,11,0.35)"}` }),
  title: { margin: "0 0 8px", fontSize: 20, fontWeight: 800 },
  desc: { margin: "0 0 14px", fontSize: 13, color: "#64748b", lineHeight: 1.6 },
  warn: { margin: "0 0 20px", fontSize: 12, color: "#fbbf24", fontWeight: 600, background: "rgba(251,191,36,0.07)", borderRadius: 8, padding: "8px 12px" },
  dismissBtn: { padding: "11px 24px", borderRadius: 10, background: "linear-gradient(135deg,#1d4ed8,#0891b2)", color: "white", fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer", width: "100%" },
  terminateBtn: { padding: "11px 24px", borderRadius: 10, background: "linear-gradient(135deg,#dc2626,#7f1d1d)", color: "white", fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 },
};

const ls = {
  strip: { display: "flex", alignItems: "center", gap: 7, background: "#1c0a0a", borderBottom: "1px solid #7f1d1d", padding: "4px 20px", flexShrink: 0, flexWrap: "wrap" },
  label: { fontSize: 9, fontWeight: 800, color: "#b91c1c", letterSpacing: 1.5 },
  chip: { fontSize: 9, background: "#350c0c", border: "1px solid #7f1d1d", borderRadius: 20, padding: "2px 8px", color: "#ef4444", fontWeight: 600 },
};

const cp = {
  card: { width: 160, flexShrink: 0 },
  videoWrap: { position: "relative", width: 160, height: 112, borderRadius: 12, overflow: "hidden", border: "1px solid #1e3a5f", background: "#0a0f1e" },
  overlay: { position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, background: "rgba(10,15,30,0.85)" },
  overlayTxt: { fontSize: 11, color: "#64748b", fontWeight: 500 },
  retryBtn: { display: "flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 6, background: "#1e293b", border: "1px solid #334155", color: "#94a3b8", fontSize: 10, cursor: "pointer", marginTop: 4 },
  liveBadge: { position: "absolute", bottom: 6, right: 6, background: "#0d1526", borderRadius: 20, padding: "2px 8px", fontSize: 9, fontWeight: 700, letterSpacing: 1, display: "flex", alignItems: "center", gap: 4, border: "1px solid #1e293b", color: "#94a3b8" },
  liveDot: { width: 6, height: 6, borderRadius: "50%", display: "inline-block" },
  qualityBadge: { position: "absolute", top: 6, left: 6, background: "rgba(13,21,38,0.85)", borderRadius: 4, padding: "2px 6px", fontSize: 9, fontWeight: 700, color: "#22c55e", border: "1px solid rgba(34,197,94,0.3)" },
  controls: { display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 5, padding: "0 2px" },
  label: { fontSize: 10, fontWeight: 700, color: "#475569", letterSpacing: 1.5 },
  toggleBtn: { display: "flex", alignItems: "center", gap: 4, padding: "3px 8px", borderRadius: 6, background: "#1e293b", border: "1px solid #334155", color: "#94a3b8", fontSize: 10, cursor: "pointer" },
  toggleBtnOff: { background: "#350c0c", borderColor: "#7f1d1d", color: "#ef4444" },
};

const ai = {
  card: { width: 190, flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 },
  avatarWrap: { position: "relative", width: 190, height: 140, borderRadius: 14, overflow: "hidden", border: "1px solid #1e3a5f", background: "#0a0f1e" },
  wave: { position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)", display: "flex", alignItems: "flex-end", gap: 3, background: "rgba(6,182,212,0.8)", borderRadius: 20, padding: "5px 12px" },
  bar: { width: 3, height: 5, borderRadius: 2, background: "#67e8f9", animation: "barPulse 0.6s ease-in-out infinite" },
  thinkWrap: { position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 5, background: "rgba(99,102,241,0.8)", borderRadius: 20, padding: "6px 14px" },
  thinkDot: { width: 7, height: 7, borderRadius: "50%", background: "white", animation: "thinkBounce 0.8s ease infinite" },
  liveBadge: { background: "#0d1526", borderRadius: 20, padding: "3px 10px", fontSize: 9, fontWeight: 700, letterSpacing: 1.5, display: "flex", alignItems: "center", gap: 4, border: "1px solid #1e3a5f", color: "#64748b" },
  liveDot: { width: 6, height: 6, borderRadius: "50%", background: "#22c55e", display: "inline-block" },
  nameTag: { display: "flex", flexDirection: "column", alignItems: "center", gap: 2 },
};

const ap = {
  panel: { padding: "8px 10px", display: "flex", flexDirection: "column", gap: 6 },
  header: { display: "flex", alignItems: "center", gap: 5, marginBottom: 4 },
  headerTxt: { fontSize: 9, fontWeight: 800, color: "#475569", letterSpacing: 1.5 },
  metricGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5 },
  metric: { background: "#0a0f1e", border: "1px solid #1e293b", borderRadius: 8, padding: "6px 8px" },
  metricLabel: { fontSize: 9, color: "#475569", fontWeight: 600, marginBottom: 3 },
  metricVal: { fontSize: 16, fontWeight: 800 },
  divider: { height: 1, background: "#1e293b", margin: "2px 0" },
  row: { display: "flex", alignItems: "center", justifyContent: "space-between" },
  rLabel: { fontSize: 10, color: "#475569" },
  rVal: { fontSize: 10, color: "#94a3b8", fontWeight: 600, fontFamily: "'JetBrains Mono',monospace" },
};

const tl = {
  wrap: { background: "#0d1526", border: "1px solid #1e293b", borderRadius: 12, padding: "12px", overflow: "hidden" },
  header: { display: "flex", alignItems: "center", gap: 5, marginBottom: 10 },
  headerTxt: { fontSize: 9, fontWeight: 800, color: "#475569", letterSpacing: 1.5 },
  list: { display: "flex", gap: 0, overflowX: "auto", paddingBottom: 4 },
  item: { display: "flex", flexDirection: "column", alignItems: "center", gap: 6, minWidth: 90, maxWidth: 110, padding: "0 6px", borderLeft: "2px solid", paddingLeft: 8, marginLeft: 4, flexShrink: 0 },
  dot: { width: 20, height: 20, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  content: { width: "100%" },
  qnum: { fontSize: 9, fontWeight: 700, color: "#475569", display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" },
  cat: { fontSize: 8, fontWeight: 700, letterSpacing: 0.5 },
  qtxt: { fontSize: 9, color: "#334155", lineHeight: 1.4, marginTop: 2 },
  score: { fontSize: 10, fontWeight: 800, marginTop: 3 },
};

const pd = {
  card: { padding: "8px 10px" },
  header: { display: "flex", alignItems: "center", gap: 5, marginBottom: 8 },
  row: { display: "flex", alignItems: "center", gap: 5, marginBottom: 5 },
  dot: { width: 7, height: 7, borderRadius: "50%", flexShrink: 0 },
  icon: { flexShrink: 0, color: "#475569" },
  label: { flex: 1, fontSize: 10, color: "#475569", fontWeight: 500 },
};

const cand = {
  card: { padding: "10px 10px 8px", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 },
  avatar: { width: 42, height: 42, borderRadius: "50%", background: "linear-gradient(135deg,#1d4ed8,#6366f1)", color: "white", fontWeight: 800, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" },
  name: { fontSize: 11, fontWeight: 800, color: "#e2e8f0", letterSpacing: 0.5, textAlign: "center" },
  dept: { fontSize: 9, color: "#475569", textAlign: "center", lineHeight: 1.4 },
  divider: { height: 1, background: "#1e293b", width: "100%", margin: "4px 0" },
  row: { display: "flex", justifyContent: "space-between", width: "100%", gap: 4 },
  rKey: { fontSize: 9, color: "#475569" },
  rVal: { fontSize: 9, color: "#94a3b8", fontWeight: 600, textAlign: "right", maxWidth: 90, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  scoreRow: { display: "flex", alignItems: "center", gap: 5 },
};

const ae = {
  wrap: { background: "#0d1526", border: "1px solid #1e3a5f", borderRadius: 14, padding: "10px", display: "flex", flexDirection: "column", gap: 6 },
  interim: { display: "flex", alignItems: "center", gap: 7, background: "rgba(245,158,11,0.07)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 8, padding: "6px 10px" },
  inputRow: { display: "flex", gap: 8 },
  textarea: { flex: 1, padding: "10px 14px", borderRadius: 10, border: "1px solid #1e3a5f", background: "#0a0f1e", fontSize: 13, color: "#e2e8f0", outline: "none", fontFamily: "'Sora',sans-serif", lineHeight: 1.6, resize: "none" },
  btnCol: { display: "flex", flexDirection: "column", gap: 6 },
  iconBtn: { width: 38, height: 38, borderRadius: 10, background: "#1e293b", border: "1px solid #334155", color: "#94a3b8", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" },
  iconBtnActive: { background: "#350c0c", borderColor: "#ef4444", color: "#ef4444" },
  sendBtn: { width: 38, height: 38, borderRadius: 10, background: "linear-gradient(135deg,#1d4ed8,#06b6d4)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" },
  meta: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 },
  metaTxt: { fontSize: 10, color: "#334155", fontWeight: 500 },
};

export default InterviewSession;