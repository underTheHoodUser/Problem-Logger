import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

const SubmitSchema = z.object({
  content: z.string().min(1).max(500),
  level: z.enum(['dhoom', 'chuddi', 'dhoom_chuddi']),
});

// We use the Service Role Key here because we need to bypass RLS to check IPs of UNAPPROVED problems too
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = SubmitSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 });
    }

    const { content, level } = parsed.data;
    
    // Get the client IP address (works on Vercel and most hosting providers)
    const forwardedFor = req.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0] : 'unknown';

    if (ip !== 'unknown') {
      // Calculate timestamp 10 minutes ago
      const tenMinsAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
      
      // Query if this IP submitted anything in the last 10 minutes
      const { data, error } = await supabase
        .from('problems')
        .select('id')
        .eq('ip_address', ip)
        .gte('created_at', tenMinsAgo)
        .limit(1);

      if (error) {
        console.error("Supabase Error:", error);
      }

      // If a record exists, block the submission
      if (data && data.length > 0) {
        return NextResponse.json(
          { error: 'Bhai thoda saans le le. 10 minute ruk ja agli chuddi submit karne se pehle!' }, 
          { status: 429 }
        );
      }
    }

    // Insert the new problem with the IP address
    const { error: insertError } = await supabase
      .from('problems')
      .insert([{ content, level, ip_address: ip }]);

    if (insertError) throw insertError;

    return NextResponse.json({ success: true });

  } catch (error: unknown) {
    console.error("Submit error:", error);
    return NextResponse.json({ error: (error instanceof Error ? error.message : String(error)) }, { status: 500 });
  }
}
