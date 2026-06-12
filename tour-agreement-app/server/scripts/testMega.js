/**
 * Verifies MEGA_EMAIL / MEGA_PASSWORD from server/.env.
 * Run from server folder: npm run test-mega
 */
require("dotenv").config()
const { getMegaStorage, resetMegaStorage } = require("../config/mega")

async function main() {
  console.log("Testing MEGA login…")
  resetMegaStorage()
  const storage = getMegaStorage()
  await storage.ready
  console.log("OK — MEGA login succeeded for:", process.env.MEGA_EMAIL?.trim())
  process.exit(0)
}

main().catch((err) => {
  console.error("\nFAILED:", err.message)
  console.error("\n→ Use the same email/password as https://mega.nz (no extra spaces in .env).")
  console.error("→ If 2FA is on, try turning it off for this account or use a dedicated MEGA account for the app.\n")
  process.exit(1)
})
