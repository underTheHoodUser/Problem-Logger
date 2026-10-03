import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { getSiteConfig } from '@/lib/getConfig';

const resend = new Resend(process.env.RESEND_API_KEY);

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const config = await getSiteConfig();
    const STRINGS = config.EMAILS;

    // 1. Verify Authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const token = authHeader.replace('Bearer ', '');
    
    const supabaseClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Approve Problem
    const { id } = await req.json();
    const { data: problem, error: updateError } = await supabaseAdmin
      .from('problems')
      .update({ is_approved: true })
      .eq('id', id)
      .select('content, level')
      .single();

    if (updateError) throw updateError;

    // 3. Fetch Verified Subscribers
    const { data: subscribers } = await supabaseAdmin
      .from('subscribers')
      .select('email')
      .eq('is_verified', true);
    
    if (subscribers && subscribers.length > 0 && process.env.RESEND_API_KEY) {
      // 4. Send Email via Resend
      const emails = subscribers.map(s => s.email);
      
      const emailResult = await resend.emails.send({
        from: STRINGS.FROM_EMAIL,
        to: emails,
        subject: `${STRINGS.APPROVE_SUBJECT_PREFIX}${problem.level.toUpperCase()}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; background: #0a0a0a; color: white;">
            <h1 style="color: #4ade80;">${STRINGS.APPROVE_TITLE}</h1>
            <p style="font-size: 18px; border-left: 4px solid #ec4899; padding-left: 10px;">
              "${problem.content}"
            </p>
            <p><strong>${STRINGS.APPROVE_THREAT_LABEL}</strong> ${problem.level.toUpperCase()}</p>
            <a href="https://chuddi.store" style="display: inline-block; background: #06b6d4; color: black; padding: 10px 20px; text-decoration: none; font-weight: bold; margin-top: 20px;">
              ${STRINGS.APPROVE_BTN}
            </a>
          </div>
        `
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Approve error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
