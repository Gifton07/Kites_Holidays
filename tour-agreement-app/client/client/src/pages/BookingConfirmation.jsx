import { Link, useParams } from "react-router-dom"
import Navbar from "../components/Navbar"
import DarkCtaBackdrop from "../components/DarkCtaBackdrop"

export default function BookingConfirmation() {
  const { trackingId } = useParams()

  return (
    <DarkCtaBackdrop>
      <Navbar overlay />
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <div className="card-vivid p-10">
          <div className="mb-6 inline-flex rounded-2xl bg-gradient-to-br from-amber-200 to-orange-300 p-4 text-6xl shadow-lg">
            🎉
          </div>
          <h1 className="mb-2 bg-gradient-to-r from-emerald-700 via-teal-700 to-indigo-700 bg-clip-text text-3xl font-extrabold text-transparent">
            Booking Submitted!
          </h1>
          <p className="theme-page-sub mb-8 font-medium text-slate-600">
            Your tour agreement request has been received and is pending admin review.
          </p>

          <div className="mb-8 rounded-2xl border border-emerald-200/70 bg-gradient-to-br from-emerald-50 via-amber-50/80 to-stone-100/90 p-6 shadow-inner">
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-emerald-800">Your Tracking ID</p>
            <p className="font-mono text-3xl font-bold text-emerald-950">{trackingId}</p>
            <p className="mt-2 text-xs font-medium text-emerald-800/85">Save this ID to track your agreement status</p>
          </div>

          <div className="space-y-3">
            <Link to={`/status/${trackingId}`} className="block">
              <button type="button" className="btn-primary w-full justify-center">
                🔍 Track Agreement Status
              </button>
            </Link>
            <Link to="/" className="block">
              <button type="button" className="btn-secondary w-full">
                Back to Home
              </button>
            </Link>
          </div>
        </div>
      </div>
    </DarkCtaBackdrop>
  )
}
