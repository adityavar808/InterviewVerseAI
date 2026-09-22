// src/pages/analytics/Analytics.jsx

import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { studentService } from "../../services/studentApi";

import AnalyticsHeader from "../../components/analytics/AnalyticsHeader";
import AnalyticsSubSidebar from "../../components/analytics/AnalyticsSubSidebar";
import PerformanceStats from "../../components/analytics/PerformanceStats";
import SkillRadarChart from "../../components/analytics/SkillRadarChart";
import InterviewProgressChart from "../../components/analytics/InterviewProgressChart";
import WeaknessAnalysis from "../../components/analytics/WeaknessAnalysis";
import AIInsightsPanel from "../../components/analytics/AIInsightsPanel";
import ActivityHeatmap from "../../components/analytics/ActivityHeatmap";
import RecentSessionsTable from "../../components/analytics/RecentSessionsTable";
import LoadingSpinner from "../../components/dashboard/LoadingSpinner";
import { motion, AnimatePresence } from "framer-motion";

const Analytics = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await studentService.getDashboard();
        setDashboardData(res);
      } catch (error) {
        console.error("Failed to fetch analytics dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-12">
          <LoadingSpinner label="Loading analytics dashboard..." />
        </div>
      </DashboardLayout>
    );
  }

  const renderActiveSection = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-4">
            <PerformanceStats stats={dashboardData?.charts?.performanceStats} />
            <InterviewProgressChart data={dashboardData?.charts?.performanceChart} />
          </div>
        );
      case "skills":
        return <SkillRadarChart data={dashboardData?.charts?.skillRadar} />;
      case "heatmap":
        return (
          <ActivityHeatmap
            data={dashboardData?.charts?.activityHeatmap}
            streak={dashboardData?.user?.streak}
          />
        );
      case "weaknesses":
        return <WeaknessAnalysis weaknesses={dashboardData?.weaknesses} />;
      case "insights":
        return (
          <AIInsightsPanel
            stats={dashboardData?.charts?.performanceStats}
            weaknesses={dashboardData?.weaknesses}
          />
        );
      case "history":
        return <RecentSessionsTable />;
      default:
        return (
          <div className="space-y-4">
            <PerformanceStats stats={dashboardData?.charts?.performanceStats} />
            <InterviewProgressChart data={dashboardData?.charts?.performanceChart} />
          </div>
        );
    }
  };

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-105px)] text-white flex flex-col overflow-hidden">
        {/* Sleek Top Analytics Header (Fixed) */}
        <div className="flex-shrink-0 mb-4">
          <AnalyticsHeader activeTab={activeTab} onSelectTab={setActiveTab} />
        </div>

        {/* Analytics Sub-Sidebar & Right Panel Flex Layout */}
        <div className="flex-1 flex flex-col lg:flex-row gap-5 min-h-0 overflow-hidden">
          {/* Sticky Sub-Sidebar Menu (Fixed) */}
          <div className="w-full lg:w-72 xl:w-80 flex-shrink-0 overflow-y-auto scrollbar-none">
            <AnalyticsSubSidebar
              activeTab={activeTab}
              onSelectTab={setActiveTab}
            />
          </div>

          {/* Active Analytics Section Panel (ONLY THIS SCROLLS) */}
          <div className="flex-1 min-w-0 h-full overflow-y-auto space-y-5 pr-1.5 scrollbar-thin scrollbar-thumb-white/10">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                {renderActiveSection()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;