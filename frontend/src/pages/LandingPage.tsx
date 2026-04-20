import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Atom,
  BookOpenText,
  BrainCircuit,
  ChartSpline,
  ChevronRight,
  Cuboid,
  HeartHandshake,
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

const testimonials = [
  {
    quote:
      "My daughter now asks to do one more quiz before dinner. The missions and progress tracking make practice feel like a game.",
    name: "Priya Sharma",
    role: "Parent of Class 3 learner",
    accent: "from-primary/18 to-success/18",
  },
  {
    quote:
      "FunBuddy gives me the kind of live insight dashboard I wish every classroom tool had. Students stay engaged and I can spot weak areas fast.",
    name: "Rohan Mehta",
    role: "Elementary teacher",
    accent: "from-success/18 to-secondary/30",
  },
  {
    quote:
      "The AI hints feel friendly instead of robotic, and the quiz flow keeps the experience playful while still showing strong frontend polish.",
    name: "Anika Verma",
    role: "Recruiter reviewing portfolio projects",
    accent: "from-accent/16 to-primary/16",
  },
];

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

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <motion.div
                whileHover={{ rotate: [0, -2, 2, 0] }}
                className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm"
              >
                <Cuboid className="h-7 w-7 text-primary" />
                <h3 className="mt-3 text-lg font-black text-slate-900">Math Missions</h3>
                <p className="mt-1 text-sm font-semibold text-slate-600">Colorful blocks and counting games.</p>
              </motion.div>
              <motion.div
                whileHover={{ rotate: [0, -2, 2, 0] }}
                className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm"
              >
                <Atom className="h-7 w-7 text-success" />
                <h3 className="mt-3 text-lg font-black text-slate-900">Science Sparks</h3>
                <p className="mt-1 text-sm font-semibold text-slate-600">Planets, labs, and little experiments.</p>
              </motion.div>
              <motion.div
                whileHover={{ rotate: [0, -2, 2, 0] }}
                className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm"
              >
                <BookOpenText className="h-7 w-7 text-accent" />
                <h3 className="mt-3 text-lg font-black text-slate-900">English Magic</h3>
                <p className="mt-1 text-sm font-semibold text-slate-600">Stories, words, and reading fun.</p>
              </motion.div>
            </div>
          </motion.div>
        </section>

        <section className="px-4 py-8 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.45 }}
            className="mx-auto max-w-6xl"
          >
            <div className="mb-8 text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/75 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-primary shadow-[0_20px_25px_-5px_rgb(0_0_0_/_0.05)]">
                <HeartHandshake className="h-4 w-4" />
                Testimonials
              </div>
              <h2 className="mt-5 text-3xl font-black text-slate-900 sm:text-4xl">
                Families, teachers, and recruiters all get something real from it
              </h2>
              <p className="mx-auto mt-4 max-w-3xl text-base font-semibold text-slate-600">
                Built to delight young learners while still showing thoughtful product design, system thinking, and polished execution.
              </p>
            </div>

            <div className="bento-grid">
              {testimonials.map((testimonial, index) => (
                <motion.article
                  key={testimonial.name}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className="glass-card relative overflow-hidden rounded-[2.5rem] p-6"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${testimonial.accent}`} />
                  <div className="relative">
                    <div className="mb-6 inline-flex rounded-2xl bg-white/80 p-3 text-primary shadow-sm">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <p className="text-base font-semibold leading-8 text-slate-700">
                      "{testimonial.quote}"
                    </p>
                    <div className="mt-8 border-t border-white/70 pt-5">
                      <p className="text-lg font-black text-slate-900">{testimonial.name}</p>
                      <p className="mt-1 text-sm font-semibold text-slate-500">{testimonial.role}</p>
                    </div>
                  </div>
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

      <footer className="px-4 pb-10 sm:px-6 lg:px-8">
        <div className="glass-card mx-auto flex max-w-6xl flex-col gap-8 rounded-[2.75rem] px-6 py-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-[1.2rem] bg-gradient-to-br from-primary to-[#4f8bff] shadow-lg shadow-primary/20">
                <img src="/Logo.webp" alt="FunBuddy" className="h-6 w-6 object-contain" />
              </div>
              <div>
                <p className="text-xl font-black tracking-tight text-slate-900">FunBuddy</p>
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-primary/70">
                  Playful SaaS Learning
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm font-semibold leading-7 text-slate-600">
              Gamified quizzes, AI-guided hints, and premium analytics for students who learn best when curiosity stays in motion.
            </p>
          </div>

          <div className="flex flex-col gap-3 text-sm font-semibold text-slate-600 md:items-end">
            <Link to="/register" className="inline-flex items-center gap-2 font-black text-primary transition hover:translate-x-1">
              Create your account
              <ChevronRight className="h-4 w-4" />
            </Link>
            <Link to="/login" className="transition hover:text-slate-900">
              Sign in to continue your mission
            </Link>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
              © 2026 FunBuddy. Built for joyful progress.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
