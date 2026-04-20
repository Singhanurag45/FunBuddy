import { Suspense, lazy } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Zap from "lucide-react/dist/esm/icons/zap.js";
import { Navbar } from "../components/Navbar";

const LandingBelowFold = lazy(() =>
  import("../components/LandingBelowFold").then((module) => ({
    default: module.LandingBelowFold,
  })),
);

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-slate-800 bg-[radial-gradient(circle_at_20%_20%,rgba(17,138,178,0.12),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(255,209,102,0.18),transparent_40%)]">
      <Navbar variant="landing" />

      <main>
        <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
          <div className="absolute left-0 top-8 h-56 w-56 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute bottom-4 right-0 h-56 w-56 rounded-full bg-secondary/20 blur-3xl" />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="relative mx-auto max-w-6xl text-center"
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-primary">
              <Zap className="h-4 w-4" />
              Learn Faster With FunBuddy
            </div>
            <h1 className="mx-auto max-w-4xl text-4xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Gamified Learning That Turns Every Lesson Into A Winning Mission
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg font-semibold text-slate-600 sm:text-xl">
              FunBuddy brings high-energy quizzes, AI coaching, and live progress insights together so students
              stay curious, confident, and consistent.
            </p>
            <motion.div
              whileHover={{ rotate: [0, -2, 2, 0] }}
              transition={{ duration: 0.5 }}
              className="mx-auto mt-6 max-w-2xl rounded-3xl border border-primary/20 bg-white/90 px-5 py-4 text-left shadow-sm"
            >
              <p className="text-sm font-black uppercase tracking-wider text-primary">Buddy Bot says</p>
              <p className="mt-1 text-base font-semibold text-slate-700">
                "Hi explorer! Pick a subject, complete your quest, and collect stars every day."
              </p>
            </motion.div>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/register"
                className="rounded-2xl bg-primary px-7 py-3 text-base font-black text-white shadow-lg shadow-primary/30 transition hover:bg-blue-600"
              >
                Start Learning
              </Link>
              <Link
                to="/login"
                className="rounded-2xl border border-slate-200 bg-white px-7 py-3 text-base font-black text-slate-700 transition hover:bg-slate-50"
              >
                I Already Have An Account
              </Link>
            </div>
          </motion.div>
        </section>

        <Suspense fallback={<div className="h-24" />}>
          <LandingBelowFold />
        </Suspense>
      </main>
    </div>
  );
}
