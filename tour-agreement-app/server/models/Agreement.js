const mongoose = require("mongoose")
const agreementSchema = require("../schemas/agreementSchema")

module.exports = mongoose.model("Agreement", agreementSchema)
