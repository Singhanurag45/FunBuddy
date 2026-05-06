# FunBuddy Frontend

This is the React frontend for FunBuddy, a gamified learning platform.

## Stack

- React 19
- TypeScript
- Vite
- React Router
- Axios
- Framer Motion
- Recharts
- Tailwind CSS

## Environment Variable

- VITE_API_URL

Examples:

- VITE_API_URL=http://localhost:8080
- VITE_API_URL=http://localhost:8080/api

Notes:

- During local development, if VITE_API_URL is not set, the app falls back to http://localhost:8080/api.
- In production, VITE_API_URL must be set.

## Scripts

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview production build locally:

```bash
npm run preview
```

Run linter:

```bash
npm run lint
```

## App Routes

- /
- /login
- /register
- /dashboard
- /dashboard/quiz
- /dashboard/leaderboard
- /dashboard/settings

## Important Folders

```text
frontend/
  src/
    components/
    context/
    pages/
    services/
```
