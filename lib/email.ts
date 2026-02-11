import nodemailer from "nodemailer"

const getTransporter = () => {
  const host = process.env.SMTP_HOST ?? "smtp.gmail.com"
  const port = Number(process.env.SMTP_PORT ?? "465")
  const secure = String(process.env.SMTP_SECURE ?? "true") !== "false"
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

  if (!user || !pass) {
    throw new Error("SMTP credentials are missing")
  }

  return nodemailer.createTransport({ host, port, secure, auth: { user, pass } })
}

export const sendSignupOtpEmail = async (toEmail: string, otpCode: string) => {
  const transporter = getTransporter()
  const from = process.env.OTP_FROM ?? process.env.SMTP_USER

  const html = `
    <div style="margin:0;padding:0;background:#f5f7fb;font-family:Segoe UI,Arial,sans-serif;color:#0f172a;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:32px 12px;">
        <tr>
          <td align="center">
            <table role="presentation" width="560" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border:1px solid #e5e7eb;border-radius:14px;overflow:hidden;">
              <tr>
                <td style="padding:22px 24px;background:#0b1220;color:#ffffff;font-size:18px;font-weight:600;">
                  Yuthasas Account Verification
                </td>
              </tr>
              <tr>
                <td style="padding:24px;font-size:14px;line-height:1.7;color:#1f2937;">
                  <p style="margin:0 0 12px 0;">Hello,</p>
                  <p style="margin:0 0 14px 0;">Use the verification code below to complete your signup.</p>
                  <div style="margin:16px 0;padding:14px 18px;border:1px solid #e5e7eb;background:#f9fafb;border-radius:10px;display:inline-block;font-size:28px;letter-spacing:8px;font-weight:700;color:#0f172a;">
                    ${otpCode}
                  </div>
                  <p style="margin:14px 0 0 0;">This code expires in <strong>10 minutes</strong>.</p>
                  <p style="margin:14px 0 0 0;">If you did not request this, you can safely ignore this email.</p>
                </td>
              </tr>
              <tr>
                <td style="padding:14px 24px;border-top:1px solid #e5e7eb;color:#6b7280;font-size:12px;">
                  This is an automated message from Yuthasas.
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  `

  await transporter.sendMail({
    from,
    to: toEmail,
    subject: "Your Yuthasas verification code",
    text: `Your verification code is ${otpCode}. It expires in 10 minutes.`,
    html,
  })
}

export const sendDeleteOtpEmail = async (toEmail: string, otpCode: string) => {
  const transporter = getTransporter()
  const from = process.env.OTP_FROM ?? process.env.SMTP_USER

  const html = `
    <div style="margin:0;padding:0;background:#f5f7fb;font-family:Segoe UI,Arial,sans-serif;color:#0f172a;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:32px 12px;">
        <tr>
          <td align="center">
            <table role="presentation" width="560" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border:1px solid #e5e7eb;border-radius:14px;overflow:hidden;">
              <tr>
                <td style="padding:22px 24px;background:#7f1d1d;color:#ffffff;font-size:18px;font-weight:600;">
                  Yuthasas Account Deletion Confirmation
                </td>
              </tr>
              <tr>
                <td style="padding:24px;font-size:14px;line-height:1.7;color:#1f2937;">
                  <p style="margin:0 0 12px 0;">A request was received to remove this account.</p>
                  <p style="margin:0 0 14px 0;">Use the code below to confirm deletion:</p>
                  <div style="margin:16px 0;padding:14px 18px;border:1px solid #e5e7eb;background:#f9fafb;border-radius:10px;display:inline-block;font-size:28px;letter-spacing:8px;font-weight:700;color:#0f172a;">
                    ${otpCode}
                  </div>
                  <p style="margin:14px 0 0 0;">This code expires in <strong>10 minutes</strong>.</p>
                </td>
              </tr>
              <tr>
                <td style="padding:14px 24px;border-top:1px solid #e5e7eb;color:#6b7280;font-size:12px;">
                  Ignore this email if you did not request account deletion.
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  `

  await transporter.sendMail({
    from,
    to: toEmail,
    subject: "Yuthasas account deletion code",
    text: `Your account deletion code is ${otpCode}. It expires in 10 minutes.`,
    html,
  })
}
