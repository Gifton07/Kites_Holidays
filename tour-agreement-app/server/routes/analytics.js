const express = require("express")
const router = express.Router()
const { protect } = require("../middleware/authMiddleware")
const { getSummary, getCharts } = require("../controllers/analyticsController")

router.get("/summary", protect, getSummary)
router.get("/charts", protect, getCharts)

module.exports = router
