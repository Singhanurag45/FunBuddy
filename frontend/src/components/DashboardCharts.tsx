import { memo, useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DashboardAnalytics } from "../services/api";

interface DashboardChartsProps {
  analytics: DashboardAnalytics;
  loadingAnalytics: boolean;
}

const PIE_COLORS = ["#66d9b8", "#ff7a6b"];
const FLOATING_CARD_CLASS =
  "glass-card rounded-4xl p-6 shadow-[0_20px_25px_-5px_rgb(0_0_0_/_0.05)]";

export function DashboardCharts({
  analytics,
  loadingAnalytics,
}: DashboardChartsProps) {
  const isMobile =
    typeof window !== "undefined" &&
    window.matchMedia("(max-width: 768px)").matches;

  const pieData = useMemo(
    () => [
      { name: "Correct", value: analytics.totalCorrectAnswers },
      { name: "Wrong", value: analytics.totalWrongAnswers },
    ],
    [analytics.totalCorrectAnswers, analytics.totalWrongAnswers],
  );

  return (
    <>
      <section className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className={`${FLOATING_CARD_CLASS} relative overflow-hidden`}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,255,0.16),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.88),rgba(255,255,255,0.72))]" />
          <div className="relative">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.24em] text-slate-500">
                  Momentum
                </p>
                <h2 className="mt-2 text-2xl font-black text-slate-900">
                  Weekly Points Progress
                </h2>
              </div>
              <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-primary">
                Live trend
              </span>
            </div>
          </div>
          <div className="relative h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.weeklyPoints}>
                <CartesianGrid stroke="#d6e4ff" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" tickLine={false} axisLine={false} stroke="#6d8198" />
                <YAxis tickLine={false} axisLine={false} stroke="#6d8198" />
                <Tooltip
                  contentStyle={{
                    borderRadius: "20px",
                    border: "1px solid rgba(255,255,255,0.72)",
                    background: "rgba(255,255,255,0.88)",
                    boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.05)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="points"
                  stroke="#2563ff"
                  strokeWidth={4}
                  dot={{ r: 4, strokeWidth: 0, fill: "#2563ff" }}
                  activeDot={{ r: 6, fill: "#66d9b8", stroke: "#2563ff", strokeWidth: 2 }}
                  isAnimationActive={!isMobile}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={`${FLOATING_CARD_CLASS} relative overflow-hidden`}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,122,107,0.14),transparent_25%),linear-gradient(180deg,rgba(255,255,255,0.88),rgba(255,255,255,0.72))]" />
          <div className="relative">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.24em] text-slate-500">
                  Skill mix
                </p>
                <h2 className="mt-2 text-2xl font-black text-slate-900">
                  Subject-wise Accuracy
                </h2>
              </div>
              <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-accent">
                By subject
              </span>
            </div>
          </div>
          <div className="relative h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.subjectAccuracy}>
                <CartesianGrid stroke="#d6e4ff" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="subject" tickLine={false} axisLine={false} stroke="#6d8198" />
                <YAxis domain={[0, 100]} tickLine={false} axisLine={false} stroke="#6d8198" />
                <Tooltip
                  contentStyle={{
                    borderRadius: "20px",
                    border: "1px solid rgba(255,255,255,0.72)",
                    background: "rgba(255,255,255,0.88)",
                    boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.05)",
                  }}
                />
                <Bar
                  dataKey="accuracy"
                  fill="#ff7a6b"
                  radius={[18, 18, 0, 0]}
                  isAnimationActive={!isMobile}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className={`${FLOATING_CARD_CLASS} relative overflow-hidden lg:col-span-1`}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(102,217,184,0.16),transparent_26%),linear-gradient(180deg,rgba(255,255,255,0.88),rgba(255,255,255,0.72))]" />
          <div className="relative">
            <div className="mb-4">
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-slate-500">
                Answer split
              </p>
              <h2 className="mt-2 text-2xl font-black text-slate-900">
                Correct vs Wrong Answers
              </h2>
            </div>
          </div>
          <div className="relative h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={90}
                  innerRadius={52}
                  paddingAngle={4}
                  label
                  isAnimationActive={!isMobile}
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Legend />
                <Tooltip
                  contentStyle={{
                    borderRadius: "20px",
                    border: "1px solid rgba(255,255,255,0.72)",
                    background: "rgba(255,255,255,0.88)",
                    boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.05)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={`${FLOATING_CARD_CLASS} relative overflow-hidden lg:col-span-2`}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,255,0.16),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.88),rgba(255,255,255,0.72))]" />
          <div className="relative">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.24em] text-slate-500">
                  Monthly snapshot
                </p>
                <h2 className="mt-2 text-2xl font-black text-slate-900">
                  Monthly Performance Summary
                </h2>
              </div>
              <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-success-foreground">
                Last 30 days
              </span>
            </div>
          </div>
          {loadingAnalytics ? (
            <div className="relative flex h-72 items-center justify-center font-bold text-slate-400">
              Loading analytics...
            </div>
          ) : (
            <div className="relative grid h-72 content-start grid-cols-1 gap-4 md:grid-cols-3">
              <div className="surface-card rounded-3xl p-6 shadow-[0_20px_25px_-5px_rgb(0_0_0_/_0.05)]">
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">
                  Quizzes Played
                </p>
                <p className="mt-3 text-4xl font-black text-slate-900">
                  {analytics.monthlySummary.quizzesPlayed}
                </p>
              </div>
              <div className="surface-card rounded-3xl p-6 shadow-[0_20px_25px_-5px_rgb(0_0_0_/_0.05)]">
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">
                  Points Earned
                </p>
                <p className="mt-3 text-4xl font-black text-slate-900">
                  {analytics.monthlySummary.pointsEarned}
                </p>
              </div>
              <div className="surface-card rounded-3xl p-6 shadow-[0_20px_25px_-5px_rgb(0_0_0_/_0.05)]">
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">
                  Monthly Accuracy
                </p>
                <p className="mt-3 text-4xl font-black text-slate-900">
                  {analytics.monthlySummary.accuracy}%
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export const MemoizedDashboardCharts = memo(DashboardCharts);
