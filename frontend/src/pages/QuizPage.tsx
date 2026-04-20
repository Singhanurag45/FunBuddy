import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import confetti from "canvas-confetti";
import { Rocket, Sparkles, Target } from 'lucide-react';
import { MemoizedQuizCard } from '../components/QuizCard';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import type { Question } from '../services/api';
import type { SubmittedAnswer } from '../services/api';
import type { QuizSubmissionResponse } from '../services/api';

const QUIZ_SUBJECTS = ['Math', 'Science', 'English'] as const;
const MAX_QUESTIONS_PER_QUIZ = 10;

function shuffleQuestions(items: Question[]): Question[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function QuizPage() {
  const { user, refreshUser } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<(typeof QUIZ_SUBJECTS)[number]>('Math');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<SubmittedAnswer[]>([]);
  const [readyToSubmit, setReadyToSubmit] = useState(false);
  const [submittingQuiz, setSubmittingQuiz] = useState(false);
  const [result, setResult] = useState<QuizSubmissionResponse | null>(null);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setLoading(true);
        setLoadError(null);

        const classLevel = user?.classLevel || 'Beginner';
        const data = await api.getQuestions(selectedSubject, classLevel);
        const limitedQuestions = shuffleQuestions(data).slice(0, MAX_QUESTIONS_PER_QUIZ);
        setQuestions(limitedQuestions);
        setAnswers([]);
        setCurrentIdx(0);
        setCompleted(false);
        setSubmissionError(null);
        setReadyToSubmit(false);
        setResult(null);
      } catch (error) {
        console.error('Failed to load quiz questions from backend', error);
        setLoadError('Unable to load quiz questions. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, [selectedSubject, user?.classLevel]);

  const handleNext = useCallback(async (latestAnswers?: SubmittedAnswer[]) => {
    const safeAnswers = Array.isArray(latestAnswers) ? latestAnswers : answers;
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      setAnswers(safeAnswers);
      setReadyToSubmit(true);
    }
  }, [answers, currentIdx, questions.length]);

  const handleAnswer = useCallback(async (selectedAnswer: string) => {
    const currentQuestion = questions[currentIdx];
    if (!currentQuestion) return;

    const nextAnswers = [
      ...answers,
      {
        questionId: currentQuestion.id,
        selectedAnswer,
      },
    ];
    setAnswers(nextAnswers);

    await handleNext(nextAnswers);
  }, [answers, currentIdx, handleNext, questions]);

  const handleSubmitQuiz = async () => {
    if (!user?.id || answers.length === 0) {
      setSubmissionError('Could not submit quiz. Missing user or answers.');
      return;
    }

    try {
      setSubmittingQuiz(true);
      setSubmissionError(null);
      const submissionResult = await api.submitQuiz(user.id, answers);
      setResult(submissionResult);
      await refreshUser();
      setReadyToSubmit(false);
      setCompleted(true);
      void confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.65 },
        colors: ["#2563ff", "#66d9b8", "#ff7a6b", "#b9ccff"],
      });
    } catch (error) {
      console.error('Failed to submit quiz result', error);
      setSubmissionError('Could not save your progress. Please try another quiz.');
    } finally {
      setSubmittingQuiz(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-8 border-success/20 border-t-success shadow-lg" />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex h-[60vh] items-center justify-center text-center">
        <p className="text-lg font-bold text-accent">{loadError}</p>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="flex h-[60vh] items-center justify-center text-center">
        <p className="text-lg font-bold text-slate-500">No quiz questions found for your level.</p>
      </div>
    );
  }

  if (readyToSubmit) {
    return (
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex min-h-[60vh] flex-col items-center justify-center text-center"
      >
        <div className="glass-card max-w-2xl rounded-[2.75rem] px-8 py-10">
          <h1 className="mb-4 text-4xl font-black tracking-tight text-slate-800">Ready to check your answers?</h1>
          <p className="mb-2 text-base font-bold text-primary">Mission: {selectedSubject}</p>
          <p className="mb-8 text-xl font-bold text-slate-500">
            You answered {answers.length} out of {questions.length} questions.
          </p>
          {submissionError && (
            <p className="mb-6 text-base font-bold text-accent">{submissionError}</p>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={submittingQuiz}
            onClick={handleSubmitQuiz}
            className="rounded-full bg-success px-10 py-5 text-2xl font-black text-white shadow-xl shadow-success/30 disabled:opacity-70"
          >
            {submittingQuiz ? 'Checking...' : 'Check My Answers!'}
          </motion.button>
        </div>
      </motion.div>
    );
  }

  if (completed) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex min-h-[60vh] flex-col items-center justify-center text-center"
      >
        <div className="glass-card max-w-2xl rounded-[2.75rem] px-8 py-10">
          <span className="mb-6 block text-7xl">Mission complete</span>
          <h1 className="mb-4 text-5xl font-black tracking-tight text-slate-800">Quiz Result</h1>
          <p className="mb-4 text-base font-bold text-primary">Subject: {selectedSubject}</p>
          {result ? (
            <div className="mb-8 space-y-2 font-bold text-slate-600">
              <p className="text-2xl text-slate-800">Score: {result.totalScore}</p>
              <p>Bonus Points: +{result.bonusPoints}</p>
              <p>Correct Answers: {result.correctAnswersCount} / {questions.length}</p>
              <p>Submitted Quizzes: {result.submissionCount}</p>
              <p>Updated Points: {result.updatedPoints}</p>
              <p>Updated Level: {result.updatedLevel}</p>
            </div>
          ) : (
            <p className="mb-10 text-xl font-bold text-slate-500">You did an amazing job.</p>
          )}
          {result && (
            <p className="mb-6 text-lg font-black text-success">
              {result.correctAnswersCount >= questions.length / 2
                ? "Happy Face! You rocked this quest."
                : "Oop! Nice try - one more round and you'll level up."}
            </p>
          )}
          {submissionError && (
            <p className="mb-6 text-base font-bold text-accent">{submissionError}</p>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setCompleted(false);
              setCurrentIdx(0);
              setAnswers([]);
              setSubmissionError(null);
              setResult(null);
              setReadyToSubmit(false);
            }}
            className="rounded-full bg-primary px-10 py-5 text-2xl font-black text-white shadow-xl shadow-primary/30"
          >
            Play Again
          </motion.button>
        </div>
      </motion.div>
    );
  }

  const progress = ((currentIdx + 1) / questions.length) * 100;
  const rocketOffset = `calc(${Math.max(progress, 6)}% - 1.25rem)`;

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col items-center py-2">
      <header className="mb-8 w-full text-center">
        <div className="glass-card relative overflow-hidden rounded-[2.75rem] px-5 py-6 sm:px-7 sm:py-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(102,217,184,0.22),transparent_24%),radial-gradient(circle_at_top_right,rgba(37,99,255,0.18),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.92),rgba(255,255,255,0.74))]" />
          <div className="relative">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/75 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-primary">
              <Target className="h-4 w-4" />
              Mission interface
            </div>
            <h1 className="mb-4 text-3xl font-black tracking-tight text-slate-800 sm:text-4xl md:text-5xl">
              Quiz Mission for {user?.classLevel}
            </h1>
            <div className="mb-5 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              {QUIZ_SUBJECTS.map((subject) => (
                <button
                  key={subject}
                  type="button"
                  onClick={() => setSelectedSubject(subject)}
                  className={`rounded-full border px-4 py-2 text-sm font-black transition-all ${
                    selectedSubject === subject
                      ? 'border-primary bg-primary text-white shadow-lg shadow-primary/30'
                      : 'border-white/70 bg-white/75 text-slate-600 hover:border-primary hover:text-primary'
                  }`}
                >
                  {subject}
                </button>
              ))}
            </div>

            <div className="relative mx-auto w-full max-w-3xl">
              <div className="relative h-6 overflow-hidden rounded-full border border-white/80 bg-white/70 p-1 shadow-[inset_0_2px_10px_rgba(37,99,255,0.08)]">
                <motion.div
                  className="relative h-full rounded-full bg-gradient-to-r from-primary via-[#4f8bff] to-success"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: "easeOut", duration: 0.8 }}
                >
                  <div className="absolute inset-y-0 right-0 w-10 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.9),rgba(255,255,255,0))] blur-sm" />
                </motion.div>
                <motion.div
                  className="absolute top-1/2 z-10 -translate-y-1/2 text-primary drop-shadow-[0_8px_16px_rgba(37,99,255,0.35)]"
                  animate={{ left: rocketOffset }}
                  transition={{ ease: "easeOut", duration: 0.8 }}
                >
                  <Rocket className="h-8 w-8 -rotate-12" />
                </motion.div>
              </div>
            </div>

            <p className="mt-4 flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-[0.22em] text-slate-500">
              <Sparkles className="h-4 w-4 text-success" />
              <span>Question {currentIdx + 1} of {questions.length}</span>
            </p>
          </div>
        </div>
      </header>

      <AnimatePresence mode="wait">
        <motion.div
          key={questions[currentIdx].id}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="w-full"
        >
          <MemoizedQuizCard
            question={questions[currentIdx]}
            onAnswer={handleAnswer}
            subject={selectedSubject}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
