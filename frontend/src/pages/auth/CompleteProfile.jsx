import { useEffect } from "react";

import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Sparkles, UserCheck, MapPin, FileText, ImagePlus } from "lucide-react";

import studentService from "../../services/studentApi";
import { setCredentials } from "../../redux/slices/authSlice";

const CompleteProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, accessToken } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      location: "",
      headline: "",
      bio: "",
      skills: "",
      profileImage: "",
    },
  });

  useEffect(() => {
    if (user?.profileSetupDone !== false && user) {
      navigate("/dashboard", { replace: true });
      return;
    }

    reset({
      name: user?.name || "",
      location: user?.location || "",
      headline: user?.headline || "",
      bio: user?.bio || "",
      skills: Array.isArray(user?.skills) ? user.skills.join(", ") : "",
      profileImage: user?.profileImage || "",
    });
  }, [navigate, reset, user]);

  const onSubmit = async (values) => {
    try {
      const updatedUser = await studentService.updateProfile(values);

      dispatch(
        setCredentials({
          user: updatedUser,
          accessToken,
        })
      );

      toast.success("Profile completed successfully");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Unable to save profile"
      );
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 px-6 py-10">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 opacity-[0.028] bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] bg-[size:36px_36px]" />
        <div className="absolute -top-40 -left-20 h-[440px] w-[440px] rounded-full bg-cyan-500/5 blur-[90px]" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-violet-500/5 blur-[70px]" />
      </div>

      <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-5xl items-center">
        <div className="grid w-full gap-6 rounded-[32px] border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/20 backdrop-blur-xl lg:grid-cols-[1.05fr_0.95fr] lg:p-8">
          <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(135deg,rgba(6,182,212,0.16),rgba(15,23,42,0.9),rgba(99,102,241,0.08))] p-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-cyan-300">
              <Sparkles size={14} />
              Profile required
            </div>

            <h1 className="mt-5 text-4xl font-bold tracking-tight text-white">
              Finish your profile to unlock the dashboard
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300">
              Add the details recruiters and the dashboard use to personalize your experience. This one-time setup is required for new Google and email sign-ins.
            </p>

            <div className="mt-8 space-y-3 text-sm text-slate-300">
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <UserCheck size={16} className="text-cyan-300" />
                <span>Set your display name and headline</span>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <MapPin size={16} className="text-violet-300" />
                <span>Add your location and short bio</span>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <FileText size={16} className="text-emerald-300" />
                <span>List your core skills for smarter recommendations</span>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <ImagePlus size={16} className="text-amber-300" />
                <span>Optionally keep your profile image or add a new URL</span>
              </div>
            </div>
          </div>

          <motion.form
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            onSubmit={handleSubmit(onSubmit)}
            className="rounded-[28px] border border-white/10 bg-slate-950/80 p-6"
          >
            <div className="mb-6">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                Complete profile
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                Tell us a bit about you
              </h2>
            </div>

            <div className="space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">Name</span>
                <input
                  {...register("name", { required: "Name is required" })}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-cyan-400/40"
                  placeholder="Your name"
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-rose-300">{errors.name.message}</p>
                )}
              </label>

              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">Headline</span>
                <input
                  {...register("headline")}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-cyan-400/40"
                  placeholder="Frontend Developer, AI Engineer, Student..."
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">Location</span>
                <input
                  {...register("location", { required: "Location is required" })}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-cyan-400/40"
                  placeholder="New Delhi, India"
                />
                {errors.location && (
                  <p className="mt-1 text-xs text-rose-300">{errors.location.message}</p>
                )}
              </label>

              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">Bio</span>
                <textarea
                  rows={4}
                  {...register("bio", { required: "Bio is required" })}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-cyan-400/40"
                  placeholder="A short summary about your goals and background"
                />
                {errors.bio && (
                  <p className="mt-1 text-xs text-rose-300">{errors.bio.message}</p>
                )}
              </label>

              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">Skills</span>
                <input
                  {...register("skills", { required: "Add at least one skill" })}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-cyan-400/40"
                  placeholder="React, Node.js, MongoDB"
                />
                <p className="mt-1 text-xs text-slate-500">
                  Separate skills with commas.
                </p>
                {errors.skills && (
                  <p className="mt-1 text-xs text-rose-300">{errors.skills.message}</p>
                )}
              </label>

              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">Profile image URL</span>
                <input
                  {...register("profileImage")}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-cyan-400/40"
                  placeholder="https://..."
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-6 flex w-full items-center justify-center rounded-2xl bg-cyan-400 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Saving..." : "Complete profile"}
            </button>
          </motion.form>
        </div>
      </div>
    </div>
  );
};

export default CompleteProfile;
