# Developer Guide

## Stack

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- Supabase PostgreSQL, Auth, and Storage

## Local Setup

Required tools:

- Node.js 20+
- npm 10+

Install and run:

```bash
npm install
npm run dev
```

## Environment Variables

Create `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Engineering Rules

- read `docs/` before major changes
- keep route handlers thin
- keep database logic in repositories
- keep business logic in services
- log every write action
- preserve `organization_id` boundaries everywhere

## Supabase Client Usage

- browser client for interactive UI
- server client for session-aware server components and actions
- admin client for privileged internal operations

Never expose the service role key to client code.
