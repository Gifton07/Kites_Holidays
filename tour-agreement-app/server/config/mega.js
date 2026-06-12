const { Storage } = require("megajs")

let megaStorage = null

/** Call after a failed login so the next upload retries with a fresh Storage (e.g. after fixing .env). */
const resetMegaStorage = () => {
  megaStorage = null
}

const getMegaStorage = () => {
  if (!megaStorage) {
    if (!process.env.MEGA_EMAIL?.trim() || !process.env.MEGA_PASSWORD) {
      throw new Error("Set MEGA_EMAIL and MEGA_PASSWORD in server/.env")
    }
    megaStorage = new Storage({
      email: process.env.MEGA_EMAIL.trim(),
      password: process.env.MEGA_PASSWORD,
    })
  }
  return megaStorage
}

module.exports = { getMegaStorage, resetMegaStorage }
