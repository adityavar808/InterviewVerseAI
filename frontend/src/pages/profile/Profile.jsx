// src/pages/profile/Profile.jsx

import DashboardLayout from "../../layouts/DashboardLayout";
import ProfileHeader    from "../../components/profile/ProfileHeader";
import ProfileStats     from "../../components/profile/ProfileStats";
import ProfileAboutCard from "../../components/profile/ProfileAboutCard";
import SkillsSection    from "../../components/profile/SkillsSection";
import AchievementsSection from "../../components/profile/AchievementsSection";
import ActivityTimeline from "../../components/profile/ActivityTimeline";
import CertificatesSection from "../../components/profile/CertificatesSection";
import SocialLinksCard  from "../../components/profile/SocialLinksCard";

const Profile = () => (
  <DashboardLayout>
    <div className="h-full text-white space-y-6">

      {/* Header */}
      <ProfileHeader />

      {/* Stats row */}
      <ProfileStats />

      {/* About (5 cols) + Skills (7 cols) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-5">
          <ProfileAboutCard />
        </div>
        <div className="xl:col-span-7">
          <SkillsSection />
        </div>
      </div>

      {/* Achievements (6) + Timeline (6) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-6">
          <AchievementsSection />
        </div>
        <div className="xl:col-span-6">
          <ActivityTimeline />
        </div>
      </div>

      {/* Certifications */}
      <CertificatesSection />

      {/* Social Links */}
      <SocialLinksCard />

    </div>
  </DashboardLayout>
);

export default Profile;