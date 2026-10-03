import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const PostCommentSchema = z.object({
  problem_id: z.string().uuid(),
  content: z.string().min(1).max(200),
  author_name: z.string().min(1)
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const problem_id = searchParams.get('problem_id');

    if (!problem_id) return NextResponse.json({ error: "Missing problem_id" }, { status: 400 });

    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('problem_id', problem_id)
      .order('created_at', { ascending: true });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("GET comments error:", error);
    return NextResponse.json({ error: (error instanceof Error ? error.message : String(error)) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = PostCommentSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid format" }, { status: 400 });
    }

    const { problem_id, content, author_name } = parsed.data;

    const { error } = await supabase
      .from('comments')
      .insert([{ problem_id, content, author_name }]);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("POST comment error:", error);
    return NextResponse.json({ error: (error instanceof Error ? error.message : String(error)) }, { status: 500 });
  }
}
