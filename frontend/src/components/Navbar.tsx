import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, UserRound } from "lucide-react";
import { useAuth } from "../context/AuthContext";

type NavbarVariant = "landing" | "dashboard";

interface NavbarProps {
  variant: NavbarVariant;
}

const PAGE_TITLES: Record<string, { title: string; eyebrow: string }> = {
  "/dashboard": { title: "Dashboard", eyebrow: "Overview" },
  "/dashboard/quiz": { title: "Mission Quiz", eyebrow: "Playground" },
  "/dashboard/leaderboard": { title: "Leaderboard", eyebrow: "Rankings" },
  "/dashboard/settings": { title: "Settings", eyebrow: "Preferences" },
};

function resolvePageMeta(pathname: string) {
  const directMatch = PAGE_TITLES[pathname];
  if (directMatch) return directMatch;

  const matchedKey = Object.keys(PAGE_TITLES)
    .filter((key) => pathname.startsWith(`${key}/`))
    .sort((a, b) => b.length - a.length)[0];

  return matchedKey ? PAGE_TITLES[matchedKey] : { title: "FunBuddy", eyebrow: "Workspace" };
}

export function Navbar({ variant }: NavbarProps) {
  const { user } = useAuth();
  const location = useLocation();
  const pageMeta = resolvePageMeta(location.pathname);

  return (
    <motion.header
      initial={{ opacity: 0, y: -14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="sticky top-0 z-40 w-full px-4 pt-4 sm:px-6 lg:px-8"
    >
      <div
        className={
          variant === "landing"
            ? "mx-auto flex max-w-7xl items-center justify-between rounded-[2rem] border border-white/70 bg-white/72 px-4 py-3 shadow-[0_20px_25px_-5px_rgb(0_0_0_/_0.05)] backdrop-blur-xl sm:px-6"
            : "mx-auto flex max-w-7xl items-center justify-between rounded-[2rem] border border-white/70 bg-white/68 px-4 py-3 shadow-[0_20px_25px_-5px_rgb(0_0_0_/_0.05)] backdrop-blur-xl sm:px-6"
        }
      >
        {variant === "landing" ? (
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary shadow-md shadow-primary/20">
              <img src="/Logo.webp" alt="FunBuddy" className="h-6 w-6 object-contain" />
            </div>
            <div>
              <p className="text-lg font-black tracking-tight text-slate-900">FunBuddy</p>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary/70">
                Gamified Learning
              </p>
            </div>
          </Link>
        ) : (
          <div className="min-w-0">
            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-slate-500">
              {pageMeta.eyebrow}
            </p>
            <div className="mt-1 flex items-center gap-2">
              <h1 className="truncate text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                {pageMeta.title}
              </h1>
              <ChevronRight className="hidden h-4 w-4 text-slate-300 sm:block" />
            </div>
          </div>
        )}

        {variant === "landing" ? (
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/login"
              className="rounded-xl px-4 py-2 text-sm font-black text-slate-600 transition hover:bg-slate-100"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="rounded-xl bg-primary px-4 py-2 text-sm font-black text-white shadow-md shadow-primary/30 transition hover:bg-blue-600"
            >
              Register
            </Link>
          </div>
        ) : (
          <div className="rounded-full border border-white/70 bg-white/76 px-2 py-2 shadow-[0_20px_25px_-5px_rgb(0_0_0_/_0.05)]">
            <div className="flex items-center gap-3 rounded-full bg-[linear-gradient(135deg,rgba(37,99,255,0.09),rgba(102,217,184,0.14))] px-3 py-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-primary shadow-sm">
                <UserRound className="h-4 w-4" />
              </div>
              <div className="hidden text-left sm:block">
                <p className="max-w-[180px] truncate text-sm font-black text-slate-800">
                  {user?.name || "Student"}
                </p>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                  Level {user?.level || 1}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.header>
  );
}
