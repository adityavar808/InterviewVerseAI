import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Clock,
  BarChart3,
  FileText,
  RotateCcw,
  Play,
  Loader,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";

const InterviewHistory = () => {
  const [interviews, setInterviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadInterviews = async () => {
      try {
        setIsLoading(true);
        // TODO: Replace with actual API call
        // const response = await studentService.getInterviewHistory();
        
        // Mock data for now
        const mockData = [
          {
            id: 1,
            role: "Frontend Developer",
            score: 82,
            duration: "25 mins",
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleDateString(),
            status: "Completed",
            difficulty: "Medium",
            tags: ["React", "JavaScript", "System Design"],
          },
          {
            id: 2,
            role: "Backend Developer",
            score: 76,
            duration: "30 mins",
            date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toLocaleDateString(),
            status: "Completed",
            difficulty: "Hard",
            tags: ["Node.js", "APIs", "Database Design"],
          },
          {
            id: 3,
            role: "Full Stack Developer",
            score: 88,
            duration: "45 mins",
            date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toLocaleDateString(),
            status: "Completed",
            difficulty: "Advanced",
            tags: ["React", "Node.js", "System Design"],
          },
        ];

        setInterviews(mockData);
      } catch (err) {
        setError("Failed to load interview history");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadInterviews();
  }, []);

  const getScoreColor = (score) => {
    if (score >= 85) return { bg: "rgba(34,197,94,0.1)", text: "#4ade80", label: "Excellent" };
    if (score >= 75) return { bg: "rgba(251,146,60,0.1)", text: "#fb923c", label: "Good" };
    if (score >= 65) return { bg: "rgba(245,158,11,0.1)", text: "#fbbf24", label: "Fair" };
    return { bg: "rgba(239,68,68,0.1)", text: "#f87171", label: "Needs Improvement" };
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return { bg: "rgba(34,197,94,0.1)", border: "rgba(34,197,94,0.2)", text: "#4ade80" };
      case "Medium":
        return { bg: "rgba(251,146,60,0.1)", border: "rgba(251,146,60,0.2)", text: "#fb923c" };
      case "Hard":
        return { bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.2)", text: "#f87171" };
      case "Advanced":
        return { bg: "rgba(139,92,246,0.1)", border: "rgba(139,92,246,0.2)", text: "#a78bfa" };
      default:
        return { bg: "rgba(100,116,139,0.1)", border: "rgba(100,116,139,0.2)", text: "#94a3b8" };
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-3xl p-6" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="flex items-center justify-center py-12">
          <Loader size={24} className="text-cyan-400 animate-spin mr-3" />
          <p className="text-slate-400">Loading interview history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl p-6" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
        <div className="flex items-center gap-3">
          <AlertCircle size={20} className="text-red-400 flex-shrink-0" />
          <div>
            <p className="text-red-300 font-medium">Error Loading History</p>
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (interviews.length === 0) {
    return (
      <div className="rounded-3xl p-12 text-center" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
        <FileText size={48} className="text-slate-500 mx-auto mb-4 opacity-50" />
        <p className="text-slate-400 text-lg mb-2">No interviews yet</p>
        <p className="text-slate-500">Start your first AI interview to see your progress here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {interviews.map((interview, index) => {
        const scoreColor = getScoreColor(interview.score);
        const diffColor = getDifficultyColor(interview.difficulty);

        return (
          <motion.div
            key={interview.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="rounded-2xl p-5 hover:shadow-lg transition-all"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* LEFT - Details */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-white font-semibold text-lg">{interview.role}</h3>
                  <div
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                      background: diffColor.bg,
                      border: `1px solid ${diffColor.border}`,
                      color: diffColor.text,
                    }}
                  >
                    {interview.difficulty}
                  </div>
                </div>

                <p className="text-slate-400 text-sm mb-3">
                  {interview.tags?.join(" • ")}
                </p>

                <div className="flex flex-wrap gap-3 text-xs text-slate-400">
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    {interview.duration}
                  </div>
                  <span>•</span>
                  <div>{interview.date}</div>
                </div>
              </div>

              {/* RIGHT - Score & Actions */}
              <div className="flex items-center gap-4 md:flex-col md:items-end">
                {/* Score */}
                <div className="flex flex-col items-center">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center relative"
                    style={{
                      background: scoreColor.bg,
                      border: `2px solid ${scoreColor.text}`,
                    }}
                  >
                    <div className="text-center">
                      <p className="text-2xl font-bold" style={{ color: scoreColor.text }}>
                        {interview.score}
                      </p>
                      <p className="text-[10px] text-slate-400">Score</p>
                    </div>
                  </div>
                  <p className="text-xs mt-2 font-medium" style={{ color: scoreColor.text }}>
                    {scoreColor.label}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    className="w-10 h-10 rounded-lg flex items-center justify-center transition-all"
                    style={{
                      background: "rgba(6,182,212,0.1)",
                      border: "1px solid rgba(6,182,212,0.2)",
                      color: "#06b6d4",
                    }}
                    title="View Results"
                  >
                    <BarChart3 size={16} />
                  </button>
                  <button
                    className="w-10 h-10 rounded-lg flex items-center justify-center transition-all"
                    style={{
                      background: "rgba(139,92,246,0.1)",
                      border: "1px solid rgba(139,92,246,0.2)",
                      color: "#a78bfa",
                    }}
                    title="Reattempt"
                  >
                    <RotateCcw size={16} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default InterviewHistory;
