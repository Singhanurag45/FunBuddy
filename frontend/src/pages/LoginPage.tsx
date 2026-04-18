import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { KeyRound, Mail, ArrowRight, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const authData = await api.login({ email, password });
      await login(authData, authData.token);
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[30rem] h-[30rem] bg-primary/10 rounded-full blur-3xl mix-blend-multiply"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[30rem] h-[30rem] bg-secondary/20 rounded-full blur-3xl mix-blend-multiply"></div>

      <div className="mb-8 text-center z-10">
        <div className="w-20 h-20 mx-auto rounded-[1.5rem] bg-primary flex items-center justify-center transform -rotate-6 shadow-xl shadow-primary/20 mb-6">
          <span className="text-white font-black text-4xl">L</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight mb-3">
          Welcome Back! 🚀
        </h1>
        <p className="text-xl font-bold text-slate-500 max-w-sm mx-auto">
          Log in to enter the playground and keep your streak alive.
        </p>
      </div>

      <motion.form
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        onSubmit={handleLogin}
        className="bg-white p-8 md:p-10 rounded-[3rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-b-8 border-slate-100 max-w-md w-full z-10 relative"
      >
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 font-bold">
            <AlertCircle className="w-6 h-6 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-black text-slate-400 uppercase tracking-widest ml-2">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400">
                <Mail className="h-6 w-6" />
              </div>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-14 pr-4 py-4 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 outline-none transition-all text-lg font-bold text-slate-800 shadow-sm"
                placeholder="alex@example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-black text-slate-400 uppercase tracking-widest ml-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400">
                <KeyRound className="h-6 w-6" />
              </div>
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-14 pr-4 py-4 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 outline-none transition-all text-lg font-bold text-slate-800 shadow-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            type="submit"
            className="w-full py-5 bg-primary text-white rounded-[2rem] text-2xl font-black shadow-lg shadow-primary/30 mt-8 flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
          >
            {loading ? (
              <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                Let's Go!
                <ArrowRight className="w-7 h-7 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </motion.button>
        </div>
      </motion.form>

      <div className="mt-10 z-10 text-center font-bold text-slate-500 text-lg">
        New explorer?{" "}
        <Link
          to="/register"
          className="text-primary font-black hover:text-blue-700 transition-colors"
        >
          Join the fun
        </Link>
      </div>
    </div>
  );
}
