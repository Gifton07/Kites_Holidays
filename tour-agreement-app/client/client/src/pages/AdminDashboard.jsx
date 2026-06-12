import { useEffect, useState } from "react"
import Sidebar from "../components/Sidebar"
import AgreementTable from "../components/AgreementTable"
import StatCard from "../components/StatCard"
import { getAllAgreements, deleteAgreement } from "../api/agreementApi"
import { getSummary } from "../api/analyticsApi"

const TABS = ["All", "Pending", "Approved", "Rejected"]

export default function AdminDashboard() {
  const [agreements, setAgreements] = useState([])
  const [summary, setSummary] = useState(null)
  const [tab, setTab] = useState("All")
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    setLoading(true)
    const status = tab === "All" ? null : tab.toLowerCase()
    const [agRes, sumRes] = await Promise.all([
      getAllAgreements(status),
      getSummary(),
    ])
    setAgreements(agRes.data.data)
    setSummary(sumRes.data.data)
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [tab])

  const handleDelete = async (id) => {
    if (!confirm("Delete this agreement?")) return
    await deleteAgreement(id)
    fetchData()
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen page-shell">
      <Sidebar />
      <main className="flex-1 p-6 overflow-auto">
        <h1 className="theme-page-title mb-6 bg-gradient-to-r from-emerald-800 via-teal-700 to-indigo-700 bg-clip-text text-2xl font-extrabold text-transparent">
          Dashboard
        </h1>

        {/* Stats */}
        {summary && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard icon="📋" label="Total" value={summary.total} color="#0e7490" />
            <StatCard icon="⏳" label="Pending" value={summary.pending} color="#ea580c" />
            <StatCard icon="✅" label="Approved" value={summary.approved} color="#059669" />
            <StatCard icon="❌" label="Rejected" value={summary.rejected} color="#e11d48" />
          </div>
        )}
        {summary?.totalRevenue > 0 && (
          <div className="card-vivid p-4 mb-6 flex items-center gap-4 border-amber-200/50">
            <span className="text-3xl">💰</span>
            <div>
              <p className="text-xs text-amber-800/80 font-bold uppercase tracking-wider">Total Revenue</p>
              <p className="text-2xl font-extrabold text-amber-900">₹{Number(summary.totalRevenue).toLocaleString("en-IN")}</p>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="card overflow-hidden">
          <div className="flex items-center gap-0 border-b border-emerald-100 px-2 pt-2 bg-gradient-to-r from-emerald-50/60 to-transparent">
            {TABS.map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`border-b-2 px-5 py-3 text-sm font-bold transition-colors ${tab === t ? "border-emerald-600 text-emerald-900" : "border-transparent theme-page-sub hover:text-emerald-800"}`}
              >
                {t}
              </button>
            ))}
            <button type="button" onClick={fetchData} className="ml-auto mr-2 mb-2 text-xs font-semibold text-emerald-800 hover:text-emerald-950">
              ↻ Refresh
            </button>
          </div>
          <div className="p-4">
            {loading ? (
              <div className="py-16 text-center text-4xl text-emerald-600/35 animate-pulse">⏳</div>
            ) : (
              <AgreementTable agreements={agreements} onDelete={handleDelete} />
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
