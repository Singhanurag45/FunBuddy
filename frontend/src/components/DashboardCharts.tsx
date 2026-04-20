import { useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import type { DashboardAnalytics } from '../services/api';

interface DashboardChartsProps {
  analytics: DashboardAnalytics;
  loadingAnalytics: boolean;
}

const PIE_COLORS = ['#22c55e', '#ef4444'];

export function DashboardCharts({ analytics, loadingAnalytics }: DashboardChartsProps) {
  const pieData = useMemo(
    () => [
      { name: 'Correct', value: analytics.totalCorrectAnswers },
      { name: 'Wrong', value: analytics.totalWrongAnswers },
    ],
    [analytics.totalCorrectAnswers, analytics.totalWrongAnswers]
  );

  return (
    <>
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-4xl shadow-sm border border-slate-100">
          <h2 className="text-xl font-black text-slate-800 mb-4">Weekly Points Progress</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.weeklyPoints}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="points" stroke="#3b82f6" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-4xl shadow-sm border border-slate-100">
          <h2 className="text-xl font-black text-slate-800 mb-4">Subject-wise Accuracy</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.subjectAccuracy}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="subject" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="accuracy" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-4xl shadow-sm border border-slate-100 lg:col-span-1">
          <h2 className="text-xl font-black text-slate-800 mb-4">Correct vs Wrong Answers</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={90} label>
                  {pieData.map((entry, index) => (
                    <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-4xl shadow-sm border border-slate-100 lg:col-span-2">
          <h2 className="text-xl font-black text-slate-800 mb-4">Monthly Performance Summary</h2>
          {loadingAnalytics ? (
            <div className="h-72 flex items-center justify-center text-slate-400 font-bold">Loading analytics...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-72 content-start">
              <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
                <p className="text-slate-400 font-bold text-sm uppercase">Quizzes Played</p>
                <p className="text-4xl font-black text-slate-800 mt-2">{analytics.monthlySummary.quizzesPlayed}</p>
              </div>
              <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
                <p className="text-slate-400 font-bold text-sm uppercase">Points Earned</p>
                <p className="text-4xl font-black text-slate-800 mt-2">{analytics.monthlySummary.pointsEarned}</p>
              </div>
              <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
                <p className="text-slate-400 font-bold text-sm uppercase">Monthly Accuracy</p>
                <p className="text-4xl font-black text-slate-800 mt-2">{analytics.monthlySummary.accuracy}%</p>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
