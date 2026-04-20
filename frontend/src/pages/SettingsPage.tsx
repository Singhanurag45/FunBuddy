import React, { memo } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  User,
  Bell,
  ShieldCheck,
  Volume2,
  Smartphone,
  Palette,
  ChevronRight,
  Lock,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { cn } from "../lib/utils";

export function SettingsPage() {
  const { user } = useAuth();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
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
      className="max-w-4xl mx-auto py-8 px-4"
    >
      <header className="mb-12">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-slate-900 rounded-2xl shadow-lg shadow-slate-200">
            <Settings className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
              Settings
            </h1>
            <p className="text-slate-500 font-bold">
              Manage your FunBuddy experience
            </p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <motion.div
          variants={item}
          className="md:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center justify-between group cursor-pointer hover:border-primary/30 transition-colors"
        >
          <div className="flex items-center gap-6">
            <div className="relative">
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`}
                className="w-20 h-20 rounded-[1.5rem] bg-slate-50 border-2 border-slate-100"
                alt="Profile"
              />
              <div className="absolute -bottom-2 -right-2 bg-primary p-2 rounded-xl text-white shadow-lg">
                <User className="w-4 h-4" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900">
                {user?.name || "Scholar"}
              </h2>
              <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">
                Grade 4 • {user?.classLevel || "Intermediate"}
              </p>
            </div>
          </div>
          <ChevronRight className="text-slate-300 group-hover:text-primary transition-colors" />
        </motion.div>

        {/* Level Badge Card */}
        <motion.div
          variants={item}
          className="bg-gradient-to-br from-primary to-indigo-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-primary/20 flex flex-col justify-between"
        >
          <p className="font-black uppercase tracking-tighter opacity-80 text-sm">
            Current Progress
          </p>
          <div>
            <span className="text-5xl font-black">Lvl {user?.level || 1}</span>
            <div className="w-full h-2 bg-white/20 rounded-full mt-4">
              <div className="w-2/3 h-full bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
            </div>
          </div>
        </motion.div>

        {/* Quick Toggles */}
        <motion.div variants={item} className="md:col-span-1 space-y-4">
          <MemoizedToggleCard icon={<Volume2 />} label="Sound Effects" defaultChecked />
          <MemoizedToggleCard icon={<Bell />} label="Daily Reminders" defaultChecked />
          <MemoizedToggleCard icon={<Palette />} label="Dark Theme" />
        </motion.div>

        {/* Parental Controls Section */}
        <motion.div
          variants={item}
          className="md:col-span-2 bg-slate-50 border-2 border-dashed border-slate-200 p-8 rounded-[2.5rem] relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform">
            <ShieldCheck className="w-32 h-32 text-slate-900" />
          </div>

          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-slate-900 rounded-lg">
                <Lock className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-xl font-black text-slate-800">
                Parental Controls
              </h3>
            </div>
            <p className="text-slate-500 font-bold mb-6 max-w-sm">
              Set daily time limits, manage subjects, and view detailed learning
              reports.
            </p>
            <button className="bg-white text-slate-900 border-2 border-slate-200 px-6 py-3 rounded-2xl font-black text-sm hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm">
              Access Dashboard
            </button>
          </div>
        </motion.div>

        {/* App Info */}
        <motion.div
          variants={item}
          className="bg-white border border-slate-100 p-8 rounded-[2.5rem] flex flex-col items-center justify-center text-center"
        >
          <Smartphone className="w-8 h-8 text-slate-300 mb-2" />
          <p className="text-slate-400 text-xs font-black uppercase tracking-widest">
            FunBuddy v2.0.4
          </p>
          <p className="text-slate-300 text-[10px] mt-1 font-bold">
            Made with ❤️ for Learning
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

function ToggleCard({
  icon,
  label,
  defaultChecked = false,
}: {
  icon: React.ReactNode;
  label: string;
  defaultChecked?: boolean;
}) {
  const [enabled, setEnabled] = React.useState(defaultChecked);

  return (
    <div
      onClick={() => setEnabled(!enabled)}
      className="bg-white p-5 rounded-3xl border border-slate-100 flex items-center justify-between cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "p-2 rounded-xl",
            enabled
              ? "bg-primary/10 text-primary"
              : "bg-slate-100 text-slate-400",
          )}
        >
          {icon}
        </div>
        <span className="font-black text-slate-700 text-sm tracking-tight">
          {label}
        </span>
      </div>
      <div
        className={cn(
          "w-10 h-6 rounded-full transition-colors relative flex items-center px-1",
          enabled ? "bg-success" : "bg-slate-200",
        )}
      >
        <motion.div
          animate={{ x: enabled ? 16 : 0 }}
          className="w-4 h-4 bg-white rounded-full shadow-sm"
        />
      </div>
    </div>
  );
}
const MemoizedToggleCard = memo(ToggleCard);
