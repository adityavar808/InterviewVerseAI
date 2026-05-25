import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Code2,
  FileCode2,
  Plus,
  Rocket,
} from "lucide-react";

import StatsCard from "../components/ui/StatsCard";
import SearchBar from "../components/ui/SearchBar";
import StatusBadge from "../components/ui/StatusBadge";
import CodingQuestionForm from "../components/Forms/CodingQuestionForm";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { adminService } from "../services/adminApi";
import {
  formatCompactNumber,
  formatDateTime,
} from "../utils/adminHelpers";

const CodingQuestions = () => {
  const [questions, setQuestions] =
    useState([]);
  const [meta, setMeta] = useState(null);
  const [overview, setOverview] =
    useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("all");
  const [categoryFilter, setCategoryFilter] =
    useState("all");
  const [difficultyFilter, setDifficultyFilter] =
    useState("all");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] =
    useState(true);
  const [isSubmitting, setIsSubmitting] =
    useState(false);
  const [formOpen, setFormOpen] =
    useState(false);
  const [editingItem, setEditingItem] =
    useState(null);

  const loadQuestions = async () => {
    try {
      setIsLoading(true);

      const [response, dashboard] =
        await Promise.all([
          adminService.getCodingQuestions({
            search,
            status: statusFilter,
            category: categoryFilter,
            difficulty:
              difficultyFilter,
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
        requestError.response?.data
          ?.message ||
          "Unable to load coding questions",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadQuestions();
  }, [
    categoryFilter,
    difficultyFilter,
    page,
    search,
    statusFilter,
  ]);

  const handleSubmit = async (payload) => {
    try {
      setIsSubmitting(true);

      if (editingItem) {
        await adminService.updateCodingQuestion(
          editingItem._id,
          payload,
        );
        toast.success(
          "Coding question updated",
        );
      } else {
        await adminService.createCodingQuestion(
          payload,
        );
        toast.success(
          "Coding question created",
        );
      }

      setFormOpen(false);
      setEditingItem(null);
      loadQuestions();
    } catch (requestError) {
      toast.error(
        requestError.response?.data
          ?.message ||
          "Unable to save coding question",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (item) => {
    const shouldDelete = window.confirm(
      `Delete question "${item.title}"?`,
    );

    if (!shouldDelete) {
      return;
    }

    try {
      await adminService.deleteCodingQuestion(
        item._id,
      );
      toast.success(
        "Coding question deleted",
      );
      loadQuestions();
    } catch (requestError) {
      toast.error(
        requestError.response?.data
          ?.message ||
          "Unable to delete question",
      );
    }
  };

  const handleQuickStatus = async (
    item,
    status,
  ) => {
    try {
      await adminService.updateCodingQuestion(
        item._id,
        { status },
      );
      toast.success(
        `Question marked ${status}`,
      );
      loadQuestions();
    } catch (requestError) {
      toast.error(
        requestError.response?.data
          ?.message ||
          "Unable to update question status",
      );
    }
  };

  const statCards = [
    {
      title: "Question bank",
      value: formatCompactNumber(
        overview?.totalCodingQuestions,
      ),
      growth:
        overview?.questionGrowth || 0,
      subtitle: "total coding prompts",
      icon: Code2,
      accent: "cyan",
    },
    {
      title: "Published",
      value: formatCompactNumber(
        overview?.publishedCodingQuestions,
      ),
      growth:
        overview?.questionGrowth || 0,
      subtitle: "live practice content",
      icon: Rocket,
      accent: "emerald",
    },
    {
      title: "Current results",
      value: formatCompactNumber(
        meta?.total,
      ),
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
            Maintain the coding library with category, difficulty, company tags, starter code, and publish controls.
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
          <StatsCard
            key={card.title}
            {...card}
          />
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
                setSearch(
                  event.target.value,
                );
              }}
              placeholder="Search by title, tag, or company"
            />

            <select
              value={categoryFilter}
              onChange={(event) => {
                setPage(1);
                setCategoryFilter(
                  event.target.value,
                );
              }}
              className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none"
            >
              <option value="all">
                All categories
              </option>
              <option value="General">
                General
              </option>
              <option value="Arrays">
                Arrays
              </option>
              <option value="Strings">
                Strings
              </option>
              <option value="Linked List">
                Linked List
              </option>
              <option value="Trees">
                Trees
              </option>
              <option value="Graphs">
                Graphs
              </option>
              <option value="Dynamic Programming">
                Dynamic Programming
              </option>
              <option value="Backtracking">
                Backtracking
              </option>
              <option value="System Design">
                System Design
              </option>
            </select>

            <select
              value={difficultyFilter}
              onChange={(event) => {
                setPage(1);
                setDifficultyFilter(
                  event.target.value,
                );
              }}
              className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none"
            >
              <option value="all">
                All levels
              </option>
              <option value="Easy">
                Easy
              </option>
              <option value="Medium">
                Medium
              </option>
              <option value="Hard">
                Hard
              </option>
            </select>

            <select
              value={statusFilter}
              onChange={(event) => {
                setPage(1);
                setStatusFilter(
                  event.target.value,
                );
              }}
              className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none"
            >
              <option value="all">
                All statuses
              </option>
              <option value="draft">
                Draft
              </option>
              <option value="published">
                Published
              </option>
              <option value="archived">
                Archived
              </option>
            </select>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-[28px] border border-white/10">
          {isLoading ? (
            <div className="p-12">
              <LoadingSpinner label="Loading coding questions" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead className="bg-white/5">
                  <tr className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    <th className="px-6 py-4">
                      Question
                    </th>
                    <th className="px-6 py-4">
                      Category
                    </th>
                    <th className="px-6 py-4">
                      Difficulty
                    </th>
                    <th className="px-6 py-4">
                      Acceptance
                    </th>
                    <th className="px-6 py-4">
                      Status
                    </th>
                    <th className="px-6 py-4">
                      Updated
                    </th>
                    <th className="px-6 py-4 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {questions.length ? (
                    questions.map((item) => (
                      <tr
                        key={item._id}
                        className="border-t border-white/5 align-top text-sm text-slate-300"
                      >
                        <td className="px-6 py-5">
                          <p className="font-semibold text-white">
                            {item.title}
                          </p>
                          <p className="mt-1 max-w-[320px] text-slate-500">
                            {item.description ||
                              "No description added"}
                          </p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {item.tags?.map(
                              (tag) => (
                                <span
                                  key={tag}
                                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-400"
                                >
                                  {tag}
                                </span>
                              ),
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          {item.category}
                        </td>
                        <td className="px-6 py-5">
                          {item.difficulty}
                        </td>
                        <td className="px-6 py-5 text-slate-400">
                          {item.acceptanceRate}
                          %
                        </td>
                        <td className="px-6 py-5">
                          <StatusBadge
                            value={item.status}
                          />
                        </td>
                        <td className="px-6 py-5 text-slate-400">
                          {formatDateTime(
                            item.updatedAt,
                          )}
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                handleQuickStatus(
                                  item,
                                  item.status ===
                                    "published"
                                    ? "draft"
                                    : "published",
                                )
                              }
                              className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-3 py-2 text-xs font-medium text-cyan-300 transition hover:bg-cyan-400/15"
                            >
                              {item.status ===
                              "published"
                                ? "Unpublish"
                                : "Publish"}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingItem(
                                  item,
                                );
                                setFormOpen(true);
                              }}
                              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-slate-200 transition hover:bg-white/10"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(
                                  item,
                                )
                              }
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
              Showing page {meta?.page || 1}
              {" "}of{" "}
              {meta?.totalPages || 1}
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={
                  !meta ||
                  meta.page <= 1
                }
                onClick={() =>
                  setPage((current) =>
                    Math.max(
                      1,
                      current - 1,
                    ),
                  )
                }
                className="rounded-2xl border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={
                  !meta ||
                  meta.page >=
                    meta.totalPages
                }
                onClick={() =>
                  setPage((current) =>
                    current + 1,
                  )
                }
                className="rounded-2xl border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </section>

      <CodingQuestionForm
        open={formOpen}
        mode={
          editingItem ? "edit" : "create"
        }
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
