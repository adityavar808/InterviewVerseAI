// src/components/analytics/AIInsightsPanel.jsx

import { motion } from "framer-motion";

import {
  Brain,
  Sparkles,
  TrendingUp,
  Lightbulb,
  Rocket,
} from "lucide-react";

const defaultInsights = [
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

const AIInsightsPanel = ({ stats, weaknesses }) => {
  const totalInterviews = stats?.find(s => s.title === "Total Interviews")?.value || "0";
  const avgScore = stats?.find(s => s.title === "Average Score")?.value || "0%";
  const codingAccuracy = stats?.find(s => s.title === "Coding Accuracy")?.value || "0%";
  const comms = stats?.find(s => s.title === "Communication")?.value || "0%";

  const dynamicInsights = [
    {
      title: "Coding Accuracy",
      description: parseInt(codingAccuracy) > 0 
        ? `Your coding accuracy stands at ${codingAccuracy}. Keep solving medium DSA challenges to improve edge-case coverage.`
        : "Solve coding challenges to enable AI coding accuracy insights.",
      icon: TrendingUp,
      color: "text-green-400",
      bg: "bg-green-500/10",
      border: "border-green-500/20",
    },
    {
      title: "Communication Quality",
      description: parseInt(comms) > 0 
        ? `AI communication score is at ${comms}. You show confident delivery; keep focusing on technical structure in answers.`
        : "Complete mock interviews to generate AI verbal communication analysis.",
      icon: Brain,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/20",
    },
    {
      title: "Placement Readiness",
      description: parseInt(totalInterviews) > 0 
        ? `You have completed ${totalInterviews} mock interviews with an average score of ${avgScore}, increasing your market preparedness.`
        : "Complete your first mock interview to activate placement readiness evaluation.",
      icon: Rocket,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
    },
  ];

  const hasStats = stats && stats.length > 0;
  const displayInsights = hasStats ? dynamicInsights : defaultInsights;

  const hasWeakness = weaknesses && weaknesses.length > 0;
  const careerSuggestion = hasWeakness 
    ? `Based on your recent performances, focus on practicing ${weaknesses[0].title} (${weaknesses[0].improvement.toLowerCase()}) to boost your readiness.`
    : "Excellent preparation! Your mock interviews show balanced technical and communication skills. Continue regular practice to maintain consistency.";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden bg-white/[0.035] border border-white/10 backdrop-blur-xl rounded-3xl p-5"
    >
      {/* Glow and top line border */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 -left-12 h-56 w-56 rounded-full bg-cyan-500/[0.06] blur-[50px]" />
        <div className="absolute -top-20 -right-12 h-56 w-56 rounded-full bg-purple-500/[0.06] blur-[50px]" />
        <div className="absolute top-0 left-0 right-0 h-[2px] rounded-full"
             style={{ background: "linear-gradient(90deg, rgba(6,182,212,0.5), rgba(139,92,246,0.3), transparent)" }} />
      </div>

      <div className="relative">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8 relative">
          
          <div className="flex items-center gap-4">
            
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center flex-shrink-0">
              <Brain
                className="text-cyan-400"
                size={24}
              />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white tracking-tight">
                AI Insights
              </h2>

              <p className="text-xs text-slate-400 mt-0.5">
                Personalized interview intelligence
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-medium">
            <Sparkles size={13} />
            Smart Recommendations
          </div>
        </div>

        {/* Insight Cards */}
        <div className="space-y-4">
          
          {displayInsights.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={index}
                whileHover={{ y: -3 }}
                className="
                  relative
                  overflow-hidden
                  rounded-2xl
                  border
                  border-white/10
                  bg-white/[0.03]
                  p-4
                  hover:bg-white/[0.045]
                  transition-all
                  duration-300
                "
              >
                <div className="relative flex gap-4">
                  
                  {/* Icon */}
                  <div
                    className={`
                      w-10
                      h-10
                      rounded-xl
                      flex
                      items-center
                      justify-center
                      shrink-0
                      border
                      ${item.bg}
                      ${item.border}
                    `}
                  >
                    <Icon
                      className={item.color}
                      size={20}
                    />
                  </div>

                  {/* Content */}
                  <div>
                    
                    <h3 className="text-base font-semibold text-white mb-1">
                      {item.title}
                    </h3>

                    <p className="text-sm text-slate-300 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* AI Recommendation */}
        <div className="mt-6 bg-white/[0.03] border border-white/10 rounded-2xl p-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/[0.03] to-purple-500/[0.03] pointer-events-none" />
          <div className="relative flex items-start gap-3">
            
            <Lightbulb
              className="text-yellow-400 mt-0.5 flex-shrink-0"
              size={18}
            />

            <div>
              
              <h3 className="text-base font-semibold text-white mb-1 tracking-tight">
                AI Career Suggestion
              </h3>

              <p className="text-sm text-slate-300 leading-relaxed">
                {careerSuggestion}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AIInsightsPanel;