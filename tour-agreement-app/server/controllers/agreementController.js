const asyncHandler = require("../utils/asyncHandler")
const ApiError = require("../utils/ApiError")
const Agreement = require("../models/Agreement")
const generateTrackingId = require("../utils/generateTrackingId")
const { generatePDF } = require("../services/pdfService")
const { uploadToMega, downloadBufferFromMegaUrl } = require("../services/megaService")
const { sendApprovalEmail, sendRejectionEmail } = require("../services/emailService")

// POST /api/agreements — public
exports.createAgreement = asyncHandler(async (req, res) => {
  const trackingId = generateTrackingId()
  const last = await Agreement.findOne({ orderNumber: { $gte: 500 } })
    .sort({ orderNumber: -1 })
    .select("orderNumber")
    .lean()
  const orderNumber =
    last && typeof last.orderNumber === "number" ? last.orderNumber + 1 : 500
  const agreement = await Agreement.create({ ...req.body, trackingId, orderNumber })
  res.status(201).json({ success: true, data: agreement })
})

// GET /api/agreements/track/:trackingId — public
exports.trackAgreement = asyncHandler(async (req, res) => {
  const agreement = await Agreement.findOne({ trackingId: req.params.trackingId })
  if (!agreement) return res.status(404).json({ success: false, message: "Agreement not found" })
  res.json({ success: true, data: agreement })
})

