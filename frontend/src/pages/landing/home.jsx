import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Brain,
  CheckCircle2,
  FileText,
  Menu,
  Mic,
  Sparkles,
  Users,
  X,
  Zap,
  Star,
  ChevronDown,
  ShieldCheck,
  Check,
  BarChart3,
} from "lucide-react";

// ─── Constants ────────────────────────────────────────────────────────────────
const navLinks = [
  { label: "Overview", href: "#overview" },
  { label: "Features", href: "#features" },
  { label: "How it Works", href: "#how-it-works" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "FAQ", href: "#faq" },
];

const metrics = [
  { value: "98.4%", label: "ATS Match Accuracy" },
  { value: "50,000+", label: "Mock Interviews Completed" },
  { value: "100%", label: "Skill Analytics Coverage" },
  { value: "4.9/5", label: "Candidate Rating" },
];

const coreFeatures = [
  {
    icon: Brain,
    title: "AI Voice Mock Interviews",
    description:
      "Role-specific interview rounds for Frontend, Backend, System Design, and HR. Receive real-time feedback on technical depth and communication.",
    tags: ["Voice & Text", "Adaptive Prompts", "Instant Scorecard"],
    color: "from-cyan-500/20 to-cyan-500/5",
    borderColor: "border-cyan-500/30",
    iconColor: "text-cyan-400",
  },
  {
    icon: FileText,
    title: "ATS Resume Optimization",
    description:
      "Parse your resume against top job descriptions. Identify missing keywords, ATS formatting issues, and receive actionable bullet improvements.",
    tags: ["Match Score", "Keyword Gap Audit", "Impact Suggestions"],
    color: "from-emerald-500/20 to-emerald-500/5",
    borderColor: "border-emerald-500/30",
    iconColor: "text-emerald-400",
  },
  {
    icon: BarChart3,
    title: "Placement Readiness Analytics",
    description:
      "Track your mock interview scores, technical readiness, communication metrics, and weak areas with real-time performance analytics.",
    tags: ["Readiness Score", "Skill Heatmap", "Weak-Area Analysis"],
    color: "from-violet-500/20 to-violet-500/5",
    borderColor: "border-violet-500/30",
    iconColor: "text-violet-400",
  },
];

const steps = [
  {
    num: "01",
    title: "Audit Your Resume",
    description: "Upload your CV to get instant ATS match scoring and identify critical keyword gaps for target roles.",
  },
  {
    num: "02",
    title: "Practice AI Mock Rounds",
    description: "Take technical and behavioral voice interviews with real-time feedback after every response.",
  },
  {
    num: "03",
    title: "Track & Get Placed",
    description: "Monitor your placement readiness score on detailed analytics dashboards and enter interviews with confidence.",
  },
];

const testimonials = [
  {
    name: "Aarav Sharma",
    initials: "AS",
    role: "SDE-1 at Amazon",
    comment:
      "The voice mock interviews gave me the exact practice I needed for technical rounds. Boosted my ATS resume score from 62% to 94%!",
    atsBoost: "62% → 94%",
  },
  {
    name: "Priya Nair",
    initials: "PN",
    role: "Frontend Engineer at Microsoft",
    comment:
      "Practicing React and System Design questions with instant AI feedback was a game changer during campus placements.",
    atsBoost: "58% → 91%",
  },
  {
    name: "Rohan Verma",
    initials: "RV",
    role: "Full Stack Dev at Swiggy",
    comment:
      "Having mock interviews, resume scanner, and placement analytics all in one sleek product saved me weeks of prep time.",
    atsBoost: "65% → 96%",
  },
];

const faqs = [
  {
    q: "Is InterviewVerse AI free to start?",
    a: "Yes! Students can create a free account to practice AI mock interviews, scan resumes, and track placement analytics.",
  },
  {
    q: "How accurate is the ATS Resume Scanner?",
    a: "Our ATS parser analyzes keywords, section structure, and industry job standards with over 98% matching accuracy.",
  },
  {
    q: "Can I practice voice-based mock interviews?",
    a: "Absolutely. The platform supports interactive voice mock interviews with real-time speech-to-text evaluation and dynamic follow-up questions.",
  },
  {
    q: "How do institutional admins log in?",
    a: "Admins can access the dedicated management portal via the Admin Login link at the top or bottom of the page.",
  },
];

