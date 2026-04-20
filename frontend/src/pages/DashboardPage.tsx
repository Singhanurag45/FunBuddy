import { lazy, Suspense, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Zap } from "lucide-react";
import { MemoizedDashboardMetrics } from "../components/DashboardMetrics";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import type { DashboardAnalytics } from "../services/api";

const DashboardCharts = lazy(() =>
  import("../components/DashboardCharts").then((module) => ({
    default: module.MemoizedDashboardCharts,
  })),
);

const emptyAnalytics: DashboardAnalytics = {
  dailyStreak: 0,
  accuracyPercentage: 0,
  totalQuizzesPlayed: 0,
  totalCorrectAnswers: 0,
  totalWrongAnswers: 0,
  weeklyPoints: [],
  subjectAccuracy: [
    { subject: "Math", accuracy: 0 },
    { subject: "Science", accuracy: 0 },
    { subject: "English", accuracy: 0 },
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
  const [shouldLoadCharts, setShouldLoadCharts] = useState(false);

  useEffect(() => {
    const loadAnalytics = async () => {
      if (!user?.id) return;
      try {
        setLoadingAnalytics(true);
        const response = await api.getDashboardAnalytics(user.id);
        setAnalytics(response);
      } catch (error) {
        console.error("Failed to load dashboard analytics", error);
        setAnalytics(emptyAnalytics);
      } finally {
        setLoadingAnalytics(false);
      }
    };

    loadAnalytics();
  }, [user?.id]);

  useEffect(() => {
    let cancelled = false;

    const loadChartsWhenIdle = () => {
      if (!cancelled) {
        setShouldLoadCharts(true);
      }
    };

    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      const idleId = (
        window as Window & {
          requestIdleCallback: (callback: () => void) => number;
          cancelIdleCallback?: (id: number) => void;
        }
      ).requestIdleCallback(loadChartsWhenIdle);

      return () => {
        cancelled = true;
        if ("cancelIdleCallback" in window) {
          (
            window as Window & { cancelIdleCallback?: (id: number) => void }
          ).cancelIdleCallback?.(idleId);
        }
      };
    }

    const timeoutId = globalThis.setTimeout(loadChartsWhenIdle, 1200);
    return () => {
      cancelled = true;
      globalThis.clearTimeout(timeoutId);
    };
  }, []);

  if (!user) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="relative">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
          <div className="absolute inset-0 -z-10 bg-primary/20 blur-2xl" />
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
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="mx-auto max-w-7xl px-4 py-6 md:px-6"
    >
      <motion.header
        variants={item}
        className="mb-10 grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.8fr)]"
      >
        <div className="glass-card relative overflow-hidden rounded-[2.75rem] px-6 py-8 md:px-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(102,217,184,0.24),transparent_26%),radial-gradient(circle_at_right,rgba(37,99,255,0.18),transparent_32%),linear-gradient(135deg,rgba(255,255,255,0.92),rgba(255,255,255,0.72))]" />
          <div className="relative">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/75 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-primary">
              <Sparkles className="h-4 w-4" />
              Learning command center
            </div>
            <h1 className="max-w-2xl text-4xl font-black tracking-tight text-slate-900 md:text-6xl">
              Welcome back, <span className="text-primary">{user.name.split(" ")[0]}</span>.
            </h1>
            <p className="mt-4 max-w-2xl text-lg font-medium leading-8 text-slate-600 md:text-xl">
              Your progress, streak momentum, and quiz performance are now organized like a modern analytics SaaS.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm font-semibold text-slate-600">
              <span className="rounded-full bg-white/80 px-4 py-2 shadow-[0_20px_25px_-5px_rgb(0_0_0_/_0.05)]">
                {analytics.totalQuizzesPlayed} quizzes tracked
              </span>
              <span className="rounded-full bg-white/80 px-4 py-2 shadow-[0_20px_25px_-5px_rgb(0_0_0_/_0.05)]">
                {analytics.accuracyPercentage}% accuracy rate
              </span>
            </div>
          </div>
        </div>

        <motion.div
          whileHover={{ y: -8, scale: 1.01 }}
          className="relative overflow-hidden rounded-[2.75rem] border border-primary/25 bg-gradient-to-br from-primary via-[#4f8bff] to-success p-[1px] shadow-[0_20px_25px_-5px_rgb(0_0_0_/_0.05)]"
        >
          <div className="absolute inset-0 rounded-[2.75rem] bg-primary/25 blur-3xl" />
          <div className="relative flex h-full flex-col rounded-[calc(2.75rem-1px)] bg-[linear-gradient(155deg,rgba(20,56,120,0.92),rgba(37,99,255,0.94),rgba(102,217,184,0.88))] p-6 text-white">
            <div className="mb-8 flex items-start justify-between gap-4">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/18 backdrop-blur-md">
                <Zap className="h-7 w-7" />
              </div>
              <span className="rounded-full border border-white/25 bg-white/12 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-white/90">
                Action card
              </span>
            </div>
            <div className="space-y-3">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-white/75">Buddy Bot</p>
              <h2 className="text-3xl font-black leading-tight">
                Daily quest ready for launch.
              </h2>
              <p className="max-w-sm text-sm font-medium leading-7 text-white/82">
                Finish one quiz to earn 5 magic beans. This card is also a strong place for a floating mascot or tiny Lottie guide animation later.
              </p>
            </div>
            <div className="mt-8 flex items-center justify-between gap-4">
              <span className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white/90">
                Quest bonus active
              </span>
              <button className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-black text-primary transition-transform hover:translate-x-1">
                Start now
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.header>

      <motion.div variants={item}>
        <MemoizedDashboardMetrics user={user} analytics={analytics} />
      </motion.div>

      <motion.div variants={item}>
        {shouldLoadCharts ? (
          <Suspense
            fallback={
              <div className="glass-card flex min-h-56 items-center justify-center rounded-4xl p-6 font-bold text-slate-400 shadow-[0_20px_25px_-5px_rgb(0_0_0_/_0.05)]">
                Loading charts...
              </div>
            }
          >
            <DashboardCharts
              analytics={analytics}
              loadingAnalytics={loadingAnalytics}
            />
          </Suspense>
        ) : (
          <div className="glass-card flex min-h-56 items-center justify-center rounded-4xl p-6 font-bold text-slate-400 shadow-[0_20px_25px_-5px_rgb(0_0_0_/_0.05)]">
            Preparing dashboard visualizations...
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
