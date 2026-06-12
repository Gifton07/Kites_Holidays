const crypto = require("crypto")

const generateTrackingId = () => {
  return "TRK-" + crypto.randomBytes(4).toString("hex").toUpperCase()
}

module.exports = generateTrackingId
