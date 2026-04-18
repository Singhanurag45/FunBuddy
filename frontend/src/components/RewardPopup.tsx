import { motion, AnimatePresence } from 'framer-motion';
import { Star, X } from 'lucide-react';

interface RewardProps {
  show: boolean;
  points: number;
  onClose: () => void;
}

export function RewardPopup({ show, points, onClose }: RewardProps) {
  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: -50 }}
            transition={{ type: 'spring', bounce: 0.5 }}
            className="bg-white rounded-[3rem] p-8 md:p-12 max-w-md w-full text-center relative shadow-2xl border-b-8 border-secondary"
          >
            <button 
              onClick={() => onClose()}
              className="absolute top-6 right-6 w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <motion.div 
              initial={{ rotate: -180, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-32 h-32 mx-auto bg-secondary/20 rounded-full flex items-center justify-center mb-8 relative shadow-inner shadow-secondary/20"
            >
              <Star className="w-16 h-16 text-secondary fill-secondary absolute z-10" />
              {/* Confetti-like pulses */}
              <motion.div 
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute inset-0 bg-secondary rounded-full" 
              />
            </motion.div>

            <h2 className="text-4xl md:text-5xl font-black text-slate-800 mb-3 tracking-tight">Awesome!</h2>
            <p className="text-xl font-bold text-slate-500 mb-8">You earned <span className="text-secondary text-3xl mx-1 shadow-sm px-3 py-1 bg-secondary/10 rounded-xl">+{points}</span> points</p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onClose()}
              className="w-full py-4 bg-secondary text-yellow-900 rounded-2xl text-2xl font-black shadow-lg shadow-secondary/40 hover:bg-yellow-400 transition-colors"
            >
              Keep Going!
            </motion.button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
