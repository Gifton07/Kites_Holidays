import axios from "axios"
import { BASE } from "../api/agreementApi"

function triggerBlobDownload(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

/** Prefer server-suggested name from Content-Disposition (client name + date). */
function filenameFromContentDisposition(header) {
  if (!header || typeof header !== "string") return null
  const star = /filename\*=UTF-8''([^;\n]+)/i.exec(header)
  if (star) {
    try {
      return decodeURIComponent(star[1].trim())
    } catch {
      return null
    }
  }
  const quoted = /filename="((?:[^"\\]|\\.)*)"/i.exec(header)
  if (quoted) return quoted[1].replace(/\\"/g, '"')
  const bare = /filename=([^;\n]+)/i.exec(header)
  if (bare) return bare[1].trim().replace(/^["']|["']$/g, "")
  return null
}

function pickDownloadFilename(res, fallback) {
  const cd = res.headers["content-disposition"]
  return filenameFromContentDisposition(cd) || fallback
}

/** Public: approved agreement PDF by tracking ID (no login). */
export async function downloadPdfByTrackingId(trackingId) {
  const safe = encodeURIComponent(trackingId)
  try {
    const res = await axios.get(`${BASE}/track/${safe}/pdf`, {
      responseType: "blob",
      validateStatus: (s) => s === 200,
    })
    const name = pickDownloadFilename(res, `Agreement-${trackingId}.pdf`)
    triggerBlobDownload(res.data, name)
  } catch (err) {
    const msg = await parseBlobError(err)
    throw new Error(msg || "Download failed")
  }
}

/** Admin: same PDF via Mongo agreement id (uses JWT from axios defaults). */
export async function downloadPdfByAgreementId(agreementId, trackingIdForName) {
  try {
    const res = await axios.get(`${BASE}/${agreementId}/pdf-file`, {
      responseType: "blob",
      validateStatus: (s) => s === 200,
    })
    const fallback = trackingIdForName ? `Agreement-${trackingIdForName}.pdf` : "Agreement.pdf"
    const name = pickDownloadFilename(res, fallback)
    triggerBlobDownload(res.data, name)
  } catch (err) {
    const msg = await parseBlobError(err)
    throw new Error(msg || "Download failed")
  }
}

async function parseBlobError(err) {
  if (err.response?.data instanceof Blob) {
    const text = await err.response.data.text()
    try {
      const j = JSON.parse(text)
      return j.message || text
    } catch {
      return text
    }
  }
  return err.response?.data?.message || err.message
}
