import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';
import { sendEmail, waitlistConfirmationHtml } from '../../lib/email';

export const prerender = false;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const POST: APIRoute = async ({ request }) => {
  let body: { email?: string; source?: string } = {};
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  const email = (body.email ?? '').trim().toLowerCase();
  const source = (body.source ?? 'landing').trim().slice(0, 64);

  if (!email || !EMAIL_RE.test(email) || email.length > 254) {
    return json({ error: 'Please provide a valid email.' }, 400);
  }

  const { error: insertError } = await supabase
    .from('stillpoint_waitlist')
    .insert({ email, source });

  if (insertError) {
    // 23505 = unique_violation: treat as success so users don't see a scary error
    if ((insertError as { code?: string }).code === '23505') {
      return json({ ok: true, alreadyJoined: true });
    }
    console.error('[waitlist] insert error', insertError);
    return json({ error: 'Could not save your email. Please try again.' }, 500);
  }

  // Fire confirmation email; log but do not fail the request if email fails.
  const mail = await sendEmail({
    to: email,
    subject: 'Welcome to Stillpoint',
    html: waitlistConfirmationHtml(email),
    text: `You're on the Stillpoint waitlist. We'll be in touch when early access opens.`,
  });

  if (!mail.ok) {
    console.warn('[waitlist] email send failed', mail.error);
  }

  return json({ ok: true, emailSent: mail.ok });
};

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
