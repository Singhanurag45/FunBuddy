import { memo, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Crown, TrendingUp } from "lucide-react";
import { api } from "../services/api";
import type { UserProfile } from "../services/api";
import { useAuth } from "../context/AuthContext";

export function LeaderboardPage() {
  const { user: currentUser } = useAuth();
  const [leaderboard, setLeaderboard] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getLeaderboard()
      .then(setLeaderboard)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const topThree = useMemo(() => leaderboard.slice(0, 3), [leaderboard]);
  const theRest = useMemo(() => leaderboard.slice(3), [leaderboard]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] gap-4">
        <div className="w-16 h-16 border-4 border-secondary/20 border-t-secondary rounded-full animate-spin"></div>
        <p className="text-slate-400 font-black animate-pulse uppercase tracking-widest text-sm">
          Loading Legends...
        </p>
      </div>
    );
  }

  return (
    <div className="py-8 max-w-4xl mx-auto px-4">
      <header className="mb-12 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="inline-block p-4 bg-yellow-400 rounded-[2.5rem] shadow-xl shadow-yellow-200 mb-6 rotate-3"
        >
          <Trophy className="w-12 h-12 text-white" />
        </motion.div>
        <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-4 tracking-tighter leading-none">
          Top <span className="text-secondary">Scholars</span>
        </h1>
        <div className="flex items-center justify-center gap-2 text-slate-500 font-bold">
          <TrendingUp className="w-5 h-5 text-success" />
          <span>Updated 5 minutes ago</span>
        </div>
      </header>

      {/* Podium Section */}
      <div className="flex flex-row items-end justify-center gap-2 md:gap-4 mb-12 h-64">
        {/* 2nd Place */}
        {topThree[1] && (
          <MemoizedPodiumStep
            user={topThree[1]}
            rank={2}
            height="h-40"
            delay={0.2}
            color="bg-slate-300"
          />
        )}
        {/* 1st Place */}
        {topThree[0] && (
          <MemoizedPodiumStep
            user={topThree[0]}
            rank={1}
            height="h-56"
            delay={0}
            color="bg-yellow-400"
            isWinner
          />
        )}
        {/* 3rd Place */}
        {topThree[2] && (
          <MemoizedPodiumStep
            user={topThree[2]}
            rank={3}
            height="h-32"
            delay={0.4}
            color="bg-amber-600"
          />
        )}
      </div>

      {/* List Section */}
      <div className="bg-white rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden">
        <div className="p-2 space-y-2">
          <AnimatePresence>
            {theRest.length > 0
              ? theRest.map((user, idx) => (
                  <MemoizedLeaderboardRow
                    key={user.id}
                    user={user}
                    rank={idx + 4}
                    isCurrentUser={currentUser?.id === user.id}
                  />
                ))
              : leaderboard.length <= 3 && (
                  <div className="py-12 text-center text-slate-400 font-bold italic">
                    Keep climbing to see the rest of the pack!
                  </div>
                )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

interface PodiumStepProps {
  user: UserProfile;
  rank: number;
  height: string;
  delay: number;
  color: string;
  isWinner?: boolean;
}

function PodiumStep({ user, rank, height, delay, color, isWinner }: PodiumStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: "spring" }}
      className={`flex flex-col items-center w-1/3 max-w-[140px]`}
    >
      <div className="relative mb-4">
        {isWinner && (
          <Crown className="w-8 h-8 text-yellow-500 absolute -top-6 left-1/2 -translate-x-1/2 rotate-12" />
        )}
        <img
          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
          className={`w-16 h-16 md:w-20 md:h-20 rounded-full border-4 ${isWinner ? "border-yellow-400" : "border-slate-200"} bg-white shadow-lg`}
          alt={user.name}
        />
        <div
          className={`absolute -bottom-2 -right-2 w-8 h-8 ${color} rounded-full flex items-center justify-center text-white font-black text-sm border-4 border-white`}
        >
          {rank}
        </div>
      </div>
      <div
        className={`w-full ${height} ${color} rounded-t-[2rem] flex flex-col items-center justify-start pt-4 px-2 shadow-inner`}
      >
        <span className="text-white font-black text-xs md:text-sm truncate w-full text-center">
          {user.name.split(" ")[0]}
        </span>
        <span className="text-white/80 font-black text-xs">
          {user.points} pts
        </span>
      </div>
    </motion.div>
  );
}

interface LeaderboardRowProps {
  user: UserProfile;
  rank: number;
  isCurrentUser: boolean;
}

function LeaderboardRow({ user, rank, isCurrentUser }: LeaderboardRowProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center gap-4 p-4 rounded-[2rem] transition-all hover:scale-[1.01] ${
        isCurrentUser
          ? "bg-primary/10 border-2 border-primary/20"
          : "hover:bg-slate-50"
      }`}
    >
      <span className="w-10 text-center font-black text-slate-400 text-lg">
        #{rank}
      </span>
      <img
        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
        className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200"
        alt={user.name}
      />
      <div className="flex-1">
        <h3
          className={`font-black tracking-tight ${isCurrentUser ? "text-primary" : "text-slate-700"}`}
        >
          {user.name} {isCurrentUser && "✨"}
        </h3>
      </div>
      <div className="text-right flex flex-col">
        <span className="text-xl font-black text-slate-900 leading-none">
          {user.points}
        </span>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
          points
        </span>
      </div>
    </motion.div>
  );
}

const MemoizedPodiumStep = memo(PodiumStep);
const MemoizedLeaderboardRow = memo(LeaderboardRow);
