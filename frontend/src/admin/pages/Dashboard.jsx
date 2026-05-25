import { useEffect, useState } from "react";
import {
  Activity,
  Code2,
  ShieldCheck,
  UsersRound,
} from "lucide-react";

import StatsCard from "../components/ui/StatsCard";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import UsersGrowthChart from "../components/Charts/UsersGrowthChart";
import InterviewChart from "../components/Charts/InterviewChart";
import AIUsageChart from "../components/Charts/AIUsageChart";
import StatusBadge from "../components/ui/StatusBadge";
import { adminService } from "../services/adminApi";
import {
  formatCompactNumber,
  formatDateTime,
  formatRelativeTime,
} from "../utils/adminHelpers";

const Dashboard = () => {
  const [dashboard, setDashboard] =
    useState(null);
  const [isLoading, setIsLoading] =
    useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setIsLoading(true);
        const response =
          await adminService.getDashboard();
        setDashboard(response.data);
      } catch (requestError) {
        setError(
          requestError.response?.data
            ?.message ||
            "Unable to load dashboard",
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (isLoading) {
    return (
      <div className="rounded-[28px] border border-white/10 bg-white/5 p-12">
        <LoadingSpinner label="Loading admin dashboard" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-[28px] border border-rose-400/20 bg-rose-400/10 p-6 text-rose-300">
        {error}
      </div>
    );
  }

  const overview =
    dashboard?.overview || {};

  const statCards = [
    {
      title: "Total Users",
      value: formatCompactNumber(
        overview.totalUsers,
      ),
      growth: overview.userGrowth || 0,
      subtitle: "new learner growth",
      icon: UsersRound,
      accent: "cyan",
    },
    {
      title: "Active In 30 Days",
      value: formatCompactNumber(
        overview.activeUsers,
      ),
      growth: overview.userGrowth || 0,
      subtitle: "engaged accounts",
      icon: Activity,
      accent: "sky",
    },
    {
      title: "Interview Templates",
      value: formatCompactNumber(
        overview.totalInterviews,
      ),
      growth:
        overview.interviewGrowth || 0,
      subtitle: "template inventory",
      icon: ShieldCheck,
      accent: "amber",
    },
    {
      title: "Coding Questions",
      value: formatCompactNumber(
        overview.totalCodingQuestions,
      ),
      growth:
        overview.questionGrowth || 0,
      subtitle: "question bank growth",
      icon: Code2,
      accent: "emerald",
    },
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-white/10 bg-[linear-gradient(135deg,rgba(8,145,178,0.16),rgba(15,23,42,0.82),rgba(245,158,11,0.08))] p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.24em] text-cyan-300">
              Platform overview
            </p>
            <h1 className="mt-3 text-4xl font-bold text-white">
              Admin dashboard
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
              Monitor learner activity, template inventory, question coverage, and platform-wide alerts from one operational view.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Verified users
              </p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {formatCompactNumber(
                  overview.verifiedUsers,
                )}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Published interviews
              </p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {formatCompactNumber(
                  overview.publishedInterviews,
                )}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Published questions
              </p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {formatCompactNumber(
                  overview.publishedCodingQuestions,
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <StatsCard
            key={card.title}
            {...card}
          />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(0,0.95fr)]">
        <UsersGrowthChart
          data={
            dashboard?.charts
              ?.userGrowth || []
          }
        />

        <div className="grid gap-6">
          <InterviewChart
            data={
              dashboard?.charts
                ?.interviewCategories ||
              []
            }
          />
        </div>
      </section>

      <section>
        <AIUsageChart
          data={
            dashboard?.charts
              ?.codingDifficulties || []
          }
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                New users
              </p>
              <h3 className="mt-2 text-xl font-semibold text-white">
                Recent registrations
              </h3>
            </div>
          </div>

          <div className="space-y-4">
            {dashboard?.recentUsers?.length ? (
              dashboard.recentUsers.map(
                (user) => (
                  <div
                    key={user._id}
                    className="flex flex-col gap-4 rounded-[24px] border border-white/10 bg-white/5 p-4 md:flex-row md:items-center md:justify-between"
                  >
                    <div>
                      <p className="font-semibold text-white">
                        {user.name}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {user.email}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <StatusBadge
                        value={user.role}
                      />
                      <StatusBadge
                        value={user.status}
                      />
                      <span className="text-sm text-slate-400">
                        Joined{" "}
                        {formatRelativeTime(
                          user.createdAt,
                        )}
                      </span>
                    </div>
                  </div>
                ),
              )
            ) : (
              <p className="text-slate-400">
                No recent users yet.
              </p>
            )}
          </div>
        </div>

        <div className="grid gap-6">
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
              Alerts
            </p>
            <h3 className="mt-2 text-xl font-semibold text-white">
              Operational signals
            </h3>

            <div className="mt-6 space-y-4">
              {dashboard?.alerts?.map(
                (alert) => (
                  <div
                    key={alert.title}
                    className="rounded-[24px] border border-white/10 bg-white/5 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold text-white">
                        {alert.title}
                      </p>
                      <StatusBadge
                        value={alert.type}
                      />
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      {alert.message}
                    </p>
                  </div>
                ),
              )}
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
              Skills
            </p>
            <h3 className="mt-2 text-xl font-semibold text-white">
              Top learner skills
            </h3>

            <div className="mt-6 space-y-3">
              {dashboard?.topSkills?.length ? (
                dashboard.topSkills.map(
                  (skill) => (
                    <div
                      key={skill.name}
                      className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                    >
                      <span className="text-sm text-slate-300">
                        {skill.name}
                      </span>
                      <span className="text-sm font-semibold text-white">
                        {skill.count}
                      </span>
                    </div>
                  ),
                )
              ) : (
                <p className="text-slate-400">
                  Skill tags will appear here once learners start filling out profiles.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[28px] border border-white/10 bg-white/5 p-6">
        <div className="mb-6">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
            Activity feed
          </p>
          <h3 className="mt-2 text-xl font-semibold text-white">
            Recent platform changes
          </h3>
        </div>

        <div className="space-y-4">
          {dashboard?.recentActivity?.length ? (
            dashboard.recentActivity.map(
              (item, index) => (
                <div
                  key={`${item.title}-${index}`}
                  className="flex flex-col gap-3 rounded-[24px] border border-white/10 bg-white/5 p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="font-semibold text-white">
                      {item.title}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {item.subtitle}
                    </p>
                  </div>
                  <span className="text-sm text-slate-400">
                    {formatDateTime(
                      item.createdAt,
                    )}
                  </span>
                </div>
              ),
            )
          ) : (
            <p className="text-slate-400">
              No platform activity yet.
            </p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