/** PDF save name: client name + date (approval date, else last update). */
const buildPdfDownloadFilename = (agreement) => {
  const raw = (agreement.name && String(agreement.name).trim()) || "Agreement"
  const safeName = raw
    .replace(/[<>:"/\\|?*\x00-\x1f]/g, "_")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80) || "Agreement"
  const d = agreement.signDate || agreement.updatedAt || agreement.createdAt || new Date()
  const date = new Date(d)
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${safeName} ${y}-${m}-${day}.pdf`
}

const setPdfAttachmentHeaders = (res, filename) => {
  const ascii = filename.replace(/[^\x20-\x7E]/g, "_")
  res.setHeader("Content-Type", "application/pdf")
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${ascii.replace(/"/g, '\\"')}"; filename*=UTF-8''${encodeURIComponent(filename)}`
  )
  res.setHeader("Cache-Control", "private, max-age=120")
}

const sendPdfBuffer = (res, buffer, agreement) => {
  const filename = buildPdfDownloadFilename(agreement)
  setPdfAttachmentHeaders(res, filename)
  res.send(buffer)
}

// GET /api/agreements/track/:trackingId/pdf — public (proxy MEGA/DB → browser download)
exports.downloadAgreementPdfPublic = asyncHandler(async (req, res, next) => {
  const { trackingId } = req.params
  const agreement = await Agreement.findOne({ trackingId })
  if (!agreement || agreement.status !== "approved") {
    return next(new ApiError(404, "PDF not available"))
  }
  // Try local database buffer first
  if (agreement.pdfBuffer) {
    return sendPdfBuffer(res, agreement.pdfBuffer, agreement)
  }
  // Fallback to MEGA share link for older agreements
  if (agreement.pdfUrl && agreement.pdfUrl.startsWith("http")) {
    try {
      const buffer = await downloadBufferFromMegaUrl(agreement.pdfUrl)
      return sendPdfBuffer(res, buffer, agreement)
    } catch (err) {
      console.error("downloadAgreementPdfPublic:", err.message)
      return next(new ApiError(502, "Could not retrieve PDF from storage"))
    }
  }
  return next(new ApiError(404, "PDF not available"))
})

// GET /api/agreements/:id/pdf-file — admin (same file, JWT required)
exports.downloadAgreementPdfAdmin = asyncHandler(async (req, res, next) => {
  const agreement = await Agreement.findById(req.params.id)
  if (!agreement || agreement.status !== "approved") {
    return next(new ApiError(404, "PDF not available"))
  }
  // Try local database buffer first
  if (agreement.pdfBuffer) {
    return sendPdfBuffer(res, agreement.pdfBuffer, agreement)
  }
  // Fallback to MEGA share link for older agreements
  if (agreement.pdfUrl && agreement.pdfUrl.startsWith("http")) {
    try {
      const buffer = await downloadBufferFromMegaUrl(agreement.pdfUrl)
      return sendPdfBuffer(res, buffer, agreement)
    } catch (err) {
      console.error("downloadAgreementPdfAdmin:", err.message)
      return next(new ApiError(502, "Could not retrieve PDF from storage"))
    }
  }
  return next(new ApiError(404, "PDF not available"))
})

// GET /api/agreements — admin
exports.getAllAgreements = asyncHandler(async (req, res) => {
  const { status } = req.query
  const filter = status ? { status } : {}
  const agreements = await Agreement.find(filter).sort({ createdAt: -1 })
  res.json({ success: true, data: agreements })
})

// GET /api/agreements/:id — admin
exports.getAgreementById = asyncHandler(async (req, res) => {
  const agreement = await Agreement.findById(req.params.id)
  if (!agreement) return res.status(404).json({ success: false, message: "Not found" })
  res.json({ success: true, data: agreement })
})

const parseMoney = (v) => {
  if (v === undefined || v === null || v === "") return undefined
  const n = Number(v)
  return Number.isFinite(n) ? n : undefined
}

// PATCH /api/agreements/:id/finances — admin (cash in / out / pending)
exports.patchAgreementFinances = asyncHandler(async (req, res, next) => {
  const agreement = await Agreement.findById(req.params.id)
  if (!agreement) return res.status(404).json({ success: false, message: "Not found" })

  const { cashIn, cashOut, pendingCash } = req.body
  const update = {}
  const cin = parseMoney(cashIn)
  const cout = parseMoney(cashOut)
  const pend = parseMoney(pendingCash)
  if (cin !== undefined) {
    if (cin < 0) return next(new ApiError(400, "cashIn cannot be negative"))
    update.cashIn = cin
  }
  if (cout !== undefined) {
    if (cout < 0) return next(new ApiError(400, "cashOut cannot be negative"))
    update.cashOut = cout
  }
  if (pend !== undefined) {
    if (pend < 0) return next(new ApiError(400, "pendingCash cannot be negative"))
    update.pendingCash = pend
  }

  if (Object.keys(update).length === 0) {
    return next(new ApiError(400, "Provide at least one of: cashIn, cashOut, pendingCash"))
  }

  const updated = await Agreement.findByIdAndUpdate(req.params.id, { $set: update }, { new: true })
  res.json({ success: true, data: updated })
})

// PATCH /api/agreements/:id/approve — admin
// Flow: save approval fields + manager signature → generate PDF → store in MongoDB → upload to MEGA (optional)
exports.approveAgreement = asyncHandler(async (req, res, next) => {
  const existing = await Agreement.findById(req.params.id)
  if (!existing) return res.status(404).json({ success: false, message: "Not found" })
  if (existing.status === "approved") {
    return next(new ApiError(400, "Agreement is already approved"))
  }
  const { vehicleName, packageRate, notes, adminSignatureDataUrl } = req.body
  if (!adminSignatureDataUrl || !String(adminSignatureDataUrl).trim()) {
    return next(new ApiError(400, "Manager signature is required"))
  }
  const agreement = await Agreement.findByIdAndUpdate(
    req.params.id,
    {
      status: "approved",
      vehicleName,
      packageRate,
      notes,
      adminSignatureDataUrl,
      signDate: new Date(),
    },
    { new: true }
  )
  if (!agreement) return res.status(404).json({ success: false, message: "Not found" })

  try {
    // 1. Generate PDF
    const pdfBuffer = await generatePDF(agreement.toObject())
    agreement.pdfBuffer = pdfBuffer
    // Set a default download link pointing to our Express server
    agreement.pdfUrl = `/api/agreements/track/${agreement.trackingId}/pdf`

    // 2. Try optional MEGA upload (do not fail if MEGA has credentials/network errors)
    try {
      const filename = `agreement-${agreement.trackingId}.pdf`
      const megaUrl = await uploadToMega(pdfBuffer, filename)
      if (megaUrl) {
        agreement.pdfUrl = megaUrl
      }
    } catch (megaErr) {
      console.warn("Optional MEGA upload failed, using local MongoDB buffer:", megaErr.message)
    }

    await agreement.save()

    // 3. Send email linking to the status track page containing the download button
    if (agreement.email) {
      const statusUrl = `https://kites-holidays.vercel.app/status/${agreement.trackingId}`
      await sendApprovalEmail({
        to: agreement.email,
        name: agreement.name,
        trackingId: agreement.trackingId,
        downloadUrl: statusUrl,
        destination: agreement.destination,
        startDate: agreement.startDate,
      }).catch(console.error)
    }
  } catch (err) {
    console.error("PDF generation or save error:", err.message, err.stack)
  }

  const fresh = await Agreement.findById(agreement._id)
  res.json({
    success: true,
    data: fresh,
  })
})

// PATCH /api/agreements/:id/reject — admin
exports.rejectAgreement = asyncHandler(async (req, res) => {
  const { notes } = req.body
  const agreement = await Agreement.findByIdAndUpdate(
    req.params.id,
    { status: "rejected", notes },
    { new: true }
  )
  if (!agreement) return res.status(404).json({ success: false, message: "Not found" })

  if (agreement.email) {
    await sendRejectionEmail({
      to: agreement.email,
      name: agreement.name,
      trackingId: agreement.trackingId,
      destination: agreement.destination,
    }).catch(console.error)
  }

  res.json({ success: true, data: agreement })
})

// POST /api/agreements/:id/regenerate-pdf — admin (retry PDF generation + MEGA upload)
exports.regeneratePdf = asyncHandler(async (req, res, next) => {
  const agreement = await Agreement.findById(req.params.id)
  if (!agreement) return res.status(404).json({ success: false, message: "Not found" })
  if (agreement.status !== "approved") {
    return next(new ApiError(400, "Only approved agreements can generate a PDF"))
  }
  try {
    const pdfBuffer = await generatePDF(agreement.toObject())
    agreement.pdfBuffer = pdfBuffer
    agreement.pdfUrl = `/api/agreements/track/${agreement.trackingId}/pdf`

    // Optional MEGA upload
    try {
      const filename = `agreement-${agreement.trackingId}.pdf`
      const megaUrl = await uploadToMega(pdfBuffer, filename)
      if (megaUrl) {
        agreement.pdfUrl = megaUrl
      }
    } catch (megaErr) {
      console.warn("Optional MEGA upload failed during regeneration:", megaErr.message)
    }

    await agreement.save()

    if (agreement.email) {
      const statusUrl = `https://kites-holidays.vercel.app/status/${agreement.trackingId}`
      await sendApprovalEmail({
        to: agreement.email,
        name: agreement.name,
        trackingId: agreement.trackingId,
        downloadUrl: statusUrl,
        destination: agreement.destination,
        startDate: agreement.startDate,
      }).catch(console.error)
    }
    res.json({ success: true, data: agreement })
  } catch (err) {
    console.error("regeneratePdf error:", err.message, err.stack)
    return next(new ApiError(502, err.message || "PDF generation failed"))
  }
})

// DELETE /api/agreements/:id — admin
exports.deleteAgreement = asyncHandler(async (req, res) => {
  await Agreement.findByIdAndDelete(req.params.id)
  res.json({ success: true, message: "Deleted" })
})