export default function LandingPage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [activeTab, setActiveTab] = useState("interview");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* ── STICKY NAVBAR ────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-slate-950/80 backdrop-blur-xl transition-all">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-400 to-emerald-400 text-slate-950 shadow-md">
              <Sparkles size={18} />
            </div>
            <span className="text-base font-bold text-white tracking-tight">
              InterviewVerse <span className="text-cyan-400">AI</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-xs font-medium text-slate-400 transition hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="hidden items-center gap-3 md:flex">
            <Link
              to="/login"
              className="rounded-lg border border-white/10 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-white/5 hover:text-white transition"
            >
              Sign in
            </Link>
            <Link
              to="/register"
              className="rounded-lg bg-cyan-400 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-300 transition shadow-[0_0_16px_rgba(34,211,238,0.25)]"
            >
              Get Started Free
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-slate-400 hover:text-white md:hidden"
            aria-label="Toggle navigation menu"
          >
            {mobileNavOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileNavOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="sticky top-16 z-40 border-b border-white/10 bg-slate-900 px-6 py-5 md:hidden space-y-4"
          >
            <nav className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileNavOpen(false)}
                  className="text-sm font-medium text-slate-300 hover:text-cyan-400"
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <div className="flex flex-col gap-2.5 pt-3 border-t border-white/10">
              <Link
                to="/login"
                onClick={() => setMobileNavOpen(false)}
                className="w-full text-center rounded-lg border border-white/10 py-2.5 text-xs font-semibold text-slate-200"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileNavOpen(false)}
                className="w-full text-center rounded-lg bg-cyan-400 py-2.5 text-xs font-bold text-slate-950"
              >
                Get Started Free
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        {/* ── HERO SECTION ───────────────────────────────────────────────────── */}
        <section id="overview" className="relative mx-auto max-w-7xl px-5 pt-16 pb-20 md:px-8 md:pt-24 lg:pb-28">
          {/* Subtle Ambient Lighting */}
          <div className="pointer-events-none absolute -top-10 left-1/2 -z-10 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[130px]" />

          <div className="mx-auto max-w-3xl text-center space-y-6">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1.5 text-xs font-semibold text-cyan-300">
              <Sparkles size={14} />
              AI Placement Preparation Workspace
            </div>

            {/* Headline */}
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.15]">
              Ace Placement Drives with{" "}
              <span className="bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-300 bg-clip-text text-transparent">
                AI Mock Interviews
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mx-auto max-w-2xl text-base text-slate-400 leading-relaxed">
              Practice role-specific mock interviews, optimize your resume for ATS screening filters, and track placement readiness analytics in one unified workspace.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-6 py-3.5 text-sm font-bold text-slate-950 transition hover:bg-cyan-300 shadow-[0_0_24px_rgba(34,211,238,0.25)]"
              >
                Get Started Free
                <ArrowRight size={16} />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-semibold text-slate-200 hover:bg-white/10 transition"
              >
                Explore Features
              </a>
            </div>
          </div>

          {/* Clean Dashboard Preview Frame */}
          <div className="mt-14 mx-auto max-w-5xl rounded-2xl border border-white/10 bg-slate-900/90 p-4 shadow-2xl backdrop-blur-xl">
            <div className="rounded-xl border border-white/10 bg-slate-950 overflow-hidden">
              {/* Window Bar */}
              <div className="flex items-center justify-between border-b border-white/10 bg-slate-900/80 px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                  <span className="ml-2 text-xs font-medium text-slate-400">InterviewVerse Dashboard</span>
                </div>
                <div className="flex gap-1.5 bg-white/5 p-1 rounded-lg border border-white/10">
                  <button
                    onClick={() => setActiveTab("interview")}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
                      activeTab === "interview" ? "bg-cyan-400 text-slate-950" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    AI Voice Mock
                  </button>
                  <button
                    onClick={() => setActiveTab("resume")}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
                      activeTab === "resume" ? "bg-emerald-400 text-slate-950" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    ATS Resume
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === "interview" && (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400 border border-cyan-400/20">
                          <Mic size={20} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">Frontend Technical Session</p>
                          <p className="text-[11px] text-cyan-400">Question 3 of 5</p>
                        </div>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed font-medium bg-slate-900 p-3.5 rounded-lg border border-white/5">
                        "Explain how React's `useEffect` dependency array works, and what happens if you omit dependencies?"
                      </p>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 flex flex-col justify-between">
                      <div>
                        <p className="text-xs font-bold text-white mb-3">AI Evaluation Breakdown</p>
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between border-b border-white/5 pb-2">
                            <span className="text-slate-400">Technical Depth</span>
                            <span className="font-bold text-emerald-400">92%</span>
                          </div>
                          <div className="flex justify-between border-b border-white/5 pb-2">
                            <span className="text-slate-400">Communication Clarity</span>
                            <span className="font-bold text-cyan-400">88%</span>
                          </div>
                          <div className="flex justify-between pb-1">
                            <span className="text-slate-400">Concept Coverage</span>
                            <span className="font-bold text-violet-400">Strong</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 rounded-lg bg-cyan-400/10 border border-cyan-400/20 p-2.5 text-[11px] text-cyan-300">
                        💡 Mentioning Fiber architecture adds technical leverage!
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "resume" && (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">ATS Compatibility Score</span>
                        <span className="text-2xl font-extrabold text-emerald-400">88%</span>
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs text-slate-400">Detected Keywords</p>
                        <div className="flex flex-wrap gap-1.5">
                          <span className="rounded-md bg-emerald-400/10 border border-emerald-400/30 px-2 py-1 text-[11px] text-emerald-300">✓ React</span>
                          <span className="rounded-md bg-emerald-400/10 border border-emerald-400/30 px-2 py-1 text-[11px] text-emerald-300">✓ Node.js</span>
                          <span className="rounded-md bg-emerald-400/10 border border-emerald-400/30 px-2 py-1 text-[11px] text-emerald-300">✓ REST APIs</span>
                          <span className="rounded-md bg-rose-500/10 border border-rose-500/30 px-2 py-1 text-[11px] text-rose-300">✗ Docker</span>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 space-y-3 text-xs">
                      <p className="font-bold text-white">Recommended Actions</p>
                      <div className="flex items-start gap-2 text-slate-300">
                        <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                        Add quantifiable metrics under work experience.
                      </div>
                      <div className="flex items-start gap-2 text-slate-300">
                        <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                        Include Docker and Redis keywords to match senior roles.
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ── METRICS STRIP ───────────────────────────────────────────────────── */}
        <section className="border-y border-white/10 bg-white/[0.015] py-8">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {metrics.map((m) => (
                <div key={m.label} className="space-y-1">
                  <p className="text-2xl font-extrabold text-cyan-400 md:text-3xl">{m.value}</p>
                  <p className="text-xs font-medium text-slate-400">{m.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CORE FEATURES GRID ──────────────────────────────────────────────── */}
        <section id="features" className="mx-auto max-w-7xl px-5 py-20 md:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <p className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Core Capabilities</p>
            <h2 className="text-3xl font-extrabold text-white md:text-4xl">Everything You Need to Land the Offer</h2>
            <p className="text-sm text-slate-400">Focused preparation modules designed to elevate your interview readiness.</p>
          </div>

          <div className="mt-14 grid md:grid-cols-3 gap-6">
            {coreFeatures.map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.title}
                  className={`rounded-2xl border ${feat.borderColor} bg-gradient-to-b ${feat.color} p-7 flex flex-col justify-between hover:border-cyan-400/50 transition duration-300`}
                >
                  <div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 border border-white/10 mb-6">
                      <Icon size={22} className={feat.iconColor} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{feat.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed mb-6">{feat.description}</p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-4 border-t border-white/10">
                    {feat.tags.map((t) => (
                      <span key={t} className="rounded-md bg-slate-900 border border-white/10 px-2.5 py-1 text-[11px] font-medium text-slate-300">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── HOW IT WORKS ────────────────────────────────────────────────────── */}
        <section id="how-it-works" className="mx-auto max-w-7xl px-5 py-20 md:px-8 border-t border-white/10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Step-By-Step</p>
            <h2 className="text-3xl font-extrabold text-white md:text-4xl">How InterviewVerse AI Works</h2>
          </div>

          <div className="mt-14 grid md:grid-cols-3 gap-8">
            {steps.map((s) => (
              <div key={s.num} className="rounded-2xl border border-white/10 bg-white/[0.02] p-7 space-y-4">
                <span className="inline-block text-sm font-extrabold text-cyan-400 bg-cyan-400/10 border border-cyan-400/20 px-3 py-1 rounded-lg">
                  Step {s.num}
                </span>
                <h3 className="text-lg font-bold text-white">{s.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{s.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── TESTIMONIALS ───────────────────────────────────────────────────── */}
        <section id="testimonials" className="mx-auto max-w-7xl px-5 py-20 md:px-8 border-t border-white/10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <p className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Student Stories</p>
            <h2 className="text-3xl font-extrabold text-white md:text-4xl">Proven Results for Candidate Placements</h2>
          </div>

          <div className="mt-14 grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 flex flex-col justify-between">
                <p className="text-xs text-slate-300 leading-relaxed italic mb-6">"{t.comment}"</p>
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-cyan-400 to-emerald-400 text-slate-950 font-bold text-xs">
                      {t.initials}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">{t.name}</p>
                      <p className="text-[11px] text-cyan-400 font-medium">{t.role}</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded">
                    {t.atsBoost}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FAQ ────────────────────────────────────────────────────────────── */}
        <section id="faq" className="mx-auto max-w-4xl px-5 py-20 md:px-8 border-t border-white/10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <p className="text-xs font-bold text-cyan-400 uppercase tracking-widest">FAQ</p>
            <h2 className="text-3xl font-extrabold text-white md:text-4xl">Frequently Asked Questions</h2>
          </div>

          <div className="mt-12 space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={faq.q} className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden">
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between p-5 text-left text-sm font-bold text-white hover:text-cyan-400 transition"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown size={18} className={`transition-transform duration-200 ${isOpen ? "rotate-180 text-cyan-400" : "text-slate-400"}`} />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-slate-300 leading-relaxed border-t border-white/5 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ── CALL TO ACTION ──────────────────────────────────────────────────── */}
        <section className="mx-auto max-w-7xl px-5 py-20 md:px-8">
          <div className="rounded-3xl border border-cyan-400/30 bg-gradient-to-r from-cyan-950/40 via-slate-900 to-emerald-950/40 p-10 text-center md:p-14 space-y-6">
            <h2 className="text-3xl font-extrabold text-white md:text-4xl">Ready for Your Placement Drive?</h2>
            <p className="mx-auto max-w-xl text-xs text-slate-300 leading-relaxed">
              Create your free account today and start practicing AI mock interviews, auditing your resume, and tracking placement analytics.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                to="/register"
                className="rounded-xl bg-cyan-400 px-6 py-3.5 text-xs font-bold text-slate-950 hover:bg-cyan-300 transition shadow-[0_0_20px_rgba(34,211,238,0.3)]"
              >
                Get Started Free
              </Link>
              <Link
                to="/login"
                className="rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 text-xs font-semibold text-slate-200 hover:bg-white/10 transition"
              >
                Sign In
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ── FOOTER ──────────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/10 bg-slate-950 py-10 text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-5 md:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-400 text-slate-950 font-bold">
              <Sparkles size={14} />
            </div>
            <span className="font-bold text-white">InterviewVerse AI</span>
          </div>

          <div className="flex gap-6">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} className="hover:text-slate-300 transition">
                {l.label}
              </a>
            ))}
            <Link to="/admin-login" className="hover:text-cyan-400 transition">
              Admin Login
            </Link>
          </div>

          <p>© {new Date().getFullYear()} InterviewVerse AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
