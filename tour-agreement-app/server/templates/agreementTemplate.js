const fs = require("fs")
const path = require("path")

/** Prefer logo.jpeg; fall back to other common names in this folder. */
const getLogoBase64 = () => {
  const candidates = ["logo.jpeg", "logo.jpg", "kites-logo.png", "logo.png"]
  for (const name of candidates) {
    const logoPath = path.join(__dirname, name)
    if (fs.existsSync(logoPath)) {
      const ext = path.extname(name).toLowerCase()
      const mime = ext === ".png" ? "image/png" : "image/jpeg"
      const data = fs.readFileSync(logoPath)
      return `data:${mime};base64,${data.toString("base64")}`
    }
  }
  return null
}

const agreementTemplate = (data) => {
  const {
    name, phone, address, destination,
    startDate, startTime, endDate, arrivalTime,
    passengers, pickupLocation,
    advancePayment, vehicleName, packageRate,
    trackingId, orderNumber, signatureDataUrl, createdAt,
    adminSignatureDataUrl,
    signDate,
  } = data

  const logoBase64 = getLogoBase64()

  /** PDF “No:” — prefer numeric order (500+); fallback: trackingId for older records */
  const n = Number(orderNumber)
  const orderNoDisplay =
    orderNumber != null && orderNumber !== "" && !Number.isNaN(n)
      ? String(Math.floor(n))
      : trackingId || "—"

  const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" }) : "—"
  const formattedDate = new Date(createdAt || Date.now()).toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" })
  const managerDateStr = signDate ? fmtDate(signDate) : formattedDate

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Order Form - ${orderNoDisplay}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=Outfit:wght@500;600;700&family=Noto+Serif+Malayalam:wght@400;600;700&display=swap" rel="stylesheet">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  /* A4: 210mm × 297mm — agreement page matches standard paper */
  @page {
    size: A4;
    margin: 0;
  }
  body {
    font-family: "DM Sans", system-ui, -apple-system, sans-serif;
    font-optical-sizing: auto;
    background: #f1f5f9;
    padding: 0;
    margin: 0;
    color: #0f172a;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    min-height: 297mm;
  }
  .sheet {
    position: relative;
    width: 210mm;
    max-width: 100%;
    min-height: 297mm;
    margin: 0 auto;
    background: #ffffff;
    box-sizing: border-box;
    overflow: hidden;
  }
  /* Centered logo watermark — same asset as header; does not block interaction */
  .watermark {
    position: absolute;
    left: 50%;
    top: 40%;
    transform: translate(-50%, -50%);
    z-index: 0;
    pointer-events: none;
    user-select: none;
    opacity: 0.6;
    width: 820px;
    max-width: 85%;
  }
  .watermark img {
    width: 100%;
    height: auto;
    display: block;
    object-fit: contain;
    object-position: center;
  }
  .container {
    max-width: 100%;
    margin: 0 auto;
    padding: 0 14px 10px;
    box-sizing: border-box;
    position: relative;
    z-index: 1;
  }

  /* HEADER — full page width */
  .header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
    width: 100%;
    box-sizing: border-box;
    padding: 10px 14px 8px;
    margin: 0;
    border-bottom: 2px solid #0e7490;
    box-shadow: 0 6px 14px -8px rgba(14, 116, 144, 0.35);
    position: relative;
    z-index: 1;
    background: #ffffff;
  }
  .header-left {
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .logo {
    height: 52px;
    width: auto;
    max-width: 160px;
    object-fit: contain;
    object-position: left center;
  }
  .logo-placeholder {
    height: 52px;
    width: 52px;
    background: linear-gradient(145deg, #0e7490, #155e75);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: "Outfit", sans-serif;
    font-size: 22px;
    font-weight: 800;
    color: white;
  }
  .company-name {
    font-family: "Outfit", "DM Sans", sans-serif;
    font-size: 18px;
    font-weight: 700;
    color: #0c4a6e;
    letter-spacing: 0.04em;
    line-height: 1.15;
  }
  .company-sub {
    font-size: 9px;
    color: #64748b;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    margin-top: 4px;
  }
  .contact {
    text-align: right;
    font-size: 9.5px;
    color: #475569;
    line-height: 1.65;
    max-width: 240px;
  }
  .contact strong {
    color: #0e7490;
    font-weight: 600;
  }

  /* TITLE — No. left (red), ORDER FORM centered */
  .title-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 8px;
    gap: 8px;
    min-height: 28px;
  }
  .title-no-col {
    flex: 1;
    min-width: 0;
  }
  .title-no-col--spacer {
    visibility: hidden;
    pointer-events: none;
    user-select: none;
  }
  .title-no-inner {
    font-family: "DM Sans", sans-serif;
    font-size: 12px;
    font-weight: 600;
    color: #334155;
  }
  .order-no-red {
    color: #dc2626;
    font-weight: 800;
    font-variant-numeric: tabular-nums;
  }
  .title-main {
    flex: 0 0 auto;
    font-family: "Outfit", sans-serif;
    font-size: 15px;
    font-weight: 700;
    color: #0f172a;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    text-align: center;
  }
  .date {
    text-align: right;
    font-size: 10.5px;
    color: #475569;
    margin-top: 4px;
    font-weight: 500;
  }

  /* FIELDS — single bottom border per row, no extra underline under values */
  .section {
    margin-top: 10px;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    overflow: hidden;
    background: rgba(250, 250, 250, 0.72);
  }
  .field {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    padding: 5px 10px;
    font-size: 11.5px;
    color: #1e293b;
    background: rgba(255, 255, 255, 0.78);
    border-bottom: 1px solid #e8eef4;
    min-height: 0;
  }
  .field:last-child { border-bottom: none; }
  .field:nth-child(even) { background: rgba(248, 250, 252, 0.78); }
  .field strong {
    color: #0e7490;
    min-width: 128px;
    max-width: 128px;
    flex-shrink: 0;
    font-weight: 600;
    font-size: 10.8px;
    padding-top: 1px;
    line-height: 1.25;
  }
  .field-value {
    flex: 1;
    font-weight: 600;
    line-height: 1.3;
    word-break: break-word;
    border: none;
    padding: 0;
    min-height: 0;
  }
  .field-split {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    align-items: start;
  }
  .field-split .pair {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
  }
  .field-split .pair .lbl {
    font-size: 9px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: #0e7490;
  }
  .field-split .pair .val {
    font-size: 11.5px;
    font-weight: 600;
    color: #0f172a;
    line-height: 1.4;
    word-break: break-word;
  }

  /* TERMS — Malayalam + banner */
  .terms {
    margin-top: 22px;
    border: 1px solid #cbd5e1;
    border-radius: 12px;
    overflow: hidden;
    background: rgba(248, 250, 252, 0.82);
  }
  .terms-banner {
    background: linear-gradient(135deg, #0f172a 0%, #134e4a 45%, #0e7490 100%);
    color: #fff;
    text-align: center;
    padding: 11px 14px;
    font-family: "Noto Serif Malayalam", "DM Sans", serif;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0.02em;
  }
  .terms ol {
    padding: 12px 16px 14px 30px;
    margin: 0;
    font-family: "Noto Serif Malayalam", serif;
    font-size: 10px;
    line-height: 1.52;
    color: #334155;
  }
  .terms ol li {
    margin-bottom: 5px;
    padding-left: 2px;
  }
  .terms ol li::marker {
    font-weight: 700;
    color: #0e7490;
  }

  /* SIGNATURE */
  .signature {
    display: flex;
    justify-content: space-between;
    margin-top: 36px;
    gap: 24px;
  }
  .sign-box {
    width: 46%;
    text-align: center;
    font-size: 12.5px;
    font-weight: 600;
    color: #334155;
    font-family: "DM Sans", sans-serif;
  }
  .sign-area {
    min-height: 72px;
    border-bottom: 2px solid #334155;
    margin-top: 10px;
    margin-bottom: 8px;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    padding-bottom: 4px;
  }
  .sign-area img {
    max-height: 64px;
    max-width: 200px;
  }
  .sign-footer {
    font-size: 12px;
    color: #475569;
    line-height: 1.55;
    font-weight: 400;
  }
  .sign-footer strong { color: #0f172a; font-weight: 600; }
</style>
</head>
<body>
<div class="sheet">
  ${logoBase64
    ? `<div class="watermark" aria-hidden="true"><img src="${logoBase64}" alt="" /></div>`
    : ""}
  <div class="header">
    <div class="header-left">
      ${logoBase64
        ? `<img src="${logoBase64}" class="logo" alt="Kites Holidays"/>`
        : `<div class="logo-placeholder">K</div>`}
      <div>
        <div class="company-name">KITES HOLIDAYS</div>
        <div class="company-sub">Tours &amp; Packages</div>
      </div>
    </div>
    <div class="contact">
      Near ICICI Bank Velloor Kunnam<br>
      Signal Jn, Muvattupuzha<br>
      <strong>Mob:</strong> 9446328857<br>
      <strong>Mail:</strong> kitesholidaysklr@gmail.com
    </div>
  </div>

  <div class="container">

  <div class="title-row">
    <div class="title-no-col">
      <div class="title-no-inner">No: <span class="order-no-red">${orderNoDisplay}</span></div>
    </div>
    <div class="title-main">ORDER FORM</div>
    <div class="title-no-col title-no-col--spacer" aria-hidden="true">
      <div class="title-no-inner">No: <span class="order-no-red">${orderNoDisplay}</span></div>
    </div>
  </div>

  <div class="date">Date: ${formattedDate}</div>

  <div class="section">

    <div class="field">
      <strong>Name:</strong>
      <span class="field-value">${name || ""}</span>
    </div>

    <div class="field">
      <div class="field-split" style="flex:1; width:100%;">
        <div class="pair">
          <span class="lbl">Starting Date</span>
          <span class="val">${fmtDate(startDate)}</span>
        </div>
        <div class="pair">
          <span class="lbl">Time</span>
          <span class="val">${startTime || "—"}</span>
        </div>
      </div>
    </div>

    <div class="field">
      <div class="field-split" style="flex:1; width:100%;">
        <div class="pair">
          <span class="lbl">Arrival Date</span>
          <span class="val">${fmtDate(endDate)}</span>
        </div>
        <div class="pair">
          <span class="lbl">Time</span>
          <span class="val">${arrivalTime || "—"}</span>
        </div>
      </div>
    </div>

    <div class="field">
      <strong>From:</strong>
      <span class="field-value">${pickupLocation || ""}</span>
    </div>

    <div class="field">
      <strong>Destination:</strong>
      <span class="field-value">${destination || ""}</span>
    </div>

    <div class="field">
      <strong>No. of Passengers:</strong>
      <span class="field-value">${passengers !== undefined && passengers !== null ? passengers : ""}</span>
    </div>

    <div class="field">
      <strong>Contact Number:</strong>
      <span class="field-value">${phone || ""}</span>
    </div>

    <div class="field">
      <strong>Advance:</strong>
      <span class="field-value">${advancePayment ? `₹${Number(advancePayment).toLocaleString("en-IN")}` : ""}</span>
    </div>

    <div class="field">
      <strong>Vehicle No:</strong>
      <span class="field-value">${vehicleName || "—"}</span>
    </div>

    <div class="field">
      <strong>Contract Rate Rs:</strong>
      <span class="field-value">${packageRate ? `₹${Number(packageRate).toLocaleString("en-IN")}` : "—"}</span>
    </div>

  </div>

  <div class="terms">
    <div class="terms-banner">നിബന്ധനകൾ</div>
    <ol>
      <li>അഡ്വാൻസ് തുക, പരിപാടി ഏതെങ്കിലും കാരണവശാൽ റദ്ദാക്കിയാൽ മടക്കി നൽകുന്നതല്ല.</li>
      <li>യാത്രക്കാരുടെ സാധന സാമഗ്രികൾ അവരവരുടെ ചുമതലയിൽ സൂക്ഷിക്കേണ്ടതും, കളവ് പോകുകയോ നഷ്ടപ്പെടുകയോ ചെയ്താൽ ഡ്രൈവർക്കോ കമ്പനിക്കോ യാതൊരു ഉത്തരവാദിത്വവും ഉണ്ടായിരിക്കുന്നതല്ല.</li>
      <li>അപ്രതീക്ഷിതമായ സാഹചര്യങ്ങളിലോ മറ്റ് സാങ്കേതിക കാരണങ്ങളാലോ നേരിടുന്ന താമസത്തിനും കാലനഷ്ടത്തിനും കമ്പനിയോ ജോലിക്കാരോ ഉത്തരവാദികളാകുന്നതല്ല.</li>
      <li>അപ്രതീക്ഷിതമായി വണ്ടിക്ക് കേട് സംഭവിക്കുകയോ മറ്റ് അനിയന്ത്രിത സാഹചര്യങ്ങൾ ഉണ്ടായാൽ മറ്റൊരു വാഹനം അയയ്ക്കുന്നതിന് ഉറപ്പ് നൽകുന്നു.</li>
      <li>വാഹനത്തിനുള്ളിൽ ലഹരി പദാർത്ഥങ്ങൾ ഉപയോഗിക്കുന്നതും വണ്ടിയിൽ കൊണ്ടുപോകുന്നതും കർശനമായി നിരോധിച്ചിരിക്കുന്നു.</li>
      <li>യാത്രക്കാരുടെ അശ്രദ്ധമൂലമോ വീഴ്ചമൂലമോ വണ്ടിക്ക് സംഭവിക്കുന്ന കേടുപാടുകൾക്കും നഷ്ടങ്ങൾക്കും കോൺട്രാക്ടർ നഷ്ടപരിഹാരം നൽകേണ്ടതാണ്.</li>
      <li>കേരള സംസ്ഥാനത്തിന് പുറത്തുപോകുന്നതിന് സ്പെഷ്യൽ പെർമിറ്റ് പ്രകാരം അനുവദിച്ചിട്ടുള്ളവർ അല്ലാതെ മറ്റാരും യാത്ര ചെയ്യാൻ പാടുള്ളതല്ല.</li>
      <li>ബുക്ക് ചെയ്യുന്ന പാർട്ടി ഏതെങ്കിലും കാരണവശാൽ ട്രിപ്പ് റദ്ദ് ചെയ്താൽ കമ്പനിക്ക് മതിയായ നഷ്ടപരിഹാരം നൽകേണ്ടതാകുന്നു.</li>
      <li>വാഹനത്തിലെ ജീവനക്കാരുടെ ചിലവുകൾ ദിനംപ്രതി രൂപ ______ കോൺട്രാക്ടർ നൽകണം.</li>
    </ol>
  </div>

  <div class="signature">

    <div class="sign-box">
      Client Signature
      <div class="sign-area">
        ${signatureDataUrl ? `<img src="${signatureDataUrl}" alt="Client Signature"/>` : ""}
      </div>
      <div class="sign-footer">
        <strong>${name || ""}</strong> (${phone || ""})<br>
        ${address || ""}
      </div>
    </div>

    <div class="sign-box">
      Authorised Signatory — KITES HOLIDAYS
      <div class="sign-area">
        ${adminSignatureDataUrl ? `<img src="${adminSignatureDataUrl}" alt="Manager Signature"/>` : '<span style="color:#94a3b8;font-size:11px;font-weight:500;">Signature</span>'}
      </div>
      <div class="sign-footer">
        <strong>Manager</strong><br>
        Date: ${managerDateStr}
      </div>
    </div>

  </div>

  </div>
</div>
</body>
</html>`
}

module.exports = agreementTemplate
