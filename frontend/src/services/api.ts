import axios from "axios";

const rawApiUrl = import.meta.env.VITE_API_URL?.trim();

function resolveApiBaseUrl(): string {
  if (!rawApiUrl) {
    return "http://localhost:8080/api";
  }

  const withoutTrailingSlash = rawApiUrl.replace(/\/+$/, "");
  return withoutTrailingSlash.endsWith("/api")
    ? withoutTrailingSlash
    : `${withoutTrailingSlash}/api`;
}

// Use VITE_API_URL in deployed environments and localhost for local fallback.
export const apiClient = axios.create({
  baseURL: resolveApiBaseUrl(),
  timeout: 10000,
});

export interface UserProfile {
  id: string;
  name: string;
  points: number;
  level: number;
  streak: number;
  badges: string[];
  classLevel?: string;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctOptionIndex: number;
  subject?: string;
  classLevel?: string;
}

interface BackendQuestion {
  id: string;
  subject: string;
  questionText: string;
  options: string[];
  correctAnswer: string;
  classLevel: string;
}

export interface SubmittedAnswer {
  questionId: string;
  selectedAnswer: string;
}

export interface QuizSubmissionResponse {
  totalScore: number;
  bonusPoints: number;
  correctAnswersCount: number;
  updatedPoints: number;
  updatedLevel: number;
  submissionCount: number;
}

export interface WeeklyPointsData {
  day: string;
  points: number;
}

export interface SubjectAccuracyData {
  subject: string;
  accuracy: number;
}

export interface MonthlyPerformanceSummary {
  quizzesPlayed: number;
  pointsEarned: number;
  accuracy: number;
}

export interface DashboardAnalytics {
  dailyStreak: number;
  accuracyPercentage: number;
  totalQuizzesPlayed: number;
  totalCorrectAnswers: number;
  totalWrongAnswers: number;
  weeklyPoints: WeeklyPointsData[];
  subjectAccuracy: SubjectAccuracyData[];
  monthlySummary: MonthlyPerformanceSummary;
}

const CLASS_LEVEL_ALIASES: Record<string, string[]> = {
  Basic: ["Class 1", "Class 2", "Class 1-2"],
  Intermediate: ["Class 3", "Class 4", "Class 3-4"],
  Advanced: ["Class 5", "Class 6"],
  Beginner: ["Basic", "Class 1", "Class 2", "Class 1-2"],
};

function toQuestionViewModel(question: BackendQuestion): Question {
  return {
    id: question.id,
    text: question.questionText,
    options: question.options,
    correctOptionIndex: question.options.findIndex(
      (option) => option === question.correctAnswer,
    ),
    subject: question.subject,
    classLevel: question.classLevel,
  };
}

function buildClassLevelCandidates(classLevel: string): string[] {
  const normalized = classLevel?.trim() || "Basic";
  const aliasCandidates = CLASS_LEVEL_ALIASES[normalized] || [];
  return Array.from(new Set([normalized, ...aliasCandidates]));
}

export const api = {
  // Setup Authentication headers
  setToken: (token: string | null) => {
    if (token) {
      apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete apiClient.defaults.headers.common["Authorization"];
    }
  },

  // Auth Endpoints
  login: async (credentials: any) => {
    const response = await apiClient.post("/users/login", credentials);
    return response.data; // AuthResponse -> token, userId, email, name
  },

  register: async (details: any) => {
    const response = await apiClient.post("/users/register", details);
    return response.data; // User -> id, name, email, classLevel, points, level
  },

  // Users
  getAllUsers: async () => {
    const response = await apiClient.get("/users");
    return response.data;
  },

  getLeaderboard: async () => {
    const response = await apiClient.get("/users/leaderboard");
    return response.data;
  },

  // Using a trick to fetch individual profile via standard list endpoint since no target exists yet
  getUserProfile: async (id: string): Promise<UserProfile> => {
    const users = await api.getAllUsers();
    const specificUser = users.find((u: any) => u.id === id);
    if (!specificUser) throw new Error("User not found");

    return {
      id: specificUser.id,
      name: specificUser.name,
      points: specificUser.points || 0,
      level: specificUser.level || 1,
      streak: 0,
      badges: [],
      classLevel: specificUser.classLevel,
    };
  },

  // Get Quiz Questions from backend DB
  getQuestions: async (
    subject: string,
    classLevel: string,
  ): Promise<Question[]> => {
    const classLevelCandidates = buildClassLevelCandidates(classLevel);

    for (const classLevelCandidate of classLevelCandidates) {
      const response = await apiClient.get<BackendQuestion[]>("/questions", {
        params: { subject, classLevel: classLevelCandidate },
      });

      if (response.data.length > 0) {
        return response.data.map(toQuestionViewModel);
      }
    }

    return [];
  },

  submitQuiz: async (
    userId: string,
    answers: SubmittedAnswer[],
  ): Promise<QuizSubmissionResponse> => {
    const response = await apiClient.post<QuizSubmissionResponse>(
      "/questions/submit",
      {
        userId,
        answers,
      },
    );
    return response.data;
  },

  getDashboardAnalytics: async (
    userId: string,
  ): Promise<DashboardAnalytics> => {
    const response = await apiClient.get<DashboardAnalytics>(
      "/questions/analytics",
      {
        params: { userId },
      },
    );
    return response.data;
  },
};
