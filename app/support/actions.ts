"use server";

import { getResendClient } from "@/lib/resend";

export type SupportResult = { success: boolean; error?: string };

export async function sendSupportMessageAction(
  _prev: SupportResult,
  formData: FormData,
): Promise<SupportResult> {
  const name = (formData.get("name") as string | null)?.trim() ?? "";
  const email = (formData.get("email") as string | null)?.trim() ?? "";
  const subject = (formData.get("subject") as string | null)?.trim() ?? "";
  const message = (formData.get("message") as string | null)?.trim() ?? "";

  if (!name || !email || !subject || !message) {
    return { success: false, error: "All fields are required." };
  }

  const resend = getResendClient();
  if (!resend) {
    return { success: false, error: "Email service is not configured. Please try again later." };
  }

  try {
    await resend.emails.send({
      from: "Payout Lite Support <invoices@payoutlite.app>",
      to: ["twizrrapp@gmail.com"],
      replyTo: email,
      subject: `[Payout Lite Support] ${subject}`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#0B1736">
          <div style="background:#256BFF;padding:24px 32px;border-radius:12px 12px 0 0">
            <h2 style="color:#fff;margin:0;font-size:18px">New Support Request</h2>
            <p style="color:rgba(255,255,255,.8);margin:4px 0 0;font-size:13px">via Payout Lite</p>
          </div>
          <div style="background:#F4F8FF;padding:24px 32px;border-radius:0 0 12px 12px;border:1px solid #DCE6F5;border-top:none">
            <table style="width:100%;border-collapse:collapse;font-size:14px">
              <tr><td style="padding:8px 0;color:#5C6B85;width:90px">From</td><td style="padding:8px 0;font-weight:600">${name}</td></tr>
              <tr><td style="padding:8px 0;color:#5C6B85">Email</td><td style="padding:8px 0"><a href="mailto:${email}" style="color:#256BFF">${email}</a></td></tr>
              <tr><td style="padding:8px 0;color:#5C6B85">Subject</td><td style="padding:8px 0;font-weight:600">${subject}</td></tr>
            </table>
            <div style="margin-top:16px;border-top:1px solid #DCE6F5;padding-top:16px">
              <p style="margin:0 0 8px;color:#5C6B85;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:.05em">Message</p>
              <p style="margin:0;font-size:15px;line-height:1.7;white-space:pre-wrap">${message}</p>
            </div>
            <div style="margin-top:20px;padding:12px 16px;background:#fff;border-radius:8px;border:1px solid #DCE6F5;font-size:12px;color:#5C6B85">
              Reply directly to this email to respond to ${name}.
            </div>
          </div>
        </div>
      `,
      text: `New Support Request\n\nFrom: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`,
    });
    return { success: true };
  } catch (err) {
    console.error("Support email failed:", err);
    return { success: false, error: "Failed to send your message. Please try again." };
  }
}
