import DashboardLayout from "../../layouts/DashboardLayout";
import ResumeStats from "../../components/resume/ResumeStats";
import ResumePreviewCard from "../../components/resume/ResumePreviewCard";
import MissingKeywords from "../../components/resume/MissingKeywords";
import TargetRoleSelector from "../../components/resume/TargetRoleSelector";
import ATSRadarChart from "../../components/resume/ATSRadarChart";
import ResumeActivityTimeline from "../../components/resume/ResumeActivityTimeline";
import ResumeImprovementRoadmap from "../../components/resume/ResumeImprovementRoadmap";
import ResumeActionCenter from "../../components/resume/ResumeActionCenter";

import { motion } from "framer-motion";
import {
  Upload,
  FileText,
  Brain,
  BadgeCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";

const ResumeAnalyzer = () => {
  return (
    <DashboardLayout>
      <div className="h-full text-white">
        {/* Header */}
        <div className="mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold mb-2"
          >
            Resume Analyzer
          </motion.h1>

          <p className="text-gray-400 text-lg">
            Upload your resume and get AI-powered ATS analysis.
          </p>
        </div>

        {/* Stats */}
        <div className="mb-6">
          <ResumeStats />
        </div>

        <div className="mt-6">
          <ResumePreviewCard />
        </div>

        <div className="mt-6">
          <TargetRoleSelector />
        </div>

        <div className="mt-6">
          <ATSRadarChart />
        </div>

        <div className="mt-6">
          <ResumeActivityTimeline />
        </div>

        <div className="mt-6">
          <ResumeImprovementRoadmap />
        </div>

        <div className="mt-6">
          <ResumeActionCenter />
        </div>

        <div className="mt-6">
          <MissingKeywords />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ResumeAnalyzer;