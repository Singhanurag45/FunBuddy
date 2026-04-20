import { memo, useCallback, useState } from 'react';
import type { Question } from '../services/api';
import { motion } from 'framer-motion';
import { HelpCircle } from 'lucide-react';
import { cn } from '../lib/utils';

interface QuizCardProps {
  question: Question;
  onAnswer: (selectedAnswer: string) => void;
}

export function QuizCard({ question, onAnswer }: QuizCardProps) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const handleSelect = useCallback((idx: number) => {
    if (selectedIdx !== null) return;
    setSelectedIdx(idx);
    
    // Quick delay to show selection, then resolve
    setTimeout(() => {
      onAnswer(question.options[idx]);
      setSelectedIdx(null);
    }, 1200);
  }, [onAnswer, question.options, selectedIdx]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-5 sm:p-7 md:p-10 rounded-4xl sm:rounded-[3rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-b-8 border-slate-100 max-w-3xl mx-auto w-full relative overflow-hidden"
    >
      <div className="flex gap-3 sm:gap-4 items-start mb-6 sm:mb-8 md:mb-12">
        <div className="w-12 h-12 sm:w-16 sm:h-16 shrink-0 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mt-1 shadow-inner shadow-primary/20">
          <HelpCircle className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10" />
        </div>
        <h2 className="text-xl sm:text-2xl md:text-4xl font-black text-slate-800 leading-tight">
          {question.text}
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
        {question.options.map((option, idx) => {
          const isSelected = selectedIdx === idx;
          const isCorrect = idx === question.correctOptionIndex;
          
          let stateClass = "bg-slate-50 border-slate-200 text-slate-700 hover:border-primary hover:bg-primary/5 hover:text-primary hover:shadow-md";
          
          if (selectedIdx !== null) {
            if (isSelected) {
              stateClass = isCorrect 
                ? "bg-success/20 border-success text-success shadow-lg shadow-success/20 scale-[1.02]" 
                : "bg-accent/20 border-accent text-accent shadow-lg shadow-accent/20 scale-[1.02]";
            } else if (isCorrect) {
              stateClass = "bg-success/10 border-success text-success scale-[1.02]";
            } else {
              stateClass = "bg-slate-50 border-slate-200 text-slate-400 opacity-50";
            }
          }

          return (
            <motion.button
              key={idx}
              whileHover={selectedIdx === null ? { scale: 1.02, y: -2 } : {}}
              whileTap={selectedIdx === null ? { scale: 0.98 } : {}}
              onClick={() => handleSelect(idx)}
              disabled={selectedIdx !== null}
              className={cn(
                "relative p-4 sm:p-5 md:p-6 rounded-3xl sm:rounded-4xl border-4 text-base sm:text-lg md:text-2xl font-bold transition-all text-left flex items-center gap-3 sm:gap-4",
                stateClass
              )}
            >
              <div className={cn(
                "w-8 h-8 sm:w-10 sm:h-10 shrink-0 rounded-full border-2 flex items-center justify-center text-sm sm:text-lg font-black transition-colors",
                isSelected && isCorrect ? "border-success bg-success text-white" : "",
                isSelected && !isCorrect ? "border-accent bg-accent text-white" : "",
                !isSelected && isCorrect && selectedIdx !== null ? "border-success bg-success text-white" : "",
                selectedIdx === null ? "border-current bg-white/50" : ""
              )}>
                {String.fromCharCode(65 + idx)}
              </div>
              <span className="truncate">{option}</span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}

export const MemoizedQuizCard = memo(QuizCard);
