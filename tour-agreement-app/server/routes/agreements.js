const express = require("express")
const router = express.Router()
const { protect } = require("../middleware/authMiddleware")
const {
  createAgreement,
  getAllAgreements,
  getAgreementById,
  trackAgreement,
  downloadAgreementPdfPublic,
  downloadAgreementPdfAdmin,
  approveAgreement,
  rejectAgreement,
  regeneratePdf,
  deleteAgreement,
  patchAgreementFinances,
} = require("../controllers/agreementController")

router.post("/", createAgreement)
router.get("/track/:trackingId", trackAgreement)
router.get("/track/:trackingId/pdf", downloadAgreementPdfPublic)
router.get("/", protect, getAllAgreements)
router.post("/:id/regenerate-pdf", protect, regeneratePdf)
router.get("/:id/pdf-file", protect, downloadAgreementPdfAdmin)
router.patch("/:id/finances", protect, patchAgreementFinances)
router.get("/:id", protect, getAgreementById)
router.patch("/:id/approve", protect, approveAgreement)
router.patch("/:id/reject", protect, rejectAgreement)
router.delete("/:id", protect, deleteAgreement)

module.exports = router
