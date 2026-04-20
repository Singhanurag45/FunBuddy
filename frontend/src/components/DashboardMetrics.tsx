import { memo } from "react";
import type { DashboardAnalytics, UserProfile } from '../services/api';
import { motion } from 'framer-motion';
import { ArrowUpRight, BookOpenCheck, Flame, Sparkles, Star, Target, Trophy } from 'lucide-react';

interface MetricProps {
  user: UserProfile;
  analytics: DashboardAnalytics;
}

export function DashboardMetrics({ user, analytics }: MetricProps) {
  const nextLevelPoints = 1500;
  const progress = Math.min((user.points / nextLevelPoints) * 100, 100);
  const pointsToNextLevel = Math.max(nextLevelPoints - user.points, 0);

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
      iconClass: 'text-primary bg-primary/12',
      className: 'md:col-span-3 xl:col-span-3 xl:row-span-2',
      accentClass: 'from-primary/18 via-white/80 to-success/20',
      detail: 'Great spot for a coin burst or score counter Lottie loop.',
      pill: 'Lottie-ready',
    },
    {
      key: 'level',
      label: 'Level',
      value: `Lvl ${user.level}`,
      icon: <Trophy className="w-8 h-8" />,
      iconClass: 'text-accent bg-accent/12',
      className: 'md:col-span-3 xl:col-span-2',
      accentClass: 'from-accent/16 via-white/80 to-white/70',
      detail: `${pointsToNextLevel} points until the next level-up.`,
    },
    {
      key: 'streak',
      label: 'Daily Streak',
      value: `${analytics.dailyStreak} Days`,
      icon: <Flame className="w-8 h-8" />,
      iconClass: 'text-success bg-success/18',
      className: 'md:col-span-3 xl:col-span-3',
      accentClass: 'from-success/24 via-white/80 to-primary/10',
      detail: 'Perfect for a fire pulse or mascot celebration Lottie.',
      pill: 'Lottie-ready',
    },
    {
      key: 'accuracy',
      label: 'Accuracy %',
      value: `${analytics.accuracyPercentage}%`,
      icon: <Target className="w-8 h-8" />,
      iconClass: 'text-primary bg-primary/10',
      className: 'md:col-span-3 xl:col-span-2',
      accentClass: 'from-primary/14 via-white/82 to-white/72',
      detail: 'Consistency is turning into confidence.',
    },
    {
      key: 'quizzes',
      label: 'Total Quizzes Played',
      value: analytics.totalQuizzesPlayed,
      icon: <BookOpenCheck className="w-8 h-8" />,
      iconClass: 'text-sky-600 bg-sky-100/80',
      className: 'md:col-span-6 xl:col-span-2',
      accentClass: 'from-sky-100 via-white/85 to-success/10',
      detail: 'Every attempt adds signal to your learning profile.',
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 gap-6 md:grid-cols-6 xl:grid-cols-5 mb-8"
    >
      {cards.map((card) => (
        <motion.div
          key={card.key}
          variants={itemVariants}
          whileHover={{ y: -8, scale: 1.01 }}
          className={`glass-card group relative overflow-hidden rounded-4xl p-6 transition-transform ${card.className}`}
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${card.accentClass}`} />
          <div className="absolute right-5 top-5 h-20 w-20 rounded-full bg-white/45 blur-2xl transition-transform duration-300 group-hover:scale-125" />
          <div className="relative flex h-full flex-col">
            <div className="mb-8 flex items-start justify-between gap-4">
              <div className={`flex h-16 w-16 items-center justify-center rounded-2xl shadow-[0_20px_25px_-5px_rgb(0_0_0_/_0.05)] ${card.iconClass}`}>
                {card.icon}
              </div>
              {card.pill ? (
                <span className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/75 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  {card.pill}
                </span>
              ) : null}
            </div>

            <div className="mt-auto space-y-3">
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-slate-500">{card.label}</p>
              <div className="flex items-end justify-between gap-4">
                <h2 className="text-4xl font-black text-slate-900 md:text-5xl">{card.value}</h2>
                <ArrowUpRight className="h-5 w-5 shrink-0 text-slate-400 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-primary" />
              </div>
              <p className="max-w-xs text-sm font-medium leading-6 text-slate-600">{card.detail}</p>
            </div>
          </div>
        </motion.div>
      ))}

      <motion.div
        variants={itemVariants}
        whileHover={{ y: -6 }}
        className="glass-card relative overflow-hidden rounded-4xl p-6 md:col-span-6 xl:col-span-5"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,255,0.18),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.88),rgba(255,255,255,0.72))]" />
        <div className="relative">
          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-slate-500">
                Progress to Lvl {user.level + 1}
              </p>
              <h3 className="mt-2 text-3xl font-black text-slate-900">
                {pointsToNextLevel === 0 ? "Level complete" : `${pointsToNextLevel} points to go`}
              </h3>
            </div>
            <span className="inline-flex w-fit items-center rounded-full border border-primary/15 bg-primary/10 px-4 py-2 text-sm font-black text-primary">
              {progress.toFixed(0)}% complete
            </span>
          </div>
          <div className="w-full overflow-hidden rounded-full bg-white/80 p-1 shadow-[inset_0_1px_4px_rgba(37,99,255,0.08)]">
            <motion.div
              className="h-4 rounded-full bg-gradient-to-r from-primary via-[#4f8bff] to-success"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            />
          </div>
          <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold text-slate-600">
            <span className="rounded-full bg-white/75 px-4 py-2">Current XP: {user.points}</span>
            <span className="rounded-full bg-white/75 px-4 py-2">Next unlock: Level {user.level + 1}</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export const MemoizedDashboardMetrics = memo(DashboardMetrics);
