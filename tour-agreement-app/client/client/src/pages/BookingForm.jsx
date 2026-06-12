import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import DarkCtaBackdrop from "../components/DarkCtaBackdrop"
import SignaturePad from "../components/SignaturePad"
import { createAgreement } from "../api/agreementApi"
import { TERMS_TITLE_ML, TERMS_ITEMS_ML } from "../constants/bookingTermsMalayalam"

const steps = ["Personal Info", "Tour Details", "Rules & Policies", "Payment & Sign"]

const Field = ({ label, children }) => (
  <div>
    <label className="form-label">{label}</label>
    {children}
  </div>
)

export default function BookingForm() {
  const navigate = useNavigate()
  const sigRef = useRef(null)
  const [step, setStep] = useState(0)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({
    name: "", phone: "", email: "", address: "",
    destination: "", startDate: "", startTime: "",
    endDate: "", arrivalTime: "",
    passengers: 1, pickupLocation: "", advancePayment: "",
  })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const inp = (k, extra = {}) => ({
    value: form[k],
    onChange: (e) => set(k, e.target.value),
    className: "form-input",
    ...extra,
  })

  const validateStep = () => {
    if (step === 0) {
      if (!form.name.trim() || !form.phone.trim() || !form.address.trim()) {
        setError("Please fill all required fields"); return false
      }
    }
    if (step === 1) {
      if (!form.destination.trim() || !form.startDate || !form.endDate || !form.pickupLocation.trim()) {
        setError("Please fill all tour fields"); return false
      }
      if (form.endDate < form.startDate) {
        setError("Arrival date must be after starting date"); return false
      }
    }
    if (step === 2) {
      if (!acceptedTerms) {
        setError("Please read the terms and confirm that you accept them to continue.")
        return false
      }
    }
    setError(""); return true
  }

  const handleNext = () => { if (validateStep()) setStep(s => s + 1) }
  const handleBack = () => { setError(""); setStep((s) => s - 1) }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const sig = sigRef.current?.getDataURL()
    if (!sig) { setError("Please provide your signature"); return }
    if (!form.advancePayment) { setError("Please enter advance payment amount"); return }

    setLoading(true)
    setError("")
    try {
      const res = await createAgreement({ ...form, signatureDataUrl: sig })
      navigate(`/confirmation/${res.data.data.trackingId}`)
    } catch {
      setError("Submission failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <DarkCtaBackdrop>
      <Navbar overlay />
      <div className="mx-auto max-w-2xl px-4 py-10">
        <div className="mb-8 text-center">
          <p className="mb-2 text-sm font-bold uppercase tracking-widest text-emerald-300/90">New booking</p>
          <h1 className="bg-gradient-to-r from-emerald-200 via-amber-100 to-teal-200 bg-clip-text text-3xl font-extrabold text-transparent md:text-4xl">
            Create Order Form
          </h1>
          <p className="mt-2 font-medium text-indigo-100/90">
            Fill in your details to book your tour with Kites Holidays
          </p>
        </div>

        {/* Step Indicator */}
        <div className="step-indicator mb-8">
          {steps.map((s, i) => (
            <span key={s} className="flex items-center" style={{ flex: i < steps.length - 1 ? "1" : "0" }}>
              <div className={`step ${i < step ? "done" : i === step ? "active" : "inactive"}`}>
                {i < step ? "✓" : i + 1}
              </div>
              {i < steps.length - 1 && <div className={`step-line ${i < step ? "done" : ""}`} />}
            </span>
          ))}
        </div>
        <p className="-mt-4 mb-8 text-center text-sm font-bold text-emerald-200/90">{steps[step]}</p>

        <div className="card-vivid p-8">
          {error && (
            <div className="bg-gradient-to-r from-rose-50 to-orange-50 border border-rose-200 text-rose-800 rounded-xl px-4 py-3 mb-6 text-sm font-medium">
              {error}
            </div>
          )}

          {/* Step 0: Personal Info */}
          {step === 0 && (
            <div className="space-y-5">
              <Field label="Full Name *">
                <input {...inp("name")} placeholder="Enter your full name" />
              </Field>
              <Field label="Phone / Contact Number *">
                <input {...inp("phone")} placeholder="+91 9999999999" />
              </Field>
              <Field label="Email (for notifications)">
                <input {...inp("email")} type="email" placeholder="you@email.com" />
              </Field>
              <Field label="Address *">
                <textarea {...inp("address")} rows={3} placeholder="Your full address" className="form-input resize-none" />
              </Field>
            </div>
          )}

          {/* Step 1: Tour Details */}
          {step === 1 && (
            <div className="space-y-5">
              <Field label="From (Pickup Location) *">
                <input {...inp("pickupLocation")} placeholder="e.g. Muvattupuzha Bus Stand" />
              </Field>
              <Field label="Destination *">
                <input {...inp("destination")} placeholder="e.g. Munnar, Goa, Coorg" />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Starting Date *">
                  <input {...inp("startDate")} type="date" />
                </Field>
                <Field label="Starting Time">
                  <input {...inp("startTime")} type="time" />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Arrival Date *">
                  <input {...inp("endDate")} type="date" />
                </Field>
                <Field label="Arrival Time">
                  <input {...inp("arrivalTime")} type="time" />
                </Field>
              </div>

              <Field label="Number of Passengers *">
                <input {...inp("passengers")} type="number" min="1" placeholder="2" />
              </Field>
            </div>
          )}

          {/* Step 2: Rules & policies (Malayalam — same as agreement PDF) */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <p className="font-['Fraunces',serif] text-lg italic text-emerald-800/90 md:text-xl">Rules &amp; policies</p>
                <h2 className="booking-terms-ml mt-2 text-2xl font-bold leading-snug text-emerald-950 md:text-[1.65rem]">
                  {TERMS_TITLE_ML}
                </h2>
                <p className="mt-2 text-xs font-medium uppercase tracking-wider text-emerald-700/75">
                  Please read carefully before continuing
                </p>
              </div>

              <div className="max-h-[min(26rem,52vh)] overflow-y-auto rounded-2xl border border-emerald-200/70 bg-gradient-to-b from-white/90 to-emerald-50/40 p-5 shadow-inner md:p-6">
                <ol className="booking-terms-ml list-decimal space-y-2.5 pl-5 text-[0.8125rem] leading-[1.62] text-slate-800 marker:font-semibold marker:text-emerald-700 md:text-[0.875rem] md:leading-[1.68]">
                  {TERMS_ITEMS_ML.map((line, i) => (
                    <li key={i} className="pl-1">
                      {line}
                    </li>
                  ))}
                </ol>
              </div>

              <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-emerald-300/60 bg-emerald-50/80 p-4 transition-colors hover:bg-emerald-50">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => {
                    setAcceptedTerms(e.target.checked)
                    setError("")
                  }}
                  className="mt-1 h-4 w-4 shrink-0 rounded border-emerald-400 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-sm font-semibold leading-snug text-emerald-950">
                  I have read and understood the above rules, regulations, and policies, and I agree to follow them for this booking.
                </span>
              </label>
            </div>
          )}

          {/* Step 3: Payment & Signature */}
          {step === 3 && (
            <div className="space-y-6">
              <Field label="Advance Payment Amount (₹) *">
                <input {...inp("advancePayment")} type="number" placeholder="5000" />
              </Field>

              <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-100 border border-amber-300/60 rounded-xl p-4 text-sm text-amber-900 font-medium">
                <strong>Note:</strong> Vehicle number and contract rate will be filled by Kites Holidays upon approval.
              </div>

              <SignaturePad ref={sigRef} label="Your Signature *" />
              <button onClick={() => sigRef.current?.clear()} type="button" className="text-xs text-gray-400 hover:text-gray-600 underline">
                Clear Signature
              </button>
            </div>
          )}

          {/* Nav buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-emerald-100/80">
            {step > 0 ? (
              <button onClick={handleBack} className="btn-secondary">← Back</button>
            ) : <div />}
            {step < 3 ? (
              <button onClick={handleNext} className="btn-primary">Continue →</button>
            ) : (
              <button onClick={handleSubmit} disabled={loading} className="btn-primary">
                {loading ? "Submitting…" : " Submit Order Form"}
              </button>
            )}
          </div>
        </div>
      </div>
    </DarkCtaBackdrop>
  )
}