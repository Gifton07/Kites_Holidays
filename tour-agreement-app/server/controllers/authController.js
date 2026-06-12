const asyncHandler = require("../utils/asyncHandler")
const Admin = require("../models/Admin")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const ApiError = require("../utils/ApiError")

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" })

exports.login = asyncHandler(async (req, res, next) => {
  const email = String(req.body.email || "")
    .trim()
    .toLowerCase()
  const password = req.body.password
  if (!email || !password) return next(new ApiError(400, "Email and password required"))

  const admin = await Admin.findOne({ email }).select("+password")
  if (!admin || !(await bcrypt.compare(password, admin.password)))
    return next(new ApiError(401, "Invalid credentials"))

  const token = signToken(admin._id)
  res.json({ success: true, token })
})

exports.getMe = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.admin.id)
  res.json({ success: true, data: admin })
})
