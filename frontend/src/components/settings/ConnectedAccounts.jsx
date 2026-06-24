// src/components/settings/ConnectedAccounts.jsx

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import { Link, Mail, Globe, Sparkles, CheckCircle2 } from "lucide-react";

const defaultAccounts = [
  {
    title: "Google Account",
    description: "Connected for authentication and secure login.",
    status: "Connected",
    icon: Mail,
    color: "text-cyan-400",
    bg: "bg-cyan-500/[0.03] hover:bg-cyan-500/[0.06]",
    border: "border-cyan-500/25",
    iconBg: "bg-cyan-500/10",
  },
  {
    title: "GitHub Account",
    description: "Connected for coding profile and repositories.",
    status: "Connected",
    icon: Link,
    color: "text-purple-400",
    bg: "bg-purple-500/[0.03] hover:bg-purple-500/[0.06]",
    border: "border-purple-500/25",
    iconBg: "bg-purple-500/10",
  },
  {
    title: "Portfolio Website",
    description: "Showcase your projects and achievements publicly.",
    status: "Not Connected",
    icon: Globe,
    color: "text-green-400",
    bg: "bg-green-500/[0.03] hover:bg-green-500/[0.06]",
    border: "border-green-500/25",
    iconBg: "bg-green-500/10",
  },
];

const STORAGE_KEY = "interviewverse_connected_accounts";

const ConnectedAccounts = () => {
  const [accounts, setAccounts] = useState(defaultAccounts);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const restored = defaultAccounts.map((defItem) => {
            const savedItem = parsed.find((p) => p.title === defItem.title);
            return {
              ...defItem,
              status: savedItem ? savedItem.status : defItem.status,
            };
          });
          setAccounts(restored);
        }
      } catch (error) {
        console.error("Failed to parse connected accounts:", error);
      }
    }
  }, []);

  const toggleAccount = (index) => {
    setAccounts((prev) =>
      prev.map((account, idx) =>
        idx === index
          ? {
              ...account,
              status: account.status === "Connected" ? "Not Connected" : "Connected",
            }
          : account
      )
    );
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
      toast.success("Connected accounts saved successfully.");
    } catch (error) {
      toast.error("Unable to save connected accounts.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative overflow-hidden bg-white/[0.035] border border-white/10 backdrop-blur-xl rounded-3xl p-7"
    >
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-16 h-72 w-72 rounded-full bg-cyan-500/[0.06] blur-[60px]" />
        <div className="absolute bottom-0 right-0 h-48 w-48 rounded-full bg-violet-500/[0.05] blur-[50px]" />
        <div className="absolute top-0 left-0 right-0 h-[2px] rounded-full"
             style={{ background: "linear-gradient(90deg, rgba(6,182,212,0.55), rgba(139,92,246,0.3), transparent)" }} />
      </div>

      <div className="relative">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-semibold text-white leading-tight">Connected Accounts</h2>
            <p className="text-xs text-slate-400 mt-0.5">Manage linked platforms & integrations</p>
          </div>

          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-violet-400/20 bg-violet-400/10 text-violet-300 text-[11px] font-semibold">
            <Sparkles size={11} />
            Secure Integrations
          </span>
        </div>

        {/* Account Cards */}
        <div className="space-y-5">
          {accounts.map((account, index) => {
            const Icon = account.icon;

            return (
              <motion.div
                key={index}
                whileHover={{ y: -3 }}
                className={`
                  flex
                  flex-col
                  lg:flex-row
                  lg:items-center
                  lg:justify-between
                  gap-5
                  rounded-3xl
                  border
                  ${account.border}
                  ${account.bg}
                  p-5
                  transition-all
                  duration-300
                `}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${account.iconBg} border border-white/5`}>
                    {Icon ? (
                      <Icon className={account.color} size={24} />
                    ) : (
                      <Mail className={account.color} size={24} />
                    )}
                  </div>

                  <div>
                    <h3 className="text-slate-200 font-semibold text-sm leading-tight mb-2">{account.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{account.description}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-start gap-4 flex-shrink-0">
                  {account.status === "Connected" ? (
                    <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-green-400/20 bg-green-400/10 text-green-300 text-xs font-semibold">
                      <CheckCircle2 size={13} />
                      Connected
                    </div>
                  ) : (
                    <div className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-400 text-xs font-semibold">
                      Not Connected
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => toggleAccount(index)}
                    className={`
                      px-5
                      py-2.5
                      rounded-2xl
                      font-semibold
                      text-xs
                      sm:text-sm
                      transition-all
                      duration-200
                      active:scale-[0.98]
                      ${
                        account.status === "Connected"
                          ? "bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20"
                          : "bg-cyan-400 hover:bg-cyan-300 text-slate-950 shadow-[0_0_15px_rgba(34,211,238,0.2)] hover:shadow-[0_0_20px_rgba(34,211,238,0.35)]"
                      }
                    `}
                  >
                    {account.status === "Connected" ? "Disconnect" : "Connect"}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Footer Area */}
        <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 hover:bg-white/[0.045] transition-all duration-300 flex-1">
            <h3 className="text-sm font-semibold text-white mb-2 leading-tight">AI Integration Summary</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Connected platforms improve authentication, coding analytics, project visibility, and professional profile strength while enhancing your InterviewVerse AI ecosystem experience.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="w-full lg:w-auto px-6 py-3.5 rounded-2xl bg-cyan-400 hover:bg-cyan-300 transition-all duration-200 text-slate-950 font-semibold text-sm shadow-[0_0_20px_rgba(34,211,238,0.25)] hover:shadow-[0_0_25px_rgba(34,211,238,0.35)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? "Saving..." : "Save Connections"}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ConnectedAccounts;