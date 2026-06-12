import { useEffect, useState, useRef } from "react"
import { useParams, useNavigate, useSearchParams } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import SignaturePad from "../components/SignaturePad"
import { getAgreementById, approveAgreement, rejectAgreement } from "../api/agreementApi"
import { downloadPdfByAgreementId } from "../utils/downloadAgreementPdf"

const fmt = (d) => d ? new Date(d).toLocaleDateString("en-IN", { dateStyle: "long" }) : "—"

export default function ApprovalPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const defaultAction = params.get("action") === "reject" ? "reject" : "approve"

  const adminSigRef = useRef(null)
  const [agreement, setAgreement] = useState(null)
  const [form, setForm] = useState({ vehicleName: "", packageRate: "", notes: "" })
  const [action, setAction] = useState(defaultAction)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    getAgreementById(id)
      .then(res => setAgreement(res.data.data))
      .finally(() => setFetching(false))
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (action === "approve") {
        if (!form.vehicleName || !form.packageRate) { alert("Enter vehicle name and package rate"); setLoading(false); return }
        const adminSignatureDataUrl = adminSigRef.current?.getDataURL()
        if (!adminSignatureDataUrl) { alert("Please sign as manager — required on the PDF"); setLoading(false); return }
        const res = await approveAgreement(id, { ...form, adminSignatureDataUrl })
        if (res.data?.pdfError) {
          alert(
            `Approved, but PDF was not uploaded to MEGA and no link was saved.\n\n${res.data.pdfError}\n\nFix MEGA_EMAIL / MEGA_PASSWORD in server/.env, run: npm run test-mega (in server folder), then restart the API.`
          )
        }
      } else {
        await rejectAgreement(id, { notes: form.notes })
      }
      navigate(`/admin/agreement/${id}`)
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || err.message))
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="flex min-h-screen page-shell">
        <Sidebar />
        <main className="flex flex-1 items-center justify-center p-8">
          <div className="font-display animate-pulse text-2xl text-emerald-800/45">Loading…</div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen page-shell">
      <Sidebar />
      <main className="flex-1 overflow-auto p-6">
        <div className="mb-6 flex items-center gap-4">
          <button type="button" onClick={() => navigate(-1)} className="theme-page-sub text-sm hover:text-emerald-900">
            ← Back
          </button>
          <h1 className="theme-page-title text-xl">Review Agreement</h1>
        </div>

        {agreement?.status === "approved" && (
          <div className="mb-6 flex flex-col gap-3 rounded-xl border border-emerald-200 bg-emerald-50/90 p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-medium text-emerald-900">This agreement is already approved.</p>
            <div className="flex flex-wrap gap-2">
              {agreement.pdfUrl && (
                <button
                  type="button"
                  disabled={pdfDownloading}
                  className="btn-success shrink-0 !px-4 !py-2 !text-sm"
                  onClick={async () => {
                    setPdfDownloading(true)
                    try {
                      await downloadPdfByAgreementId(id, agreement.trackingId)
                    } catch (e) {
                      alert(e.message || "Could not download PDF")
                    } finally {
                      setPdfDownloading(false)
                    }
                  }}
                >
                  {pdfDownloading ? "Preparing…" : "Download PDF"}
                </button>
              )}
              <button type="button" onClick={() => navigate(`/admin/agreement/${id}`)} className="btn-secondary !px-4 !py-2 !text-sm">
                Full detail
              </button>
            </div>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Agreement Preview */}
          {agreement && (
            <div className="card p-6">
              <h2 className="mb-4 font-display font-bold text-neutral-800">📋 Agreement Preview</h2>
              <div className="space-y-2 text-sm">
                {[
                  ["Client", agreement.name],
                  ["Phone", agreement.phone],
                  ["Destination", agreement.destination],
                  ["Start Date", fmt(agreement.startDate)],
                  ["End Date", fmt(agreement.endDate)],
                  ["Passengers", agreement.passengers],
                  ["Pickup", agreement.pickupLocation],
                  ["Advance Paid", agreement.advancePayment ? `₹${Number(agreement.advancePayment).toLocaleString("en-IN")}` : "—"],
                ].map(([l, v]) => (
                  <div key={l} className="theme-inline-border flex justify-between border-b py-2">
                    <span className="theme-page-sub">{l}</span>
                    <span className="font-medium text-neutral-800">{v}</span>
                  </div>
                ))}
              </div>
              {agreement.signatureDataUrl && (
                <div className="theme-panel mt-4 p-4">
                  <p className="mb-2 text-xs font-semibold uppercase text-neutral-500">Client Signature</p>
                  <img src={agreement.signatureDataUrl} alt="Client" className="max-h-20" />
                </div>
              )}
              {agreement.adminSignatureDataUrl && (
                <div className="theme-panel mt-4 p-4">
                  <p className="mb-2 text-xs font-semibold uppercase text-neutral-500">Manager Signature</p>
                  <img src={agreement.adminSignatureDataUrl} alt="Manager" className="max-h-20" />
                </div>
              )}
            </div>
          )}

          {/* Action Form */}
          {agreement?.status !== "approved" ? (
          <div className="card p-6">
            <h2 className="mb-4 font-display font-bold text-neutral-800">Admin Action</h2>

            {/* Toggle */}
            <div className="theme-inline-border mb-6 flex overflow-hidden rounded-xl border">
              <button type="button" onClick={() => setAction("approve")} className={`flex-1 py-3 text-sm font-semibold transition-colors ${action === "approve" ? "bg-green-600 text-white" : "bg-[var(--surface)] theme-page-sub hover:bg-teal-50"}`}>
                ✅ Approve
              </button>
              <button type="button" onClick={() => setAction("reject")} className={`flex-1 py-3 text-sm font-semibold transition-colors ${action === "reject" ? "bg-red-600 text-white" : "bg-[var(--surface)] theme-page-sub hover:bg-teal-50"}`}>
                ❌ Reject
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {action === "approve" && (
                <>
                  <div>
                    <label className="form-label">Vehicle Name *</label>
                    <input className="form-input" value={form.vehicleName} onChange={e => setForm(f => ({ ...f, vehicleName: e.target.value }))} placeholder="e.g. Toyota Innova, Tempo Traveller" />
                  </div>
                  <div>
                    <label className="form-label">Package Rate (₹) *</label>
                    <input className="form-input" type="number" value={form.packageRate} onChange={e => setForm(f => ({ ...f, packageRate: e.target.value }))} placeholder="25000" />
                  </div>
                  <div>
                    <SignaturePad ref={adminSigRef} label="Manager signature (appears on PDF) *" />
                    <button
                      type="button"
                      onClick={() => adminSigRef.current?.clear()}
                      className="mt-1 text-xs text-neutral-500 underline hover:text-neutral-700"
                    >
                      Clear signature
                    </button>
                  </div>
                  <p className="text-xs text-neutral-500">
                    A PDF will be generated with client + manager signatures and uploaded for the customer to download.
                  </p>
                </>
              )}
              <div>
                <label className="form-label">Notes / Remarks</label>
                <textarea className="form-input resize-none" rows={4} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Any additional notes for the client…" />
              </div>
              <button type="submit" disabled={loading} className={action === "approve" ? "btn-success w-full justify-center" : "btn-danger w-full justify-center"}>
                {loading ? "Processing…" : action === "approve" ? "✅ Approve & Generate PDF" : "❌ Reject Agreement"}
              </button>
            </form>
          </div>
          ) : (
            <div className="card flex flex-col justify-center p-8 text-center">
              <p className="text-sm text-neutral-600">Use the dashboard or full detail to review this agreement.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
