import React, { memo } from "react";
import { Mic, MicOff, Send, Radio, RotateCcw, Volume2, VolumeX, Sparkles, ShieldCheck } from "lucide-react";

/**
 * VoiceAnswerPanel — Enforces Voice-Only Answers for non-coding questions.
 * Features real-time transcript visualization, microphone level meters,
 * waveform animations, and voice answer submission.
 */
const VoiceAnswerPanel = memo(({
  value,
  onChange,
  onSubmit,
  onVoiceToggle,
  voiceActive,
  speechSupported,
  interim,
  confidence,
  micLevel = 0,
  isMuted = false,
  onMuteToggle,
}) => {
  const combinedText = (value + (interim ? " " + interim : "")).trim();
  const wordCount = combinedText ? combinedText.split(/\s+/).length : 0;
  const charCount = combinedText.length;

  const handleClear = () => {
    onChange("");
  };

  return (
    <div style={styles.container}>
      {/* Top Header Badge */}
      <div style={styles.headerRow}>
        <div style={styles.voiceOnlyBadge}>
          <Radio size={14} className="animate-pulse" color="#ef4444" />
          <span style={styles.badgeText}>VOICE-ONLY ANSWER MODE</span>
        </div>
        <div style={styles.statusChip}>
          {speechSupported ? (
            <span style={{ color: "#22c55e", fontSize: 11, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
              <ShieldCheck size={13} /> Mic Ready
            </span>
          ) : (
            <span style={{ color: "#f59e0b", fontSize: 11, fontWeight: 600 }}>Speech API Polyfill</span>
          )}
        </div>
      </div>

      {/* Mic Active & Decibel Level Indicator Bar */}
      <div style={styles.audioMeterBar}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={onMuteToggle} style={styles.muteToggleBtn} title={isMuted ? "Unmute Mic" : "Mute Mic"}>
            {isMuted ? <VolumeX size={14} color="#ef4444" /> : <Volume2 size={14} color="#22c55e" />}
          </button>
          <span style={styles.audioLabel}>
            {isMuted ? "MICROPHONE MUTED" : voiceActive ? "LISTENING TO VOICE..." : "MICROPHONE STANDBY"}
          </span>
        </div>

        {/* Audio Visualizer Wave */}
        <div style={styles.waveContainer}>
          {Array.from({ length: 14 }).map((_, i) => {
            const isLit = !isMuted && voiceActive && Math.random() < (micLevel * 2 + 0.3);
            const height = isLit ? Math.max(6, Math.floor(Math.random() * 22 + 4)) : 4;
            return (
              <div
                key={i}
                style={{
                  width: 3,
                  height: height,
                  borderRadius: 2,
                  background: isLit ? (i > 10 ? "#ef4444" : i > 7 ? "#f59e0b" : "#06b6d4") : "#1e293b",
                  transition: "height 0.1s ease, background 0.1s ease",
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Main Voice Response Display Box */}
      <div style={styles.transcriptBox}>
        {combinedText ? (
          <div style={styles.transcriptText}>
            {value}
            {interim && <span style={styles.interimText}> {interim}</span>}
          </div>
        ) : (
          <div style={styles.placeholderState}>
            <Mic size={32} color={voiceActive ? "#ef4444" : "#475569"} style={{ marginBottom: 8 }} />
            <p style={styles.placeholderTitle}>
              {voiceActive ? "Listening... Speak your answer now." : "Click 'Start Speaking' below to answer by voice."}
            </p>
            <p style={styles.placeholderSub}>
              Text typing is disabled for verbal questions. Your spoken words will be transcribed in real time.
            </p>
          </div>
        )}

        {/* Interim Confidence Indicator */}
        {confidence > 0 && voiceActive && (
          <div style={styles.confidenceTag}>
            <Sparkles size={11} color="#06b6d4" />
            <span>Voice Confidence: {Math.round(confidence * 100)}%</span>
          </div>
        )}
      </div>

      {/* Voice Control Buttons & Submissions */}
      <div style={styles.controlsRow}>
        <div style={styles.statsCol}>
          <span style={styles.statText}>{wordCount} Words Spoken</span>
          <span style={styles.statDot}>•</span>
          <span style={styles.statText}>{charCount} Characters</span>
        </div>

        <div style={styles.buttonsCol}>
          {/* Clear / Reset Voice */}
          {value && (
            <button onClick={handleClear} style={styles.clearBtn} title="Clear Spoken Answer">
              <RotateCcw size={14} /> Clear
            </button>
          )}

          {/* Record / Pause Toggle */}
          <button
            onClick={onVoiceToggle}
            style={{
              ...styles.recordBtn,
              ...(voiceActive ? styles.recordBtnActive : {}),
            }}
          >
            {voiceActive ? (
              <>
                <MicOff size={16} />
                <span>Pause Recording</span>
              </>
            ) : (
              <>
                <Mic size={16} />
                <span>{value ? "Continue Speaking" : "Start Speaking Answer"}</span>
              </>
            )}
          </button>

          {/* Submit Spoken Answer */}
          <button
            onClick={onSubmit}
            disabled={!combinedText}
            style={{
              ...styles.submitBtn,
              ...(!combinedText ? styles.submitBtnDisabled : {}),
            }}
          >
            <Send size={15} color="white" />
            <span>Submit Voice Answer</span>
          </button>
        </div>
      </div>
    </div>
  );
});

const styles = {
  container: {
    background: "#0d1526",
    border: "1px solid #1e3a5f",
    borderRadius: 16,
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: 12,
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
  },
  headerRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  voiceOnlyBadge: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "rgba(239, 68, 68, 0.12)",
    border: "1px solid rgba(239, 68, 68, 0.3)",
    padding: "4px 12px",
    borderRadius: 20,
  },
  badgeText: {
    color: "#f87171",
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: 1,
  },
  statusChip: {
    background: "#0a0f1e",
    border: "1px solid #1e293b",
    padding: "4px 10px",
    borderRadius: 12,
  },
  audioMeterBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "#0a0f1e",
    border: "1px solid #1e293b",
    borderRadius: 10,
    padding: "8px 12px",
  },
  muteToggleBtn: {
    background: "#1e293b",
    border: "1px solid #334155",
    borderRadius: 6,
    padding: "4px 8px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  audioLabel: {
    fontSize: 10,
    fontWeight: 700,
    color: "#64748b",
    letterSpacing: 1,
  },
  waveContainer: {
    display: "flex",
    alignItems: "flex-end",
    gap: 3,
    height: 24,
  },
  transcriptBox: {
    position: "relative",
    minHeight: 120,
    maxHeight: 220,
    overflowY: "auto",
    background: "#0a0f1e",
    border: "1px solid #1e3a5f",
    borderRadius: 12,
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  transcriptText: {
    fontSize: 14,
    color: "#e2e8f0",
    lineHeight: 1.7,
    fontWeight: 500,
    whiteSpace: "pre-wrap",
  },
  interimText: {
    color: "#f59e0b",
    fontStyle: "italic",
  },
  placeholderState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    padding: "12px 0",
  },
  placeholderTitle: {
    margin: 0,
    fontSize: 13,
    fontWeight: 600,
    color: "#94a3b8",
  },
  placeholderSub: {
    margin: "4px 0 0",
    fontSize: 11,
    color: "#475569",
    maxWidth: 420,
  },
  confidenceTag: {
    position: "absolute",
    bottom: 8,
    right: 12,
    display: "flex",
    alignItems: "center",
    gap: 4,
    fontSize: 10,
    color: "#06b6d4",
    background: "rgba(6, 182, 212, 0.1)",
    padding: "2px 8px",
    borderRadius: 6,
  },
  controlsRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 12,
  },
  statsCol: {
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  statText: {
    fontSize: 11,
    color: "#64748b",
    fontWeight: 600,
  },
  statDot: {
    color: "#334155",
  },
  buttonsCol: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  clearBtn: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    padding: "8px 14px",
    borderRadius: 10,
    background: "#1e293b",
    border: "1px solid #334155",
    color: "#94a3b8",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
  },
  recordBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "9px 18px",
    borderRadius: 10,
    background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
    border: "none",
    color: "white",
    fontSize: 12,
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
    transition: "all 0.2s ease",
  },
  recordBtnActive: {
    background: "linear-gradient(135deg, #dc2626, #991b1b)",
    boxShadow: "0 4px 12px rgba(220, 38, 38, 0.4)",
  },
  submitBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "9px 18px",
    borderRadius: 10,
    background: "linear-gradient(135deg, #10b981, #059669)",
    border: "none",
    color: "white",
    fontSize: 12,
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
    transition: "all 0.2s ease",
  },
  submitBtnDisabled: {
    opacity: 0.4,
    cursor: "not-allowed",
    boxShadow: "none",
  },
};

export default VoiceAnswerPanel;
