import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import studentService from "../../services/studentApi";
import { updateUserCredits } from "../../redux/slices/authSlice";

import {
  X,
  Camera,
  CameraOff,
  Mic,
  MicOff,
  Brain,
  Clock3,
  Sparkles,
  Globe,
  AlertCircle,
  ChevronDown,
  Zap,
} from "lucide-react";

const difficulties = ["Easy", "Medium", "Hard"];
const durations = ["15 Min", "30 Min", "45 Min", "60 Min"];
const experiences = ["Fresher", "1-2 Years", "3+ Years"];
const languages = ["English", "Hindi", "Hinglish"];
const roles = [
  "Frontend Developer",
  "Backend Developer",
  "Data Analyst",
  "Machine Learning Engineer",
  "HR Interview",
  "System Design",
];

const InterviewSetupModal = ({ open, onClose, initialRole = "" }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user || {});
  const interviewCredits = user.interviewCredits ?? 10;
  
  // Form State Management
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("");
  const [selectedRole, setSelectedRole] = useState(initialRole || "");
  const [selectedExperience, setSelectedExperience] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  useEffect(() => {
    if (open && initialRole) {
      setSelectedRole(initialRole);
    }
  }, [open, initialRole]);

  // Camera & Mic State Management
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [mediaError, setMediaError] = useState("");
  const [isTestingMedia, setIsTestingMedia] = useState(false);

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Stop media stream tracks
  const stopMediaStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraOn(false);
    setIsMicOn(false);
  }, []);

  // Request & Enable Camera and Microphone
  const enableMedia = useCallback(async () => {
    setIsTestingMedia(true);
    setMediaError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "user" },
        audio: true,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }
      setIsCameraOn(true);
      setIsMicOn(true);
      toast.success("Camera and Microphone enabled successfully!");
    } catch (err) {
      console.error("Media permission error:", err);
      let errorMsg = "Unable to access camera or microphone.";
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        errorMsg = "Camera and microphone permissions were denied. Please allow access in browser settings.";
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        errorMsg = "No camera or microphone found on your device.";
      }
      setMediaError(errorMsg);
      toast.error(errorMsg);
      setIsCameraOn(false);
      setIsMicOn(false);
    } finally {
      setIsTestingMedia(false);
    }
  }, []);

  // Toggle Camera track
  const toggleCamera = async () => {
    if (!streamRef.current) {
      await enableMedia();
      return;
    }

    const videoTracks = streamRef.current.getVideoTracks();
    if (videoTracks.length === 0) {
      await enableMedia();
      return;
    }

    const newCamState = !isCameraOn;
    videoTracks.forEach((track) => {
      track.enabled = newCamState;
    });
    setIsCameraOn(newCamState);
    if (!newCamState && !isMicOn) {
      stopMediaStream();
    }
  };

  // Toggle Microphone track
  const toggleMic = async () => {
    if (!streamRef.current) {
      await enableMedia();
      return;
    }

    const audioTracks = streamRef.current.getAudioTracks();
    if (audioTracks.length === 0) {
      await enableMedia();
      return;
    }

    const newMicState = !isMicOn;
    audioTracks.forEach((track) => {
      track.enabled = newMicState;
    });
    setIsMicOn(newMicState);
    if (!newMicState && !isCameraOn) {
      stopMediaStream();
    }
  };

  // Cleanup stream when unmounting
  useEffect(() => {
    return () => {
      stopMediaStream();
    };
  }, [stopMediaStream]);

  const handleClose = () => {
    stopMediaStream();
    onClose();
  };

  if (!open) return null;

  // Handle form submission with MANDATORY Camera & Mic validation
  const handleStartInterview = async () => {
    if (interviewCredits < 1) {
      toast.error("Insufficient interview credits. You have 0 credits remaining.");
      return;
    }

    // Validation 1: All parameters selected
    if (
      !selectedDifficulty ||
      !selectedDuration ||
      !selectedRole ||
      !selectedExperience ||
      !selectedLanguage
    ) {
      toast.error("Please select all interview parameters");
      return;
    }

    // Validation 2: Camera and Microphone MUST be enabled
    if (!isCameraOn || !isMicOn) {
      toast.error("Please enable both camera and microphone before starting the interview.");
      if (!isCameraOn && !isMicOn && !mediaError) {
        enableMedia();
      }
      return;
    }

    try {
      setIsLoading(true);

      // Stop current setup stream so InterviewSession can claim hardware
      stopMediaStream();

      // Prepare interview configuration
      const interviewConfig = {
        difficulty: selectedDifficulty,
        duration: selectedDuration,
        role: selectedRole,
        experience: selectedExperience,
        language: selectedLanguage,
        startTime: new Date().toISOString(),
      };

      const response = await studentService.startAIInterview(interviewConfig);
      const sessionId = response?.sessionId;
      const questions = response?.questions || [];

      if (!sessionId) {
        throw new Error("Unable to create interview session");
      }

      const updatedCredits = response?.interviewCredits ?? interviewCredits;
      dispatch(updateUserCredits({ interviewCredits: updatedCredits }));

      navigate("/interview-session", {
        state: { config: interviewConfig, sessionId, questions },
      });

      onClose();
    } catch (error) {
      console.error(error);
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to start interview";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-[#020617]/80 backdrop-blur-md p-4
      "
    >
      {/* MODAL */}
      <div
        className="
          w-full max-w-3xl
          rounded-2xl p-6
          relative overflow-hidden
          animate-in fade-in zoom-in-95 duration-200
        "
        style={{
          background: "rgba(15,23,42,0.95)",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(24px)",
          boxShadow: "0 25px 80px rgba(0,0,0,0.45)",
        }}
      >
        {/* CYAN GLOW */}
        <div
          className="absolute pointer-events-none"
          style={{
            width: "300px",
            height: "300px",
            top: "-140px",
            right: "-80px",
            background:
              "radial-gradient(circle, rgba(6,182,212,0.13) 0%, transparent 70%)",
          }}
        />

        {/* PURPLE GLOW */}
        <div
          className="absolute pointer-events-none"
          style={{
            width: "260px",
            height: "260px",
            bottom: "-140px",
            left: "-80px",
            background:
              "radial-gradient(circle, rgba(139,92,246,0.11) 0%, transparent 70%)",
          }}
        />

        {/* HEADER */}
        <div className="flex items-start justify-between relative z-10">
          <div>
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-3"
              style={{
                background: "rgba(6,182,212,0.1)",
                border: "1px solid rgba(6,182,212,0.2)",
              }}
            >
              <Sparkles size={12} className="text-cyan-400" />
              <span
                className="text-cyan-400 font-mono uppercase tracking-widest"
                style={{ fontSize: "9px" }}
              >
                AI Interview Setup
              </span>
            </div>

            <h2 className="text-2xl font-bold text-white">Configure Session</h2>
            <p className="text-slate-400 mt-1.5 text-sm">
              Customize your AI-powered mock interview experience.
            </p>
            <div className={`mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold ${
              interviewCredits > 0
                ? "bg-cyan-500/10 border border-cyan-500/20 text-cyan-300"
                : "bg-red-500/10 border border-red-500/20 text-red-300"
            }`}>
              <Zap size={13} className={interviewCredits > 0 ? "text-cyan-400" : "text-red-400"} />
              <span>
                {interviewCredits > 0
                  ? `1 Interview Credit will be deducted upon completion (Remaining: ${interviewCredits})`
                  : "0 Interview Credits remaining. Please acquire more credits to proceed."}
              </span>
            </div>
          </div>

          {/* CLOSE */}
          <button
            onClick={handleClose}
            className="
              w-9 h-9 rounded-xl flex-shrink-0
              flex items-center justify-center
              bg-white/5 hover:bg-white/10
              border border-white/10 transition-all
            "
          >
            <X size={16} className="text-slate-300" />
          </button>
        </div>

        {/* MAIN GRID */}
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-20">
          {/* LEFT */}
          <div className="space-y-4">
            {/* DIFFICULTY */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Brain size={14} className="text-cyan-400" />
                <p className="text-xs font-semibold text-white">Difficulty</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                {difficulties.map((item) => (
                  <button
                    key={item}
                    onClick={() => setSelectedDifficulty(item)}
                    className={`
                      px-4 py-2 rounded-full text-xs font-medium
                      transition-all duration-200
                      ${
                        selectedDifficulty === item
                          ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-300"
                          : "bg-white/5 hover:bg-cyan-500/10 border-white/10 hover:border-cyan-500/25 text-slate-300"
                      }
                      border
                    `}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* ROLE */}
            <div className="relative">
              <p className="text-xs font-semibold text-white mb-2">
                Interview Role
              </p>
              <div className="relative" id="role-select-container">
                <button
                  type="button"
                  onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                  className="
                    w-full px-4 py-3 rounded-xl text-sm text-left
                    bg-white/5 border border-white/10 hover:border-cyan-500/25
                    text-white flex items-center justify-between
                    outline-none transition-all cursor-pointer
                  "
                  style={{
                    borderColor: isRoleDropdownOpen ? "rgba(6,182,212,0.5)" : "rgba(255,255,255,0.1)",
                    boxShadow: isRoleDropdownOpen ? "0 0 10px rgba(6,182,212,0.15)" : "none",
                  }}
                >
                  <span className={selectedRole ? "text-white" : "text-slate-400"}>
                    {selectedRole || "Select a role..."}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`text-slate-400 transition-transform duration-200 ${
                      isRoleDropdownOpen ? "rotate-180 text-cyan-400" : ""
                    }`}
                  />
                </button>

                {isRoleDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsRoleDropdownOpen(false)}
                    />
                    <div
                      className="
                        absolute z-50 left-0 right-0 mt-2
                        rounded-xl border border-white/10
                        bg-[#0f172a]
                        shadow-[0_15px_50px_rgba(0,0,0,0.6)]
                        max-h-60 overflow-y-auto py-1
                      "
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedRole("");
                          setIsRoleDropdownOpen(false);
                        }}
                        className="
                          w-full px-4 py-3 text-sm text-left
                          text-slate-400 hover:text-white hover:bg-white/5
                          transition-colors cursor-pointer block
                        "
                      >
                        Select a role...
                      </button>
                      {roles.map((role) => (
                        <button
                          key={role}
                          type="button"
                          onClick={() => {
                            setSelectedRole(role);
                            setIsRoleDropdownOpen(false);
                          }}
                          className={`
                            w-full px-4 py-3 text-sm text-left block transition-all cursor-pointer
                            ${
                              selectedRole === role
                                ? "bg-cyan-500/20 text-cyan-300 font-medium"
                                : "text-slate-200 hover:text-white hover:bg-white/5"
                            }
                          `}
                        >
                          {role}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* EXPERIENCE */}
            <div>
              <p className="text-xs font-semibold text-white mb-2">
                Experience Level
              </p>
              <div className="space-y-2">
                {experiences.map((item) => (
                  <button
                    key={item}
                    onClick={() => setSelectedExperience(item)}
                    className={`
                      w-full text-left px-4 py-3 rounded-xl text-sm font-medium
                      border transition-all duration-200
                      ${
                        selectedExperience === item
                          ? "bg-cyan-500/20 border-cyan-500/50 text-white"
                          : "bg-white/5 hover:bg-white/8 border-white/10 text-slate-300"
                      }
                    `}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-4">
            {/* DURATION */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Clock3 size={14} className="text-violet-400" />
                <p className="text-xs font-semibold text-white">Duration</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                {durations.map((item) => (
                  <button
                    key={item}
                    onClick={() => setSelectedDuration(item)}
                    className={`
                      px-4 py-2 rounded-full text-xs font-medium
                      transition-all duration-200
                      ${
                        selectedDuration === item
                          ? "bg-violet-500/20 border-violet-500/50 text-violet-300"
                          : "bg-white/5 hover:bg-violet-500/10 border-white/10 hover:border-violet-500/25 text-slate-300"
                      }
                      border
                    `}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* LANGUAGE */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Globe size={14} className="text-emerald-400" />
                <p className="text-xs font-semibold text-white">
                  Interview Language
                </p>
              </div>
              <div className="flex gap-2 flex-wrap">
                {languages.map((item) => (
                  <button
                    key={item}
                    onClick={() => setSelectedLanguage(item)}
                    className={`
                      px-4 py-2 rounded-full text-xs font-medium
                      transition-all duration-200
                      ${
                        selectedLanguage === item
                          ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300"
                          : "bg-white/5 hover:bg-emerald-500/10 border-white/10 hover:border-emerald-500/25 text-slate-300"
                      }
                      border
                    `}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* CAMERA PREVIEW & MEDIA CONTROLS */}
            <div
              className={`rounded-2xl h-52 flex flex-col items-center justify-center relative overflow-hidden transition-all duration-300 border ${
                mediaError
                  ? "border-rose-500/40 bg-rose-500/5"
                  : isCameraOn && isMicOn
                  ? "border-emerald-500/40 bg-emerald-500/5"
                  : "border-white/10 bg-white/[0.03]"
              }`}
            >
              {/* Live Video Element */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                  isCameraOn ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
              />

              {/* Overlay when Camera is OFF */}
              {!isCameraOn ? (
                <div className="flex flex-col items-center justify-center p-5 text-center z-10">
                  <div className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-2.5 shadow-inner">
                    <CameraOff size={20} className="text-slate-400" />
                  </div>
                  <p className="text-slate-200 text-xs font-semibold">
                    {mediaError ? "Media Access Failed" : "Camera & Microphone Off"}
                  </p>
                  <p className="text-slate-400 text-[11px] mt-1 max-w-[230px] leading-relaxed">
                    {mediaError || "Camera & mic are required before entering the interview."}
                  </p>
                  <button
                    type="button"
                    onClick={enableMedia}
                    disabled={isTestingMedia}
                    className="mt-3.5 px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/20 active:scale-95"
                  >
                    {isTestingMedia ? (
                      <span>Requesting Access...</span>
                    ) : (
                      <>
                        <Sparkles size={13} className="text-cyan-400" />
                        <span>Enable Camera & Mic</span>
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <>
                  {/* Live Badge when Camera is ON */}
                  <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-300 font-medium">
                      Live Preview
                    </span>
                  </div>

                  {/* Media Controls Bar (Mic & Camera Toggles on Live Stream) */}
                  <div className="absolute bottom-3 left-0 right-0 z-20 flex items-center justify-center gap-2.5 px-3">
                    <button
                      type="button"
                      onClick={toggleMic}
                      title={isMicOn ? "Mute Microphone" : "Enable Microphone"}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center border backdrop-blur-md transition-all shadow-md cursor-pointer active:scale-95 ${
                        isMicOn
                          ? "bg-emerald-500/25 border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/40"
                          : "bg-rose-500/25 border-rose-500/50 text-rose-300 hover:bg-rose-500/40"
                      }`}
                    >
                      {isMicOn ? <Mic size={16} /> : <MicOff size={16} />}
                    </button>

                    <button
                      type="button"
                      onClick={toggleCamera}
                      title={isCameraOn ? "Turn Off Camera" : "Turn On Camera"}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center border backdrop-blur-md transition-all shadow-md cursor-pointer active:scale-95 ${
                        isCameraOn
                          ? "bg-emerald-500/25 border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/40"
                          : "bg-rose-500/25 border-rose-500/50 text-rose-300 hover:bg-rose-500/40"
                      }`}
                    >
                      {isCameraOn ? <Camera size={16} /> : <CameraOff size={16} />}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div
          className="
            mt-4 pt-4
            flex items-center justify-between gap-4
            relative z-10 flex-wrap
            border-t border-white/[0.06]
          "
        >
          {/* SESSION INFO */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="px-3 py-2 rounded-xl bg-white/5 border border-white/10">
              <p className="text-[10px] text-slate-500">AI Evaluation</p>
              <p className="text-emerald-400 font-semibold text-sm mt-0.5">
                Enabled
              </p>
            </div>

            <div className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isCameraOn && isMicOn ? "bg-emerald-400 animate-pulse" : "bg-rose-400"}`} />
              <div>
                <p className="text-[10px] text-slate-500">Media Hardware</p>
                <p className={`font-semibold text-xs mt-0.5 ${isCameraOn && isMicOn ? "text-emerald-400" : "text-rose-400"}`}>
                  {isCameraOn && isMicOn ? "Camera & Mic Ready" : "Media Required"}
                </p>
              </div>
            </div>
          </div>

          {/* BUTTONS */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="
                px-4 py-2.5 rounded-xl text-sm
                bg-white/5 hover:bg-white/10 disabled:opacity-50
                border border-white/10
                text-slate-300 transition-all font-medium cursor-pointer
              "
            >
              Cancel
            </button>
            <button
              onClick={handleStartInterview}
              disabled={isLoading}
              className={`
                px-6 py-2.5 rounded-xl
                font-semibold text-sm
                text-[#020617]
                transition-all cursor-pointer
                ${isLoading ? "opacity-75 cursor-not-allowed" : "hover:shadow-lg"}
              `}
              style={{
                background: isLoading
                  ? "linear-gradient(135deg, #059669, #047857)"
                  : "linear-gradient(135deg, #06b6d4, #0891b2)",
                boxShadow: isLoading
                  ? "0 0 15px rgba(5,150,105,0.2)"
                  : "0 0 20px rgba(6,182,212,0.25)",
              }}
            >
              {isLoading ? "Starting..." : "Start Interview"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewSetupModal;
