import { NextRequest, NextResponse } from 'next/server';

const CONTACT_SCHEMA = {
  name: (v: string) => v.length >= 2,
  email: (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
  subject: (v: string) => v.length >= 3,
  message: (v: string) => v.length >= 10,
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Server-side validation (DUPLICATE the client validation)
    const errors: Record<string, string> = {};
    if (!CONTACT_SCHEMA.name(name)) errors.name = 'Name is required (min 2 chars)';
    if (!CONTACT_SCHEMA.email(email)) errors.email = 'Valid email required';
    if (!CONTACT_SCHEMA.subject(subject)) errors.subject = 'Subject required (min 3 chars)';
    if (!CONTACT_SCHEMA.message(message)) errors.message = 'Message required (min 10 chars)';

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ success: false, errors }, { status: 400 });
    }

    // Sanitize inputs (strip HTML/malicious content)
    const sanitize = (str: string) => str.replace(/<[^>]*>/g, '').trim();
    const cleanData = {
      name: sanitize(name),
      email: sanitize(email),
      subject: sanitize(subject),
      message: sanitize(message),
    };

    // Send email via a service (e.g., Resend, Nodemailer, EmailJS)
    // await sendEmail(cleanData);

    console.log('Contact form received:', cleanData);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 });
  }
}