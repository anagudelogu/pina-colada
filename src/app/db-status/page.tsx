import { prisma } from "@/lib/prisma";

async function getDbStatus() {
  const start = Date.now();
  try {
    const userCount = await prisma.user.count();
    const latency = Date.now() - start;

    const host = process.env["DATABASE_URL"]
      ?.match(/@([^/]+)\//)?.[1]
      ?.replace(/^(.{12}).*(.{20})$/, "$1***$2") ?? "unknown";

    const env =
      process.env.VERCEL_ENV ?? // "production" | "preview" | "development" on Vercel
      (process.env.NODE_ENV === "development" ? "local" : process.env.NODE_ENV);

    return { connected: true, host, env, userCount, latency, error: null };
  } catch (e) {
    return {
      connected: false,
      host: "N/A",
      env: process.env.VERCEL_ENV ?? "local",
      userCount: 0,
      latency: Date.now() - start,
      error: e instanceof Error ? e.message : String(e),
    };
  }
}

export const dynamic = "force-dynamic";

export default async function DbStatusPage() {
  const status = await getDbStatus();

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mb-6 flex items-center gap-3">
          <span
            className={`inline-block h-3 w-3 rounded-full ${
              status.connected
                ? "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.6)]"
                : "bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.6)]"
            }`}
          />
          <h1 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            Database Status
          </h1>
        </div>

        <dl className="space-y-4 text-sm">
          <Row
            label="Connection"
            value={status.connected ? "Connected" : "Failed"}
            valueClass={
              status.connected
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-red-600 dark:text-red-400"
            }
          />
          <Row label="Environment" value={status.env ?? "unknown"} />
          <Row label="Host" value={status.host} mono />
          <Row label="Latency" value={`${status.latency}ms`} />
          <Row label="User count" value={String(status.userCount)} />
          {status.error && (
            <Row
              label="Error"
              value={status.error}
              valueClass="text-red-600 dark:text-red-400"
            />
          )}
        </dl>

        <div className="mt-6 rounded-lg border border-zinc-100 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
            This page queries the database on every request (
            <code className="font-mono text-zinc-700 dark:text-zinc-300">
              force-dynamic
            </code>
            ). On Vercel, <strong>production</strong> and{" "}
            <strong>preview</strong> deployments each get their own Neon
            database branch. Locally, you connect to the{" "}
            <strong>development</strong> branch via{" "}
            <code className="font-mono text-zinc-700 dark:text-zinc-300">
              .env.local
            </code>
            .
          </p>
        </div>
      </main>
    </div>
  );
}

function Row({
  label,
  value,
  valueClass,
  mono,
}: {
  label: string;
  value: string;
  valueClass?: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-zinc-500 dark:text-zinc-400">{label}</dt>
      <dd
        className={`text-right font-medium ${mono ? "font-mono text-xs" : ""} ${
          valueClass ?? "text-zinc-900 dark:text-zinc-100"
        }`}
      >
        {value}
      </dd>
    </div>
  );
}
