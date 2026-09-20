"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Navigation */}
      <nav className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/" className="text-2xl font-black tracking-tight">
            CV<span className="text-blue-500">Forge</span>
          </Link>

          <Link
            href="/builder"
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold transition hover:bg-blue-500"
          >
            Build My CV
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 pb-24 pt-20 md:pb-32 md:pt-28">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-300">
          Smart CV Builder
          </div>

          <h1 className="text-5xl font-black leading-tight tracking-tight md:text-7xl">
          Build a professional CV
<span className="block text-blue-500">
  in minutes.
</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-400 md:text-xl">
              Create a professional CV in minutes.
              Choose your design, add your experience, check your ATS match,
              and prepare your CV for your next application.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/builder"
              className="rounded-2xl bg-blue-600 px-8 py-4 text-base font-bold shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-500"
            >
              Create My CV →
            </Link>

            <a
              href="#features"
              className="rounded-2xl border border-white/15 px-8 py-4 text-base font-bold text-slate-200 transition hover:bg-white/5"
            >
              See Features
            </a>
          </div>
        </div>

        {/* CV Preview */}
        <div className="mx-auto mt-20 max-w-5xl">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-3 shadow-2xl shadow-blue-950/30">
            <div className="rounded-2xl bg-white p-6 text-slate-900 md:p-10">
              <div className="flex flex-col justify-between gap-6 border-b border-slate-200 pb-6 sm:flex-row">
                <div>
                  <div className="text-3xl font-black">Alex Morgan</div>
                  <div className="mt-1 font-semibold text-blue-600">
                    Civil Engineer
                  </div>
                </div>

                <div className="text-sm text-slate-500 sm:text-right">
                  alex@email.com
                  <br />
                  +95 9 123 456 789
                  <br />
                  Yangon, Myanmar
                </div>
              </div>

              <div className="grid gap-8 pt-8 md:grid-cols-[1fr_2fr]">
                <div>
                  <h3 className="mb-3 text-xs font-black uppercase tracking-widest text-blue-600">
                    Skills
                  </h3>

                  <div className="space-y-2 text-sm text-slate-600">
                    <div>Project Management</div>
                    <div>AutoCAD</div>
                    <div>Site Supervision</div>
                    <div>Microsoft Office</div>
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-xs font-black uppercase tracking-widest text-blue-600">
                    Professional Experience
                  </h3>

                  <div className="text-lg font-bold">
                    Senior Civil Engineer
                  </div>

                  <div className="mt-1 text-sm font-semibold text-slate-500">
                    ABC Construction · 2022 — Present
                  </div>

                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    Managed construction projects, coordinated subcontractors,
                    reviewed technical drawings, and maintained quality and
                    safety standards across multiple sites.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="border-t border-white/10 bg-slate-900/60 px-6 py-20 md:py-28"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <div className="text-sm font-bold uppercase tracking-widest text-blue-400">
              Everything you need
            </div>

            <h2 className="mt-3 text-3xl font-black md:text-5xl">
              Create a better CV, faster.
            </h2>

            <p className="mt-4 text-slate-400">
              Simple tools designed to help you create a professional CV
              without spending hours formatting documents.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            <FeatureCard
  icon="✨"
  title="Professional Templates"
  description="Choose from Modern, Executive, and Minimal templates designed for professional applications."
/>

<FeatureCard
  icon="🎯"
  title="ATS Analysis"
  description="Compare your CV with a job description, see matched and missing keywords, and get improvement recommendations."
/>

<FeatureCard
  icon="🎨"
  title="Customize & Manage"
  description="Customize colors, edit your CV, save multiple versions, rename them, and export your CV as PDF."
/>
          </div>
        </div>
      </section>

      {/* Why CVForge */}
<section className="px-6 py-20">
  <div className="mx-auto max-w-7xl">
    <div className="grid gap-10 md:grid-cols-2 md:items-center">

      <div>
        <div className="text-sm font-bold uppercase tracking-widest text-blue-400">
          Why CVForge?
        </div>

        <h2 className="mt-3 text-3xl font-black leading-tight md:text-5xl">
          Stop spending hours
          <span className="block text-blue-500">
            formatting your CV.
          </span>
        </h2>

        <p className="mt-5 max-w-xl leading-7 text-slate-400">
          CVForge gives you the tools to build a professional CV,
          customize it for different jobs, and check how well it matches
          a job description.
        </p>
      </div>

      <div className="space-y-4">
        <WhyItem
          number="01"
          title="Build Faster"
          description="Enter your information once and create a polished CV without complicated formatting."
        />

