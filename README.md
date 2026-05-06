# FunBuddy

FunBuddy is a full-stack gamified learning platform where students take quizzes, earn points, level up, and track progress through analytics and leaderboards.

## What This Project Includes

- Spring Boot backend with JWT-based authentication
- MongoDB data storage for users, questions, submissions, and analytics
- React and TypeScript frontend built with Vite
- Dashboard experience with quiz flow, metrics, and leaderboard

## Tech Stack

### Backend

- Java 17
- Spring Boot 3
- Spring Security
- JWT (jjwt)
- Spring Data MongoDB
- Maven

### Frontend

- React 19
- TypeScript
- Vite
- React Router
- Axios
- Recharts
- Framer Motion
- Tailwind CSS

## Project Structure

```text
FunBuddy/
  src/main/java/com/gamify/platform/
    config/
    controller/
    dto/
    model/
    repository/
    security/
    service/
  src/main/resources/
    application.properties
    application-dev.properties
  src/test/java/com/gamify/platform/
  frontend/
    src/
      components/
      context/
      pages/
      services/
  postman/
    Gamify Backend APIs.postman_collection.json
```

## Prerequisites

- Java 17+
- Maven 3.9+
- Node.js 20+ (18+ also works with modern npm)
- A MongoDB connection URI

## Environment Variables

The backend loads values from your shell environment and also supports a local .env file via Spring config import.

### Backend

- DATABASE_URL (required): MongoDB connection string
- JWT_SECRET (optional): JWT signing secret
- JWT_EXPIRATION_MS (optional): token validity in milliseconds, default is 86400000
- CORS_ALLOWED_ORIGIN_PATTERNS (optional): comma-separated allowed origins or patterns

### Frontend

- VITE_API_URL

Notes:

- In local development, if VITE_API_URL is missing, the frontend falls back to http://localhost:8080/api.
- In production builds, VITE_API_URL is required.
- VITE_API_URL can be set with or without /api. The frontend app normalizes it.

## Run Locally

### 1) Start backend

From repository root:

```bash
./mvnw spring-boot:run
```

Windows PowerShell:

```bash
.\mvnw.cmd spring-boot:run
```

Backend URL: http://localhost:8080

Run backend with dev profile:

```bash
.\mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=dev
```

### 2) Start frontend

From frontend directory:

```bash
cd frontend
npm install
npm run dev
```

Frontend URL: http://localhost:5173

## Build

### Backend build

```bash
./mvnw clean install
```

Windows PowerShell:

```bash
.\mvnw.cmd clean install
```

### Frontend build

```bash
cd frontend
npm run build
```

## API Summary

Base path: /api

### User and Auth

- POST /api/users/register
- POST /api/users/login
- GET /api/users
- GET /api/users/leaderboard

### Questions and Quiz

- POST /api/questions
- POST /api/questions/bulk
- GET /api/questions?subject={subject}&classLevel={classLevel}
- POST /api/questions/submit
- GET /api/questions/analytics?userId={userId}

## Security

- Public endpoints: /api/users/register, /api/users/login, /error
- All other endpoints require Bearer token authentication
- CORS is configured through CORS_ALLOWED_ORIGIN_PATTERNS

## Testing

Run backend tests:

```bash
./mvnw test
```

Windows PowerShell:

```bash
.\mvnw.cmd test
```

## Docker (Backend)

Build backend image:

```bash
docker build -t funbuddy-backend .
```

Run backend container:

```bash
docker run --rm -p 8080:8080 -e DATABASE_URL="<your_mongodb_uri>" -e JWT_SECRET="<your_secret>" funbuddy-backend
```

## Postman

Use this collection for quick API testing:

- postman/Gamify Backend APIs.postman_collection.json

## Deployment Checklist

- Set DATABASE_URL and JWT_SECRET in backend environment
- Set VITE_API_URL in frontend environment
- Add deployed frontend URL to CORS_ALLOWED_ORIGIN_PATTERNS
- Ensure backend is reachable from frontend origin
