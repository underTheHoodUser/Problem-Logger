import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Sahi email dal bhai!' }, { status: 400 });
    }

    // Insert and get the verify_token back
    const { data, error } = await supabase
      .from('subscribers')
      .insert([{ email }])
      .select('verify_token')
      .single();
    
    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: 'Tu already subscribed hai bhai!' }, { status: 400 });
      }
      throw error;
    }

    if (process.env.RESEND_API_KEY && data) {
      const host = req.headers.get('host') || 'localhost:3000';
      const protocol = host.includes('localhost') ? 'http' : 'https';
      const baseUrl = `${protocol}://${host}`;
      const verifyLink = `${baseUrl}/api/verify-email?token=${data.verify_token}`;

      await resend.emails.send({
        from: 'alerts@chuddi.store',
        to: email,
        subject: 'Verify your Chuddi Alerts!',
        html: `
          <div style="font-family: sans-serif; padding: 20px; background: #0a0a0a; color: white;">
            <h1 style="color: #facc15;">Verify Your Email!</h1>
            <p style="font-size: 16px;">Bhai, ek last step baaki hai. Nayi problems ki notification chahiye toh neeche click kar:</p>
            <a href="${verifyLink}" style="display: inline-block; background: #ec4899; color: black; padding: 12px 24px; text-decoration: none; font-weight: bold; margin-top: 20px; border: 4px solid black; box-shadow: 4px 4px 0 0 black;">
              VERIFY MY EMAIL
            </a>
          </div>
        `
      });
    }

    return NextResponse.json({ success: true, message: "Email bheja hai, verify kar le!" });
  } catch (error: any) {
    console.error("Subscribe error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
