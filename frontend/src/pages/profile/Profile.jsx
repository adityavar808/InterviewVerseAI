// src/pages/profile/Profile.jsx

import { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";

import ProfileHeader from "../../components/profile/ProfileHeader";
import ProfileSubSidebar from "../../components/profile/ProfileSubSidebar";
import ProfileStats from "../../components/profile/ProfileStats";
import ProfileAboutCard from "../../components/profile/ProfileAboutCard";
import SkillsSection from "../../components/profile/SkillsSection";
import AchievementsSection from "../../components/profile/AchievementsSection";
import CertificatesSection from "../../components/profile/CertificatesSection";
import SocialLinksCard from "../../components/profile/SocialLinksCard";
import { motion, AnimatePresence } from "framer-motion";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const renderActiveSection = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-5">
            <ProfileStats />
            <ProfileAboutCard />
          </div>
        );
      case "skills":
        return <SkillsSection />;
      case "achievements":
        return <AchievementsSection />;
      case "certificates":
        return <CertificatesSection />;
      case "social":
        return <SocialLinksCard />;
      default:
        return (
          <div className="space-y-5">
            <ProfileStats />
            <ProfileAboutCard />
          </div>
        );
    }
  };

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-105px)] text-white flex flex-col overflow-hidden">
        {/* Top Sticky Profile Banner Header (Fixed) */}
        <div className="flex-shrink-0 mb-4">
          <ProfileHeader activeTab={activeTab} onSelectTab={setActiveTab} />
        </div>

        {/* Profile Sub-Sidebar Navigation & Active Content Flex Layout */}
        <div className="flex-1 flex flex-col lg:flex-row gap-5 min-h-0 overflow-hidden">
          {/* Sub-Sidebar Navigation Menu (Fixed) */}
          <div className="w-full lg:w-72 xl:w-80 flex-shrink-0 overflow-y-auto scrollbar-none">
            <ProfileSubSidebar
              activeTab={activeTab}
              onSelectTab={setActiveTab}
            />
          </div>

          {/* Active Profile Section Panel (Compact & Fit) */}
          <div className="flex-1 min-w-0 h-full overflow-y-auto space-y-3.5 pr-1 scrollbar-none">
            {/* Sub-Section Active Tab Content */}
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

export default Profile;