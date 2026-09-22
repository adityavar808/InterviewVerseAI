import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  BriefcaseBusiness,
  FileStack,
  Plus,
  Rocket,
} from "lucide-react";

import StatsCard from "../components/ui/StatsCard";
import SearchBar from "../components/ui/SearchBar";
import StatusBadge from "../components/ui/StatusBadge";
import InterviewForm from "../components/Forms/InterviewForm";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { adminService } from "../services/adminApi";
import {
  formatCompactNumber,
  formatDateTime,
} from "../utils/adminHelpers";

const Interviews = () => {
  const [interviews, setInterviews] = useState([]);
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

  const loadInterviews = async () => {
    try {
      setIsLoading(true);

      const [response, dashboard] = await Promise.all([
        adminService.getInterviews({
          search,
          status: statusFilter,
          category: categoryFilter,
          difficulty: difficultyFilter,
          page,
          limit: 8,
        }),
        adminService.getDashboard(),
      ]);

      setInterviews(response.data);
      setMeta(response.meta);
      setOverview(dashboard.data.overview);
    } catch (requestError) {
      toast.error(
        requestError.response?.data?.message ||
          "Unable to load interview templates",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInterviews();
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
        await adminService.updateInterview(
          editingItem._id,
          payload,
        );
        toast.success("Interview template updated");
      } else {
        await adminService.createInterview(payload);
        toast.success("Interview template created");
      }

      setFormOpen(false);
      setEditingItem(null);
      await loadInterviews();
    } catch (requestError) {
      toast.error(
        requestError.response?.data?.message ||
          "Unable to save interview template",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (interviewId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this interview template?",
      )
    ) {
      return;
    }

    try {
      await adminService.deleteInterview(interviewId);
      toast.success("Interview template deleted");
      await loadInterviews();
    } catch (requestError) {
      toast.error(
        requestError.response?.data?.message ||
          "Unable to delete interview template",
      );
    }
  };

  const statCards = [
    {
      title: "Total Templates",
      value: formatCompactNumber(
        overview?.totalInterviews || 0,
      ),
      growth: overview?.interviewGrowth ?? 0,
      subtitle: "template library size",
      icon: FileStack,
      accent: "cyan",
    },
    {
      title: "Published Templates",
      value: formatCompactNumber(
        overview?.publishedInterviews || 0,
      ),
      growth: overview?.interviewGrowth ?? 0,
      subtitle: "available to candidates",
      icon: Rocket,
      accent: "emerald",
    },
    {
      title: "Category Types",
      value: formatCompactNumber(
        overview?.totalCategories || 0,
      ),
      subtitle: "track domains covered",
      icon: BriefcaseBusiness,
      accent: "amber",
    },
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-white/10 bg-[linear-gradient(135deg,rgba(8,145,178,0.16),rgba(15,23,42,0.82),rgba(245,158,11,0.08))] p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.24em] text-cyan-300">
              Template operations
            </p>
            <h1 className="mt-3 text-4xl font-bold text-white">
              Interview sessions
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
              Create, publish, and structure role-based AI interview sessions for candidate evaluation.
            </p>
          </div>

          <button
            onClick={() => {
              setEditingItem(null);
              setFormOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 shadow-[0_0_24px_rgba(34,211,238,0.3)] transition hover:bg-cyan-300"
          >
            <Plus size={18} />
            Create template
          </button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {statCards.map((card) => (
          <StatsCard key={card.title} {...card} />
        ))}
      </section>

      <section className="rounded-[28px] border border-white/10 bg-white/5 p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <SearchBar
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search by title, role, or skill tag..."
          />

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(event.target.value);
                setPage(1);
              }}
              className="rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-slate-200"
            >
              <option value="all">All statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(event) => {
                setCategoryFilter(event.target.value);
                setPage(1);
              }}
              className="rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-slate-200"
            >
              <option value="all">All categories</option>
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="Full Stack">Full Stack</option>
              <option value="DevOps">DevOps</option>
              <option value="Behavioral">Behavioral</option>
            </select>

            <select
              value={difficultyFilter}
              onChange={(event) => {
                setDifficultyFilter(event.target.value);
                setPage(1);
              }}
              className="rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-slate-200"
            >
              <option value="all">All difficulties</option>
              <option value="Entry">Entry</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Senior">Senior</option>
            </select>
          </div>
        </div>

        <div className="mt-6">
          {isLoading ? (
            <LoadingSpinner label="Loading interview templates" />
          ) : interviews.length ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="border-b border-white/10 bg-white/5 text-xs uppercase tracking-[0.2em] text-slate-400">
                  <tr>
                    <th className="px-4 py-4">Title</th>
                    <th className="px-4 py-4">Category</th>
                    <th className="px-4 py-4">Difficulty</th>
                    <th className="px-4 py-4">Questions</th>
                    <th className="px-4 py-4">Status</th>
                    <th className="px-4 py-4">Created</th>
                    <th className="px-4 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {interviews.map((item) => (
                    <tr key={item._id} className="hover:bg-white/5">
                      <td className="px-4 py-4 font-semibold text-white">
                        {item.title}
                        <p className="mt-1 text-xs text-slate-400">
                          {item.targetRole}
                        </p>
                      </td>
                      <td className="px-4 py-4">{item.category}</td>
                      <td className="px-4 py-4">{item.difficulty}</td>
                      <td className="px-4 py-4">
                        {item.totalQuestions || item.questionCount || item.questions?.length || 0} questions
                      </td>
                      <td className="px-4 py-4">
                        <StatusBadge value={item.status} />
                      </td>
                      <td className="px-4 py-4 text-slate-400">
                        {formatDateTime(item.createdAt)}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setEditingItem(item);
                              setFormOpen(true);
                            }}
                            className="rounded-xl border border-white/10 px-3 py-1.5 text-xs text-slate-300 hover:bg-white/5"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="rounded-xl border border-rose-400/20 px-3 py-1.5 text-xs text-rose-300 hover:bg-rose-400/10"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400">
              No interview templates found matching your filters.
            </div>
          )}
        </div>

        {meta && meta.totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
            <p className="text-sm text-slate-400">
              Page {meta.page} of {meta.totalPages} ({meta.totalItems} total)
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((current) => current - 1)}
                className="rounded-2xl border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>
              <button
                disabled={page >= meta.totalPages}
                onClick={() => setPage((current) => current + 1)}
                className="rounded-2xl border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </section>

      <InterviewForm
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

export default Interviews;
