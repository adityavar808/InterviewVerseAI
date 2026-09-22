// src/pages/settings/Settings.jsx

import { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";

import SettingsHeader from "../../components/settings/SettingsHeader";
import SettingsSubSidebar from "../../components/settings/SettingsSubSidebar";
import AccountSettings from "../../components/settings/AccountSettings";
import SecuritySettings from "../../components/settings/SecuritySettings";
import NotificationSettings from "../../components/settings/NotificationSettings";
import AppearanceSettings from "../../components/settings/AppearanceSettings";
import InterviewPreferences from "../../components/settings/InterviewPreferences";
import ConnectedAccounts from "../../components/settings/ConnectedAccounts";
import DangerZone from "../../components/settings/DangerZone";
import { motion, AnimatePresence } from "framer-motion";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("account");

  const renderActiveSection = () => {
    switch (activeTab) {
      case "account":
        return <AccountSettings />;
      case "security":
        return <SecuritySettings />;
      case "notifications":
        return <NotificationSettings />;
      case "appearance":
        return <AppearanceSettings />;
      case "preferences":
        return <InterviewPreferences />;
      case "connected":
        return <ConnectedAccounts />;
      case "danger":
        return <DangerZone />;
      default:
        return <AccountSettings />;
    }
  };

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-105px)] text-white flex flex-col overflow-hidden">
        {/* Top Settings Welcome Header (Fixed) */}
        <div className="flex-shrink-0 mb-4">
          <SettingsHeader activeTab={activeTab} onSelectTab={setActiveTab} />
        </div>

        {/* Settings Sub-Sidebar Layout */}
        <div className="flex-1 flex flex-col lg:flex-row gap-5 min-h-0 overflow-hidden">
          {/* Sub-Sidebar Menu (Fixed) */}
          <div className="w-full lg:w-72 xl:w-80 flex-shrink-0 overflow-y-auto scrollbar-none">
            <SettingsSubSidebar
              activeTab={activeTab}
              onSelectTab={setActiveTab}
            />
          </div>

          {/* Active Settings Panel (ONLY THIS SCROLLS) */}
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

export default Settings;