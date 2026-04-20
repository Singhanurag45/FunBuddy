import { Suspense, lazy, type ReactElement } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

const Layout = lazy(() =>
  import("./pages/Layout").then((module) => ({ default: module.Layout })),
);
const DashboardPage = lazy(() =>
  import("./pages/DashboardPage").then((module) => ({
    default: module.DashboardPage,
  })),
);
const QuizPage = lazy(() =>
  import("./pages/QuizPage").then((module) => ({ default: module.QuizPage })),
);
const LeaderboardPage = lazy(() =>
  import("./pages/LeaderboardPage").then((module) => ({
    default: module.LeaderboardPage,
  })),
);
const SettingsPage = lazy(() =>
  import("./pages/SettingsPage").then((module) => ({
    default: module.SettingsPage,
  })),
);
const LoginPage = lazy(() =>
  import("./pages/LoginPage").then((module) => ({ default: module.LoginPage })),
);
const RegisterPage = lazy(() =>
  import("./pages/RegisterPage").then((module) => ({
    default: module.RegisterPage,
  })),
);
const LandingPage = lazy(() =>
  import("./pages/LandingPage").then((module) => ({
    default: module.LandingPage,
  })),
);

// Protected Route wrapper
function RequireAuth({ children }: { children: ReactElement }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/login" replace />;
}

function RootEntry() {
  const { user, loading } = useAuth();
  const token = typeof window !== "undefined" ? localStorage.getItem("learnify_token") : null;

  if (loading) return null;
  if (user || token) {
    return <Navigate to="/dashboard" replace />;
  }

  return <LandingPage />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense
          fallback={
            <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500 font-bold">
              Loading...
            </div>
          }
        >
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/" element={<RootEntry />} />

            <Route
              path="/dashboard"
              element={
                <RequireAuth>
                  <Layout />
                </RequireAuth>
              }
            >
              <Route index element={<DashboardPage />} />
              <Route path="quiz" element={<QuizPage />} />
              <Route path="leaderboard" element={<LeaderboardPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
