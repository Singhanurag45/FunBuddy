# FunBuddy

FunBuddy is a full-stack gamified learning platform with:

- A Spring Boot backend (JWT auth, MongoDB, quiz + analytics APIs)
- A React + TypeScript frontend (Vite)
- A points/level-based learning experience with leaderboard and dashboard analytics

## Tech Stack

### Backend

- Java 17
- Spring Boot 3
- Spring Security + JWT
- Spring Data MongoDB
- Maven

### Frontend

- React 19 + TypeScript
- Vite
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
  frontend/
    src/
      components/
      context/
      pages/
      services/
```

## Prerequisites

- Java 17+
- Maven 3.9+
- Node.js 20+ (or 18+ with modern npm)
- MongoDB Atlas (or a MongoDB URI)

## Environment Variables

The backend reads environment variables from your shell and can also load a local `.env` file.

### Backend required

- `DATABASE_URL` - MongoDB connection string

### Backend optional

- `JWT_SECRET` - JWT signing secret
- `JWT_EXPIRATION_MS` - token validity in ms (default: `86400000`)
- `CORS_ALLOWED_ORIGIN_PATTERNS` - comma-separated allowed origins/patterns

### Frontend

- `VITE_API_URL` - backend base URL (without `/api` is also fine)

Notes:

- In local frontend development, if `VITE_API_URL` is missing, it falls back to `http://localhost:8080/api`.
- In production frontend builds, `VITE_API_URL` must be set.

## Running Locally

## 1) Start backend

From the repository root:

```bash
./mvnw spring-boot:run
```

On Windows PowerShell/CMD:

```bash
mvnw.cmd spring-boot:run
```

Backend default URL: `http://localhost:8080`

To enable dev error detail profile:

```bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

## 2) Start frontend

From `frontend/`:

```bash
npm install
npm run dev
```

Frontend dev URL (default): `http://localhost:5173`

## Build Commands

### Backend

```bash
./mvnw clean package
```

### Frontend

```bash
cd frontend
npm run build
```

## Docker (Backend)

Build image:

```bash
docker build -t funbuddy-backend .
```

Run container:

```bash
docker run --rm -p 8080:8080 -e DATABASE_URL="<your_mongodb_uri>" -e JWT_SECRET="<your_secret>" funbuddy-backend
```

## API Overview

Base path: `/api`

### Auth and Users

- `POST /api/users/register`
- `POST /api/users/login`
- `GET /api/users`
- `GET /api/users/leaderboard`

### Questions and Quiz

- `POST /api/questions`
- `POST /api/questions/bulk`
- `GET /api/questions?subject=<subject>&classLevel=<classLevel>`
- `POST /api/questions/submit`
- `GET /api/questions/analytics?userId=<userId>`

## Default Auth Behavior

- Public endpoints: login, register, error
- All other `/api/**` endpoints require Bearer JWT token

## Testing

Run backend tests:

```bash
./mvnw test
```

## Postman

A ready collection is available at:

- `postman/Gamify Backend APIs.postman_collection.json`

## Deployment Notes

- Backend can run on platforms that provide `PORT` (Dockerfile supports this pattern).
- Frontend should set `VITE_API_URL` in deployment environment variables.
- Ensure backend CORS allowed origins include your deployed frontend URL.
