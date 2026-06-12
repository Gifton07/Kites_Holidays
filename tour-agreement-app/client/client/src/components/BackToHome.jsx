import { Link } from "react-router-dom"

/** Visible “home” escape hatch for pages without the main nav (e.g. admin login). */
export default function BackToHome({ className = "" }) {
  return (
    <Link
      to="/"
      className={`inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-200/90 transition-colors hover:text-white ${className}`}
    >
      ← Back to home
    </Link>
  )
}
