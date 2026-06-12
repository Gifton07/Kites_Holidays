export default function StatusBadge({ status }) {
  const map = {
    pending:  { label: "Pending",  cls: "badge-pending" },
    approved: { label: "Approved", cls: "badge-approved" },
    rejected: { label: "Rejected", cls: "badge-rejected" },
  }
  const { label, cls } = map[status] || { label: status, cls: "badge-pending" }
  return (
    <span className={`${cls} px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide`}>
      {label}
    </span>
  )
}
