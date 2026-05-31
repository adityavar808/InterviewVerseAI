import { Link } from "react-router-dom";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  Bot,
  Brain,
  Briefcase,
  CheckCircle2,
  ChevronRight,
  Code2,
  Database,
  FileText,
  LayoutDashboard,
  Menu,
  Mic,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  X,
  Zap,
} from "lucide-react";

// ─── Motion Variants ─────────────────────────────────────────────────────────
const fadeInUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.55, ease: "easeOut" },
};

// ─── Constants ────────────────────────────────────────────────────────────────
const navItems = [
  { label: "Overview", href: "#overview" },
  { label: "Workflow", href: "#workflow" },
  { label: "Features", href: "#features" },
  { label: "Admin", href: "#admin" },
];

const proofPoints = [
  "AI mock interviews",
  "ATS resume scoring",
  "Coding round practice",
  "Progress analytics",
];

const featureShowcase = [
  {
    id: "01",
    title: "Practice interviews that feel role-specific",
    description:
      "Students can move between frontend, backend, HR, and mixed interview tracks with adaptive prompts and structured feedback after each session.",
    points: [
      "Role-based interview categories",
      "Voice-style communication practice",
      "Actionable feedback after every round",
    ],
    icon: Brain,
    accent: "cyan",
  },
  {
    id: "02",
    title: "Improve resumes with clear next actions",
    description:
      "Instead of generic resume advice, users can see ATS score movement, missing keywords, and role alignment recommendations in one focused workspace.",
    points: [
      "ATS score visibility",
      "Keyword and alignment gaps",
      "Target-role improvement guidance",
    ],
    icon: FileText,
    accent: "emerald",
  },
  {
    id: "03",
    title: "Prepare for coding rounds inside the same product",
    description:
      "A dedicated coding environment helps students solve problems, run tests, and review solutions without switching away from their interview prep flow.",
    points: [
      "Problem statement and editor",
      "Test case execution",
      "AI-supported review flow",
    ],
    icon: Code2,
    accent: "violet",
  },
];

const adminCards = [
  {
    icon: Users,
    title: "User visibility",
    description:
      "Review registered users, role access, and activity status from one dedicated admin layer.",
  },
  {
    icon: Brain,
    title: "Interview oversight",
    description:
      "Track interview activity and manage the system with a clearer operational view.",
  },
  {
    icon: Database,
    title: "Question operations",
    description:
      "Maintain coding question sets and grow the technical practice library over time.",
  },
  {
    icon: ShieldCheck,
    title: "Separated access",
    description:
      "Keep admin entry distinct so student onboarding stays clean and intuitive.",
  },
];

// ─── Scroll Progress Bar ──────────────────────────────────────────────────────
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });
  return (
    <motion.div
      style={{ scaleX, transformOrigin: "left" }}
      className="fixed top-0 left-0 right-0 z-[100] h-[2px] bg-gradient-to-r from-cyan-400 via-cyan-300 to-emerald-400"
    />
  );
}

