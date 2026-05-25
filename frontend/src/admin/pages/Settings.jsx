import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import LoadingSpinner from "../components/ui/LoadingSpinner";
import { adminService } from "../services/adminApi";

const Settings = () => {
  const [formData, setFormData] =
    useState(null);
  const [isLoading, setIsLoading] =
    useState(true);
  const [isSubmitting, setIsSubmitting] =
    useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setIsLoading(true);
        const response =
          await adminService.getSettings();
        setFormData(response.data);
      } catch (requestError) {
        toast.error(
          requestError.response?.data
            ?.message ||
            "Unable to load settings",
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleChange = (event) => {
    const { name, value, type, checked } =
      event.target;

    setFormData((current) => ({
      ...current,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
            ? Number(value)
            : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      const response =
        await adminService.updateSettings(
          formData,
        );
      setFormData(response.data);
      toast.success(
        "Settings updated successfully",
      );
    } catch (requestError) {
      toast.error(
        requestError.response?.data
          ?.message ||
          "Unable to save settings",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !formData) {
    return (
      <div className="rounded-[28px] border border-white/10 bg-white/5 p-12">
        <LoadingSpinner label="Loading settings" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-white/10 bg-[linear-gradient(135deg,rgba(8,145,178,0.14),rgba(15,23,42,0.82),rgba(16,185,129,0.08))] p-8">
        <p className="text-[11px] uppercase tracking-[0.24em] text-cyan-300">
          Platform settings
        </p>
        <h1 className="mt-3 text-4xl font-bold text-white">
          Configure admin defaults
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
          Control registration, authentication, interview defaults, AI usage limits, and platform messaging.
        </p>
      </section>

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <section className="grid gap-6 xl:grid-cols-2">
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-semibold text-white">
              Brand and support
            </h2>
            <div className="mt-6 grid gap-5">
              <label className="space-y-2 text-sm text-slate-300">
                <span>Platform name</span>
                <input
                  name="platformName"
                  value={formData.platformName}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-cyan-400/40"
                />
              </label>

              <label className="space-y-2 text-sm text-slate-300">
                <span>Support email</span>
                <input
                  type="email"
                  name="supportEmail"
                  value={formData.supportEmail}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-cyan-400/40"
                />
              </label>

              <label className="space-y-2 text-sm text-slate-300">
                <span>Docs URL</span>
                <input
                  name="docsUrl"
                  value={formData.docsUrl}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-cyan-400/40"
                />
              </label>

              <label className="space-y-2 text-sm text-slate-300">
                <span>Status page URL</span>
                <input
                  name="statusPageUrl"
                  value={formData.statusPageUrl}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-cyan-400/40"
                />
              </label>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-semibold text-white">
              Access controls
            </h2>
            <div className="mt-6 space-y-4">
              {[
                {
                  name: "maintenanceMode",
                  label: "Maintenance mode",
                },
                {
                  name: "allowRegistrations",
                  label:
                    "Allow new registrations",
                },
                {
                  name: "allowGoogleAuth",
                  label:
                    "Allow Google authentication",
                },
              ].map((field) => (
                <label
                  key={field.name}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-slate-300"
                >
                  <span>{field.label}</span>
                  <input
                    type="checkbox"
                    name={field.name}
                    checked={
                      formData[field.name]
                    }
                    onChange={handleChange}
                    className="h-5 w-5 rounded border-white/20 bg-slate-950 text-cyan-400"
                  />
                </label>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-semibold text-white">
              Product defaults
            </h2>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-300">
                <span>Session timeout (minutes)</span>
                <input
                  type="number"
                  name="sessionTimeoutMinutes"
                  value={formData.sessionTimeoutMinutes}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-cyan-400/40"
                />
              </label>

              <label className="space-y-2 text-sm text-slate-300">
                <span>Daily AI credit limit</span>
                <input
                  type="number"
                  name="dailyAiCreditLimit"
                  value={formData.dailyAiCreditLimit}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-cyan-400/40"
                />
              </label>

              <label className="space-y-2 text-sm text-slate-300">
                <span>Default interview duration</span>
                <input
                  type="number"
                  name="defaultInterviewDuration"
                  value={formData.defaultInterviewDuration}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-cyan-400/40"
                />
              </label>

              <label className="space-y-2 text-sm text-slate-300">
                <span>Daily coding question limit</span>
                <input
                  type="number"
                  name="maxCodingQuestionsPerDay"
                  value={formData.maxCodingQuestionsPerDay}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-cyan-400/40"
                />
              </label>

              <label className="space-y-2 text-sm text-slate-300 md:col-span-2">
                <span>Default interview difficulty</span>
                <select
                  name="defaultInterviewDifficulty"
                  value={formData.defaultInterviewDifficulty}
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
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-semibold text-white">
              Platform messaging
            </h2>
            <div className="mt-6 grid gap-5">
              <label className="space-y-2 text-sm text-slate-300">
                <span>Announcement banner</span>
                <textarea
                  name="announcementBanner"
                  rows={4}
                  value={formData.announcementBanner}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-cyan-400/40"
                />
              </label>

              <label className="space-y-2 text-sm text-slate-300">
                <span>Onboarding message</span>
                <textarea
                  name="onboardingMessage"
                  rows={5}
                  value={formData.onboardingMessage}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-cyan-400/40"
                />
              </label>
            </div>
          </div>
        </section>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-2xl bg-gradient-to-r from-cyan-400 to-sky-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting
              ? "Saving..."
              : "Save settings"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
