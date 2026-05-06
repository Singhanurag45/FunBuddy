import { Link } from "react-router-dom";
import { ArrowUpRight, Mail, Sparkles } from "lucide-react";

const footerLinks = [
  { label: "Dashboard", to: "/dashboard" },
  { label: "Quiz", to: "/dashboard/quiz" },
  { label: "Leaderboard", to: "/dashboard/leaderboard" },
  { label: "Settings", to: "/dashboard/settings" },
];

export function Footer() {
  return (
    <footer className="px-4 pb-6 pt-10 sm:px-6 lg:px-8">
      <div className="glass-card mx-auto max-w-7xl rounded-[2.5rem] px-6 py-6 sm:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-[1.2rem] bg-gradient-to-br from-primary to-[#4f8bff] shadow-lg shadow-primary/20">
                <img src="/Logo.webp" alt="FunBuddy" className="h-6 w-6 object-contain" />
              </div>
              <div>
                <p className="text-xl font-black tracking-tight text-slate-900">FunBuddy</p>
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-primary/70">
                  Gamified Learning Platform
                </p>
              </div>
            </div>
            <p className="mt-4 max-w-lg text-sm font-semibold leading-7 text-slate-600">
              Keep the learning streak going with quizzes, progress tracking, and a dashboard built to make every session feel like a win.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                Quick Links
              </p>
              <div className="mt-4 flex flex-col gap-3 text-sm font-semibold text-slate-600">
                {footerLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="inline-flex items-center gap-2 transition hover:translate-x-1 hover:text-primary"
                  >
                    <ArrowUpRight className="h-4 w-4" />
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                Stay Connected
              </p>
              <div className="mt-4 space-y-3 text-sm font-semibold text-slate-600">
                <div className="inline-flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  support@funbuddy.app
                </div>
                <div className="inline-flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-success" />
                  Built for joyful, measurable progress
                </div>
                <p className="pt-1 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                  © {new Date().getFullYear()} FunBuddy. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}