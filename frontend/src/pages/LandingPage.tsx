import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BrainCircuit,
  ChartSpline,
  Sparkles,
  Swords,
  Trophy,
  Zap,
} from "lucide-react";
import { Navbar } from "../components/Navbar";

const featureCards = [
  {
    title: "Interactive Quizzes",
    description: "Engaging questions across subjects that keep every round fast, focused, and fun.",
    icon: Sparkles,
  },
  {
    title: "AI-Powered Insights",
    description: "Gemini API integration delivers smart hints and post-quiz analysis to accelerate learning.",
    icon: BrainCircuit,
  },
  {
    title: "Real-time Analytics",
    description: "Track wins, weak spots, and growth trends with live progress visualized through Recharts.",
    icon: ChartSpline,
  },
  {
    title: "Leaderboards",
    description: "XP and level-based competition that motivates learners to climb ranks with every quiz.",
    icon: Trophy,
  },
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-slate-800">
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

        <section id="features" className="px-4 py-16 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.45 }}
            className="mx-auto max-w-6xl"
          >
            <h2 className="text-center text-3xl font-black text-slate-900 sm:text-4xl">Platform Features</h2>
            <p className="mx-auto mt-4 max-w-3xl text-center text-base font-semibold text-slate-600">
              Built for momentum, designed for mastery.
            </p>
            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {featureCards.map((feature, index) => (
                <motion.article
                  key={feature.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm"
                >
                  <div className="mb-4 inline-flex rounded-2xl bg-primary/10 p-3 text-primary">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900">{feature.title}</h3>
                  <p className="mt-2 text-sm font-semibold leading-relaxed text-slate-600">
                    {feature.description}
                  </p>
                </motion.article>
              ))}
            </div>
          </motion.div>
        </section>

        <section className="px-4 pb-20 pt-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.45 }}
            className="mx-auto flex max-w-6xl flex-col items-center gap-6 rounded-4xl bg-linear-to-r from-primary to-blue-600 px-8 py-12 text-center text-white shadow-xl shadow-primary/20"
          >
            <div className="inline-flex rounded-2xl bg-white/15 p-3">
              <Swords className="h-7 w-7" />
            </div>
            <h2 className="max-w-3xl text-3xl font-black sm:text-4xl">
              Where Play Meets Education For Stronger Retention
            </h2>
            <p className="max-w-3xl text-base font-semibold text-blue-50 sm:text-lg">
              FunBuddy blends the excitement of play with educational depth, helping learners remember concepts
              longer through active challenge, feedback, and repetition.
            </p>
            <Link
              to="/register"
              className="rounded-2xl bg-white px-6 py-3 text-sm font-black text-primary transition hover:bg-blue-50"
            >
              Join FunBuddy Today
            </Link>
          </motion.div>
        </section>
      </main>
    </div>
  );
}
