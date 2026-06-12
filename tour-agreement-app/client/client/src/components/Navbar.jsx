import { Link } from "react-router-dom"
import { HERO_MESH_LAYERS, HERO_NOISE_DATA_URL } from "../constants/heroMesh"

/** Staggered per-character fade; `baseIndex` continues the wave across lines */
function NavBrandLine({ text, className, baseIndex = 0, staggerSec = 0.058 }) {
  const chars = Array.from(text)
  return (
    <p className={className}>
      {chars.map((ch, i) => (
        <span
          key={`${baseIndex}-${i}`}
          className="nav-brand-letter"
          style={{ animationDelay: `${(baseIndex + i) * staggerSec}s` }}
        >
          {ch === " " ? "\u00A0" : ch}
        </span>
      ))}
    </p>
  )
}

/**
 * overlay: sit on top of a parent that already renders HERO_MESH_LAYERS + noise (e.g. Home hero).
 * Fixed full-width bar + spacer; appearance stays the same while scrolling (no width or color shift).
 */
export default function Navbar({ overlay = false }) {
  const overlayClasses =
    "bg-neutral-950/[0.42] shadow-[inset_0_-1px_0_0_rgba(255,255,255,0.06)] backdrop-blur-xl backdrop-saturate-150 supports-[backdrop-filter]:bg-neutral-950/35"

  return (
    <>
      <nav
        className={`fixed inset-x-0 top-0 z-50 border-b border-white/10 ${overlay ? overlayClasses : ""}`}
      >
        <div className={`relative overflow-hidden ${overlay ? "" : "bg-neutral-950"}`}>
          {!overlay && (
            <>
              <div className="absolute inset-0 opacity-[0.95]" style={{ background: HERO_MESH_LAYERS }} />
              <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(0,0,0,0.4))]" />
              <div className="absolute inset-0 opacity-[0.35]" style={{ backgroundImage: HERO_NOISE_DATA_URL }} />
            </>
          )}
          <div className="relative z-10 flex items-center justify-between px-6 py-3.5">
            <Link to="/" className="group flex items-center gap-3">
              <img
                src="/logo.png"
                alt="Kites Holidays"
                className="h-14 w-auto max-w-[220px] shrink-0 object-contain object-left drop-shadow-md transition-transform group-hover:scale-[1.02] sm:h-16 sm:max-w-[260px]"
              />
              <div className="hidden min-[380px]:block" aria-hidden="true">
                <NavBrandLine
                  text="KITES HOLIDAYS"
                  baseIndex={0}
                  className="font-display text-[15px] font-semibold leading-tight tracking-tight text-white"
                />
                <NavBrandLine
                  text="Tours & Packages"
                  baseIndex={14}
                  className="text-[11px] font-medium uppercase tracking-[0.12em] text-amber-200/85"
                />
              </div>
            </Link>
            <div className="flex items-center gap-2 sm:gap-4">
              <Link
                to="/"
                className="text-sm font-medium text-emerald-200/90 transition-colors hover:text-white"
              >
                Home
              </Link>
              <Link
                to="/track"
                className="text-sm font-medium text-emerald-200/90 transition-colors hover:text-white"
              >
                Track
              </Link>
              <Link to="/book">
                <button
                  type="button"
                  className="font-display btn-primary !rounded-2xl !px-5 !py-2.5 !text-sm !font-semibold shadow-md"
                >
                  Book now
                </button>
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <div className="h-[5.5rem] w-full shrink-0" aria-hidden />
    </>
  )
}
