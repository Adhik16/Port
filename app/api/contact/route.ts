import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// ── Rate Limiter (in-memory, per-IP) ──────────────────────────────────────────
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = Number(process.env.RATE_LIMIT_MAX || 5);
const RATE_LIMIT_WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS || 900_000);

function getClientIp(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'unknown';
}

function checkRateLimit(ip: string): { allowed: boolean; retryAfter: number } {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap) {
    if (now > entry.resetAt) rateLimitMap.delete(key);
  }
  const entry = rateLimitMap.get(ip);
  if (!entry) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, retryAfter: 0 };
  }
  if (now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, retryAfter: 0 };
  }
  if (entry.count >= RATE_LIMIT_MAX) {
    return { allowed: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
  }
  entry.count++;
  return { allowed: true, retryAfter: 0 };
}

// ── Validation ────────────────────────────────────────────────────────────────
function validateField(value: unknown, name: string, minLen: number): string | null {
  if (typeof value !== 'string') return `${name} is required`;
  const trimmed = value.trim();
  if (trimmed.length < minLen) return `${name} must be at least ${minLen} characters`;
  return null;
}

function validateEmail(value: unknown): string | null {
  if (typeof value !== 'string') return 'Email is required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) return 'Please enter a valid email';
  return null;
}

const MAX_FIELD_LENGTH = 2000;

function sanitize(str: unknown): string {
  if (typeof str !== 'string') return '';
  return str
    .replace(/<[^>]*>/g, '')    // Strip HTML tags
    .replace(/&/g, '&amp;')     // Encode & first (order matters)
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim()
    .slice(0, MAX_FIELD_LENGTH);
}

// ── Turnstile Verification ────────────────────────────────────────────────────
async function verifyTurnstile(token: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    console.error('Turnstile secret key not configured');
    return false;
  }
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret,
        response: token,
      }),
    });
    const data = await res.json();
    return data.success === true;
  } catch {
    return false;
  }
}

// ── Email Sending (Resend) ────────────────────────────────────────────────────
async function sendEmail(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error('Resend: No API key configured');
      return { success: false, error: 'Email service not configured.' };
    }
    const resend = new Resend(apiKey);
    // Strip newlines from fromAddress to prevent SMTP header injection
    const fromAddress = (process.env.RESEND_FROM || 'onboarding@resend.dev').replace(/[\r\n]/g, '');
    const { error } = await resend.emails.send({
      from: `Portfolio Contact <${fromAddress}>`,
      to: process.env.RESEND_TO || 'adhikshakya16@gmail.com',
      replyTo: data.email,
      subject: `[Portfolio] ${data.subject}`,
      text: [
        `Name: ${data.name}`,
        `Email: ${data.email}`,
        ``,
        `Message:`,
        `${data.message}`,
      ].join('\n'),
    });
    if (error) {
      console.error('Resend send failed:', error.name);
      return { success: false, error: 'Email service unavailable. Please try again later.' };
    }
    console.log('Contact email delivered OK');
    return { success: true };
  } catch {
    console.error('Resend send threw an exception');
    return { success: false, error: 'Email service error.' };
  }
}

// ── POST Handler ──────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);

    // 1. Rate limit
    const rateLimit = checkRateLimit(ip);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: `Too many messages. Please try again in ${Math.ceil(rateLimit.retryAfter / 60)} minutes.` },
        {
          status: 429,
          headers: { 'Retry-After': String(rateLimit.retryAfter) },
        },
      );
    }

    // 1b. Body size guard — reject payloads > 64 KB (contact form shouldn't need more)
    const contentLength = Number(request.headers.get('content-length') || 0);
    if (contentLength > 65_536) {
      return NextResponse.json(
        { success: false, error: 'Payload too large.' },
        { status: 413 },
      );
    }

    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid request format.' },
        { status: 400 },
      );
    }

    // 2. Honeypot — silently reject bots (return fake success)
    if (body.website && typeof body.website === 'string' && body.website.trim().length > 0) {
      console.log('Bot detected — IP:', ip);
      return NextResponse.json({ success: true });
    }

    // 2b. Reject if body is not a plain object (prototype pollution guard)
    if (typeof body !== 'object' || body === null || Array.isArray(body)) {
      return NextResponse.json(
        { success: false, error: 'Invalid request body.' },
        { status: 400 },
      );
    }

    // 3. Turnstile verification
    // Skipped when: (dev mode + bypass token), OR Turnstile not configured at all.
    const isDev = process.env.NODE_ENV === "development";
    const hasBypassToken = body.turnstileToken === "dev-bypass-localhost";
    const turnstileNotConfigured = !process.env.TURNSTILE_SECRET_KEY;
    const skipTurnstile = (isDev && hasBypassToken) || turnstileNotConfigured;

    if (!skipTurnstile) {
      if (!body.turnstileToken || typeof body.turnstileToken !== "string") {
        return NextResponse.json(
          { success: false, error: "Security verification required." },
          { status: 400 },
        );
      }
      const turnstileOk = await verifyTurnstile(body.turnstileToken);
      if (!turnstileOk) {
        return NextResponse.json(
          { success: false, error: "Security verification failed. Please try again." },
          { status: 400 },
        );
      }
    }

    // 4. Server-side validation
    const nameErr = validateField(body.name, 'Name', 2);
    const emailErr = validateEmail(body.email);
    const subjectErr = validateField(body.subject, 'Subject', 3);
    const messageErr = validateField(body.message, 'Message', 10);

    if (nameErr || emailErr || subjectErr || messageErr) {
      return NextResponse.json(
        {
          success: false,
          errors: {
            ...(nameErr && { name: nameErr }),
            ...(emailErr && { email: emailErr }),
            ...(subjectErr && { subject: subjectErr }),
            ...(messageErr && { message: messageErr }),
          },
        },
        { status: 400 },
      );
    }

    // 5. Sanitize
    const cleanData = {
      name: sanitize(body.name),
      email: sanitize(body.email),
      subject: sanitize(body.subject),
      message: sanitize(body.message),
    };

    // 6. Send email
    const emailResult = await sendEmail(cleanData);
    if (!emailResult.success) {
      console.error('Contact email delivery failed');
      return NextResponse.json(
        { success: false, error: 'Failed to send message. Please try again later.' },
        { status: 500 },
      );
    }

    // Audit trail — redacted, no PII
    const redacted = cleanData.email.split("@")[0]?.slice(0, 2) ?? "**";
    console.log(`Contact email OK — sender: ${redacted}**@...`);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred.' },
      { status: 500 },
    );
  }
}