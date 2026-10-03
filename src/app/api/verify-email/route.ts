import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getSiteConfig } from '@/lib/getConfig';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: Request) {
  try {
    const config = await getSiteConfig();
    const STRINGS = config.EMAILS;

    const url = new URL(req.url);
    const token = url.searchParams.get('token');
    
    if (!token) {
      return NextResponse.json({ error: STRINGS.VERIFY_ERR_MISSING }, { status: 400 });
    }

    const { error } = await supabase
      .from('subscribers')
      .update({ is_verified: true })
      .eq('verify_token', token);

    if (error) {
      return NextResponse.json({ error: STRINGS.VERIFY_ERR_INVALID }, { status: 400 });
    }

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${STRINGS.VERIFY_SUCCESS_TITLE}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Rubik+Dirt&display=swap');
            body { background-color: #0a0a0a; color: white; font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
            .card { background: #111; border: 4px solid #4ade80; box-shadow: 8px 8px 0 0 #4ade80; border-radius: 20px; padding: 40px; text-align: center; max-width: 400px; }
            h1 { font-family: 'Rubik Dirt', cursive; color: #4ade80; font-size: 3rem; margin: 0 0 10px 0; text-transform: uppercase; }
            a { display: inline-block; background: #22c55e; color: black; font-weight: 900; text-decoration: none; padding: 15px 30px; border: 4px solid black; box-shadow: 4px 4px 0 0 black; margin-top: 30px; text-transform: uppercase; letter-spacing: 2px; }
            a:active { transform: scale(0.95); }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>${STRINGS.VERIFY_SUCCESS_TITLE}</h1>
            <p>${STRINGS.VERIFY_SUCCESS_BODY}</p>
            <a href="/">${STRINGS.VERIFY_SUCCESS_BTN}</a>
          </div>
        </body>
      </html>
    `;

    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html' }
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
