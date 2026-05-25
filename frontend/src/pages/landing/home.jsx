import { Link } from "react-router-dom";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
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
  Mic,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  Zap,
} from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.55, ease: "easeOut" },
};

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

const metrics = [
  { label: "Prep modes", value: "4+" },
  { label: "Core workflows", value: "Resume → Interview → Code" },
  { label: "Student focus", value: "Single workspace" },
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

export default function LandingPage() {
  const { scrollY } = useScroll();

  const parallaxSpring = {
    stiffness: 110,
    damping: 24,
    mass: 0.3,
  };

  const heroY = useSpring(useTransform(scrollY, [0, 700], [0, -24]), parallaxSpring);
  const panelY = useSpring(useTransform(scrollY, [0, 700], [0, 30]), parallaxSpring);
  const ctaY = useSpring(useTransform(scrollY, [900, 2600], [0, -24]), parallaxSpring);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_28%),radial-gradient(circle_at_top_right,rgba(15,23,42,0.35),transparent_30%),linear-gradient(to_bottom,rgba(15,23,42,0.2),rgba(2,6,23,0.96))]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.05] bg-[linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] bg-[size:72px_72px]" />

      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/75 backdrop-blur-2xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400 text-slate-950 shadow-[0_16px_40px_rgba(34,211,238,0.22)]">
              <Sparkles size={18} />
            </div>

            <div>
              <p className="text-base font-semibold tracking-tight text-white">
                InterviewVerse AI
              </p>
              <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                Career Prep Workspace
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 text-sm text-slate-300 lg:flex">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="transition-colors hover:text-white"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="hidden rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/5 md:inline-flex"
            >
              Student Login
            </Link>

            <Link
              to="/register"
              className="inline-flex rounded-xl bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              Register Free
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        <section className="mx-auto max-w-7xl pb-20 lg:pb-16 lg:pt-12">
          <div className="grid items-center gap-14 lg:grid-cols-[1.02fr_0.98fr]">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: "easeOut" }}
              style={{ y: heroY }}
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-200">
                <Zap size={16} />
                Built for students preparing for placements
              </div>

              <h1 className="mt-6 max-w-4xl text-5xl font-bold leading-[1.02] tracking-tight text-white sm:text-6xl xl:text-[4.4rem]">
                One place to practice interviews, improve resumes, and prepare for coding rounds.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                InterviewVerse AI helps students move from resume fixing to mock interviews to coding preparation inside one focused workflow that keeps progress visible.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
                <Link
                  to="/register"
                  className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-400 px-7 py-4 text-base font-semibold text-slate-950 transition hover:bg-cyan-300"
                >
                  Create Student Account
                  <ArrowRight
                    size={18}
                    className="transition group-hover:translate-x-1"
                  />
                </Link>

                <Link
                  to="/login"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-7 py-4 text-base font-medium text-white transition hover:bg-white/10"
                >
                  Student Login
                </Link>

                <Link
                  to="/admin-login"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-slate-900 px-7 py-4 text-base font-medium text-slate-200 transition hover:bg-slate-800"
                >
                  Admin Login
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.985 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              style={{ y: panelY }}
            >
              <div className="rounded-[32px] border border-white/10 bg-slate-900/70 p-4 shadow-[0_30px_100px_rgba(2,6,23,0.55)] backdrop-blur-xl">
                <div className="overflow-hidden rounded-[28px] border border-white/10 bg-slate-950">
                  <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-rose-400/80" />
                        <span className="h-2.5 w-2.5 rounded-full bg-amber-300/80" />
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                      </div>
                      <p className="text-sm font-medium text-slate-300">
                        Student Preparation Dashboard
                      </p>
                    </div>

                    <div className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-200">
                      Live progress
                    </div>
                  </div>

                  <div className="grid gap-4 p-5 lg:grid-cols-[1.05fr_0.95fr]">
                    <div className="space-y-4">
                      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                              Next recommended session
                            </p>
                            <h3 className="mt-3 text-2xl font-semibold text-white">
                              Frontend interview practice
                            </h3>
                            <p className="mt-3 max-w-md text-sm leading-7 text-slate-400">
                              Continue with React, JavaScript, APIs, and project explanation questions based on recent activity.
                            </p>
                          </div>

                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/10">
                            <Brain size={22} className="text-cyan-200" />
                          </div>
                        </div>

                        <div className="mt-6 grid gap-3 sm:grid-cols-3">
                          {[
                            ["Confidence", "78%"],
                            ["Weak area", "Problem solving"],
                            ["Streak", "6 days"],
                          ].map(([label, value]) => (
                            <div
                              key={label}
                              className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-4"
                            >
                              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                                {label}
                              </p>
                              <p className="mt-2 text-sm font-semibold text-slate-100">
                                {value}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
                          <div className="flex items-center gap-3">
                            <FileText size={18} className="text-emerald-300" />
                            <p className="text-sm font-semibold text-white">
                              Resume score
                            </p>
                          </div>
                          <p className="mt-4 text-4xl font-bold text-white">84</p>
                          <p className="mt-2 text-sm text-emerald-300">
                            +9 improvement this week
                          </p>
                          <div className="mt-5 h-2 rounded-full bg-white/10">
                            <div className="h-2 w-[84%] rounded-full bg-emerald-400" />
                          </div>
                        </div>

                        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
                          <div className="flex items-center gap-3">
                            <Code2 size={18} className="text-violet-300" />
                            <p className="text-sm font-semibold text-white">
                              Coding progress
                            </p>
                          </div>
                          <p className="mt-4 text-4xl font-bold text-white">27</p>
                          <p className="mt-2 text-sm text-slate-400">
                            problems practiced across key topics
                          </p>
                          <div className="mt-5 flex gap-2">
                            {["bg-violet-400", "bg-violet-400", "bg-violet-400", "bg-violet-400/40", "bg-violet-400/20"].map(
                              (bar, idx) => (
                                <span
                                  key={idx}
                                  className={`h-14 flex-1 rounded-full ${bar}`}
                                />
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-semibold text-white">
                            Preparation tracks
                          </p>
                          <LayoutDashboard size={18} className="text-slate-400" />
                        </div>

                        <div className="mt-5 space-y-3">
                          {[
                            {
                              title: "Frontend track",
                              copy: "React, JavaScript, DOM, projects",
                              tone: "bg-cyan-400/10 text-cyan-200",
                            },
                            {
                              title: "HR interview",
                              copy: "Communication, confidence, storytelling",
                              tone: "bg-emerald-400/10 text-emerald-200",
                            },
                            {
                              title: "Coding rounds",
                              copy: "DSA, logic, test cases, review",
                              tone: "bg-violet-400/10 text-violet-200",
                            },
                          ].map((item) => (
                            <div
                              key={item.title}
                              className="rounded-2xl border border-white/10 bg-slate-950/60 p-4"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <p className="text-sm font-semibold text-white">
                                    {item.title}
                                  </p>
                                  <p className="mt-1 text-sm leading-6 text-slate-400">
                                    {item.copy}
                                  </p>
                                </div>
                                <span
                                  className={`rounded-full px-3 py-1 text-xs font-medium ${item.tone}`}
                                >
                                  Active
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-3xl border border-white/10 bg-cyan-400/[0.06] p-5">
                        <div className="flex items-start gap-3">
                          <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-400/10">
                            <Target size={18} className="text-cyan-200" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-white">
                              Daily next step
                            </p>
                            <p className="mt-2 text-sm leading-7 text-slate-300">
                              Finish one frontend mock interview, improve two missing resume keywords, and solve one medium-level coding question.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
                        <div className="flex items-center gap-3">
                          <Mic size={18} className="text-amber-300" />
                          <p className="text-sm font-semibold text-white">
                            Communication practice
                          </p>
                        </div>
                        <p className="mt-4 text-sm leading-7 text-slate-400">
                          Voice-based sessions help students rehearse answers with more clarity before actual interviews.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section
          id="overview"
          className="mx-auto max-w-7xl scroll-mt-28 px-6 py-12 lg:py-16"
        >
          <motion.div
            {...fadeInUp}
            className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end"
          >
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-cyan-200">
                Product overview
              </p>
              <h2 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
                A clearer story from first visit to first practice session
              </h2>
            </div>

            <p className="max-w-3xl text-lg leading-8 text-slate-300">
              The page is designed to make one message obvious: students do not need separate tools for resumes, interviews, coding, and progress tracking when the full preparation flow already lives here.
            </p>
          </motion.div>

          <div className="mt-12 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <motion.div
              {...fadeInUp}
              className="rounded-[32px] border border-white/10 bg-white/[0.04] p-8"
            >
              <div className="flex items-center gap-3 text-cyan-200">
                <Brain size={20} />
                <p className="text-sm font-medium uppercase tracking-[0.2em]">
                  Main value
                </p>
              </div>
              <h3 className="mt-6 max-w-2xl text-3xl font-semibold text-white md:text-[2.2rem]">
                Interview prep feels easier when the workflow stays connected.
              </h3>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
                A student can review their resume, start a mock interview, practice coding, and return to track improvement without losing context or bouncing across different products.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {[
                  {
                    label: "Resume",
                    copy: "See ATS score, keyword gaps, and role alignment.",
                  },
                  {
                    label: "Interview",
                    copy: "Practice technical and behavioral sessions with feedback.",
                  },
                  {
                    label: "Code",
                    copy: "Solve problems with tests and AI review support.",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-white/10 bg-slate-950/60 p-4"
                  >
                    <p className="text-sm font-semibold text-white">{item.label}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      {item.copy}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div className="grid gap-6" {...fadeInUp}>
              {[
                {
                  title: "Visible progress keeps students returning",
                  copy:
                    "Streaks, recommendations, weak-area signals, and trend summaries create a stronger reason to come back.",
                  icon: BarChart3,
                },
                {
                  title: "The product value is understandable in one scroll",
                  copy:
                    "The structure reduces confusion by explaining what the student can do before asking them to register.",
                  icon: Sparkles,
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6"
                  >
                    <Icon size={20} className="text-slate-200" />
                    <h3 className="mt-5 text-2xl font-semibold text-white">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-slate-400">
                      {item.copy}
                    </p>
                  </div>
                );
              })}
            </motion.div>
          </div>
        </section>

        <section
          id="workflow"
          className="mx-auto max-w-7xl scroll-mt-28 px-6 py-12 lg:py-16"
        >
          <div className="grid gap-12 lg:grid-cols-[0.86fr_1.14fr]">
            <motion.div {...fadeInUp} className="lg:sticky lg:top-28 lg:self-start">
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-emerald-200">
                Workflow
              </p>
              <h2 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
                A student journey that feels complete
              </h2>
              <p className="mt-6 text-lg leading-8 text-slate-300">
                Instead of isolated features, the platform should feel like one preparation system that helps users move from confusion to measurable readiness.
              </p>

              <div className="mt-8 rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
                  Core promise
                </p>
                <p className="mt-4 text-base leading-7 text-slate-200">
                  Students should feel they can start quickly, understand what to improve next, and keep returning because progress is visible.
                </p>
              </div>
            </motion.div>

            <div className="space-y-6">
              {[
                {
                  step: "01",
                  title: "Create an account and choose a preparation track",
                  text:
                    "The first screen should make the use case obvious so registration feels like the natural next action.",
                },
                {
                  step: "02",
                  title: "Move across resume, interview, and coding workflows",
                  text:
                    "The experience should keep context connected instead of sending the student into separate disconnected tools.",
                },
                {
                  step: "03",
                  title: "Return because the platform shows momentum",
                  text:
                    "Recommendations, analytics, and streak-style progress make the product feel useful beyond a single practice session.",
                },
              ].map((item) => (
                <motion.div
                  key={item.step}
                  {...fadeInUp}
                  className="rounded-[30px] border border-white/10 bg-white/[0.04] p-7"
                >
                  <div className="flex items-start gap-5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-400/10 text-sm font-semibold text-emerald-200">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold text-white">
                        {item.title}
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-slate-400">
                        {item.text}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="features"
          className="mx-auto max-w-7xl scroll-mt-28 px-6 py-12 lg:py-16"
        >
          <motion.div {...fadeInUp} className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-violet-200">
              Feature showcase
            </p>
            <h2 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
              The landing page should demonstrate the product, not just list it
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-300">
              These sections work better as large product-led showcases so visitors can understand both capability and usefulness in the same glance.
            </p>
          </motion.div>

          <div className="mt-12 space-y-6">
            {featureShowcase.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <motion.div
                  key={feature.id}
                  {...fadeInUp}
                  transition={{ ...fadeInUp.transition, delay: index * 0.06 }}
                  className="grid gap-6 rounded-[34px] border border-white/10 bg-white/[0.04] p-6 lg:grid-cols-[0.88fr_1.12fr] lg:p-8"
                >
                  <div className="flex h-full flex-col justify-between rounded-[28px] border border-white/10 bg-slate-950/70 p-6">
                    <div>
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5">
                          <Icon size={22} className="text-slate-100" />
                        </div>
                        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
                          Feature {feature.id}
                        </p>
                      </div>

                      <h3 className="mt-6 text-3xl font-semibold text-white">
                        {feature.title}
                      </h3>
                      <p className="mt-4 text-sm leading-7 text-slate-400">
                        {feature.description}
                      </p>
                    </div>

                    <div className="mt-8 space-y-3">
                      {feature.points.map((point) => (
                        <div
                          key={point}
                          className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3"
                        >
                          <CheckCircle2
                            size={18}
                            className="mt-0.5 shrink-0 text-cyan-200"
                          />
                          <p className="text-sm text-slate-200">{point}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[28px] border border-white/10 bg-gradient-to-br from-slate-900 to-slate-950 p-5">
                    {feature.id === "01" && (
                      <div className="grid h-full gap-4 md:grid-cols-[1fr_0.9fr]">
                        <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold text-white">
                              Mock interview session
                            </p>
                            <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs text-cyan-200">
                              Adaptive
                            </span>
                          </div>
                          <div className="mt-5 space-y-3">
                            {[
                              "Explain virtual DOM in React.",
                              "How would you optimize a slow component tree?",
                              "Describe one real project challenge you solved.",
                            ].map((q) => (
                              <div
                                key={q}
                                className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm text-slate-300"
                              >
                                {q}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="rounded-[24px] border border-white/10 bg-cyan-400/[0.05] p-5">
                          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                            Feedback snapshot
                          </p>
                          <div className="mt-5 space-y-4">
                            {[
                              ["Technical depth", "Strong"],
                              ["Communication", "Improving"],
                              ["Confidence", "Good"],
                            ].map(([label, value]) => (
                              <div
                                key={label}
                                className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3"
                              >
                                <p className="text-sm text-slate-300">{label}</p>
                                <p className="text-sm font-semibold text-white">
                                  {value}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {feature.id === "02" && (
                      <div className="grid h-full gap-4 md:grid-cols-[0.95fr_1.05fr]">
                        <div className="rounded-[24px] border border-white/10 bg-emerald-400/[0.05] p-5">
                          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                            ATS score movement
                          </p>
                          <div className="mt-5 flex items-end gap-3">
                            {[58, 66, 74, 84].map((h, idx) => (
                              <div key={idx} className="flex-1">
                                <div
                                  className="rounded-t-full bg-emerald-400"
                                  style={{ height: `${h}px` }}
                                />
                              </div>
                            ))}
                          </div>
                          <div className="mt-4 flex justify-between text-xs text-slate-500">
                            <span>v1</span>
                            <span>v2</span>
                            <span>v3</span>
                            <span>Current</span>
                          </div>
                        </div>

                        <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
                          <p className="text-sm font-semibold text-white">
                            Missing keyword insights
                          </p>
                          <div className="mt-5 flex flex-wrap gap-2">
                            {[
                              "REST APIs",
                              "System design",
                              "MongoDB",
                              "Testing",
                              "Performance",
                            ].map((tag) => (
                              <span
                                key={tag}
                                className="rounded-full border border-white/10 bg-slate-950/70 px-3 py-2 text-sm text-slate-300"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>

                          <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                              Recommendation
                            </p>
                            <p className="mt-2 text-sm leading-7 text-slate-300">
                              Add stronger backend project wording and include role-specific technical keywords in experience bullets.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {feature.id === "03" && (
                      <div className="grid h-full gap-4 md:grid-cols-[1.1fr_0.9fr]">
                        <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold text-white">
                              Coding workspace
                            </p>
                            <span className="rounded-full bg-violet-400/10 px-3 py-1 text-xs text-violet-200">
                              Practice-ready
                            </span>
                          </div>
                          <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950/70 p-4 font-mono text-sm leading-7 text-slate-300">
                            <p>{`function twoSum(nums, target) {`}</p>
                            <p className="pl-4">{`const map = new Map();`}</p>
                            <p className="pl-4">{`for (let i = 0; i < nums.length; i++) {`}</p>
                            <p className="pl-8">{`const diff = target - nums[i];`}</p>
                            <p className="pl-8">{`if (map.has(diff)) return [map.get(diff), i];`}</p>
                            <p className="pl-8">{`map.set(nums[i], i);`}</p>
                            <p className="pl-4">{`}`}</p>
                            <p>{`}`}</p>
                          </div>
                        </div>

                        <div className="rounded-[24px] border border-white/10 bg-violet-400/[0.05] p-5">
                          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                            Test results
                          </p>
                          <div className="mt-5 space-y-3">
                            {[
                              ["Case 1", "Passed"],
                              ["Case 2", "Passed"],
                              ["Case 3", "Passed"],
                              ["Complexity", "O(n)"],
                            ].map(([label, value]) => (
                              <div
                                key={label}
                                className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3"
                              >
                                <p className="text-sm text-slate-300">{label}</p>
                                <p className="text-sm font-semibold text-white">
                                  {value}
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

        <section
          id="admin"
          className="mx-auto max-w-7xl scroll-mt-28 px-6 py-12 lg:py-16"
        >
          <div className="overflow-hidden rounded-[36px] border border-white/10 bg-[linear-gradient(135deg,rgba(15,23,42,0.98),rgba(17,24,39,0.92))] p-8 shadow-[0_30px_120px_rgba(2,6,23,0.45)] md:p-10">
            <div className="grid gap-10 lg:grid-cols-[0.84fr_1.16fr] lg:items-start">
              <motion.div {...fadeInUp}>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-200">
                  <ShieldCheck size={16} />
                  Admin access
                </div>

                <h2 className="mt-5 text-4xl font-bold tracking-tight text-white md:text-5xl">
                  Separate admin visibility without breaking the student flow
                </h2>

                <p className="mt-6 text-lg leading-8 text-slate-300">
                  The student experience should stay simple, but the platform still needs a direct operational path for admins managing users, interview activity, and question libraries.
                </p>

                <div className="mt-8 space-y-3">
                  {[
                    "Direct admin login entry.",
                    "Cleaner product structure for institutions and teams.",
                    "Operational visibility separated from onboarding.",
                  ].map((point) => (
                    <div
                      key={point}
                      className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-200"
                    >
                      <CheckCircle2
                        size={18}
                        className="mt-0.5 shrink-0 text-cyan-200"
                      />
                      <p>{point}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                  <Link
                    to="/admin-login"
                    className="inline-flex items-center justify-center rounded-2xl bg-white px-7 py-4 text-base font-semibold text-slate-950 transition hover:bg-slate-200"
                  >
                    Open Admin Login
                  </Link>

                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] px-7 py-4 text-base font-medium text-white transition hover:bg-white/[0.08]"
                  >
                    Student Registration
                  </Link>
                </div>
              </motion.div>

              <div className="grid gap-5 md:grid-cols-2">
                {adminCards.map((feature, index) => {
                  const Icon = feature.icon;

                  return (
                    <motion.div
                      key={feature.title}
                      {...fadeInUp}
                      transition={{ ...fadeInUp.transition, delay: index * 0.06 }}
                      className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6"
                    >
                      <Icon size={22} className="text-slate-100" />
                      <h3 className="mt-6 text-2xl font-semibold text-white">
                        {feature.title}
                      </h3>
                      <p className="mt-4 text-sm leading-7 text-slate-400">
                        {feature.description}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-24 pt-8 lg:pb-32">
          <motion.div
            {...fadeInUp}
            style={{ y: ctaY }}
            className="overflow-hidden rounded-[36px] border border-white/10 bg-cyan-400/[0.06] p-8 text-center shadow-[0_25px_80px_rgba(2,6,23,0.45)] backdrop-blur-xl md:p-12"
          >
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-cyan-200">
              Start preparing
            </p>

            <h2 className="mx-auto mt-5 max-w-4xl text-4xl font-bold tracking-tight text-white md:text-5xl">
              Make the next step obvious as soon as the value is clear
            </h2>

            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-300">
              InterviewVerse AI should help students understand the product fast, trust the workflow, and start preparing without friction.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:flex-wrap">
              <Link
                to="/register"
                className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-400 px-7 py-4 text-base font-semibold text-slate-950 transition hover:bg-cyan-300"
              >
                Start Registration
                <ChevronRight
                  size={18}
                  className="transition group-hover:translate-x-1"
                />
              </Link>

              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] px-7 py-4 text-base font-medium text-white transition hover:bg-white/[0.08]"
              >
                Student Login
              </Link>

              <Link
                to="/admin-login"
                className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-slate-900 px-7 py-4 text-base font-medium text-slate-200 transition hover:bg-slate-800"
              >
                Admin Login
              </Link>
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  );
}