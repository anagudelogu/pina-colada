# Architectural Patterns & Conventions

## Database Access — Prisma Singleton

All database access goes through a single Prisma Client instance stored on `globalThis` to prevent multiple connections during Next.js hot reload.

- **Implementation:** `src/lib/prisma.ts:7-13`
- **Usage:** Import `prisma` from `@/lib/prisma` in any server-side code
- **Adapter:** Uses `PrismaNeon` for serverless-compatible connections to Neon PostgreSQL
- **Convention:** Never instantiate `PrismaClient` directly — always use the shared singleton

## Database Configuration — Dual Connection Strings

The project uses two different connection strings for different purposes:

- **`DATABASE_URL`** — Pooled connection used at runtime by the app (`src/lib/prisma.ts:4`)
- **`DATABASE_URL_UNPOOLED`** — Direct connection used for migrations (`prisma.config.ts:13`)

This is a Neon PostgreSQL requirement: migrations need a direct connection, while the app benefits from connection pooling.

## Prisma Client Generation — Custom Output

Generated Prisma Client is output to `src/generated/prisma/` instead of `node_modules`:

- **Schema config:** `prisma/schema.prisma:8-9`
- **Generated types:** `src/generated/prisma/models/` (e.g., `User.ts`)
- **Client export:** `src/generated/prisma/client.ts`
- **Convention:** Import Prisma types from `@/generated/prisma/client`, not from `@prisma/client`

## Next.js App Router Conventions

The project uses Next.js 16 App Router (not Pages Router):

- **Route files:** `src/app/**/page.tsx` for pages, `src/app/api/**/route.ts` for API routes
- **Root layout:** `src/app/layout.tsx:20-34` — wraps all pages, loads fonts, applies global styles
- **Metadata pattern:** Export `metadata` object from layout/page files (`src/app/layout.tsx:15-18`)
- **Server Components by default:** All components are React Server Components unless marked with `"use client"`

## Font Loading

Uses `next/font/google` with CSS variables for optimized font delivery:

- **Setup:** `src/app/layout.tsx:5-13` — Geist Sans and Geist Mono fonts
- **Application:** CSS variables `--font-geist-sans` and `--font-geist-mono` applied to `<body>`
- **Theme binding:** `src/app/globals.css:11-12` — mapped to Tailwind `--font-sans` and `--font-mono`

## Styling — Tailwind CSS v4 with CSS Variables

- **Import:** `src/app/globals.css:1` — uses `@import "tailwindcss"` (v4 syntax)
- **Theme customization:** `@theme inline` block for color and font overrides (`src/app/globals.css:8-13`)
- **Dark mode:** Media query-based via `prefers-color-scheme` (`src/app/globals.css:15-20`)
- **Convention:** Use Tailwind utility classes with `dark:` variants; define custom colors as CSS variables in `:root`

## Path Aliases

TypeScript path alias `@/*` maps to `./src/*`:

- **Config:** `tsconfig.json:21-23`
- **Convention:** Always use `@/` prefix for imports from `src/` (e.g., `@/lib/prisma`, `@/generated/prisma/client`)

## Postinstall Hook — Migration + Generation

The `postinstall` script ensures the database and Prisma Client are always in sync after `pnpm install`:

- **Script:** `package.json` — `"postinstall": "prisma migrate deploy && prisma generate"`
- **Order matters:** Migrations run first, then client generation picks up any schema changes

## Environment Variables

- Stored in `.env.local` (gitignored)
- Loaded by Prisma config via `dotenv` (`prisma.config.ts:3-4`)
- Next.js auto-loads `.env.local` for runtime
- Required vars: `DATABASE_URL`, `DATABASE_URL_UNPOOLED`
