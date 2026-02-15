# Pina Colada

Next.js 16 full-stack starter with Prisma ORM, Neon PostgreSQL, and Tailwind CSS v4. Deployed on Vercel.

## Tech Stack

- **Framework:** Next.js 16 (App Router) + React 19
- **Language:** TypeScript (strict mode)
- **ORM:** Prisma 7 with `@prisma/adapter-neon`
- **Database:** Neon PostgreSQL (serverless)
- **Styling:** Tailwind CSS v4 with CSS variables for theming
- **Package Manager:** pnpm
- **Linting:** ESLint (Next.js + Prettier config)
- **Formatting:** Prettier (config in `.prettierrc`)

## Project Structure

```
src/
├── app/              # Next.js App Router (pages, layouts, API routes)
│   ├── api/          # API route handlers (route.ts files)
│   ├── layout.tsx    # Root layout (fonts, metadata, global styles)
│   ├── page.tsx      # Home page
│   └── globals.css   # Tailwind imports + CSS variable theme
├── generated/prisma/ # Auto-generated Prisma Client & types (DO NOT EDIT)
└── lib/
    └── prisma.ts     # Prisma Client singleton — all DB access goes through here
prisma/
├── schema.prisma     # Database schema (models defined here)
└── migrations/       # Migration history
```

## Commands

| Command             | Description             |
| ------------------- | ----------------------- |
| `pnpm dev`          | Start dev server        |
| `pnpm build`        | Production build        |
| `pnpm start`        | Start production server |
| `pnpm lint`         | Run ESLint              |
| `pnpm format`       | Format with Prettier    |
| `pnpm format:check` | Check formatting        |

Avoid running the dev server, as I'm already running it.

### Prisma Commands

| Command                      | Description                            |
| ---------------------------- | -------------------------------------- |
| `pnpm prisma migrate dev`    | Create + apply migration (development) |
| `pnpm prisma migrate deploy` | Apply pending migrations (production)  |
| `pnpm prisma generate`       | Regenerate client after schema changes |

## Key Conventions

- **Imports:** Use `@/` path alias for all `src/` imports (e.g., `@/lib/prisma`)
- **Prisma types:** Import from `@/generated/prisma/client`, NOT `@prisma/client`
- **DB access:** Always use the singleton from `src/lib/prisma.ts:9-10`, never instantiate `PrismaClient` directly
- **Components:** Server Components by default; add `"use client"` only when needed
- **Env vars:** Stored in `.env.local` (gitignored). Required: `DATABASE_URL`, `DATABASE_URL_UNPOOLED`

## MCP & Tools

- **Context7 MCP:** Always use Context7 (`resolve-library-id` then `query-docs`) when you need library/API documentation, code generation, setup or configuration steps — do not wait for an explicit request.
- **Vercel MCP:** Available for deployment, logs, and project management.

## Skills

- **React Best Practices:** Use `/vercel-react-best-practices` when writing, reviewing, or refactoring React/Next.js code for performance optimization.
- **Composition Patterns:** Use `/vercel-composition-patterns` when designing component APIs, refactoring prop-heavy components, or building reusable compound components.

## Additional Documentation

Check these files for deeper context when relevant:

| File                                     | When to check                                                                                   |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `.claude/docs/architectural_patterns.md` | Database access patterns, Prisma conventions, font loading, styling architecture, env var setup |
