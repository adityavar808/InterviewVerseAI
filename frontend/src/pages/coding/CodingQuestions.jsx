import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import studentService from "../../services/studentApi";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../components/dashboard/LoadingSpinner";
import {
  Code2,
  Search,
  Filter,
  ArrowRight,
  Flame,
  TrendingUp,
  BookOpen,
  ChevronDown,
  Sparkles,
  X,
  Building2,
} from "lucide-react";



const stripHtmlTags = (str) => {
  if (!str) return "";
  return str.replace(/<[^>]*>/g, "");
};

const CodingQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const navigate = useNavigate();

  const categories = [
    "Arrays",
    "Strings",
    "Linked List",
    "Trees",
    "Graphs",
    "Dynamic Programming",
    "Backtracking",
    "System Design",
    "General",
  ];

  const difficulties = ["Easy", "Medium", "Hard"];

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setIsLoading(true);
        const response = await studentService.getCodingQuestions({
          limit: 100,
        });
        const loadedQuestions = Array.isArray(response)
          ? response
          : response?.data ?? [];
        setQuestions(loadedQuestions);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load coding questions",
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadQuestions();
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = questions;

    // Search filter
    if (search.trim()) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (q) =>
          q.title?.toLowerCase().includes(searchLower) ||
          q.description?.toLowerCase().includes(searchLower) ||
          q.tags?.some((tag) => tag.toLowerCase().includes(searchLower)) ||
          q.companies?.some((company) =>
            company.toLowerCase().includes(searchLower),
          ),
      );
    }

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter((q) => q.category === categoryFilter);
    }

    // Difficulty filter
    if (difficultyFilter !== "all") {
      filtered = filtered.filter((q) => q.difficulty === difficultyFilter);
    }

    // Sort
    if (sortBy === "recent") {
      filtered.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    } else if (sortBy === "popularity") {
      filtered.sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0));
    } else if (sortBy === "acceptance") {
      filtered.sort(
        (a, b) => (b.acceptanceRate || 0) - (a.acceptanceRate || 0),
      );
    }

    setFilteredQuestions(filtered);
  }, [questions, search, categoryFilter, difficultyFilter, sortBy]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-12">
          <LoadingSpinner label="Loading coding questions" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="rounded-[28px] border border-rose-400/20 bg-rose-400/10 p-6 text-rose-300">
          {error}
        </div>
      </DashboardLayout>
    );
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return {
          bg: "rgba(34,197,94,0.1)",
          border: "rgba(34,197,94,0.2)",
          text: "#4ade80",
        };
      case "Medium":
        return {
          bg: "rgba(251,146,60,0.1)",
          border: "rgba(251,146,60,0.2)",
          text: "#fb923c",
        };
      case "Hard":
        return {
          bg: "rgba(239,68,68,0.1)",
          border: "rgba(239,68,68,0.2)",
          text: "#f87171",
        };
      default:
        return {
          bg: "rgba(100,116,139,0.1)",
          border: "rgba(100,116,139,0.2)",
          text: "#94a3b8",
        };
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 pb-10 text-white">
        {/* HEADER */}
        <section className="relative overflow-hidden bg-white/[0.035] border border-white/10 backdrop-blur-xl rounded-3xl p-5">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-24 -left-16 h-72 w-72 rounded-full bg-cyan-500/[0.06] blur-[60px]" />
            <div className="absolute bottom-0 right-0 h-48 w-48 rounded-full bg-purple-500/[0.04] blur-[50px]" />
            <div className="absolute top-0 left-0 right-0 h-[2px] rounded-full"
                 style={{ background: "linear-gradient(90deg, rgba(6,182,212,0.45), rgba(139,92,246,0.25), transparent)" }} />
          </div>

          <div className="relative flex flex-col gap-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-100">
                <Sparkles size={12} />
                Practice
              </div>
              <h1 className="mt-4 text-3xl font-semibold text-white leading-tight">
                Coding Questions
              </h1>
              <p className="mt-2 max-w-2xl text-xs leading-relaxed text-slate-400">
                Practice {questions.length} coding problems from various categories and difficulty levels. Master DSA, System Design, and more.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 hover:bg-white/[0.045] transition-all duration-300">
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-500">
                  Total Questions
                </p>
                <p className="mt-2.5 text-2xl font-bold text-white tracking-tight">
                  {questions.length}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 hover:bg-white/[0.045] transition-all duration-300">
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-500">
                  Easy Problems
                </p>
                <p className="mt-2.5 text-2xl font-bold text-white tracking-tight">
                  {questions.filter((q) => q.difficulty === "Easy").length}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 hover:bg-white/[0.045] transition-all duration-300">
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-500">
                  Hard Problems
                </p>
                <p className="mt-2.5 text-2xl font-bold text-white tracking-tight">
                  {questions.filter((q) => q.difficulty === "Hard").length}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FILTERS & SEARCH */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="space-y-4"
        >
          {/* Search Bar */}
          <div className="relative">
            <Search
              size={16}
              className="absolute left-4 top-4 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search by title, company, tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-white/10 bg-white/[0.03] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/40 focus:bg-white/[0.045] transition-all"
            />
          </div>

          {/* Filters */}
          <div className="grid gap-4 md:grid-cols-4">
            {/* Category Filter */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <label className="block text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400 mb-2">
                Category
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-white/10 bg-white/[0.05] text-xs font-semibold text-white focus:outline-none focus:border-cyan-400/40 focus:bg-white/[0.08] transition-all cursor-pointer hover:border-white/20"
              >
                <option value="all" className="bg-slate-950 text-white">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat} className="bg-slate-950 text-white">
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty Filter */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <label className="block text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400 mb-2">
                Difficulty
              </label>
              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-white/10 bg-white/[0.05] text-xs font-semibold text-white focus:outline-none focus:border-cyan-400/40 focus:bg-white/[0.08] transition-all cursor-pointer hover:border-white/20"
              >
                <option value="all" className="bg-slate-950 text-white">All Levels</option>
                {difficulties.map((diff) => (
                  <option key={diff} value={diff} className="bg-slate-950 text-white">
                    {diff}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <label className="block text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-white/10 bg-white/[0.05] text-xs font-semibold text-white focus:outline-none focus:border-cyan-400/40 focus:bg-white/[0.08] transition-all cursor-pointer hover:border-white/20"
              >
                <option value="recent" className="bg-slate-950 text-white">Recently Added</option>
                <option value="popularity" className="bg-slate-950 text-white">Most Attempted</option>
                <option value="acceptance" className="bg-slate-950 text-white">Highest Acceptance</option>
              </select>
            </div>

            {/* Results Count */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 flex flex-col justify-between">
              <label className="block text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400 mb-2">
                Results
              </label>
              <div className="px-3 py-2 rounded-xl border border-white/10 bg-white/[0.05] text-xs font-semibold text-cyan-300">
                {filteredQuestions.length} questions found
              </div>
            </div>
          </div>
        </motion.div>

        {/* QUESTIONS LIST */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="space-y-3"
        >
          {filteredQuestions.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-12 text-center">
              <Code2 size={40} className="mx-auto text-slate-600 mb-4" />
              <p className="text-slate-400 text-xs">
                No questions found matching your filters.
              </p>
            </div>
          ) : (
            filteredQuestions.map((question, index) => {
              const diffColors = getDifficultyColor(question.difficulty);
              return (
                <motion.div
                  key={question._id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.02 }}
                  onClick={() => setSelectedQuestion(question)}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 hover:bg-white/[0.045] hover:border-cyan-400/20 transition-all duration-300 cursor-pointer group"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* Left Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <Code2
                          size={18}
                          className="text-cyan-400 flex-shrink-0"
                        />
                        <h3 className="text-base font-semibold text-white group-hover:text-cyan-300 transition-colors">
                          {question.title}
                        </h3>
                      </div>

                      {question.description && (
                        <p className="text-xs text-slate-400 mb-3.5 line-clamp-2 leading-relaxed">
                          {stripHtmlTags(question.description)}
                        </p>
                      )}

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2.5">
                        {/* Difficulty */}
                        <span
                          className="text-[10px] px-2.5 py-0.5 rounded-md font-semibold uppercase tracking-wider"
                          style={{
                            background: diffColors.bg,
                            border: `1px solid ${diffColors.border}`,
                            color: diffColors.text,
                          }}
                        >
                          {question.difficulty || "Medium"}
                        </span>

                        {/* Category */}
                        <span
                          className="text-[10px] px-2.5 py-0.5 rounded-md font-semibold uppercase tracking-wider bg-cyan-500/10 border border-cyan-500/20 text-cyan-300"
                        >
                          {question.category || "General"}
                        </span>

                        {/* Companies */}
                        {question.companies?.length > 0 && (
                          <span className="text-[10px] px-2.5 py-0.5 rounded-md text-slate-400 bg-white/[0.04] border border-white/10">
                            Asked by {question.companies.slice(0, 2).join(", ")}
                            {question.companies.length > 2 &&
                              ` +${question.companies.length - 2}`}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Right Content */}
                    <div className="flex items-center gap-4 flex-shrink-0">
                      {/* Stats */}
                      <div className="hidden sm:flex items-center gap-6">
                        {question.acceptanceRate !== undefined && (
                          <div className="text-center">
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
                              Acceptance
                            </p>
                            <p className="text-xs font-semibold text-cyan-400">
                              {question.acceptanceRate}%
                            </p>
                          </div>
                        )}

                        {question.usageCount !== undefined && (
                          <div className="text-center">
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
                              Attempts
                            </p>
                            <p className="text-xs font-semibold text-slate-300">
                              {question.usageCount}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </motion.div>
      </div>

      {/* React Portal Modal for Question Details */}
      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {selectedQuestion && (
            <QuestionModal
              question={selectedQuestion}
              onClose={() => setSelectedQuestion(null)}
            />
          )}
        </AnimatePresence>,
        document.body
      )}
    </DashboardLayout>
  );
};

// Portal-rendered Modal for detailed preview
const QuestionModal = ({ question, onClose }) => {
  const [activeTab, setActiveTab] = useState("description");

  if (!question) return null;

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return {
          bg: "rgba(34,197,94,0.1)",
          border: "rgba(34,197,94,0.2)",
          text: "#4ade80",
        };
      case "Medium":
        return {
          bg: "rgba(251,146,60,0.1)",
          border: "rgba(251,146,60,0.2)",
          text: "#fb923c",
        };
      case "Hard":
        return {
          bg: "rgba(239,68,68,0.1)",
          border: "rgba(239,68,68,0.2)",
          text: "#f87171",
        };
      default:
        return {
          bg: "rgba(100,116,139,0.1)",
          border: "rgba(100,116,139,0.2)",
          text: "#94a3b8",
        };
    }
  };

  const diffColors = getDifficultyColor(question.difficulty);

  const handleSolve = () => {
    window.open(`/coding/${question._id}`, "_blank");
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      {/* Background glow orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 h-[350px] w-[350px] rounded-full bg-cyan-500/[0.04] blur-[80px]" />
        <div className="absolute bottom-1/4 right-1/4 h-[350px] w-[350px] rounded-full bg-purple-500/[0.03] blur-[80px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.2 }}
        className="relative max-w-2xl w-full max-h-[80vh] overflow-hidden bg-white/[0.035] border border-white/10 backdrop-blur-2xl rounded-3xl p-5 flex flex-col shadow-2xl"
      >
        {/* Top Glow Border */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{
            background:
              "linear-gradient(90deg, rgba(6,182,212,0.45), rgba(139,92,246,0.25), transparent)",
          }}
        />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 border border-white/10 hover:border-rose-500/30 hover:bg-rose-500/10 active:scale-[0.98] text-slate-400 hover:text-rose-400 transition-all cursor-pointer z-10"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="mb-6 flex-shrink-0 pr-8">
          <div className="flex items-center gap-3 mb-2">
            <span
              className="text-[10px] px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider"
              style={{
                background: diffColors.bg,
                border: `1px solid ${diffColors.border}`,
                color: diffColors.text,
              }}
            >
              {question.difficulty || "Medium"}
            </span>

            <span className="text-[10px] px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider bg-cyan-500/10 border border-cyan-500/20 text-cyan-300">
              {question.category || "General"}
            </span>
          </div>

          <h2 className="text-2xl font-bold text-white tracking-tight">
            {question.title}
          </h2>
        </div>

        {/* Tab Headers */}
        <div className="flex items-center gap-2 mb-5 bg-white/[0.03] border border-white/10 p-1.5 rounded-2xl flex-shrink-0">
          <button
            onClick={() => setActiveTab("description")}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all duration-200 ${
              activeTab === "description"
                ? "bg-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(34,211,238,0.25)]"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            Description
          </button>
          <button
            onClick={() => setActiveTab("companies")}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all duration-200 ${
              activeTab === "companies"
                ? "bg-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(34,211,238,0.25)]"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            Companies
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto pr-2 mb-6 min-h-0 text-slate-300 leading-relaxed text-sm custom-scrollbar-hide">
          {activeTab === "description" ? (
            <div className="space-y-4">
              {question.description ? (
                <div
                  className="problem-description-content"
                  dangerouslySetInnerHTML={{ __html: question.description }}
                />
              ) : (
                <p className="text-slate-500 italic text-sm">No description available.</p>
              )}

              {/* Constraints inside Description */}
              {question.constraints && (
                <div className="mt-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                    Constraints:
                  </h4>
                  <div className="space-y-2">
                    {question.constraints
                      .split("\n")
                      .filter(Boolean)
                      .map((c, idx) => (
                        <div
                          key={idx}
                          className="px-3 py-2 rounded-xl bg-white/[0.02] border border-white/5 text-xs font-mono text-slate-400"
                        >
                          {c}
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-xs text-slate-400 mb-4">
                This question has been asked in interviews at the following companies:
              </p>
              {question.companies && question.companies.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {question.companies.map((company, idx) => (
                    <div
                      key={idx}
                      className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 flex items-center gap-3 hover:bg-white/[0.05] transition-all group/company"
                    >
                      <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center group-hover/company:border-cyan-400/30 transition-all">
                        <Building2 className="text-cyan-400" size={18} />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold text-sm">
                          {company}
                        </h4>
                        <p className="text-[10px] text-slate-500">
                          Verified Interview Question
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
                  <Building2 size={32} className="mx-auto text-slate-600 mb-3" />
                  <p className="text-slate-500 text-xs italic">
                    No company tag details available yet.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-white/10 pt-5 flex-shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Sparkles size={14} className="text-cyan-400 animate-pulse" />
            AI Compiler Environment
          </div>

          <button
            onClick={handleSolve}
            className="flex items-center gap-1.5 px-6 py-3 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-semibold text-sm shadow-[0_0_20px_rgba(34,211,238,0.25)] hover:shadow-[0_0_25px_rgba(34,211,238,0.35)] active:scale-[0.98] transition-all duration-200 cursor-pointer"
          >
            Try Question
            <ArrowRight size={16} />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default CodingQuestions;

