import nodemailer from 'nodemailer'

let transporter = null
let warnedMailerDisabled = false

if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
  })
}

function mailDisabledResult() {
  if (!warnedMailerDisabled) {
    console.warn('Email notifications are disabled. Set SMTP_HOST, SMTP_USER, SMTP_PASS and ADMIN_NOTIFY_EMAIL to enable them.')
    warnedMailerDisabled = true
  }
  return { skipped: true, reason: 'SMTP not configured' }
}

export async function notifyAdmins(subject, text) {
  if (!transporter || !process.env.ADMIN_NOTIFY_EMAIL) return mailDisabledResult()
  await transporter.sendMail({ from: process.env.MAIL_FROM || process.env.SMTP_USER, to: process.env.ADMIN_NOTIFY_EMAIL, subject, text })
  return { sent: true }
}

export async function sendDonorReceipt(donation) {
  if (!transporter) return mailDisabledResult()
  if (!donation?.donor_email) return { skipped: true, reason: 'No donor email' }
  const amount = `${donation.currency || 'ZMW'} ${donation.amount}`
  const subject = 'Giving confirmation receipt'
  const text = `Thank you for supporting the ministry.\n\nAmount: ${amount}\nPurpose: ${donation.purpose || 'General giving'}\nPayment method: ${donation.payment_provider || 'manual'}\nReference: ${donation.transaction_reference || donation.id}\nStatus: ${donation.status}\n\nThis receipt was generated after admin verification.`
  await transporter.sendMail({ from: process.env.MAIL_FROM || process.env.SMTP_USER, to: donation.donor_email, subject, text })
  return { sent: true }
}
