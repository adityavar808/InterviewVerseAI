// src/components/profile/SocialLinksCard.jsx

import { motion } from "framer-motion";

import {
  GitBranch,
  Link,
  Globe,
  Mail,
  Sparkles,
  ExternalLink,
} from "lucide-react";

const socialLinks = [
  {
    title: "GitHub",
    username: "@adityavarshney",
    icon: GitBranch,
    color: "text-white",
    bg: "bg-white/5",
    border: "border-white/10",
  },
  {
    title: "LinkedIn",
    username: "Aditya Varshney",
    icon: Link,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
  },
  {
    title: "Portfolio",
    username: "portfolio.dev",
    icon: Globe,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
  },
  {
    title: "Email",
    username: "aditya@example.com",
    icon: Mail,
    color: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
  },
];

const SocialLinksCard = () => {
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
              Social Links
            </h2>

            <p className="text-sm text-gray-400">
              Professional profiles & contact information
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm">
            <Sparkles size={16} />
            Connected Profiles
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {socialLinks.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={index}
                whileHover={{ y: -4 }}
                className={`
                  relative
                  overflow-hidden
                  rounded-3xl
                  border
                  ${item.border}
                  ${item.bg}
                  p-5
                `}
              >
                {/* Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent pointer-events-none"></div>

                <div className="relative flex items-center justify-between">
                  
                  {/* Left */}
                  <div className="flex items-center gap-4">
                    
                    <div
                      className={`
                        w-14
                        h-14
                        rounded-2xl
                        flex
                        items-center
                        justify-center
                        ${item.bg}
                      `}
                    >
                      <Icon
                        className={item.color}
                        size={26}
                      />
                    </div>

                    <div>
                      
                      <h3 className="text-lg font-semibold text-white">
                        {item.title}
                      </h3>

                      <p className="text-sm text-gray-400">
                        {item.username}
                      </p>
                    </div>
                  </div>

                  {/* Action */}
                  <button
                    className="
                      w-12
                      h-12
                      rounded-2xl
                      bg-black/20
                      border
                      border-white/10
                      hover:border-cyan-500/20
                      transition-all
                      duration-300
                      flex
                      items-center
                      justify-center
                    "
                  >
                    <ExternalLink
                      className="text-gray-300"
                      size={18}
                    />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Summary */}
        <div className="mt-8 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-white/10 rounded-3xl p-5">
          
          <h3 className="text-lg font-semibold text-white mb-2">
            AI Networking Summary
          </h3>

          <p className="text-sm text-gray-300 leading-relaxed">
            Your professional profiles strengthen online
            visibility, recruiter reach, and technical
            credibility while showcasing projects, coding
            skills, and interview performance.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default SocialLinksCard;