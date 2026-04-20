import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, KeyRound, Mail, AlertCircle, GraduationCap } from "lucide-react";
import { api } from "../services/api";

export function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [classLevel, setClassLevel] = useState("Class 1");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.register({ name, email, password, classLevel });
      // If successful, navigate them to login
      navigate("/login");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[30rem] h-[30rem] bg-success/10 rounded-full blur-3xl mix-blend-multiply"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[30rem] h-[30rem] bg-accent/5 rounded-full blur-3xl mix-blend-multiply"></div>

      <div className="mb-6 text-center z-10">
        <div className="w-20 h-20 mx-auto rounded-[1.5rem] bg-secondary/80 flex items-center justify-center transform rotate-6 shadow-xl shadow-secondary/20 mb-6 text-yellow-800">
          <img
            src="/Logo.webp"
            alt="FunBuddy Logo"
            className="w-12 h-12 object-contain drop-shadow-md"
          />
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight mb-2">
          Join the Club! 🎉
        </h1>
        <p className="text-xl font-bold text-slate-500">
          Create an account to start earning points.
        </p>
      </div>

      <motion.form
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.1 }}
        onSubmit={handleRegister}
        className="bg-white p-8 md:p-10 rounded-[3rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-b-8 border-slate-100 max-w-md w-full z-10 relative"
      >
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 font-bold">
            <AlertCircle className="w-6 h-6 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-black text-slate-400 uppercase tracking-widest ml-2">
              Your Hero Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400">
                <User className="h-6 w-6" />
              </div>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-14 pr-4 py-4 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-success focus:bg-white focus:ring-4 focus:ring-success/10 outline-none transition-all text-lg font-bold text-slate-800 shadow-sm"
                placeholder="Alex Student"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-black text-slate-400 uppercase tracking-widest ml-2">
              Class Level
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400">
                <GraduationCap className="h-6 w-6" />
              </div>
              <select
                value={classLevel}
                onChange={(e) => setClassLevel(e.target.value)}
                className="w-full pl-14 pr-4 py-4 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-success focus:bg-white focus:ring-4 focus:ring-success/10 outline-none transition-all text-lg font-bold text-slate-800 shadow-sm appearance-none"
              >
                <option value="Class 1">Class 1</option>
                <option value="Class 2">Class 2</option>
                <option value="Class 3">Class 3</option>
                <option value="Class 4">Class 4</option>
                <option value="Class 5">Class 5</option>
              </select>
            </div>
          </div>

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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-14 pr-4 py-4 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-success focus:bg-white focus:ring-4 focus:ring-success/10 outline-none transition-all text-lg font-bold text-slate-800 shadow-sm"
                placeholder="alex@example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-black text-slate-400 uppercase tracking-widest ml-2">
              Secret Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400">
                <KeyRound className="h-6 w-6" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-14 pr-4 py-4 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-success focus:bg-white focus:ring-4 focus:ring-success/10 outline-none transition-all text-lg font-bold text-slate-800 shadow-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            type="submit"
            className="w-full py-5 bg-success text-white rounded-[2rem] text-2xl font-black shadow-lg shadow-success/30 mt-8 flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed hover:bg-emerald-500 transition-colors"
          >
            {loading ? (
              <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              "Sign Me Up!"
            )}
          </motion.button>
        </div>
      </motion.form>

      <div className="mt-8 z-10 text-center font-bold text-slate-500 text-lg">
        Already a member?{" "}
        <Link
          to="/login"
          className="text-success font-black hover:text-emerald-700 transition-colors"
        >
          Log in
        </Link>
      </div>
    </div>
  );
}
