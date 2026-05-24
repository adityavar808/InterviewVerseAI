// src/pages/profile/Profile.jsx

import DashboardLayout from "../../layouts/DashboardLayout";

import ProfileHeader from "../../components/profile/ProfileHeader";
import ProfileStats from "../../components/profile/ProfileStats";
import ProfileAboutCard from "../../components/profile/ProfileAboutCard";
import SkillsSection from "../../components/profile/SkillsSection";
import AchievementsSection from "../../components/profile/AchievementsSection";
import ActivityTimeline from "../../components/profile/ActivityTimeline";
import CertificatesSection from "../../components/profile/CertificatesSection";
import SocialLinksCard from "../../components/profile/SocialLinksCard";

const Profile = () => {
  return (
    <DashboardLayout>
      <div className="h-full text-white">
        
        {/* Header */}
        <div className="mb-6">
          <ProfileHeader />
        </div>

        {/* Stats */}
        <div className="mb-6">
          <ProfileStats />
        </div>

        {/* About + Skills */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mb-6">
          
          {/* About */}
          <div className="xl:col-span-5">
            <ProfileAboutCard />
          </div>

          {/* Skills */}
          <div className="xl:col-span-7">
            <SkillsSection />
          </div>
        </div>

        {/* Achievements + Timeline */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mb-6">
          
          {/* Achievements */}
          <div className="xl:col-span-6">
            <AchievementsSection />
          </div>

          {/* Timeline */}
          <div className="xl:col-span-6">
            <ActivityTimeline />
          </div>
        </div>

        {/* Certificates */}
        <div className="mb-6">
          <CertificatesSection />
        </div>

        {/* Social Links */}
        <div>
          <SocialLinksCard />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;