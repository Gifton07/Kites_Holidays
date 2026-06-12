import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { trackAgreement } from "../api/agreementApi"
import { downloadPdfByTrackingId } from "../utils/downloadAgreementPdf"
import Navbar from "../components/Navbar"
import BackToHome from "../components/BackToHome"
import DarkCtaBackdrop from "../components/DarkCtaBackdrop"
import StatusBadge from "../components/StatusBadge"

const fmt = (d) => d ? new Date(d).toLocaleDateString("en-IN", { dateStyle: "long" }) : "—"
const Row = ({ label, value }) => (
  <div className="theme-inline-border flex justify-between border-b py-3 last:border-0">
    <span className="text-sm font-semibold text-emerald-900/80">{label}</span>
    <span className="max-w-xs text-right text-sm font-semibold text-neutral-800">{value || "—"}</span>
  </div>
)

export default function AgreementStatus() {
  const { trackingId } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [pdfDownloading, setPdfDownloading] = useState(false)

  useEffect(() => {
    trackAgreement(trackingId)
      .then(res => setData(res.data.data))
      .catch(() => setError("Agreement not found. Check your tracking ID."))
      .finally(() => setLoading(false))
  }, [trackingId])

  return (
    <DarkCtaBackdrop>
      <Navbar overlay />
      <div className="mx-auto max-w-xl px-4 py-10">
        <div className="mb-6 flex justify-center">
          <BackToHome />
        </div>
        <div className="mb-8 text-center">
          <p className="mb-1 text-sm font-bold uppercase tracking-widest text-emerald-300/90">Live update</p>
          <h1 className="bg-gradient-to-r from-emerald-200 via-amber-100 to-teal-200 bg-clip-text text-2xl font-extrabold text-transparent">
            Agreement Status
          </h1>
          <p className="mt-1 font-mono text-sm font-semibold text-indigo-100/90">{trackingId}</p>
        </div>

        {loading && <div className="py-20 text-center font-medium text-indigo-100/85">Loading…</div>}
        {error && (
          <div className="card-vivid p-8 text-center">
            <div className="text-5xl mb-4">❌</div>
            <p className="theme-page-sub font-medium">{error}</p>
            <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link to="/track" className="font-semibold text-emerald-300 hover:text-white hover:underline">
                Try again
              </Link>
              <span className="hidden text-indigo-200/50 sm:inline">·</span>
              <Link to="/" className="font-semibold text-emerald-300 hover:text-white hover:underline">
                Back to home
              </Link>
            </div>
          </div>
        )}

        {data && (
          <div className="card-vivid p-6">
            <div className="mb-6 flex items-center justify-between border-b border-emerald-100 pb-4">
              <div>
                <p className="text-xs text-cyan-700 font-bold uppercase tracking-wider">Status</p>
                <div className="mt-2"><StatusBadge status={data.status} /></div>
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold text-emerald-800/85">Submitted</p>
                <p className="text-sm font-semibold text-neutral-800">{fmt(data.createdAt)}</p>
              </div>
            </div>

            <Row label="Name" value={data.name} />
            <Row label="Destination" value={data.destination} />
            <Row label="Start Date" value={fmt(data.startDate)} />
            <Row label="End Date" value={fmt(data.endDate)} />
            <Row label="Passengers" value={data.passengers} />
            {data.vehicleName && <Row label="Vehicle" value={data.vehicleName} />}
            {data.packageRate && <Row label="Package Rate" value={`₹${Number(data.packageRate).toLocaleString("en-IN")}`} />}

            {data.status === "approved" && data.pdfUrl && (
              <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-300/60 rounded-xl text-center shadow-sm">
                <p className="text-emerald-800 font-bold mb-3">✅ Your agreement is approved!</p>
                <button
                  type="button"
                  disabled={pdfDownloading}
                  className="btn-success w-full justify-center"
                  onClick={async () => {
                    setPdfDownloading(true)
                    try {
                      await downloadPdfByTrackingId(trackingId)
                    } catch (e) {
                      alert(e.message || "Could not download PDF")
                    } finally {
                      setPdfDownloading(false)
                    }
                  }}
                >
                  {pdfDownloading ? "Preparing download…" : "📄 Download Agreement PDF"}
                </button>
              </div>
            )}

            {data.status === "rejected" && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl text-center">
                <p className="text-red-700 font-medium">Your agreement request was not approved. Please contact us for details.</p>
              </div>
            )}

            {data.status === "pending" && (
              <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-center">
                <p className="text-amber-700 font-medium">⏳ Your agreement is pending admin review. Please check back later.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </DarkCtaBackdrop>
  )
}
