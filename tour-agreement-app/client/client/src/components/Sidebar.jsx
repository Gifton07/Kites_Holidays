import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { HERO_MESH_LAYERS, HERO_NOISE_DATA_URL } from "../constants/heroMesh"

const links = [
  { to: "/admin/dashboard", icon: "📋", label: "Orders" },
  { to: "/admin/analytics", icon: "📊", label: "Analytics" },
]

export default function Sidebar() {
  const { pathname } = useLocation()
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate("/admin")
  }

  return (
    <>
      {/* Mobile Top Bar */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-white/10 bg-neutral-950 px-4 py-3 md:hidden">
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="Kites Holidays"
            className="h-9 w-auto max-w-[120px] shrink-0 object-contain object-left"
          />
          <div>
            <p className="bg-gradient-to-r from-emerald-200 via-amber-50 to-teal-200 bg-clip-text text-xs font-extrabold leading-tight text-transparent">
              KITES HOLIDAYS
            </p>
            <p className="text-[10px] font-semibold text-amber-200/90">Admin Panel</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-lg border border-emerald-400/30 bg-emerald-500/10 p-2 text-white hover:bg-emerald-500/20 active:scale-95 transition-all"
          aria-label="Toggle menu"
        >
          <span className="text-xl">{isOpen ? "✕" : "☰"}</span>
        </button>
      </header>

      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-neutral-950/70 backdrop-blur-sm md:hidden transition-opacity duration-300"
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col overflow-hidden border-r border-white/10 bg-neutral-950 transition-transform duration-300 ease-in-out md:static md:translate-x-0 md:min-h-screen ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="absolute inset-0 opacity-[0.95]" style={{ background: HERO_MESH_LAYERS }} />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,transparent,rgba(0,0,0,0.35))]" />
        <div className="absolute inset-0 opacity-[0.35]" style={{ backgroundImage: HERO_NOISE_DATA_URL }} />

        <div className="relative z-10 border-b border-emerald-400/25 p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="Kites Holidays"
                className="h-12 w-auto max-w-[168px] shrink-0 object-contain object-left drop-shadow-lg"
              />
              <div>
                <p className="bg-gradient-to-r from-emerald-200 via-amber-50 to-teal-200 bg-clip-text text-sm font-extrabold leading-tight text-transparent">
                  KITES HOLIDAYS
                </p>
                <p className="text-xs font-semibold text-amber-200/90">Admin Panel</p>
              </div>
            </div>
            {/* Close button inside drawer for mobile */}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-1.5 text-emerald-200 hover:bg-white/10 md:hidden"
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>
        </div>

        <nav className="relative z-10 flex-1 space-y-1 p-4">
          {links.map(({ to, icon, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setIsOpen(false)}
              className={`sidebar-link ${pathname.startsWith(to) ? "active" : ""}`}
            >
              <span>{icon}</span> {label}
            </Link>
          ))}
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="sidebar-link mt-3 border-t border-emerald-400/20 pt-3 text-emerald-100/95 hover:text-white"
          >
            <span>🏠</span> Back to website
          </Link>
        </nav>

        <div className="relative z-10 border-t border-emerald-400/25 p-4">
          <p className="mb-3 px-4 text-xs text-emerald-200/75">Near ICICI Bank, Muvattupuzha</p>
          <button
            type="button"
            onClick={handleLogout}
            className="sidebar-link w-full text-left text-red-300 hover:text-red-200"
          >
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>
    </>
  )
}
