const express = require("express")
const cors = require("cors")
const errorHandler = require("./middleware/errorHandler")

const agreementRoutes = require("./routes/agreements")
const authRoutes = require("./routes/auth")
const analyticsRoutes = require("./routes/analytics")
const previewRoutes = require("./routes/preview")

const app = express()

app.use(cors())
app.use(express.json())

// Routes
app.use("/api/agreements", agreementRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/analytics", analyticsRoutes)
app.use("/preview", previewRoutes)

// Error handler (must be last)
app.use(errorHandler)

module.exports = app
