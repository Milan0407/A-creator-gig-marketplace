# CreatorGig

CreatorGig is an AI-first creator gig marketplace where clients can discover young creators, request a service, and track the outcome without creating an account.

## Hackathon submission

- Track: Creator Economy
- Hackathon ID: **[REPLACE WITH ACTUAL HACKATHON ID BEFORE SUBMISSION]**
- Standard API status: **Not confirmed.** The supplied project brief does not include a track API specification, so no claim is made until the hackathon documentation is reviewed.

## What works

- Post, browse, search, filter and sort creator gigs.
- View a gig and submit a booking request.
- Demo identities for a creator and three clients; this is not authentication.
- Creator dashboard for accepting or declining incoming requests with a client-visible reason.
- Client booking history, including declined status, a reason, gig revisit link and category-based alternatives.
- When one pending request is accepted, the backend automatically declines other pending requests for the same gig.

## Stack

- Client: React, Vite, Tailwind CSS, React Router, Axios and Lucide.
- API: Node.js, Express, MongoDB and Mongoose using ES modules.

## Local setup

1. Copy `server/.env.example` to `server/.env` and supply a MongoDB connection string.
2. In `server`, run `npm install` then `npm run dev`.
3. Optionally copy `client/.env.example` to `client/.env` and set the API URL.
4. In `client`, run `npm install` then `npm run dev`.

The client is served on `http://localhost:5173` and the API on `http://localhost:5000` by default.

## API overview

- `POST`, `GET /api/gigs`; `GET /api/gigs/:id`
- `POST /api/bookings`
- `GET /api/bookings/creator?creatorName=`
- `GET /api/bookings/client?clientEmail=`
- `PATCH /api/bookings/:id/accept` and `PATCH /api/bookings/:id/decline`
- `POST /api/ai/generate-gig`, `POST /api/ai/search`, `POST /api/ai/match/:id`
- `POST /api/ai/recommendations`, `GET /api/ai/creator-insights?creatorName=`

## Deployment configuration

### Backend (Render)

`render.yaml` defines the API service. Set `MONGODB_URI` to the Atlas connection string and `CLIENT_URL` to the final Vercel frontend origin. Render will use `GET /api/health` as its health check.

### Frontend (Vercel)

Import the repository with `client` as the project root. Set `VITE_API_URL` to the deployed backend URL ending in `/api`, for example `https://creatorgig-api.onrender.com/api`. `client/vercel.json` redirects client-side routes to the React app so direct links such as `/gigs/:id` work after deployment.

Never publish `MONGODB_URI` or provider API keys. After both deployments, add the live URLs here before submission.

## Planned AI layer

The core marketplace remains usable without AI. AI assist endpoints currently provide transparent, deterministic fallbacks for gig draft generation and intent-based search, so the product works with no API key. These routes are isolated under `server/src/services/ai` and can be upgraded to an external provider without changing the client flow. Category-based recovery recommendations are already shown after a declined request; match analysis and creator insights remain the next additions.

When using OpenRouter's free router, configure `OPENROUTER_TIMEOUT_MS=30000` because free models can queue. You may also set `OPENROUTER_MODEL` to a specific currently available free model from the OpenRouter model catalog to avoid free-router variability. The fallback remains active if a provider cannot respond in time.
