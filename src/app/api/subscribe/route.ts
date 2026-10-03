import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { getSiteConfig } from '@/lib/getConfig';

const resend = new Resend(process.env.RESEND_API_KEY);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const config = await getSiteConfig();
    const STRINGS = config.EMAILS;

    const { email } = await req.json();
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: STRINGS.SUBSCRIBE_ERR_INVALID }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('subscribers')
      .insert([{ email }])
      .select('verify_token')
      .single();
    
    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: STRINGS.SUBSCRIBE_ERR_EXISTS }, { status: 400 });
      }
      throw error;
    }

    if (process.env.RESEND_API_KEY && data) {
      const host = req.headers.get('host') || 'localhost:3000';
      const protocol = host.includes('localhost') ? 'http' : 'https';
      const baseUrl = `${protocol}://${host}`;
      const verifyLink = `${baseUrl}/api/verify-email?token=${data.verify_token}`;

      await resend.emails.send({
        from: STRINGS.FROM_EMAIL,
        to: email,
        subject: STRINGS.SUBSCRIBE_SUBJECT,
        html: `
          <div style="font-family: sans-serif; padding: 20px; background: #0a0a0a; color: white;">
            <h1 style="color: #facc15;">${STRINGS.SUBSCRIBE_TITLE}</h1>
            <p style="font-size: 16px;">${STRINGS.SUBSCRIBE_BODY}</p>
            <a href="${verifyLink}" style="display: inline-block; background: #ec4899; color: black; padding: 12px 24px; text-decoration: none; font-weight: bold; margin-top: 20px; border: 4px solid black; box-shadow: 4px 4px 0 0 black;">
              ${STRINGS.SUBSCRIBE_BTN}
            </a>
          </div>
        `
      });
    }

    return NextResponse.json({ success: true, message: STRINGS.SUBSCRIBE_SUCCESS });
  } catch (error: any) {
    console.error("Subscribe error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
