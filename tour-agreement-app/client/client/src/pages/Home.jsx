import { Link } from "react-router-dom"
import Navbar from "../components/Navbar"
import { HERO_MESH_LAYERS, HERO_NOISE_DATA_URL } from "../constants/heroMesh"

const features = [
  {
    icon: "📝",
    title: "Easy Booking",
    desc: "Step-by-step form — your tour details in one flow.",
    bar: "from-emerald-400 to-teal-600",
    soft: "bg-emerald-50/80",
    num: "text-emerald-700",
  },
  {
    icon: "✍️",
    title: "Digital Signature",
    desc: "Sign agreements on screen. No print, no chase.",
    bar: "from-violet-400 to-fuchsia-600",
    soft: "bg-violet-50/80",
    num: "text-violet-600",
  },
  {
    icon: "🔍",
    title: "Live Tracking",
    desc: "Use your tracking ID anytime to see where things stand.",
    bar: "from-amber-400 to-orange-500",
    soft: "bg-amber-50/80",
    num: "text-amber-700",
  },
  {
    icon: "📄",
    title: "Instant PDF",
    desc: "Approved agreements land in your inbox as a clean PDF.",
    bar: "from-emerald-400 to-teal-600",
    soft: "bg-emerald-50/80",
    num: "text-emerald-700",
  },
]

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Single mesh stack + glass nav — avoids double gradient / nav–hero mismatch */}
      <section className="relative overflow-hidden bg-neutral-950">
        <div className="absolute inset-0 opacity-[0.95]" style={{ background: HERO_MESH_LAYERS }} />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(0,0,0,0.45))]" />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{ backgroundImage: HERO_NOISE_DATA_URL }}
        />

        <Navbar overlay />

        <div className="relative z-20 mx-auto max-w-5xl px-6 pb-28 pt-4 text-center md:pb-36 md:pt-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-gradient-to-r from-emerald-500/20 to-teal-900/10 px-4 py-1.5 text-[13px] font-medium tracking-wide text-neutral-200 backdrop-blur-md hero-badge-in">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shadow-[0_0_14px_rgba(251,191,36,0.9)]" />
            Trusted by 500+ travelers
          </div>

          <h1 className="font-display relative isolate mt-8 text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl md:leading-[1.08]">
            <span className="hero-title-line relative z-10 block">Plan your trip.</span>
            <span className="hero-gradient-shift relative z-20 mt-1 block bg-gradient-to-r from-emerald-200 via-amber-100 to-teal-200 bg-[length:200%_auto] bg-clip-text text-transparent">
              Seal it digitally.
            </span>
          </h1>

          <p className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-neutral-300 md:text-lg">
            Book tours &amp; packages with Kites Holidays - clear agreements, fast turnaround, zero paperwork stress.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link to="/book">
              <button
                type="button"
                className="font-display inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-300 to-orange-400 px-7 py-3.5 text-[15px] font-semibold text-neutral-900 shadow-lg shadow-orange-500/25 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:scale-[1.02] hover:brightness-105 hover:shadow-xl hover:shadow-orange-500/40 active:translate-y-0 active:scale-[0.99]"
              >
                Create agreement
                <span aria-hidden className="text-lg">
                  →
                </span>
              </button>
            </Link>
            <Link to="/track">
              <button
                type="button"
                className="font-display rounded-2xl border border-emerald-400/45 bg-emerald-500/15 px-7 py-3.5 text-[15px] font-medium text-emerald-50 backdrop-blur-sm transition-all duration-200 ease-out hover:-translate-y-0.5 hover:scale-[1.02] hover:border-emerald-300/70 hover:bg-emerald-500/28 hover:shadow-lg hover:shadow-emerald-900/30 active:translate-y-0 active:scale-[0.99]"
              >
                Track status
              </button>
            </Link>
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-0 h-28 bg-gradient-to-t from-stone-50 via-stone-50/80 to-transparent" />
      </section>

      {/* Features */}
      <section className="relative z-10 -mt-8 px-6 pb-20">
        <div className="mx-auto max-w-6xl rounded-[2rem] border border-emerald-200/45 bg-gradient-to-br from-[#f6faf7] via-emerald-50/45 to-amber-50/55 p-8 shadow-[0_24px_80px_-20px_rgba(6,95,70,0.1)] backdrop-blur-xl transition-[box-shadow,border-color] duration-300 ease-out hover:border-emerald-300/50 hover:shadow-[0_32px_90px_-16px_rgba(6,95,70,0.14)] md:p-12">
          <div className="mb-12 text-center md:flex md:items-end md:justify-between md:gap-8 md:text-left">
            <div>
              <p className="font-display bg-gradient-to-r from-teal-600 to-indigo-600 bg-clip-text text-xs font-semibold uppercase tracking-[0.2em] text-transparent">
                How it works
              </p>
              <h2 className="font-display mt-2 text-3xl font-semibold tracking-tight text-neutral-900 md:text-4xl">
                Four steps.{" "}
                <span className="bg-gradient-to-r from-emerald-600 to-teal-800 bg-clip-text text-transparent">
                  One smooth ride.
                </span>
              </h2>
            </div>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-neutral-600 md:mt-0 md:text-right">
              Built for travelers who want clarity - from first click to signed PDF.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            {features.map((f, i) => (
              <article
                key={f.title}
                className={`group relative flex flex-col overflow-hidden rounded-2xl border border-stone-100 ${f.soft} p-6 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-emerald-200/80 hover:bg-[#f4faf7] hover:shadow-xl hover:shadow-emerald-200/40 active:-translate-y-0.5`}
              >
                <div className={`h-1 w-12 rounded-full bg-gradient-to-r ${f.bar} mb-1 opacity-90 transition-transform duration-300 group-hover:scale-x-110`} />
                <span className="font-display mt-3 text-2xl transition-transform duration-300 ease-out group-hover:scale-110">{f.icon}</span>
                <h3 className="font-display mt-3 text-lg font-semibold tracking-tight text-neutral-900">{f.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-neutral-600">{f.desc}</p>
                <span className={`mt-5 font-mono text-[11px] font-semibold ${f.num}`}>0{i + 1}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-24">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-indigo-900/50 bg-gradient-to-br from-neutral-950 via-indigo-950 to-neutral-950 px-8 py-14 text-center transition-[box-shadow,border-color] duration-300 ease-out hover:border-indigo-500/40 hover:shadow-[0_24px_60px_-12px_rgba(99,102,241,0.25)] md:px-16 md:py-16">
          <div
            className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full opacity-50 blur-3xl"
            style={{ background: "radial-gradient(circle, #f97316 0%, transparent 65%)" }}
          />
          <div
            className="pointer-events-none absolute -bottom-20 -left-12 h-64 w-64 rounded-full opacity-45 blur-3xl"
            style={{ background: "radial-gradient(circle, #6366f1 0%, transparent 65%)" }}
          />
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30 blur-3xl"
            style={{ background: "radial-gradient(circle, #14b8a6 0%, transparent 65%)" }}
          />
          <div className="relative z-10">
            <h2 className="font-display text-2xl font-semibold tracking-tight text-white md:text-3xl">
              Ready when you are
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-indigo-100/90 md:text-base">
              Start your booking - we&apos;ll handle the agreement side so you can focus on the itinerary.
            </p>
            <Link to="/book" className="mt-8 inline-block">
              <button
                type="button"
                className="font-display rounded-2xl bg-gradient-to-r from-amber-300 to-orange-400 px-8 py-3.5 text-[15px] font-semibold text-neutral-900 shadow-lg shadow-orange-500/30 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:scale-[1.02] hover:brightness-105 hover:shadow-xl hover:shadow-orange-500/45 active:translate-y-0 active:scale-[0.99]"
              >
                Get started
              </button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="relative overflow-hidden border-t border-white/10 bg-neutral-950">
        <div className="absolute inset-0 opacity-[0.95]" style={{ background: HERO_MESH_LAYERS }} />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(0,0,0,0.45))]" />
        <div className="absolute inset-0 opacity-[0.35]" style={{ backgroundImage: HERO_NOISE_DATA_URL }} />
        <div className="relative z-10 mx-auto max-w-5xl px-6 py-8 text-neutral-300 md:py-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between md:gap-10">
            <div className="text-center md:text-left">
              <p className="font-display text-lg font-semibold tracking-tight text-white sm:text-xl md:text-2xl">
                Kites Holidays
              </p>
              <p className="mt-3 text-sm leading-relaxed text-neutral-300 sm:text-base md:max-w-md">
                Near ICICI Bank Velloor Kunnam
                <br />
                Signal Jn, Muvattupuzha
              </p>
            </div>
            <div className="flex flex-col items-center gap-2 text-center text-sm sm:text-base md:items-end md:text-right">
              <a
                href="tel:+919446328857"
                className="font-medium text-neutral-200 transition-colors hover:text-emerald-200"
              >
                Mob: 9446328857
              </a>
              <a
                href="mailto:kitesholidaysklr@gmail.com"
                className="max-w-[min(100%,20rem)] break-words text-neutral-200 transition-colors hover:text-emerald-200"
              >
                kitesholidaysklr@gmail.com
              </a>
            </div>
          </div>
          <div className="mt-8 border-t border-white/10 pt-6 text-center">
            <p className="text-sm text-neutral-400 md:text-base">
              © {new Date().getFullYear()} Kites Holidays - Tours &amp; Packages
            </p>
            <Link
              to="/admin"
              className="mt-2 inline-block text-xs font-medium tracking-wide text-neutral-500 transition-colors hover:text-emerald-400/90"
            >
              Staff login
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
