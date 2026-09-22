# CreatorGig

An AI-powered creator gig marketplace for the Creator Economy. CreatorGig helps clients discover skilled young creators, book a service with a clear brief, and track the outcome—without requiring an account.

> **Hackathon track:** Creator Economy
>
> **Hackathon ID:** **[REPLACE WITH THE ACTUAL HACKATHON ID BEFORE SUBMISSION]**
>
> **Live application:** **[ADD VERCEL URL AFTER DEPLOYMENT]**
> **Live API:** **[ADD RENDER URL AFTER DEPLOYMENT]**

## The problem

Young creators need a simple way to monetize their skills, while clients need confidence that they can discover, compare, and book the right person for a project. CreatorGig delivers the required marketplace journey while using AI to make creation, discovery, matching, recovery after rejection, and creator decision-making more useful.

## Features

### Core marketplace

- Browse active gigs by category, keyword, price, popularity, rating, or newest listing.
- View detailed service pages with delivery time, tags, price, creator information, and a booking call to action.
- Post a gig with title, description, category, price, delivery time, tags, and optional custom image URL.
- Book a gig with project requirements, preferred delivery date, and notes.
- Review booking requests in the creator dashboard, then accept or decline with a client-visible reason.
- Track bookings as a client with `PENDING`, `ACCEPTED`, or `DECLINED` status.
- Use demo identities instead of authentication, so every grader can use every path immediately.

### AI features

All AI calls stay server-side. Each feature has a deterministic fallback, so core flows remain functional when a provider is unavailable.

- **AI Gig Generator:** turns a plain-language service description into an editable gig draft.
- **Semantic Search:** interprets a client’s intent and ranks relevant gigs beyond exact keyword matching.
- **AI Match Analysis:** returns transparent, evidence-based factors for a client brief and a selected gig.
- **AI Recovery Recommendations:** suggests alternatives with reasons after a booking is declined.
- **AI Creator Insights:** gives creators data-grounded suggestions from their actual gigs and bookings.

## Key product decisions

See [DECISIONS.md](DECISIONS.md) for the complete rationale.

- **Rejection:** clients see the decline reason, revisit the original gig, and receive alternatives so their project does not stall.
- **Double booking:** several requests may remain pending; accepting one automatically declines the other pending requests for that gig.
- **Discovery:** transparent sort/filter controls remain available alongside AI-assisted intent understanding.

## Technology

| Layer | Technology |
| --- | --- |
| Frontend | React, Vite, Tailwind CSS, React Router, Axios, Framer Motion, Lucide React |
| Backend | Node.js, Express, MongoDB Atlas, Mongoose, ES modules |
| AI | OpenRouter Chat Completions API with `openrouter/free` by default |
| Hosting | Vercel (frontend), Render (backend), MongoDB Atlas (database) |

## Architecture

```text
React / Vite client
      │  VITE_API_URL
      ▼
Express API on Render
 ├── Gig and Booking controllers
 ├── MongoDB Atlas via Mongoose
 └── AI service → OpenRouter
```

The browser never receives `MONGODB_URI`, `OPENROUTER_API_KEY`, or any server secret.

## Demo identities

There is no login or signup.

| Identity | Role | Email |
| --- | --- | --- |
| Milan Chauhan | Creator | `milan@creatorgig.demo` |
| Rahul Sharma | Client | `rahul@creatorgig.demo` |
| Aman Verma | Client | `aman@creatorgig.demo` |
| Priya Singh | Client | `priya@creatorgig.demo` |

## Local setup

### Prerequisites

- Node.js 22 or later
- A MongoDB Atlas connection string
- An OpenRouter key for live AI responses (optional; fallbacks work without it)

### Backend

```bash
cd server
cp .env.example .env
npm install
npm run seed
npm run dev
```

Set these values in `server/.env`:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
CLIENT_URL=http://localhost:5173
OPENROUTER_API_KEY=your_openrouter_api_key
OPENROUTER_MODEL=openrouter/free
OPENROUTER_TIMEOUT_MS=30000
```

### Frontend

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

For local development:

```env
VITE_API_URL=http://localhost:5000/api
```

The frontend runs at `http://localhost:5173`; the API runs at `http://localhost:5000`.

## Seed data

Run this once against your demo database:

```bash
cd server
npm run seed
```

The seed is idempotent: it inserts missing demo records but does not clear or overwrite existing data. It includes realistic gigs, declined booking recovery data, and two pending bookings for the double-booking demonstration.

## API overview

| Area | Endpoint |
| --- | --- |
| Health | `GET /api/health` |
| Gigs | `POST /api/gigs`, `GET /api/gigs`, `GET /api/gigs/:id` |
| Bookings | `POST /api/bookings`, `GET /api/bookings/creator`, `GET /api/bookings/client` |
| Booking decisions | `PATCH /api/bookings/:id/accept`, `PATCH /api/bookings/:id/decline` |
| AI generation/search | `POST /api/ai/generate-gig`, `POST /api/ai/search` |
| AI match/recovery | `POST /api/ai/match/:id`, `POST /api/ai/recommendations` |
| AI insights | `GET /api/ai/creator-insights?creatorName=` |

## Deployment

### 1. Deploy the API on Render

The root [render.yaml](render.yaml) configures the server as a Render web service with `server` as its root directory and `/api/health` as its health check.

Set these Render environment variables:

```env
MONGODB_URI=your_mongodb_connection_string
CLIENT_URL=https://your-vercel-domain.vercel.app
OPENROUTER_API_KEY=your_openrouter_api_key
OPENROUTER_MODEL=openrouter/free
OPENROUTER_TIMEOUT_MS=30000
```

After deployment, verify:

```text
https://your-render-service.onrender.com/api/health
```

### 2. Deploy the frontend on Vercel

- Import this GitHub repository.
- Set **Root Directory** to `client`.
- Keep Vite as the detected framework.
- Add this Production environment variable:

```env
VITE_API_URL=https://your-render-service.onrender.com/api
```

`client/vercel.json` rewrites direct client routes such as `/gigs/:id` back to the React application.

### 3. Final cross-origin check

Set Render’s `CLIENT_URL` to the final Vercel URL exactly, without a trailing slash, then redeploy Render. Vercel variables apply only to newly created deployments, so redeploy Vercel after adding or changing `VITE_API_URL`.

## Standard API status

**Not confirmed.** The project brief did not contain a standard API specification for this track, so this repository makes no unverified implementation claim. Replace this section only after checking the official hackathon documentation.

## Verification

```bash
cd client
npm run lint
npm run build
```

The backend source can be syntax-checked with:

```bash
cd server
node --check src/server.js
```

## Submission checklist

- [ ] Replace the Hackathon ID placeholder.
- [ ] Add live Vercel and Render URLs above.
- [ ] Verify the deployed booking and AI flows with the public URLs.
- [ ] Ensure MongoDB Atlas allows the Render service to connect.
- [ ] Record a 3–4 minute demo covering all five required features and DP1–DP3.
- [ ] Confirm this repository is public and that no `.env` file or secret is committed.
