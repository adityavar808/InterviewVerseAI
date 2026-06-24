import { useEffect, useRef, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  Sparkles,
  UserCheck,
  MapPin,
  FileText,
  ImagePlus,
  ChevronRight,
  ChevronLeft,
  Check,
  User,
  Zap,
} from "lucide-react";

import studentService from "../../services/studentApi";
import { setCredentials } from "../../redux/slices/authSlice";

const STEPS = [
  {
    id: 1,
    label: "Identity",
    icon: UserCheck,
    fields: ["name", "headline"],
    color: "cyan",
  },
  {
    id: 2,
    label: "Location",
    icon: MapPin,
    fields: ["location", "bio"],
    color: "violet",
  },
  {
    id: 3,
    label: "Skills",
    icon: FileText,
    fields: ["skills"],
    color: "emerald",
  },
  {
    id: 4,
    label: "Social Links",
    icon: FileText,
    fields: ["githubUrl", "linkedinUrl", "portfolioUrl"],
    color: "emerald",
  },
  {
    id: 5,
    label: "Photo",
    icon: ImagePlus,
    fields: ["profileImage"],
    color: "amber",
  },
];

const stepVariants = {
  enter: (dir) => ({
    x: dir > 0 ? 40 : -40,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  exit: (dir) => ({
    x: dir > 0 ? -40 : 40,
    opacity: 0,
    transition: { duration: 0.2, ease: "easeIn" },
  }),
};

const colorMap = {
  cyan: {
    dot: "bg-cyan-400",
    dotInactive: "bg-white/15",
    icon: "text-cyan-300",
    ring: "ring-cyan-400/30",
    accent: "text-cyan-400",
    badge: "border-cyan-400/20 bg-cyan-400/10 text-cyan-300",
    focusInput: "focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/20",
    btn: "bg-cyan-400 hover:bg-cyan-300 text-slate-950",
  },
  violet: {
    dot: "bg-violet-400",
    dotInactive: "bg-white/15",
    icon: "text-violet-300",
    ring: "ring-violet-400/30",
    accent: "text-violet-400",
    badge: "border-violet-400/20 bg-violet-400/10 text-violet-300",
    focusInput: "focus:border-violet-400/50 focus:ring-1 focus:ring-violet-400/20",
    btn: "bg-violet-400 hover:bg-violet-300 text-slate-950",
  },
  emerald: {
    dot: "bg-emerald-400",
    dotInactive: "bg-white/15",
    icon: "text-emerald-300",
    ring: "ring-emerald-400/30",
    accent: "text-emerald-400",
    badge: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
    focusInput: "focus:border-emerald-400/50 focus:ring-1 focus:ring-emerald-400/20",
    btn: "bg-emerald-400 hover:bg-emerald-300 text-slate-950",
  },
  amber: {
    dot: "bg-amber-400",
    dotInactive: "bg-white/15",
    icon: "text-amber-300",
    ring: "ring-amber-400/30",
    accent: "text-amber-400",
    badge: "border-amber-400/20 bg-amber-400/10 text-amber-300",
    focusInput: "focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/20",
    btn: "bg-amber-400 hover:bg-amber-300 text-slate-950",
  },
};

const AvatarPreview = ({ name, headline, location, skills, profileImage, currentStep }) => {
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  const skillList = skills
    ? skills.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 4)
    : [];

  return (
    <div className="flex flex-col items-center justify-center h-full gap-5 px-4">
      {/* Avatar circle */}
      <div className="relative">
        <div
          className={`w-24 h-24 rounded-full border-2 border-white/10 overflow-hidden flex items-center justify-center transition-all duration-500 ${
            profileImage ? "" : "bg-gradient-to-br from-cyan-500/20 to-violet-500/20"
          }`}
        >
          {profileImage ? (
            <img
              src={profileImage}
              alt="Profile preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          ) : (
            <span className="text-2xl font-semibold text-white/70">{initials}</span>
          )}
        </div>
        <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center">
          <Zap size={12} className="text-cyan-400" />
        </div>
      </div>

      {/* Name & headline */}
      <div className="text-center space-y-1">
        <AnimatePresence mode="wait">
          <motion.p
            key={name || "empty-name"}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="text-lg font-semibold text-white leading-tight"
          >
            {name || <span className="text-white/25">Your name</span>}
          </motion.p>
        </AnimatePresence>
        <AnimatePresence mode="wait">
          <motion.p
            key={headline || "empty-headline"}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2, delay: 0.05 }}
            className="text-xs text-slate-400 leading-tight"
          >
            {headline || <span className="text-white/20">Your headline</span>}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Location pill */}
      {location && (
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-violet-400/20 bg-violet-400/8 text-violet-300 text-xs"
        >
          <MapPin size={10} />
          {location}
        </motion.div>
      )}

      {/* Skills chips */}
      {skillList.length > 0 && (
        <div className="flex flex-wrap gap-1.5 justify-center max-w-[200px]">
          {skillList.map((skill, i) => (
            <motion.span
              key={skill}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="px-2 py-0.5 rounded-md border border-emerald-400/20 bg-emerald-400/8 text-emerald-300 text-[11px] font-medium"
            >
              {skill}
            </motion.span>
          ))}
        </div>
      )}

      {/* Step hint */}
      <div className="absolute bottom-6 left-0 right-0 text-center">
        <p className="text-[11px] text-white/25 tracking-wider uppercase">Live preview</p>
      </div>
    </div>
  );
};

const CompleteProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, accessToken } = useSelector((state) => state.auth);

  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const hasInitializedRef = useRef(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      location: "",
      headline: "",
      bio: "",
      skills: "",
      githubUrl: "",
      linkedinUrl: "",
      portfolioUrl: "",
      profileImage: "",
    },
    mode: "onChange",
  });

  const watchedValues = watch();

  useEffect(() => {
    if (!user) return;

    if (user?.profileSetupDone !== false && user) {
      navigate("/dashboard", { replace: true });
      return;
    }

    if (!hasInitializedRef.current) {
      reset({
        name: user?.name || "",
        location: user?.location || "",
        headline: user?.headline || "",
        bio: user?.bio || "",
        skills: Array.isArray(user?.skills) ? user.skills.join(", ") : "",
        githubUrl: user?.githubUrl || "",
        linkedinUrl: user?.linkedinUrl || "",
        portfolioUrl: user?.portfolioUrl || "",
        profileImage: user?.profileImage || "",
      });
      hasInitializedRef.current = true;
    }
  }, [navigate, reset, user]);

  const step = STEPS[currentStep];
  const c = colorMap[step.color];
  const isLastStep = currentStep === STEPS.length - 1;

  const handleNext = useCallback(async () => {
    const valid = await trigger(step.fields);
    if (!valid) return;
    setDirection(1);
    setCurrentStep((prev) => prev + 1);
  }, [trigger, step.fields]);

  const handleBack = useCallback(() => {
    setDirection(-1);
    setCurrentStep((prev) => prev - 1);
  }, []);

  const onSubmit = async (values) => {
    try {
      const payload = {
        ...values,
        githubUrl: values.githubUrl?.trim() || "",
        linkedinUrl: values.linkedinUrl?.trim() || "",
        portfolioUrl: values.portfolioUrl?.trim() || "",
      };

      const updatedUser = await studentService.updateProfile(payload);
      dispatch(setCredentials({ user: updatedUser, accessToken }));
      toast.success("Profile completed!");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to save profile");
    }
  };

  const inputClass = (hasError, colorKey = "cyan") =>
    `w-full rounded-2xl border ${
      hasError ? "border-rose-400/50 bg-rose-400/5" : "border-white/10 bg-white/[0.05]"
    } px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none transition-all duration-200 ${
      colorMap[colorKey].focusInput
    }`;

  return (
    <div className="fixed inset-0 overflow-hidden bg-slate-950">
      {/* Background decorations */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 opacity-[0.025] bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] bg-[size:36px_36px]" />
        <motion.div
          animate={{
            background:
              currentStep === 0
                ? "radial-gradient(ellipse 440px 440px at -10% 10%, rgba(6,182,212,0.07), transparent)"
                : currentStep === 1
                ? "radial-gradient(ellipse 440px 440px at -10% 10%, rgba(139,92,246,0.07), transparent)"
                : currentStep === 2
                ? "radial-gradient(ellipse 440px 440px at -10% 10%, rgba(52,211,153,0.07), transparent)"
                : "radial-gradient(ellipse 440px 440px at -10% 10%, rgba(251,191,36,0.07), transparent)",
          }}
          transition={{ duration: 0.6 }}
          className="absolute -top-40 -left-20 h-[440px] w-[440px]"
        />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-violet-500/5 blur-[70px]" />
      </div>

      {/* Main layout */}
      <div className="relative flex h-full items-center justify-center px-4">
        <div className="w-full max-w-5xl">
          <div className="grid w-full rounded-[32px] border border-white/10 bg-white/[0.035] shadow-2xl shadow-black/40 backdrop-blur-xl lg:grid-cols-[1fr_1fr] overflow-hidden"
               style={{ height: "min(580px, calc(100vh - 40px))" }}>

            {/* ── LEFT PANEL: Live preview ── */}
            <div className="relative hidden lg:flex flex-col border-r border-white/10 bg-gradient-to-br from-white/[0.02] to-transparent">
              {/* Step color accent bar */}
              <motion.div
                animate={{ opacity: 1 }}
                className="absolute top-0 left-0 right-0 h-[2px]"
                style={{
                  background:
                    currentStep === 0
                      ? "linear-gradient(90deg, rgba(6,182,212,0.6), transparent)"
                      : currentStep === 1
                      ? "linear-gradient(90deg, rgba(139,92,246,0.6), transparent)"
                      : currentStep === 2
                      ? "linear-gradient(90deg, rgba(52,211,153,0.6), transparent)"
                      : "linear-gradient(90deg, rgba(251,191,36,0.6), transparent)",
                }}
              />

              {/* Progress dots — vertical */}
              <div className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col gap-3">
                {STEPS.map((s, i) => {
                  const StepIcon = s.icon;
                  const done = i < currentStep;
                  const active = i === currentStep;
                  return (
                    <div key={s.id} className="flex items-center gap-2">
                      <motion.div
                        animate={{
                          scale: active ? 1 : 0.75,
                          opacity: active ? 1 : done ? 0.9 : 0.3,
                        }}
                        className={`w-7 h-7 rounded-full flex items-center justify-center border transition-all duration-300 ${
                          done
                            ? "border-emerald-400/40 bg-emerald-400/15"
                            : active
                            ? `border border-${s.color}-400/40 bg-${s.color}-400/15`
                            : "border-white/10 bg-white/5"
                        }`}
                      >
                        {done ? (
                          <Check size={12} className="text-emerald-300" />
                        ) : (
                          <StepIcon
                            size={12}
                            className={
                              active ? colorMap[s.color].icon : "text-white/30"
                            }
                          />
                        )}
                      </motion.div>
                      {active && (
                        <motion.span
                          initial={{ opacity: 0, x: -4 }}
                          animate={{ opacity: 1, x: 0 }}
                          className={`text-[11px] font-medium tracking-wide ${c.accent}`}
                        >
                          {s.label}
                        </motion.span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Live avatar preview */}
              <div className="relative flex-1 pl-16">
                <AvatarPreview
                  name={watchedValues.name}
                  headline={watchedValues.headline}
                  location={watchedValues.location}
                  skills={watchedValues.skills}
                  profileImage={watchedValues.profileImage}
                  currentStep={currentStep}
                />
              </div>
            </div>

            {/* ── RIGHT PANEL: Form ── */}
            <div className="flex flex-col bg-slate-950/70 p-7 lg:p-8">
              {/* Header */}
              <div className="mb-6 flex-shrink-0">
                <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.22em] mb-4 ${c.badge}`}>
                  <Sparkles size={11} />
                  Step {currentStep + 1} of {STEPS.length}
                </div>

                {/* Progress bar */}
                <div className="h-[2px] w-full rounded-full bg-white/5 mb-5">
                  <motion.div
                    className={`h-full rounded-full`}
                    animate={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    style={{
                      background:
                        currentStep === 0
                          ? "rgba(6,182,212,0.7)"
                          : currentStep === 1
                          ? "rgba(139,92,246,0.7)"
                          : currentStep === 2
                          ? "rgba(52,211,153,0.7)"
                          : "rgba(251,191,36,0.7)",
                    }}
                  />
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={`heading-${currentStep}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.22 }}
                  >
                    <h2 className="text-xl font-semibold text-white leading-tight">
                      {currentStep === 0 && "Who are you?"}
                      {currentStep === 1 && "Where are you based?"}
                      {currentStep === 2 && "What do you know?"}
                      {currentStep === 3 && "Share your professional links"}
                      {currentStep === 4 && "Put a face to your name"}
                    </h2>
                    <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                      {currentStep === 0 && "Your name and headline will appear across the platform."}
                      {currentStep === 1 && "Help recruiters and the platform understand your context."}
                      {currentStep === 2 && "List the skills you bring to the table."}
                      {currentStep === 3 && "Add your GitHub, LinkedIn, and portfolio links to stand out."}
                      {currentStep === 4 && "Optionally add a profile photo URL. You can skip this."}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Step fields */}
              <div className="flex-1 min-h-0">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={`step-${currentStep}`}
                    custom={direction}
                    variants={stepVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="space-y-4 h-full"
                  >
                    {/* STEP 1: Identity */}
                    {currentStep === 0 && (
                      <>
                        <label className="block">
                          <span className="mb-1.5 block text-xs font-medium text-slate-400">
                            Full name <span className="text-rose-400">*</span>
                          </span>
                          <input
                            {...register("name", { required: "Name is required" })}
                            className={inputClass(errors.name, "cyan")}
                            placeholder="Aditya Kumar"
                            autoFocus
                          />
                          {errors.name && (
                            <p className="mt-1 text-xs text-rose-400">{errors.name.message}</p>
                          )}
                        </label>

                        <label className="block">
                          <span className="mb-1.5 block text-xs font-medium text-slate-400">
                            Headline
                          </span>
                          <input
                            {...register("headline")}
                            className={inputClass(false, "cyan")}
                            placeholder="Full-Stack Engineer · AIML · Open to work"
                          />
                          <p className="mt-1 text-[11px] text-white/25">
                            Shows below your name on your profile card.
                          </p>
                        </label>
                      </>
                    )}

                    {/* STEP 2: Location & Bio */}
                    {currentStep === 1 && (
                      <>
                        <label className="block">
                          <span className="mb-1.5 block text-xs font-medium text-slate-400">
                            Location <span className="text-rose-400">*</span>
                          </span>
                          <input
                            {...register("location", { required: "Location is required" })}
                            className={inputClass(errors.location, "violet")}
                            placeholder="New Delhi, India"
                            autoFocus
                          />
                          {errors.location && (
                            <p className="mt-1 text-xs text-rose-400">{errors.location.message}</p>
                          )}
                        </label>

                        <label className="block">
                          <span className="mb-1.5 block text-xs font-medium text-slate-400">
                            Bio <span className="text-rose-400">*</span>
                          </span>
                          <textarea
                            rows={4}
                            {...register("bio", { required: "Bio is required" })}
                            className={`${inputClass(errors.bio, "violet")} resize-none`}
                            placeholder="A short summary about your goals and background…"
                          />
                          {errors.bio && (
                            <p className="mt-1 text-xs text-rose-400">{errors.bio.message}</p>
                          )}
                        </label>
                      </>
                    )}

                    {/* STEP 3: Skills */}
                    {currentStep === 2 && (
                      <label className="block">
                        <span className="mb-1.5 block text-xs font-medium text-slate-400">
                          Skills <span className="text-rose-400">*</span>
                        </span>
                        <textarea
                          rows={3}
                          {...register("skills", { required: "Add at least one skill" })}
                          className={`${inputClass(errors.skills, "emerald")} resize-none`}
                          placeholder="React, Node.js, Python, MongoDB, FastAPI…"
                          autoFocus
                        />
                        <p className="mt-1.5 text-[11px] text-white/25">
                          Separate with commas. Used for smarter interview recommendations.
                        </p>
                        {errors.skills && (
                          <p className="mt-1 text-xs text-rose-400">{errors.skills.message}</p>
                        )}

                        {/* Live chip preview */}
                        {watchedValues.skills && (
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {watchedValues.skills
                              .split(",")
                              .map((s) => s.trim())
                              .filter(Boolean)
                              .slice(0, 10)
                              .map((skill, i) => (
                                <motion.span
                                  key={`${skill}-${i}`}
                                  initial={{ opacity: 0, scale: 0.85 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  className="px-2.5 py-0.5 rounded-lg border border-emerald-400/20 bg-emerald-400/8 text-emerald-300 text-[11px] font-medium"
                                >
                                  {skill}
                                </motion.span>
                              ))}
                          </div>
                        )}
                      </label>
                    )}

                    {/* STEP 4: Social links & certifications */}
                    {currentStep === 3 && (
                      <div className="space-y-4">
                        <label className="block">
                          <span className="mb-1.5 block text-xs font-medium text-slate-400">
                            GitHub URL <span className="text-rose-400">*</span>
                          </span>
                          <input
                            {...register("githubUrl", { required: "GitHub URL is required" })}
                            className={inputClass(errors.githubUrl, "emerald")}
                            placeholder="https://github.com/your-username"
                          />
                          {errors.githubUrl && (
                            <p className="mt-1 text-xs text-rose-400">{errors.githubUrl.message}</p>
                          )}
                        </label>

                        <label className="block">
                          <span className="mb-1.5 block text-xs font-medium text-slate-400">
                            LinkedIn URL <span className="text-rose-400">*</span>
                          </span>
                          <input
                            {...register("linkedinUrl", { required: "LinkedIn URL is required" })}
                            className={inputClass(errors.linkedinUrl, "emerald")}
                            placeholder="https://www.linkedin.com/in/your-profile"
                          />
                          {errors.linkedinUrl && (
                            <p className="mt-1 text-xs text-rose-400">{errors.linkedinUrl.message}</p>
                          )}
                        </label>

                        <label className="block">
                          <span className="mb-1.5 block text-xs font-medium text-slate-400">
                            Portfolio URL
                          </span>
                          <input
                            {...register("portfolioUrl")}
                            className={inputClass(false, "emerald")}
                            placeholder="https://your-portfolio.com"
                          />
                        </label>
                      </div>
                    )}

                    {/* STEP 5: Photo */}
                    {currentStep === 4 && (
                      <div className="space-y-4">
                        <label className="block">
                          <span className="mb-1.5 block text-xs font-medium text-slate-400">
                            Profile image URL
                          </span>
                          <input
                            {...register("profileImage")}
                            className={inputClass(false, "amber")}
                            placeholder="https://avatars.githubusercontent.com/u/…"
                            autoFocus
                          />
                          <p className="mt-1 text-[11px] text-white/25">
                            Optional — paste any publicly accessible image URL.
                          </p>
                        </label>

                        {/* Preview card */}
                        {watchedValues.profileImage && (
                          <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3"
                          >
                            <img
                              src={watchedValues.profileImage}
                              alt="Preview"
                              className="w-11 h-11 rounded-full object-cover border border-white/10"
                              onError={(e) => {
                                e.target.src = "";
                                e.target.style.display = "none";
                              }}
                            />
                            <div>
                              <p className="text-sm text-white font-medium">
                                {watchedValues.name || "Your name"}
                              </p>
                              <p className="text-xs text-slate-400">
                                {watchedValues.headline || "Your headline"}
                              </p>
                            </div>
                          </motion.div>
                        )}

                        {/* Skip info */}
                        <div className="flex items-start gap-2 rounded-2xl border border-white/6 bg-white/[0.025] px-4 py-3 text-xs text-slate-400">
                          <User size={13} className="mt-0.5 text-amber-300/60 flex-shrink-0" />
                          <span>
                            If you skip this, your initials will be shown instead. You can update your photo from the dashboard later.
                          </span>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Navigation */}
              <div className="flex items-center gap-3 mt-6 flex-shrink-0">
                {currentStep > 0 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex items-center gap-1.5 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
                  >
                    <ChevronLeft size={15} />
                    Back
                  </button>
                )}

                <div className="flex-1" />

                {/* Step dots — mobile fallback */}
                <div className="flex gap-1.5 lg:hidden">
                  {STEPS.map((_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === currentStep
                          ? `w-5 ${c.dot}`
                          : i < currentStep
                          ? "w-1.5 bg-emerald-400/60"
                          : "w-1.5 bg-white/15"
                      }`}
                    />
                  ))}
                </div>

                <div className="flex-1 lg:hidden" />

                {!isLastStep ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className={`flex items-center gap-1.5 rounded-2xl px-5 py-2.5 text-sm font-semibold transition ${c.btn}`}
                  >
                    Continue
                    <ChevronRight size={15} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit(onSubmit)}
                    disabled={isSubmitting}
                    className={`flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed ${c.btn}`}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="h-3.5 w-3.5 rounded-full border-2 border-slate-900/40 border-t-slate-900 animate-spin" />
                        Saving…
                      </>
                    ) : (
                      <>
                        <Check size={15} />
                        Complete profile
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Bottom micro-copy */}
          <p className="text-center text-[11px] text-white/20 mt-3">
            All details can be changed from your dashboard later.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CompleteProfile;