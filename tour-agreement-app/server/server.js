require("dotenv").config()
const { exec } = require("child_process")
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
  console.log("Chrome binary not found in cache. Downloading Chrome for Puppeteer in the background...")
  exec(`npx puppeteer browsers install chrome@146.0.7680.153 --path "${cachePath}"`, (err, stdout, stderr) => {
    if (err) {
      console.error("Failed to download Chrome in background:", err.message)
    } else {
      console.log("Chrome downloaded successfully in background!")
    }
  })
}

const app = require("./app")
const connectDB = require("./config/db")

const PORT = process.env.PORT || 5000

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
})