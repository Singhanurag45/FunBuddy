import { lazy, Suspense, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { MemoizedDashboardMetrics } from "../components/DashboardMetrics";
import { motion } from "framer-motion";
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
  const [analytics, setAnalytics] =
    useState<DashboardAnalytics>(emptyAnalytics);
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
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="max-w-6xl mx-auto py-6 px-4"
    >
      <motion.header variants={item} className="mb-10">
        <h1 className="text-5xl font-black text-slate-900 mb-2 tracking-tight">
          Welcome back,{" "}
          <span className="text-primary">{user.name.split(" ")[0]}</span>!
        </h1>
        <p className="text-xl text-slate-500 font-medium">
          Your live learning analytics for quizzes and progress.
        </p>
      </motion.header>

      <motion.div variants={item}>
        <MemoizedDashboardMetrics user={user} analytics={analytics} />
      </motion.div>

      <motion.div variants={item}>
        {shouldLoadCharts ? (
          <Suspense
            fallback={
              <div className="bg-white p-6 rounded-4xl shadow-sm border border-slate-100 text-slate-400 font-bold min-h-56 flex items-center justify-center">
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
          <div className="bg-white p-6 rounded-4xl shadow-sm border border-slate-100 text-slate-400 font-bold min-h-56 flex items-center justify-center">
            Preparing dashboard visualizations...
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