// ─── Mobile Nav ───────────────────────────────────────────────────────────────
function MobileMenu({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-72 bg-slate-900 border-l border-white/10 p-6 flex flex-col"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 flex items-center justify-center rounded-xl bg-cyan-400 text-slate-950">
                  <Sparkles size={14} />
                </div>
                <span className="text-sm font-semibold text-white">
                  InterviewVerse
                </span>
              </div>
              <button
                onClick={onClose}
                className="h-8 w-8 flex items-center justify-center rounded-xl border border-white/10 text-slate-400 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <nav className="flex flex-col gap-1">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className="rounded-xl px-4 py-3 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="mt-auto flex flex-col gap-3 pt-6 border-t border-white/10">
              <Link
                to="/login"
                onClick={onClose}
                className="w-full rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-center text-slate-200 hover:bg-white/5 transition"
              >
                Student Login
              </Link>
              <Link
                to="/register"
                onClick={onClose}
                className="w-full rounded-xl bg-cyan-400 px-4 py-3 text-sm font-semibold text-center text-slate-950 hover:bg-cyan-300 transition"
              >
                Register Free
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function LandingPage() {
  const { scrollY } = useScroll();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  // Defined once — not inside render
  const parallaxConfig = { stiffness: 110, damping: 24, mass: 0.3 };
  const heroY = useSpring(
    useTransform(scrollY, [0, 700], [0, -20]),
    parallaxConfig,
  );
  const panelY = useSpring(
    useTransform(scrollY, [0, 700], [0, 28]),
    parallaxConfig,
  );
  const ctaY = useSpring(
    useTransform(scrollY, [900, 2600], [0, -20]),
    parallaxConfig,
  );

  // Active section tracking for nav highlight
  useEffect(() => {
    const sections = navItems.map((n) => n.href.replace("#", ""));
    const observers = sections.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { rootMargin: "-40% 0px -55% 0px" },
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  return (
    <>
      {/* Skip to content — accessibility */}
      <a
        href="#overview"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:rounded-xl focus:bg-cyan-400 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-slate-950"
      >
        Skip to content
      </a>

      <ScrollProgress />

      <div className="relative min-h-screen overflow-x-hidden bg-slate-950 text-white">
        {/* Background layers */}
        <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_80%_50%_at_-10%_-10%,rgba(34,211,238,0.10),transparent),radial-gradient(ellipse_60%_40%_at_110%_10%,rgba(99,102,241,0.06),transparent)]" />
        <div className="pointer-events-none fixed inset-0 opacity-[0.035] bg-[linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] bg-[size:72px_72px]" />

        {/* ── Header ────────────────────────────────────────────────────────── */}
        <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-slate-950/80 backdrop-blur-2xl">
          <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-5 md:px-8">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 shrink-0">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-400 text-slate-950 shadow-[0_0_20px_rgba(34,211,238,0.3)]">
                <Sparkles size={16} />
              </div>
              <div>
                <p className="text-sm font-semibold leading-none tracking-tight text-white">
                  InterviewVerse AI
                </p>
                <p className="mt-0.5 text-[10px] uppercase tracking-[0.2em] text-slate-500">
                  Career Prep
                </p>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden items-center gap-1 lg:flex">
              {navItems.map((item) => {
                const id = item.href.replace("#", "");
                const isActive = activeSection === id;
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    className={`relative rounded-lg px-4 py-2 text-sm transition-colors ${
                      isActive
                        ? "text-white"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 rounded-lg bg-white/8"
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 30,
                        }}
                      />
                    )}
                    <span className="relative">{item.label}</span>
                  </a>
                );
              })}
            </nav>

            {/* Desktop CTAs */}
            <div className="hidden items-center gap-2 md:flex">
              <Link
                to="/login"
                className="rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="rounded-xl bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 shadow-[0_0_16px_rgba(34,211,238,0.2)]"
              >
                Get started free
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 text-slate-300 hover:text-white transition md:hidden"
              aria-label="Open menu"
            >
              <Menu size={18} />
            </button>
          </div>
        </header>

        <MobileMenu
          open={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        />

        <main className="relative z-10">
          {/* ── Hero ──────────────────────────────────────────────────────────── */}
          <section className="mx-auto max-w-7xl px-5 pb-16 pt-12 md:px-8 lg:pb-20 lg:pt-14">
            <div className="grid items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                style={{ y: heroY }}
              >
                {/* Pill badge */}
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/8 px-4 py-1.5 text-sm text-cyan-300">
                  <Zap size={13} />
                  Built for placement preparation
                </div>

                <h1 className="mt-5 max-w-2xl text-4xl font-bold leading-[1.06] tracking-[-0.02em] text-white sm:text-5xl lg:text-6xl">
                  One place to practice, improve, and get placement-ready.
                </h1>

                <p className="mt-5 max-w-xl text-base leading-7 text-slate-400">
                  InterviewVerse AI connects resume review, mock interviews, and
                  coding practice into one workflow — so progress is always
                  visible and the next step is always clear.
                </p>

                {/* Social proof pills — was defined but never rendered */}
                <div className="mt-6 flex flex-wrap gap-2">
                  {proofPoints.map((pt) => (
                    <span
                      key={pt}
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-slate-300"
                    >
                      <CheckCircle2 size={11} className="text-cyan-400" />
                      {pt}
                    </span>
                  ))}
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    to="/register"
                    className="group inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-6 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 shadow-[0_0_24px_rgba(34,211,238,0.22)]"
                  >
                    Create free account
                    <ArrowRight
                      size={15}
                      className="transition group-hover:translate-x-1"
                    />
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-6 py-3.5 text-sm font-medium text-slate-200 transition hover:bg-white/8"
                  >
                    Sign in
                  </Link>
                </div>
              </motion.div>

              {/* Hero dashboard card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.97, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
                style={{ y: panelY }}
                className="relative"
              >
                <div className="absolute inset-0 -z-10 rounded-[28px] bg-cyan-400/10 blur-3xl scale-90" />
                <div className="rounded-[22px] border border-white/10 bg-slate-900/80 p-2.5 shadow-[0_24px_60px_rgba(2,6,23,0.5)] backdrop-blur-xl">
                  <div className="overflow-hidden rounded-[18px] border border-white/[0.08] bg-slate-950">
                    {/* Window chrome */}
                    <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-rose-400/70" />
                          <span className="h-2 w-2 rounded-full bg-amber-300/70" />
                          <span className="h-2 w-2 rounded-full bg-emerald-400/70" />
                        </div>
                        <p className="text-xs font-medium text-slate-400">
                          Student Dashboard
                        </p>
                      </div>
                      <span className="rounded-full border border-cyan-400/20 bg-cyan-400/8 px-2.5 py-1 text-[10px] text-cyan-300">
                        Live
                      </span>
                    </div>

                    {/* Dashboard content */}
                    <div className="p-3 space-y-2">
                      {/* Recommended session */}
                      <div className="rounded-[14px] border border-white/[0.08] bg-white/[0.03] p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
                              Next session
                            </p>
                            <h3 className="mt-1.5 text-base font-semibold text-white">
                              Frontend interview practice
                            </h3>
                            <p className="mt-1.5 text-xs leading-5 text-slate-400">
                              React, JavaScript, APIs and project walkthrough.
                            </p>
                          </div>
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10">
                            <Brain size={18} className="text-cyan-300" />
                          </div>
                        </div>
                      </div>

                      {/* Prep tracks */}
                      <div className="rounded-[14px] border border-white/[0.08] bg-white/[0.03] p-4">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-xs font-semibold text-white">
                            Preparation tracks
                          </p>
                          <LayoutDashboard
                            size={14}
                            className="text-slate-500"
                          />
                        </div>
                        <div className="space-y-2">
                          {[
                            {
                              title: "Frontend track",
                              copy: "React, JS, DOM, projects",
                              color: "text-cyan-300 bg-cyan-400/10",
                            },
                            {
                              title: "HR interview",
                              copy: "Communication & storytelling",
                              color: "text-emerald-300 bg-emerald-400/10",
                            },
                            {
                              title: "Coding rounds",
                              copy: "DSA, logic, test cases",
                              color: "text-violet-300 bg-violet-400/10",
                            },
                          ].map((item) => (
                            <div
                              key={item.title}
                              className="flex items-center justify-between rounded-xl border border-white/[0.08] bg-slate-950/60 px-3 py-2.5"
                            >
                              <div>
                                <p className="text-xs font-medium text-white">
                                  {item.title}
                                </p>
                                <p className="mt-0.5 text-[10px] text-slate-500">
                                  {item.copy}
                                </p>
                              </div>
                              <span
                                className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium ${item.color}`}
                              >
                                Active
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* ── Overview ──────────────────────────────────────────────────────── */}
          <section
            id="overview"
            className="mx-auto max-w-7xl scroll-mt-24 px-5 py-14 md:px-8 lg:py-20"
          >
            <motion.div
              {...fadeInUp}
              className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-400">
                  Product overview
                </p>
                <h2 className="mt-4 text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl">
                  One workspace. Complete preparation.
                </h2>
              </div>
              <p className="text-lg leading-8 text-slate-400">
                Students don't need separate tools for resumes, interviews,
                coding, and progress tracking — the full preparation flow lives
                here, connected and context-aware.
              </p>
            </motion.div>

            <div className="mt-10 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
              <motion.div
                {...fadeInUp}
                className="group rounded-[24px] border border-white/[0.08] bg-white/[0.03] p-7 transition hover:border-white/[0.14] hover:bg-white/[0.05]"
              >
                <div className="flex items-center gap-2 text-cyan-400">
                  <Brain size={17} />
                  <p className="text-xs font-semibold uppercase tracking-[0.2em]">
                    Core value
                  </p>
                </div>
                <h3 className="mt-5 text-2xl font-semibold text-white md:text-3xl">
                  Interview prep is easier when the workflow stays connected.
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-400">
                  Review resume → start mock interview → practice coding → track
                  improvement, all without losing context between tools.
                </p>

                <div className="mt-7 grid gap-3 sm:grid-cols-3">
                  {[
                    {
                      label: "Resume",
                      copy: "ATS score, keyword gaps, role alignment.",
                    },
                    {
                      label: "Interview",
                      copy: "Technical and behavioral with structured feedback.",
                    },
                    {
                      label: "Code",
                      copy: "Problems, test execution, and AI review.",
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-xl border border-white/[0.08] bg-slate-950/60 p-4"
                    >
                      <p className="text-sm font-semibold text-white">
                        {item.label}
                      </p>
                      <p className="mt-1.5 text-xs leading-5 text-slate-500">
                        {item.copy}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div className="grid gap-5" {...fadeInUp}>
                {[
                  {
                    title: "Visible progress keeps students returning",
                    copy: "Streaks, recommendations, weak-area signals, and trend summaries create a stronger reason to come back.",
                    icon: BarChart3,
                  },
                  {
                    title: "Understand the product in one scroll",
                    copy: "The structure explains what students can do before asking them to register — reducing confusion at the critical moment.",
                    icon: Sparkles,
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.title}
                      className="group rounded-[24px] border border-white/[0.08] bg-white/[0.03] p-6 transition hover:border-white/[0.14] hover:bg-white/[0.05]"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
                        <Icon size={17} className="text-slate-300" />
                      </div>
                      <h3 className="mt-4 text-xl font-semibold text-white">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm leading-7 text-slate-400">
                        {item.copy}
                      </p>
                    </div>
                  );
                })}
              </motion.div>
            </div>
          </section>

          {/* ── Workflow ───────────────────────────────────────────────────────── */}
          <section
            id="workflow"
            className="mx-auto max-w-7xl scroll-mt-24 px-5 py-14 md:px-8 lg:py-20"
          >
            <div className="grid gap-12 lg:grid-cols-[0.86fr_1.14fr]">
              <motion.div
                {...fadeInUp}
                className="lg:sticky lg:top-28 lg:self-start"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-400">
                  Workflow
                </p>
                <h2 className="mt-4 text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl">
                  A journey that feels complete
                </h2>
                <p className="mt-5 text-base leading-7 text-slate-400">
                  Instead of isolated features, the platform feels like one
                  preparation system that helps students move from confusion to
                  measurable readiness.
                </p>

                <div className="mt-7 rounded-[20px] border border-white/[0.08] bg-white/[0.03] p-5">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-slate-600">
                    Core promise
                  </p>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    Students should feel they can start quickly, understand what
                    to improve next, and keep returning because progress is
                    visible.
                  </p>
                </div>
              </motion.div>

              <div className="space-y-4">
                {[
                  {
                    step: "01",
                    title: "Create an account and choose a track",
                    text: "The first screen makes the use case obvious so registration feels like the natural next action.",
                    color: "bg-cyan-400/10 text-cyan-300 border-cyan-400/20",
                  },
                  {
                    step: "02",
                    title: "Move across resume, interview, and coding",
                    text: "The experience keeps context connected instead of sending the student into separate, disconnected tools.",
                    color:
                      "bg-emerald-400/10 text-emerald-300 border-emerald-400/20",
                  },
                  {
                    step: "03",
                    title: "Return because the platform shows momentum",
                    text: "Recommendations, analytics, and streak-style progress make the product feel useful beyond a single session.",
                    color:
                      "bg-violet-400/10 text-violet-300 border-violet-400/20",
                  },
                ].map((item) => (
                  <motion.div
                    key={item.step}
                    {...fadeInUp}
                    className="group rounded-[22px] border border-white/[0.08] bg-white/[0.03] p-6 transition hover:border-white/[0.14] hover:bg-white/[0.05]"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border text-xs font-bold ${item.color}`}
                      >
                        {item.step}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {item.title}
                        </h3>
                        <p className="mt-2 text-sm leading-7 text-slate-400">
                          {item.text}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* ── Features ───────────────────────────────────────────────────────── */}
          <section
            id="features"
            className="mx-auto max-w-7xl scroll-mt-24 px-5 py-14 md:px-8 lg:py-20"
          >
            <motion.div {...fadeInUp} className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-violet-400">
                Features
              </p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl">
                Demonstrate the product, not just list it
              </h2>
              <p className="mt-5 text-base leading-7 text-slate-400">
                Each section works as a product-led showcase so visitors
                understand both capability and usefulness in the same glance.
              </p>
            </motion.div>

            <div className="mt-10 space-y-5">
              {featureShowcase.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.id}
                    {...fadeInUp}
                    transition={{ ...fadeInUp.transition, delay: index * 0.06 }}
                    className="grid gap-5 rounded-[28px] border border-white/[0.08] bg-white/[0.02] p-5 lg:grid-cols-[0.88fr_1.12fr] lg:p-7"
                  >
                    {/* Left: text */}
                    <div className="flex flex-col justify-between rounded-[20px] border border-white/[0.08] bg-slate-950/70 p-5">
                      <div>
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.05]">
                            <Icon size={19} className="text-slate-200" />
                          </div>
                          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-600">
                            Feature {feature.id}
                          </p>
                        </div>
                        <h3 className="mt-5 text-xl font-semibold text-white md:text-2xl">
                          {feature.title}
                        </h3>
                        <p className="mt-3 text-sm leading-7 text-slate-400">
                          {feature.description}
                        </p>
                      </div>
                      <div className="mt-6 space-y-2">
                        {feature.points.map((point) => (
                          <div
                            key={point}
                            className="flex items-start gap-2.5 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2.5"
                          >
                            <CheckCircle2
                              size={14}
                              className="mt-0.5 shrink-0 text-cyan-400"
                            />
                            <p className="text-sm text-slate-300">{point}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right: visual */}
                    <div className="rounded-[20px] border border-white/[0.08] bg-gradient-to-br from-slate-900 to-slate-950 p-4">
                      {feature.id === "01" && (
                        <div className="grid h-full gap-3 md:grid-cols-2">
                          <div className="rounded-[16px] border border-white/[0.08] bg-white/[0.03] p-4">
                            <div className="flex items-center justify-between mb-4">
                              <p className="text-xs font-semibold text-white">
                                Mock session
                              </p>
                              <span className="rounded-full bg-cyan-400/10 px-2.5 py-1 text-[10px] text-cyan-300">
                                Adaptive
                              </span>
                            </div>
                            <div className="space-y-2">
                              {[
                                "Explain virtual DOM in React.",
                                "How would you optimize a slow component tree?",
                                "Describe one real project challenge you solved.",
                              ].map((q) => (
                                <div
                                  key={q}
                                  className="rounded-xl border border-white/[0.08] bg-slate-950/70 p-3 text-xs text-slate-400 leading-5"
                                >
                                  {q}
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="rounded-[16px] border border-white/[0.08] bg-cyan-400/[0.04] p-4">
                            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-600 mb-4">
                              Feedback
                            </p>
                            <div className="space-y-2">
                              {[
                                ["Technical depth", "Strong"],
                                ["Communication", "Improving"],
                                ["Confidence", "Good"],
                              ].map(([label, val]) => (
                                <div
                                  key={label}
                                  className="flex items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2.5"
                                >
                                  <p className="text-xs text-slate-400">
                                    {label}
                                  </p>
                                  <p className="text-xs font-semibold text-white">
                                    {val}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {feature.id === "02" && (
                        <div className="grid h-full gap-3 md:grid-cols-2">
                          <div className="rounded-[16px] border border-white/[0.08] bg-emerald-400/[0.04] p-4">
                            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-600 mb-4">
                              ATS score
                            </p>
                            <div className="flex items-end gap-2 h-20">
                              {[
                                { h: 46, label: "v1" },
                                { h: 58, label: "v2" },
                                { h: 72, label: "v3" },
                                { h: 88, label: "Now" },
                              ].map((bar) => (
                                <div
                                  key={bar.label}
                                  className="flex flex-1 flex-col items-center gap-1"
                                >
                                  <div
                                    className="w-full rounded-t-lg bg-emerald-400 opacity-80"
                                    style={{ height: `${bar.h}px` }}
                                  />
                                  <span className="text-[9px] text-slate-600">
                                    {bar.label}
                                  </span>
                                </div>
                              ))}
                            </div>
                            <p className="mt-3 text-xs text-emerald-400 font-medium">
                              +26 pts improvement
                            </p>
                          </div>
                          <div className="rounded-[16px] border border-white/[0.08] bg-white/[0.03] p-4">
                            <p className="text-xs font-semibold text-white mb-3">
                              Missing keywords
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {[
                                "REST APIs",
                                "System design",
                                "MongoDB",
                                "Testing",
                                "Performance",
                              ].map((tag) => (
                                <span
                                  key={tag}
                                  className="rounded-full border border-white/[0.08] bg-slate-950/70 px-2.5 py-1 text-[11px] text-slate-400"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                            <div className="mt-4 rounded-xl border border-white/[0.08] bg-slate-950/70 p-3">
                              <p className="text-[10px] uppercase tracking-[0.18em] text-slate-600">
                                Recommendation
                              </p>
                              <p className="mt-1.5 text-xs leading-5 text-slate-400">
                                Add backend project wording and role-specific
                                keywords in experience bullets.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {feature.id === "03" && (
                        <div className="grid h-full gap-3 md:grid-cols-2">
                          <div className="rounded-[16px] border border-white/[0.08] bg-white/[0.03] p-4">
                            <div className="flex items-center justify-between mb-3">
                              <p className="text-xs font-semibold text-white">
                                Coding workspace
                              </p>
                              <span className="rounded-full bg-violet-400/10 px-2.5 py-1 text-[10px] text-violet-300">
                                Live
                              </span>
                            </div>
                            <div className="rounded-xl border border-white/[0.08] bg-slate-950/70 p-3 font-mono text-[11px] leading-6 text-slate-400">
                              <p>{`function twoSum(nums, target) {`}</p>
                              <p className="pl-3">{`const map = new Map();`}</p>
                              <p className="pl-3">{`for (let i = 0; i < nums.length; i++) {`}</p>
                              <p className="pl-6 text-cyan-400">{`const diff = target - nums[i];`}</p>
                              <p className="pl-6 text-emerald-400">{`if (map.has(diff)) return [map.get(diff), i];`}</p>
                              <p className="pl-6">{`map.set(nums[i], i);`}</p>
                              <p className="pl-3">{`}`}</p>
                              <p>{`}`}</p>
                            </div>
                          </div>
                          <div className="rounded-[16px] border border-white/[0.08] bg-violet-400/[0.04] p-4">
                            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-600 mb-4">
                              Test results
                            </p>
                            <div className="space-y-2">
                              {[
                                ["Case 1", "Passed", true],
                                ["Case 2", "Passed", true],
                                ["Case 3", "Passed", true],
                                ["Case 4", "Passed", true],
                                ["Case 5", "Passed", true],
                                ["Case 6", "Passed", true],
                                ["Complexity", "O(n)", false],
                              ].map(([label, val, pass]) => (
                                <div
                                  key={label}
                                  className="flex items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2.5"
                                >
                                  <p className="text-xs text-slate-400">
                                    {label}
                                  </p>
                                  <p
                                    className={`text-xs font-semibold ${pass ? "text-emerald-400" : "text-white"}`}
                                  >
                                    {val}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>

          {/* ── Admin ──────────────────────────────────────────────────────────── */}
          <section
            id="admin"
            className="mx-auto max-w-7xl scroll-mt-24 px-5 py-14 md:px-8 lg:py-20"
          >
            <div className="overflow-hidden rounded-[28px] border border-white/[0.08] bg-slate-900/60 p-7 md:p-10">
              <div className="grid gap-10 lg:grid-cols-[0.84fr_1.16fr] lg:items-start">
                <motion.div {...fadeInUp}>
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs text-slate-300">
                    <ShieldCheck size={13} />
                    Admin access
                  </div>

                  <h2 className="mt-5 text-3xl font-bold tracking-tight text-white md:text-4xl">
                    Separate admin visibility without breaking the student flow
                  </h2>

                  <p className="mt-5 text-base leading-7 text-slate-400">
                    The student experience stays simple, while admins get a
                    direct operational path for managing users, interview
                    activity, and question libraries.
                  </p>

                  <div className="mt-7 space-y-2.5">
                    {[
                      "Direct admin login — no shared entry with students.",
                      "Cleaner product structure for institutions and teams.",
                      "Operational visibility separated from onboarding.",
                    ].map((point) => (
                      <div
                        key={point}
                        className="flex items-start gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-slate-300"
                      >
                        <CheckCircle2
                          size={14}
                          className="mt-0.5 shrink-0 text-cyan-400"
                        />
                        <p>{point}</p>
                      </div>
                    ))}
                  </div>

                  {/* Clear visual hierarchy — primary vs secondary */}
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link
                      to="/admin-login"
                      className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
                    >
                      Open Admin Login
                      <ArrowRight size={14} />
                    </Link>
                    <Link
                      to="/register"
                      className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-6 py-3 text-sm text-slate-300 transition hover:bg-white/[0.05]"
                    >
                      Student Registration
                    </Link>
                  </div>
                </motion.div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {adminCards.map((card, index) => {
                    const Icon = card.icon;
                    return (
                      <motion.div
                        key={card.title}
                        {...fadeInUp}
                        transition={{
                          ...fadeInUp.transition,
                          delay: index * 0.06,
                        }}
                        className="group rounded-[20px] border border-white/[0.08] bg-white/[0.03] p-5 transition hover:border-white/[0.14] hover:bg-white/[0.05]"
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04]">
                          <Icon size={17} className="text-slate-300" />
                        </div>
                        <h3 className="mt-4 text-base font-semibold text-white">
                          {card.title}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-slate-500">
                          {card.description}
                        </p>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* ── CTA ────────────────────────────────────────────────────────────── */}
          <section className="mx-auto max-w-7xl px-5 pb-20 pt-4 md:px-8 lg:pb-28">
            <motion.div
              {...fadeInUp}
              style={{ y: ctaY }}
              className="relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-cyan-400/[0.05] p-8 text-center md:p-14"
            >
              {/* Subtle glow */}
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(34,211,238,0.08),transparent)]" />

              <p className="relative text-xs font-semibold uppercase tracking-[0.24em] text-cyan-400">
                Get started
              </p>
              <h2 className="relative mx-auto mt-4 max-w-2xl text-3xl font-bold tracking-tight text-white md:text-4xl">
                Make the next step obvious as soon as the value is clear
              </h2>
              <p className="relative mx-auto mt-5 max-w-xl text-base leading-7 text-slate-400">
                Start with resume review, practice mock interviews, or go
                straight to coding — the platform meets you where you are.
              </p>

              {/* Focused CTA — reduced from 3 buttons to 2 */}
              <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  to="/register"
                  className="group inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-7 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 shadow-[0_0_24px_rgba(34,211,238,0.2)]"
                >
                  Create free account
                  <ArrowRight
                    size={14}
                    className="transition group-hover:translate-x-1"
                  />
                </Link>
                <Link
                  to="/admin-login"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-7 py-3.5 text-sm font-medium text-slate-300 transition hover:bg-white/[0.08]"
                >
                  Admin login
                </Link>
              </div>

              <p className="relative mt-4 text-xs text-slate-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-slate-400 underline underline-offset-2 hover:text-white transition"
                >
                  Sign in
                </Link>
              </p>
            </motion.div>
          </section>
        </main>

        {/* ── Footer ─────────────────────────────────────────────────────────── */}
        <footer className="border-t border-white/[0.06] bg-slate-950/80">
          <div className="mx-auto max-w-7xl px-5 py-8 md:px-8">
            <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-400 text-slate-950">
                  <Sparkles size={13} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">
                    InterviewVerse AI
                  </p>
                  <p className="text-[10px] text-slate-600">
                    Career Prep Workspace
                  </p>
                </div>
              </div>

              <nav className="flex flex-wrap gap-x-6 gap-y-2">
                {navItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="text-xs text-slate-600 hover:text-slate-300 transition-colors"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>

              <div className="flex gap-3">
                <Link
                  to="/login"
                  className="rounded-lg border border-white/[0.08] px-3.5 py-2 text-xs text-slate-400 hover:text-white transition"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="rounded-lg bg-cyan-400/10 border border-cyan-400/20 px-3.5 py-2 text-xs text-cyan-300 hover:bg-cyan-400/15 transition"
                >
                  Register
                </Link>
              </div>
            </div>

            <div className="mt-6 border-t border-white/[0.05] pt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[11px] text-slate-700">
                © {new Date().getFullYear()} InterviewVerse AI. All rights
                reserved.
              </p>
              <p className="text-[11px] text-slate-700">
                Built for students preparing for placements.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
