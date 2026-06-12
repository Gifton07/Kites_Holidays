const transporter = require("../config/mailer")
const { approvalEmail, rejectionEmail } = require("../templates/emailTemplates")

const sendApprovalEmail = async ({ to, name, trackingId, downloadUrl, destination, startDate }) => {
  const { subject, html } = approvalEmail({ name, trackingId, downloadUrl, destination, startDate })
  await transporter.sendMail({ from: `"Tour System" <${process.env.MAIL_USER}>`, to, subject, html })
}

const sendRejectionEmail = async ({ to, name, trackingId, destination }) => {
  const { subject, html } = rejectionEmail({ name, trackingId, destination })
  await transporter.sendMail({ from: `"Tour System" <${process.env.MAIL_USER}>`, to, subject, html })
}

module.exports = { sendApprovalEmail, sendRejectionEmail }
