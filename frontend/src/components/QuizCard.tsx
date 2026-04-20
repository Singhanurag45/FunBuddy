import { memo, useCallback, useMemo, useState } from 'react';
import type { Question } from '../services/api';
import { AnimatePresence, motion } from 'framer-motion';
import { Bot, HelpCircle, Sparkles, Wand2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface QuizCardProps {
  question: Question;
  onAnswer: (selectedAnswer: string) => void;
  subject: string;
}

type AnswerFeedback = 'correct' | 'wrong' | null;

function buildMagicHint(question: Question, subject: string) {
  const correctAnswer = question.options[question.correctOptionIndex];
  const otherOptions = question.options.filter((_, idx) => idx !== question.correctOptionIndex);

  return {
    nudge:
      subject === 'Math'
        ? 'Look for the option that fits the pattern or operation hiding in the numbers.'
        : subject === 'Science'
          ? 'Think about cause and effect, then rule out choices that sound magical instead of factual.'
          : 'Search for the option that sounds the clearest and most natural in the sentence.',
    coach: `Buddy Bot whisper: one clue points strongly toward "${correctAnswer}" once you remove unlikely answers like "${otherOptions[0] ?? 'the distractor'}".`,
  };
}

export function QuizCard({ question, onAnswer, subject }: QuizCardProps) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<AnswerFeedback>(null);
  const [showHintPanel, setShowHintPanel] = useState(false);

  const magicHint = useMemo(() => buildMagicHint(question, subject), [question, subject]);

  const handleSelect = useCallback((idx: number) => {
    if (selectedIdx !== null) return;

    const isCorrect = idx === question.correctOptionIndex;
    setSelectedIdx(idx);
    setFeedback(isCorrect ? 'correct' : 'wrong');

    setTimeout(() => {
      onAnswer(question.options[idx]);
      setSelectedIdx(null);
      setFeedback(null);
      setShowHintPanel(false);
    }, 1100);
  }, [onAnswer, question.correctOptionIndex, question.options, selectedIdx]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card relative mx-auto w-full max-w-4xl overflow-hidden rounded-[2.75rem] p-5 sm:p-7 md:p-10"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,255,0.14),transparent_22%),radial-gradient(circle_at_bottom_right,rgba(102,217,184,0.18),transparent_26%),linear-gradient(180deg,rgba(255,255,255,0.9),rgba(255,255,255,0.74))]" />

      <div className="relative">
        <div className="mb-6 flex flex-col gap-4 md:mb-8 md:flex-row md:items-start md:justify-between">
          <div className="flex gap-3 sm:gap-4 items-start">
            <div className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner shadow-primary/20 sm:h-16 sm:w-16">
              <HelpCircle className="h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10" />
            </div>
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/75 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">
                Mission prompt
              </div>
              <h2 className="text-xl font-black leading-tight text-slate-800 sm:text-2xl md:text-4xl">
                {question.text}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowHintPanel((prev) => !prev)}
            className="inline-flex items-center gap-2 self-start rounded-full bg-[linear-gradient(135deg,#7c3aed,#a855f7,#ec4899)] px-5 py-3 text-sm font-black text-white shadow-[0_20px_25px_-5px_rgba(124,58,237,0.35)] transition-transform hover:-translate-y-0.5"
          >
            <Wand2 className="h-4 w-4" />
            Magic Hint
          </button>
        </div>

        <AnimatePresence>
          {showHintPanel ? (
            <motion.div
              initial={{ opacity: 0, x: 40, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 24, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 260, damping: 24 }}
              className="mb-6 flex justify-end"
            >
              <div className="relative max-w-xl rounded-[2rem] border border-white/60 bg-[linear-gradient(145deg,rgba(124,58,237,0.12),rgba(255,255,255,0.88))] p-5 shadow-[0_20px_25px_-5px_rgb(0_0_0_/_0.05)] backdrop-blur-xl">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#7c3aed,#a855f7)] text-white">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.24em] text-violet-600">Buddy Bot</p>
                    <p className="text-sm font-semibold text-slate-500">Gemini-ready hint bubble</p>
                  </div>
                </div>
                <div className="space-y-3 rounded-[1.6rem] bg-white/80 p-4 text-sm font-medium leading-7 text-slate-600">
                  <p>{magicHint.nudge}</p>
                  <p>{magicHint.coach}</p>
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <div className="grid grid-cols-1 gap-4 md:gap-5">
          {question.options.map((option, idx) => {
            const isSelected = selectedIdx === idx;
            const isCorrect = idx === question.correctOptionIndex;
            const revealState = selectedIdx !== null;

            let stateClass = 'bg-white/72 border-white/70 text-slate-700 hover:border-primary/40 hover:bg-primary/5 hover:text-primary';

            if (revealState) {
              if (isSelected) {
                stateClass = isCorrect
                  ? 'bg-success/18 border-success/70 text-success-foreground shadow-[0_20px_25px_-5px_rgb(0_0_0_/_0.05)]'
                  : 'bg-accent/16 border-accent/70 text-accent-foreground shadow-[0_20px_25px_-5px_rgb(0_0_0_/_0.05)]';
              } else if (isCorrect) {
                stateClass = 'bg-success/12 border-success/60 text-success-foreground';
              } else {
                stateClass = 'bg-white/45 border-white/50 text-slate-400 opacity-60';
              }
            }

            return (
              <motion.button
                key={idx}
                layout
                initial={false}
                animate={
                  isSelected && feedback === 'correct'
                    ? { scale: [1, 1.03, 1], boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.05)' }
                    : isSelected && feedback === 'wrong'
                      ? { rotate: [0, -2, 2, -1, 0], x: [0, -6, 5, -4, 0] }
                      : {}
                }
                whileHover={selectedIdx === null ? { y: -3, scale: 1.01 } : {}}
                whileTap={selectedIdx === null ? { scale: 0.98 } : {}}
                onClick={() => handleSelect(idx)}
                disabled={selectedIdx !== null}
                className={cn(
                  'relative overflow-hidden rounded-[2rem] border p-4 text-left text-base font-bold transition-all sm:p-5 sm:text-lg md:p-6 md:text-2xl',
                  stateClass,
                )}
              >
                <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.46),rgba(255,255,255,0.12))]" />

                <div className="relative flex items-center gap-3 sm:gap-4">
                  <div
                    className={cn(
                      'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-black transition-colors sm:h-10 sm:w-10 sm:text-lg',
                      isSelected && isCorrect ? 'border-success bg-success text-white' : '',
                      isSelected && !isCorrect ? 'border-accent bg-accent text-white' : '',
                      !isSelected && isCorrect && revealState ? 'border-success bg-success text-white' : '',
                      selectedIdx === null ? 'border-current bg-white/60' : '',
                    )}
                  >
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <span className="pr-10">{option}</span>
                </div>

                <AnimatePresence>
                  {isSelected && feedback === 'correct' ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center gap-1 text-success"
                    >
                      <Sparkles className="h-5 w-5" />
                      <Sparkles className="h-4 w-4" />
                    </motion.div>
                  ) : null}
                </AnimatePresence>

                <AnimatePresence>
                  {isSelected && feedback === 'wrong' ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-accent"
                    >
                      <span className="text-xl font-black">Try again vibe</span>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

export const MemoizedQuizCard = memo(QuizCard);
