require("dotenv").config()
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const Admin = require("../models/Admin")
const connectDB = require("../config/db")

/** Defaults — override with ADMIN_EMAIL / ADMIN_PASSWORD in server/.env */
const EMAIL = (process.env.ADMIN_EMAIL || "adim@gmail.com").trim().toLowerCase()
const PASSWORD = process.env.ADMIN_PASSWORD || "Admin123"

const createAdmin = async () => {
  await connectDB()
  const hashed = await bcrypt.hash(PASSWORD, 12)

  const admin = await Admin.findOneAndUpdate(
    { email: EMAIL },
    { name: "Admin", email: EMAIL, password: hashed },
    { upsert: true, setDefaultsOnInsert: true, returnDocument: "after" }
  )

  console.log(`Admin ready: ${admin.email}`)
  console.log("Use this email + your ADMIN_PASSWORD (default: Admin123) at /admin")
  await mongoose.disconnect().catch(() => {})
  process.exit(0)
}

createAdmin().catch((err) => {
  console.error(err)
  process.exit(1)
})
