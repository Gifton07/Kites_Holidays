const mega = require("megajs")
const { getMegaStorage, resetMegaStorage } = require("../config/mega")

/**
 * Upload a buffer to the MEGA account from .env (MEGA_EMAIL / MEGA_PASSWORD).
 * Returns a public download URL (e.g. https://mega.nz/file/...).
 */
const uploadToMega = async (buffer, filename) => {
  try {
    const storage = getMegaStorage()
    await storage.ready

    const file = await new Promise((resolve, reject) => {
      storage.upload({ name: filename, size: buffer.length }, buffer, (err, uploaded) => {
        if (err) return reject(err)
        resolve(uploaded)
      })
    })

    return file.link()
  } catch (err) {
    resetMegaStorage()
    const msg = err.message || String(err)
    if (/password|ENOENT|not found|login/i.test(msg)) {
      throw new Error(
        `MEGA login/upload failed: ${msg}. Check MEGA_EMAIL and MEGA_PASSWORD in server/.env (correct mega.nz account; 2FA may block API login). Run: npm run test-mega`
      )
    }
    throw err
  }
}

/**
 * Download file bytes from a public MEGA share link (same format as uploadToMega returns).
 * Does not require account login — uses the link key in the URL hash.
 */
const downloadBufferFromMegaUrl = async (shareUrl) => {
  if (!shareUrl || typeof shareUrl !== "string") {
    throw new Error("Invalid MEGA URL")
  }
  const file = mega.File.fromURL(shareUrl.trim())
  return file.downloadBuffer({})
}

module.exports = { uploadToMega, downloadBufferFromMegaUrl }
