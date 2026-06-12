/**
 * Same layered background as Home CTA (dark indigo + orange/violet/teal glows).
 * Use for marketing-flow pages: booking, track, confirmation.
 */
export default function DarkCtaBackdrop({ children }) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-neutral-950 via-indigo-950 to-neutral-950">
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
      <div className="relative z-10">{children}</div>
    </div>
  )
}
