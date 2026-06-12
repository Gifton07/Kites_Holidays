import { useEffect, useState } from "react"
import Sidebar from "../components/Sidebar"
import StatCard from "../components/StatCard"
import { getSummary, getCharts } from "../api/analyticsApi"
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, Legend, LineChart, Line,
} from "recharts"

const COLORS = ["#f59e0b", "#059669", "#e11d48", "#0e7490", "#6366f1"]

const fmtInr = (n) =>
  n === undefined || n === null || Number.isNaN(Number(n))
    ? "—"
    : `₹${Number(n).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`

export default function Analytics() {
  const [summary, setSummary] = useState(null)
  const [charts, setCharts] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getSummary(), getCharts()])
      .then(([s, c]) => { setSummary(s.data.data); setCharts(c.data.data) })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col md:flex-row min-h-screen page-shell">
        <Sidebar />
        <main className="flex flex-1 items-center justify-center">
          <div className="animate-pulse text-4xl text-emerald-800/35">📊</div>
        </main>
      </div>
    )
  }

  const statusData = charts?.statusDistribution?.map(s => ({
    name: s.status.charAt(0).toUpperCase() + s.status.slice(1),
    value: s.count,
  })) || []

  return (
    <div className="flex flex-col md:flex-row min-h-screen page-shell">
      <Sidebar />
      <main className="flex-1 p-6 overflow-auto">
        <h1 className="theme-page-title mb-6 text-2xl">Analytics Dashboard</h1>

        {/* Summary */}
        {summary && (
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <StatCard icon="📋" label="Total" value={summary.total} color="#0e7490" />
            <StatCard icon="⏳" label="Pending" value={summary.pending} color="#d97706" />
            <StatCard icon="✅" label="Approved" value={summary.approved} color="#059669" />
            <StatCard icon="❌" label="Rejected" value={summary.rejected} color="#dc2626" />
            <StatCard icon="💰" label="Revenue" value={`₹${(summary.totalRevenue/1000).toFixed(0)}k`} color="#7c3aed" sub="from approved" />
          </div>
        )}

        {/* Monthly cash — advance + cash in vs cash out */}
        {charts?.monthlyCashFlow?.length ? (
          <div className="mb-8 grid gap-6 lg:grid-cols-2">
            <div className="card p-6">
              <h2 className="mb-2 font-display font-bold text-neutral-800">💵 Monthly cash in vs out (₹)</h2>
              <p className="mb-4 text-xs text-neutral-500">
                By booking month (created date). Cash in = advance at booking + extra cash in on the agreement.
              </p>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={charts.monthlyCashFlow}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                  <Tooltip
                    formatter={(v) => [fmtInr(v), ""]}
                    labelFormatter={(l) => l}
                  />
                  <Bar dataKey="totalCashIn" name="Total cash in" fill="#059669" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="cashOutTotal" name="Cash out" fill="#ea580c" radius={[4, 4, 0, 0]} />
                  <Legend />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="card p-6 overflow-hidden">
              <h2 className="mb-2 font-display font-bold text-neutral-800">📆 Monthly breakdown</h2>
              <p className="mb-3 text-xs text-neutral-500">Advance + extra cash in = total in</p>
              <div className="max-h-[280px] overflow-auto">
                <table className="w-full text-left text-xs">
                  <thead className="sticky top-0 bg-white/95 text-[10px] font-bold uppercase tracking-wide text-neutral-500">
                    <tr className="border-b border-neutral-200">
                      <th className="py-2 pr-2">Month</th>
                      <th className="py-2 pr-2 text-right">Advance</th>
                      <th className="py-2 pr-2 text-right">Cash in</th>
                      <th className="py-2 pr-2 text-right">Total in</th>
                      <th className="py-2 text-right">Cash out</th>
                    </tr>
                  </thead>
                  <tbody>
                    {charts.monthlyCashFlow.map((row) => (
                      <tr key={row.month} className="border-b border-neutral-100 hover:bg-emerald-50/40">
                        <td className="py-2 pr-2 font-medium text-neutral-800">{row.month}</td>
                        <td className="py-2 pr-2 text-right tabular-nums">{fmtInr(row.advanceTotal)}</td>
                        <td className="py-2 pr-2 text-right tabular-nums">{fmtInr(row.cashInTotal)}</td>
                        <td className="py-2 pr-2 text-right font-semibold text-emerald-800 tabular-nums">
                          {fmtInr(row.totalCashIn)}
                        </td>
                        <td className="py-2 text-right text-amber-900 tabular-nums">{fmtInr(row.cashOutTotal)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : null}

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Monthly Bookings */}
          <div className="card p-6">
            <h2 className="mb-4 font-display font-bold text-neutral-800">📅 Monthly Bookings</h2>
            {charts?.monthlyBookings?.length ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={charts.monthlyBookings}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#0e7490" radius={[4, 4, 0, 0]} name="Bookings" />
                </BarChart>
              </ResponsiveContainer>
            ) : <EmptyChart />}
          </div>

          {/* Monthly Revenue */}
          <div className="card p-6">
            <h2 className="mb-4 font-display font-bold text-neutral-800">💰 Monthly Revenue (₹)</h2>
            {charts?.monthlyRevenue?.length ? (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={charts.monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v) => [`₹${Number(v).toLocaleString("en-IN")}`, "Revenue"]} />
                  <Line type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={2.5} dot={{ fill: "#f59e0b" }} />
                </LineChart>
              </ResponsiveContainer>
            ) : <EmptyChart />}
          </div>

          {/* Status Pie */}
          <div className="card p-6">
            <h2 className="mb-4 font-display font-bold text-neutral-800">🥧 Agreement Status</h2>
            {statusData.length ? (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={statusData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : <EmptyChart />}
          </div>

          {/* Vehicle Usage */}
          <div className="card p-6">
            <h2 className="mb-4 font-display font-bold text-neutral-800">🚗 Vehicle Usage</h2>
            {charts?.vehicleStats?.length ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={charts.vehicleStats} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis dataKey="vehicle" type="category" tick={{ fontSize: 11 }} width={120} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} name="Trips" />
                </BarChart>
              </ResponsiveContainer>
            ) : <EmptyChart />}
          </div>
        </div>
      </main>
    </div>
  )
}

function EmptyChart() {
  return <div className="flex h-44 items-center justify-center text-sm text-neutral-400">No data yet</div>
}
