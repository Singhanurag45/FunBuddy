import { memo } from "react";
import type { DashboardAnalytics, UserProfile } from '../services/api';
import { motion } from 'framer-motion';
import { Star, Flame, Trophy, Target, BookOpenCheck } from 'lucide-react';

interface MetricProps {
  user: UserProfile;
  analytics: DashboardAnalytics;
}

export function DashboardMetrics({ user, analytics }: MetricProps) {
  const nextLevelPoints = 1500;
  const progress = Math.min((user.points / nextLevelPoints) * 100, 100);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { stiffness: 300, damping: 24 } },
  };

  const cards = [
    {
      key: 'points',
      label: 'Total Points',
      value: user.points,
      icon: <Star className="w-8 h-8 fill-current" />,
      iconClass: 'text-secondary bg-secondary/20',
    },
    {
      key: 'level',
      label: 'Level',
      value: `Lvl ${user.level}`,
      icon: <Trophy className="w-8 h-8" />,
      iconClass: 'text-primary bg-primary/10',
    },
    {
      key: 'streak',
      label: 'Daily Streak',
      value: `${analytics.dailyStreak} Days`,
      icon: <Flame className="w-8 h-8" />,
      iconClass: 'text-accent bg-accent/10',
    },
    {
      key: 'accuracy',
      label: 'Accuracy %',
      value: `${analytics.accuracyPercentage}%`,
      icon: <Target className="w-8 h-8" />,
      iconClass: 'text-success bg-success/15',
    },
    {
      key: 'quizzes',
      label: 'Total Quizzes Played',
      value: analytics.totalQuizzesPlayed,
      icon: <BookOpenCheck className="w-8 h-8" />,
      iconClass: 'text-indigo-600 bg-indigo-100',
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6 mb-8"
    >
      {cards.map((card) => (
        <motion.div
          key={card.key}
          variants={itemVariants}
          whileHover={{ y: -5 }}
          className="bg-white p-6 rounded-4xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-b-4 border-slate-100 flex flex-col items-center justify-center text-center gap-2"
        >
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-2 ${card.iconClass}`}>
            {card.icon}
          </div>
          <p className="text-slate-400 font-bold text-sm uppercase tracking-wider">{card.label}</p>
          <h2 className="text-4xl font-black text-slate-800">{card.value}</h2>
        </motion.div>
      ))}

      <motion.div
        variants={itemVariants}
        className="md:col-span-2 xl:col-span-5 bg-white p-6 rounded-4xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-b-4 border-slate-100"
      >
        <div className="flex items-center justify-between mb-3">
          <p className="text-slate-500 font-bold text-sm uppercase tracking-wider">
            Progress to Lvl {user.level + 1}
          </p>
          <span className="text-sm font-black text-primary">{progress.toFixed(0)}%</span>
        </div>
        <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden p-0.5">
          <motion.div
            className="h-full bg-success rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

export const MemoizedDashboardMetrics = memo(DashboardMetrics);
