import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { UserRound } from "lucide-react";
import { useAuth } from "../context/AuthContext";

type NavbarVariant = "landing" | "dashboard";

interface NavbarProps {
  variant: NavbarVariant;
}

export function Navbar({ variant }: NavbarProps) {
  const { user } = useAuth();

  return (
    <motion.header
      initial={{ opacity: 0, y: -14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="sticky top-0 z-40 w-full border-b border-slate-100/80 bg-white/90 backdrop-blur"
    >
      <div
        className={
          variant === "landing"
            ? "mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8"
            : "mx-auto flex max-w-7xl items-center justify-end px-4 py-3 sm:px-6 lg:px-8"
        }
      >
        {variant === "landing" && (
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
          <div className="flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2">
            <UserRound className="h-4 w-4 text-primary" />
            <span className="text-xs font-black text-slate-700">
              {user?.name || "Student"} • Lvl {user?.level || 1}
            </span>
          </div>
        )}
      </div>
    </motion.header>
  );
}
