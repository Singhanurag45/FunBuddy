import { memo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, Gamepad2, Trophy, Settings, LogOut } from "lucide-react";
import { cn } from "../lib/utils";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

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
      "relative flex items-center gap-4 px-4 py-3 rounded-2xl transition-all font-black tracking-tight overflow-hidden group";
    const themes: Record<string, string> = {
      primary: active
        ? "bg-primary/10 text-primary"
        : "text-slate-400 hover:text-primary hover:bg-primary/5",
      success: active
        ? "bg-success/10 text-success"
        : "text-slate-400 hover:text-success hover:bg-success/5",
      secondary: active
        ? "bg-secondary/20 text-yellow-700"
        : "text-slate-400 hover:text-yellow-700 hover:bg-secondary/10",
      accent: active
        ? "bg-accent/10 text-accent"
        : "text-slate-400 hover:text-accent hover:bg-accent/5",
    };
    return cn(base, themes[theme]);
  };

  return (
    <aside className="hidden lg:flex w-72 h-screen sticky top-0 bg-white border-r border-slate-100 flex-col p-8 z-20 shrink-0">
      {/* PERFECT LOGO SECTION */}
      <div className="flex items-center gap-4 mb-14 group cursor-pointer">
        <div className="relative">
          {/* Outer Glow/Shadow */}
          <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full scale-125 group-hover:scale-150 transition-transform duration-500" />

          {/* Logo Container */}
          <div className="relative w-12 h-12 bg-gradient-to-br from-primary to-indigo-600 rounded-[1.25rem] flex items-center justify-center shadow-lg shadow-primary/30 transform group-hover:rotate-6 transition-transform duration-300">
            <img
              src="/Logo.webp"
              alt="FunBuddy Logo"
              className="w-7 h-7 object-contain drop-shadow-md"
              onError={(e) => {
                // Fallback icon if image fails to load
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-black tracking-tighter text-slate-900 leading-none">
            FunBuddy
          </h1>
          <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">
            Learning App
          </span>
        </div>
      </div>

      {/* NAVIGATION */}
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
                {/* Active Indicator Pill */}
                {isActive && (
                  <motion.div
                    layoutId="activePill"
                    className={cn(
                      "absolute left-0 w-1.5 h-6 rounded-r-full",
                      item.theme === "primary" && "bg-primary",
                      item.theme === "success" && "bg-success",
                      item.theme === "secondary" && "bg-yellow-500",
                      item.theme === "accent" && "bg-accent",
                    )}
                  />
                )}

                <item.icon
                  className={cn(
                    "w-6 h-6 transition-transform duration-300",
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

      {/* USER FOOTER */}
      <div className="mt-auto space-y-4">
        <motion.button
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="relative w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all font-black tracking-tight overflow-hidden group text-slate-400 hover:text-rose-500 hover:bg-rose-50"
        >
          <LogOut className="w-6 h-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3" />
          <span className="text-sm">Logout</span>
        </motion.button>

        <div className="bg-slate-900 flex items-center gap-3 p-4 rounded-[2rem] shadow-xl shadow-slate-200">
          <div className="relative">
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || "Alex"}`}
              alt="Avatar"
              className="w-11 h-11 rounded-2xl bg-slate-800 border-2 border-slate-700 shadow-sm"
            />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-success border-4 border-slate-900 rounded-full" />
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-black text-white truncate">
              {user?.name || "Guest User"}
            </p>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">
                Lvl {user?.level || 1} Scholar
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export function MobileBottomNav() {
  const location = useLocation();

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur border-t border-slate-200 pb-[env(safe-area-inset-bottom)]">
      <div className="grid grid-cols-4">
        {navItems.map((item) => {
          const isActive = isNavItemActive(location.pathname, item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center gap-1 py-3 text-xs font-black transition-colors",
                isActive ? "text-primary" : "text-slate-500",
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive && "scale-105")} />
              <span className="leading-none">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export const MemoizedSidebar = memo(Sidebar);
export const MemoizedMobileBottomNav = memo(MobileBottomNav);
