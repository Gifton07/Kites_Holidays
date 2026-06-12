export default function StatCard({ icon, label, value, sub, color = "#0e7490" }) {
  return (
    <div className="stat-card">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-800/85 mb-1">{label}</p>
          <p className="text-3xl font-extrabold" style={{ color }}>{value}</p>
          {sub && <p className="text-sm text-slate-500 mt-1 font-medium">{sub}</p>}
        </div>
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-inner"
          style={{ background: `linear-gradient(145deg, ${color}22, ${color}08)` }}
        >
          {icon}
        </div>
      </div>
    </div>
  )
}
