const approvalEmail = ({ name, trackingId, downloadUrl, destination, startDate }) => ({
  subject: `✅ Tour Agreement Approved — ${trackingId}`,
  html: `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"/></head>
<body style="font-family:'Segoe UI',Arial,sans-serif;background:#f8fafc;margin:0;padding:40px;">
  <div style="max-width:600px;margin:auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
    <div style="background:linear-gradient(135deg,#0f4c75,#1b6ca8);padding:32px;text-align:center;">
      <h1 style="color:#fff;margin:0;font-size:24px;">🎉 Agreement Approved!</h1>
      <p style="color:#bae6fd;margin:8px 0 0;">Your tour agreement has been approved</p>
    </div>
    <div style="padding:32px;">
      <p style="color:#374151;font-size:16px;">Dear <strong>${name}</strong>,</p>
      <p style="color:#6b7280;margin:16px 0;">Your tour agreement for <strong>${destination}</strong> starting <strong>${new Date(startDate).toLocaleDateString("en-IN", { dateStyle: "long" })}</strong> has been approved.</p>
      <div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:8px;padding:16px;margin:20px 0;">
        <p style="margin:0;font-size:13px;color:#0369a1;">Tracking ID</p>
        <p style="margin:4px 0 0;font-size:20px;font-weight:700;color:#0f4c75;">${trackingId}</p>
      </div>
      ${downloadUrl ? `
      <div style="text-align:center;margin:28px 0;">
        <a href="${downloadUrl}" style="background:#0f4c75;color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px;">📄 Download Agreement PDF</a>
      </div>
      ` : ""}
      <p style="color:#9ca3af;font-size:13px;margin-top:32px;border-top:1px solid #e5e7eb;padding-top:16px;">You can also track your agreement anytime using your tracking ID at our website.</p>
    </div>
  </div>
</body>
</html>`,
})

const rejectionEmail = ({ name, trackingId, destination }) => ({
  subject: `Tour Agreement Update — ${trackingId}`,
  html: `
<!DOCTYPE html>
<html>
<body style="font-family:'Segoe UI',Arial,sans-serif;background:#f8fafc;margin:0;padding:40px;">
  <div style="max-width:600px;margin:auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
    <div style="background:linear-gradient(135deg,#7f1d1d,#991b1b);padding:32px;text-align:center;">
      <h1 style="color:#fff;margin:0;font-size:24px;">Agreement Status Update</h1>
    </div>
    <div style="padding:32px;">
      <p>Dear <strong>${name}</strong>,</p>
      <p style="color:#6b7280;margin:16px 0;">We regret to inform you that your agreement request for <strong>${destination}</strong> (Tracking ID: <strong>${trackingId}</strong>) could not be approved at this time. Please contact us for more information.</p>
    </div>
  </div>
</body>
</html>`,
})

module.exports = { approvalEmail, rejectionEmail }
