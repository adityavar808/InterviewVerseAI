// src/pages/analytics/Analytics.jsx

import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { studentService } from "../../services/studentApi";

import AnalyticsHeader from "../../components/analytics/AnalyticsHeader";
import PerformanceStats from "../../components/analytics/PerformanceStats";
import SkillRadarChart from "../../components/analytics/SkillRadarChart";
import InterviewProgressChart from "../../components/analytics/InterviewProgressChart";
import WeaknessAnalysis from "../../components/analytics/WeaknessAnalysis";
import AIInsightsPanel from "../../components/analytics/AIInsightsPanel";
import ActivityHeatmap from "../../components/analytics/ActivityHeatmap";
import RecentSessionsTable from "../../components/analytics/RecentSessionsTable";

const Analytics = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <DashboardLayout>
      <div className="h-full text-white">
        
        {/* Header */}
        <div className="mb-6">
          <AnalyticsHeader />
        </div>

        {/* Stats */}
        <div className="mb-6">
          <PerformanceStats stats={dashboardData?.charts?.performanceStats} />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mb-6">
          
          {/* Radar Chart */}
          <div className="xl:col-span-5">
            <SkillRadarChart data={dashboardData?.charts?.skillRadar} />
          </div>

          {/* Progress Chart */}
          <div className="xl:col-span-7">
            <InterviewProgressChart data={dashboardData?.charts?.performanceChart} />
          </div>
        </div>

        {/* Insights Section */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mb-6">
          
          {/* Weakness Analysis */}
          <div className="xl:col-span-6">
            <WeaknessAnalysis weaknesses={dashboardData?.weaknesses} />
          </div>

          {/* AI Insights */}
          <div className="xl:col-span-6">
            <AIInsightsPanel stats={dashboardData?.charts?.performanceStats} weaknesses={dashboardData?.weaknesses} />
          </div>
        </div>

        {/* Heatmap */}
        <div className="mb-6">
          <ActivityHeatmap data={dashboardData?.charts?.activityHeatmap} streak={dashboardData?.user?.streak} />
        </div>

        {/* Recent Sessions */}
        <div>
          <RecentSessionsTable />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics; 