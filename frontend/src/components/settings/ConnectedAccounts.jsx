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
    color: "text-emerald-400",
    bg: "bg-emerald-500/[0.03] hover:bg-emerald-500/[0.06]",
    border: "border-emerald-500/25",
    iconBg: "bg-emerald-500/10",
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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="relative overflow-hidden bg-slate-900/60 border border-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-xl"
    >
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-16 -left-12 h-44 w-44 rounded-full bg-cyan-500/10 blur-[40px]" />
        <div className="absolute -bottom-16 -right-12 h-44 w-44 rounded-full bg-purple-500/10 blur-[40px]" />
        <div className="absolute top-0 left-0 right-0 h-[2px] rounded-full"
             style={{ background: "linear-gradient(90deg, rgba(34,211,238,0.6), rgba(167,139,250,0.4), transparent)" }} />
      </div>

      <div className="relative">
        
        {/* Compact Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0 shadow-sm">
              <Link className="text-amber-400" size={18} />
            </div>

            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight leading-tight">Connected Accounts</h2>
              <p className="text-[11px] text-slate-400">Manage linked platforms & integrations</p>
            </div>
          </div>

          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-purple-500/20 bg-purple-500/10 text-purple-300 text-xs font-semibold">
            <Sparkles size={12} />
            Secure Integrations
          </span>
        </div>

        {/* Account Cards */}
        <div className="space-y-3">
          {accounts.map((account, index) => {
            const Icon = account.icon;

            return (
              <motion.div
                key={index}
                whileHover={{ y: -2 }}
                className={`
                  flex
                  items-center
                  justify-between
                  gap-4
                  rounded-xl
                  border
                  ${account.border}
                  ${account.bg}
                  p-3.5
                  transition-all
                  duration-200
                `}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${account.iconBg} border border-white/5`}>
                    {Icon ? (
                      <Icon className={account.color} size={18} />
                    ) : (
                      <Mail className={account.color} size={18} />
                    )}
                  </div>

                  <div>
                    <h3 className="text-slate-200 font-bold text-xs leading-tight mb-0.5">{account.title}</h3>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{account.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  {account.status === "Connected" ? (
                    <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-lg border border-emerald-400/20 bg-emerald-400/10 text-emerald-300 text-[11px] font-semibold">
                      <CheckCircle2 size={12} />
                      Connected
                    </div>
                  ) : (
                    <div className="px-2.5 py-0.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 text-[11px] font-semibold">
                      Not Connected
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => toggleAccount(index)}
                    className={`
                      px-3.5
                      py-1.5
                      rounded-lg
                      font-bold
                      text-xs
                      transition-all
                      duration-200
                      active:scale-[0.98]
                      ${
                        account.status === "Connected"
                          ? "bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20"
                          : "bg-cyan-400 hover:bg-cyan-300 text-slate-950 shadow-sm"
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
        <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="bg-white/[0.025] border border-white/10 rounded-xl p-3 flex-1">
            <h3 className="text-xs font-bold text-white mb-0.5 leading-tight">AI Integration Summary</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Connected platforms improve authentication, coding analytics, and profile visibility.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="w-full lg:w-auto px-5 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 transition-all duration-200 text-slate-950 font-bold text-xs shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? "Saving..." : "Save Connections"}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ConnectedAccounts;