# RHF MUSIC

A premium full-stack music streaming platform with dark theme, gold accents, and AI features.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/rhf-music run dev` — run the frontend (port 21276)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string
- Required env: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` — Supabase auth (optional; app works without it)
- Required env: `GEMINI_API_KEY` — Gemini AI for admin assistant + recommendations

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Tailwind v4, shadcn/ui, wouter, framer-motion, @tanstack/react-query
- API: Express 5 (port 8080, path `/api`)
- DB: PostgreSQL + Drizzle ORM
- Auth: Supabase (`@supabase/supabase-js`)
- AI: Google Gemini (`@google/generative-ai`, model `gemini-2.0-flash`)
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)
- PWA: manifest.json at `/public/manifest.json`

## Where things live

- DB schema: `lib/db/src/schema.ts`
- OpenAPI spec: `lib/api-spec/openapi.yaml`
- Generated hooks: `lib/api-client-react/src/generated/`
- API routes: `artifacts/api-server/src/routes/`
- Frontend pages: `artifacts/rhf-music/src/pages/`
- Theme: `artifacts/rhf-music/src/index.css`
- Player state: `artifacts/rhf-music/src/context/PlayerContext.tsx`
- Auth hook: `artifacts/rhf-music/src/hooks/use-auth.tsx`
- Supabase client: `artifacts/rhf-music/src/lib/supabase.ts`
- Lyrics data: `artifacts/rhf-music/src/data/lyrics.ts`
- Logo: `artifacts/rhf-music/public/rhf-logo.png`

## Architecture decisions

- Supabase handles user auth only; all other data (songs, playlists, history) lives in the project's own Postgres DB
- API hooks are generated from OpenAPI spec — run codegen after changing spec
- `supabase` client is `null` when env vars are missing; all auth-gated pages handle this gracefully
- Song import uses `Song` type from `@workspace/api-client-react` (not from the `/src/generated/` path directly)
- Admin panel requires login but no separate role check (Supabase user = admin for now)

## Product

- Home: featured hero, AI recommendations, catalog grid
- Search: real-time search with debounce (songs + playlists)
- Library: user playlists + public playlists, create playlist dialog
- Playlist detail: cover art header, song list, play all, like/unlike per song
- Liked Songs: heart-gated collection with inline unlike
- History: last 50 plays with time-ago display
- Admin: stats dashboard, song CRUD, user management, AI assistant (Gemini), broadcast notifications
- Auth: Login + Register pages (Supabase email/password)
- Bottom player bar: play/pause, seek, volume, shuffle, repeat, queue, lyrics panel, audio visualizer
- PWA: installable with manifest + standalone display

## Gotchas

- Do not import `Song` from `@workspace/api-client-react/src/generated/api.schemas` — import from `@workspace/api-client-react` directly
- Hooks with `enabled` option still require a `queryKey` in this generated client — always pass both
- `supabase.ts` validates URL format before calling `createClient` to avoid runtime crash with empty env
- `useRef<number>()` requires an initial value in TS strict mode — use `useRef<number>(0)`
- API server runs on port 8080, routed via shared proxy at `/api`

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
