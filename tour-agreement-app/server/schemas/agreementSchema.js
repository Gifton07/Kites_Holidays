const { Schema } = require("mongoose")

const agreementSchema = new Schema(
  {
    // ── Client Fields ─────────────────────────────────────
    name:            { type: String, required: true },
    phone:           { type: String, required: true },   // Contact Number
    email:           { type: String },
    address:         { type: String, required: true },
    destination:     { type: String, required: true },
    startDate:       { type: Date,   required: true },
    startTime:       { type: String },                   // e.g. "08:00 AM"
    endDate:         { type: Date,   required: true },   // Arrival Date
    arrivalTime:     { type: String },                   // e.g. "06:00 PM"
    passengers:      { type: Number, required: true },
    pickupLocation:  { type: String, required: true },   // From
    signatureDataUrl:{ type: String },                   // Client signature

    // ── System Generated ──────────────────────────────────
    /** Sequential order no. for PDF (starts at 500); distinct from trackingId */
    orderNumber: { type: Number },
    trackingId: { type: String, unique: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    // ── Admin Fields (filled on approval) ─────────────────
    advancePayment:      { type: Number },   // Advance amount paid
    packageRate:         { type: Number },   // Contract Rate Rs
    vehicleName:         { type: String },   // Vehicle / fleet label (approval form)
    vehicleNo:           { type: String },   // Vehicle registration number
    adminSignatureDataUrl: { type: String }, // Manager signature
    signDate:            { type: Date },     // Date agreement is approved
    notes:               { type: String },   // Optional admin notes

    // ── Cash tracking (admin) ─────────────────────────────
    /** Total cash received from client (in addition to booking advance, or full in-hand total — admin use) */
    cashIn:              { type: Number },
    /** Cash paid out / expenses for this agreement */
    cashOut:             { type: Number },
    /** Balance still to collect from client (pending due) */
    pendingCash:         { type: Number },

    // ── Generated ─────────────────────────────────────────
    /** Public MEGA download link for the generated PDF */
    pdfUrl: { type: String },
  },
  { timestamps: true }
)

module.exports = agreementSchema
