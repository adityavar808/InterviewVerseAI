import React from "react";
import { Code, ChevronDown } from "lucide-react";

export const SUPPORTED_LANGUAGES = [
  { id: "javascript", label: "JavaScript (Node.js)", monaco: "javascript", icon: "JS", color: "#f7df1e" },
  { id: "python", label: "Python 3", monaco: "python", icon: "PY", color: "#387eb8" },
  { id: "java", label: "Java 17", monaco: "java", icon: "JV", color: "#e76f00" },
  { id: "c", label: "C (GCC)", monaco: "c", icon: "C", color: "#555555" },
  { id: "cpp", label: "C++ (G++ 20)", monaco: "cpp", icon: "C++", color: "#00599c" },
  { id: "sql", label: "SQL (PostgreSQL/MySQL)", monaco: "sql", icon: "SQL", color: "#336791" },
  { id: "go", label: "Go (Golang)", monaco: "go", icon: "GO", color: "#00add8" },
  { id: "rust", label: "Rust 1.70", monaco: "rust", icon: "RS", color: "#dea584" },
  { id: "typescript", label: "TypeScript", monaco: "typescript", icon: "TS", color: "#3178c6" },
];

const LanguageSelector = ({ selectedLanguage, onChange }) => {
  const currentLang = SUPPORTED_LANGUAGES.find((l) => l.id === selectedLanguage) || SUPPORTED_LANGUAGES[0];

  return (
    <div style={styles.wrap}>
      <div style={styles.iconBox}>
        <span style={{ color: currentLang.color, fontWeight: 800, fontSize: 10, fontFamily: "monospace" }}>
          {currentLang.icon}
        </span>
      </div>
      <div style={styles.selectWrap}>
        <select
          value={selectedLanguage}
          onChange={(e) => onChange(e.target.value)}
          style={styles.select}
        >
          {SUPPORTED_LANGUAGES.map((lang) => (
            <option key={lang.id} value={lang.id} style={styles.option}>
              {lang.label}
            </option>
          ))}
        </select>
        <ChevronDown size={14} style={styles.chevron} />
      </div>
    </div>
  );
};

const styles = {
  wrap: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    background: "rgba(15, 23, 42, 0.8)",
    border: "1px solid rgba(59, 130, 246, 0.3)",
    borderRadius: 10,
    padding: "3px 8px",
  },
  iconBox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    background: "#0f172a",
    border: "1px solid #1e293b",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  selectWrap: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  select: {
    appearance: "none",
    background: "transparent",
    border: "none",
    color: "#e2e8f0",
    fontSize: 12,
    fontWeight: 600,
    paddingRight: 20,
    cursor: "pointer",
    outline: "none",
    fontFamily: "'Sora', sans-serif",
  },
  chevron: {
    position: "absolute",
    right: 2,
    pointerEvents: "none",
    color: "#94a3b8",
  },
  option: {
    background: "#0f172a",
    color: "#e2e8f0",
    fontSize: 12,
    padding: "8px",
  },
};

export default LanguageSelector;
