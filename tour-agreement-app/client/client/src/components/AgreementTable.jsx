import { Link } from "react-router-dom"
import StatusBadge from "./StatusBadge"

const fmt = (d) => d ? new Date(d).toLocaleDateString("en-IN") : "—"

export default function AgreementTable({ agreements, onDelete }) {
  if (!agreements?.length) {
    return (
      <div className="text-center py-16 text-gray-400">
        <div className="text-5xl mb-4">📭</div>
        <p className="font-medium">No agreements found</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            {["Tracking ID", "Name", "Destination", "Start Date", "Status", "Actions"].map((h) => (
              <th key={h} className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider text-gray-400">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {agreements.map((a) => (
            <tr key={a._id} className="border-b border-emerald-100/70 hover:bg-emerald-50/45 transition-colors">
              <td className="py-3 px-4 font-mono text-xs text-blue-700 font-semibold">{a.trackingId}</td>
              <td className="py-3 px-4 font-medium text-gray-800">{a.name}</td>
              <td className="py-3 px-4 text-gray-600">{a.destination}</td>
              <td className="py-3 px-4 text-gray-600">{fmt(a.startDate)}</td>
              <td className="py-3 px-4"><StatusBadge status={a.status} /></td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <Link to={`/admin/agreement/${a._id}`} className="text-blue-600 hover:underline font-medium text-xs">View</Link>
                  {a.status === "pending" && (
                    <Link to={`/admin/agreement/${a._id}/approve`} className="text-green-600 hover:underline font-medium text-xs">Approve</Link>
                  )}
                  {onDelete && (
                    <button onClick={() => onDelete(a._id)} className="text-red-500 hover:underline font-medium text-xs">Delete</button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
