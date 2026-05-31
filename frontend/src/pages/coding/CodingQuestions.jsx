import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import studentService from "../../services/studentApi";
import { motion } from "framer-motion";
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
} from "lucide-react";

const CodingQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

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
      <div className="space-y-8">
        {/* HEADER */}
        <section className="rounded-[32px] border border-white/10 bg-[linear-gradient(135deg,rgba(6,182,212,0.16),rgba(15,23,42,0.82),rgba(99,102,241,0.08))] p-8">
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.24em] text-cyan-300">
                Practice
              </p>
              <h1 className="mt-3 text-4xl font-bold text-white">
                Coding Questions
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
                Practice {questions.length} coding problems from various
                categories and difficulty levels. Master DSA, System Design, and
                more.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Total Questions
                </p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  {questions.length}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Easy Problems
                </p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  {questions.filter((q) => q.difficulty === "Easy").length}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Hard Problems
                </p>
                <p className="mt-2 text-2xl font-semibold text-white">
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
              size={18}
              className="absolute left-4 top-3.5 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search by title, company, tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-white/10 bg-white/5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/50 focus:bg-white/8 transition-all"
            />
          </div>

          {/* Filters */}
          <div className="grid gap-4 md:grid-cols-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm text-slate-400 mb-2">
                Category
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-white focus:outline-none focus:border-cyan-400/50 focus:bg-white/8 transition-all appearance-none cursor-pointer"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty Filter */}
            <div>
              <label className="block text-sm text-slate-400 mb-2">
                Difficulty
              </label>
              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-white focus:outline-none focus:border-cyan-400/50 focus:bg-white/8 transition-all appearance-none cursor-pointer"
              >
                <option value="all">All Levels</option>
                {difficulties.map((diff) => (
                  <option key={diff} value={diff}>
                    {diff}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm text-slate-400 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-white focus:outline-none focus:border-cyan-400/50 focus:bg-white/8 transition-all appearance-none cursor-pointer"
              >
                <option value="recent">Recently Added</option>
                <option value="popularity">Most Attempted</option>
                <option value="acceptance">Highest Acceptance</option>
              </select>
            </div>

            {/* Results Count */}
            <div>
              <label className="block text-sm text-slate-400 mb-2">
                Results
              </label>
              <div className="px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-white">
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
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-12 text-center">
              <Code2 size={48} className="mx-auto text-slate-600 mb-4" />
              <p className="text-slate-400">
                No questions found matching your filters.
              </p>
            </div>
          ) : (
            filteredQuestions.map((question, index) => (
              <motion.div
                key={question._id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.02 }}
                className="rounded-[20px] border border-white/10 bg-white/5 p-5 hover:bg-white/8 hover:border-cyan-400/20 transition-all cursor-pointer group"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  {/* Left Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <Code2
                        size={18}
                        className="text-cyan-400 flex-shrink-0"
                      />
                      <h3 className="text-lg font-semibold text-white group-hover:text-cyan-300 transition-colors">
                        {question.title}
                      </h3>
                    </div>

                    {question.description && (
                      <p className="text-sm text-slate-400 mb-3 line-clamp-2">
                        {question.description}
                      </p>
                    )}

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {/* Difficulty */}
                      <span
                        className="text-xs px-2.5 py-1 rounded-md font-medium"
                        style={{
                          background: getDifficultyColor(question.difficulty)
                            .bg,
                          border: `1px solid ${
                            getDifficultyColor(question.difficulty).border
                          }`,
                          color: getDifficultyColor(question.difficulty).text,
                        }}
                      >
                        {question.difficulty || "Medium"}
                      </span>

                      {/* Category */}
                      <span
                        className="text-xs px-2.5 py-1 rounded-md font-medium"
                        style={{
                          background: "rgba(6,182,212,0.1)",
                          border: "1px solid rgba(6,182,212,0.2)",
                          color: "#22d3ee",
                        }}
                      >
                        {question.category || "General"}
                      </span>

                      {/* Companies */}
                      {question.companies?.length > 0 && (
                        <span className="text-xs px-2.5 py-1 rounded-md text-slate-400 bg-white/5 border border-white/10">
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
                          <p className="text-xs text-slate-500 mb-1">
                            Acceptance
                          </p>
                          <p className="text-sm font-semibold text-cyan-400">
                            {question.acceptanceRate}%
                          </p>
                        </div>
                      )}

                      {question.usageCount !== undefined && (
                        <div className="text-center">
                          <p className="text-xs text-slate-500 mb-1">
                            Attempts
                          </p>
                          <p className="text-sm font-semibold text-slate-300">
                            {question.usageCount}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() =>
                        navigate(`/coding/${question._id}`, {
                          state: {
                            question,
                          },
                        })
                      }
                      className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-white group-hover:scale-105 transition-transform"
                      style={{
                        background: "rgba(6,182,212,0.15)",
                        border: "1px solid rgba(6,182,212,0.3)",
                        color: "#22d3ee",
                      }}
                    >
                      Solve
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default CodingQuestions;
