# CodeMentor AI

An AI-powered LeetCode Tracker and Coding Interview Mentor. Track your coding practice, analyze weak topics, get AI-generated hints, and prepare for coding interviews.

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React 19, TypeScript, React Router v7, Tailwind CSS, Zustand, React Query |
| Backend | Node.js, Express.js, TypeScript |
| Database | PostgreSQL |
| ORM | Prisma |
| Auth | JWT + Refresh Tokens, bcrypt |
| AI | OpenAI API (with mock fallback) |

## Folder Structure

```
codementor-ai/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma          # Database schema
│   │   ├── migrations/            # SQL migrations
│   │   └── seed.ts                # Demo data seeder
│   └── src/
│       ├── config/                # Environment config
│       ├── controllers/           # Route handlers
│       ├── middleware/            # Auth, validation, errors
│       ├── routes/                # API route definitions
│       ├── services/              # Business logic + AI
│       ├── lib/                   # Prisma client
│       ├── types/                 # TypeScript types
│       └── utils/                 # JWT, errors
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── ui/                # Reusable UI components
│       │   └── layout/            # Sidebar, Header, layouts
│       ├── features/              # Feature-based pages
│       │   ├── auth/
│       │   ├── dashboard/
│       │   ├── problems/
│       │   ├── ai-mentor/
│       │   ├── study-plan/
│       │   ├── analytics/
│       │   ├── mock-interview/
│       │   ├── profile/
│       │   ├── leaderboard/
│       │   └── landing/
│       ├── hooks/                 # Custom React hooks
│       ├── stores/                # Zustand stores
│       ├── lib/                   # API client, utils
│       └── types/                 # Shared TypeScript types
└── package.json                   # Monorepo scripts
```

## Database Schema

- **User** — id, name, email, password, resetToken, createdAt
- **RefreshToken** — JWT refresh token storage
- **Problem** — id, title, difficulty, topic, leetcodeUrl
- **SolvedProblem** — userId, problemId, solvedAt, notes
- **StudyPlan** — userId, title, description, skillLevel, roadmap (JSON)
- **Contest** — userId, contestName, ranking, rating
- **ChatMessage** — userId, role, content (AI mentor history)
- **MockInterview** — userId, type, question, answer, score, feedback

## API Routes

### Auth (`/api/auth`)
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/register` | Create account |
| POST | `/login` | Sign in |
| POST | `/refresh` | Refresh access token |
| POST | `/logout` | Invalidate refresh token |
| POST | `/forgot-password` | Request password reset |
| POST | `/reset-password` | Reset password with token |
| GET | `/me` | Get current user (protected) |

### Problems (`/api/problems`)
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/` | List solved problems (search/filter) |
| POST | `/` | Add solved problem |
| PUT | `/:id` | Update solved problem |
| DELETE | `/:id` | Delete solved problem |

### AI (`/api/ai`)
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/chat` | Send message to AI mentor |
| GET | `/chat/history` | Get chat history |
| DELETE | `/chat/history` | Clear chat history |
| POST | `/study-plan` | Generate study plan |
| GET | `/study-plans` | List study plans |
| POST | `/mock-interview/question` | Generate interview question |
| POST | `/mock-interview/evaluate` | Evaluate interview answer |
| GET | `/mock-interviews` | List past interviews |

### Analytics (`/api/analytics`)
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/dashboard` | Dashboard stats + charts data |
| GET | `/weakness` | Weakness analysis |
| GET | `/profile` | Profile stats |
| GET | `/leaderboard` | Top users ranking |

### Contests (`/api/contests`)
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/` | List contests |
| POST | `/` | Add contest |
| PUT | `/:id` | Update contest |
| DELETE | `/:id` | Delete contest |

## Authentication Flow

1. **Register/Login** → Server returns `accessToken` (15min) + `refreshToken` (7 days)
2. **Protected requests** → `Authorization: Bearer <accessToken>` header
3. **Token expired** → Frontend auto-refreshes via `/api/auth/refresh`
4. **Logout** → Refresh token deleted from database
5. **Forgot password** → Reset token generated (email in production; shown in dev mode)
6. **Reset password** → Token validated, password updated, all sessions invalidated

## Pages

| Route | Page |
|-------|------|
| `/` | Landing page |
| `/login` | Sign in |
| `/register` | Create account |
| `/forgot-password` | Password recovery |
| `/reset-password` | Set new password |
| `/dashboard` | Stats, charts, streak |
| `/problems` | Problem tracker (CRUD, search, filter) |
| `/ai-mentor` | AI chat interface |
| `/study-plan` | AI study plan generator |
| `/analytics` | Weakness analyzer |
| `/mock-interview` | Mock interview practice |
| `/profile` | User profile |
| `/leaderboard` | Top users ranking |

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 14+

### Setup

```bash
# Install dependencies
npm run install:all

# Configure environment
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
# Edit backend/.env with your DATABASE_URL and secrets

# Run database migration
cd backend
npx prisma migrate deploy
npm run db:seed   # Optional: seed demo data

# Start development servers
cd ..
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

### Demo Account (after seeding)

- Email: `demo@codementor.ai`
- Password: `password123`

### Build

```bash
npm run build
```

## Deployment

### Frontend (Vercel)

1. Import the `frontend/` directory as a Vercel project
2. Set environment variable: `VITE_API_URL=https://your-api.railway.app/api`
3. Deploy — `vercel.json` handles SPA routing

### Backend (Railway / Render)

1. Create a PostgreSQL database
2. Deploy the `backend/` directory
3. Set environment variables:
   - `DATABASE_URL` — PostgreSQL connection string
   - `JWT_SECRET` — Strong random secret
   - `JWT_REFRESH_SECRET` — Strong random secret
   - `OPENAI_API_KEY` — OpenAI API key (optional, mock fallback available)
   - `FRONTEND_URL` — Your Vercel frontend URL
   - `NODE_ENV=production`
4. Start command: `npm run build && npx prisma migrate deploy && npm start`

## Environment Variables

### Backend

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Access token signing secret |
| `JWT_REFRESH_SECRET` | Refresh token signing secret |
| `OPENAI_API_KEY` | OpenAI API key (optional) |
| `FRONTEND_URL` | Frontend URL for CORS |
| `PORT` | Server port (default: 3001) |

### Frontend

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API URL |

## License

MIT
