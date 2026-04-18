/**
 * Resend helper. Uses REST API directly so we avoid SDK weight.
 */
const RESEND_API_KEY = import.meta.env.RESEND_API_KEY;
const FROM = 'Stillpoint <onboarding@resend.dev>';

export type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

export async function sendEmail(input: SendEmailInput): Promise<{ ok: boolean; id?: string; error?: string }> {
  if (!RESEND_API_KEY) {
    return { ok: false, error: 'RESEND_API_KEY not configured' };
  }
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM,
        to: input.to,
        subject: input.subject,
        html: input.html,
        text: input.text,
      }),
    });
    const data = (await res.json().catch(() => ({}))) as { id?: string; message?: string };
    if (!res.ok) {
      return { ok: false, error: data.message ?? `Resend HTTP ${res.status}` };
    }
    return { ok: true, id: data.id };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

export function waitlistConfirmationHtml(email: string): string {
  return `<!doctype html>
<html>
  <body style="margin:0;background:#FAF7F2;font-family:'Inter',Helvetica,Arial,sans-serif;color:#2C1A57;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAF7F2;padding:40px 16px;">
      <tr>
        <td align="center">
          <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#FDFBF7;border-radius:24px;padding:40px;border:1px solid #E8DFCE;">
            <tr>
              <td style="padding-bottom:24px;">
                <div style="font-family:'Cormorant Garamond',Georgia,serif;font-size:28px;font-weight:500;color:#6B46C1;letter-spacing:-0.5px;">Stillpoint</div>
              </td>
            </tr>
            <tr>
              <td style="padding-bottom:16px;">
                <h1 style="margin:0;font-family:'Cormorant Garamond',Georgia,serif;font-size:34px;line-height:1.15;font-weight:500;color:#2C1A57;">You're on the list.</h1>
              </td>
            </tr>
            <tr>
              <td style="font-size:16px;line-height:1.6;color:#3D2A6B;">
                <p>Thanks for joining the Stillpoint waitlist. We're building a quieter place to meditate &mdash; short guided sessions, breath timers, and sleep stories, without the noise.</p>
                <p>We'll drop you a note when early access opens. You'll be among the first.</p>
                <p style="margin-top:24px;">In the meantime, here's a one-minute practice you can do right now:</p>
                <ol style="padding-left:20px;">
                  <li>Sit comfortably. Close your eyes.</li>
                  <li>Breathe in for four. Hold for four. Out for six.</li>
                  <li>Repeat six times. Notice the stillpoint between each breath.</li>
                </ol>
                <p>See you soon,<br/>The Stillpoint team</p>
              </td>
            </tr>
            <tr>
              <td style="padding-top:32px;border-top:1px solid #E8DFCE;margin-top:32px;font-size:12px;color:#6B46C1;">
                You're receiving this because you joined the waitlist with ${email}.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
