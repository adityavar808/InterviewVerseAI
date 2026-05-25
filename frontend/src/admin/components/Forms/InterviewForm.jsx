import { useEffect, useState } from "react";

import ModalShell from "../ui/ModalShell";
import {
  joinTagInput,
  parseTagInput,
} from "../../utils/adminHelpers";

const initialFormState = {
  title: "",
  description: "",
  category: "Frontend",
  difficulty: "Intermediate",
  durationMinutes: 30,
  questionCount: 5,
  status: "draft",
  tags: "",
};

const InterviewForm = ({
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
          "Frontend",
        difficulty:
          initialValues.difficulty ||
          "Intermediate",
        durationMinutes:
          initialValues.durationMinutes ||
          30,
        questionCount:
          initialValues.questionCount ||
          5,
        status:
          initialValues.status ||
          "draft",
        tags: joinTagInput(
          initialValues.tags || [],
        ),
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
      durationMinutes: Number(
        formData.durationMinutes,
      ),
      questionCount: Number(
        formData.questionCount,
      ),
      tags: parseTagInput(
        formData.tags,
      ),
    });
  };

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title={
        mode === "edit"
          ? "Edit interview template"
          : "Create interview template"
      }
      description="Define reusable interview tracks for admins to publish and manage."
      widthClass="max-w-3xl"
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
              rows={4}
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
              <option value="Frontend">
                Frontend
              </option>
              <option value="Backend">
                Backend
              </option>
              <option value="Full Stack">
                Full Stack
              </option>
              <option value="HR">HR</option>
              <option value="System Design">
                System Design
              </option>
              <option value="Data Structures">
                Data Structures
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
              <option value="Beginner">
                Beginner
              </option>
              <option value="Intermediate">
                Intermediate
              </option>
              <option value="Advanced">
                Advanced
              </option>
            </select>
          </label>

          <label className="space-y-2 text-sm text-slate-300">
            <span>Duration (minutes)</span>
            <input
              type="number"
              min="10"
              name="durationMinutes"
              value={formData.durationMinutes}
              onChange={handleChange}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-cyan-400/40"
            />
          </label>

          <label className="space-y-2 text-sm text-slate-300">
            <span>Question count</span>
            <input
              type="number"
              min="1"
              name="questionCount"
              value={formData.questionCount}
              onChange={handleChange}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-cyan-400/40"
            />
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
            <span>Tags</span>
            <input
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="React, APIs, Behavioral"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-cyan-400/40"
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
                : "Create template"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
};

export default InterviewForm;
