const fs = require("fs")
const puppeteer = require("puppeteer")
const agreementTemplate = require("../templates/agreementTemplate")

const generatePDF = async (agreementData) => {
  const html = agreementTemplate(agreementData)

  // Clean up configured executable path if the file does not exist on this machine
  if (process.env.PUPPETEER_EXECUTABLE_PATH) {
    if (!fs.existsSync(process.env.PUPPETEER_EXECUTABLE_PATH)) {
      console.warn(`Ignoring PUPPETEER_EXECUTABLE_PATH because file not found: ${process.env.PUPPETEER_EXECUTABLE_PATH}`)
      delete process.env.PUPPETEER_EXECUTABLE_PATH
    }
  }

  const browser = await puppeteer.launch({
    headless: "new",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--no-zygote",
      "--single-process",
    ],
  })

  try {
    const page = await browser.newPage()
    /* A4 @ 96dpi ≈ 794×1123 — layout matches .sheet 210mm×297mm in template */
    await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 1 })
    await page.setContent(html, { waitUntil: "networkidle0" })
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      /* Tighter margins + slight scale help keep agreement on one page */
      margin: { top: "8mm", bottom: "8mm", left: "10mm", right: "10mm" },
      scale: 0.92,
    })
    return pdf
  } finally {
    await browser.close()
  }
}

module.exports = { generatePDF }
