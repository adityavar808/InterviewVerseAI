// src/pages/analytics/Analytics.jsx

import DashboardLayout from "../../layouts/DashboardLayout";

import AnalyticsHeader from "../../components/analytics/AnalyticsHeader";
import PerformanceStats from "../../components/analytics/PerformanceStats";
import SkillRadarChart from "../../components/analytics/SkillRadarChart";
import InterviewProgressChart from "../../components/analytics/InterviewProgressChart";
import WeaknessAnalysis from "../../components/analytics/WeaknessAnalysis";
import AIInsightsPanel from "../../components/analytics/AIInsightsPanel";
import ActivityHeatmap from "../../components/analytics/ActivityHeatmap";
import RecentSessionsTable from "../../components/analytics/RecentSessionsTable";

const Analytics = () => {
  return (
    <DashboardLayout>
      <div className="h-full text-white">
        
        {/* Header */}
        <div className="mb-6">
          <AnalyticsHeader />
        </div>

        {/* Stats */}
        <div className="mb-6">
          <PerformanceStats />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mb-6">
          
          {/* Radar Chart */}
          <div className="xl:col-span-5">
            <SkillRadarChart />
          </div>

          {/* Progress Chart */}
          <div className="xl:col-span-7">
            <InterviewProgressChart />
          </div>
        </div>

        {/* Insights Section */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mb-6">
          
          {/* Weakness Analysis */}
          <div className="xl:col-span-6">
            <WeaknessAnalysis />
          </div>

          {/* AI Insights */}
          <div className="xl:col-span-6">
            <AIInsightsPanel />
          </div>
        </div>

        {/* Heatmap */}
        <div className="mb-6">
          <ActivityHeatmap />
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