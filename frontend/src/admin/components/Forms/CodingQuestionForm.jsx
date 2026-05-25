import { useEffect, useState } from "react";

import ModalShell from "../ui/ModalShell";
import {
  joinTagInput,
  parseTagInput,
} from "../../utils/adminHelpers";

const initialFormState = {
  title: "",
  description: "",
  category: "General",
  difficulty: "Medium",
  status: "draft",
  acceptanceRate: 0,
  tags: "",
  companies: "",
  constraints: "",
  starterCode: "",
};

const CodingQuestionForm = ({
  open,
  mode = "create",
  initialValues,
  isSubmitting,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] =
    useState(initialFormState);

  useEffect(() => {
    if (!open) {
      return;
    }

    if (initialValues) {
      setFormData({
        title: initialValues.title || "",
        description:
          initialValues.description || "",
        category:
          initialValues.category ||
          "General",
        difficulty:
          initialValues.difficulty ||
          "Medium",
        status:
          initialValues.status ||
          "draft",
        acceptanceRate:
          initialValues.acceptanceRate ||
          0,
        tags: joinTagInput(
          initialValues.tags || [],
        ),
        companies: joinTagInput(
          initialValues.companies || [],
        ),
        constraints:
          initialValues.constraints || "",
        starterCode:
          initialValues.starterCode || "",
      });
    } else {
      setFormData(initialFormState);
    }
  }, [initialValues, open]);

  const handleChange = (event) => {
    const { name, value } =
      event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    onSubmit({
      ...formData,
      acceptanceRate: Number(
        formData.acceptanceRate,
      ),
      tags: parseTagInput(
        formData.tags,
      ),
      companies: parseTagInput(
        formData.companies,
      ),
    });
  };

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title={
        mode === "edit"
          ? "Edit coding question"
          : "Create coding question"
      }
      description="Build and maintain the question bank that powers coding assessments."
      widthClass="max-w-4xl"
    >
      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <div className="grid gap-5 md:grid-cols-2">
          <label className="space-y-2 text-sm text-slate-300 md:col-span-2">
            <span>Title</span>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-cyan-400/40"
            />
          </label>

          <label className="space-y-2 text-sm text-slate-300 md:col-span-2">
            <span>Description</span>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-cyan-400/40"
            />
          </label>

          <label className="space-y-2 text-sm text-slate-300">
            <span>Category</span>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400/40"
            >
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
          </label>

          <label className="space-y-2 text-sm text-slate-300">
            <span>Difficulty</span>
            <select
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400/40"
            >
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
          </label>

          <label className="space-y-2 text-sm text-slate-300">
            <span>Status</span>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400/40"
            >
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
          </label>

          <label className="space-y-2 text-sm text-slate-300">
            <span>Acceptance rate</span>
            <input
              type="number"
              min="0"
              max="100"
              name="acceptanceRate"
              value={formData.acceptanceRate}
              onChange={handleChange}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-cyan-400/40"
            />
          </label>

          <label className="space-y-2 text-sm text-slate-300">
            <span>Tags</span>
            <input
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="DFS, Sliding Window"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-cyan-400/40"
            />
          </label>

          <label className="space-y-2 text-sm text-slate-300">
            <span>Companies</span>
            <input
              name="companies"
              value={formData.companies}
              onChange={handleChange}
              placeholder="Google, Amazon"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-cyan-400/40"
            />
          </label>

          <label className="space-y-2 text-sm text-slate-300 md:col-span-2">
            <span>Constraints</span>
            <textarea
              name="constraints"
              value={formData.constraints}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-cyan-400/40"
            />
          </label>

          <label className="space-y-2 text-sm text-slate-300 md:col-span-2">
            <span>Starter code</span>
            <textarea
              name="starterCode"
              value={formData.starterCode}
              onChange={handleChange}
              rows={6}
              className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 font-mono text-sm text-white outline-none transition focus:border-cyan-400/40"
            />
          </label>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-white/10 px-5 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/5"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-2xl bg-gradient-to-r from-cyan-400 to-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting
              ? "Saving..."
              : mode === "edit"
                ? "Save changes"
                : "Create question"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
};

export default CodingQuestionForm;
