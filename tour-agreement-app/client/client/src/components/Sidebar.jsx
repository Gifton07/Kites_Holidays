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

  const handleLogout = () => {
    logout()
    navigate("/admin")
  }

  return (
    <aside className="relative flex min-h-screen w-64 flex-col overflow-hidden border-r border-white/10 bg-neutral-950">
      <div className="absolute inset-0 opacity-[0.95]" style={{ background: HERO_MESH_LAYERS }} />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,transparent,rgba(0,0,0,0.35))]" />
      <div className="absolute inset-0 opacity-[0.35]" style={{ backgroundImage: HERO_NOISE_DATA_URL }} />

      <div className="relative z-10 border-b border-emerald-400/25 p-5">
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
      </div>

      <nav className="relative z-10 flex-1 space-y-1 p-4">
        {links.map(({ to, icon, label }) => (
          <Link key={to} to={to} className={`sidebar-link ${pathname.startsWith(to) ? "active" : ""}`}>
            <span>{icon}</span> {label}
          </Link>
        ))}
        <Link
          to="/"
          className="sidebar-link mt-3 border-t border-emerald-400/20 pt-3 text-emerald-100/95 hover:text-white"
        >
          <span>🏠</span> Back to website
        </Link>
      </nav>

      <div className="relative z-10 border-t border-emerald-400/25 p-4">
        <p className="mb-3 px-4 text-xs text-emerald-200/75">Near ICICI Bank, Muvattupuzha</p>
        <button type="button" onClick={handleLogout} className="sidebar-link w-full text-red-300 hover:text-red-200">
          <span>🚪</span> Logout
        </button>
      </div>
    </aside>
  )
}
