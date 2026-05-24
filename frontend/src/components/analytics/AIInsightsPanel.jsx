// src/components/analytics/AIInsightsPanel.jsx

import { motion } from "framer-motion";

import {
  Brain,
  Sparkles,
  TrendingUp,
  Lightbulb,
  Rocket,
} from "lucide-react";

const insights = [
  {
    title: "Coding Performance Improved",
    description:
      "Your DSA problem-solving speed improved by 24% compared to last month.",
    icon: TrendingUp,
    color: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
  },
  {
    title: "Communication Becoming Stronger",
    description:
      "AI detected better sentence clarity and improved confidence in mock interviews.",
    icon: Brain,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
  },
  {
    title: "Placement Readiness Increasing",
    description:
      "Your current analytics suggest strong preparation for frontend and MERN roles.",
    icon: Rocket,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
  },
];

const AIInsightsPanel = () => {
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
          
          <div className="flex items-center gap-4">
            
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <Brain
                className="text-cyan-400"
                size={26}
              />
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white">
                AI Insights
              </h2>

              <p className="text-sm text-gray-400">
                Personalized interview intelligence
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm">
            <Sparkles size={16} />
            Smart Recommendations
          </div>
        </div>

        {/* Insight Cards */}
        <div className="space-y-5">
          
          {insights.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={index}
                whileHover={{ y: -3 }}
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

                <div className="relative flex gap-5">
                  
                  {/* Icon */}
                  <div
                    className={`
                      w-14
                      h-14
                      rounded-2xl
                      flex
                      items-center
                      justify-center
                      shrink-0
                      ${item.bg}
                    `}
                  >
                    <Icon
                      className={item.color}
                      size={26}
                    />
                  </div>

                  {/* Content */}
                  <div>
                    
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {item.title}
                    </h3>

                    <p className="text-sm text-gray-300 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* AI Recommendation */}
        <div className="mt-8 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-white/10 rounded-3xl p-5">
          
          <div className="flex items-start gap-3">
            
            <Lightbulb
              className="text-yellow-400 mt-1"
              size={20}
            />

            <div>
              
              <h3 className="text-lg font-semibold text-white mb-2">
                AI Career Suggestion
              </h3>

              <p className="text-sm text-gray-300 leading-relaxed">
                Based on your analytics and coding performance,
                you are progressing strongly toward MERN Stack
                and Frontend Engineering interview readiness.
                Continue practicing medium-level DSA and mock
                interviews consistently.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AIInsightsPanel;