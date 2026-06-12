import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import DarkCtaBackdrop from "../components/DarkCtaBackdrop"

export default function TrackAgreement() {
  const [trackingId, setTrackingId] = useState("")
  const navigate = useNavigate()

  const handle = (e) => {
    e.preventDefault()
    if (trackingId.trim()) navigate(`/status/${trackingId.trim().toUpperCase()}`)
  }

  return (
    <DarkCtaBackdrop>
      <Navbar overlay />
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-violet-700 text-4xl text-white shadow-xl shadow-emerald-500/25">
          🔍
        </div>
        <p className="mb-2 text-sm font-bold uppercase tracking-widest text-emerald-300/90">Status</p>
        <h1 className="mb-2 bg-gradient-to-r from-emerald-200 via-amber-100 to-teal-200 bg-clip-text text-3xl font-extrabold text-transparent">
          Track Your Agreement
        </h1>
        <p className="mb-10 font-medium text-indigo-100/90">
          Enter your tracking ID to check the status of your tour agreement
        </p>

        <div className="card-vivid p-8">
          <form onSubmit={handle} className="space-y-4">
            <div>
              <label className="form-label">Tracking ID</label>
              <input
                className="form-input text-center font-mono text-lg uppercase"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                placeholder="TRK-XXXXXXXX"
                required
              />
            </div>
            <button type="submit" className="btn-primary w-full justify-center">
              Track Now →
            </button>
          </form>
        </div>
      </div>
    </DarkCtaBackdrop>
  )
}
