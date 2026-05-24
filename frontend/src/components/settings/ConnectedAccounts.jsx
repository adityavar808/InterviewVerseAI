// src/components/settings/ConnectedAccounts.jsx

import { motion } from "framer-motion";

import {
  Link,
  Mail,
  Globe,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

const accounts = [
  {
    title: "Google Account",
    description:
      "Connected for authentication and secure login.",
    status: "Connected",
    icon: Mail,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
  },
  {
    title: "GitHub Account",
    description:
      "Connected for coding profile and repositories.",
    status: "Connected",
    icon: Link,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
  },
  {
    title: "Portfolio Website",
    description:
      "Showcase your projects and achievements publicly.",
    status: "Not Connected",
    icon: Globe,
    color: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
  },
];

const ConnectedAccounts = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="
        relative
        overflow-hidden
        bg-white/5
        border
        border-white/10
        backdrop-blur-xl
        rounded-3xl
        p-6
      "
    >
      {/* Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 pointer-events-none"></div>

      <div className="relative">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          
          <div>
            <h2 className="text-2xl font-semibold text-white mb-2">
              Connected Accounts
            </h2>

            <p className="text-sm text-gray-400">
              Manage linked platforms & integrations
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm">
            <Sparkles size={16} />
            Secure Integrations
          </div>
        </div>

        {/* Accounts */}
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
                `}
              >
                {/* Left */}
                <div className="flex items-start gap-4">
                  
                  <div
                    className={`
                      w-14
                      h-14
                      rounded-2xl
                      flex
                      items-center
                      justify-center
                      ${account.bg}
                    `}
                  >
                    <Icon
                      className={account.color}
                      size={24}
                    />
                  </div>

                  <div>
                    
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {account.title}
                    </h3>

                    <p className="text-sm text-gray-400 leading-relaxed">
                      {account.description}
                    </p>
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-center gap-3">
                  
                  {account.status === "Connected" ? (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
                      
                      <CheckCircle2 size={16} />

                      Connected
                    </div>
                  ) : (
                    <button
                      className="
                        px-5
                        py-2
                        rounded-2xl
                        bg-cyan-500
                        hover:bg-cyan-400
                        transition-all
                        duration-300
                        text-white
                        text-sm
                        font-medium
                      "
                    >
                      Connect
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Summary */}
        <div className="mt-8 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-white/10 rounded-3xl p-5">
          
          <h3 className="text-lg font-semibold text-white mb-2">
            AI Integration Summary
          </h3>

          <p className="text-sm text-gray-300 leading-relaxed">
            Connected platforms improve authentication,
            coding analytics, project visibility, and
            professional profile strength while enhancing
            your InterviewVerse AI ecosystem experience.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default ConnectedAccounts;