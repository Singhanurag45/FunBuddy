import { Suspense, lazy, type ReactElement } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { LandingPage } from "./pages/LandingPage";

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

function RouteFallback() {
  return (
    <div className="min-h-screen bg-background text-slate-500">
      <div className="mx-auto max-w-7xl px-4 py-10 font-bold sm:px-6 lg:px-8">
        Loading...
      </div>
    </div>
  );
}

function withSuspense(children: ReactElement) {
  return <Suspense fallback={<RouteFallback />}>{children}</Suspense>;
}

function RequireAuth({ children }: { children: ReactElement }) {
  const { user, loading } = useAuth();
  if (loading) return <RouteFallback />;
  return user ? children : <Navigate to="/login" replace />;
}

function RootEntry() {
  const { user, loading } = useAuth();
  const token = typeof window !== "undefined" ? localStorage.getItem("learnify_token") : null;

  if (!token) {
    return <LandingPage />;
  }

  if (loading) {
    return <LandingPage />;
  }

  if (user || token) {
    return <Navigate to="/dashboard" replace />;
  }

  return <LandingPage />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={withSuspense(<LoginPage />)} />
          <Route path="/register" element={withSuspense(<RegisterPage />)} />
          <Route path="/" element={<RootEntry />} />

          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                {withSuspense(<Layout />)}
              </RequireAuth>
            }
          >
            <Route index element={withSuspense(<DashboardPage />)} />
            <Route path="quiz" element={withSuspense(<QuizPage />)} />
            <Route path="leaderboard" element={withSuspense(<LeaderboardPage />)} />
            <Route path="settings" element={withSuspense(<SettingsPage />)} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
