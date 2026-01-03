# Smart Gym Coach (Next.js PWA)

Offline-friendly MVP for coaches and athletes. Built with Next.js App Router + TypeScript and ExerciseDB proxy routes.

## Getting started
1. Install dependencies: `npm install` (ESLint is pinned to 8.57.0 to satisfy the Next.js peer requirement and avoid ERESOLVE conflicts.)
1. Install dependencies: `npm install`
2. Create `.env.local` in the project root:
```
EXERCISEDB_BASE_URL=https://exercisedb.p.rapidapi.com
RAPIDAPI_KEY=your-rapidapi-key
RAPIDAPI_HOST=exercisedb.p.rapidapi.com
```
3. Run locally: `npm run dev` then open http://localhost:3000
4. Build: `npm run build`

## Vercel deployment
- Push this repo and import into Vercel.
- Add the environment variables above in Project Settings > Environment Variables.
- Vercel will run `npm install` and `npm run build`; the PWA manifest and service worker live in `/public`.

## Project map
- `app/(marketing)/` landing + setup instructions
- `app/coach` coach dashboard and plan builder
- `app/athlete` athlete dashboard
- `app/ai-coach` rule-based AI plan generator
- `app/workout/[day]` day view + completion toggle
- `app/api/exercisedb/*` server-side proxy routes
- `lib/` shared types, storage helpers, rule-based planning
- `components/` UI widgets (navbar, theme toggle, cards)

Data is stored locally via `localStorage` so the MVP works offline without a backend.
