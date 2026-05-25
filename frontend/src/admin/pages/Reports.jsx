import { useEffect, useState } from "react";
import {
  BarChart3,
  FileStack,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import StatsCard from "../components/ui/StatsCard";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import StatusBadge from "../components/ui/StatusBadge";
import { adminService } from "../services/adminApi";
import { formatCompactNumber } from "../utils/adminHelpers";

const Reports = () => {
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] =
    useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadReport = async () => {
      try {
        setIsLoading(true);
        const response =
          await adminService.getReports();
        setReport(response.data);
      } catch (requestError) {
        setError(
          requestError.response?.data
            ?.message ||
            "Unable to load reports",
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadReport();
  }, []);

  if (isLoading) {
    return (
      <div className="rounded-[28px] border border-white/10 bg-white/5 p-12">
        <LoadingSpinner label="Loading reports" />
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

  const summary =
    report?.summary || {};
  const distributions =
    report?.distributions || {};

  const statCards = [
    {
      title: "Verification rate",
      value: `${summary.verificationRate || 0}%`,
      growth: 0,
      subtitle: "learner activation",
      icon: ShieldCheck,
      accent: "emerald",
    },
    {
      title: "Publish rate",
      value: `${summary.publishRate || 0}%`,
      growth: 0,
      subtitle: "content live status",
      icon: FileStack,
      accent: "cyan",
    },
    {
      title: "Content items",
      value: formatCompactNumber(
        summary.contentItems,
      ),
      growth: 0,
      subtitle: "questions and templates",
      icon: BarChart3,
      accent: "amber",
    },
  ];

  const renderDistribution = (
    title,
    items = [],
  ) => (
    <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
      <h3 className="text-lg font-semibold text-white">
        {title}
      </h3>
      <div className="mt-5 space-y-3">
        {items.length ? (
          items.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
            >
              <span className="text-sm text-slate-300">
                {item.name}
              </span>
              <span className="text-sm font-semibold text-white">
                {item.value}
              </span>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-400">
            No data available yet.
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-white/10 bg-[linear-gradient(135deg,rgba(8,145,178,0.16),rgba(15,23,42,0.82),rgba(249,115,22,0.08))] p-8">
        <p className="text-[11px] uppercase tracking-[0.24em] text-cyan-300">
          Reporting
        </p>
        <h1 className="mt-3 text-4xl font-bold text-white">
          Platform reports
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
          Track account health, publishing coverage, category balance, and content momentum across the platform.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {statCards.map((card) => (
          <StatsCard
            key={card.title}
            {...card}
          />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        {renderDistribution(
          "User statuses",
          distributions.userStatuses,
        )}
        {renderDistribution(
          "Interview categories",
          distributions.interviewCategories,
        )}
        {renderDistribution(
          "Coding categories",
          distributions.codingCategories,
        )}
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.1fr)]">
        {renderDistribution(
          "Interview difficulty",
          distributions.interviewDifficulty,
        )}
        {renderDistribution(
          "Coding difficulty",
          distributions.codingDifficulty,
        )}

        <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
          <div className="flex items-center gap-2 text-cyan-300">
            <Sparkles size={18} />
            <p className="text-xs uppercase tracking-[0.24em]">
              Insights
            </p>
          </div>

          <div className="mt-5 space-y-4">
            {report?.insights?.length ? (
              report.insights.map(
                (insight, index) => (
                  <div
                    key={index}
                    className="rounded-[24px] border border-white/10 bg-white/5 p-4"
                  >
                    <StatusBadge value="info" />
                    <p className="mt-3 text-sm leading-7 text-slate-300">
                      {insight}
                    </p>
                  </div>
                ),
              )
            ) : (
              <p className="text-sm text-slate-400">
                Insights will populate as more usage data comes in.
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
          <h3 className="text-lg font-semibold text-white">
            Top learner skills
          </h3>
          <div className="mt-5 space-y-3">
            {report?.topSkills?.length ? (
              report.topSkills.map((skill) => (
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
              ))
            ) : (
              <p className="text-sm text-slate-400">
                No skills recorded yet.
              </p>
            )}
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
          <h3 className="text-lg font-semibold text-white">
            Top content tags
          </h3>
          <div className="mt-5 flex flex-wrap gap-3">
            {report?.topTags?.length ? (
              report.topTags.map((tag) => (
                <div
                  key={tag.name}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300"
                >
                  <span className="font-medium text-white">
                    {tag.name}
                  </span>
                  <span className="ml-2 text-slate-500">
                    {tag.count}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400">
                Tags will appear here once content is labeled.
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Reports;
