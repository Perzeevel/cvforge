"use client";

import Link from "next/link";

const templates = [
  {
    id: "modern",
    name: "Modern",
    description:
      "A bold two-column design for professionals who want a modern look.",
    tag: "Professional",
  },
  {
    id: "executive",
    name: "Executive",
    description:
      "A polished corporate layout designed for experienced professionals.",
    tag: "Corporate",
  },
  {
    id: "minimal",
    name: "ATS Pro",
    description:
      "A clean, simple and ATS-friendly design focused on readability.",
    tag: "ATS Friendly",
  },
];

export default function TemplatesPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* NAVBAR */}
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Link
          href="/"
          className="text-2xl font-bold tracking-tight"
        >
          CVForge
        </Link>

        <Link
          href="/builder"
          className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
        >
          Open Builder
        </Link>
      </nav>

      {/* HEADER */}
      <section className="mx-auto max-w-4xl px-6 pb-14 pt-16 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
          CVForge Templates
        </p>

        <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
          Choose your style.
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-slate-400">
          Pick a professional design for your CV. You can change
          your template anytime while building.
        </p>
      </section>

      {/* TEMPLATE GRID */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid gap-8 md:grid-cols-3">
          {templates.map((template) => (
            <div
              key={template.id}
              className="group overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 transition hover:-translate-y-1 hover:border-slate-600"
            >
              {/* PREVIEW */}
              <div className="p-5">
                <div className="overflow-hidden rounded-xl bg-white shadow-xl">
                  {template.id === "modern" && (
                    <div className="grid h-80 grid-cols-[35%_65%]">
                      <div className="bg-slate-900 p-5">
                        <div className="h-12 w-12 rounded-xl bg-white" />
                        <div className="mt-6 h-3 w-20 rounded bg-slate-700" />
                        <div className="mt-4 h-2 w-24 rounded bg-slate-700" />
                        <div className="mt-2 h-2 w-16 rounded bg-slate-700" />

                        <div className="mt-10 h-2 w-14 rounded bg-slate-700" />
                        <div className="mt-3 h-2 w-20 rounded bg-slate-700" />
                        <div className="mt-2 h-2 w-16 rounded bg-slate-700" />
                      </div>

                      <div className="p-6">
                        <div className="h-4 w-32 rounded bg-slate-800" />
                        <div className="mt-4 h-2 w-full rounded bg-slate-100" />
                        <div className="mt-2 h-2 w-5/6 rounded bg-slate-100" />

                        <div className="mt-10 h-4 w-28 rounded bg-slate-800" />

                        <div className="mt-5 space-y-3">
                          <div className="h-2 w-full rounded bg-slate-100" />
                          <div className="h-2 w-11/12 rounded bg-slate-100" />
                          <div className="h-2 w-4/5 rounded bg-slate-100" />
                        </div>
                      </div>
                    </div>
                  )}

                  {template.id === "executive" && (
                    <div className="h-80 p-7">
                      <div className="flex justify-between">
                        <div>
                          <div className="h-5 w-40 rounded bg-slate-800" />
                          <div className="mt-3 h-2 w-28 rounded bg-slate-300" />
                        </div>

                        <div className="space-y-2">
                          <div className="h-2 w-20 rounded bg-slate-200" />
                          <div className="h-2 w-24 rounded bg-slate-200" />
                          <div className="h-2 w-16 rounded bg-slate-200" />
                        </div>
                      </div>

                      <div className="mt-7 h-px bg-slate-300" />

                      <div className="mt-7 h-3 w-36 rounded bg-slate-800" />

                      <div className="mt-5 space-y-2">
                        <div className="h-2 w-full rounded bg-slate-100" />
                        <div className="h-2 w-11/12 rounded bg-slate-100" />
                        <div className="h-2 w-4/5 rounded bg-slate-100" />
                      </div>

                      <div className="mt-8 h-3 w-44 rounded bg-slate-800" />

                      <div className="mt-5 space-y-2">
                        <div className="h-2 w-full rounded bg-slate-100" />
                        <div className="h-2 w-10/12 rounded bg-slate-100" />
                      </div>
                    </div>
                  )}

                  {template.id === "minimal" && (
                    <div className="h-80 p-7">
                      <div className="h-5 w-44 rounded bg-slate-800" />
                      <div className="mt-3 h-2 w-64 rounded bg-slate-200" />

                      <div className="mt-6 h-px bg-slate-300" />

                      <div className="mt-6 h-3 w-40 rounded bg-slate-800" />

                      <div className="mt-5 space-y-2">
                        <div className="h-2 w-full rounded bg-slate-100" />
                        <div className="h-2 w-full rounded bg-slate-100" />
                        <div className="h-2 w-10/12 rounded bg-slate-100" />
                      </div>

                      <div className="mt-7 h-3 w-32 rounded bg-slate-800" />

                      <div className="mt-5 grid grid-cols-3 gap-3">
                        <div className="h-2 rounded bg-slate-100" />
                        <div className="h-2 rounded bg-slate-100" />
                        <div className="h-2 rounded bg-slate-100" />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* INFO */}
              <div className="px-6 pb-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">
                    {template.name}
                  </h2>

                  <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-400">
                    {template.tag}
                  </span>
                </div>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {template.description}
                </p>

                <Link
                  href={`/builder?template=${template.id}`}
                  className="mt-6 block rounded-xl bg-white px-5 py-3 text-center text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
                >
                  Use This Template →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-800 px-6 py-8 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} CVForge
      </footer>
    </main>
  );
}