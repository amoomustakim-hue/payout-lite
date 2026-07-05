import "server-only";

type InvoiceEmailProps = {
  businessName: string;
  customerName: string;
  amount: string;
  description: string;
  dueDate: Date | null;
  paymentUrl: string;
  invoiceNumber: string;
};

export function buildInvoiceEmailHtml(props: InvoiceEmailProps): string {
  const { businessName, customerName, amount, description, dueDate, paymentUrl, invoiceNumber } = props;

  const dueDateStr = dueDate
    ? dueDate.toLocaleDateString("en-NG", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
    : null;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Invoice from ${businessName}</title>
</head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:'Segoe UI',Helvetica,Arial,sans-serif;color:#0f172a;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

          <!-- Header -->
          <tr>
            <td style="padding-bottom:24px;" align="center">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#2563eb;border-radius:12px;padding:10px 16px;" align="center">
                    <span style="color:#fff;font-size:14px;font-weight:900;letter-spacing:-0.5px;">PL</span>
                  </td>
                </tr>
              </table>
              <p style="margin:10px 0 0;font-size:13px;color:#64748b;">Payout Lite · Invoice</p>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background:#ffffff;border-radius:16px;border:1px solid #e2e8f0;overflow:hidden;">

              <!-- Blue top strip -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:linear-gradient(135deg,#2563eb,#4f46e5);padding:28px 32px;">
                    <p style="margin:0;font-size:12px;font-weight:700;color:#bfdbfe;letter-spacing:1px;text-transform:uppercase;">${invoiceNumber}</p>
                    <p style="margin:6px 0 0;font-size:32px;font-weight:900;color:#ffffff;letter-spacing:-1px;">${amount}</p>
                    <p style="margin:4px 0 0;font-size:14px;color:#bfdbfe;">from <strong style="color:#fff;">${businessName}</strong></p>
                  </td>
                </tr>
              </table>

              <!-- Body -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:28px 32px;">
                    <p style="margin:0 0 20px;font-size:16px;color:#0f172a;">
                      Hi <strong>${customerName}</strong>,
                    </p>
                    <p style="margin:0 0 24px;font-size:15px;color:#475569;line-height:1.6;">
                      You have a new invoice waiting for payment. Here are the details:
                    </p>

                    <!-- Details table -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:10px;overflow:hidden;margin-bottom:28px;">
                      <tr>
                        <td style="padding:14px 18px;border-bottom:1px solid #e2e8f0;">
                          <p style="margin:0;font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.5px;">Description</p>
                          <p style="margin:4px 0 0;font-size:14px;color:#0f172a;font-weight:500;">${description}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:14px 18px;border-bottom:1px solid #e2e8f0;">
                          <p style="margin:0;font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.5px;">Amount Due</p>
                          <p style="margin:4px 0 0;font-size:14px;color:#0f172a;font-weight:700;">${amount}</p>
                        </td>
                      </tr>
                      ${dueDateStr ? `
                      <tr>
                        <td style="padding:14px 18px;">
                          <p style="margin:0;font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.5px;">Due Date</p>
                          <p style="margin:4px 0 0;font-size:14px;color:#dc2626;font-weight:600;">${dueDateStr}</p>
                        </td>
                      </tr>` : `
                      <tr>
                        <td style="padding:14px 18px;">
                          <p style="margin:0;font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.5px;">Due Date</p>
                          <p style="margin:4px 0 0;font-size:14px;color:#64748b;">No due date</p>
                        </td>
                      </tr>`}
                    </table>

                    <!-- CTA -->
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center">
                          <a href="${paymentUrl}" style="display:inline-block;background:#2563eb;color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;border-radius:10px;padding:14px 40px;letter-spacing:-0.3px;">
                            Pay Now →
                          </a>
                        </td>
                      </tr>
                    </table>

                    <p style="margin:24px 0 0;font-size:12px;color:#94a3b8;text-align:center;line-height:1.6;">
                      Or copy this link into your browser:<br />
                      <a href="${paymentUrl}" style="color:#2563eb;word-break:break-all;">${paymentUrl}</a>
                    </p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 0;" align="center">
              <p style="margin:0;font-size:12px;color:#94a3b8;">
                Payments secured by <strong>Nomba</strong> · Powered by <strong>Payout Lite</strong>
              </p>
              <p style="margin:4px 0 0;font-size:11px;color:#cbd5e1;">
                This email was sent because ${businessName} created an invoice addressed to you.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function buildInvoiceEmailText(props: InvoiceEmailProps): string {
  const { businessName, customerName, amount, description, dueDate, paymentUrl, invoiceNumber } = props;
  const dueDateStr = dueDate
    ? dueDate.toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" })
    : "No due date";

  return `Hi ${customerName},

${businessName} has sent you an invoice (${invoiceNumber}).

Amount due: ${amount}
For: ${description}
Due: ${dueDateStr}

Pay here: ${paymentUrl}

Payments secured by Nomba · Powered by Payout Lite`;
}
