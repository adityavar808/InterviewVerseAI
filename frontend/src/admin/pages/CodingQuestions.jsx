import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Code2, Eye, FileCode2, Plus, Rocket, Trash2, X, Sparkles, FlaskConical } from "lucide-react";

import StatsCard from "../components/ui/StatsCard";
import SearchBar from "../components/ui/SearchBar";
import StatusBadge from "../components/ui/StatusBadge";
import CodingQuestionForm from "../components/Forms/CodingQuestionForm";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { adminService } from "../services/adminApi";
import { formatCompactNumber, formatDateTime } from "../utils/adminHelpers";

const CodingQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [meta, setMeta] = useState(null);
  const [overview, setOverview] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [previewItem, setPreviewItem] = useState(null);
  const [testCaseManagingItem, setTestCaseManagingItem] = useState(null);
  const [tempTestCases, setTempTestCases] = useState([]);
  const [newInput, setNewInput] = useState("");
  const [newExpectedOutput, setNewExpectedOutput] = useState("");
  const [newIsSample, setNewIsSample] = useState(false);
  const [isSavingTestCases, setIsSavingTestCases] = useState(false);

  useEffect(() => {
    if (testCaseManagingItem) {
      setTempTestCases(testCaseManagingItem.testCases || []);
      setNewInput("");
      setNewExpectedOutput("");
      setNewIsSample(false);
    }
  }, [testCaseManagingItem]);

  const loadQuestions = async () => {
    try {
      setIsLoading(true);

      const [response, dashboard] = await Promise.all([
        adminService.getCodingQuestions({
          search,
          status: statusFilter,
          category: categoryFilter,
          difficulty: difficultyFilter,
          page,
          limit: 8,
        }),
        adminService.getDashboard(),
      ]);

      setQuestions(response.data);
      setMeta(response.meta);
      setOverview(dashboard.data.overview);
    } catch (requestError) {
      toast.error(
        requestError.response?.data?.message ||
          "Unable to load coding questions",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadQuestions();
  }, [categoryFilter, difficultyFilter, page, search, statusFilter]);

  const handleSubmit = async (payload) => {
    try {
      setIsSubmitting(true);

      if (editingItem) {
        await adminService.updateCodingQuestion(editingItem._id, payload);
        toast.success("Coding question updated");
      } else {
        await adminService.createCodingQuestion(payload);
        toast.success("Coding question created");
      }

      setFormOpen(false);
      setEditingItem(null);
      loadQuestions();
    } catch (requestError) {
      toast.error(
        requestError.response?.data?.message ||
          "Unable to save coding question",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (item) => {
    const shouldDelete = window.confirm(`Delete question "${item.title}"?`);

    if (!shouldDelete) {
      return;
    }

    try {
      await adminService.deleteCodingQuestion(item._id);
      toast.success("Coding question deleted");
      loadQuestions();
    } catch (requestError) {
      toast.error(
        requestError.response?.data?.message || "Unable to delete question",
      );
    }
  };

  const handleQuickStatus = async (item, status) => {
    try {
      await adminService.updateCodingQuestion(item._id, { status });
      toast.success(`Question marked ${status}`);
      loadQuestions();
    } catch (requestError) {
      toast.error(
        requestError.response?.data?.message ||
          "Unable to update question status",
      );
    }
  };

  const statCards = [
    {
      title: "Question bank",
      value: formatCompactNumber(overview?.totalCodingQuestions),
      growth: overview?.questionGrowth ?? 0,
      subtitle: "total coding prompts",
      icon: Code2,
      accent: "cyan",
    },
    {
      title: "Published",
      value: formatCompactNumber(overview?.publishedCodingQuestions),
      growth: overview?.questionGrowth ?? 0,
      subtitle: "live practice content",
      icon: Rocket,
      accent: "emerald",
    },
    {
      title: "Current results",
      value: formatCompactNumber(meta?.total),
      growth: 0,
      subtitle: "items matching filters",
      icon: FileCode2,
      accent: "amber",
    },
  ];

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-6 rounded-[32px] border border-white/10 bg-[linear-gradient(135deg,rgba(8,145,178,0.14),rgba(15,23,42,0.82),rgba(16,185,129,0.08))] p-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-cyan-300">
            Coding content
          </p>
          <h1 className="mt-3 text-4xl font-bold text-white">
            Manage coding questions
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
            Maintain the coding library with category, difficulty, company tags,
            starter code, and publish controls.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingItem(null);
            setFormOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:opacity-90"
        >
          <Plus size={16} />
          Add question
        </button>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {statCards.map((card) => (
          <StatsCard key={card.title} {...card} />
        ))}
      </section>

      <section className="rounded-[28px] border border-white/10 bg-white/5 p-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
              Question library
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              Coding inventory
            </h2>
          </div>

          <div className="flex flex-col gap-3 lg:flex-row">
            <SearchBar
              value={search}
              onChange={(event) => {
                setPage(1);
                setSearch(event.target.value);
              }}
              placeholder="Search by title, tag, or company"
            />

            <select
              value={categoryFilter}
              onChange={(event) => {
                setPage(1);
                setCategoryFilter(event.target.value);
              }}
              className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none"
            >
              <option value="all">All categories</option>
              <option value="General">General</option>
              <option value="Arrays">Arrays</option>
              <option value="Strings">Strings</option>
              <option value="Linked List">Linked List</option>
              <option value="Trees">Trees</option>
              <option value="Graphs">Graphs</option>
              <option value="Dynamic Programming">Dynamic Programming</option>
              <option value="Backtracking">Backtracking</option>
              <option value="System Design">System Design</option>
            </select>

            <select
              value={difficultyFilter}
              onChange={(event) => {
                setPage(1);
                setDifficultyFilter(event.target.value);
              }}
              className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none"
            >
              <option value="all">All levels</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>

            <select
              value={statusFilter}
              onChange={(event) => {
                setPage(1);
                setStatusFilter(event.target.value);
              }}
              className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none"
            >
              <option value="all">All statuses</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-[24px] border border-white/10 bg-slate-950/40 backdrop-blur-xl">
          {isLoading ? (
            <div className="p-12">
              <LoadingSpinner label="Loading coding questions" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-0 text-left">
                <thead className="bg-white/5">
                  <tr className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    <th className="px-6 py-4">Question</th>
                    <th className="px-6 py-4 text-center">Preview</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Difficulty</th>
                    <th className="px-6 py-4">Acceptance</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Updated</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {questions.length ? (
                    questions.map((item) => (
                      <tr
  key={item._id}
  className="border-t border-white/5 align-middle text-sm text-slate-300 transition hover:bg-white/[0.02]"
>
                        <td className="min-w-[340px] max-w-[380px] px-6 py-5">
                          <p className="font-semibold text-white">
                            {item.title}
                          </p>
                          <p className="mt-2 text-sm text-slate-500">
                            Click preview to view details
                          </p>
                        </td>
                        <td className="px-6 py-5">
                          <button
                            type="button"
                            onClick={() => setPreviewItem(item)}
                            className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300 transition hover:bg-cyan-400/20"
                          >
                            <Eye size={18} />
                          </button>
                        </td>
                        <td className="px-6 py-5">{item.category}</td>
                        <td className="px-6 py-5">
                          {item.difficulty}
                        </td>
                        <td className="px-6 py-5 text-slate-400">
                          {item.acceptanceRate}%
                        </td>
                        <td className="px-6 py-5">
                          <StatusBadge value={item.status} />
                        </td>
                        <td className="px-6 py-5 text-slate-400">
                          {formatDateTime(item.updatedAt)}
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center justify-end gap-2 whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() =>
                                handleQuickStatus(
                                  item,
                                  item.status === "published"
                                    ? "draft"
                                    : "published",
                                )
                              }
                              className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-3 py-2 text-xs font-medium text-cyan-300 transition hover:bg-cyan-400/15"
                            >
                              {item.status === "published"
                                ? "Unpublish"
                                : "Publish"}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingItem(item);
                                setFormOpen(true);
                              }}
                              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-slate-200 transition hover:bg-white/10"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(item)}
                              className="rounded-xl border border-rose-400/20 bg-rose-400/10 px-3 py-2 text-xs font-medium text-rose-300 transition hover:bg-rose-400/15"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="7"
                        className="px-6 py-12 text-center text-slate-400"
                      >
                        No coding questions match the current filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {isLoading ? null : (
          <div className="mt-6 flex flex-col gap-4 border-t border-white/10 pt-4 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-slate-400">
              Showing page {meta?.page || 1} of {meta?.totalPages || 1}
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={!meta || meta.page <= 1}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                className="rounded-2xl border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={!meta || meta.page >= meta.totalPages}
                onClick={() => setPage((current) => current + 1)}
                className="rounded-2xl border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </section>

      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-[28px] border border-white/10 bg-slate-950 p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">
                  Question preview
                </p>

                <h2 className="mt-2 text-2xl font-bold text-white">
                  {previewItem.title}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setPreviewItem(null)}
                className="rounded-xl border border-white/10 px-3 py-2 text-sm text-slate-300 transition hover:bg-white/5"
              >
                Close
              </button>
            </div>

            <div className="mt-6 grid gap-5">
              <div>
                <p className="text-sm font-medium text-slate-400">
                  Description
                </p>

                <p className="mt-2 leading-7 text-slate-300">
                  {previewItem.description || "No description available"}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-400">Tags</p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {previewItem.tags?.length ? (
                    previewItem.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-slate-300"
                      >
                        {tag}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">No tags added</p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-white/10 pt-5">
                <button
                  type="button"
                  onClick={() => {
                    setTestCaseManagingItem(previewItem);
                  }}
                  className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
                >
                  Manage Test Cases
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingItem(previewItem);
                    setPreviewItem(null);
                    setFormOpen(true);
                  }}
                  className="rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
                >
                  Edit Question
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {testCaseManagingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-4xl rounded-[28px] border border-white/10 bg-slate-950 p-6 shadow-2xl flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-cyan-300 flex items-center gap-1.5">
                  <FlaskConical size={14} />
                  Manage Test Cases
                </p>
                <h2 className="mt-2 text-xl font-bold text-white">
                  {testCaseManagingItem.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setTestCaseManagingItem(null)}
                className="rounded-xl border border-white/10 p-2 text-slate-400 hover:bg-white/5 hover:text-white transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="mt-6 grid gap-6 overflow-hidden md:grid-cols-5 flex-1 min-h-0">
              {/* Left Column: Test Cases List */}
              <div className="md:col-span-3 flex flex-col min-h-0">
                <h3 className="text-sm font-semibold text-slate-300 mb-3">
                  Existing Test Cases ({tempTestCases.length})
                </h3>
                
                <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
                  {tempTestCases.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-48 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] text-slate-500">
                      <p className="text-sm">No test cases configured yet.</p>
                      <p className="text-xs mt-1">Add one on the right to get started.</p>
                    </div>
                  ) : (
                    tempTestCases.map((tc, idx) => (
                      <div
                        key={idx}
                        className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 flex flex-col gap-3 relative group transition hover:border-white/10"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400/80 bg-cyan-400/5 px-2.5 py-1 rounded-full border border-cyan-400/10">
                            Case {idx + 1}
                          </span>
                          <div className="flex items-center gap-3">
                            {tc.isSample && (
                              <span className="text-[10px] font-medium uppercase tracking-wider text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-md border border-emerald-400/20">
                                Sample
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                setTempTestCases(prev => prev.filter((_, i) => i !== idx));
                              }}
                              className="text-rose-400 hover:text-rose-300 p-1 rounded-lg hover:bg-rose-500/10 transition"
                              title="Delete Test Case"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                        
                        <div className="grid gap-2 text-xs">
                          <div>
                            <span className="text-slate-500 font-medium">Input:</span>
                            <pre className="mt-1 overflow-x-auto rounded-lg bg-slate-950 p-2 text-slate-300 whitespace-pre-wrap font-mono max-h-24">
                              {tc.input}
                            </pre>
                          </div>
                          <div>
                            <span className="text-slate-500 font-medium">Expected Output:</span>
                            <pre className="mt-1 overflow-x-auto rounded-lg bg-slate-950 p-2 text-slate-300 whitespace-pre-wrap font-mono max-h-24">
                              {tc.expectedOutput}
                            </pre>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Right Column: Add Test Case Form */}
              <div className="md:col-span-2 flex flex-col border-t border-white/10 pt-4 md:border-t-0 md:pt-0 md:border-l md:border-white/10 md:pl-6 min-h-0 overflow-y-auto pr-1">
                <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-1.5">
                  <Sparkles size={14} className="text-cyan-400" />
                  Add New Test Case
                </h3>
                
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <span className="text-xs font-medium text-slate-400">Input Arguments</span>
                    <textarea
                      value={newInput}
                      onChange={(e) => setNewInput(e.target.value)}
                      rows={3}
                      placeholder="e.g. nums = [2,7,11,15]\ntarget = 9&#10;or [2,7,11,15]\n9"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-mono text-white outline-none transition focus:border-cyan-400/40"
                    />
                    <p className="text-[10px] text-slate-500 leading-normal">
                      Provide values matching parameter order or standard assignment lines.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-xs font-medium text-slate-400">Expected Output</span>
                    <textarea
                      value={newExpectedOutput}
                      onChange={(e) => setNewExpectedOutput(e.target.value)}
                      rows={2}
                      placeholder="e.g. [0, 1] or 6 or &quot;bab&quot;"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-mono text-white outline-none transition focus:border-cyan-400/40"
                    />
                    <p className="text-[10px] text-slate-500 leading-normal">
                      Enter the JSON value or literal string returned by the function.
                    </p>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={newIsSample}
                      onChange={(e) => setNewIsSample(e.target.checked)}
                      className="rounded border-white/10 bg-white/5 text-cyan-500 focus:ring-0 focus:ring-offset-0"
                    />
                    <span className="text-xs font-medium text-slate-300">
                      Mark as Sample Case
                    </span>
                  </label>

                  <button
                    type="button"
                    onClick={() => {
                      if (!newInput.trim() || !newExpectedOutput.trim()) {
                        toast.error("Both Input and Expected Output are required");
                        return;
                      }
                      setTempTestCases(prev => [
                        ...prev,
                        {
                          input: newInput.trim(),
                          expectedOutput: newExpectedOutput.trim(),
                          isSample: newIsSample
                        }
                      ]);
                      setNewInput("");
                      setNewExpectedOutput("");
                      setNewIsSample(false);
                      toast.success("Test case added locally");
                    }}
                    className="w-full py-2.5 rounded-xl bg-cyan-400/10 hover:bg-cyan-400/20 text-cyan-300 border border-cyan-400/20 text-xs font-semibold tracking-wide transition uppercase"
                  >
                    Add Test Case
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-white/10 pt-5 mt-6">
              <button
                type="button"
                onClick={() => setTestCaseManagingItem(null)}
                className="rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold text-slate-300 transition hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSavingTestCases}
                onClick={async () => {
                  try {
                    setIsSavingTestCases(true);
                    await adminService.updateCodingQuestion(testCaseManagingItem._id, {
                      testCases: tempTestCases
                    });
                    toast.success("Test cases saved successfully");
                    
                    setPreviewItem(prev => prev ? { ...prev, testCases: tempTestCases } : null);
                    setTestCaseManagingItem(null);
                    loadQuestions();
                  } catch (err) {
                    toast.error(err.response?.data?.message || "Unable to save test cases");
                  } finally {
                    setIsSavingTestCases(false);
                  }
                }}
                className="rounded-xl bg-gradient-to-r from-cyan-400 to-sky-500 px-5 py-2 text-xs font-semibold text-slate-950 transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSavingTestCases ? "Saving..." : "Save Test Cases"}
              </button>
            </div>
          </div>
        </div>
      )}

      <CodingQuestionForm
        open={formOpen}
        mode={editingItem ? "edit" : "create"}
        initialValues={editingItem}
        isSubmitting={isSubmitting}
        onClose={() => {
          setFormOpen(false);
          setEditingItem(null);
        }}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default CodingQuestions;
