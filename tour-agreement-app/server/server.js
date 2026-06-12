require("dotenv").config()
const { execSync } = require("child_process")
const fs = require("fs")
const path = require("path")

// Automatically download Chrome for Puppeteer if it does not exist in the local cache
const cachePath = path.join(__dirname, ".cache", "puppeteer")
let hasChrome = false
if (fs.existsSync(cachePath)) {
  const files = fs.readdirSync(cachePath)
  if (files.length > 0) {
    hasChrome = true
  }
}

if (!hasChrome) {
  console.log("Chrome binary not found in cache. Downloading Chrome for Puppeteer...")
  try {
    execSync("npx puppeteer browsers install chrome", { stdio: "inherit" })
    console.log("Chrome downloaded successfully!")
  } catch (err) {
    console.error("Failed to download Chrome during startup:", err.message)
  }
}

const app = require("./app")
const connectDB = require("./config/db")

const PORT = process.env.PORT || 5000

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
})