import { useCallback, useEffect, useState } from 'react';
import { api } from '../services/api';
import type { Question } from '../services/api';
import type { SubmittedAnswer } from '../services/api';
import type { QuizSubmissionResponse } from '../services/api';
import { MemoizedQuizCard } from '../components/QuizCard';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

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

    // Move to the next question immediately after an answer.
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
    } catch (error) {
      console.error('Failed to submit quiz result', error);
      setSubmissionError('Could not save your progress. Please try another quiz.');
    } finally {
      setSubmittingQuiz(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-16 h-16 border-8 border-success/20 border-t-success rounded-full animate-spin shadow-lg"></div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-center">
        <p className="text-lg font-bold text-accent">{loadError}</p>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-center">
        <p className="text-lg font-bold text-slate-500">No quiz questions found for your level.</p>
      </div>
    );
  }

  if (readyToSubmit) {
    return (
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-[60vh] text-center"
      >
        <h1 className="text-4xl font-black text-slate-800 mb-4 tracking-tight">Ready to Submit?</h1>
        <p className="text-base font-bold text-primary mb-2">Subject: {selectedSubject}</p>
        <p className="text-xl font-bold text-slate-500 mb-8">
          You answered {answers.length} out of {questions.length} questions.
        </p>
        {submissionError && (
          <p className="text-base font-bold text-accent mb-6">{submissionError}</p>
        )}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={submittingQuiz}
          onClick={handleSubmitQuiz}
          className="px-10 py-5 bg-success text-white rounded-4xl font-black text-2xl shadow-xl shadow-success/30 disabled:opacity-70"
        >
          {submittingQuiz ? 'Submitting...' : 'Submit Quiz'}
        </motion.button>
      </motion.div>
    );
  }

  if (completed) {
    return (
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-[60vh] text-center"
      >
        <span className="text-8xl mb-6 block animate-bounce">🎉</span>
        <h1 className="text-5xl font-black text-slate-800 mb-4 tracking-tight">Quiz Result</h1>
        <p className="text-base font-bold text-primary mb-4">Subject: {selectedSubject}</p>
        {result ? (
          <div className="mb-8 text-slate-600 font-bold space-y-2">
            <p className="text-2xl text-slate-800">Score: {result.totalScore}</p>
            <p>Bonus Points: +{result.bonusPoints}</p>
            <p>Correct Answers: {result.correctAnswersCount} / {questions.length}</p>
            <p>Submitted Quizzes: {result.submissionCount}</p>
            <p>Updated Points: {result.updatedPoints}</p>
            <p>Updated Level: {result.updatedLevel}</p>
          </div>
        ) : (
          <p className="text-xl font-bold text-slate-500 mb-10">You did an amazing job.</p>
        )}
        {submissionError && (
          <p className="text-base font-bold text-accent mb-6">{submissionError}</p>
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
          className="px-10 py-5 bg-primary text-white rounded-4xl font-black text-2xl shadow-xl shadow-primary/30"
        >
          Play Again
        </motion.button>
      </motion.div>
    );
  }

  const progress = ((currentIdx + 1) / questions.length) * 100;

  return (
    <div className="py-1 sm:py-2 w-full flex flex-col items-center max-w-4xl mx-auto">
      <header className="mb-6 sm:mb-10 text-center w-full">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-800 mb-4 sm:mb-6 tracking-tight">
          Quiz Time For {user?.classLevel}! 🧠
        </h1>
        <div className="mb-4 sm:mb-5 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {QUIZ_SUBJECTS.map((subject) => (
            <button
              key={subject}
              type="button"
              onClick={() => setSelectedSubject(subject)}
              className={`px-4 sm:px-5 py-2 rounded-2xl font-black text-sm transition-all border-2 ${
                selectedSubject === subject
                  ? 'bg-primary text-white border-primary shadow-lg shadow-primary/30'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-primary hover:text-primary'
              }`}
            >
              {subject}
            </button>
          ))}
        </div>
        <div className="w-full bg-slate-200 h-3 sm:h-4 rounded-full overflow-hidden p-0.5 relative shadow-inner">
          <motion.div 
            className="h-full bg-success rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: "easeOut", duration: 0.8 }}
          />
        </div>
        <p className="text-slate-500 font-bold mt-4 uppercase tracking-wider text-sm flex items-center justify-center gap-2">
          <span>Question {currentIdx + 1} of {questions.length}</span>
        </p>
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
          />
        </motion.div>
      </AnimatePresence>

    </div>
  );
}