<WhyItem
  number="02"
  title="Check Your Match"
  description="Compare your CV with a job description and identify matched and missing keywords."
/>

<WhyItem
  number="03"
  title="Stay Organized"
  description="Save multiple CV versions, rename them, switch between them, and keep your applications organized."
/>
</div>

    </div>
  </div>
</section>

{/* Pricing */}
<section className="border-t border-white/10 bg-slate-900/40 px-6 py-20 md:py-28">
  <div className="mx-auto max-w-6xl">

    <div className="mx-auto max-w-2xl text-center">
      <div className="text-sm font-bold uppercase tracking-widest text-blue-400">
        Simple Pricing
      </div>

      <h2 className="mt-3 text-3xl font-black md:text-5xl">
        Start free. Upgrade when you need more.
      </h2>

      <p className="mt-4 text-slate-400">
        Create your CV for free and unlock more powerful features with Pro.
      </p>
    </div>

    <div className="mx-auto mt-14 grid max-w-4xl gap-6 md:grid-cols-2">

      {/* Free */}
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
        <div className="text-sm font-bold uppercase tracking-widest text-slate-400">
          Free
        </div>

        <div className="mt-4 text-4xl font-black">
          $0
          <span className="text-base font-medium text-slate-500">
            {" "}forever
          </span>
        </div>

        <p className="mt-3 text-slate-400">
          Everything you need to create your first professional CV.
        </p>

        <div className="mt-8 space-y-4 text-sm text-slate-300">
  <div>✓ Everything in Free</div>
  <div>✓ AI CV tailoring</div>
  <div>✓ Advanced ATS optimization</div>
  <div>✓ More CV customization</div>
  <div>✓ Premium templates</div>
  <div>✓ New Pro features as they launch</div>
</div>

        <Link
          href="/builder"
          className="mt-8 block rounded-xl border border-white/15 px-5 py-3 text-center font-bold transition hover:bg-white/5"
        >
          Start Free
        </Link>
      </div>

      {/* Pro */}
      <div className="relative rounded-3xl border border-blue-500/40 bg-blue-600/10 p-8 shadow-xl shadow-blue-950/20">

      <div className="absolute right-6 top-6 rounded-full bg-blue-600 px-3 py-1 text-xs font-bold">
  MOST POPULAR
</div>

        <div className="text-sm font-bold uppercase tracking-widest text-blue-400">
          Pro
        </div>

        <div className="mt-4 text-4xl font-black">
          $9
          <span className="text-base font-medium text-slate-500">
            {" "}/ month
          </span>
        </div>

        <p className="mt-3 text-slate-400">
        Advanced tools for job seekers who want more from their CV.        </p>

        <div className="mt-8 space-y-4 text-sm text-slate-300">
          <div>✓ Everything in Free</div>
          <div>✓ AI CV tailoring</div>
          <div>✓ Advanced ATS optimization</div>
          <div>✓ Unlimited CVs</div>
          <div>✓ Premium templates</div>
          <div>✓ Priority features</div>
        </div>

        <button
          type="button"
          className="mt-8 block w-full rounded-xl bg-blue-600 px-5 py-3 font-bold transition hover:bg-blue-500"
          onClick={() => {
            alert("Pro membership will be available soon.");
          }}
        >
          Upgrade to Pro
        </button>
      </div>

    </div>
  </div>
</section>

      {/* CTA */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-4xl rounded-3xl border border-blue-500/20 bg-blue-600/10 px-6 py-16 text-center">
          <h2 className="text-3xl font-black md:text-5xl">
            Your next opportunity starts here.
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-slate-400">
            Build your professional CV and take the next step toward your
            career goals.
          </p>

          <Link
            href="/builder"
            className="mt-8 inline-block rounded-2xl bg-blue-600 px-8 py-4 font-bold transition hover:bg-blue-500"
          >
            Start Building — It&apos;s Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 text-sm text-slate-500 sm:flex-row">
          <div>© 2026 CVForge. All rights reserved.</div>
          <div>Build smarter. Apply stronger.</div>
        </div>
      </footer>
    </main>
  );
}

function WhyItem({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-5 rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600/10 text-sm font-black text-blue-400">
        {number}
      </div>

      <div>
        <h3 className="font-bold">{title}</h3>

        <p className="mt-1 text-sm leading-6 text-slate-400">
          {description}
        </p>
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-7 transition hover:-translate-y-1 hover:bg-white/[0.07]">
      <div className="text-3xl">{icon}</div>

      <h3 className="mt-5 text-xl font-bold">{title}</h3>

      <p className="mt-3 leading-7 text-slate-400">
        {description}
      </p>
    </div>
  );
}