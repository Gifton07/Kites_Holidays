import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import StatusBadge from "../components/StatusBadge"
import { getAgreementById, regeneratePdf, patchAgreementFinances } from "../api/agreementApi"
import { downloadPdfByAgreementId } from "../utils/downloadAgreementPdf"

const fmt = (d) => (d ? new Date(d).toLocaleDateString("en-IN", { dateStyle: "long" }) : "—")
const Row = ({ label, value }) => (
  <div className="theme-inline-border flex flex-wrap justify-between border-b py-3 last:border-0">
    <span className="w-40 text-sm font-medium text-neutral-500">{label}</span>
    <span className="flex-1 text-right text-sm font-semibold text-neutral-800">{value || "—"}</span>
  </div>
)

const rupee = (n) => (n !== undefined && n !== null && !Number.isNaN(Number(n)) ? `₹${Number(n).toLocaleString("en-IN")}` : "—")

export default function AgreementDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [regenerating, setRegenerating] = useState(false)
  const [pdfDownloading, setPdfDownloading] = useState(false)
  const [cashIn, setCashIn] = useState("")
  const [cashOut, setCashOut] = useState("")
  const [pendingCash, setPendingCash] = useState("")
  const [savingFinances, setSavingFinances] = useState(false)

  useEffect(() => {
    getAgreementById(id)
      .then((res) => setData(res.data.data))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    if (!data) return
    setCashIn(data.cashIn != null ? String(data.cashIn) : "")
    setCashOut(data.cashOut != null ? String(data.cashOut) : "")
    setPendingCash(data.pendingCash != null ? String(data.pendingCash) : "")
  }, [data])

  const pkg = data ? Number(data.packageRate) || 0 : 0
  const adv = data ? Number(data.advancePayment) || 0 : 0
  const cinNum = Number(cashIn) || 0
  const coutNum = Number(cashOut) || 0
  const suggestedPending = Math.max(0, pkg - adv - cinNum)
  const netClientSide = adv + cinNum - coutNum

  const handleSaveFinances = async (e) => {
    e.preventDefault()
    setSavingFinances(true)
    try {
      const res = await patchAgreementFinances(id, {
        cashIn: cashIn === "" ? 0 : Number(cashIn),
        cashOut: cashOut === "" ? 0 : Number(cashOut),
        pendingCash: pendingCash === "" ? 0 : Number(pendingCash),
      })
      setData(res.data.data)
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Could not save")
    } finally {
      setSavingFinances(false)
    }
  }

  const handleRegeneratePdf = async () => {
    setRegenerating(true)
    try {
      const res = await regeneratePdf(id)
      setData(res.data.data)
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Could not upload PDF")
    } finally {
      setRegenerating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col md:flex-row min-h-screen page-shell">
        <Sidebar />
        <main className="flex flex-1 items-center justify-center p-8">
          <div className="font-display animate-pulse text-2xl text-emerald-800/45">Loading…</div>
        </main>
      </div>
    )
  }
  if (!data) {
    return (
      <div className="flex flex-col md:flex-row min-h-screen page-shell">
        <Sidebar />
        <main className="flex-1 p-8">
          <p className="theme-page-sub">Not found</p>
        </main>
      </div>
    )
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen page-shell">
      <Sidebar />
      <main className="flex-1 overflow-auto p-6">
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <button type="button" onClick={() => navigate(-1)} className="theme-page-sub text-sm hover:text-emerald-900">
            ← Back
          </button>
          <h1 className="theme-page-title text-xl">Agreement Detail</h1>
          <StatusBadge status={data.status} />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Client Info */}
          <div className="card p-6">
            <h2 className="mb-4 flex items-center gap-2 font-display font-bold text-neutral-800">👤 Client Information</h2>
            <Row label="Name" value={data.name} />
            <Row label="Phone" value={data.phone} />
            <Row label="Email" value={data.email} />
            <Row label="Address" value={data.address} />
          </div>

          {/* Tour Info */}
          <div className="card p-6">
            <h2 className="mb-4 flex items-center gap-2 font-display font-bold text-neutral-800">🗺️ Tour Details</h2>
            <Row label="Destination" value={data.destination} />
            <Row label="Start Date" value={fmt(data.startDate)} />
            <Row label="End Date" value={fmt(data.endDate)} />
            <Row label="Passengers" value={data.passengers} />
            <Row label="Pickup Location" value={data.pickupLocation} />
          </div>

          {/* Payment & Admin */}
          <div className="card p-6">
            <h2 className="mb-4 flex items-center gap-2 font-display font-bold text-neutral-800">💰 Payment</h2>
            <Row label="Advance Paid" value={data.advancePayment ? `₹${Number(data.advancePayment).toLocaleString("en-IN")}` : null} />
            <Row label="Package Rate" value={data.packageRate ? `₹${Number(data.packageRate).toLocaleString("en-IN")}` : null} />
            <Row label="Vehicle" value={data.vehicleName} />
            {data.notes && (
              <div className="mt-3 rounded-lg border border-amber-200/80 bg-amber-50 p-3 text-sm text-amber-900">{data.notes}</div>
            )}
          </div>

          {/* Cash in / out / pending — admin */}
          <div className="card p-6 lg:col-span-2">
            <h2 className="mb-1 flex items-center gap-2 font-display font-bold text-neutral-800">💵 Cash &amp; balance</h2>
            <p className="mb-4 text-xs text-neutral-500">
              Track money from the client: additional cash in (after booking advance), cash out for this trip, and pending balance still to collect.
            </p>
            <div className="mb-4 grid gap-3 rounded-xl border border-emerald-100 bg-emerald-50/50 p-4 sm:grid-cols-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800/80">Package rate</p>
                <p className="text-lg font-bold text-neutral-900">{rupee(data.packageRate)}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800/80">Advance (booking)</p>
                <p className="text-lg font-bold text-neutral-900">{rupee(data.advancePayment)}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800/80">Net (advance + cash in − cash out)</p>
                <p className="text-lg font-bold text-teal-800">{rupee(netClientSide)}</p>
              </div>
            </div>
            <form onSubmit={handleSaveFinances} className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="form-label">Cash in (₹)</label>
                <input
                  type="number"
                  min={0}
                  step={1}
                  className="form-input"
                  value={cashIn}
                  onChange={(e) => setCashIn(e.target.value)}
                  placeholder="0"
                />
                <p className="mt-1 text-[11px] text-neutral-500">Payments received after advance</p>
              </div>
              <div>
                <label className="form-label">Cash out (₹)</label>
                <input
                  type="number"
                  min={0}
                  step={1}
                  className="form-input"
                  value={cashOut}
                  onChange={(e) => setCashOut(e.target.value)}
                  placeholder="0"
                />
                <p className="mt-1 text-[11px] text-neutral-500">Expenses / payouts for this trip</p>
              </div>
              <div>
                <label className="form-label">Pending from client (₹)</label>
                <input
                  type="number"
                  min={0}
                  step={1}
                  className="form-input"
                  value={pendingCash}
                  onChange={(e) => setPendingCash(e.target.value)}
                  placeholder="0"
                />
                <p className="mt-1 text-[11px] text-neutral-500">Balance still to collect</p>
              </div>
              <div className="sm:col-span-3 flex flex-wrap items-center gap-3">
                <button type="submit" disabled={savingFinances} className="btn-primary !px-5 !py-2 !text-sm">
                  {savingFinances ? "Saving…" : "Save cash fields"}
                </button>
                <button
                  type="button"
                  className="btn-secondary !px-4 !py-2 !text-sm"
                  onClick={() => setPendingCash(String(suggestedPending))}
                >
                  Set pending to suggested ({rupee(suggestedPending)})
                </button>
                <span className="text-xs text-neutral-600">
                  Suggested pending = package − advance − cash in = <strong>{rupee(suggestedPending)}</strong>
                </span>
              </div>
            </form>
          </div>

          {/* Signatures */}
          {data.signatureDataUrl && (
            <div className="card p-6">
              <h2 className="mb-4 font-display font-bold text-neutral-800">✍️ Client Signature</h2>
              <div className="theme-panel p-4">
                <img src={data.signatureDataUrl} alt="Client signature" className="mx-auto max-h-24" />
              </div>
            </div>
          )}
          {data.adminSignatureDataUrl && (
            <div className="card p-6">
              <h2 className="mb-4 font-display font-bold text-neutral-800">🖊️ Manager Signature</h2>
              <div className="theme-panel p-4">
                <img src={data.adminSignatureDataUrl} alt="Manager signature" className="mx-auto max-h-24" />
              </div>
            </div>
          )}
        </div>

        {/* PDF — same document as emailed; download is proxied via API (no MEGA redirect) */}
        {data.status === "approved" && (
          <div className="card mt-6 p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-display text-lg font-bold text-neutral-800">📄 Agreement PDF</h2>
                <p className="mt-1 text-sm text-neutral-500">
                  Download the signed order form (includes client + manager signatures).
                </p>
              </div>
              {data.pdfUrl ? (
                <button
                  type="button"
                  disabled={pdfDownloading}
                  className="btn-success shrink-0 !px-6 !py-2.5 !text-sm"
                  onClick={async () => {
                    setPdfDownloading(true)
                    try {
                      await downloadPdfByAgreementId(id, data.trackingId)
                    } catch (e) {
                      alert(e.message || "Could not download PDF")
                    } finally {
                      setPdfDownloading(false)
                    }
                  }}
                >
                  {pdfDownloading ? "Preparing…" : "Download PDF"}
                </button>
              ) : (
                <div className="flex flex-col items-stretch gap-2 sm:items-end">
                  <p className="text-left text-sm font-medium text-amber-800 sm:text-right">
                    No PDF link — usually MEGA login failed. Fix MEGA_EMAIL / MEGA_PASSWORD in server/.env, run{" "}
                    <code className="rounded bg-amber-100 px-1 text-xs">npm run test-mega</code>, restart API, then retry.
                  </p>
                  <button
                    type="button"
                    disabled={regenerating}
                    onClick={handleRegeneratePdf}
                    className="btn-primary !px-4 !py-2 !text-sm"
                  >
                    {regenerating ? "Uploading…" : "Retry PDF upload"}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Approve / Reject */}
        {data.status === "pending" && (
          <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" onClick={() => navigate(`/admin/agreement/${id}/approve`)} className="btn-success">
              ✅ Review &amp; Approve
            </button>
            <button type="button" onClick={() => navigate(`/admin/agreement/${id}/approve?action=reject`)} className="btn-danger">
              ❌ Reject
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
