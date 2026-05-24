// src/pages/settings/Settings.jsx

import DashboardLayout from "../../layouts/DashboardLayout";

import SettingsHeader from "../../components/settings/SettingsHeader";
import AccountSettings from "../../components/settings/AccountSettings";
import SecuritySettings from "../../components/settings/SecuritySettings";
import NotificationSettings from "../../components/settings/NotificationSettings";
import AppearanceSettings from "../../components/settings/AppearanceSettings";
import InterviewPreferences from "../../components/settings/InterviewPreferences";
import ConnectedAccounts from "../../components/settings/ConnectedAccounts";
import DangerZone from "../../components/settings/DangerZone";

const Settings = () => {
  return (
    <DashboardLayout>
      <div className="h-full text-white">
        
        {/* Header */}
        <div className="mb-6">
          <SettingsHeader />
        </div>

        {/* Account Settings */}
        <div className="mb-6">
          <AccountSettings />
        </div>

        {/* Security + Notifications */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mb-6">
          
          <div className="xl:col-span-6">
            <SecuritySettings />
          </div>

          <div className="xl:col-span-6">
            <NotificationSettings />
          </div>
        </div>

        {/* Appearance + Interview Preferences */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mb-6">
          
          <div className="xl:col-span-6">
            <AppearanceSettings />
          </div>

          <div className="xl:col-span-6">
            <InterviewPreferences />
          </div>
        </div>

        {/* Connected Accounts */}
        <div className="mb-6">
          <ConnectedAccounts />
        </div>

        {/* Danger Zone */}
        <div>
          <DangerZone />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;