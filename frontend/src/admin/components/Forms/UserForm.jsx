import { useEffect, useState } from "react";

import ModalShell from "../ui/ModalShell";
import {
  joinTagInput,
  parseTagInput,
} from "../../utils/adminHelpers";

const initialFormState = {
  name: "",
  email: "",
  password: "",
  role: "student",
  status: "active",
  skills: "",
  isVerified: true,
};

const UserForm = ({
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
        name: initialValues.name || "",
        email: initialValues.email || "",
        password: "",
        role:
          initialValues.role ||
          "student",
        status:
          initialValues.status ||
          "active",
        skills: joinTagInput(
          initialValues.skills || [],
        ),
        isVerified:
          initialValues.isVerified ??
          true,
      });
    } else {
      setFormData(initialFormState);
    }
  }, [initialValues, open]);

  const handleChange = (event) => {
    const { name, value, type, checked } =
      event.target;

    setFormData((current) => ({
      ...current,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    onSubmit({
      ...formData,
      skills: parseTagInput(
        formData.skills,
      ),
    });
  };

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title={
        mode === "edit"
          ? "Edit user"
          : "Add new user"
      }
      description="Manage platform access, verification, and profile skills for this account."
      widthClass="max-w-2xl"
    >
      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <div className="grid gap-5 md:grid-cols-2">
          <label className="space-y-2 text-sm text-slate-300">
            <span>Name</span>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-cyan-400/40"
            />
          </label>

          <label className="space-y-2 text-sm text-slate-300">
            <span>Email</span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-cyan-400/40"
            />
          </label>

          <label className="space-y-2 text-sm text-slate-300">
            <span>
              {mode === "edit"
                ? "New password"
                : "Password"}
            </span>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required={mode !== "edit"}
              placeholder={
                mode === "edit"
                  ? "Leave blank to keep current password"
                  : "Set a secure password"
              }
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-cyan-400/40"
            />
          </label>

          <label className="space-y-2 text-sm text-slate-300">
            <span>Skills</span>
            <input
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="React, Node.js, System Design"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-cyan-400/40"
            />
          </label>

          <label className="space-y-2 text-sm text-slate-300">
            <span>Role</span>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400/40"
            >
              <option value="student">
                Student
              </option>
              <option value="admin">
                Admin
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
              <option value="active">
                Active
              </option>
              <option value="inactive">
                Inactive
              </option>
              <option value="suspended">
                Suspended
              </option>
            </select>
          </label>
        </div>

        <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-slate-300">
          <input
            type="checkbox"
            name="isVerified"
            checked={formData.isVerified}
            onChange={handleChange}
            className="h-4 w-4 rounded border-white/20 bg-slate-950 text-cyan-400"
          />
          Mark account as verified
        </label>

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
                : "Create user"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
};

export default UserForm;
