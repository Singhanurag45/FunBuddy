import { memo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Gamepad2, Home, LogOut, Settings, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { cn } from "../lib/utils";

const navItems = [
  { path: "/dashboard", icon: Home, label: "Dashboard", theme: "primary" },
  { path: "/dashboard/quiz", icon: Gamepad2, label: "Play Quiz", theme: "success" },
  {
    path: "/dashboard/leaderboard",
    icon: Trophy,
    label: "Leaderboard",
    theme: "secondary",
  },
  { path: "/dashboard/settings", icon: Settings, label: "Settings", theme: "accent" },
];

const isNavItemActive = (pathname: string, itemPath: string) => {
  if (itemPath === "/dashboard") {
    return pathname === "/dashboard" || pathname === "/dashboard/";
  }
  return pathname === itemPath || pathname.startsWith(`${itemPath}/`);
};

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const getThemeClasses = (theme: string, active: boolean) => {
    const base =
      "relative flex items-center gap-4 overflow-hidden rounded-[2rem] px-4 py-3 font-black tracking-tight transition-all group";
    const themes: Record<string, string> = {
      primary: active
        ? "bg-primary/10 text-primary"
        : "text-slate-400 hover:bg-primary/5 hover:text-primary",
      success: active
        ? "bg-success/12 text-success-foreground"
        : "text-slate-400 hover:bg-success/8 hover:text-success-foreground",
      secondary: active
        ? "bg-secondary/22 text-primary"
        : "text-slate-400 hover:bg-secondary/18 hover:text-primary",
      accent: active
        ? "bg-accent/10 text-accent-foreground"
        : "text-slate-400 hover:bg-accent/8 hover:text-accent-foreground",
    };
    return cn(base, themes[theme]);
  };

  return (
    <aside className="sticky top-0 z-20 hidden h-screen w-72 shrink-0 flex-col border-r border-white/60 bg-white/68 p-8 backdrop-blur-xl lg:flex">
      <div className="mb-14 flex cursor-pointer items-center gap-4 group">
        <div className="relative">
          <div className="absolute inset-0 scale-125 rounded-full bg-primary/20 blur-xl transition-transform duration-500 group-hover:scale-150" />
          <div className="relative flex h-12 w-12 items-center justify-center rounded-[1.25rem] bg-gradient-to-br from-primary to-[#4f8bff] shadow-lg shadow-primary/30 transition-transform duration-300 group-hover:rotate-6">
            <img
              src="/Logo.webp"
              alt="FunBuddy Logo"
              className="h-7 w-7 object-contain drop-shadow-md"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-black leading-none tracking-tighter text-slate-900">
            FunBuddy
          </h1>
          <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">
            Learning App
          </span>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = isNavItemActive(location.pathname, item.path);
          return (
            <Link key={item.path} to={item.path} className="block">
              <motion.div
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                className={getThemeClasses(item.theme, isActive)}
              >
                {isActive && (
                  <motion.div
                    layoutId="activePill"
                    className={cn(
                      "absolute left-0 h-6 w-1.5 rounded-r-full",
                      item.theme === "primary" && "bg-primary",
                      item.theme === "success" && "bg-success",
                      item.theme === "secondary" && "bg-primary/70",
                      item.theme === "accent" && "bg-accent",
                    )}
                  />
                )}

                <item.icon
                  className={cn(
                    "h-6 w-6 transition-transform duration-300",
                    isActive
                      ? "scale-110"
                      : "group-hover:scale-110 group-hover:rotate-3",
                  )}
                />
                <span className="text-sm">{item.label}</span>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      <div className="mt-6 rounded-[2rem] bg-slate-900 p-4 shadow-xl shadow-slate-200">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || "Alex"}`}
              alt="Avatar"
              className="h-11 w-11 rounded-2xl border-2 border-slate-700 bg-slate-800 shadow-sm"
            />
            <div className="absolute -right-1 -top-1 h-4 w-4 rounded-full border-4 border-slate-900 bg-success" />
          </div>
          <div className="overflow-hidden">
            <p className="truncate text-sm font-black text-white">
              {user?.name || "Guest User"}
            </p>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
              <p className="text-[10px] font-black uppercase tracking-tighter text-slate-400">
                Lvl {user?.level || 1} Scholar
              </p>
            </div>
          </div>
        </div>
      </div>

      <motion.button
        whileHover={{ x: 4 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleLogout}
        className="mt-auto flex w-full items-center gap-4 overflow-hidden rounded-[2rem] px-4 py-3 font-black tracking-tight text-slate-400 transition-all hover:bg-rose-50 hover:text-rose-500"
      >
        <LogOut className="h-6 w-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3" />
        <span className="text-sm">Logout</span>
      </motion.button>
    </aside>
  );
}

export function MobileBottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed inset-x-0 bottom-4 z-[90] px-4 lg:hidden">
      <div className="mx-auto max-w-md rounded-[2rem] border border-white/70 bg-white/70 p-2 shadow-[0_20px_25px_-5px_rgb(0_0_0_/_0.05)] backdrop-blur-2xl">
        <div className="grid grid-cols-4 gap-1">
          {navItems.map((item) => {
            const isActive = isNavItemActive(location.pathname, item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "relative flex flex-col items-center justify-center gap-1 rounded-[1.4rem] py-3 text-[11px] font-black transition-all",
                  isActive ? "text-primary" : "text-slate-500",
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="mobileActiveBubble"
                    className="absolute inset-0 rounded-[1.4rem] bg-[linear-gradient(135deg,rgba(37,99,255,0.16),rgba(102,217,184,0.18))]"
                  />
                )}
                <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/80 shadow-sm">
                  <item.icon className={cn("h-5 w-5 transition-transform", isActive && "scale-110")} />
                </div>
                <span className="relative leading-none">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

export const MemoizedSidebar = memo(Sidebar);
export const MemoizedMobileBottomNav = memo(MobileBottomNav);
