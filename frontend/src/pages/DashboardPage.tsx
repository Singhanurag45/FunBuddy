import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { DashboardMetrics } from '../components/DashboardMetrics';
import { motion } from 'framer-motion';
import { api } from '../services/api';
import type { DashboardAnalytics } from '../services/api';
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

const PIE_COLORS = ['#22c55e', '#ef4444'];

const emptyAnalytics: DashboardAnalytics = {
  dailyStreak: 0,
  accuracyPercentage: 0,
  totalQuizzesPlayed: 0,
  totalCorrectAnswers: 0,
  totalWrongAnswers: 0,
  weeklyPoints: [],
  subjectAccuracy: [
    { subject: 'Math', accuracy: 0 },
    { subject: 'Science', accuracy: 0 },
    { subject: 'English', accuracy: 0 },
  ],
  monthlySummary: {
    quizzesPlayed: 0,
    pointsEarned: 0,
    accuracy: 0,
  },
};

export function DashboardPage() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<DashboardAnalytics>(emptyAnalytics);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      if (!user?.id) return;
      try {
        setLoadingAnalytics(true);
        const response = await api.getDashboardAnalytics(user.id);
        setAnalytics(response);
      } catch (error) {
        console.error('Failed to load dashboard analytics', error);
        setAnalytics(emptyAnalytics);
      } finally {
        setLoadingAnalytics(false);
      }
    };

    loadAnalytics();
  }, [user?.id, user?.points, user?.level]);

  const pieData = useMemo(
    () => [
      { name: 'Correct', value: analytics.totalCorrectAnswers },
      { name: 'Wrong', value: analytics.totalWrongAnswers },
    ],
    [analytics.totalCorrectAnswers, analytics.totalWrongAnswers]
  );

  if (!user) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <div className="absolute inset-0 blur-2xl bg-primary/20 -z-10"></div>
        </div>
      </div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="max-w-6xl mx-auto py-6 px-4">
      <motion.header variants={item} className="mb-10">
        <h1 className="text-5xl font-black text-slate-900 mb-2 tracking-tight">
          Welcome back, <span className="text-primary">{user.name.split(' ')[0]}</span>!
        </h1>
        <p className="text-xl text-slate-500 font-medium">
          Your live learning analytics for quizzes and progress.
        </p>
      </motion.header>

      <motion.div variants={item}>
        <DashboardMetrics user={user} analytics={analytics} />
      </motion.div>

      <motion.section variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
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
      </motion.section>

      <motion.section variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
      </motion.section>
    </motion.div>
  );
}
