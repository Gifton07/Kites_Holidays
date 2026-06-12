const mongoose = require("mongoose")
const adminSchema = require("../schemas/adminSchema")

module.exports = mongoose.model("Admin", adminSchema)
