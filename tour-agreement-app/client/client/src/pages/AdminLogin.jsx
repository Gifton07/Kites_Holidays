import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import BackToHome from "../components/BackToHome"
import { HERO_MESH_LAYERS, HERO_NOISE_DATA_URL } from "../constants/heroMesh"

export default function AdminLogin() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: "", password: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      await login(form.email, form.password)
      navigate("/admin/dashboard")
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-neutral-950">
      <div className="absolute inset-0 opacity-[0.95]" style={{ background: HERO_MESH_LAYERS }} />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(0,0,0,0.45))]" />
      <div className="absolute inset-0 opacity-[0.35]" style={{ backgroundImage: HERO_NOISE_DATA_URL }} />

      <div className="relative z-20 shrink-0 px-4 pt-5 sm:px-6">
        <BackToHome />
      </div>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 pb-12">
        <div className="flex w-full max-w-sm flex-col">
        <div className="mb-8 text-center">
          
          <h1 className="font-display text-2xl font-extrabold text-white drop-shadow">Admin Login</h1>
          <p className="mt-1 text-sm font-medium text-emerald-200/90">Tour Agreement System</p>
        </div>

        <div className="card-vivid p-8 shadow-2xl">
          {error && (
            <div className="mb-5 rounded-xl border border-red-200/80 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="form-label" htmlFor="admin-email">
                Email
              </label>
              <input
                id="admin-email"
                className="form-input"
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="........com"
                required
              />
            </div>
            <div>
              <label className="form-label" htmlFor="admin-password">
                Password
              </label>
              <input
                id="admin-password"
                className="form-input"
                type="password"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                placeholder="••••••••"
                required
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
              {loading ? "Logging in…" : "🔐 Login"}
            </button>
          </form>
        </div>
        </div>
      </div>
    </div>
  )
}
