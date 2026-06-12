const express = require("express")
const agreementTemplate = require("../templates/agreementTemplate")

/** Static sample data for visual check — mirrors a typical approved order form. */
const SAMPLE_AGREEMENT = {
  name: "Milan Joseph",
  phone: "8078768278",
  address: "Manickanamparambil Chaprayil, Udayamperoor, Ernakulam, 682307",
  destination: "Goa - Dandeli - Gokarna (Train Package), Mangalore pickup and drop",
  startDate: new Date("2024-04-01T12:00:00.000Z"),
  startTime: "08:00",
  endDate: new Date("2024-04-06T12:00:00.000Z"),
  arrivalTime: "18:00",
  passengers: 38,
  pickupLocation: "Sree Narayana Gurukulam College of Engineering",
  advancePayment: 15000,
  vehicleName: "Mangaladevi",
  packageRate: 277500,
  trackingId: "TRK-PREVIEW01",
  orderNumber: 512,
  signatureDataUrl: null,
  createdAt: new Date("2024-03-07T12:00:00.000Z"),
  adminSignatureDataUrl: null,
  signDate: new Date("2024-03-07T12:00:00.000Z"),
}

const router = express.Router()

/**
 * GET /preview/agreement-template
 * Opens in the browser — same HTML as PDF generation (fonts load from Google).
 */
router.get("/agreement-template", (req, res) => {
  const html = agreementTemplate(SAMPLE_AGREEMENT)
  res.setHeader("Content-Type", "text/html; charset=utf-8")
  res.send(html)
})

module.exports = router
